'use client';

import { motion } from 'framer-motion';

export interface ProgressBarProps {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const progress = (current / total) * 100;
  const milestones = [
    { step: 1, label: 'Basics' },
    { step: 2, label: 'About you' },
    { step: 3, label: 'Photos' },
  ];

  return (
    <div className="w-full bg-background border-b border-border sticky top-0 z-10">
      <div className="max-w-2xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex gap-4 text-xs">
            {milestones.map((milestone) => (
              <motion.span
                key={milestone.step}
                className={`font-medium transition-colors ${
                  milestone.step <= current ? 'text-foreground' : 'text-muted-foreground'
                }`}
                animate={{ opacity: milestone.step === current ? 1 : 0.6 }}
              >
                {milestone.label}
              </motion.span>
            ))}
          </div>
          <motion.span className="text-xs font-medium text-muted-foreground">
            {current} of {total}
          </motion.span>
        </div>
        <div className="w-full h-1 bg-border rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-foreground"
            initial={{ width: `${((current - 1) / total) * 100}%` }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      </div>
    </div>
  );
}
