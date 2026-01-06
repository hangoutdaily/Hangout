'use client';

import { useEffect, useState, useRef, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getCategories } from '@/api/event';
import {
  Calendar,
  Sparkles,
  ChevronDown,
  UtensilsCrossed,
  Plane,
  Image,
  Trees,
  Dumbbell,
  Film,
  Trophy,
  Coffee,
  Car,
  BookOpen,
  HandHeart,
  Stethoscope,
  Smile,
  Gamepad2,
  PartyPopper,
  Tent,
  Moon,
  Users,
  MoreHorizontal,
  Sun,
  Sunset,
  Sunrise,
  LucideIcon,
} from 'lucide-react';

type Option = {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
};

const categoryIcons: Record<string, LucideIcon> = {
  MOVIES: Film,
  SPORTS: Trophy,
  WALK: Trees,
  RUN: Dumbbell,
  COFFEE_TEA: Coffee,
  TRAVEL: Plane,
  SHARE_RIDE: Car,
  LUNCH: UtensilsCrossed,
  DINNER: UtensilsCrossed,
  BRUNCH: UtensilsCrossed,
  READING: BookOpen,
  VOLUNTEERING: HandHeart,
  CONSULTS: Stethoscope,
  COMEDY: Smile,
  GAMES: Gamepad2,
  CLUBBING: PartyPopper,
  FESTS_FAIRS: Tent,
  SIGHTSEEING: Image,
  NIGHTLIFE: Moon,
  MEETUP: Users,
  OTHER: MoreHorizontal,
};

const timeOptions = [
  { label: 'Morning', value: 'morning', icon: Sunrise },
  { label: 'Afternoon', value: 'afternoon', icon: Sun },
  { label: 'Evening', value: 'evening', icon: Sunset },
  { label: 'Night', value: 'night', icon: Moon },
];

