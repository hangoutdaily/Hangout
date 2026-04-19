'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from './shadcn/button';
import { ArrowRight } from 'lucide-react';

type EmptyStateAction = {
  href: string;
  label: string;
};

interface EmptyStateProps {
  illustrationSrc: string;
  illustrationAlt?: string;
  title: string;
  description: string;
  showSignIn?: boolean;
  signInHref?: string;
  signInLabel?: string;
  action?: EmptyStateAction;
  className?: string;
  imageClassName?: string;
}

export function EmptyState({
  illustrationSrc,
  illustrationAlt,
  title,
  description,
  showSignIn = false,
  signInHref = '/login',
  signInLabel = 'Sign In',
  action,
  className,
  imageClassName,
}: EmptyStateProps) {
  const resolvedAction = showSignIn ? { href: signInHref, label: signInLabel } : action;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'flex flex-col items-center justify-center text-center max-w-sm mx-auto my-12',
        className
      )}
    >
      {/* Illustration — large, unframed, breathing */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
        className={cn('relative w-full max-w-[340px] aspect-square mb-2', imageClassName)}
      >
        {/* Soft radial glow beneath illustration */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-1/2 rounded-full blur-3xl opacity-30 bg-gradient-to-t from-primary/20 to-transparent pointer-events-none"
        />
        <Image
          src={illustrationSrc}
          alt={illustrationAlt || title}
          fill
          sizes="(max-width: 768px) 80vw, 340px"
          className="object-contain"
          priority={false}
        />
      </motion.div>

      {/* Text block */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut', delay: 0.18 }}
        className="space-y-2 mb-7"
      >
        <h3 className="text-[1.35rem] font-semibold tracking-tight text-foreground leading-snug">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-[260px] mx-auto">
          {description}
        </p>
      </motion.div>

      {/* CTA */}
      {resolvedAction && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut', delay: 0.28 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
        >
          <Button
            asChild
            variant="outline"
            className="rounded-full px-5 h-9 text-sm font-medium gap-1.5 border-border/60 hover:bg-accent/60 transition-colors"
          >
            <Link href={resolvedAction.href}>
              {resolvedAction.label}
              <ArrowRight className="w-3.5 h-3.5 opacity-60" />
            </Link>
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}
