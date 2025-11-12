'use client';

import { useEffect, useState } from 'react';
import LoginForm from '@/components/ui/LoginForm';

export default function LoginPage() {
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
          {/* Hero Section */}
          <div className="mb-12 page-enter-left">
            <h1 className="text-4xl font-light tracking-tight mb-3">Welcome back</h1>
            <p className="text-muted-foreground font-light text-base">
              Sign in to explore hangouts and connect with people near you.
            </p>
          </div>
          <div
            className="bg-card border border-border rounded-xl p-8 mb-10 shadow-sm page-enter-right"
            style={{ animationDelay: '0.1s' }}
          >
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
