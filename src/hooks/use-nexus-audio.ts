'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { textToSpeech } from '@/ai/flows/text-to-speech-flow';
import type { UseNexusAudioInput, TextToSpeechOutput, SpeechMark } from './use-nexus-audio-types';
import { useToast } from './use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import { useLocale } from './use-locale';

export { errorEmitter };

export function useAudioLevel() {
    const [level, setLevel] = useState(0);
    
    useEffect(() => {
        const handler = (data: { level: number }) => setLevel(data.level);
        errorEmitter.on('audio-level-update', handler);
        return () => {
            errorEmitter.off('audio-level-update', handler);
        };
    }, []);
    
    return level;
}

// Use globalThis to ensure the cache persists across hot-reloads in development.
const globalWithCache = globalThis as typeof globalThis & {
  nexusAudioCache?: Map<string, TextToSpeechOutput>;
};
if (!globalWithCache.nexusAudioCache) {
  globalWithCache.nexusAudioCache = new Map<string, TextToSpeechOutput>();
}
const audioCache = globalWithCache.nexusAudioCache;


// Creates a unique key for the cache based on voice, text content and locale.
function getCacheKey(text: string, voice: string, locale: string): string {
  // Trim the text to ensure consistency and avoid cache misses due to whitespace.
  return `${voice}::${locale}::${text.trim()}`;
}


