'use client';

import { use } from 'react';
import EditEventForm from './components/EditEventForm';

export default function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Edit Hangout</h1>
          <p className="text-muted-foreground">We’ll let everyone know about the updates.</p>
        </div>
        <EditEventForm id={id} />
      </div>
    </div>
  );
}
