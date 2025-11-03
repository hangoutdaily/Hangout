'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Calendar,
  Timer,
  Sparkles,
  ChevronDown,
  Landmark,
  Palette,
  UtensilsCrossed,
  Building2,
  Plane,
  Image,
  Trees,
  ShoppingBag,
  Wine,
  Waves,
  HeartPulse,
  PawPrint,
  Dumbbell,
  LibraryBig,
  Mic2,
} from 'lucide-react';

type Option = {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
};

const typeOptions: Option[] = [
  { label: 'Architecture', value: 'architecture', icon: Building2 },
  { label: 'Art', value: 'art', icon: Palette },
  { label: 'Beauty', value: 'beauty', icon: Sparkles },
  { label: 'Cooking', value: 'cooking', icon: UtensilsCrossed },
  { label: 'Cultural tours', value: 'cultural_tours', icon: LibraryBig },
  { label: 'Dining', value: 'dining', icon: UtensilsCrossed },
  { label: 'Flying', value: 'flying', icon: Plane },
  { label: 'Food tours', value: 'food_tours', icon: UtensilsCrossed },
  { label: 'Galleries', value: 'galleries', icon: Image },
  { label: 'Landmarks', value: 'landmarks', icon: Landmark },
  { label: 'Museums', value: 'museums', icon: Landmark },
  { label: 'Outdoors', value: 'outdoors', icon: Trees },
  { label: 'Performances', value: 'performances', icon: Mic2 },
  { label: 'Shopping & fashion', value: 'shopping', icon: ShoppingBag },
  { label: 'Tastings', value: 'tastings', icon: Wine },
  { label: 'Water sports', value: 'water_sports', icon: Waves },
  { label: 'Wellness', value: 'wellness', icon: HeartPulse },
  { label: 'Wildlife', value: 'wildlife', icon: PawPrint },
  { label: 'Workouts', value: 'workouts', icon: Dumbbell },
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
  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const [isDatesOpen, setIsDatesOpen] = useState(false);
  const [isDurationOpen, setIsDurationOpen] = useState(false);

  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedDurationMin, setSelectedDurationMin] = useState<number | null>(null);

  const wrapperRef = useOutsideDismiss<HTMLDivElement>(() => {
    setIsTypeOpen(false);
    setIsDatesOpen(false);
    setIsDurationOpen(false);
  });

  function toggleType(value: string) {
    setSelectedTypes((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  }

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

  const durationOptions = useMemo(() => {
    const list: number[] = [];
    for (let m = 30; m <= 360; m += 30) list.push(m);
    return list;
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6" ref={wrapperRef}>
      <div className="relative flex items-center justify-center gap-2 pb-2 mb-2 w-full max-w-full px-2 sm:px-0">
        <button
          onClick={() => {
            setIsTypeOpen((v) => !v);
            setIsDatesOpen(false);
            setIsDurationOpen(false);
          }}
          className={`flex items-center gap-2 rounded-full px-2 py-2 text-sm font-medium whitespace-nowrap border transition-all
              ${
                selectedTypes.length > 0
                  ? 'bg-black text-background border-transparent'
                  : 'bg-surface text-foreground hover:bg-accent/10 border-transparent'
              }`}
        >
          <Sparkles className="h-4 w-4" />
          Type
          <ChevronDown
            className={`h-4 w-4 transition-transform ${isTypeOpen ? 'rotate-180' : 'rotate-0'}`}
          />
          {selectedTypes.length > 0 && (
            <span className="ml-1 rounded-full px-2 py-0.5 text-xs bg-white text-black dark:bg-black dark:text-white">
              {selectedTypes.length}
            </span>
          )}
        </button>

        <button
          onClick={() => {
            setIsDatesOpen((v) => !v);
            setIsTypeOpen(false);
            setIsDurationOpen(false);
          }}
          className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap border transition-all
              ${
                selectedDate
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
            setIsDurationOpen((v) => !v);
            setIsTypeOpen(false);
            setIsDatesOpen(false);
          }}
          className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap border transition-all
              ${
                selectedDurationMin !== null
                  ? 'bg-black text-background border-transparent'
                  : 'bg-surface text-foreground hover:bg-accent/10 border-transparent'
              }`}
        >
          <Timer className="h-4 w-4" />
          Time
          <ChevronDown
            className={`h-4 w-4 transition-transform ${isDurationOpen ? 'rotate-180' : 'rotate-0'}`}
          />
        </button>

        {isTypeOpen && (
          <div className="absolute left-1/2 top-full mt-2 -translate-x-1/2 w-[min(90vw,760px)] max-h-[60vh] overflow-auto rounded-2xl border bg-background p-5 shadow-2xl z-50">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {typeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => toggleType(option.value)}
                  className={`flex items-center justify-start gap-3 rounded-full px-4 py-2 text-sm transition-all border ${
                    selectedTypes.includes(option.value)
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
                onClick={() => setSelectedTypes([])}
                className="text-sm text-foreground/70 hover:text-foreground"
              >
                Clear
              </button>
              <button
                onClick={() => setIsTypeOpen(false)}
                className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-foreground"
              >
                Apply
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
                  onClick={() => setSelectedDate((prev) => (prev === item.iso ? '' : item.iso))}
                  className={`rounded-full px-4 py-2 text-sm border transition ${
                    selectedDate === item.iso
                      ? 'bg-accent text-accent-foreground border-transparent'
                      : 'bg-surface text-foreground hover:bg-accent/10 border-transparent'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-end">
              <button
                onClick={() => setIsDatesOpen(false)}
                className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-foreground"
              >
                Apply
              </button>
            </div>
          </div>
        )}

        {isDurationOpen && (
          <div className="absolute left-1/2 top-full mt-2 -translate-x-1/2 w-[min(90vw,360px)] rounded-2xl border bg-background p-4 shadow-2xl z-50">
            <div className="max-h-[240px] overflow-y-auto pr-1">
              {durationOptions.map((min) => {
                const hours = Math.floor(min / 60);
                const minutes = min % 60;
                const label =
                  hours > 0 ? `${hours}h${minutes ? ` ${minutes}m` : ''}` : `${minutes}m`;
                const active = selectedDurationMin === min;
                return (
                  <button
                    key={min}
                    onClick={() => setSelectedDurationMin((prev) => (prev === min ? null : min))}
                    className={`w-full text-left rounded-md px-3 py-2 text-sm mb-1 border transition ${
                      active
                        ? 'bg-accent text-accent-foreground border-transparent'
                        : 'bg-surface text-foreground hover:bg-accent/10 border-transparent'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
            <div className="mt-3 flex items-center justify-between">
              <button
                onClick={() => setSelectedDurationMin(null)}
                className="text-sm text-foreground/70 hover:text-foreground"
              >
                Clear
              </button>
              <button
                className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-foreground"
                onClick={() => setIsDurationOpen(false)}
              >
                Apply
              </button>
            </div>
          </div>
        )}
      </div>

      {(selectedTypes.length > 0 || selectedDate || selectedDurationMin !== null) && (
        <div className="mt-4 w-full">
          <div className="flex flex-wrap justify-center sm:justify-start gap-2 pb-2 px-2 sm:px-0">
            {selectedTypes.map((tag) => {
              const type = typeOptions.find((t) => t.value === tag);
              const Icon = type?.icon;
              return (
                <div
                  key={tag}
                  className="flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1.5 text-sm text-foreground border border-accent/20 shadow-sm hover:shadow-md transition-all flex-shrink-0"
                >
                  {Icon && <Icon className="h-4 w-4 opacity-80" />}
                  <span>{type?.label ?? tag}</span>
                  <button
                    onClick={() => setSelectedTypes((prev) => prev.filter((v) => v !== tag))}
                    className="ml-1 hover:text-accent-foreground/80 transition"
                  >
                    ×
                  </button>
                </div>
              );
            })}

            {selectedDate && (
              <div className="flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1.5 text-sm text-foreground border border-accent/20 shadow-sm hover:shadow-md transition-all flex-shrink-0">
                <Calendar className="h-4 w-4 opacity-80" />
                <span>{selectedDate}</span>
                <button
                  onClick={() => setSelectedDate('')}
                  className="ml-1 hover:text-accent-foreground/80 transition"
                >
                  ×
                </button>
              </div>
            )}

            {selectedDurationMin !== null && (
              <div className="flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1.5 text-sm text-foreground border border-accent/20 shadow-sm hover:shadow-md transition-all flex-shrink-0">
                <Timer className="h-4 w-4 opacity-80" />
                <span>{selectedDurationMin}m</span>
                <button
                  onClick={() => setSelectedDurationMin(null)}
                  className="ml-1 hover:text-accent-foreground/80 transition"
                >
                  ×
                </button>
              </div>
            )}

            <button
              onClick={() => {
                setSelectedTypes([]);
                setSelectedDate('');
                setSelectedDurationMin(null);
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
