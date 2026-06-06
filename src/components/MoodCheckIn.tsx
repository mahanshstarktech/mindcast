'use client';

import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, useReducedMotion } from 'framer-motion';
import { toast } from 'sonner';
import { moodEntrySchema, type MoodEntryForm } from '@/schemas/moodSchema';
import { useWellnessStore } from '@/store/useWellnessStore';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import TriggerTracker from '@/components/TriggerTracker';
import type { MoodLevel, TriggerTag } from '@/types';

const MOOD_OPTIONS: Array<{
  level: MoodLevel;
  emoji: string;
  label: string;
}> = [
  { level: 1, emoji: '🌀', label: 'Hurricane — Seek shelter now' },
  { level: 2, emoji: '⛈', label: 'Storm Warning — Rough weather' },
  { level: 3, emoji: '🌧', label: 'Light Rain — Some turbulence' },
  { level: 4, emoji: '🌤', label: 'Partly Cloudy — Mostly steady' },
  { level: 5, emoji: '☀️', label: 'Clear Skies — You\'re in flow' },
];

export default function MoodCheckIn() {
  const prefersReduced = useReducedMotion();
  const addEntry = useWellnessStore((s) => s.addEntry);
  const [selectedTriggers, setSelectedTriggers] = useState<TriggerTag[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<MoodEntryForm>({
    resolver: zodResolver(moodEntrySchema),
    defaultValues: {
      mood: 3,
      triggers: [],
      note: '',
      reflection: '',
      date: new Date().toISOString().split('T')[0],
    },
  });

  const currentMood = watch('mood') as MoodLevel;
  const noteValue = watch('note') ?? '';
  const currentLabel =
    MOOD_OPTIONS.find((o) => o.level === currentMood)?.label ?? '';

  const handleMoodSelect = useCallback(
    (level: MoodLevel) => {
      setValue('mood', level, { shouldValidate: true });
    },
    [setValue]
  );

  const handleSliderChange = useCallback(
    (value: number | readonly number[]) => {
      const v = Array.isArray(value) ? value[0] : value;
      setValue('mood', v as MoodLevel, { shouldValidate: true });
    },
    [setValue]
  );

  const handleTriggersChange = useCallback(
    (triggers: TriggerTag[]) => {
      setSelectedTriggers(triggers);
      setValue('triggers', triggers);
    },
    [setValue]
  );

  const onSubmit = useCallback(
    async (data: MoodEntryForm) => {
      setIsSubmitting(true);
      try {
        addEntry({
          mood: data.mood as MoodLevel,
          triggers: selectedTriggers,
          note: data.note ?? '',
          reflection: data.reflection ?? '',
        });
        toast.success('☀️ Weather logged!', {
          description: 'Your mood has been recorded successfully.',
        });
        reset();
        setSelectedTriggers([]);
      } finally {
        setIsSubmitting(false);
      }
    },
    [addEntry, selectedTriggers, reset]
  );

  const motionProps = prefersReduced
    ? {}
    : {
        whileHover: { scale: 1.15 },
        whileTap: { scale: 0.92 },
        transition: { type: 'spring' as const, damping: 15 },
      };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="glass-card p-6 md:p-8 max-w-2xl mx-auto"
      noValidate
    >
      <h2 className="text-2xl md:text-3xl font-bold mb-2 text-center">
        <span role="img" aria-label="weather">🌤</span> How&apos;s Your Weather Today?
      </h2>
      <p className="text-[#64748B] text-center mb-8">
        Check in with yourself — no judgment, just awareness.
      </p>

      {/* Mood Emoji Buttons */}
      <div
        role="radiogroup"
        aria-label="Select your mood"
        className="flex justify-center gap-3 md:gap-5 mb-4"
      >
        {MOOD_OPTIONS.map((option) => (
          <motion.button
            key={option.level}
            type="button"
            role="radio"
            aria-checked={currentMood === option.level}
            aria-label={`Mood level ${option.level}: ${option.label}`}
            onClick={() => handleMoodSelect(option.level)}
            className={`text-3xl md:text-4xl p-3 md:p-4 rounded-2xl border-2 transition-all cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center ${
              currentMood === option.level
                ? 'border-[#7C3AED] bg-[#7C3AED]/10 shadow-[0_0_20px_rgba(124,58,237,0.3)] scale-110'
                : 'border-transparent bg-white/5 hover:bg-white/10'
            }`}
            {...motionProps}
          >
            <span role="img" aria-hidden="true">
              {option.emoji}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Dynamic mood label */}
      <p
        className="text-center text-sm font-medium mb-6"
        style={{
          color:
            MOOD_OPTIONS.find((o) => o.level === currentMood)
              ? ['#EF4444', '#F97316', '#EAB308', '#22C55E', '#06B6D4'][
                  currentMood - 1
                ]
              : '#64748B',
        }}
        aria-live="polite"
      >
        {currentLabel}
      </p>

      {/* Slider */}
      <div className="mb-8 px-4">
        <label htmlFor="mood-slider" className="sr-only">
          Mood intensity slider
        </label>
        <Slider
          id="mood-slider"
          min={1}
          max={5}
          step={1}
          value={[currentMood]}
          onValueChange={handleSliderChange}
          aria-label="Mood intensity slider"
          aria-valuemin={1}
          aria-valuemax={5}
          aria-valuenow={currentMood}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-[#64748B] mt-2">
          <span>Hurricane</span>
          <span>Clear Skies</span>
        </div>
      </div>

      {/* Trigger Tracker */}
      <div className="mb-8">
        <TriggerTracker
          selected={selectedTriggers}
          onChange={handleTriggersChange}
        />
      </div>

      {/* Note textarea */}
      <div className="mb-6">
        <label htmlFor="mood-note" className="block text-sm font-medium mb-2">
          What&apos;s on your mind?
        </label>
        <div className="relative">
          <Textarea
            id="mood-note"
            placeholder="How are you feeling right now? (optional)"
            maxLength={200}
            className="bg-white/5 border-white/10 text-[#F1F5F9] placeholder:text-[#334155] min-h-[80px] resize-none"
            aria-describedby="note-char-count note-error"
            {...register('note')}
          />
          <span
            id="note-char-count"
            className={`block text-right text-xs mt-1 ${
              noteValue.length >= 180
                ? 'text-[#F59E0B]'
                : 'text-[#64748B]'
            }`}
          >
            {noteValue.length}/200
          </span>
        </div>
        {errors.note && (
          <p id="note-error" role="alert" className="text-[#EF4444] text-xs mt-1">
            {errors.note.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-semibold py-6 rounded-xl transition-all hover:shadow-[0_0_30px_rgba(124,58,237,0.3)] min-h-[44px] disabled:opacity-50"
        aria-label="Log your weather"
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Logging...
          </span>
        ) : (
          'Log Your Weather ☀️'
        )}
      </Button>
    </form>
  );
}
