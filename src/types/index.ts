export type MoodLevel = 1 | 2 | 3 | 4 | 5;

export type WeatherState =
  | 'sunny'
  | 'partly-cloudy'
  | 'rainy'
  | 'stormy'
  | 'hurricane';

export type TriggerTag =
  | 'syllabus-pressure'
  | 'comparison'
  | 'sleep-loss'
  | 'mock-test'
  | 'family-pressure'
  | 'time-scarcity'
  | 'self-doubt'
  | 'social-media'
  | 'fear-of-failure'
  | 'revision-overload';

export interface DailyEntry {
  id: string;
  date: string;
  mood: MoodLevel;
  triggers: TriggerTag[];
  note: string;
  reflection: string;
  weatherState: WeatherState;
  timestamp: number;
}

export interface Recommendation {
  id: string;
  emoji: string;
  title: string;
  description: string;
  ctaLabel?: string;
  ctaAction?: 'reset-mode' | 'reflect' | 'breathe';
  priority: 'high' | 'medium' | 'low';
}

export interface WeeklyStats {
  avgMood: number;
  peakStressDay: string;
  recoveryStreak: number;
  topTriggers: Array<{ tag: TriggerTag; count: number }>;
  moodTrend: Array<{ date: string; mood: number; weatherEmoji: string }>;
}

export const WEATHER_CONFIG: Record<
  WeatherState,
  { emoji: string; label: string; color: string; moodLevel: MoodLevel }
> = {
  sunny: {
    emoji: '☀️',
    label: 'Clear Skies — "You\'re in flow"',
    color: '#06B6D4',
    moodLevel: 5,
  },
  'partly-cloudy': {
    emoji: '🌤',
    label: 'Partly Cloudy — "Mostly steady"',
    color: '#22C55E',
    moodLevel: 4,
  },
  rainy: {
    emoji: '🌧',
    label: 'Light Rain — "Some turbulence"',
    color: '#EAB308',
    moodLevel: 3,
  },
  stormy: {
    emoji: '⛈',
    label: 'Storm Warning — "Rough weather"',
    color: '#F97316',
    moodLevel: 2,
  },
  hurricane: {
    emoji: '🌀',
    label: 'Hurricane — "Seek shelter now"',
    color: '#EF4444',
    moodLevel: 1,
  },
};

export const TRIGGER_LABELS: Record<TriggerTag, { emoji: string; label: string }> = {
  'syllabus-pressure': { emoji: '📚', label: 'Syllabus Pressure' },
  comparison: { emoji: '👥', label: 'Comparison Trap' },
  'sleep-loss': { emoji: '😴', label: 'Sleep Debt' },
  'mock-test': { emoji: '📝', label: 'Mock Test Anxiety' },
  'family-pressure': { emoji: '👨‍👩‍👧', label: 'Family Pressure' },
  'time-scarcity': { emoji: '⏳', label: 'Time Crunch' },
  'self-doubt': { emoji: '💭', label: 'Self-Doubt Spiral' },
  'social-media': { emoji: '📱', label: 'Social Media' },
  'fear-of-failure': { emoji: '😨', label: 'Fear of Failure' },
  'revision-overload': { emoji: '🔁', label: 'Revision Overload' },
};
