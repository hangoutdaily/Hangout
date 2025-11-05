'use client';

import { motion } from 'framer-motion';

export default function FormCard({
  delay,
  icon: Icon,
  title,
  subtitle,
  children,
}: {
  delay: number;
  icon: React.ElementType;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35 }}
      className="bg-card-bg border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-accent/10 grid place-items-center">
          <Icon className="h-5 w-5 text-accent" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">{title}</h2>
          <p className="text-muted text-sm">{subtitle}</p>
        </div>
      </div>
      <div className="space-y-5">{children}</div>
    </motion.div>
  );
}
