'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/shadcn/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/shadcn/dialog';
import { Textarea } from '@/components/ui/shadcn/textarea';

interface JoinEventDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (message: string) => Promise<void>;
  isSubmitting?: boolean;
  errorMessage?: string | null;
}

export default function JoinEventDialog({
  open,
  onClose,
  onSubmit,
  isSubmitting = false,
  errorMessage = null,
}: JoinEventDialogProps) {
  const [message, setMessage] = useState('');

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <form>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Request to Join</DialogTitle>
            <DialogDescription>
              Let your host know why you’d make this hangout better
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <Textarea
              placeholder="Write something thoughtful..."
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            {errorMessage && <p className="text-sm text-destructive">{errorMessage}</p>}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              disabled={isSubmitting}
              onClick={async () => {
                await onSubmit(message);
                setMessage('');
              }}
            >
              {isSubmitting ? 'Sending...' : 'Send Request'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
