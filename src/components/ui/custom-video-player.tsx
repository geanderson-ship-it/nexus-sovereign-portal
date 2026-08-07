'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLocale } from '@/hooks/use-locale';

interface CustomVideoPlayerProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  src: string;
  className?: string;
  containerClassName?: string;
  playButtonClassName?: string;
}

// Supported languages list for subtitles
const supportedSubLanguages = [
  { code: 'en-US', label: 'English', srclang: 'en' },
  { code: 'es-ES', label: 'Español', srclang: 'es' },
  { code: 'de-DE', label: 'Deutsch', srclang: 'de' },
  { code: 'fr-FR', label: 'Français', srclang: 'fr' },
  { code: 'ja-JP', label: '日本語', srclang: 'ja' },
  { code: 'zh-CN', label: '简体中文', srclang: 'zh' },
  { code: 'ar-AE', label: 'العربية', srclang: 'ar' }
];

// Helper to parse filename from src URL and map local filenames to S3 counterparts
const getFileName = (url: string) => {
  try {
    const parts = url.split('/');
    const lastPart = parts[parts.length - 1];
    const cleanName = lastPart.split('?')[0];
    let name = decodeURIComponent(cleanName.replace(/\.[^/.]+$/, ""));
    
    // Map local filename to S3 counterpart for local development testing
    if (name === "Nexus Holding Group") {
      return "Avatar_IV_Video";
    }
    return name;
  } catch (e) {
    return '';
  }
};

export function CustomVideoPlayer({ src, className, containerClassName, playButtonClassName, ...props }: CustomVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const { locale } = useLocale();

  const fileName = getFileName(src);

  useEffect(() => {
    if (videoRef.current) {
      setIsPlaying(!videoRef.current.paused);
      setIsMuted(videoRef.current.muted);
      
      const video = videoRef.current;
      const onPlay = () => setIsPlaying(true);
      const onPause = () => setIsPlaying(false);
      
      video.addEventListener('play', onPlay);
      video.addEventListener('pause', onPause);
      
      return () => {
        video.removeEventListener('play', onPlay);
        video.removeEventListener('pause', onPause);
      };
    }
  }, []);

  // Bulletproof subtitles activation effect
  useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current;
      const textTracks = video.textTracks;
      
      const updateTracks = () => {
        for (let i = 0; i < textTracks.length; i++) {
          const track = textTracks[i];
          // Match standard language code (e.g. 'en-US' starts with 'en')
          if (locale.startsWith(track.language)) {
            track.mode = 'showing';
          } else {
            track.mode = 'disabled';
          }
        }
      };

      // Run immediately
      updateTracks();
      
      // Run when tracks finish loading
      video.addEventListener('loadedmetadata', updateTracks);
      return () => {
        video.removeEventListener('loadedmetadata', updateTracks);
      };
    }
  }, [locale, src]);

  const togglePlay = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    if (videoRef.current) {
      if (videoRef.current.paused) {
        // Unmute automatically on first user interaction if they hit play
        if (videoRef.current.muted && !isMuted) {
           videoRef.current.muted = false;
        }
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <div 
      className={cn("relative w-full h-full group overflow-hidden cursor-pointer", containerClassName)}
      onClick={togglePlay}
    >
      <video
        ref={videoRef}
        src={src}
        className={cn("w-full h-full object-cover transform-gpu", className)}
        playsInline
        webkit-playsinline="true"
        preload="auto"
        {...props}
      >
        {fileName && supportedSubLanguages.map((lang) => (
          <track
            key={lang.code}
            kind="subtitles"
            src={`/subtitles/${fileName}_${lang.code}.vtt`}
            srcLang={lang.srclang}
            label={lang.label}
            default={locale === lang.code}
          />
        ))}
      </video>

      {/* Center Play/Pause Overlay */}
      <div className={cn(
        "absolute inset-0 flex items-center justify-center transition-all duration-300 pointer-events-none",
        isPlaying ? "bg-transparent opacity-0 md:group-hover:opacity-100" : "bg-black/40 opacity-100 backdrop-blur-[2px]"
      )}>
        <button 
          onClick={(e) => { e.stopPropagation(); togglePlay(); }}
          className={cn(
            "pointer-events-auto flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-full bg-primary/80 text-white backdrop-blur-md transition-transform hover:scale-110 hover:bg-primary shadow-[0_0_30px_rgba(37,99,235,0.5)]",
            playButtonClassName
          )}
        >
          {isPlaying ? (
            <Pause className="h-6 w-6 md:h-8 md:w-8 fill-current" />
          ) : (
            <Play className="h-6 w-6 md:h-8 md:w-8 fill-current ml-1" />
          )}
        </button>
      </div>

      {/* Volume Control (Bottom Right) */}
      <div className={cn(
        "absolute bottom-4 right-4 z-10 transition-opacity duration-300 pointer-events-none",
        isPlaying ? "opacity-0 md:group-hover:opacity-100" : "opacity-100"
      )}>
        <button
          onClick={toggleMute}
          className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md hover:bg-black/80 border border-white/10"
        >
          {isMuted ? (
            <VolumeX className="h-5 w-5" />
          ) : (
            <Volume2 className="h-5 w-5" />
          )}
        </button>
      </div>
    </div>
  );
}
