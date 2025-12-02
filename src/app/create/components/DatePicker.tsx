'use client';

import { useState } from 'react';
import { ChevronDownIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/shadcn/button';
import * as Popover from '@/components/ui/shadcn/popover';
import * as CalendarUI from '@/components/ui/shadcn/calendar';

interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
  error: boolean;
}

function parseDate(dateString: string): Date | undefined {
  if (!dateString) return undefined;
  const [day, month, year] = dateString.split('/').map(Number);
  return new Date(year, month - 1, day);
}

export function DatePicker({ value, onChange, error }: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const selectedDate = parseDate(value);

  const today = new Date();
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 10);

  const disabledDays = {
    before: today,
    after: maxDate,
  };

  return (
    <Popover.Popover open={open} onOpenChange={setOpen}>
      <Popover.PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-full justify-between font-normal',
            !selectedDate && 'text-muted-foreground',
            error && 'border-destructive',
            'hover:bg-accent/10 hover:text-foreground',
            open && 'ring-2 ring-ring ring-offset-2'
          )}
        >
          {selectedDate ? format(selectedDate, 'dd/MM/yyyy') : 'Select date'}
          <ChevronDownIcon className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </Popover.PopoverTrigger>
      <Popover.PopoverContent className="w-auto overflow-hidden p-0" align="start">
        <CalendarUI.Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => {
            if (date) {
              onChange(format(date, 'dd/MM/yyyy'));
              setOpen(false);
            }
          }}
          disabled={disabledDays}
          initialFocus
          modifiersStyles={{
            today: {
              backgroundColor: 'var(--secondary)',
              color: 'var(--secondary-foreground)',
              opacity: 0.8,
              fontWeight: 'normal',
              borderRadius: '8px',
            },
          }}
        />
      </Popover.PopoverContent>
    </Popover.Popover>
  );
}
