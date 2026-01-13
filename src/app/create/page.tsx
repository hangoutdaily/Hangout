'use client';

import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import CreateEventForm from './CreateEventForm';

export default function CreateEventPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-foreground hover:text-accent transition-colors"
          >
            <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-0.5" />
            Back
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl font-bold text-foreground mb-2">Create Hangout</h1>
          <p className="text-muted-foreground">Host something you love.</p>
        </motion.div>

        <CreateEventForm />
      </div>
    </div>
  );
}
