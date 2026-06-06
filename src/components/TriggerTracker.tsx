'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { TRIGGER_LABELS, type TriggerTag } from '@/types';

interface TriggerTrackerProps {
  selected: TriggerTag[];
  onChange: (triggers: TriggerTag[]) => void;
}

const ALL_TRIGGERS = Object.keys(TRIGGER_LABELS) as TriggerTag[];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};

const tagVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
};

const TriggerPill = React.memo(function TriggerPill({
  tag,
  isSelected,
  isDisabled,
  onToggle,
  prefersReduced,
}: {
  tag: TriggerTag;
  isSelected: boolean;
  isDisabled: boolean;
  onToggle: (tag: TriggerTag) => void;
  prefersReduced: boolean | null;
}) {
  const { emoji, label } = TRIGGER_LABELS[tag];

  return (
    <motion.button
      type="button"
      role="checkbox"
      aria-checked={isSelected}
      aria-label={`${label} trigger`}
      aria-disabled={isDisabled && !isSelected}
      onClick={() => {
        if (isDisabled && !isSelected) return;
        onToggle(tag);
      }}
      className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium transition-all cursor-pointer min-h-[44px] border ${
        isSelected
          ? 'bg-[#7C3AED]/20 text-white border-[#7C3AED]/50 shadow-[0_0_15px_rgba(124,58,237,0.2)] scale-105'
          : isDisabled
            ? 'bg-white/[0.02] text-[#64748B] border-white/5 opacity-40 cursor-not-allowed'
            : 'bg-white/5 text-[#94A3B8] border-white/10 hover:bg-white/10 hover:border-white/20'
      }`}
      variants={prefersReduced ? undefined : tagVariants}
      whileHover={prefersReduced || (isDisabled && !isSelected) ? undefined : { scale: 1.05 }}
      whileTap={prefersReduced || (isDisabled && !isSelected) ? undefined : { scale: 0.95 }}
      tabIndex={isDisabled && !isSelected ? -1 : 0}
    >
      <span role="img" aria-hidden="true">
        {emoji}
      </span>
      {label}
    </motion.button>
  );
});

export default function TriggerTracker({
  selected,
  onChange,
}: TriggerTrackerProps) {
  const prefersReduced = useReducedMotion();
  const isAtMax = selected.length >= 5;

  const handleToggle = React.useCallback(
    (tag: TriggerTag) => {
      if (selected.includes(tag)) {
        onChange(selected.filter((t) => t !== tag));
      } else if (!isAtMax) {
        onChange([...selected, tag]);
      }
    },
    [selected, onChange, isAtMax]
  );

  return (
    <div>
      <h3 className="text-lg font-semibold mb-3">
        <span role="img" aria-label="lightning">⚡</span> What&apos;s Triggering the Storm?
      </h3>
      <motion.div
        role="group"
        aria-label="Select stress triggers (up to 5)"
        className="flex flex-wrap gap-2"
        variants={prefersReduced ? undefined : containerVariants}
        initial="hidden"
        animate="visible"
      >
        {ALL_TRIGGERS.map((tag) => (
          <TriggerPill
            key={tag}
            tag={tag}
            isSelected={selected.includes(tag)}
            isDisabled={isAtMax}
            onToggle={handleToggle}
            prefersReduced={prefersReduced}
          />
        ))}
      </motion.div>
      <p
        className="text-xs text-[#64748B] mt-3"
        aria-live="polite"
      >
        {selected.length} of 5 selected
      </p>
    </div>
  );
}
