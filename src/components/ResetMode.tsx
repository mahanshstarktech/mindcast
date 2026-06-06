'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useWellnessStore } from '@/store/useWellnessStore';
import { Button } from '@/components/ui/button';
import ProgressRing from '@/components/ProgressRing';

type ResetTab = 'breathing' | 'hydration' | 'timer';

const BREATHING_PHASES = [
  { label: 'Inhale', duration: 4000, color: '#7C3AED' },
  { label: 'Hold', duration: 4000, color: '#06B6D4' },
  { label: 'Exhale', duration: 4000, color: '#F59E0B' },
  { label: 'Hold', duration: 4000, color: '#06B6D4' },
];

function BoxBreathing() {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const phase = BREATHING_PHASES[phaseIndex];

  useEffect(() => {
    if (!isRunning) return;

    const startTime = Date.now();
    const duration = phase.duration;

    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min((elapsed / duration) * 100, 100);
      setProgress(pct);

      if (elapsed >= duration) {
        setPhaseIndex((prev) => (prev + 1) % BREATHING_PHASES.length);
        setProgress(0);
      }
    }, 50);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, phaseIndex, phase.duration]);

  return (
    <div className="flex flex-col items-center gap-8">
      <h3 className="text-2xl font-bold text-[#F1F5F9]">Box Breathing</h3>

      {/* Animated box */}
      <div className="relative w-48 h-48">
        <svg viewBox="0 0 200 200" className="w-full h-full" aria-hidden="true">
          <rect
            x="20"
            y="20"
            width="160"
            height="160"
            rx="12"
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="4"
          />
          <motion.rect
            x="20"
            y="20"
            width="160"
            height="160"
            rx="12"
            fill="none"
            stroke={phase.color}
            strokeWidth="4"
            strokeDasharray="640"
            strokeDashoffset={640 - (640 * progress) / 100}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <p
            className="text-2xl font-bold"
            style={{ color: phase.color }}
            aria-live="assertive"
          >
            {phase.label}
          </p>
        </div>
      </div>

      <p className="text-[#64748B] text-sm">
        4 seconds per phase • Repeat as needed
      </p>

      <Button
        onClick={() => setIsRunning(!isRunning)}
        className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white min-h-[44px] px-8"
      >
        {isRunning ? 'Pause' : 'Start Breathing'}
      </Button>
    </div>
  );
}

function HydrationCheck() {
  const [answered, setAnswered] = useState<boolean | null>(null);
  const [fillLevel, setFillLevel] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setFillLevel((prev) => Math.min(prev + 2, 100));
    }, 60);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center gap-6">
      <h3 className="text-2xl font-bold text-[#F1F5F9]">Hydration Check</h3>

      {/* Water glass SVG */}
      <div className="relative w-32 h-40" aria-hidden="true">
        <svg viewBox="0 0 100 130" className="w-full h-full">
          <path
            d="M15 10 L15 110 C15 120 85 120 85 110 L85 10"
            fill="none"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <clipPath id="glassClip">
            <path d="M17 12 L17 108 C17 118 83 118 83 108 L83 12 Z" />
          </clipPath>
          <rect
            x="17"
            y={12 + (108 - 12) * (1 - fillLevel / 100)}
            width="66"
            height={(108 - 12) * (fillLevel / 100)}
            fill="#06B6D4"
            opacity={0.3}
            clipPath="url(#glassClip)"
          />
        </svg>
      </div>

      {answered === null ? (
        <>
          <p className="text-lg text-[#F1F5F9] text-center">
            Have you had water in the last hour?
          </p>
          <div className="flex gap-4">
            <Button
              onClick={() => setAnswered(true)}
              className="bg-[#22C55E] hover:bg-[#16A34A] text-white min-h-[44px] px-8"
            >
              Yes! 💧
            </Button>
            <Button
              onClick={() => setAnswered(false)}
              variant="outline"
              className="border-white/20 text-[#F1F5F9] hover:bg-white/10 min-h-[44px] px-8"
            >
              Not yet
            </Button>
          </div>
        </>
      ) : answered ? (
        <motion.div
          className="text-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <span className="text-5xl block mb-4" role="img" aria-label="celebration">
            🎉
          </span>
          <p className="text-lg text-[#22C55E] font-semibold">
            Great job staying hydrated!
          </p>
          <p className="text-[#64748B] mt-2">
            Your brain is 75% water — you&apos;re fueling it right.
          </p>
        </motion.div>
      ) : (
        <motion.div
          className="text-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <span className="text-5xl block mb-4" role="img" aria-label="water">
            💧
          </span>
          <p className="text-lg text-[#06B6D4] font-semibold">
            Time for a water break!
          </p>
          <p className="text-[#64748B] mt-2">
            Go grab a glass of water now. Your brain will thank you.
          </p>
        </motion.div>
      )}
    </div>
  );
}

