'use client';

import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/shadcn/button';
import Link from 'next/link';

export default function ChatsPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-center">
      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
        <MessageCircle className="w-10 h-10 text-primary" />
      </div>
      <h1 className="text-3xl font-bold tracking-tight mb-2">Chats are still cooking</h1>
      <p className="text-muted-foreground max-w-md mb-8">
        We’re building chats to help you break the ice with new people. Hang tight!
      </p>
      <Link href="/" passHref legacyBehavior>
        <Button size="lg" variant="outline">
          Go Back Home
        </Button>
      </Link>
    </div>
  );
}
