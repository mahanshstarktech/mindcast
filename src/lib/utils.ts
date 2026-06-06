import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { DailyEntry, TriggerTag, WeeklyStats } from '@/types';
import { getWeatherEmoji } from '@/lib/weatherLogic';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function sanitizeInput(input: string): string {
  return input
    .replace(/<[^>]*>/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim()
    .slice(0, 500);
}

export function safeLoadEntries(raw: unknown): DailyEntry[] {
  try {
    const parsed = JSON.parse(typeof raw === 'string' ? raw : '[]');
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item: unknown) => {
      try {
        const entry = item as Record<string, unknown>;
        return (
          typeof entry.id === 'string' &&
          typeof entry.date === 'string' &&
          typeof entry.mood === 'number' &&
          (entry.mood as number) >= 1 &&
          (entry.mood as number) <= 5
        );
      } catch {
        return false;
      }
    }) as DailyEntry[];
  } catch {
    return [];
  }
}

export function getTodayDateString(): string {
  return new Date().toISOString().split('T')[0];
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-IN', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

export function getWeekdayName(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-IN', { weekday: 'long' });
}

export function computeWeeklyStats(entries: DailyEntry[]): WeeklyStats {
  if (entries.length === 0) {
    return {
      avgMood: 0,
      peakStressDay: '',
      recoveryStreak: 0,
      topTriggers: [],
      moodTrend: [],
    };
  }

  const totalMood = entries.reduce((sum, e) => sum + e.mood, 0);
  const avgMood = Math.round((totalMood / entries.length) * 10) / 10;

  const lowestEntry = entries.reduce((min, e) =>
    e.mood < min.mood ? e : min
  );
  const peakStressDay = getWeekdayName(lowestEntry.date);

  let recoveryStreak = 0;
  const reversed = [...entries].reverse();
  for (const entry of reversed) {
    if (entry.mood >= 3) recoveryStreak++;
    else break;
  }

  const triggerFreq: Record<string, number> = {};
  entries.forEach((e) =>
    e.triggers.forEach((t) => {
      triggerFreq[t] = (triggerFreq[t] ?? 0) + 1;
    })
  );
  const topTriggers = Object.entries(triggerFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([tag, count]) => ({ tag: tag as TriggerTag, count }));

  const moodTrend = entries.map((e) => ({
    date: formatDate(e.date),
    mood: e.mood,
    weatherEmoji: getWeatherEmoji(e.weatherState),
  }));

  return {
    avgMood,
    peakStressDay,
    recoveryStreak,
    topTriggers,
    moodTrend,
  };
}
