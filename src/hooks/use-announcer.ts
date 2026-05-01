'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

export interface StationConfig {
  name: string;
  frequency: string;
  city: string;
  slogan: string;
  gender: 'female' | 'male';
  manualTemp?: number | null;
}

export type AnnounceType = 'time' | 'temp' | 'forecast' | 'station-id' | 'next-track' | 'custom' | 'jingle' | 'music';

export interface QueueItem {
  id: string;
  type: AnnounceType;
  label: string;
  text?: string;
  audioUrl?: string;
  voiceOverride?: 'female' | 'male';
  scheduledAt?: Date;
  status: 'pending' | 'speaking' | 'done' | 'error';
  announcement?: string;
}

export interface WeatherData {
  current: {
    temp: number;
    feels_like: number;
    description: string;
    humidity: number;
    city: string;
    country: string;
  };
  forecast: Array<{
    date: string;
    min: number;
    max: number;
    description: string;
    rain_probability: number;
  }>;
}

function generateId() {
  return Math.random().toString(36).slice(2, 9);
}

function getScheduleLabel(type: AnnounceType): string {
  const labels: Record<AnnounceType, string> = {
    'time': '⏰ Hora',
    'temp': '🌡️ Temperatura',
    'forecast': '🌦️ Previsão',
    'station-id': '📡 ID da Rádio',
    'next-track': '🎵 Próxima Faixa',
    'custom': '📢 Anúncio',
    'jingle': '🎶 Vinheta',
    'music': '🎧 Música',
  };
  return labels[type];
}

