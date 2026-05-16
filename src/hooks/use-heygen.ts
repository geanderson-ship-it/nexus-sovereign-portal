import { useState, useRef, useCallback, useEffect } from 'react';
import StreamingAvatar, { AvatarQuality, StreamingEvents } from '@heygen/streaming-avatar';

interface UseHeygenOptions {
  avatarId: string;
  onStreamReady?: (stream: MediaStream) => void;
  onStreamDisconnected?: () => void;
  onMessage?: (message: string) => void;
}

export function useHeygen({ avatarId, onStreamReady, onStreamDisconnected, onMessage }: UseHeygenOptions) {
  const [isInitializing, setIsInitializing] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const avatarRef = useRef<StreamingAvatar | null>(null);
  const sessionIdRef = useRef<string | null>(null);

  const fetchToken = async () => {
    const res = await fetch('/api/heygen/token', { method: 'POST' });
    if (!res.ok) {
      throw new Error(`Failed to fetch token: ${res.status}`);
    }
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    return data.token;
  };

  const startSession = useCallback(async () => {
    if (isInitializing || isConnected) return;
    
    setIsInitializing(true);
    setError(null);

    try {
      const token = await fetchToken();
      
      const avatar = new StreamingAvatar({
        token,
      });

      // Lidar com eventos do WebRTC
      avatar.on(StreamingEvents.AVATAR_START_TALKING, (e) => {
        setIsSpeaking(true);
      });
      
      avatar.on(StreamingEvents.AVATAR_STOP_TALKING, (e) => {
        setIsSpeaking(false);
      });

      avatar.on(StreamingEvents.STREAM_DISCONNECTED, () => {
        setIsConnected(false);
        if (onStreamDisconnected) onStreamDisconnected();
      });

      avatar.on(StreamingEvents.STREAM_READY, (e: any) => {
        if (e.detail && onStreamReady) {
          onStreamReady(e.detail);
        }
      });

      const sessionData = await avatar.createStartAvatar({
        quality: AvatarQuality.High,
        avatarName: avatarId,
      });

      sessionIdRef.current = sessionData.session_id;
      avatarRef.current = avatar;
      setIsConnected(true);

    } catch (err: any) {
      console.error('Error starting HeyGen session:', err);
      setError(err.message || 'Error initializing avatar');
    } finally {
      setIsInitializing(false);
    }
  }, [avatarId, isInitializing, isConnected, onStreamReady, onStreamDisconnected]);

  const stopSession = useCallback(async () => {
    if (!avatarRef.current || !sessionIdRef.current) return;
    
    try {
      await avatarRef.current.stopAvatar();
    } catch (err) {
      console.error('Error stopping avatar:', err);
    } finally {
      avatarRef.current = null;
      sessionIdRef.current = null;
      setIsConnected(false);
      setIsSpeaking(false);
    }
  }, []);

  const speak = useCallback(async (text: string) => {
    if (!avatarRef.current || !sessionIdRef.current || !isConnected) {
      console.warn('Cannot speak, avatar not connected');
      return;
    }
    
    try {
      await avatarRef.current.speak({
        text,
      });
    } catch (err) {
      console.error('Error speaking:', err);
    }
  }, [isConnected]);

  // Limpeza na desmontagem do componente
  useEffect(() => {
    return () => {
      if (avatarRef.current) {
        stopSession();
      }
    };
  }, [stopSession]);

  return {
    isInitializing,
    isConnected,
    isSpeaking,
    error,
    startSession,
    stopSession,
    speak
  };
}
