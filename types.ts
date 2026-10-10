export enum Sender {
  User = 'user',
  Bot = 'bot',
}

export interface Message {
  id: string;
  text: string;
  sender: Sender;
  timestamp?: Date;
  status?: 'sending' | 'sent' | 'error';
  exercisePrompt?: 'breathing' | 'mindfulness' | 'muscle';
  category?: 'chat' | 'mood' | 'journal' | 'exercise' | 'crisis';
}

export enum Mood {
  Happy = 'Happy',
  Content = 'Content',
  Neutral = 'Neutral',
  Sad = 'Sad',
  Anxious = 'Anxious',
}

export interface MoodEntry {
  id?: string;
  mood: Mood;
  timestamp: Date;
  note?: string;
}

export type ThemeMode = 'light' | 'dark' | 'system';

export interface BreathingConfig {
  name: string;
  inhale: number;
  hold1: number;
  exhale: number;
  hold2: number;
  description: string;
}
