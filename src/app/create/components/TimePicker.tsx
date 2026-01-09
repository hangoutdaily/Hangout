'use client';

import { useState } from 'react';
import { Clock, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/shadcn/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/shadcn/popover';

interface TimePickerProps {
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
}

export function TimePicker({ value, onChange, error }: TimePickerProps) {
  const [open, setOpen] = useState(false);

  // Generate time slots in 30-minute intervals
  const timeSlots = Array.from({ length: 48 }).map((_, i) => {
    const hour = Math.floor(i / 2);
    const minute = i % 2 === 0 ? '00' : '30';
    return `${hour.toString().padStart(2, '0')}:${minute}`;
  });

  const formatTime = (time: string) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const h = hours % 12 || 12;
    return `${h}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-full justify-between font-normal',
            !value && 'text-muted-foreground',
            error && 'border-destructive',
            'hover:bg-accent/10 hover:text-foreground',
            open && 'ring-2 ring-ring ring-offset-2'
          )}
        >
          {value ? (
            <span className="flex items-center">
              <Clock className="mr-2 h-4 w-4 opacity-50" />
              {formatTime(value)}
            </span>
          ) : (
            'Select time'
          )}
          <Clock className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <div className="h-72 w-full overflow-y-auto">
          <div className="p-2 flex flex-col gap-1">
            {timeSlots.map((time) => (
              <Button
                key={time}
                variant="ghost"
                className={cn(
                  'w-full justify-start font-normal',
                  value === time && 'bg-accent/20 text-accent font-medium'
                )}
                onClick={() => {
                  onChange(time);
                  setOpen(false);
                }}
              >
                {value === time && <Check className="mr-2 h-4 w-4" />}
                <span className={cn(value === time ? 'ml-0' : 'ml-6')}>{formatTime(time)}</span>
              </Button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
