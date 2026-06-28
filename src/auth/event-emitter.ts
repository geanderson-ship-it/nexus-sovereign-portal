'use client';

import { type AIContext } from '@/lib/ai-contexts';
import type { SpeechMark } from '@/hooks/use-nexus-audio-types';

export interface AppEvents {
  'open-chat': { context: AIContext; data?: any };
  'viseme-update': { viseme: SpeechMark | null };
  'audio-level-update': { level: number };
  'play-music': { videoId: string; title?: string };
}

type Callback<T> = (data: T) => void;

function createEventEmitter<T extends Record<string, any>>() {
  const events: { [K in keyof T]?: Array<Callback<T[K]>> } = {};

  return {
    on<K extends keyof T>(eventName: K, callback: Callback<T[K]>) {
      if (!events[eventName]) events[eventName] = [];
      events[eventName]?.push(callback);
    },
    off<K extends keyof T>(eventName: K, callback: Callback<T[K]>) {
      events[eventName] = events[eventName]?.filter(cb => cb !== callback);
    },
    emit<K extends keyof T>(eventName: K, data: T[K]) {
      events[eventName]?.forEach(callback => callback(data));
    },
  };
}

export const eventEmitter = createEventEmitter<AppEvents>();
