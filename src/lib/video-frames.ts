/**
 * Extracts key frames from a video file using browser Canvas API.
 * Returns an array of base64 JPEG strings (no data: prefix).
 */
export async function extractVideoFrames(
  base64Video: string,
  mimeType: string,
  numFrames: number = 4
): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'auto';
    video.muted = true;
    video.src = base64Video; // base64 with data: prefix
    video.crossOrigin = 'anonymous';

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const frames: string[] = [];

    video.onloadedmetadata = async () => {
      const duration = video.duration;
      if (!duration || duration === Infinity) {
        reject(new Error('Não foi possível determinar a duração do vídeo.'));
        return;
      }

      canvas.width = Math.min(video.videoWidth, 640);
      canvas.height = Math.round((video.videoHeight / video.videoWidth) * canvas.width);

      // Seek to evenly-spaced timestamps
      const timestamps = Array.from({ length: numFrames }, (_, i) =>
        (i / (numFrames - 1)) * duration * 0.95 // avoid very end of video
      );

      for (const ts of timestamps) {
        await new Promise<void>((res) => {
          video.currentTime = ts;
          video.onseeked = () => {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.75);
            // Strip data URL prefix, keep only base64 data
            const base64 = dataUrl.split(',')[1];
            if (base64) frames.push(base64);
            res();
          };
        });
      }

      video.src = '';
      resolve(frames);
    };

    video.onerror = () => reject(new Error('Erro ao carregar o vídeo para extração de frames.'));
    video.load();
  });
}
