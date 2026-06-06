import { DailyEntry, Recommendation, TriggerTag } from '@/types';

export function getRecommendations(
  weeklyEntries: DailyEntry[],
  todayEntry: DailyEntry | null
): Recommendation[] {
  const recs: Recommendation[] = [];
  if (!todayEntry) return [];

  const { mood, triggers } = todayEntry;
  const last3 = weeklyEntries.slice(-3);

  // RULE 1: High stress + sleep loss → recovery protocol (PRIORITY: HIGH)
  if (mood <= 2 && triggers.includes('sleep-loss')) {
    recs.push({
      id: 'r1',
      emoji: '🌙',
      title: 'Sleep Reset Protocol',
      description:
        'Studying on empty is like driving on no fuel. Tonight: screen off by 10pm, no revision after 9pm, warm water + 4-7-8 breathing.',
      ctaLabel: 'Start Breathing Exercise',
      ctaAction: 'breathe',
      priority: 'high',
    });
  }

  // RULE 2: 3 consecutive low-mood days → slow down
  if (last3.length === 3 && last3.every((e) => e.mood <= 2)) {
    recs.push({
      id: 'r2',
      emoji: '📵',
      title: 'Your Mind Needs a Pit Stop',
      description:
        'Three rough days in a row is your body asking you to slow down—not stop. Take one guilt-free hour away from books today. Tomorrow you study stronger.',
      priority: 'high',
    });
  }

  // RULE 3: Mock test anxiety
  if (triggers.includes('mock-test')) {
    recs.push({
      id: 'r3',
      emoji: '⚡',
      title: 'Pre-Test Power Ritual',
      description:
        "Scores on mocks don't define you—they locate you. Tonight: review only formulas you already know, sleep 7+ hours, eat a real breakfast tomorrow.",
      priority: 'high',
    });
  }

  // RULE 4: Comparison trap
  if (triggers.includes('comparison')) {
    recs.push({
      id: 'r4',
      emoji: '🎯',
      title: 'Run Your Own Race',
      description:
        "Someone else's rank 1 story started exactly where you are. Write down 3 things you improved this week—no matter how small. Progress beats perfection.",
      priority: 'medium',
    });
  }

  // RULE 5: Family pressure
  if (triggers.includes('family-pressure')) {
    recs.push({
      id: 'r5',
      emoji: '💬',
      title: 'One Honest Conversation',
      description:
        'Try saying: "I\'m trying my best and I need your support, not just your expectations." Most families don\'t know their pressure is crushing—until you tell them.',
      priority: 'medium',
    });
  }

  // RULE 6: Positive mood — maintain momentum
  if (mood >= 4) {
    recs.push({
      id: 'r6',
      emoji: '🔥',
      title: "You're In the Zone",
      description:
        "Clear skies today! Tackle your hardest chapter now. Momentum is rare—use it wisely. And don't forget to log this feeling for the days it rains.",
      priority: 'medium',
    });
  }

  // RULE 7: Top 2 weekly triggers pattern
  if (weeklyEntries.length >= 3) {
    const freq: Record<string, number> = {};
    weeklyEntries.forEach((e) =>
      e.triggers.forEach((t) => (freq[t] = (freq[t] ?? 0) + 1))
    );
    const topTwo = Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map(([tag]) => tag as TriggerTag);

    if (topTwo.length > 0) {
      recs.push({
        id: 'r7',
        emoji: '📊',
        title: `Your Pattern: ${formatTrigger(topTwo[0])}`,
        description: `This trigger showed up ${freq[topTwo[0]]} times this week. Awareness is step one. What's one small thing you can change about how you respond to it?`,
        priority: 'low',
      });
    }
  }

  // Return sorted by priority, max 4 recommendations
  const order: Record<string, number> = { high: 0, medium: 1, low: 2 };
  return recs
    .sort((a, b) => order[a.priority] - order[b.priority])
    .slice(0, 4);
}

function formatTrigger(tag: TriggerTag): string {
  return tag
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}
