import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Function to calculate CRC16 for PIX payload
function crc16(payload: string): string {
  let crc = 0xFFFF;
  const polynomial = 0x1021;

  for (let i = 0; i < payload.length; i++) {
    const byte = payload.charCodeAt(i);
    crc ^= (byte << 8);
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = (crc << 1) ^ polynomial;
      } else {
        crc <<= 1;
      }
    }
  }

  return (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
}


/**
 * Generates a static PIX QR Code payload (BRCODE) based on provided specifications.
 * @param amount The transaction amount.
 * @param txid The transaction ID, should be short and simple for static codes.
 * @returns The BRCODE string ready to be converted to a QR Code.
 */
export function generatePixPayload({
    amount,
    txid
}: {
    amount: number;
    txid: string;
}): string {
    const key = '+5551999799582';
    const merchantName = 'GEANDERSON SCHUH'; // Reduzido para evitar truncamento
    const city = 'VENANCIO AIRES';      // 15 chars max
    
    const f = (id: string, value: string) => {
        const len = value.length.toString().padStart(2, '0');
        return `${id}${len}${value}`;
    };

    const payloadParts = [
        f('00', '01'), // Payload Format Indicator
        f('01', '11'), // Point of Initiation Method: 11 (Static) - Ajuda no Banrisul
        f('26', [
            f('00', 'br.gov.bcb.pix'),
            f('01', key)
        ].join('')),
        f('52', '0000'), // Merchant Category Code
        f('53', '986'), // Transaction Currency (986 = BRL)
        f('54', amount.toFixed(2)),
        f('58', 'BR'), // Country Code
        f('59', merchantName),
        f('60', city),
        f('62', f('05', txid)),
    ];

    const payloadWithoutCrc = payloadParts.join('');
    const finalPayload = `${payloadWithoutCrc}6304`;
    const crc = crc16(finalPayload);

    return `${finalPayload}${crc}`;
};

/**
 * Resizes and compresses an image file to a maximum dimension of 1024px
 * and converts it to a standard JPEG DataURL with 0.8 quality.
 * Prevents AWS Bedrock payload size errors (max 3.75MB) and HEIC/HEIF decoding errors.
 */
export function resizeAndCompressImage(file: File): Promise<string> {
  if (typeof window === 'undefined') {
    return Promise.resolve("");
  }
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDimension = 1024;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Não foi possível obter o contexto 2D do canvas'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        
        // Export as JPEG with 0.8 quality (very efficient compression)
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error('Falha ao carregar a imagem para redimensionamento.'));
      img.src = event.target?.result as string;
    };
    reader.onerror = () => reject(reader.error || new Error('Falha ao ler o arquivo.'));
    reader.readAsDataURL(file);
  });
}

/**
 * Extracts 4 key frames from a video file and combines them into a 2x2 grid collage image.
 * Returns both the base64 JPEG data URL and the duration of the video.
 */
export function extractVideoFramesGrid(file: File): Promise<{ dataUrl: string; duration: number }> {
  if (typeof window === 'undefined') {
    return Promise.resolve({ dataUrl: "", duration: 0 });
  }
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.muted = true;
    video.playsInline = true;
    
    const objectUrl = URL.createObjectURL(file);
    video.src = objectUrl;

    video.onloadedmetadata = async () => {
      try {
        const duration = video.duration;
        if (!duration || duration === Infinity) {
          reject(new Error('Não foi possível determinar a duração do vídeo.'));
          return;
        }

        // We select 4 evenly spaced timestamps: 10%, 40%, 70% and 90% of duration
        const times = [
          duration * 0.1,
          duration * 0.4,
          duration * 0.7,
          duration * 0.9
        ];
        
        const frames: HTMLCanvasElement[] = [];
        
        for (const t of times) {
          await new Promise<void>((resolveSeek) => {
            const onSeeked = () => {
              video.removeEventListener('seeked', onSeeked);
              
              const frameCanvas = document.createElement('canvas');
              frameCanvas.width = 512;
              frameCanvas.height = 512;
              const fCtx = frameCanvas.getContext('2d');
              if (fCtx) {
                fCtx.drawImage(video, 0, 0, 512, 512);
              }
              frames.push(frameCanvas);
              resolveSeek();
            };
            video.addEventListener('seeked', onSeeked);
            video.currentTime = t;
          });
        }
        
        URL.revokeObjectURL(objectUrl);
        video.src = '';
        
        const gridCanvas = document.createElement('canvas');
        gridCanvas.width = 1024;
        gridCanvas.height = 1024;
        const gCtx = gridCanvas.getContext('2d');
        if (!gCtx) {
          reject(new Error('Não foi possível obter o contexto 2D do canvas de grade'));
          return;
        }
        
        if (frames[0]) gCtx.drawImage(frames[0], 0, 0);
        if (frames[1]) gCtx.drawImage(frames[1], 512, 0);
        if (frames[2]) gCtx.drawImage(frames[2], 0, 512);
        if (frames[3]) gCtx.drawImage(frames[3], 512, 512);
        
        const dataUrl = gridCanvas.toDataURL('image/jpeg', 0.8);
        resolve({ dataUrl, duration });
      } catch (err) {
        URL.revokeObjectURL(objectUrl);
        reject(err);
      }
    };
    
    video.onerror = (err) => {
      URL.revokeObjectURL(objectUrl);
      reject(err || new Error('Erro ao carregar o arquivo de vídeo.'));
    };
  });
}


