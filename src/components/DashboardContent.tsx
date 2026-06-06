'use client';

import dynamic from 'next/dynamic';
import MoodCheckIn from '@/components/MoodCheckIn';
import ReflectionCards from '@/components/ReflectionCards';
import WellnessTips from '@/components/WellnessTips';
import WeeklyInsights from '@/components/WeeklyInsights';
import FloatingStateCard from '@/components/FloatingStateCard';
import SectionReveal from '@/components/SectionReveal';

const ResetMode = dynamic(() => import('@/components/ResetMode'), {
  ssr: false,
});

export default function DashboardContent() {
  return (
    <>
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <SectionReveal>
          <section
            id="check-in"
            aria-label="Mood Check-In"
            className="py-16 md:py-24"
          >
            <MoodCheckIn />
          </section>
        </SectionReveal>

        <SectionReveal>
          <section
            aria-label="Daily Reflection"
            className="py-16 md:py-24"
          >
            <ReflectionCards />
          </section>
        </SectionReveal>

        <SectionReveal>
          <section
            aria-label="Wellness Recommendations"
            className="py-16 md:py-24"
          >
            <WellnessTips />
          </section>
        </SectionReveal>

        <SectionReveal>
          <section
            aria-label="Weekly Climate Report"
            className="py-16 md:py-24"
          >
            <WeeklyInsights />
          </section>
        </SectionReveal>

        <SectionReveal>
          <section
            aria-label="Reset Mode"
            className="py-16 md:py-24"
          >
            <ResetMode />
          </section>
        </SectionReveal>
      </div>

      <FloatingStateCard />
    </>
  );
}