function useOutsideDismiss<T extends HTMLElement>(onDismiss: () => void) {
  const containerRef = useRef<T | null>(null);
  useEffect(() => {
    function handle(event: MouseEvent) {
      if (!containerRef.current) return;
      if (!(event.target instanceof Node)) return;
      if (!containerRef.current.contains(event.target)) onDismiss();
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [onDismiss]);
  return containerRef;
}

export default function CategoryFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [categories, setCategories] = useState<Option[]>([]);
  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const [isTimeOpen, setIsTimeOpen] = useState(false);
  const [isDatesOpen, setIsDatesOpen] = useState(false);

  const currentCategory = searchParams.get('category') || '';
  const currentTime = searchParams.get('time') || '';
  const currentDate = searchParams.get('date') || '';

  const wrapperRef = useOutsideDismiss<HTMLDivElement>(() => {
    setIsTypeOpen(false);
    setIsTimeOpen(false);
    setIsDatesOpen(false);
  });

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await getCategories();
        // res.data.categories is array of strings e.g. ["MOVIES", "SPORTS", ...]
        const fetchedCats = res.data.categories.map((cat: string) => ({
          label: cat
            .replace(/_/g, ' ')
            .replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()),
          value: cat,
          icon: categoryIcons[cat] || Sparkles,
        }));
        setCategories(fetchedCats);
      } catch (err) {
        console.error('Failed to fetch categories', err);
      }
    }
    fetchCategories();
  }, []);

  const updateParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.replace(`/?${params.toString()}`);
  };

  const nextFourDates = useMemo(() => {
    const fmt = new Intl.DateTimeFormat(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
    const isoFmt = new Intl.DateTimeFormat('en-CA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    const arr: { label: string; iso: string }[] = [];
    for (let i = 0; i < 4; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      arr.push({ label: fmt.format(d), iso: isoFmt.format(d) });
    }
    return arr;
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6" ref={wrapperRef}>
      <div className="relative flex items-center justify-center gap-2 pb-2 mb-2 w-full max-w-full px-2 sm:px-0">
        <button
          onClick={() => {
            setIsTypeOpen((v) => !v);
            setIsTimeOpen(false);
            setIsDatesOpen(false);
          }}
          className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap border transition-all
              ${
                currentCategory
                  ? 'bg-black text-background border-transparent'
                  : 'bg-surface text-foreground hover:bg-accent/10 border-transparent'
              }`}
        >
          <Sparkles className="h-4 w-4" />
          Category
          <ChevronDown
            className={`h-4 w-4 transition-transform ${isTypeOpen ? 'rotate-180' : 'rotate-0'}`}
          />
          {currentCategory && (
            <span className="ml-1 rounded-full px-2 py-0.5 text-xs bg-white text-black dark:bg-black dark:text-white">
              1
            </span>
          )}
        </button>

        <button
          onClick={() => {
            setIsDatesOpen((v) => !v);
            setIsTypeOpen(false);
            setIsTimeOpen(false);
          }}
          className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap border transition-all
              ${
                currentDate
                  ? 'bg-black text-background border-transparent'
                  : 'bg-surface text-foreground hover:bg-accent/10 border-transparent'
              }`}
        >
          <Calendar className="h-4 w-4" />
          Date
          <ChevronDown
            className={`h-4 w-4 transition-transform ${isDatesOpen ? 'rotate-180' : 'rotate-0'}`}
          />
        </button>

        <button
          onClick={() => {
            setIsTimeOpen((v) => !v);
            setIsTypeOpen(false);
            setIsDatesOpen(false);
          }}
          className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap border transition-all
              ${
                currentTime
                  ? 'bg-black text-background border-transparent'
                  : 'bg-surface text-foreground hover:bg-accent/10 border-transparent'
              }`}
        >
          <Calendar className="h-4 w-4" />
          Time
          <ChevronDown
            className={`h-4 w-4 transition-transform ${isTimeOpen ? 'rotate-180' : 'rotate-0'}`}
          />
        </button>

        {/* Dropdowns */}
        {isTypeOpen && (
          <div className="absolute left-1/2 top-full mt-2 -translate-x-1/2 w-[min(90vw,760px)] max-h-[60vh] overflow-auto rounded-2xl border bg-background p-5 shadow-2xl z-50">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {categories.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    updateParam('category', currentCategory === option.value ? null : option.value);
                    setIsTypeOpen(false);
                  }}
                  className={`flex items-center justify-start gap-3 rounded-full px-4 py-2 text-sm transition-all border ${
                    currentCategory === option.value
                      ? 'bg-accent text-accent-foreground border-transparent'
                      : 'bg-surface text-foreground hover:bg-accent/10 border-transparent'
                  }`}
                >
                  <option.icon className="h-4 w-4" />
                  {option.label}
                </button>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between">
              <button
                onClick={() => updateParam('category', null)}
                className="text-sm text-foreground/70 hover:text-foreground"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {isDatesOpen && (
          <div className="absolute left-1/2 top-full mt-2 -translate-x-1/2 w-[min(90vw,420px)] rounded-2xl border bg-background p-4 shadow-2xl z-50">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {nextFourDates.map((item) => (
                <button
                  key={item.iso}
                  onClick={() => {
                    updateParam('date', currentDate === item.iso ? null : item.iso);
                    setIsDatesOpen(false);
                  }}
                  className={`rounded-full px-4 py-2 text-sm border transition ${
                    currentDate === item.iso
                      ? 'bg-accent text-accent-foreground border-transparent'
                      : 'bg-surface text-foreground hover:bg-accent/10 border-transparent'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between">
              <button
                onClick={() => updateParam('date', null)}
                className="text-sm text-foreground/70 hover:text-foreground"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {isTimeOpen && (
          <div className="absolute left-1/2 top-full mt-2 -translate-x-1/2 w-[min(90vw,360px)] rounded-2xl border bg-background p-4 shadow-2xl z-50">
            <div className="grid grid-cols-1 gap-2">
              {timeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    updateParam('time', currentTime === option.value ? null : option.value);
                    setIsTimeOpen(false);
                  }}
                  className={`w-full text-left rounded-md px-3 py-2 text-sm mb-1 border transition flex items-center gap-3 ${
                    currentTime === option.value
                      ? 'bg-accent text-accent-foreground border-transparent'
                      : 'bg-surface text-foreground hover:bg-accent/10 border-transparent'
                  }`}
                >
                  <option.icon className="h-4 w-4" />
                  {option.label}
                </button>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between">
              <button
                onClick={() => updateParam('time', null)}
                className="text-sm text-foreground/70 hover:text-foreground"
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </div>

      {(currentCategory || currentTime || currentDate) && (
        <div className="mt-4 w-full">
          <div className="flex flex-wrap justify-center sm:justify-start gap-2 pb-2 px-2 sm:px-0">
            {currentCategory && (
              <div className="flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1.5 text-sm text-foreground border border-accent/20 shadow-sm hover:shadow-md transition-all flex-shrink-0">
                <Sparkles className="h-4 w-4 opacity-80" />
                <span>
                  {categories.find((c) => c.value === currentCategory)?.label || currentCategory}
                </span>
                <button
                  onClick={() => updateParam('category', null)}
                  className="ml-1 hover:text-accent-foreground/80 transition"
                >
                  ×
                </button>
              </div>
            )}

            {currentDate && (
              <div className="flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1.5 text-sm text-foreground border border-accent/20 shadow-sm hover:shadow-md transition-all flex-shrink-0">
                <Calendar className="h-4 w-4 opacity-80" />
                <span>{currentDate}</span>
                <button
                  onClick={() => updateParam('date', null)}
                  className="ml-1 hover:text-accent-foreground/80 transition"
                >
                  ×
                </button>
              </div>
            )}

            {currentTime && (
              <div className="flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1.5 text-sm text-foreground border border-accent/20 shadow-sm hover:shadow-md transition-all flex-shrink-0">
                <Calendar className="h-4 w-4 opacity-80" />
                <span className="capitalize">{currentTime}</span>
                <button
                  onClick={() => updateParam('time', null)}
                  className="ml-1 hover:text-accent-foreground/80 transition"
                >
                  ×
                </button>
              </div>
            )}

            <button
              onClick={() => {
                const params = new URLSearchParams(searchParams.toString());
                params.delete('category');
                params.delete('time');
                params.delete('date');
                router.replace(`/?${params.toString()}`);
              }}
              className="ml-2 text-sm text-foreground/60 hover:text-accent transition font-medium flex-shrink-0"
            >
              Clear all
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
