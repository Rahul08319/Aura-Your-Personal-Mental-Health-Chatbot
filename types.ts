
export enum Sender {
  User = 'user',
  Bot = 'bot',
}

export interface Message {
  id: string;
  text: string;
  sender: Sender;
}

export enum Mood {
  Happy = 'Happy',
  Content = 'Content',
  Neutral = 'Neutral',
  Sad = 'Sad',
  Anxious = 'Anxious',
}

export interface MoodEntry {
  mood: Mood;
  timestamp: Date;
}
