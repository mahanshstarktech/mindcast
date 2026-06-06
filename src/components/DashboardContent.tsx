'use client';

import React, { lazy, Suspense } from 'react';
import dynamic from 'next/dynamic';
import MoodCheckIn from '@/components/MoodCheckIn';
import ReflectionCards from '@/components/ReflectionCards';
import WellnessTips from '@/components/WellnessTips';
import FloatingStateCard from '@/components/FloatingStateCard';
import SectionReveal from '@/components/SectionReveal';
import { ErrorBoundary } from '@/components/ErrorBoundary';

/** Lazy-loaded chart component — Recharts adds ~200KB to the bundle. */
const WeeklyInsights = lazy(() => import('@/components/WeeklyInsights'));

/** Dynamic import with SSR disabled — uses browser-only APIs (setInterval, DOM refs). */
const ResetMode = dynamic(() => import('@/components/ResetMode'), {
  ssr: false,
});

/** Loading skeleton for lazy-loaded sections. */
function SectionSkeleton(): React.JSX.Element {
  return (
    <div className="glass-card p-8 md:p-12 text-center max-w-4xl mx-auto animate-pulse">
      <div className="h-8 w-48 bg-white/5 rounded mx-auto mb-4" />
      <div className="h-4 w-64 bg-white/5 rounded mx-auto" />
    </div>
  );
}

/**
 * Client-side dashboard content wrapper.
 * Wraps each section in ErrorBoundary + SectionReveal for resilience and animation.
 * Uses lazy loading and dynamic imports for code-splitting heavy components.
 */
export default function DashboardContent(): React.JSX.Element {
  return (
    <>
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <ErrorBoundary>
          <SectionReveal>
            <section
              id="check-in"
              aria-label="Mood Check-In"
              className="py-16 md:py-24"
            >
              <MoodCheckIn />
            </section>
          </SectionReveal>
        </ErrorBoundary>

        <ErrorBoundary>
          <SectionReveal>
            <section
              aria-label="Daily Reflection"
              className="py-16 md:py-24"
            >
              <ReflectionCards />
            </section>
          </SectionReveal>
        </ErrorBoundary>

        <ErrorBoundary>
          <SectionReveal>
            <section
              aria-label="Wellness Recommendations"
              className="py-16 md:py-24"
            >
              <WellnessTips />
            </section>
          </SectionReveal>
        </ErrorBoundary>

        <ErrorBoundary>
          <SectionReveal>
            <section
              aria-label="Weekly Climate Report"
              className="py-16 md:py-24"
            >
              <Suspense fallback={<SectionSkeleton />}>
                <WeeklyInsights />
              </Suspense>
            </section>
          </SectionReveal>
        </ErrorBoundary>

        <ErrorBoundary>
          <SectionReveal>
            <section
              aria-label="Reset Mode"
              className="py-16 md:py-24"
            >
              <ResetMode />
            </section>
          </SectionReveal>
        </ErrorBoundary>
      </div>

      <FloatingStateCard />
    </>
  );
}