function MicroBreakTimer() {
  const [seconds, setSeconds] = useState(300);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          setIsComplete(true);
          return 0;
        }
        if (prev % 30 === 0) {
          const m = Math.floor(prev / 60);
          const s = prev % 60;
          setAnnouncement(`${m} minutes and ${s} seconds remaining`);
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const progress = ((300 - seconds) / 300) * 100;
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;

  const handleReset = useCallback(() => {
    setSeconds(300);
    setIsRunning(false);
    setIsComplete(false);
    setAnnouncement('');
  }, []);

  if (isComplete) {
    return (
      <div className="flex flex-col items-center gap-6">
        <motion.div
          className="text-center"
          initial={{ scale: 0.8 }}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          <span className="text-6xl block mb-4" role="img" aria-label="sparkles">
            ✨
          </span>
          <p className="text-2xl font-bold text-[#22C55E]">
            Break Complete!
          </p>
          <p className="text-[#64748B] mt-2">
            Your mind is refreshed. Time to get back to it!
          </p>
        </motion.div>
        <Button
          onClick={handleReset}
          className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white min-h-[44px]"
        >
          Reset Timer
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <h3 className="text-2xl font-bold text-[#F1F5F9]">
        5-Minute Micro Break
      </h3>

      <ProgressRing value={progress} size={160} strokeWidth={10}>
        <div className="text-center">
          <p className="text-3xl font-mono font-bold text-[#F1F5F9]">
            {minutes}:{secs.toString().padStart(2, '0')}
          </p>
          <p className="text-xs text-[#64748B]">remaining</p>
        </div>
      </ProgressRing>

      <div
        aria-live="polite"
        className="sr-only"
      >
        {announcement}
      </div>

      <div className="flex gap-3">
        <Button
          onClick={() => setIsRunning(!isRunning)}
          className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white min-h-[44px] px-6"
        >
          {isRunning ? 'Pause' : 'Start'}
        </Button>
        <Button
          onClick={handleReset}
          variant="outline"
          className="border-white/20 text-[#F1F5F9] hover:bg-white/10 min-h-[44px]"
        >
          Reset
        </Button>
      </div>

      <p className="text-[#64748B] text-sm text-center">
        Step away from your desk. Stretch. Breathe. Look at something far away.
      </p>
    </div>
  );
}

export default function ResetMode() {
  const prefersReduced = useReducedMotion();
  const isResetMode = useWellnessStore((s) => s.isResetMode);
  const toggleResetMode = useWellnessStore((s) => s.toggleResetMode);
  const [activeTab, setActiveTab] = useState<ResetTab>('breathing');
  const closeRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Focus trap
  useEffect(() => {
    if (isResetMode && closeRef.current) {
      closeRef.current.focus();
    }
  }, [isResetMode]);

  // Escape to close
  useEffect(() => {
    if (!isResetMode) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        toggleResetMode();
      }
      // Focus trap
      if (e.key === 'Tab' && containerRef.current) {
        const focusable = containerRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isResetMode, toggleResetMode]);

  const tabs: Array<{ key: ResetTab; label: string; emoji: string }> = [
    { key: 'breathing', label: 'Box Breathing', emoji: '🌬' },
    { key: 'hydration', label: 'Hydration Check', emoji: '💧' },
    { key: 'timer', label: 'Micro Break', emoji: '⏱' },
  ];

  return (
    <>
      {/* Inline trigger button */}
      <div className="text-center">
        <Button
          onClick={toggleResetMode}
          className="bg-white/5 hover:bg-white/10 text-[#F1F5F9] border border-white/10 rounded-2xl px-8 py-6 text-lg font-semibold transition-all hover:shadow-[0_0_30px_rgba(124,58,237,0.2)] min-h-[44px]"
          aria-label="Enter Reset Mode — Breathing and Break Tools"
        >
          <span role="img" aria-hidden="true">🌬</span> Enter Reset Mode
        </Button>
      </div>

      {/* Full-screen overlay */}
      <AnimatePresence>
        {isResetMode && (
          <motion.div
            ref={containerRef}
            className="fixed inset-0 z-50 flex items-center justify-center"
            role="dialog"
            aria-modal="true"
            aria-label="Reset Mode — Breathing and Break Tools"
            initial={prefersReduced ? { opacity: 0 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-[#07070F]/95 backdrop-blur-xl"
              onClick={toggleResetMode}
              aria-hidden="true"
            />

            {/* Content */}
            <motion.div
              className="relative z-10 w-full max-w-lg mx-4 glass-card p-8"
              initial={prefersReduced ? {} : { scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={prefersReduced ? {} : { scale: 0.9, y: 20 }}
            >
              {/* Close button */}
              <button
                ref={closeRef}
                onClick={toggleResetMode}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#64748B] hover:text-[#F1F5F9] transition-colors min-w-[44px] min-h-[44px]"
                aria-label="Close Reset Mode"
              >
                ✕
              </button>

              {/* Tab buttons */}
              <div className="flex gap-2 mb-8 justify-center">
                {tabs.map((tab) => (
                  <Button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    variant={activeTab === tab.key ? 'default' : 'ghost'}
                    className={`min-h-[44px] ${
                      activeTab === tab.key
                        ? 'bg-[#7C3AED] text-white'
                        : 'text-[#64748B] hover:text-[#F1F5F9]'
                    }`}
                    aria-pressed={activeTab === tab.key}
                  >
                    <span role="img" aria-hidden="true">
                      {tab.emoji}
                    </span>{' '}
                    {tab.label}
                  </Button>
                ))}
              </div>

              {/* Tab content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={prefersReduced ? { opacity: 0 } : { opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={prefersReduced ? { opacity: 0 } : { opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {activeTab === 'breathing' && <BoxBreathing />}
                  {activeTab === 'hydration' && <HydrationCheck />}
                  {activeTab === 'timer' && <MicroBreakTimer />}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
