'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

export type LectureState = 'IDLE' | 'CONNECTING' | 'PRESENTING' | 'Q_AND_A' | 'FINISHED';

interface UseLectureEngineProps {
    chunks: string[];
    onSpeakChunk: (text: string) => Promise<void>;
    onInterrupt?: () => void;
}

export function useLectureEngine({ chunks, onSpeakChunk, onInterrupt }: UseLectureEngineProps) {
    const [state, setState] = useState<LectureState>('IDLE');
    const [currentChunkIndex, setCurrentChunkIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    
    // Use a ref to track if we should continue presenting
    const presentingRef = useRef(false);
    const pausedRef = useRef(isPaused);

    useEffect(() => {
        pausedRef.current = isPaused;
    }, [isPaused]);

    const startLecture = useCallback(async () => {
        if (state !== 'IDLE' && state !== 'CONNECTING') return;
        
        setState('CONNECTING');
        // Simulate connection delay for HeyGen
        await new Promise(r => setTimeout(r, 2000));
        
        setState('PRESENTING');
        setCurrentChunkIndex(0);
        presentingRef.current = true;
    }, [state]);

    const pauseLecture = useCallback(() => {
        setIsPaused(true);
        if (onInterrupt) onInterrupt();
    }, [onInterrupt]);

    const resumeLecture = useCallback(() => {
        setIsPaused(false);
    }, []);

    const stopLecture = useCallback(() => {
        presentingRef.current = false;
        setState('FINISHED');
        if (onInterrupt) onInterrupt();
    }, [onInterrupt]);

    const enterQandA = useCallback(() => {
        presentingRef.current = false;
        setState('Q_AND_A');
        if (onInterrupt) onInterrupt();
    }, [onInterrupt]);

    // Main presentation loop
    useEffect(() => {
        if (state !== 'PRESENTING') return;
        if (!presentingRef.current) return;

        let active = true;

        const presentNext = async () => {
            if (currentChunkIndex >= chunks.length) {
                // Finished all chunks, auto transition to Q&A
                enterQandA();
                return;
            }

            if (pausedRef.current) {
                // wait a bit and check again
                if (active) {
                    setTimeout(presentNext, 500);
                }
                return;
            }

            const chunkText = chunks[currentChunkIndex];
            try {
                // Wait for the avatar/TTS to finish speaking
                await onSpeakChunk(chunkText);
                
                if (active && presentingRef.current) {
                    // Small pause between chunks
                    await new Promise(r => setTimeout(r, 1000));
                    setCurrentChunkIndex(prev => prev + 1);
                }
            } catch (error) {
                console.error("Error speaking chunk:", error);
                // Pause if error occurs
                pauseLecture();
            }
        };

        presentNext();

        return () => {
            active = false;
        };
    }, [state, currentChunkIndex, chunks, onSpeakChunk, enterQandA, pauseLecture]);

    return {
        state,
        currentChunkIndex,
        totalChunks: chunks.length,
        isPaused,
        startLecture,
        pauseLecture,
        resumeLecture,
        stopLecture,
        enterQandA,
        progress: chunks.length > 0 ? (currentChunkIndex / chunks.length) * 100 : 0
    };
}
