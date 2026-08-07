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

interface Cue {
  start: number;
  end: number;
  text: string;
}

// Helper to parse filename from src URL
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

// WebVTT Time Parser (Handles both MM:SS.mmm and HH:MM:SS.mmm)
const parseTime = (timeStr: string): number => {
  const parts = timeStr.trim().split(':');
  let seconds = 0;
  if (parts.length === 3) {
    seconds += parseInt(parts[0], 10) * 3600;
    seconds += parseInt(parts[1], 10) * 60;
    seconds += parseFloat(parts[2]);
  } else if (parts.length === 2) {
    seconds += parseInt(parts[0], 10) * 60;
    seconds += parseFloat(parts[1]);
  }
  return seconds;
};

// WebVTT Parser
const parseVTT = (text: string): Cue[] => {
  const lines = text.split(/\r?\n/);
  const cues: Cue[] = [];
  let currentCue: Partial<Cue> = {};

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.includes('-->')) {
      const parts = line.split('-->');
      if (parts.length === 2) {
        currentCue.start = parseTime(parts[0]);
        currentCue.end = parseTime(parts[1]);
      }
    } else if (line === '' && currentCue.start !== undefined) {
      if (currentCue.text) {
        cues.push(currentCue as Cue);
      }
      currentCue = {};
    } else if (currentCue.start !== undefined) {
      // Skip WebVTT note lines or formatting tags if any
      if (!line.startsWith('NOTE') && line !== 'WEBVTT') {
        // Strip out HTML formatting tags like <b> or <i> if present in VTT
        const cleanText = line.replace(/<[^>]*>/g, '');
        currentCue.text = currentCue.text ? currentCue.text + ' ' + cleanText : cleanText;
      }
    }
  }
  if (currentCue.start !== undefined && currentCue.text) {
    cues.push(currentCue as Cue);
  }
  return cues;
};

export function CustomVideoPlayer({ src, className, containerClassName, playButtonClassName, ...props }: CustomVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [cues, setCues] = useState<Cue[]>([]);
  const [currentCueText, setCurrentCueText] = useState('');
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

  // Fetch and parse VTT subtitles when video or locale changes
  useEffect(() => {
    if (!fileName || locale === 'pt-BR') {
      setCues([]);
      setCurrentCueText('');
      return;
    }

    const subtitleUrl = `/subtitles/${fileName}_${locale}.vtt`;
    
    fetch(subtitleUrl)
      .then((res) => {
        if (res.ok) return res.text();
        throw new Error(`Subtitles file not found: ${subtitleUrl}`);
      })
      .then((text) => {
        const parsed = parseVTT(text);
        setCues(parsed);
      })
      .catch((err) => {
        // Silently fail if subtitle file is missing for this video/locale
        setCues([]);
        setCurrentCueText('');
      });
  }, [fileName, locale]);

  // Synchronize active subtitle display with video current time
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onTimeUpdate = () => {
      const time = video.currentTime;
      const activeCue = cues.find(c => time >= c.start && time <= c.end);
      setCurrentCueText(activeCue ? activeCue.text : '');
    };

    video.addEventListener('timeupdate', onTimeUpdate);
    return () => {
      video.removeEventListener('timeupdate', onTimeUpdate);
    };
  }, [cues]);

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
      />

      {/* Custom Styled Subtitles Overlay */}
      {currentCueText && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-30 max-w-[85%] text-center pointer-events-none transition-all duration-200">
          <span className="px-4 py-2 rounded-xl bg-black/85 text-[#f0f6fc] font-sans text-sm md:text-base font-bold shadow-2xl border border-white/10 [text-shadow:1px_1px_3px_rgba(0,0,0,0.9)] tracking-wide">
            {currentCueText}
          </span>
        </div>
      )}

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
