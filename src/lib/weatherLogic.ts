import type { MoodLevel, WeatherState } from '@/types';

/** Maps a numeric mood level (1–5) to its corresponding weather state. */
export function getMoodWeather(mood: MoodLevel): WeatherState {
  const map: Record<MoodLevel, WeatherState> = {
    5: 'sunny',
    4: 'partly-cloudy',
    3: 'rainy',
    2: 'stormy',
    1: 'hurricane',
  };
  return map[mood];
}

/** Returns the emoji character for a given weather state. */
export function getWeatherEmoji(weather: WeatherState): string {
  const map: Record<WeatherState, string> = {
    sunny: '☀️',
    'partly-cloudy': '🌤',
    rainy: '🌧',
    stormy: '⛈',
    hurricane: '🌀',
  };
  return map[weather];
}

/** Returns the human-readable label for a given weather state. */
export function getWeatherLabel(weather: WeatherState): string {
  const map: Record<WeatherState, string> = {
    sunny: 'Clear Skies',
    'partly-cloudy': 'Partly Cloudy',
    rainy: 'Light Rain',
    stormy: 'Storm Warning',
    hurricane: 'Hurricane',
  };
  return map[weather];
}

/** Returns the color token (hex) for a given mood level. */
export function getMoodColor(mood: MoodLevel): string {
  const map: Record<MoodLevel, string> = {
    5: '#06B6D4',
    4: '#22C55E',
    3: '#EAB308',
    2: '#F97316',
    1: '#EF4444',
  };
  return map[mood];
}