export function useNexusAudio() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [playingId, setPlayingId] = useState<string | number | null>(null);
    const [currentViseme, setCurrentViseme] = useState<SpeechMark | null>(null);
    const { toast } = useToast();
    const { locale } = useLocale();
    
    const audioContextRef = useRef<AudioContext | null>(null);
    const sourceRef = useRef<AudioBufferSourceNode | null>(null);
    const abortControllerRef = useRef<AbortController | null>(null);
    const visemeTimeoutsRef = useRef<NodeJS.Timeout[]>([]);
    const queuedAudioRef = useRef<UseNexusAudioInput | null>(null);
    const animationFrameIdRef = useRef<number | null>(null);


    // This effect will broadcast viseme changes to any interested component.
    useEffect(() => {
        errorEmitter.emit('viseme-update', { viseme: currentViseme });
    }, [currentViseme]);

    const getAudioContext = useCallback(() => {
        if (typeof window === 'undefined') return null;
        if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
            try {
                audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
            } catch (e) {
                console.error("VIX DIAGNOSTIC: Web Audio API is not supported.", e);
                return null;
            }
        }
        return audioContextRef.current;
    }, []);

    const stopAudio = useCallback(() => {
        abortControllerRef.current?.abort();
        abortControllerRef.current = null;
        
        visemeTimeoutsRef.current.forEach(clearTimeout);
        visemeTimeoutsRef.current = [];
        setCurrentViseme(null);

        if (animationFrameIdRef.current) {
            cancelAnimationFrame(animationFrameIdRef.current);
            animationFrameIdRef.current = null;
        }
        errorEmitter.emit('audio-level-update', { level: 0 });

        if (sourceRef.current) {
            try {
                sourceRef.current.onended = null;
                sourceRef.current.stop();
            } catch (e) {}
            sourceRef.current = null;
        }
        
        setIsPlaying(false);
        setPlayingId(null);
        setIsLoading(false);
    }, []);

    const playAudio = useCallback(async (input: UseNexusAudioInput) => {
        const { text, voice, id, onEnded } = input;
        
        const context = getAudioContext();
        if (!context) {
            console.error("VIX DIAGNOSTIC: AudioContext not available.");
            onEnded?.();
            return;
        }

        if (context.state === 'suspended') {
            console.warn("VIX DIAGNOSTIC: Audio context suspended. Queuing audio for playback on first user interaction.");
            queuedAudioRef.current = input;
            return;
        }
        
        stopAudio();
        
        let processedText = text?.trim();
        if (!processedText) {
            onEnded?.();
            return;
        }

        processedText = processedText.replace(/\b(Jean|Gean)\b/gi, 'Gian');

        const newAbortController = new AbortController();
        abortControllerRef.current = newAbortController;

        setPlayingId(id);
        setIsLoading(true);
        setIsPlaying(false);

        try {
            const cacheKey = getCacheKey(processedText, voice, locale);
            let audioData: TextToSpeechOutput;

            if (input.audioUrl) {
                // If a pre-recorded URL is provided, fetch it directly
                const response = await fetch(input.audioUrl);
                if (!response.ok) throw new Error(`Falha ao carregar áudio estático: ${response.statusText}`);
                const blob = await response.blob();
                const arrayBuffer = await blob.arrayBuffer();
                
                // Helper to convert arrayBuffer to base64 for decoding logic below
                const base64 = btoa(new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), ''));
                audioData = {
                    audioDataUri: `data:audio/mpeg;base64,${base64}`,
                    speechMarks: [] // Static files don't have dynamic visemes yet
                };
            } else if (audioCache.has(cacheKey)) {
                audioData = audioCache.get(cacheKey)!;
            } else {
                audioData = await textToSpeech({ text: processedText, voice, locale });
                audioCache.set(cacheKey, audioData);
            }

            if (newAbortController.signal.aborted) return;

            const base64Data = audioData.audioDataUri.split(',')[1];
            if (!base64Data) throw new Error("Invalid audioDataUri format.");

            const bytes = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
            const audioBuffer = await context.decodeAudioData(bytes.buffer);

            if (newAbortController.signal.aborted) return;
                
            setIsLoading(false);
            setIsPlaying(true);

            const source = context.createBufferSource();
            source.buffer = audioBuffer;
            sourceRef.current = source;
            
            const analyser = context.createAnalyser();
            analyser.fftSize = 256;
            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);
            
            source.connect(analyser);
            analyser.connect(context.destination);

            const draw = () => {
                if (!analyser) return;
                animationFrameIdRef.current = requestAnimationFrame(draw);
                analyser.getByteFrequencyData(dataArray);
                const average = dataArray.reduce((acc, val) => acc + val, 0) / bufferLength;
                const volume = Math.min(1, (average / 140) ** 2);
                errorEmitter.emit('audio-level-update', { level: volume });
            };
            draw();

            if (audioData.speechMarks) {
                visemeTimeoutsRef.current = audioData.speechMarks.map(mark => 
                    setTimeout(() => {
                        if (!newAbortController.signal.aborted) setCurrentViseme(mark);
                    }, mark.startOffset)
                );
            }

            source.onended = () => {
                if (sourceRef.current === source) {
                    stopAudio();
                    onEnded?.();
                }
            };
            
            source.start(0);

        } catch (err: any) {
            if (!newAbortController.signal.aborted) {
                console.error(`VIX DIAGNOSTIC: Falha no processamento de áudio.`, err);
                toast({
                    variant: 'destructive',
                    title: 'Falha no Protocolo de Áudio',
                    description: err.message || 'Não foi possível sintetizar a voz do mentor.',
                });
                stopAudio();
                onEnded?.();
            }
        }
    }, [stopAudio, getAudioContext, toast]);


    // Effect to unlock audio context and play queued audio on first user gesture.
    useEffect(() => {
        const context = getAudioContext();
        if (!context) return;

        const unlockAndPlay = () => {
            if (context.state === 'suspended') {
                context.resume().then(() => {
                    if (queuedAudioRef.current) {
                        playAudio(queuedAudioRef.current);
                        queuedAudioRef.current = null;
                    }
                });
            }
            document.removeEventListener('click', unlockAndPlay, true);
            document.removeEventListener('keydown', unlockAndPlay, true);
        };

        document.addEventListener('click', unlockAndPlay, true);
        document.addEventListener('keydown', unlockAndPlay, true);

        return () => {
            document.removeEventListener('click', unlockAndPlay, true);
            document.removeEventListener('keydown', unlockAndPlay, true);
        };
    }, [getAudioContext, playAudio]);


    const warmUpAudio = useCallback(() => {
        getAudioContext();
    }, [getAudioContext]);

    useEffect(() => {
        return () => stopAudio();
    }, [stopAudio]);

    return {
        playAudio,
        playSpeech: playAudio, // Alias for backward compatibility
        stopAudio,
        isPlaying,
        isLoadingAudio: isLoading,
        playingId,
        isSpeaking: isPlaying,
        warmUpAudio,
        currentViseme,
    };
}
