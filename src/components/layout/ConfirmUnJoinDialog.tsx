'use client';

import { Button } from '@/components/ui/shadcn/button';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/shadcn/dialog';

export default function ConfirmUnjoinDialog({ open, onClose, onConfirm }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[380px] rounded-2xl p-0 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
          className="p-6 space-y-6"
        >
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">Leave the Event?</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Your join request will be cancelled and you will be removed from the member list.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex gap-2">
            <Button variant="outline" className="flex-1 rounded-lg font-medium" onClick={onClose}>
              Keep Me
            </Button>
            <Button
              variant="destructive"
              className="flex-1 rounded-lg font-medium"
              onClick={onConfirm}
            >
              Yes, Leave
            </Button>
          </DialogFooter>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
