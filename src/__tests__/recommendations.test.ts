import { getRecommendations } from '@/lib/recommendations';
import type { DailyEntry } from '@/types';

function makeEntry(overrides: Partial<DailyEntry> = {}): DailyEntry {
  return {
    id: 'test-id',
    date: '2025-06-06',
    mood: 3,
    triggers: [],
    note: '',
    reflection: '',
    weatherState: 'rainy',
    timestamp: Date.now(),
    ...overrides,
  };
}

describe('getRecommendations', () => {
  it('returns sleep reset for mood <= 2 + sleep-loss trigger', () => {
    const entry = makeEntry({ mood: 2, triggers: ['sleep-loss'] });
    const recs = getRecommendations([entry], entry);
    expect(recs.some((r) => r.id === 'r1')).toBe(true);
    expect(recs.find((r) => r.id === 'r1')?.title).toContain('Sleep Reset');
  });

  it('returns slow-down for 3 consecutive low-mood days', () => {
    const entries = [
      makeEntry({ mood: 1, timestamp: Date.now() - 2 * 86400000 }),
      makeEntry({ mood: 2, timestamp: Date.now() - 86400000 }),
      makeEntry({ mood: 2, timestamp: Date.now() }),
    ];
    const recs = getRecommendations(entries, entries[2]);
    expect(recs.some((r) => r.id === 'r2')).toBe(true);
  });

  it('returns pre-test routine for mock-test trigger', () => {
    const entry = makeEntry({ mood: 3, triggers: ['mock-test'] });
    const recs = getRecommendations([entry], entry);
    expect(recs.some((r) => r.id === 'r3')).toBe(true);
  });

  it('returns comparison mindset tip for comparison trigger', () => {
    const entry = makeEntry({ mood: 3, triggers: ['comparison'] });
    const recs = getRecommendations([entry], entry);
    expect(recs.some((r) => r.id === 'r4')).toBe(true);
  });

  it('returns family communication tip for family-pressure trigger', () => {
    const entry = makeEntry({ mood: 3, triggers: ['family-pressure'] });
    const recs = getRecommendations([entry], entry);
    expect(recs.some((r) => r.id === 'r5')).toBe(true);
  });

  it('returns positive momentum tip for mood >= 4', () => {
    const entry = makeEntry({ mood: 4, triggers: [] });
    const recs = getRecommendations([entry], entry);
    expect(recs.some((r) => r.id === 'r6')).toBe(true);
  });

  it('surfaces top weekly trigger pattern when >= 3 entries', () => {
    const entries = [
      makeEntry({
        mood: 2,
        triggers: ['sleep-loss'],
        timestamp: Date.now() - 2 * 86400000,
      }),
      makeEntry({
        mood: 3,
        triggers: ['sleep-loss'],
        timestamp: Date.now() - 86400000,
      }),
      makeEntry({
        mood: 3,
        triggers: ['sleep-loss'],
        timestamp: Date.now(),
      }),
    ];
    const recs = getRecommendations(entries, entries[2]);
    expect(recs.some((r) => r.id === 'r7')).toBe(true);
  });

  it('returns max 4 recommendations even when many rules fire', () => {
    const entry = makeEntry({
      mood: 1,
      triggers: [
        'sleep-loss',
        'mock-test',
        'comparison',
        'family-pressure',
      ],
    });
    const entries = [
      makeEntry({ mood: 1, timestamp: Date.now() - 2 * 86400000 }),
      makeEntry({ mood: 2, timestamp: Date.now() - 86400000 }),
      entry,
    ];
    const recs = getRecommendations(entries, entry);
    expect(recs.length).toBeLessThanOrEqual(4);
  });

  it('returns empty array when todayEntry is null', () => {
    const recs = getRecommendations([], null);
    expect(recs).toEqual([]);
  });
});
