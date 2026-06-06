'use client';

import { useMemo, useCallback } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useWellnessStore } from '@/store/useWellnessStore';
import { getRecommendations } from '@/lib/recommendations';
import { Button } from '@/components/ui/button';
import type { Recommendation } from '@/types';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5 },
  },
};

const RecCard = ({
  rec,
  onAction,
  prefersReduced,
}: {
  rec: Recommendation;
  onAction: (action: string) => void;
  prefersReduced: boolean | null;
}) => (
  <motion.div
    className={`glass-card p-6 ${
      rec.priority === 'high'
        ? 'border-l-4 border-l-[#7C3AED] shadow-[0_0_20px_rgba(124,58,237,0.1)]'
        : ''
    }`}
    variants={prefersReduced ? undefined : itemVariants}
    whileHover={
      prefersReduced
        ? undefined
        : { y: -6, boxShadow: '0 20px 40px rgba(124,58,237,0.2)' }
    }
  >
    <div className="flex items-start gap-4">
      <span
        className="text-3xl shrink-0"
        role="img"
        aria-hidden="true"
      >
        {rec.emoji}
      </span>
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-[#F1F5F9] mb-2">
          {rec.title}
        </h3>
        <p className="text-sm text-[#94A3B8] leading-relaxed mb-3">
          {rec.description}
        </p>
        {rec.ctaLabel && rec.ctaAction && (
          <Button
            type="button"
            onClick={() => onAction(rec.ctaAction!)}
            variant="outline"
            className="border-[#7C3AED]/30 text-[#7C3AED] hover:bg-[#7C3AED]/10 min-h-[44px]"
          >
            {rec.ctaLabel}
          </Button>
        )}
      </div>
    </div>
  </motion.div>
);

export default function WellnessTips() {
  const prefersReduced = useReducedMotion();
  const entries = useWellnessStore((s) => s.entries);
  const getTodayEntry = useWellnessStore((s) => s.getTodayEntry);
  const getWeeklyEntries = useWellnessStore((s) => s.getWeeklyEntries);
  const toggleResetMode = useWellnessStore((s) => s.toggleResetMode);

  const todayEntry = useMemo(() => {
    return entries.length >= 0 ? getTodayEntry() : null;
  }, [entries, getTodayEntry]);

  const weeklyEntries = useMemo(() => {
    return entries.length >= 0 ? getWeeklyEntries() : [];
  }, [entries, getWeeklyEntries]);

  const recommendations = useMemo(() => {
    return getRecommendations(weeklyEntries, todayEntry);
  }, [weeklyEntries, todayEntry]);

  const handleAction = useCallback(
    (action: string) => {
      if (action === 'breathe' || action === 'reset-mode') {
        toggleResetMode();
      } else if (action === 'reflect') {
        document
          .querySelector('[aria-label="Daily Reflection"]')
          ?.scrollIntoView({ behavior: 'smooth' });
      }
    },
    [toggleResetMode]
  );

  if (!todayEntry) {
    return (
      <div className="glass-card p-8 md:p-12 text-center max-w-2xl mx-auto">
        <span
          className="text-5xl block mb-4"
          role="img"
          aria-label="cloud"
        >
          ☁️
        </span>
        <h2 className="text-xl font-semibold text-[#F1F5F9] mb-2">
          Your Personal Forecast Awaits
        </h2>
        <p className="text-[#64748B]">
          Log your mood to get your personal forecast
        </p>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="glass-card p-8 md:p-12 text-center max-w-2xl mx-auto">
        <span
          className="text-5xl block mb-4"
          role="img"
          aria-label="sunshine"
        >
          🌈
        </span>
        <h2 className="text-xl font-semibold text-[#F1F5F9] mb-2">
          All Clear!
        </h2>
        <p className="text-[#64748B]">
          No specific recommendations right now. Keep going!
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
        <span role="img" aria-label="compass">🧭</span> Your Wellness Forecast
      </h2>
      <motion.div
        className="grid gap-4"
        variants={prefersReduced ? undefined : containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
      >
        {recommendations.map((rec) => (
          <RecCard
            key={rec.id}
            rec={rec}
            onAction={handleAction}
            prefersReduced={prefersReduced}
          />
        ))}
      </motion.div>
    </div>
  );
}
