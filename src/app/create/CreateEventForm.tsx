'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Tag, Wallet, CheckCircle2, Loader2, LocateFixed } from 'lucide-react';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import { Field, FieldInput, FieldTextarea, FieldSelect } from '@/components/ui/FormField';
import { Button } from '@/components/ui/shadcn/button';
import { cn } from '@/lib/utils';
import { createEvent, getCategories } from '@/api/event';
import { Input } from '@/components/ui/shadcn/input';
import { DatePicker } from './components/DatePicker';
import { ApiError } from '@/types';

const LIBRARIES: ('places' | 'geometry')[] = ['places', 'geometry'];
const DEFAULT_CENTER = { lat: 23.2156, lng: 72.6369 };
const MAP_CONTAINER_STYLE = {
  width: '100%',
  height: '300px',
  borderRadius: '0.75rem',
};

type Category = string;
type PriceType = 'FREE' | 'SPLIT_BILL';

interface GeoLocation {
  lat: number;
  lng: number;
}

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
  geo: GeoLocation | null;
}

function formatCategoryName(enumValue: string): string {
  return enumValue
    .replace(/_/g, ' ')
    .replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}

export default function CreateEventForm() {
  const router = useRouter();

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries: LIBRARIES,
  });

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
    geo: null,
  });

  const [categories, setCategories] = useState<string[]>([]);
  const [categoryMap, setCategoryMap] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Partial<Record<keyof EventForm, string>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const [mapCenter, setMapCenter] = useState(DEFAULT_CENTER);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await getCategories();
        const enumValues = res.data.categories as string[];

        const displayCategories = enumValues.map(formatCategoryName);
        setCategories(displayCategories);

        const newCategoryMap = displayCategories.reduce(
          (acc, displayName, idx) => {
            acc[displayName] = enumValues[idx];
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

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          setMapCenter(userPos);

          setForm((prev) => {
            if (!prev.city && !prev.addressLine && !prev.geo) {
              return { ...prev, geo: userPos };
            }
            return prev;
          });
        },
        (error) => {
          console.error('Error getting user location:', error);
        }
      );
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    if (!form.city && !form.addressLine) return;

    const timeOutId = setTimeout(() => {
      const fullAddress = `${form.addressLine}, ${form.city}, ${form.state}`;
      const geocoder = new google.maps.Geocoder();

      geocoder.geocode({ address: fullAddress }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          const location = results[0].geometry.location;
          const newGeo = { lat: location.lat(), lng: location.lng() };

          setMapCenter(newGeo);
          setForm((prev) => ({ ...prev, geo: newGeo }));
        }
      });
    }, 1000);

    return () => clearTimeout(timeOutId);
  }, [form.addressLine, form.city, form.state, isLoaded]);

  const onMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      update('geo', { lat: e.latLng.lat(), lng: e.latLng.lng() });
    }
  }, []);

  const onMarkerDragEnd = useCallback((e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      update('geo', { lat: e.latLng.lat(), lng: e.latLng.lng() });
    }
  }, []);

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

    if (!f.title) e.title = 'Title is required';
    else if (f.title.length < 5) e.title = 'Title must be at least 5 characters long';

    if (!f.description) e.description = 'Description is required';
    else if (f.description.length < 5)
      e.description = 'Description must be at least 5 characters long';

    if (!f.category) e.category = 'Category is required';
    if (!f.city) e.city = 'City is required';
    if (!f.state) e.state = 'State is required';
    if (!f.addressLine) e.addressLine = 'Address line is required';

    if (!f.date) e.date = 'Date is required';
    if (!f.time) e.time = 'Time is required';
    if (!f.maxAttendees || Number(f.maxAttendees) < 1)
      e.maxAttendees = 'At least 1 attendee is required';

    if (!f.priceType) e.priceType = 'Price type is required';

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
    setGeneralError(null);
    if (!validate()) return;
    setIsLoading(true);
    try {
      const [day, month, year] = form.date.split('/').map(Number);
      const [hour, minute] = form.time.split(':').map(Number);
      const datetime = new Date(year, month - 1, day, hour, minute);

      const payload = {
        title: form.title,
        description: form.description,
        category: categoryMap[form.category],
        city: form.city,
        state: form.state,
        addressLine: form.addressLine,
        datetime: datetime.toISOString(),
        maxAttendees: Number(form.maxAttendees),
        priceType: form.priceType,
        geo: form.geo,
      };

      await createEvent(payload);
      router.push('/');
    } catch (err) {
      const error = err as ApiError;
      setGeneralError(error.response?.data?.error || 'Failed to create event. Please try again.');
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {generalError && <p className="text-sm text-destructive">{generalError}</p>}
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
            placeholder={categories.length ? 'Select category' : 'Loading categories...'}
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

        <div className="mt-4 border border-border rounded-xl overflow-hidden bg-secondary/20">
          {!isLoaded ? (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading Map...
            </div>
          ) : (
            <GoogleMap
              mapContainerStyle={MAP_CONTAINER_STYLE}
              center={mapCenter}
              zoom={14}
              onClick={onMapClick}
              options={{
                streetViewControl: false,
                mapTypeControl: false,
              }}
            >
              {form.geo && (
                <Marker
                  position={form.geo}
                  draggable={true}
                  onDragEnd={onMarkerDragEnd}
                  animation={google.maps.Animation.DROP}
                />
              )}
            </GoogleMap>
          )}
          <div className="p-3 text-xs text-muted-foreground bg-secondary/50 flex items-center gap-2">
            <LocateFixed className="w-4 h-4" />
            <span>
              Map auto-updates based on address. Click or drag the pin to refine precise location.
            </span>
          </div>
        </div>
      </Section>

      <Section icon={Calendar} title="When & Capacity" subtitle="Choose schedule & attendees">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Date" error={errors.date}>
            <DatePicker
              value={form.date}
              onChange={(val) => update('date', val)}
              error={!!errors.date}
            />
          </Field>

          <Field label="Time" error={errors.time}>
            <Input
              type="time"
              value={form.time}
              onChange={(e) => update('time', e.target.value)}
              className={cn(
                !!errors.time && 'border-destructive focus-visible:ring-destructive',
                '[&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none'
              )}
            />
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

interface SectionProps {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

function Section({ icon: Icon, title, subtitle, children }: SectionProps) {
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

interface PriceOptionProps {
  label: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}

function PriceOption({ label, description, selected, onClick }: PriceOptionProps) {
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
