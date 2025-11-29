
export enum ScreenName {
  LANDING = 'LANDING',
  LOGIN = 'LOGIN',
  STRESS_ASSESSMENT = 'STRESS_ASSESSMENT',
  JOURNALIST_INTRO = 'JOURNALIST_INTRO',
  REGISTRATION = 'REGISTRATION',
  SELECTION = 'SELECTION',
  SESSION = 'SESSION',
  REPORT = 'REPORT'
}

export enum ActivityType {
  READING = 'Reading',
  GAMING = 'Gaming',
  MEDITATING = 'Meditating',
  WALKING = 'Walking',
  LISTENING = 'Music',
  BREATHING = 'Breathing'
}

export interface SessionRecord {
  id: string;
  activity: ActivityType;
  durationSeconds: number;
  timestamp: Date;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isThinking?: boolean;
}

export enum AIMode {
  STANDARD = 'standard',
  FAST = 'fast',
  THINKING = 'thinking'
}