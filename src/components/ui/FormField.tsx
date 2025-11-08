'use client';

import * as React from 'react';
import { Label } from '@/components/ui/shadcn/label';
import { Input } from '@/components/ui/shadcn/input';
import { Textarea } from '@/components/ui/shadcn/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/shadcn/select';
import { cn } from '@/lib/utils';

interface FieldProps {
  label: string;
  error?: string;
  children: React.ReactNode;
}

export function Field({ label, error, children }: FieldProps) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-foreground">{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

const baseInputClass = (error?: boolean) =>
  cn(
    'w-full rounded-lg px-4 py-3.5 h-11 border border-border text-foreground placeholder:text-muted-foreground/50 ' +
      'focus-visible:ring-1 focus-visible:ring-ring transition-all',
    error && 'border-destructive focus-visible:ring-destructive'
  );

interface FieldInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}
export function FieldInput({ error, className, ...props }: FieldInputProps) {
  return <Input className={cn(baseInputClass(error), className)} {...props} />;
}

interface FieldTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}
export function FieldTextarea({ error, className, ...props }: FieldTextareaProps) {
  return (
    <Textarea
      className={cn(baseInputClass(error), 'min-h-[100px] resize-none', className)}
      {...props}
    />
  );
}

interface FieldSelectProps {
  value: string;
  placeholder?: string;
  options: string[];
  onChange: (value: string) => void;
  error?: boolean;
}
export function FieldSelect({ value, onChange, options, placeholder, error }: FieldSelectProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={baseInputClass(error)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((opt) => (
          <SelectItem key={opt} value={opt}>
            {opt}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
