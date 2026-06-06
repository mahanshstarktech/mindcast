'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface ProgressRingProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  children?: React.ReactNode;
}

const ProgressRing = React.memo(function ProgressRing({
  value,
  size = 120,
  strokeWidth = 8,
  color = '#7C3AED',
  children,
}: ProgressRingProps) {
  const prefersReduced = useReducedMotion();
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
      role="progressbar"
      aria-valuenow={Math.round(value)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Progress: ${Math.round(value)}%`}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="rotate-[-90deg]"
        aria-hidden="true"
      >
        {/* Background circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{
            strokeDashoffset:
              circumference - (circumference * Math.min(value, 100)) / 100,
          }}
          transition={
            prefersReduced
              ? { duration: 0 }
              : { duration: 1.2, ease: 'easeOut' }
          }
        />
      </svg>
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
});

ProgressRing.displayName = 'ProgressRing';
export default ProgressRing;
