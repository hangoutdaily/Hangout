'use client';

import { Field, FieldInput, FieldTextarea } from '@/components/ui/FormField';
import { Label } from '@/components/ui/shadcn/label';
import { cn } from '@/lib/utils';
import {
  Mountain,
  Music,
  UtensilsCrossed,
  Camera,
  Film,
  Coffee,
  ShoppingBag,
  ChefHat,
  Play as Paw,
  Dumbbell,
  Moon,
  Building2,
  Footprints,
  Car,
  Waves,
  Frame,
} from 'lucide-react';
import { ProfileData } from '@/types';

interface Screen2Props {
  data: Partial<ProfileData>;
  onChange: (data: Partial<ProfileData>) => void;
  errors?: Record<string, string>;
}

export function Screen2({ data, onChange, errors = {} }: Screen2Props) {
  const handleChange = (field: string, value: string | string[]) => {
    onChange({ ...data, [field]: value });
  };

  const handleToggle = (key: 'traits' | 'interests', item: string, limit: number) => {
    const list = (data[key] || []) as string[];
    const newList = list.includes(item)
      ? list.filter((t: string) => t !== item)
      : list.length < limit
        ? [...list, item]
        : list;
    handleChange(key, newList);
  };

  const traits = [
    'Empathetic',
    'Witty',
    'Curious',
    'Bold',
    'Chill',
    'Adventurous',
    'Philosophical',
    'Nerdy',
    'Deep Thinker',
    'Extrovert',
    'Ambivert',
    'Introvert',
    'Creative',
    'Spontaneous',
  ];

  const interests = [
    { name: 'Outdoors', Icon: Mountain },
    { name: 'Live Music', Icon: Music },
    { name: 'Food Scenes', Icon: UtensilsCrossed },
    { name: 'Photography', Icon: Camera },
    { name: 'Films', Icon: Film },
    { name: 'Coffee', Icon: Coffee },
    { name: 'Shopping', Icon: ShoppingBag },
    { name: 'Cooking', Icon: ChefHat },
    { name: 'Animals', Icon: Paw },
    { name: 'Fitness', Icon: Dumbbell },
    { name: 'Nightlife', Icon: Moon },
    { name: 'Local Culture', Icon: Building2 },
    { name: 'Walking', Icon: Footprints },
    { name: 'Cars', Icon: Car },
    { name: 'Swimming', Icon: Waves },
    { name: 'Art', Icon: Frame },
  ];

  return (
    <div className="space-y-12">
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-medium tracking-tight text-foreground">
          Tell us about yourself
        </h1>
        <p className="text-base text-muted-foreground font-normal">
          We’re building your profile — not a résumé.
        </p>
      </div>

      <div className="space-y-8">
        <Field label="One-liner bio" error={errors.bio}>
          <FieldInput
            placeholder="Coffee enthusiast, weekend hiker, book lover"
            maxLength={100}
            value={data.bio}
            onChange={(e) => handleChange('bio', e.target.value)}
            error={!!errors.bio}
          />
        </Field>

        <Field label="What are you looking for on Hangout?" error={errors.lookingFor}>
          <FieldTextarea
            placeholder="Looking for genuine connections and people to explore the city with..."
            rows={4}
            value={data.lookingFor}
            onChange={(e) => handleChange('lookingFor', e.target.value)}
            error={!!errors.lookingFor}
          />
        </Field>

        <div className="space-y-3">
          <Label className="text-sm font-medium text-foreground">
            Pick 3 traits that describe you
          </Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {traits.map((trait) => (
              <button
                key={trait}
                onClick={() => handleToggle('traits', trait, 3)}
                className={cn(
                  'px-4 py-3 rounded-lg text-sm font-medium border transition-all text-center',
                  (data.traits || []).includes(trait)
                    ? 'bg-foreground text-background border-foreground'
                    : 'bg-background border-border text-foreground hover:border-foreground'
                )}
              >
                {trait}
              </button>
            ))}
          </div>
          {errors.traits && <p className="text-xs text-destructive">{errors.traits}</p>}
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium text-foreground">What are you excited about?</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {interests.map(({ name, Icon }) => (
              <button
                key={name}
                onClick={() => handleToggle('interests', name, 5)}
                className={cn(
                  'px-4 py-3 rounded-lg text-sm font-medium border flex items-center gap-2 transition-all',
                  (data.interests || []).includes(name)
                    ? 'bg-foreground text-background border-foreground'
                    : 'bg-background border-border text-foreground hover:border-foreground'
                )}
              >
                <Icon className="w-4 h-4" /> {name}
              </button>
            ))}
          </div>
          {errors.interests && <p className="text-xs text-destructive">{errors.interests}</p>}
        </div>

        <Field label="Your favorite songs" error={errors.topSongs}>
          <FieldTextarea
            placeholder="Music that hits different at 2am..."
            rows={4}
            value={data.topSongs}
            onChange={(e) => handleChange('topSongs', e.target.value)}
            error={!!errors.topSongs}
          />
        </Field>

        <Field label="Your favorite places" error={errors.topPlaces}>
          <FieldTextarea
            placeholder="Favorite restaurants, travel spots, or local hidden gems..."
            rows={4}
            value={data.topPlaces}
            onChange={(e) => handleChange('topPlaces', e.target.value)}
            error={!!errors.topPlaces}
          />
        </Field>

        <Field label="What's your most joyful moment?" error={errors.joyfulMoment}>
          <FieldTextarea
            placeholder="Share a meaningful memory or experience..."
            rows={4}
            value={data.joyfulMoment}
            onChange={(e) => handleChange('joyfulMoment', e.target.value)}
            error={!!errors.joyfulMoment}
          />
        </Field>
      </div>
    </div>
  );
}
