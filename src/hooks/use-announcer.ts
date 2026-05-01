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
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isSpeakingRef = useRef(false);
  const queueRef = useRef<QueueItem[]>([]);

  queueRef.current = queue;

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

  // Play physical audio URL
  const playAudioUrl = useCallback(async (url: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (audioRef.current) {
        audioRef.current.pause();
      }

      const audio = new Audio(url);
      audioRef.current = audio;

      audio.onended = () => resolve();
      audio.onerror = () => reject(new Error('Audio playback error'));
      audio.play().catch(reject);
    });
  }, []);

  // Speak a text via TTS
  const speakText = useCallback(async (text: string, voiceOverride?: 'female' | 'male'): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, gender: voiceOverride || station.gender }),
        });

        if (!res.ok) throw new Error('TTS error');

        const blob = await res.blob();
        const url = URL.createObjectURL(blob);

        if (audioRef.current) {
          audioRef.current.pause();
          URL.revokeObjectURL(audioRef.current.src);
        }

        const audio = new Audio(url);
        audioRef.current = audio;

        audio.onended = () => {
          URL.revokeObjectURL(url);
          resolve();
        };
        audio.onerror = () => reject(new Error('Audio playback error'));
        audio.play();
      } catch (err) {
        reject(err);
      }
    });
  }, [station.gender]);

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
        await playAudioUrl(pending.audioUrl);
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
        text,
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

  // Stop audio
  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    isSpeakingRef.current = false;
    setIsSpeaking(false);
    setQueue(prev => prev.filter(q => q.status === 'pending').map(q => ({ ...q })));
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

  return { queue, weather, isSpeaking, log, enqueue, stop, fetchWeather };
}
