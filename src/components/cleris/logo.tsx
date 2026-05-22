import React from 'react';

interface ClerisLogoProps {
  variant?: 'white-on-green' | 'green-on-transparent' | 'sports-grey';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function ClerisLogo({ variant = 'green-on-transparent', size = 'md', className = '' }: ClerisLogoProps) {
  // Define colors based on variant
  // Logo features 4 stars in a specific constellation:
  // Top row: 3 stars (left, middle, right)
  // Bottom row: 1 star under the left star
  
  const isWhite = variant === 'white-on-green';
  const isSports = variant === 'sports-grey';
  
  const textColor = isWhite ? 'text-white' : 'text-[#008a47]';
  const subtitleColor = isWhite ? 'text-white/80' : isSports ? 'text-zinc-500' : 'text-[#008a47]';
  const starColor = isWhite ? 'fill-white' : isSports ? 'fill-zinc-400' : 'fill-[#008a47]';
  
  const sizeClasses = {
    sm: {
      starContainer: 'w-8 h-8',
      title: 'text-2xl',
      subtitle: 'text-[8px] tracking-[0.2em]',
      gap: 'gap-1.5'
    },
    md: {
      starContainer: 'w-12 h-12',
      title: 'text-3.5xl md:text-4xl',
      subtitle: 'text-[10px] md:text-[11px] tracking-[0.3em]',
      gap: 'gap-3'
    },
    lg: {
      starContainer: 'w-16 h-16',
      title: 'text-5xl md:text-6xl',
      subtitle: 'text-xs md:text-sm tracking-[0.35em]',
      gap: 'gap-4'
    }
  }[size];

  // SVG 4-pointed star path
  const StarIcon = () => (
    <svg 
      viewBox="0 0 24 24" 
      className={`${starColor} w-full h-full transition-transform duration-300 hover:scale-110`}
    >
      <path d="M 12 2 C 12 10, 12 10, 20 12 C 12 14, 12 14, 12 22 C 12 14, 12 14, 4 12 C 12 10, 12 10, 12 2 Z" />
    </svg>
  );

  return (
    <div className={`flex items-center ${sizeClasses.gap} ${className}`}>
      {/* 4-Star Constellation */}
      <div className={`relative ${sizeClasses.starContainer} flex-shrink-0`}>
        {/* Top Left Star */}
        <div className="absolute top-0 left-0 w-5/12 h-5/12">
          <StarIcon />
        </div>
        {/* Top Middle Star */}
        <div className="absolute top-0 left-1/3 w-5/12 h-5/12">
          <StarIcon />
        </div>
        {/* Top Right Star */}
        <div className="absolute top-0 left-2/3 w-5/12 h-5/12">
          <StarIcon />
        </div>
        {/* Bottom Left Star (directly under top left) */}
        <div className="absolute top-1/3 left-0 w-5/12 h-5/12">
          <StarIcon />
        </div>
      </div>
      
      {/* Brand Text */}
      <div className="flex flex-col select-none">
        <h1 className={`font-black ${sizeClasses.title} ${textColor} tracking-tight italic font-sans leading-none`}>
          Cleris
        </h1>
        <p className={`font-bold ${sizeClasses.subtitle} ${subtitleColor} uppercase leading-none mt-1`}>
          {isSports ? (
            <>
              calçados <span className="text-zinc-300 mx-1">|</span> esportes
            </>
          ) : (
            'CALÇADOS'
          )}
        </p>
      </div>
    </div>
  );
}
