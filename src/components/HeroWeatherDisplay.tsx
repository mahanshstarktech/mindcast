'use client';

import { useWellnessStore } from '@/store/useWellnessStore';
import { WEATHER_CONFIG } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function HeroWeatherDisplay() {
  const getTodayEntry = useWellnessStore((s) => s.getTodayEntry);
  const todayEntry = getTodayEntry();

  if (todayEntry) {
    const config = WEATHER_CONFIG[todayEntry.weatherState];
    return (
      <div className="flex flex-col items-center gap-4">
        <span
          className="text-6xl"
          role="img"
          aria-label={config.label}
        >
          {config.emoji}
        </span>
        <p
          className="text-lg font-medium"
          style={{ color: config.color }}
        >
          {config.label}
        </p>
        <Badge
          className="text-sm px-4 py-1.5"
          style={{
            backgroundColor: `${config.color}20`,
            color: config.color,
            borderColor: `${config.color}40`,
          }}
        >
          Today&apos;s Mood: {todayEntry.mood}/5
        </Badge>
      </div>
    );
  }

  return (
    <Button
      onClick={() => {
        document.getElementById('check-in')?.scrollIntoView({
          behavior: 'smooth',
        });
      }}
      className="text-lg px-8 py-6 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-2xl font-semibold transition-all hover:shadow-[0_0_40px_rgba(124,58,237,0.3)] min-h-[44px]"
      aria-label="Check in now to log your mood"
    >
      Check In Now →
    </Button>
  );
}
