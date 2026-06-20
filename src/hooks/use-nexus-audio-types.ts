'use client';

import type {
    VoiceProfile,
    SpeechMark
} from '@/ai/flows/text-to-speech-types';

export interface UseNexusAudioInput {
  text: string;
  voice: VoiceProfile;
  id: string | number;
  audioUrl?: string; // Add support for pre-recorded audio files
  onEnded?: () => void;
  nextTrack?: { text: string; voice: string };
}

// Re-export types that the hook might expose or use internally,
// ensuring a single source of truth.
export type {
    VoiceProfile,
    SpeechMark,
    TextToSpeechInput,
    TextToSpeechOutput
} from '@/ai/flows/text-to-speech-types';
