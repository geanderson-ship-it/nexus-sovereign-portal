'use client';

import { cn } from '@/lib/utils';

export function PsgLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 100" className={cn("w-auto h-auto", className)} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="glassGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: 'rgba(200, 220, 255, 0.8)', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: 'rgba(180, 200, 240, 0.9)', stopOpacity: 1 }} />
        </linearGradient>
        <filter id="glass" x="0" y="0" width="100%" height="100%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur" />
          <feOffset in="blur" dx="2" dy="2" result="offsetBlur" />
          <feSpecularLighting in="blur" surfaceScale="5" specularConstant=".75" specularExponent="20" lightingColor="#bbbbbb" result="specOut">
            <fePointLight x="-5000" y="-10000" z="20000" />
          </feSpecularLighting>
          <feComposite in="specOut" in2="SourceAlpha" operator="in" result="specOut" />
          <feComposite in="SourceGraphic" in2="specOut" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="litPaint" />
        </filter>
      </defs>
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontSize="120"
        fontFamily="var(--font-headline), sans-serif"
        fontWeight="900"
        fill="url(#glassGradient)"
        stroke="#FFFFFF"
        strokeWidth="1.5"
        letterSpacing="-5"
        style={{ filter: 'url(#glass)' }}
      >
        PSG
      </text>
    </svg>
  );
}
