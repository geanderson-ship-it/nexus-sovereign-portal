'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

export type VoiceEngine = 'polly' | 'azure' | 'elevenlabs';

export interface StationConfig {
  name: string;
  frequency: string;
  city: string;
  slogan: string;
  gender: 'female' | 'male';
  voiceEngine?: VoiceEngine;
  elevenLabsApiKey?: string;
  elevenLabsVoiceId?: string;
  manualTemp?: number | null;
  bgMusicUrl?: string;
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

const PRONUNCIATION_DICT: Record<string, string> = {
  'Erasure': 'Erejan', 'erasure': 'erejan',
  'A-ha': 'A-rrá', 'a-ha': 'a-rrá',
  'Queen': 'Cuín', 'U2': 'Iu Tchu',
  'Depeche Mode': 'Depéche Moud',
  'Tears for Fears': 'Tíers for Fíers',
  'Pet Shop Boys': 'Pét Chóp Bóis',
  'New Order': 'Niu Órder', 'The Cure': 'Dê Quiúr',
  'Madonna': 'Madôna', 'Michael Jackson': 'Maicou Jécson',
  'Guns N Roses': 'Gâns en Rôuses', 'Bon Jovi': 'Bon Jóvi',
  'Aerosmith': 'Érousmite', 'Nirvana': 'Nirvâna',
  'Pearl Jam': 'Pãrl Djem',
  'Red Hot Chili Peppers': 'Réd Rót Tchíli Pépers',
  'Coldplay': 'Coud-plei', 'Revival': 'Ruivaivol', 'revival': 'ruivaivol',
  'Creedence Clearwater Revival': 'Crídence Clíar-uóter Ruivaivol',
  'Sometimes': 'Somtaimes', 'sometimes': 'somtaimes',
  'Nexus': 'Nécsus', 'nexus': 'nécsus',
};

function applyPronunciationCorrections(text: string): string {
  let corrected = text;
  for (const [wrong, right] of Object.entries(PRONUNCIATION_DICT)) {
    const regex = new RegExp(`\\b${wrong}\\b`, 'gi');
    corrected = corrected.replace(regex, right);
  }
  return corrected;
}

function getScheduleLabel(type: AnnounceType): string {
  const labels: Record<AnnounceType, string> = {
    'time': '⏰ Hora', 'temp': '🌡️ Temperatura',
    'forecast': '🌦️ Previsão', 'station-id': '📡 ID da Rádio',
    'next-track': '🎵 Próxima Faixa', 'custom': '📢 Anúncio',
    'jingle': '🎶 Vinheta', 'music': '🎧 Música',
  };
  return labels[type];
}

export function useAnnouncer(station: StationConfig) {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [log, setLog] = useState<Array<{ time: string; text: string; type: AnnounceType; audioUrl?: string }>>([]);
  const [isBgPlaying, setIsBgPlaying] = useState(false);

  const audioContextRef  = useRef<AudioContext | null>(null);
  const isSpeakingRef    = useRef(false);
  const queueRef         = useRef<QueueItem[]>([]);

  // ─── Persistent BG Music Layer ───────────────────────────────────────────
  const bgAudioRef   = useRef<HTMLAudioElement | null>(null);
  const bgSourceRef  = useRef<MediaElementAudioSourceNode | null>(null);
  const bgGainRef    = useRef<GainNode | null>(null);
  const bgVolumeRef  = useRef(0.5); // volume alvo (0–1), controlado pelo slider
  const bgMutedRef   = useRef(false); // true quando silenciado por música/jingle
  // ─────────────────────────────────────────────────────────────────────────

  queueRef.current = queue;

  const [playbackTime, setPlaybackTime]     = useState({ current: 0, duration: 0 });
  const [playbackStatus, setPlaybackStatus] = useState<'playing' | 'paused' | 'stopped'>('stopped');
  const activeAudioRef  = useRef<HTMLAudioElement | null>(null);
  const activeSourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const activeGainRef   = useRef<GainNode | null>(null);
  const skipSignalRef   = useRef<(() => void) | null>(null);

  const CROSSFADE_TIME  = 3.0;
  const FADE_DURATION   = 3.0;

  // ─── AudioContext ─────────────────────────────────────────────────────────
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

  // ─── Fetch Weather ────────────────────────────────────────────────────────
  const fetchWeather = useCallback(async () => {
    if (!station.city) return;
    try {
      const res = await fetch(`/api/weather?city=${encodeURIComponent(station.city)}`);
      if (res.ok) setWeather(await res.json());
    } catch (e) { console.error('Weather fetch error', e); }
  }, [station.city]);

  useEffect(() => {
    fetchWeather();
    const interval = setInterval(fetchWeather, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchWeather]);

  // ─── Generate Announcement Text ───────────────────────────────────────────
  const generateAnnouncement = useCallback(async (
    type: AnnounceType,
    extra?: { artist?: string; song?: string; text?: string }
  ): Promise<string> => {
    const body: Record<string, unknown> = { type, station, ...extra };
    if (type === 'temp' && station.manualTemp != null) body.manualTemp = station.manualTemp;
    const res  = await fetch('/api/announce', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return data.announcement as string;
  }, [station]);

  // ─── BG Music: Para e libera recursos ────────────────────────────────────
  const stopBgMusic = useCallback(() => {
    if (bgAudioRef.current) bgAudioRef.current.pause();
    try { bgSourceRef.current?.disconnect(); } catch (_) {}
    try { bgGainRef.current?.disconnect(); } catch (_) {}
    bgAudioRef.current  = null;
    bgSourceRef.current = null;
    bgGainRef.current   = null;
    bgMutedRef.current  = false;
    setIsBgPlaying(false);
  }, []);

  // ─── BG Music: Inicia a trilha persistente ───────────────────────────────
  const startBgMusic = useCallback(() => {
    if (!station.bgMusicUrl || bgAudioRef.current) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const audio  = new Audio(station.bgMusicUrl);
    if (!station.bgMusicUrl.startsWith('blob:')) audio.crossOrigin = 'anonymous';
    audio.loop   = true;

    const source = ctx.createMediaElementSource(audio);
    const gain   = ctx.createGain();
    gain.gain.value = 0; // começa em 0 e faz fade in

    source.connect(gain);
    gain.connect(ctx.destination);

    bgAudioRef.current  = audio;
    bgSourceRef.current = source;
    bgGainRef.current   = gain;

    audio.play()
      .then(() => {
        // Fade in suave ao iniciar
        const now = ctx.currentTime;
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(bgVolumeRef.current, now + 2.0);
        setIsBgPlaying(true);
      })
      .catch(e => console.warn('[BG Music] Aguardando interação do usuário para iniciar.', e));
  }, [station.bgMusicUrl, getAudioContext]);

  // ─── BG Music: Controle de volume (slider) ───────────────────────────────
  const setBgVolume = useCallback((v: number) => {
    const clamped = Math.max(0, Math.min(1, v));
    bgVolumeRef.current = clamped;
    // Só aplica se não estiver mutado por música/jingle
    if (bgGainRef.current && !bgMutedRef.current && !isSpeakingRef.current) {
      bgGainRef.current.gain.value = clamped;
    }
  }, []);

  // ─── BG Music: Toggle manual (emergência) ────────────────────────────────
  const toggleBgMusic = useCallback(() => {
    if (bgAudioRef.current) {
      stopBgMusic();
    } else {
      startBgMusic();
    }
  }, [stopBgMusic, startBgMusic]);

  // ─── BG Music: Reativo à URL ──────────────────────────────────────────────
  useEffect(() => {
    stopBgMusic();
    if (station.bgMusicUrl) startBgMusic();
    return () => stopBgMusic();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [station.bgMusicUrl]);

  // ─── Duck: abaixa para 15% — usado ANTES da voz tocar ───────────────────
  // Chamado APENAS quando o áudio TTS já está baixado e pronto, não durante o fetch
  const duckBg = useCallback(() => {
    if (!bgGainRef.current || bgMutedRef.current) return;
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    bgGainRef.current.gain.cancelScheduledValues(now);
    bgGainRef.current.gain.setValueAtTime(bgGainRef.current.gain.value, now);
    bgGainRef.current.gain.linearRampToValueAtTime(bgVolumeRef.current * 0.12, now + 0.4);
  }, [getAudioContext]);

  // ─── Unduck: volta ao volume normal após a voz terminar ──────────────────
  const unduckBg = useCallback(() => {
    if (!bgGainRef.current || bgMutedRef.current) return;
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    bgGainRef.current.gain.cancelScheduledValues(now);
    bgGainRef.current.gain.setValueAtTime(bgGainRef.current.gain.value, now);
    bgGainRef.current.gain.linearRampToValueAtTime(bgVolumeRef.current, now + 1.8);
  }, [getAudioContext]);

  // ─── Mute: silencia completamente — usado quando música/jingle toca ──────
  const muteBg = useCallback(() => {
    if (!bgGainRef.current) return;
    bgMutedRef.current = true;
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    bgGainRef.current.gain.cancelScheduledValues(now);
    bgGainRef.current.gain.setValueAtTime(bgGainRef.current.gain.value, now);
    bgGainRef.current.gain.linearRampToValueAtTime(0, now + 1.5);
  }, [getAudioContext]);

  // ─── Unmute: restaura após música/jingle terminar ────────────────────────
  const unmuteBg = useCallback(() => {
    if (!bgGainRef.current) return;
    bgMutedRef.current = false;
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    bgGainRef.current.gain.cancelScheduledValues(now);
    bgGainRef.current.gain.setValueAtTime(bgGainRef.current.gain.value, now);
    bgGainRef.current.gain.linearRampToValueAtTime(bgVolumeRef.current, now + 2.0);
  }, [getAudioContext]);

  // ─── TTS: Fase 1 — Gera e BAIXA o áudio (BG toca em volume normal) ───────
  const fetchTTSAudio = useCallback(async (
    text: string,
    voiceOverride?: 'female' | 'male'
  ): Promise<string> => {
    const useElevenLabs = station.voiceEngine === 'elevenlabs' && station.elevenLabsVoiceId;
    const ttsUrl  = useElevenLabs ? '/api/tts/elevenlabs' : '/api/tts';
    const ttsBody = useElevenLabs
      ? { text, apiKey: station.elevenLabsApiKey, voiceId: station.elevenLabsVoiceId }
      : { text, gender: voiceOverride || station.gender };

    const res = await fetch(ttsUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ttsBody),
    });

    if (!res.ok) throw new Error('TTS fetch error');
    const blob = await res.blob();
    return URL.createObjectURL(blob);
  }, [station]);

  // ─── TTS: Fase 2 — Toca o blob pré-baixado (duck já ativo) ──────────────
  const playTTSAudio = useCallback(async (blobUrl: string): Promise<string> => {
    const ctx = getAudioContext();

    return new Promise((resolve, reject) => {
      const audio  = new Audio(blobUrl);
      const source = ctx.createMediaElementSource(audio);
      const gain   = ctx.createGain();

      source.connect(gain);
      gain.connect(ctx.destination);

      audio.oncanplay = () => {
        // Fade in suave na voz
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(1, ctx.currentTime + 0.3);
        audio.play().catch(reject);
      };

      audio.onended = () => {
        // NÃO revogar a URL aqui para que o botão de "Baixar MP3" continue funcionando no histórico
        try { source.disconnect(); gain.disconnect(); } catch (_) {}
        resolve(blobUrl);
      };

      audio.onerror = () => {
        // Também não revogar em caso de erro, caso contrário quebra a referência
        reject(new Error('TTS playback error'));
      };
    });
  }, [getAudioContext]);

  // ─── Música/Jingle: Play com fade e crossfade ─────────────────────────────
  const playAudioUrl = useCallback(async (url: string, type: AnnounceType = 'music'): Promise<void> => {
    const ctx     = getAudioContext();
    const isMusic = type === 'music';

    return new Promise((resolve, reject) => {
      const audio = new Audio(url);
      audio.crossOrigin = 'anonymous';
      activeAudioRef.current = audio;

      const source     = ctx.createMediaElementSource(audio);
      const gain       = ctx.createGain();
      const preGain    = ctx.createGain();
      const compressor = ctx.createDynamicsCompressor();

      preGain.gain.value          = 2.5;
      compressor.threshold.value  = -20;
      compressor.knee.value       = 15;
      compressor.ratio.value      = 8;
      compressor.attack.value     = 0.005;
      compressor.release.value    = 0.25;

      activeSourceRef.current = source;
      activeGainRef.current   = gain;

      source.connect(preGain);
      preGain.connect(compressor);
      compressor.connect(gain);
      gain.connect(ctx.destination);

      skipSignalRef.current = () => {
        if (activeAudioRef.current !== audio) return;
        const skipDur = 2.5;
        const now     = ctx.currentTime;
        gain.gain.setValueAtTime(gain.gain.value, now);
        gain.gain.linearRampToValueAtTime(0, now + skipDur);
        resolve();
        setTimeout(() => {
          audio.pause();
          try { source.disconnect(); preGain.disconnect(); compressor.disconnect(); gain.disconnect(); } catch (_) {}
        }, skipDur * 1000);
      };

      audio.oncanplay = () => {
        const duration        = audio.duration;
        const startTime       = ctx.currentTime;
        const effectiveIsMusic = isMusic && duration > 15;

        setPlaybackTime({ current: 0, duration });
        setPlaybackStatus('playing');

        if (effectiveIsMusic) {
          gain.gain.setValueAtTime(0, startTime);
          gain.gain.linearRampToValueAtTime(1, startTime + FADE_DURATION);
        } else {
          gain.gain.setValueAtTime(1, startTime);
        }

        const checkCrossfade = () => {
          if (activeAudioRef.current === audio) {
            setPlaybackTime({ current: audio.currentTime, duration: audio.duration });
          }
          if (effectiveIsMusic && duration > CROSSFADE_TIME * 2) {
            if (duration - audio.currentTime <= CROSSFADE_TIME) {
              audio.removeEventListener('timeupdate', checkCrossfade);
              const fo = ctx.currentTime;
              gain.gain.setValueAtTime(gain.gain.value, fo);
              gain.gain.linearRampToValueAtTime(0, fo + FADE_DURATION);
              resolve();
            }
          }
        };

        audio.addEventListener('timeupdate', checkCrossfade);
        audio.play().catch(reject);
      };

      audio.onended = () => {
        if (activeAudioRef.current === audio) {
          skipSignalRef.current = null;
          setPlaybackStatus('stopped');
          setPlaybackTime({ current: 0, duration: 0 });
          activeAudioRef.current = null;
        }
        resolve();
        try { source.disconnect(); preGain.disconnect(); compressor.disconnect(); gain.disconnect(); } catch (_) {}
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

  // ─── Process Queue ────────────────────────────────────────────────────────
  const processQueue = useCallback(async () => {
    if (isSpeakingRef.current) return;
    const pending = queueRef.current.find(q => q.status === 'pending');
    if (!pending) return;

    isSpeakingRef.current = true;
    setIsSpeaking(true);
    setQueue(prev => prev.map(q => q.id === pending.id ? { ...q, status: 'speaking' } : q));

    let text         = pending.announcement || '';
    let generatedUrl = '';

    try {
      if (pending.type === 'jingle' || pending.type === 'music') {
        // ── MÚSICA / JINGLE ──────────────────────────────────────────────
        // A BG music silencia completamente enquanto o áudio principal toca
        if (!pending.audioUrl) throw new Error('Missing audio URL');
        muteBg();
        await playAudioUrl(pending.audioUrl, pending.type);
        // Quando a música termina, a trilha retorna automaticamente
        unmuteBg();
        text = pending.label || 'Áudio';

      } else {
        // ── LOCUÇÃO TTS ──────────────────────────────────────────────────
        // FASE 1: Gera o texto (BG toca em volume NORMAL — sem silêncio!)
        text = pending.announcement || await generateAnnouncement(
          pending.type,
          pending.text ? { text: pending.text } : undefined
        );
        const spokenText = applyPronunciationCorrections(text);

        // FASE 2: Baixa o áudio TTS (BG AINDA toca em volume NORMAL!)
        // A espera da API não cria mais silêncio na programação
        let audioUrl = '';
        try {
          audioUrl = await fetchTTSAudio(spokenText, pending.voiceOverride);
        } catch (e) {
          console.error('[TTS Fetch Error]', e);
        }

        if (audioUrl) {
          // FASE 3: Áudio pronto → duck AGORA (milissegundos antes de tocar)
          duckBg();
          // Pequena pausa pra o duck ter efeito antes da voz entrar
          await new Promise(r => setTimeout(r, 350));

          // FASE 4: Toca a voz pré-baixada
          try {
            generatedUrl = await playTTSAudio(audioUrl);
          } catch (e) {
            console.error('[TTS Play Error]', e);
          }

          // FASE 5: Voz terminou → unduck (trilha retorna suavemente)
          unduckBg();
        }
      }

      // Log
      const now = new Date();
      setLog(prev => [{
        time: now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        text: text || pending.label || 'Áudio sem título',
        type: pending.type,
        audioUrl: generatedUrl || pending.audioUrl,
      }, ...prev].slice(0, 50));

      setQueue(prev => prev.map(q =>
        q.id === pending.id ? { ...q, status: 'done', announcement: text } : q
      ));
      setTimeout(() => {
        setQueue(prev => prev.filter(q => q.id !== pending.id));
      }, 3000);

    } catch {
      setQueue(prev => prev.map(q =>
        q.id === pending.id ? { ...q, status: 'error' } : q
      ));
      // Garante unduck/unmute mesmo em caso de erro
      unduckBg();
      unmuteBg();
      setTimeout(() => {
        setQueue(prev => prev.filter(q => q.id !== pending.id));
      }, 5000);
    }

    isSpeakingRef.current = false;
    setIsSpeaking(false);
  }, [
    generateAnnouncement, fetchTTSAudio, playTTSAudio,
    duckBg, unduckBg, muteBg, unmuteBg, playAudioUrl,
  ]);

  useEffect(() => {
    if (!isSpeaking) processQueue();
  }, [queue, isSpeaking, processQueue]);

  // ─── Enqueue ──────────────────────────────────────────────────────────────
  const enqueue = useCallback((
    type: AnnounceType,
    extra?: { label?: string; text?: string; artist?: string; song?: string; audioUrl?: string; voiceOverride?: 'female' | 'male' }
  ) => {
    const item: QueueItem = {
      id: generateId(), type,
      label: extra?.label || getScheduleLabel(type),
      text: extra?.text,
      audioUrl: extra?.audioUrl,
      voiceOverride: extra?.voiceOverride,
      status: 'pending',
    };
    setQueue(prev => [...prev, item]);
  }, []);

  // ─── Stop ─────────────────────────────────────────────────────────────────
  const stop = useCallback(() => {
    if (activeAudioRef.current) {
      activeAudioRef.current.pause();
      activeAudioRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
      bgAudioRef.current  = null;
      bgSourceRef.current = null;
      bgGainRef.current   = null;
      setIsBgPlaying(false);
    }
    isSpeakingRef.current = false;
    bgMutedRef.current    = false;
    setIsSpeaking(false);
    setPlaybackStatus('stopped');
    setQueue(prev => prev.filter(q => q.status === 'pending').map(q => ({ ...q })));
  }, []);

  // ─── Player Controls ──────────────────────────────────────────────────────
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
    if (skipSignalRef.current) skipSignalRef.current();
  }, []);

  const restartTrack = useCallback(() => {
    if (activeAudioRef.current) activeAudioRef.current.currentTime = 0;
  }, []);

  // ─── Scheduler ────────────────────────────────────────────────────────────
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const min = now.getMinutes();
      const sec = now.getSeconds();
      if (sec !== 0) return;
      if (min === 0) enqueue('temp');
      if (min === 0 || min === 30) { if (min !== 0) enqueue('time'); }
      if (min === 0 && [0, 6, 12, 18].includes(now.getHours())) enqueue('forecast');
    }, 1000);
    return () => clearInterval(interval);
  }, [enqueue]);

  return {
    queue, weather, isSpeaking, log,
    enqueue, stop, fetchWeather,
    playbackTime, playbackStatus,
    togglePause, skipNext, restartTrack,
    // ─── BG Music ───
    isBgPlaying,
    startBgMusic,
    stopBgMusic,
    toggleBgMusic,
    setBgVolume,
  };
}
