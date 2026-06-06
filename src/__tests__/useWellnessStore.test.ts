import { useWellnessStore } from '@/store/useWellnessStore';
import type { MoodLevel } from '@/types';

// Reset store before each test
beforeEach(() => {
  useWellnessStore.setState({ entries: [], isResetMode: false });
});

// Mock crypto.randomUUID
Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: () => 'test-uuid-' + Math.random().toString(36).slice(2),
  },
});

describe('useWellnessStore', () => {
  it('adds entry and computes weatherState correctly', () => {
    const store = useWellnessStore.getState();
    store.addEntry({
      mood: 5 as MoodLevel,
      triggers: [],
      note: 'Great day',
      reflection: '',
    });

    const entries = useWellnessStore.getState().entries;
    expect(entries).toHaveLength(1);
    expect(entries[0].weatherState).toBe('sunny');
    expect(entries[0].mood).toBe(5);
  });

  it('replaces same-day entry on re-submit', () => {
    const store = useWellnessStore.getState();
    store.addEntry({
      mood: 3 as MoodLevel,
      triggers: [],
      note: 'First',
      reflection: '',
    });
    store.addEntry({
      mood: 5 as MoodLevel,
      triggers: [],
      note: 'Updated',
      reflection: '',
    });

    const entries = useWellnessStore.getState().entries;
    expect(entries).toHaveLength(1);
    expect(entries[0].mood).toBe(5);
    expect(entries[0].note).toBe('Updated');
  });

  it('getWeeklyEntries returns only last 7 days', () => {
    const store = useWellnessStore.getState();

    // Add an old entry (8 days ago)
    useWellnessStore.setState({
      entries: [
        {
          id: 'old',
          date: '2025-05-28',
          mood: 3 as MoodLevel,
          triggers: [],
          note: '',
          reflection: '',
          weatherState: 'rainy',
          timestamp: Date.now() - 8 * 24 * 60 * 60 * 1000,
        },
      ],
    });

    // Add a recent entry
    store.addEntry({
      mood: 4 as MoodLevel,
      triggers: [],
      note: 'Recent',
      reflection: '',
    });

    const weekly = useWellnessStore.getState().getWeeklyEntries();
    expect(weekly).toHaveLength(1);
    expect(weekly[0].note).toBe('Recent');
  });

  it('getStreakDays counts consecutive mood >= 3 days', () => {
    useWellnessStore.setState({
      entries: [
        {
          id: '1',
          date: '2025-06-04',
          mood: 4 as MoodLevel,
          triggers: [],
          note: '',
          reflection: '',
          weatherState: 'partly-cloudy',
          timestamp: Date.now() - 2 * 86400000,
        },
        {
          id: '2',
          date: '2025-06-05',
          mood: 3 as MoodLevel,
          triggers: [],
          note: '',
          reflection: '',
          weatherState: 'rainy',
          timestamp: Date.now() - 86400000,
        },
        {
          id: '3',
          date: '2025-06-06',
          mood: 5 as MoodLevel,
          triggers: [],
          note: '',
          reflection: '',
          weatherState: 'sunny',
          timestamp: Date.now(),
        },
      ],
    });

    expect(useWellnessStore.getState().getStreakDays()).toBe(3);
  });

  it('getStreakDays resets streak on mood < 3 day', () => {
    useWellnessStore.setState({
      entries: [
        {
          id: '1',
          date: '2025-06-04',
          mood: 4 as MoodLevel,
          triggers: [],
          note: '',
          reflection: '',
          weatherState: 'partly-cloudy',
          timestamp: Date.now() - 2 * 86400000,
        },
        {
          id: '2',
          date: '2025-06-05',
          mood: 2 as MoodLevel,
          triggers: [],
          note: '',
          reflection: '',
          weatherState: 'stormy',
          timestamp: Date.now() - 86400000,
        },
        {
          id: '3',
          date: '2025-06-06',
          mood: 5 as MoodLevel,
          triggers: [],
          note: '',
          reflection: '',
          weatherState: 'sunny',
          timestamp: Date.now(),
        },
      ],
    });

    // Most recent is mood 5, so streak is 1 (only the latest)
    expect(useWellnessStore.getState().getStreakDays()).toBe(1);
  });
});
