'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import StreamingAvatar, {
  AvatarQuality,
  StreamingEvents,
  TaskType,
} from '@heygen/streaming-avatar';

export function useHeyGenStream() {
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [isConnecting, setIsConnecting] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    
    // @ts-ignore
    const avatarRef = useRef<StreamingAvatar | null>(null);

    const initializeSession = useCallback(async (avatarId: string) => {
        setIsConnecting(true);
        try {
            const tokenResponse = await fetch('/api/heygen/token', { method: 'POST' });
            if (!tokenResponse.ok) {
                console.warn('HeyGen token API returned error. Real-time avatars will fallback to Audio TTS mode.');
                setIsConnecting(false);
                return false;
            }
            
            const { token } = await tokenResponse.json();
            
            avatarRef.current = new StreamingAvatar({ token });

            avatarRef.current.on(StreamingEvents.STREAM_READY, (event: any) => {
                setStream(event.detail);
            });

            avatarRef.current.on(StreamingEvents.STREAM_DISCONNECTED, () => {
                setStream(null);
                setIsConnected(false);
            });
            
            avatarRef.current.on(StreamingEvents.AVATAR_START_TALKING, () => {
                setIsSpeaking(true);
            });
            
            avatarRef.current.on(StreamingEvents.AVATAR_STOP_TALKING, () => {
                setIsSpeaking(false);
            });

            await avatarRef.current.createStartAvatar({
                quality: AvatarQuality.High,
                avatarName: avatarId,
                knowledgeBase: '',
            });

            setIsConnected(true);
            setIsConnecting(false);
            return true;
        } catch (error) {
            console.error('Error initializing HeyGen session:', error);
            setIsConnecting(false);
            return false;
        }
    }, []);

    const speak = useCallback(async (text: string) => {
        if (!avatarRef.current || !isConnected) return;
        try {
            await avatarRef.current.speak({
                text: text,
                taskType: TaskType.TALK,
                taskMode: 'SYNC',
            });
        } catch (e) {
            console.error('Error speaking:', e);
        }
    }, [isConnected]);

    const closeSession = useCallback(async () => {
        if (avatarRef.current && isConnected) {
            await avatarRef.current.stopAvatar();
            avatarRef.current = null;
            setStream(null);
            setIsConnected(false);
            setIsSpeaking(false);
        }
    }, [isConnected]);

    useEffect(() => {
        return () => {
            closeSession();
        };
    }, [closeSession]);

    return {
        stream,
        isConnecting,
        isConnected,
        isSpeaking,
        initializeSession,
        speak,
        closeSession
    };
}
