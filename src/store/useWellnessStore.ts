import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  DailyEntry,
  MoodLevel,
  TriggerTag,
  WeeklyStats,
} from '@/types';
import { getMoodWeather } from '@/lib/weatherLogic';
import { computeWeeklyStats, sanitizeInput } from '@/lib/utils';

interface WellnessState {
  entries: DailyEntry[];
  isResetMode: boolean;
  // Actions
  addEntry: (data: {
    mood: MoodLevel;
    triggers: TriggerTag[];
    note: string;
    reflection: string;
  }) => void;
  updateTodayReflection: (reflection: string) => void;
  toggleResetMode: () => void;
  // Computed getters
  getTodayEntry: () => DailyEntry | null;
  getWeeklyEntries: () => DailyEntry[];
  getWeeklyStats: () => WeeklyStats;
  getStreakDays: () => number;
}

export const useWellnessStore = create<WellnessState>()(
  persist(
    (set, get) => ({
      entries: [],
      isResetMode: false,

      addEntry: ({ mood, triggers, note, reflection }) => {
        const today = new Date().toISOString().split('T')[0];
        const newEntry: DailyEntry = {
          id: crypto.randomUUID(),
          date: today,
          mood,
          triggers,
          note: sanitizeInput(note),
          reflection: sanitizeInput(reflection),
          weatherState: getMoodWeather(mood),
          timestamp: Date.now(),
        };
        set((state) => ({
          entries: [
            ...state.entries.filter((e) => e.date !== today),
            newEntry,
          ],
        }));
      },

      updateTodayReflection: (reflection) => {
        const today = new Date().toISOString().split('T')[0];
        set((state) => ({
          entries: state.entries.map((e) =>
            e.date === today
              ? { ...e, reflection: sanitizeInput(reflection) }
              : e
          ),
        }));
      },

      toggleResetMode: () =>
        set((state) => ({ isResetMode: !state.isResetMode })),

      getTodayEntry: () => {
        const today = new Date().toISOString().split('T')[0];
        return get().entries.find((e) => e.date === today) ?? null;
      },

      getWeeklyEntries: () => {
        const now = Date.now();
        const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
        return get()
          .entries.filter((e) => e.timestamp >= sevenDaysAgo)
          .sort((a, b) => a.timestamp - b.timestamp);
      },

      getWeeklyStats: () => computeWeeklyStats(get().getWeeklyEntries()),

      getStreakDays: () => {
        const sorted = [...get().entries].sort(
          (a, b) => b.timestamp - a.timestamp
        );
        let streak = 0;
        for (const entry of sorted) {
          if (entry.mood >= 3) streak++;
          else break;
        }
        return streak;
      },
    }),
    {
      name: 'mindcast-wellness-v1',
      partialize: (state) => ({ entries: state.entries }),
    }
  )
);
