'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CustomVideoPlayerProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  src: string;
  className?: string;
  containerClassName?: string;
}

export function CustomVideoPlayer({ src, className, containerClassName, ...props }: CustomVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

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

  const togglePlay = () => {
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
        className={cn("w-full h-full object-cover", className)}
        playsInline
        preload="metadata"
        {...props}
      />

      {/* Center Play/Pause Overlay */}
      <div className={cn(
        "absolute inset-0 flex items-center justify-center transition-all duration-300 pointer-events-none",
        isPlaying ? "bg-transparent opacity-0 md:group-hover:opacity-100" : "bg-black/40 opacity-100 backdrop-blur-[2px]"
      )}>
        <button 
          onClick={(e) => { e.stopPropagation(); togglePlay(); }}
          className="pointer-events-auto flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-full bg-primary/80 text-white backdrop-blur-md transition-transform hover:scale-110 hover:bg-primary shadow-[0_0_30px_rgba(37,99,235,0.5)]"
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
