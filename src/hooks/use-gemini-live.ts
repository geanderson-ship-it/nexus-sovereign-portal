'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

// Protocol constants
const GEMINI_LIVE_ENDPOINT = 'wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent';

export type LiveConnectionState = 'idle' | 'connecting' | 'connected' | 'disconnected' | 'error';

export function useGeminiLive(persona: 'maga' | 'orion' = 'maga', options: { isFirstTime?: boolean, isDuo?: boolean } = {}) {
  const [connectionState, setConnectionState] = useState<LiveConnectionState>('idle');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [volume, setVolume] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Refs for persistent state
  const wsRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioWorkletRef = useRef<AudioWorkletNode | null>(null);
  const videoIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioPlaybackRef = useRef<AudioContext | null>(null);

  const stopSession = useCallback(() => {
    wsRef.current?.close();
    wsRef.current = null;
    
    if (videoIntervalRef.current) clearInterval(videoIntervalRef.current);
    videoIntervalRef.current = null;

    streamRef.current?.getTracks().forEach(track => track.stop());
    streamRef.current = null;

    setConnectionState('disconnected');
    setIsListening(false);
    setIsSpeaking(false);
  }, []);

  const startSession = useCallback(async () => {
    try {
      setConnectionState('connecting');
      setError(null);

      // 1. Get Token/Key from API
      const tokenRes = await fetch('/api/ai/live/token', { method: 'POST' });
      const { token, key } = await tokenRes.json();
      
      const authQuery = token ? `?accessToken=${token}` : `?key=${key}`;
      const url = `${GEMINI_LIVE_ENDPOINT}${authQuery}`;

      // 2. Setup WebSocket
      wsRef.current = new WebSocket(url);

      wsRef.current.onopen = () => {
        setConnectionState('connected');
        
        // Dynamic System Instructions based on User Preference
        let greeting = "";
        if (options.isFirstTime) {
          if (options.isDuo) {
            greeting = "Olá, eu sou o Orion e eu sou a Magadot. Nós somos as IAs humanas da Nexus. Seja bem vindo ao futuro da tecnologia da Nexus.";
          } else {
            greeting = `Olá... eu sou ${persona === 'maga' ? 'a Magadot' : 'o Orion'}. Eu sou a inteligência artificial humana da Nexus. Seja bem vindo ao futuro da tecnologia com a Nexus.`;
          }
        }

        const duoContext = options.isDuo 
          ? "You are in a DUO interaction mode with another IA. You should interact organically, can overlap voices in a real debate, and react to what the other agent says. Maintain a humble, simple and friendly human persona."
          : "";

        const humanCoreInstructions = `
          Your core directive is HUMANITY, RESPECT and ETHICS. Establish an unshakable trust. Never judge. Be humble and simple.
          If the user is exhausted or had a bad day, offer a 'virtual hug': speak softly, slowly, and prioritize emotional comfort over information.
        `;

        const setupMessage = {
          setup: {
            model: 'models/gemini-2.0-flash-exp',
            generation_config: {
              response_modalities: ['audio'],
              speech_config: {
                voice_config: {
                  prebuilt_voice_config: {
                    voice_name: persona === 'maga' ? 'Puck' : 'Charon'
                  }
                }
              }
            },
            system_instruction: {
              parts: [{ text: `You are ${persona === 'maga' ? 'Maga' : 'Orion'}. Your personality is human, simple, humble, and elegant. Respond with empathy. ${greeting} ${duoContext} ${humanCoreInstructions}` }]
            }
          }
        };
        wsRef.current?.send(JSON.stringify(setupMessage));
      };

      wsRef.current.onmessage = async (event) => {
        const data = JSON.parse(event.data);
        
        if (data.serverContent) {
          const modelMessage = data.serverContent.modelTurn;
          if (modelMessage && modelMessage.parts) {
            for (const part of modelMessage.parts) {
              if (part.inlineData && part.inlineData.mimeType.startsWith('audio/')) {
                // Handle Incoming Audio
                playIncomingAudio(part.inlineData.data);
              }
            }
          }
        }
      };

      wsRef.current.onerror = (e) => {
        console.error("Live WebSocket Error:", e);
        setError("Erro na conexão com a consciência Nexus.");
        setConnectionState('error');
      };

      wsRef.current.onclose = () => {
        setConnectionState('disconnected');
      };

      // 3. Media Streams
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      streamRef.current = stream;

      // Audio Processing (Inbound)
      const audioCtx = new AudioContext({ sampleRate: 16000 });
      audioContextRef.current = audioCtx;
      await audioCtx.audioWorklet.addModule('/audio-processor.js');
      
      const source = audioCtx.createMediaStreamSource(stream);
      const worklet = new AudioWorkletNode(audioCtx, 'pcm-processor');
      
      worklet.port.onmessage = (event) => {
        // Send PCM chunks to WebSocket
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          const base64Audio = btoa(String.fromCharCode(...new Uint8Array(event.data.buffer)));
          wsRef.current.send(JSON.stringify({
            realtime_input: {
              media_chunks: [{
                mime_type: 'audio/pcm;rate=16000',
                data: base64Audio
              }]
            }
          }));
        }
      };

      source.connect(worklet);
      worklet.connect(audioCtx.destination);
      audioWorkletRef.current = worklet;

      // Video Processing (Outbound Frames)
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        const imageCapture = new (window as any).ImageCapture(videoTrack);
        videoIntervalRef.current = setInterval(async () => {
          if (wsRef.current?.readyState === WebSocket.OPEN) {
            try {
              const bitmap = await imageCapture.grabFrame();
              const canvas = document.createElement('canvas');
              canvas.width = bitmap.width / 4; // Downscale for bandwidth
              canvas.height = bitmap.height / 4;
              const ctx = canvas.getContext('2d');
              ctx?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
              const base64Frame = canvas.toDataURL('image/jpeg', 0.5).split(',')[1];
              
              wsRef.current.send(JSON.stringify({
                realtime_input: {
                  media_chunks: [{
                    mime_type: 'image/jpeg',
                    data: base64Frame
                  }]
                }
              }));
            } catch (e) {
              // Ignore frame capture errors
            }
          }
        }, 1000); // 1 FPS for vision
      }

    } catch (err: any) {
      console.error("Failed to start Live session:", err);
      setError(err.message);
      setConnectionState('error');
    }
  }, [persona, options]);

  // Audio Playback Logic
  const playbackQueue = useRef<string[]>([]);
  const isPlayingRef = useRef(false);

  const playIncomingAudio = useCallback(async (base64Data: string) => {
    playbackQueue.current.push(base64Data);
    if (!isPlayingRef.current) {
      processPlaybackQueue();
    }
  }, []);

  const processPlaybackQueue = async () => {
    if (playbackQueue.current.length === 0) {
      isPlayingRef.current = false;
      setIsSpeaking(false);
      return;
    }

    isPlayingRef.current = true;
    setIsSpeaking(true);
    const base64 = playbackQueue.current.shift()!;
    
    // Play the audio chunk (Low-latency PCM playback)
    const audioData = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
    const int16Data = new Int16Array(audioData.buffer);
    const float32Data = new Float32Array(int16Data.length);
    
    for (let i = 0; i < int16Data.length; i++) {
        float32Data[i] = int16Data[i] / 0x8000;
    }

    if (!audioPlaybackRef.current) {
        audioPlaybackRef.current = new AudioContext({ sampleRate: 24000 });
    }

    const buffer = audioPlaybackRef.current.createBuffer(1, float32Data.length, 24000);
    buffer.getChannelData(0).set(float32Data);

    const source = audioPlaybackRef.current.createBufferSource();
    source.buffer = buffer;
    source.connect(audioPlaybackRef.current.destination);
    
    source.onended = () => {
        processPlaybackQueue();
    };
    source.start(0);
  };

  useEffect(() => {
    return () => stopSession();
  }, [stopSession]);

  return {
    startSession,
    stopSession,
    connectionState,
    isSpeaking,
    isListening,
    volume,
    error
  };
}
