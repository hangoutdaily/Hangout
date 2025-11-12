'use client';

import { useEffect, useState } from 'react';
import SignupForm from '@/components/ui/SignupForm';

export default function SignupPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      className={`min-h-screen bg-background flex flex-col transition-opacity duration-500 ${mounted ? 'opacity-100' : 'opacity-0'}`}
    >
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="mb-12 page-enter-left">
            <h1 className="text-4xl font-light tracking-tight mb-3">Join hangout</h1>
            <p className="text-muted-foreground font-light text-base">
              Create an account to start connecting with people and creating unforgettable moments.
            </p>
          </div>

          <div
            className="bg-card border border-border rounded-xl p-8 mb-10 shadow-sm page-enter-right"
            style={{ animationDelay: '0.1s' }}
          >
            <SignupForm />
          </div>
        </div>
      </div>
    </div>
  );
}
