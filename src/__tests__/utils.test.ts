import { sanitizeInput, safeLoadEntries, computeWeeklyStats, formatDate, getTodayDateString } from '@/lib/utils';
import type { DailyEntry } from '@/types';

describe('sanitizeInput', () => {
  it('strips HTML tags', () => {
    expect(sanitizeInput('<p>Hello</p>')).toBe('Hello');
    expect(sanitizeInput('<script>Hello</script>')).toBe('Hello');
  });

  it('strips javascript: protocol', () => {
    expect(sanitizeInput('javascript:alert(1)')).toBe('alert(1)');
  });

  it('strips event handlers', () => {
    expect(sanitizeInput('test onerror=alert(1)')).toBe('test alert(1)');
  });

  it('trims whitespace', () => {
    expect(sanitizeInput('  hello  ')).toBe('hello');
  });

  it('enforces 500 char max', () => {
    const long = 'a'.repeat(600);
    expect(sanitizeInput(long).length).toBe(500);
  });

  it('handles empty string', () => {
    expect(sanitizeInput('')).toBe('');
  });
});

describe('safeLoadEntries', () => {
  it('returns empty array for invalid JSON', () => {
    expect(safeLoadEntries('not json')).toEqual([]);
  });

  it('returns empty array for non-array', () => {
    expect(safeLoadEntries('{"key":"value"}')).toEqual([]);
  });

  it('filters out entries with invalid mood', () => {
    const data = JSON.stringify([
      { id: '1', date: '2025-01-01', mood: 6, triggers: [] },
      { id: '2', date: '2025-01-02', mood: 3, triggers: [] },
    ]);
    const result = safeLoadEntries(data);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('2');
  });

  it('returns valid entries from well-formed data', () => {
    const data = JSON.stringify([
      { id: 'abc', date: '2025-06-06', mood: 4, triggers: [], note: '', reflection: '', weatherState: 'partly-cloudy', timestamp: 1000 },
    ]);
    expect(safeLoadEntries(data)).toHaveLength(1);
  });

  it('handles null input', () => {
    expect(safeLoadEntries(null)).toEqual([]);
  });
});

describe('formatDate', () => {
  it('formats date string to locale format', () => {
    const formatted = formatDate('2025-06-06');
    expect(formatted).toBeTruthy();
    expect(typeof formatted).toBe('string');
  });
});

describe('getTodayDateString', () => {
  it('returns YYYY-MM-DD format', () => {
    const result = getTodayDateString();
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe('computeWeeklyStats', () => {
  const makeEntry = (overrides: Partial<DailyEntry>): DailyEntry => ({
    id: 'test',
    date: '2025-06-06',
    mood: 3,
    triggers: [],
    note: '',
    reflection: '',
    weatherState: 'rainy',
    timestamp: Date.now(),
    ...overrides,
  });

  it('returns zeroed stats for empty entries', () => {
    const stats = computeWeeklyStats([]);
    expect(stats.avgMood).toBe(0);
    expect(stats.peakStressDay).toBe('');
    expect(stats.recoveryStreak).toBe(0);
    expect(stats.topTriggers).toEqual([]);
    expect(stats.moodTrend).toEqual([]);
  });

  it('calculates average mood correctly', () => {
    const entries = [
      makeEntry({ mood: 4 }),
      makeEntry({ mood: 2 }),
    ];
    const stats = computeWeeklyStats(entries);
    expect(stats.avgMood).toBe(3);
  });

  it('identifies peak stress day', () => {
    const entries = [
      makeEntry({ mood: 4, date: '2025-06-05' }),
      makeEntry({ mood: 1, date: '2025-06-06' }),
    ];
    const stats = computeWeeklyStats(entries);
    expect(stats.peakStressDay).toBeTruthy();
  });

  it('counts recovery streak from end', () => {
    const entries = [
      makeEntry({ mood: 1, timestamp: Date.now() - 3000 }),
      makeEntry({ mood: 3, timestamp: Date.now() - 2000 }),
      makeEntry({ mood: 4, timestamp: Date.now() - 1000 }),
    ];
    const stats = computeWeeklyStats(entries);
    expect(stats.recoveryStreak).toBe(2);
  });

  it('computes top triggers by frequency', () => {
    const entries = [
      makeEntry({ triggers: ['sleep-loss', 'comparison'] }),
      makeEntry({ triggers: ['sleep-loss'] }),
    ];
    const stats = computeWeeklyStats(entries);
    expect(stats.topTriggers[0].tag).toBe('sleep-loss');
    expect(stats.topTriggers[0].count).toBe(2);
  });

  it('generates mood trend with correct length', () => {
    const entries = [
      makeEntry({ mood: 3 }),
      makeEntry({ mood: 5 }),
    ];
    const stats = computeWeeklyStats(entries);
    expect(stats.moodTrend).toHaveLength(2);
  });
});
