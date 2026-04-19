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
