'use client';

import React from 'react';

/**
 * Global SVG Filters for Nexus Lip-Sync (Pixel Warping)
 * These filters are used to distort the mouth area of Maga and Orion
 * based on the audioLevel provided by Framer Motion.
 */
export function LipSyncFilters() {
  return (
    <svg className="fixed pointer-events-none opacity-0 h-0 w-0" aria-hidden="true">
      <defs>
        {/* MAGA DISPLACEMENT FILTER - Refined for localized warping */}
        <filter id="lip-sync-maga" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence 
            type="fractalNoise" 
            baseFrequency="0.04 0.12" 
            numOctaves="2" 
            result="noise" 
          />
          <feDisplacementMap 
            in="SourceGraphic" 
            in2="noise" 
            scale="0" 
            id="maga-warp-map"
            xChannelSelector="R" 
            yChannelSelector="G" 
          />
        </filter>

        {/* ORION DISPLACEMENT FILTER - Refined for tactical/sharp warping */}
        <filter id="lip-sync-orion" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence 
            type="fractalNoise" 
            baseFrequency="0.06 0.15" 
            numOctaves="3" 
            result="noise" 
          />
          <feDisplacementMap 
            in="SourceGraphic" 
            in2="noise" 
            scale="0" 
            id="orion-warp-map"
            xChannelSelector="R" 
            yChannelSelector="G" 
          />
        </filter>

        {/* UNIVERSAL HUMAN LIP-SYNC - Stronger Vertical Warp */}
        <filter id="nexus-lip-sync" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence 
            type="fractalNoise" 
            baseFrequency="0.02 0.08" 
            numOctaves="2" 
            seed="5"
            result="noise" 
          />
          <feDisplacementMap 
            in="SourceGraphic" 
            in2="noise" 
            scale="0" 
            id="universal-warp-map"
            xChannelSelector="R" 
            yChannelSelector="G" 
          />
        </filter>
      </defs>
    </svg>
  );
}
