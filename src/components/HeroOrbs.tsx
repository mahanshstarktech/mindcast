'use client';

import { motion, useReducedMotion } from 'framer-motion';

export default function HeroOrbs() {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-20 left-10 w-96 h-96 rounded-full bg-violet-500 opacity-[0.07] blur-3xl" />
        <div className="absolute bottom-40 right-10 w-80 h-80 rounded-full bg-cyan-400 opacity-[0.07] blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full bg-amber-400 opacity-[0.04] blur-3xl -translate-x-1/2 -translate-y-1/2" />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <motion.div
        className="absolute top-20 left-10 w-96 h-96 rounded-full bg-violet-500 opacity-[0.07] blur-3xl"
        animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-40 right-10 w-80 h-80 rounded-full bg-cyan-400 opacity-[0.07] blur-3xl"
        animate={{ x: [0, -30, 0], y: [0, 20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full bg-amber-400 opacity-[0.04] blur-3xl -translate-x-1/2 -translate-y-1/2"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}
