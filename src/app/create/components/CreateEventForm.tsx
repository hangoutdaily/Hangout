'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Tag, Users, CheckCircle2 } from 'lucide-react';
import FormCard from './FormCard';
import Field from './Field';

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

    // Future: await axios.post("/api/events", form);
    router.push(`/events/${Date.now()}`);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <FormCard delay={0.05} icon={Tag} title="Basic Information" subtitle="About your event">
        <Field
          label="Title *"
          value={form.title}
          onChange={(e: { target: { value: string } }) => update('title', e.target.value)}
          placeholder="e.g., Sunday Brunch & Gossip"
          error={errors.title}
        />

        <Field
          label="Category *"
          value={form.category}
          onChange={(e: { target: { value: string } }) =>
            update('category', e.target.value as Category)
          }
          type="select"
          options={categories}
          error={errors.category}
        />

        <Field
          label="Description *"
          value={form.description}
          onChange={(e: { target: { value: string } }) => update('description', e.target.value)}
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
            onChange={(e: { target: { value: string } }) => update('city', e.target.value)}
            placeholder="e.g., Gandhinagar"
            error={errors.city}
          />
          <Field
            label="State *"
            value={form.state}
            onChange={(e: { target: { value: string } }) => update('state', e.target.value)}
            placeholder="e.g., Gujarat"
            error={errors.state}
          />
        </div>

        <Field
          label="Address Line *"
          value={form.addressLine}
          onChange={(e: { target: { value: string } }) => update('addressLine', e.target.value)}
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
            onChange={(e: { target: { value: string } }) => update('date', e.target.value)}
            error={errors.date}
          />
          <Field
            label="Time *"
            type="time"
            value={form.time}
            onChange={(e: { target: { value: string } }) => update('time', e.target.value)}
            error={errors.time}
          />
        </div>

        <Field
          label="Max Attendees *"
          type="number"
          value={form.maxAttendees}
          onChange={(e: { target: { value: string } }) => update('maxAttendees', e.target.value)}
          placeholder="e.g., 25"
          error={errors.maxAttendees}
          min="1"
        />
      </FormCard>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
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
