'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useWellnessStore } from '@/store/useWellnessStore';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

const PROMPTS = [
  'What drained my energy most today?',
  'What small thing helped me feel better?',
  'One thing I\'m genuinely proud of this week?',
  'What would I tell a close friend in my situation?',
  'What is actually in my control right now?',
  'What does my mind need most tonight?',
  'If today were a weather forecast, what changed it?',
];

export default function ReflectionCards() {
  const prefersReduced = useReducedMotion();
  const [promptIndex, setPromptIndex] = useState(0);
  const updateTodayReflection = useWellnessStore(
    (s) => s.updateTodayReflection
  );
  const getTodayEntry = useWellnessStore((s) => s.getTodayEntry);
  const todayEntry = getTodayEntry();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [reflection, setReflection] = useState(
    () => todayEntry?.reflection ?? ''
  );
  const prevReflectionRef = useRef(todayEntry?.reflection);

  // Sync from store when the store value changes externally
  if (todayEntry?.reflection !== prevReflectionRef.current) {
    prevReflectionRef.current = todayEntry?.reflection;
    if (todayEntry?.reflection && todayEntry.reflection !== reflection) {
      setReflection(todayEntry.reflection);
    }
  }

  const handleReflectionChange = useCallback(
    (value: string) => {
      setReflection(value);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        updateTodayReflection(value);
      }, 2000);
    },
    [updateTodayReflection]
  );

  const nextPrompt = useCallback(() => {
    setPromptIndex((prev) => (prev + 1) % PROMPTS.length);
  }, []);

  return (
    <div className="glass-card p-6 md:p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
        <span role="img" aria-label="thought bubble">💭</span> Reflect & Recharge
      </h2>

      <div className="relative mb-6">
        <motion.div
          key={promptIndex}
          className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center"
          animate={
            prefersReduced
              ? { opacity: [0.5, 1] }
              : { rotateY: [0, 90, 0] }
          }
          transition={{ duration: 0.5 }}
        >
          <p
            className="text-lg md:text-xl font-medium text-[#F1F5F9]"
            aria-live="polite"
          >
            &ldquo;{PROMPTS[promptIndex]}&rdquo;
          </p>
        </motion.div>
      </div>

      <div className="flex justify-center mb-6">
        <Button
          type="button"
          onClick={nextPrompt}
          variant="outline"
          className="gap-2 border-white/10 bg-white/5 hover:bg-white/10 text-[#F1F5F9] min-h-[44px]"
          aria-label="Show new reflection prompt"
        >
          <motion.span
            key={promptIndex}
            animate={prefersReduced ? {} : { rotate: [0, 360] }}
            transition={{ duration: 0.5 }}
            className="inline-block"
            aria-hidden="true"
          >
            🔄
          </motion.span>
          New Prompt
        </Button>
      </div>

      {todayEntry ? (
        <div>
          <label
            htmlFor="reflection-input"
            className="block text-sm font-medium mb-2 text-[#94A3B8]"
          >
            Your reflection
          </label>
          <Textarea
            id="reflection-input"
            value={reflection}
            onChange={(e) => handleReflectionChange(e.target.value)}
            placeholder="Take a moment to write your thoughts..."
            maxLength={300}
            className="bg-white/5 border-white/10 text-[#F1F5F9] placeholder:text-[#334155] min-h-[100px] resize-none"
            aria-describedby="reflection-char-count"
          />
          <span
            id="reflection-char-count"
            className={`block text-right text-xs mt-1 ${
              reflection.length >= 270
                ? 'text-[#F59E0B]'
                : 'text-[#64748B]'
            }`}
          >
            {reflection.length}/300
          </span>
          <p className="text-xs text-[#64748B] mt-1">
            Auto-saves after you stop typing
          </p>
        </div>
      ) : (
        <p className="text-center text-[#64748B] text-sm">
          Log your mood first to start reflecting ✨
        </p>
      )}
    </div>
  );
}
