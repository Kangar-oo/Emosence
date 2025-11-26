export type Role = 'user' | 'model';
export type EmotionType = 'Happy' | 'Neutral' | 'Sad' | 'Anxious' | 'Angry' | 'Excited' | 'Tired' | 'Surprise' | 'Disgust' | 'Fear';

export interface Message {
  id: string;
  role: Role;
  text: string;
  timestamp: number;
}

export interface AnalysisResult {
  text: string;
  mood: EmotionType;
  analysis: string;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  userText: string;
  modelResponse: string;
  detectedMood: EmotionType;
  moodAnalysis: string;
}

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}