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
import { Label } from '@/components/ui/shadcn/label';
import { Textarea } from '@/components/ui/shadcn/textarea';

export default function JoinEventDialog({ open, onClose, onSubmit }) {
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
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              onClick={() => {
                onSubmit(message);
                setMessage('');
              }}
            >
              Send Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
