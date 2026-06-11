
'use client';

import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { Skeleton } from './skeleton';
import { cn } from '@/lib/utils';

interface QrCodeProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  size?: number;
  className?: string;
}

export function QrCode({ value, size = 128, className }: QrCodeProps) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    QRCode.toDataURL(value, {
      errorCorrectionLevel: 'M',
      margin: 1,
      width: size,
      color: {
        dark: '#0A0A0B', // black
        light: '#FFFFFF', // white
      },
    })
      .then(url => setDataUrl(url))
      .catch(err => {
        console.error('Failed to generate QR code:', err);
        setDataUrl(null);
      });
  }, [value, size]);

  if (!dataUrl) {
    return <Skeleton className="rounded-lg" style={{ width: size, height: size }} />;
  }

  return (
    <div className={cn("relative inline-block", className)}>
      <img src={dataUrl} alt="PIX QR Code" style={{ width: size, height: size }} className="rounded-md" />
      <div 
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ padding: `${size * 0.38}px` }}
      >
        <div className="bg-zinc-950 border border-zinc-800 p-0.5 rounded-sm shadow-xl flex items-center justify-center overflow-hidden">
          <img 
            src="/assets/nexus/nexus-n-logo.jpg" 
            alt="Nexus Logo" 
            style={{ width: size * 0.18, height: size * 0.18 }}
            className="object-cover rounded-[2px]"
          />
        </div>
      </div>
    </div>
  );
}
