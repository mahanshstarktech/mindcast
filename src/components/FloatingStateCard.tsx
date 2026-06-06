'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useWellnessStore } from '@/store/useWellnessStore';
import { WEATHER_CONFIG } from '@/types';
import { Button } from '@/components/ui/button';

export default function FloatingStateCard() {
  const prefersReduced = useReducedMotion();
  const getTodayEntry = useWellnessStore((s) => s.getTodayEntry);
  const todayEntry = getTodayEntry();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleUpdate = useCallback(() => {
    document.getElementById('check-in')?.scrollIntoView({
      behavior: 'smooth',
    });
  }, []);

  if (!todayEntry) return null;

  const config = WEATHER_CONFIG[todayEntry.weatherState];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed bottom-6 right-6 z-40 max-sm:left-1/2 max-sm:right-auto max-sm:-translate-x-1/2"
          initial={prefersReduced ? { opacity: 0 } : { x: 120, opacity: 0 }}
          animate={prefersReduced ? { opacity: 1 } : { x: 0, opacity: 1 }}
          exit={prefersReduced ? { opacity: 0 } : { x: 120, opacity: 0 }}
          transition={{ type: 'spring', damping: 20 }}
          role="complementary"
          aria-label={`Your current weather state: ${config.label}. Click Update to change.`}
        >
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl px-4 py-3 flex items-center gap-3 shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
            <motion.span
              className="text-2xl"
              animate={prefersReduced ? {} : { y: [0, -4, 0] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              role="img"
              aria-hidden="true"
            >
              {config.emoji}
            </motion.span>
            <div className="mr-2">
              <p
                className="text-sm font-semibold text-[#F1F5F9]"
                style={{ color: config.color }}
              >
                {config.label.split('—')[0].trim()}
              </p>
              <p className="text-xs text-[#64748B]">
                Mood: {todayEntry.mood}/5
              </p>
            </div>
            <Button
              onClick={handleUpdate}
              variant="ghost"
              className="text-[#7C3AED] hover:bg-[#7C3AED]/10 text-xs min-h-[44px] min-w-[44px]"
              aria-label="Update your mood check-in"
            >
              Update
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
