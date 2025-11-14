'use client';

import { Skeleton } from '@/components/ui/shadcn/skeleton';

export default function SkeletonHeader() {
  return (
    <header className="sticky top-0 z-50 w-full bg-background h-16 border-b border-border">
      <div className="hidden md:flex items-center justify-between h-full max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-6 w-24 rounded-md animate-pulse" />
          <Skeleton className="h-4 w-32 rounded-md animate-pulse" />
        </div>
        <div className="flex-1 flex justify-center max-w-lg">
          <Skeleton className="h-9 w-full rounded-md animate-pulse" />
        </div>
        <div className="flex items-center gap-6">
          <Skeleton className="h-5 w-24 rounded-md animate-pulse" />
          <Skeleton className="h-8 w-8 rounded-full animate-pulse" />
        </div>
      </div>
      <div className="md:hidden flex items-center justify-between h-full px-4">
        <Skeleton className="h-5 w-20 rounded-md animate-pulse" />
        <Skeleton className="h-4 w-32 rounded-md animate-pulse" />
        <Skeleton className="h-6 w-6 rounded-md animate-pulse" />
      </div>
    </header>
  );
}
