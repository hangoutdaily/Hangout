'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        'flex flex-col items-center justify-center p-8 text-center bg-accent/5 rounded-3xl border border-dashed border-border/60 max-w-lg mx-auto my-12 backdrop-blur-sm',
        className
      )}
    >
      <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mb-6 text-accent">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-2xl font-bold text-foreground mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed mb-8 max-w-[320px]">{description}</p>
      {action && (
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          {action}
        </motion.div>
      )}
    </motion.div>
  );
}
