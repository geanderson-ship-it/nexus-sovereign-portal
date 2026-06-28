'use client';

import React, { useState, useEffect } from 'react';
import { eventEmitter } from '@/auth/event-emitter';
import { X, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function MiniYouTubePlayer() {
  const [videoId, setVideoId] = useState<string | null>(null);
  const [title, setTitle] = useState<string | null>(null);

  useEffect(() => {
    const handlePlayMusic = (data: { videoId: string; title?: string }) => {
      setVideoId(data.videoId);
      setTitle(data.title || 'Música');
    };

    eventEmitter.on('play-music', handlePlayMusic);

    return () => {
      eventEmitter.off('play-music', handlePlayMusic);
    };
  }, []);

  if (!videoId) return null;

  return (
    <div className="fixed bottom-0 right-0 z-0 opacity-0 pointer-events-none w-[1px] h-[1px] overflow-hidden">
      <div className="w-[320px] max-w-[calc(100vw-32px)]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/5">
          <div className="flex items-center gap-2 overflow-hidden">
            <Music className="h-4 w-4 text-emerald-400 animate-pulse shrink-0" />
            <span className="text-xs font-medium text-white/90 truncate">{title}</span>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6 rounded-full hover:bg-white/10 shrink-0 text-white/70 hover:text-white"
            onClick={() => setVideoId(null)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Player Iframe */}
        <div className="relative pt-[56.25%] bg-black">
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&enablejsapi=1&playsinline=1`}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}
