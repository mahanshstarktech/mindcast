import { moodEntrySchema } from '@/schemas/moodSchema';

describe('moodEntrySchema', () => {
  const validEntry = {
    mood: 3,
    triggers: ['sleep-loss', 'mock-test'],
    note: 'Feeling okay today',
    reflection: 'I did my best',
    date: '2025-06-06',
  };

  it('accepts valid mood entry', () => {
    const result = moodEntrySchema.safeParse(validEntry);
    expect(result.success).toBe(true);
  });

  it('rejects mood < 1', () => {
    const result = moodEntrySchema.safeParse({ ...validEntry, mood: 0 });
    expect(result.success).toBe(false);
  });

  it('rejects mood > 5', () => {
    const result = moodEntrySchema.safeParse({ ...validEntry, mood: 6 });
    expect(result.success).toBe(false);
  });

  it('rejects note longer than 200 chars', () => {
    const result = moodEntrySchema.safeParse({
      ...validEntry,
      note: 'a'.repeat(201),
    });
    expect(result.success).toBe(false);
  });

  it('rejects more than 5 triggers', () => {
    const result = moodEntrySchema.safeParse({
      ...validEntry,
      triggers: ['a', 'b', 'c', 'd', 'e', 'f'],
    });
    expect(result.success).toBe(false);
  });

  it('accepts empty note as empty string', () => {
    const result = moodEntrySchema.safeParse({
      ...validEntry,
      note: '',
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid date format', () => {
    const result = moodEntrySchema.safeParse({
      ...validEntry,
      date: '06-06-2025',
    });
    expect(result.success).toBe(false);
  });

  it('accepts empty triggers array', () => {
    const result = moodEntrySchema.safeParse({
      ...validEntry,
      triggers: [],
    });
    expect(result.success).toBe(true);
  });
});
