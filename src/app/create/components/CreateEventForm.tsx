'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Tag, CheckCircle2, Wallet } from 'lucide-react';
import FormCard from './FormCard';
import Field from './Field';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';

type Category =
  | 'Technology'
  | 'Food & Drink'
  | 'Music'
  | 'Sports'
  | 'Education'
  | 'Art & Culture'
  | 'Health & Wellness'
  | 'Business'
  | 'Gaming'
  | 'Other';

type PriceType = 'free' | 'split_bill';

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

const categories: Category[] = [
  'Technology',
  'Food & Drink',
  'Music',
  'Sports',
  'Education',
  'Art & Culture',
  'Health & Wellness',
  'Business',
  'Gaming',
  'Other',
];

export default function CreateEventForm() {
  const router = useRouter();

  const [form, setForm] = useState<EventForm>({
    title: '',
    description: '',
    category: '',
    city: '',
    state: '',
    addressLine: '',
    date: '',
    time: '',
    maxAttendees: '',
    priceType: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof EventForm, string>>>({});
  const [submitted, setSubmitted] = useState(false);

  const requiredFields: (keyof EventForm)[] = [
    'title',
    'description',
    'category',
    'city',
    'state',
    'addressLine',
    'date',
    'time',
    'maxAttendees',
    'priceType',
  ];

  const progress = Math.round(
    (requiredFields.filter((key) => !!form[key]).length / requiredFields.length) * 100
  );

  function validate(next?: Partial<EventForm>) {
    const f = { ...form, ...(next || {}) };
    const e: Partial<Record<keyof EventForm, string>> = {};

    if (!f.title.trim()) e.title = 'Title is required';
    if (!f.description.trim()) e.description = 'Description is required';
    if (!f.category) e.category = 'Select a category';
    if (!f.city.trim()) e.city = 'City is required';
    if (!f.state.trim()) e.state = 'State is required';
    if (!f.addressLine.trim()) e.addressLine = 'Address line is required';
    if (!f.date) e.date = 'Date is required';
    if (!f.time) e.time = 'Time is required';
    if (!f.maxAttendees || Number(f.maxAttendees) < 1)
      e.maxAttendees = 'Must be at least 1 attendee';
    if (!f.priceType) e.priceType = 'Please select how the cost will be handled';

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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    if (!validate()) return;
    router.push(`/events/${Date.now()}`);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <FormCard delay={0.05} icon={Tag} title="Basic Information" subtitle="About your event">
        <Field
          label="Title *"
          value={form.title}
          onChange={(e) => update('title', e.target.value)}
          placeholder="e.g., Sunday Brunch & Gossip"
          error={errors.title}
        />

        <Field
          label="Category *"
          value={form.category}
          onChange={(e) => update('category', e.target.value as Category)}
          type="select"
          options={categories}
          error={errors.category}
        />

        <Field
          label="Description *"
          value={form.description}
          onChange={(e) => update('description', e.target.value)}
          type="textarea"
          placeholder="Describe what people can expect..."
          error={errors.description}
        />
      </FormCard>

      <FormCard
        delay={0.1}
        icon={MapPin}
        title="Location Details"
        subtitle="Where is it happening?"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field
            label="City *"
            value={form.city}
            onChange={(e) => update('city', e.target.value)}
            placeholder="e.g., Gandhinagar"
            error={errors.city}
          />
          <Field
            label="State *"
            value={form.state}
            onChange={(e) => update('state', e.target.value)}
            placeholder="e.g., Gujarat"
            error={errors.state}
          />
        </div>

        <Field
          label="Address Line *"
          value={form.addressLine}
          onChange={(e) => update('addressLine', e.target.value)}
          placeholder="Street, building, landmark..."
          error={errors.addressLine}
        />
      </FormCard>

      <FormCard
        delay={0.15}
        icon={Calendar}
        title="When & Capacity"
        subtitle="Choose schedule & attendees"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field
            label="Date *"
            type="date"
            value={form.date}
            onChange={(e) => update('date', e.target.value)}
            error={errors.date}
          />
          <Field
            label="Time *"
            type="time"
            value={form.time}
            onChange={(e) => update('time', e.target.value)}
            error={errors.time}
          />
        </div>

        <Field
          label="Max Attendees *"
          type="number"
          value={form.maxAttendees}
          onChange={(e) => update('maxAttendees', e.target.value)}
          placeholder="e.g., 25"
          error={errors.maxAttendees}
          min="1"
        />
      </FormCard>

      <FormCard delay={0.2} icon={Wallet} title="Pricing" subtitle="Decide how attendees will pay">
        <RadioGroupPrimitive.Root
          value={form.priceType}
          onValueChange={(val: PriceType) => update('priceType', val)}
          className="grid grid-cols-1 sm:grid-cols-2 gap-3"
        >
          <label
            htmlFor="free"
            className={`flex items-center gap-3 border rounded-lg p-4 cursor-pointer transition-all ${
              form.priceType === 'free'
                ? 'border-accent bg-accent/5'
                : 'border-border hover:bg-surface'
            }`}
          >
            <RadioGroupPrimitive.Item
              id="free"
              value="free"
              className="h-4 w-4 rounded-full border border-input flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-accent"
            >
              {form.priceType === 'free' && <div className="h-2 w-2 bg-accent rounded-full" />}
            </RadioGroupPrimitive.Item>
            <div>
              <p className="font-medium text-foreground">Free</p>
              <p className="text-xs text-muted">Completely free for all attendees</p>
            </div>
          </label>

          <label
            htmlFor="split_bill"
            className={`flex items-center gap-3 border rounded-lg p-4 cursor-pointer transition-all ${
              form.priceType === 'split_bill'
                ? 'border-accent bg-accent/5'
                : 'border-border hover:bg-surface'
            }`}
          >
            <RadioGroupPrimitive.Item
              id="split_bill"
              value="split_bill"
              className="h-4 w-4 rounded-full border border-input flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-accent"
            >
              {form.priceType === 'split_bill' && (
                <div className="h-2 w-2 bg-accent rounded-full" />
              )}
            </RadioGroupPrimitive.Item>
            <div>
              <p className="font-medium text-foreground">Split the Bill</p>
              <p className="text-xs text-muted">Everyone contributes equally</p>
            </div>
          </label>
        </RadioGroupPrimitive.Root>

        {errors.priceType && <p className="text-xs text-destructive mt-1">{errors.priceType}</p>}
      </FormCard>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.4 }}
        className="flex flex-col sm:flex-row items-center justify-between gap-4"
      >
        <AnimatePresence mode="wait">
          {progress === 100 ? (
            <motion.p
              key="ready"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="text-success flex items-center gap-1 text-sm"
            >
              <CheckCircle2 className="h-4 w-4" />
              All set! Ready to create.
            </motion.p>
          ) : (
            <motion.p
              key="hint"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="text-muted text-sm"
            >
              Fill all required fields to complete setup.
            </motion.p>
          )}
        </AnimatePresence>

        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-6 py-3 bg-accent text-accent-foreground rounded-lg font-semibold shadow-sm hover:shadow-md transition-all"
        >
          Create Event
        </motion.button>
      </motion.div>
    </form>
  );
}
