'use client';

import React, { useRef, useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface NexusStageProps {
    stream: MediaStream | null;
    isConnecting: boolean;
    isConnected: boolean;
    fallbackImageSrc: string;
    speakerName?: string;
    isSpeaking?: boolean;
}

export function NexusStage({ 
    stream, 
    isConnecting, 
    isConnected, 
    fallbackImageSrc,
    speakerName,
    isSpeaking 
}: NexusStageProps) {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
    }, [stream]);

    return (
        <div className="relative w-full aspect-[21/9] max-w-6xl mx-auto rounded-2xl overflow-hidden bg-[#050510] border border-primary/20 shadow-[0_0_80px_rgba(0,100,255,0.05)] group">
            
            {/* Cinematic Background Layer */}
            <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/10 via-black to-black opacity-90" />
            
            {/* Fallback Image / Static Stage */}
            <div className={cn("absolute inset-0 z-10 transition-opacity duration-1000", isConnected ? "opacity-0" : "opacity-100")}>
                <Image 
                    src={fallbackImageSrc}
                    alt="Nexus Stage"
                    fill
                    sizes="100vw"
                    style={{ objectFit: 'cover' }}
                    className="opacity-90"
                    priority
                />
                
                {/* Subtle overlay for the static image to make it look like a screen */}
                <div className="absolute inset-0 bg-black/30 mix-blend-multiply" />
            </div>

            {/* WebRTC Video Stream */}
            {isConnected && (
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="absolute inset-0 z-20 w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
            )}

            {/* Connecting State */}
            {isConnecting && (
                <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md transition-all duration-500">
                    <Loader2 className="h-16 w-16 text-primary animate-spin mb-6 drop-shadow-[0_0_15px_rgba(0,100,255,0.5)]" />
                    <p className="text-primary font-headline tracking-[0.2em] text-sm animate-pulse">
                        CONECTANDO LIVE AVATAR...
                    </p>
                </div>
            )}

            {/* Cinematic Overlay & UI Elements */}
            <div className="absolute inset-0 z-40 pointer-events-none box-border border-[1px] border-white/5 mix-blend-overlay" />
            
            {/* Speaker Indicator */}
            {(isSpeaking || !isConnected) && speakerName && !isConnecting && (
                <div className="absolute bottom-6 right-6 z-50">
                    <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-full px-6 py-2 flex items-center gap-3 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                        <div className={cn("h-2 w-2 rounded-full", isSpeaking ? "bg-green-500 animate-[pulse_1s_ease-in-out_infinite]" : "bg-primary/50")} />
                        <span className="text-white/90 font-medium tracking-wider text-sm uppercase font-headline">
                            {speakerName}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}
