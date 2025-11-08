'use client';

import { Button } from '@/components/ui/shadcn/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface NavigationControlsProps {
  currentScreen: number;
  totalScreens: number;
  onNext: () => void;
  onPrev: () => void;
  onSubmit: () => void;
  isValid?: boolean;
}

export function NavigationControls({
  currentScreen,
  totalScreens,
  onNext,
  onPrev,
  onSubmit,
  isValid = true,
}: NavigationControlsProps) {
  const isLastScreen = currentScreen === totalScreens - 1;
  const isFirstScreen = currentScreen === 0;

  return (
    <div className="border-t border-border bg-background p-4 sticky bottom-0">
      <div className="max-w-2xl mx-auto flex gap-3">
        <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            variant="outline"
            onClick={onPrev}
            disabled={isFirstScreen}
            className="w-full bg-background border-border hover:text-foreground hover:border-foreground hover:bg-secondary/50 transition-all disabled:opacity-30 disabled:cursor-not-allowed h-12 font-medium"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </motion.div>

        <motion.div
          className="flex-1"
          whileHover={isValid ? { scale: 1.02 } : {}}
          whileTap={isValid ? { scale: 0.98 } : {}}
        >
          {isLastScreen ? (
            <Button
              onClick={onSubmit}
              className="w-full bg-foreground hover:bg-foreground/90 text-background font-medium h-12 transition-all"
            >
              Complete Profile
            </Button>
          ) : (
            <Button
              onClick={onNext}
              disabled={!isValid}
              className="w-full bg-foreground hover:bg-foreground/90 text-background font-medium h-12 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </motion.div>
      </div>
    </div>
  );
}