export function useAnnouncer(station: StationConfig) {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [log, setLog] = useState<Array<{ time: string; text: string; type: AnnounceType }>>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const isSpeakingRef = useRef(false);
  const queueRef = useRef<QueueItem[]>([]);

  queueRef.current = queue;
  const [playbackTime, setPlaybackTime] = useState({ current: 0, duration: 0 });
  const [playbackStatus, setPlaybackStatus] = useState<'playing' | 'paused' | 'stopped'>('stopped');
  const activeAudioRef = useRef<HTMLAudioElement | null>(null);
  const activeSourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const activeGainRef = useRef<GainNode | null>(null);
  const skipSignalRef = useRef<(() => void) | null>(null);


  const getAudioContext = useCallback(() => {
    if (typeof window === 'undefined') return null as any;
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
    return audioContextRef.current;
  }, []);

  // Constants for crossfade
  const CROSSFADE_TIME = 5; // seconds before end to start next
  const FADE_DURATION = 2.5; // duration of volume ramp


  // Fetch weather
  const fetchWeather = useCallback(async () => {
    if (!station.city) return;
    try {
      const res = await fetch(`/api/weather?city=${encodeURIComponent(station.city)}`);
      if (res.ok) {
        const data = await res.json();
        setWeather(data);
      }
    } catch (e) {
      console.error('Weather fetch error', e);
    }
  }, [station.city]);

  useEffect(() => {
    fetchWeather();
    const interval = setInterval(fetchWeather, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchWeather]);

  // Generate announcement text
  const generateAnnouncement = useCallback(async (
    type: AnnounceType,
    extra?: { artist?: string; song?: string; text?: string }
  ): Promise<string> => {
    const body: Record<string, unknown> = { type, station, ...extra };
    if (type === 'temp' && station.manualTemp != null) {
      body.manualTemp = station.manualTemp;
    }
    const res = await fetch('/api/announce', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return data.announcement as string;
  }, [station]);

  // Play physical audio URL with fading and crossfade support
  const playAudioUrl = useCallback(async (url: string, type: AnnounceType = 'music'): Promise<void> => {
    const ctx = getAudioContext();
    const isMusic = type === 'music';
    
    console.log(`[AudioEngine] Playing ${type}: ${url}`);

    return new Promise((resolve, reject) => {
      const audio = new Audio(url);
      audio.crossOrigin = "anonymous";
      activeAudioRef.current = audio;
      
      const source = ctx.createMediaElementSource(audio);
      const gain = ctx.createGain();

      // --- AGC (Automatic Gain Control) / Normalizer ---
      // Boosts quiet sounds and compresses loud peaks
      const preGain = ctx.createGain();
      preGain.gain.value = 2.5; // Boost everything to make quiet tracks louder

      const compressor = ctx.createDynamicsCompressor();
      compressor.threshold.value = -20; // Start compressing at -20dB
      compressor.knee.value = 15;       // Soft knee for smooth transition
      compressor.ratio.value = 8;       // High ratio to heavily squash peaks
      compressor.attack.value = 0.005;  // Fast attack to catch loud transients quickly
      compressor.release.value = 0.25;  // Smooth release

      activeSourceRef.current = source;
      activeGainRef.current = gain;
      
      // Pipeline: Audio -> Pre-Gain (boost) -> Compressor (squash peaks) -> Fader Gain (crossfades) -> Speakers
      source.connect(preGain);
      preGain.connect(compressor);
      compressor.connect(gain);
      gain.connect(ctx.destination);

      // Dedicated skip signal for this promise (Smart Crossfade Skip)
      skipSignalRef.current = () => {
        if (activeAudioRef.current !== audio) return;
        
        const crossfadeOnSkipDuration = 2.5; // Smooth 2.5s crossfade when skipping
        const now = ctx.currentTime;

        // 1. Start fading out the current song
        gain.gain.setValueAtTime(gain.gain.value, now);
        gain.gain.linearRampToValueAtTime(0, now + crossfadeOnSkipDuration);

        // 2. Resolve the promise IMMEDIATELY to trigger the next track in the queue
        resolve();

        // 3. Keep the current audio playing in the background until it's fully faded out
        setTimeout(() => {
          audio.pause();
          try {
            source.disconnect();
            preGain.disconnect();
            compressor.disconnect();
            gain.disconnect();
          } catch (e) {
            // Context might be closed or already disconnected
          }
        }, crossfadeOnSkipDuration * 1000);
      };

      audio.oncanplay = () => {
        const duration = audio.duration;
        const startTime = ctx.currentTime;
        
        // If it's a very short file (< 15s), treat as jingle even if tagged otherwise
        const effectiveIsMusic = isMusic && duration > 15;

        setPlaybackTime({ current: 0, duration });
        setPlaybackStatus('playing');
        
        if (effectiveIsMusic) {
          // Fade In only for music
          gain.gain.setValueAtTime(0, startTime);
          gain.gain.linearRampToValueAtTime(1, startTime + FADE_DURATION);
        } else {
          gain.gain.setValueAtTime(1, startTime);
        }

        const checkCrossfade = () => {
          if (activeAudioRef.current === audio) {
            setPlaybackTime({ current: audio.currentTime, duration: audio.duration });
          }
          
          // Crossfade only for music
          if (effectiveIsMusic && duration > CROSSFADE_TIME * 2) {
            if (duration - audio.currentTime <= CROSSFADE_TIME) {
              audio.removeEventListener('timeupdate', checkCrossfade);
              
              const fadeOutStart = ctx.currentTime;
              gain.gain.setValueAtTime(gain.gain.value, fadeOutStart);
              gain.gain.linearRampToValueAtTime(0, fadeOutStart + FADE_DURATION);
              
              resolve(); 
            }
          }
        };

        audio.addEventListener('timeupdate', checkCrossfade);
        audio.play().catch(reject);
      };

      audio.onended = () => {
        // CRITICAL: Only clear refs if this audio is still the active one
        if (activeAudioRef.current === audio) {
          skipSignalRef.current = null;
          setPlaybackStatus('stopped');
          setPlaybackTime({ current: 0, duration: 0 });
          activeAudioRef.current = null;
        }
        resolve();
        source.disconnect();
        preGain.disconnect();
        compressor.disconnect();
        gain.disconnect();
      };
      
      audio.onerror = () => {
        if (activeAudioRef.current === audio) {
          skipSignalRef.current = null;
          setPlaybackStatus('stopped');
          activeAudioRef.current = null;
        }
        reject(new Error('Audio playback error'));
      };
    });
  }, [getAudioContext]);




  // Speak a text via TTS
  const speakText = useCallback(async (text: string, voiceOverride?: 'female' | 'male'): Promise<void> => {
    const ctx = getAudioContext();
    
    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, gender: voiceOverride || station.gender }),
      });

      if (!res.ok) throw new Error('TTS error');

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      return new Promise((resolve, reject) => {
        const audio = new Audio(url);
        const source = ctx.createMediaElementSource(audio);
        const gain = ctx.createGain();
        
        source.connect(gain);
        gain.connect(ctx.destination);

        // Simple fade in for voice
        audio.oncanplay = () => {
          gain.gain.setValueAtTime(0, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(1, ctx.currentTime + 0.5);
          audio.play().catch(reject);
        };

        audio.onended = () => {
          URL.revokeObjectURL(url);
          source.disconnect();
          gain.disconnect();
          resolve();
        };
        
        audio.onerror = () => reject(new Error('TTS playback error'));
      });
    } catch (err) {
      throw err;
    }
  }, [getAudioContext, station.gender]);


  // Process queue
  const processQueue = useCallback(async () => {
    if (isSpeakingRef.current) return;
    const pending = queueRef.current.find(q => q.status === 'pending');
    if (!pending) return;

    isSpeakingRef.current = true;
    setIsSpeaking(true);

    setQueue(prev => prev.map(q =>
      q.id === pending.id ? { ...q, status: 'speaking' } : q
    ));

    try {
      let text = pending.announcement || '';

      if (pending.type === 'jingle' || pending.type === 'music') {
        if (!pending.audioUrl) throw new Error('Missing audio URL');
        await playAudioUrl(pending.audioUrl, pending.type);
        text = pending.label; // Just to log
      } else {
        text = pending.announcement || await generateAnnouncement(
          pending.type,
          pending.text ? { text: pending.text } : undefined
        );
        await speakText(text, pending.voiceOverride);
      }

      const now = new Date();
      setLog(prev => [{
        time: now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        text: text || pending.label || 'Áudio sem título',
        type: pending.type,
      }, ...prev].slice(0, 50));

      setQueue(prev => prev.map(q =>
        q.id === pending.id ? { ...q, status: 'done', announcement: text } : q
      ));

      // Remove done items after 3s
      setTimeout(() => {
        setQueue(prev => prev.filter(q => q.id !== pending.id));
      }, 3000);

    } catch {
      setQueue(prev => prev.map(q =>
        q.id === pending.id ? { ...q, status: 'error' } : q
      ));
      setTimeout(() => {
        setQueue(prev => prev.filter(q => q.id !== pending.id));
      }, 5000);
    }

    isSpeakingRef.current = false;
    setIsSpeaking(false);
  }, [generateAnnouncement, speakText]);

  useEffect(() => {
    if (!isSpeaking) {
      processQueue();
    }
  }, [queue, isSpeaking, processQueue]);

  // Enqueue an announcement
  const enqueue = useCallback((
    type: AnnounceType,
    extra?: { label?: string; text?: string; artist?: string; song?: string; audioUrl?: string; voiceOverride?: 'female' | 'male' }
  ) => {
    const item: QueueItem = {
      id: generateId(),
      type,
      label: extra?.label || getScheduleLabel(type),
      text: extra?.text,
      audioUrl: extra?.audioUrl,
      voiceOverride: extra?.voiceOverride,
      status: 'pending',
    };
    setQueue(prev => [...prev, item]);
  }, []);

  // Stop all audio
  const stop = useCallback(() => {
    if (activeAudioRef.current) {
      activeAudioRef.current.pause();
      activeAudioRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    isSpeakingRef.current = false;
    setIsSpeaking(false);
    setPlaybackStatus('stopped');
    setQueue(prev => prev.filter(q => q.status === 'pending').map(q => ({ ...q })));
  }, []);

  const togglePause = useCallback(() => {
    if (!activeAudioRef.current) return;
    if (playbackStatus === 'playing') {
      activeAudioRef.current.pause();
      setPlaybackStatus('paused');
    } else {
      activeAudioRef.current.play();
      setPlaybackStatus('playing');
    }
  }, [playbackStatus]);

  const skipNext = useCallback(() => {
    if (skipSignalRef.current) {
      skipSignalRef.current();
    }
  }, []);

  const restartTrack = useCallback(() => {
    if (activeAudioRef.current) {
      activeAudioRef.current.currentTime = 0;
    }
  }, []);

  // Scheduler
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const min = now.getMinutes();
      const sec = now.getSeconds();

      if (sec !== 0) return;

      // Every hour: temp
      if (min === 0) {
        enqueue('temp');
      }

      // Every 30 min: time + station ID
      if (min === 0 || min === 30) {
        if (min !== 0) {
          enqueue('time');
        }
      }

      // Forecast: midnight, 6h, 12h, 18h
      if (min === 0 && [0, 6, 12, 18].includes(now.getHours())) {
        enqueue('forecast');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [enqueue]);

  return { 
    queue, 
    weather, 
    isSpeaking, 
    log, 
    enqueue, 
    stop, 
    fetchWeather,
    playbackTime,
    playbackStatus,
    togglePause,
    skipNext,
    restartTrack
  };
}
