'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Tag, Wallet, CheckCircle2, Loader2 } from 'lucide-react';
import { Field, FieldInput, FieldTextarea, FieldSelect } from '@/components/ui/FormField';
import { Button } from '@/components/ui/shadcn/button';
import { cn } from '@/lib/utils';
import { createEvent, getCategories } from '@/api/event';

type Category = string;
type PriceType = 'FREE' | 'SPLIT_BILL';

interface EventForm {
  title: string;
  description: string;
  category: Category | '';
  city: string;
  state: string;
  addressLine: string;
  date: string;
  time: string;
  maxAttendees: string;
  priceType: PriceType | '';
}

function formatCategoryName(enumValue: string): string {
  return enumValue
    .replace(/_/g, ' ')
    .replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}

export default function CreateEventForm() {
  const router = useRouter();
  const [form, setForm] = useState<EventForm>({
    title: '',
    category: '',
    description: '',
    city: '',
    state: '',
    addressLine: '',
    date: '',
    time: '',
    maxAttendees: '',
    priceType: '',
  });

  const [categories, setCategories] = useState<string[]>([]);
  const [categoryMap, setCategoryMap] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Partial<Record<keyof EventForm, string>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dateRef = useRef<HTMLInputElement>(null);
  const timeRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await getCategories();
        console.log('res', res);
        const enumValues = res.data.categories as string[];

        const displayCategories = enumValues.map(formatCategoryName);
        setCategories(displayCategories);
        const newCategoryMap = displayCategories.reduce(
          (acc, displayName, index) => {
            acc[displayName] = enumValues[index];
            return acc;
          },
          {} as Record<string, string>
        );
        setCategoryMap(newCategoryMap);
      } catch (error) {
        console.error('Failed to fetch categories', error);
      }
    }
    fetchCategories();
  }, []);

  const requiredFields: (keyof EventForm)[] = Object.keys(form) as (keyof EventForm)[];
  const progress = Math.round(
    (requiredFields.filter((key) => !!form[key]).length / requiredFields.length) * 100
  );

  function validate(next?: Partial<EventForm>) {
    const f = { ...form, ...(next || {}) };
    const e: Partial<Record<keyof EventForm, string>> = {};

    if (!f.title) e.title = 'Required';
    if (!f.description) e.description = 'Required';
    if (!f.category) e.category = 'Required';
    if (!f.city) e.city = 'Required';
    if (!f.state) e.state = 'Required';
    if (!f.addressLine) e.addressLine = 'Required';
    if (!f.date) e.date = 'Required';
    if (!f.time) e.time = 'Required';
    if (!f.maxAttendees || Number(f.maxAttendees) < 1) e.maxAttendees = 'At least 1 attendee';
    if (!f.priceType) e.priceType = 'Select payment type';

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function update<K extends keyof EventForm>(key: K, value: EventForm[K]) {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (submitted) validate(next);
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    if (!validate()) return;
    setIsLoading(true);
    try {
      const payload = {
        title: form.title,
        description: form.description,
        category: categoryMap[form.category],
        city: form.city,
        state: form.state,
        addressLine: form.addressLine,
        datetime: new Date(`${form.date}T${form.time}`),
        maxAttendees: Number(form.maxAttendees),
        priceType: form.priceType,
      };
      const res = await createEvent(payload);
      // TODO - redirect to the new event's page
      router.push('/');
    } catch (err: any) {
      console.error('Event creation failed:', err);
      setErrors({
        title: err.response?.data?.error || 'Failed to create event. Please try again.',
      });
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Section icon={Tag} title="Basic Information" subtitle="About your event">
        <Field label="Title" error={errors.title}>
          <FieldInput
            placeholder="e.g., Sunday Brunch & Gossip"
            value={form.title}
            onChange={(e) => update('title', e.target.value)}
            error={!!errors.title}
          />
        </Field>

        <Field label="Category" error={errors.category}>
          <FieldSelect
            value={form.category}
            onChange={(val) => update('category', val as Category)}
            options={categories}
            placeholder={categories.length > 0 ? 'Select category' : 'Loading categories...'}
            error={!!errors.category}
          />
        </Field>

        <Field label="Description" error={errors.description}>
          <FieldTextarea
            placeholder="Describe what people can expect..."
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
            error={!!errors.description}
          />
        </Field>
      </Section>

      <Section icon={MapPin} title="Location Details" subtitle="Where is it happening?">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="City" error={errors.city}>
            <FieldInput
              placeholder="e.g., Gandhinagar"
              value={form.city}
              onChange={(e) => update('city', e.target.value)}
              error={!!errors.city}
            />
          </Field>
          <Field label="State" error={errors.state}>
            <FieldInput
              placeholder="e.g., Gujarat"
              value={form.state}
              onChange={(e) => update('state', e.target.value)}
              error={!!errors.state}
            />
          </Field>
        </div>

        <Field label="Address Line" error={errors.addressLine}>
          <FieldInput
            placeholder="Street, building, landmark..."
            value={form.addressLine}
            onChange={(e) => update('addressLine', e.target.value)}
            error={!!errors.addressLine}
          />
        </Field>
      </Section>

      <Section icon={Calendar} title="When & Capacity" subtitle="Choose schedule & attendees">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Date" error={errors.date}>
            <div onClick={() => dateRef.current?.showPicker()}>
              <FieldInput
                ref={dateRef}
                type="date"
                value={form.date}
                onChange={(e) => update('date', e.target.value)}
                error={!!errors.date}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </Field>

          <Field label="Time" error={errors.time}>
            <div onClick={() => timeRef.current?.showPicker()}>
              <FieldInput
                ref={timeRef}
                type="time"
                value={form.time}
                onChange={(e) => update('time', e.target.value)}
                error={!!errors.time}
              />
            </div>
          </Field>
        </div>

        <Field label="Max Attendees" error={errors.maxAttendees}>
          <FieldInput
            type="number"
            min="1"
            placeholder="e.g., 25"
            value={form.maxAttendees}
            onChange={(e) => update('maxAttendees', e.target.value)}
            error={!!errors.maxAttendees}
          />
        </Field>
      </Section>

      <Section icon={Wallet} title="Pricing" subtitle="Decide how attendees will pay">
        <div className="grid sm:grid-cols-2 gap-3">
          <PriceOption
            label="Free"
            description="Completely free for all attendees"
            selected={form.priceType === 'FREE'}
            onClick={() => update('priceType', 'FREE')}
          />
          <PriceOption
            label="Split the Bill"
            description="Everyone contributes equally"
            selected={form.priceType === 'SPLIT_BILL'}
            onClick={() => update('priceType', 'SPLIT_BILL')}
          />
        </div>
        {errors.priceType && <Error>{errors.priceType}</Error>}
      </Section>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-center justify-between gap-4"
      >
        <AnimatePresence mode="wait">
          {progress === 100 ? (
            <motion.p key="ready" className="text-success flex items-center gap-1 text-sm">
              <CheckCircle2 className="h-4 w-4" /> All set! Ready to create.
            </motion.p>
          ) : (
            <motion.p key="hint" className="text-muted-foreground text-sm">
              Fill all required fields to complete setup.
            </motion.p>
          )}
        </AnimatePresence>
        <Button type="submit" className="font-semibold w-full sm:w-auto" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? 'Creating...' : 'Create Event'}
        </Button>
      </motion.div>
    </form>
  );
}

function Section({
  icon: Icon,
  title,
  subtitle,
  children,
}: {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="border border-border rounded-xl p-6 space-y-5"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-accent/10 grid place-items-center">
          <Icon className="h-5 w-5 text-accent" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
      </div>
      {children}
    </motion.div>
  );
}

function PriceOption({
  label,
  description,
  selected,
  onClick,
}: {
  label: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'p-4 rounded-lg border transition-all text-left',
        selected ? 'border-accent bg-accent/10' : 'border-border hover:bg-secondary/30'
      )}
    >
      <p className="font-medium">{label}</p>
      <p className="text-sm text-muted-foreground">{description}</p>
    </button>
  );
}

function Error({ children }: { children: React.ReactNode }) {
  return <p className="text-xs text-destructive mt-1">{children}</p>;
}
