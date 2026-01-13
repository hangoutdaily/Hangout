import React from 'react';
import Image from 'next/image';
import {
  X,
  Loader2,
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
  Mountain,
  UtensilsCrossed,
  Music,
  Upload,
  Instagram,
  Twitter,
  Facebook,
  Linkedin,
} from 'lucide-react';
import { Button } from '@/components/ui/shadcn/button';
import { Label } from '@/components/ui/shadcn/label';
import { Field, FieldInput, FieldSelect, FieldTextarea } from '@/components/ui/FormField';
import { cn } from '@/lib/utils';
import { ProfileData } from '@/types';

const TRAITS = [
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

const INTERESTS = [
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

const LIFESTYLE_OPTIONS = [
  { value: 'YES', label: 'Yes' },
  { value: 'NO', label: 'No' },
  { value: 'OCCASIONALLY', label: 'Occasionally' },
  { value: 'PREFER_NOT_TO_SAY', label: 'Prefer not to say' },
];

const GENDER_OPTIONS = [
  { value: 'MALE', label: 'Male' },
  { value: 'FEMALE', label: 'Female' },
  { value: 'NON_BINARY', label: 'Non-Binary' },
  { value: 'PREFER_NOT_TO_SAY', label: 'Prefer not to say' },
];

const EDUCATION_OPTIONS = ['High School', 'Bachelor’s Degree', 'Master’s Degree', 'Ph.D.', 'Other'];
const LANGUAGE_OPTIONS = [
  'English',
  'Spanish',
  'French',
  'German',
  'Mandarin',
  'Hindi',
  'Japanese',
];

const SOCIALS = [
  { id: 'instagram', Icon: Instagram, placeholder: '@username' },
  { id: 'twitter', Icon: Twitter, placeholder: '@handle' },
  { id: 'facebook', Icon: Facebook, placeholder: 'Profile URL' },
  { id: 'linkedin', Icon: Linkedin, placeholder: 'Profile URL' },
];

const SectionHeader = ({ title, subtitle }: { title: string; subtitle?: string }) => (
  <div className="space-y-1 mb-4">
    <h1 className="text-3xl md:text-4xl font-medium tracking-tight">{title}</h1>
    {subtitle && <p className="text-base text-muted-foreground font-normal">{subtitle}</p>}
  </div>
);

interface ProfileEditFormProps {
  formData: ProfileData;
  formErrors: Record<string, string>;
  isSaving: boolean;
  onUpdateField: (
    field: keyof ProfileData,
    value: string | number | string[] | Record<string, string>
  ) => void;
  onToggleList: (key: 'traits' | 'interests' | 'languages', item: string, limit?: number) => void;
  onSave: () => void;
  onCancel: () => void;
}

export default function ProfileEditForm({
  formData,
  formErrors,
  isSaving,
  onUpdateField,
  onToggleList,
  onSave,
  onCancel,
}: ProfileEditFormProps) {
  const allPhotos = [formData.selfie, ...formData.photos].filter(Boolean);
  const displayPhotos = allPhotos.length > 0 ? allPhotos.slice(0, 3) : [];

  const updateSocialLink = (id: string, value: string) => {
    const newSocials = { ...(formData.socialLinks || {}), [id]: value };
    onUpdateField('socialLinks', newSocials);
  };

  return (
    <div className="space-y-16 max-w-3xl mx-auto px-4 py-10 pb-32">
      <div>
        <SectionHeader
          title="Make Yourself Cooler"
          subtitle="Help others get a clear sense of you before meeting offline."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <Field label="Full Name" error={formErrors.name}>
            <FieldInput
              value={formData.name}
              onChange={(e) => onUpdateField('name', e.target.value)}
              error={!!formErrors.name}
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Age" error={formErrors.age}>
              <FieldSelect
                value={String(formData.age)}
                options={Array.from({ length: 50 }, (_, i) => String(18 + i))}
                onChange={(v) => onUpdateField('age', v)}
                error={!!formErrors.age}
              />
            </Field>
            <Field label="Gender" error={formErrors.gender}>
              <FieldSelect
                value={formData.gender}
                options={GENDER_OPTIONS}
                onChange={(v) => onUpdateField('gender', v)}
                error={!!formErrors.gender}
              />
            </Field>
          </div>
        </div>
        <Field label="Location" error={formErrors.city}>
          <FieldInput
            value={formData.city}
            onChange={(e) => onUpdateField('city', e.target.value)}
            error={!!formErrors.city}
          />
        </Field>
        <div className="mt-4">
          <Field label="Bio" error={formErrors.bio}>
            <FieldTextarea
              value={formData.bio}
              onChange={(e) => onUpdateField('bio', e.target.value)}
              error={!!formErrors.bio}
            />
          </Field>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-3 snap-x scrollbar-hide">
        <div className="w-64 h-80 rounded-2xl bg-secondary border-2 border-dashed border-muted-foreground/20 flex flex-col items-center justify-center shrink-0 snap-center cursor-pointer hover:bg-secondary/80 transition-colors">
          <Upload className="w-8 h-8 text-muted-foreground mb-2" />
          <span className="text-sm font-medium">Add Photo</span>
        </div>
        {displayPhotos.map((src, i) => (
          <div
            key={i}
            className="w-64 h-80 rounded-2xl overflow-hidden bg-muted flex-shrink-0 snap-center relative"
          >
            <Image
              src={src || ''}
              alt="Profile photo"
              width={300}
              height={500}
              className="object-cover w-full h-full"
            />
            <button className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <section className="space-y-3">
        <SectionHeader title="The Basics" subtitle="Stuff you should probably know" />
        <Field label="My education" error={formErrors.education}>
          <FieldSelect
            value={formData.education}
            options={EDUCATION_OPTIONS}
            onChange={(v) => onUpdateField('education', v)}
            error={!!formErrors.education}
          />
        </Field>
        <Field label="My Life Right Now" error={formErrors.lifeEngagement}>
          <FieldInput
            value={formData.lifeEngagement}
            onChange={(e) => onUpdateField('lifeEngagement', e.target.value)}
            error={!!formErrors.lifeEngagement}
          />
        </Field>
        <div>
          <Label className="mb-2 block">
            Speaks <span className="text-destructive">*</span>
          </Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {LANGUAGE_OPTIONS.map((lang) => (
              <button
                key={lang}
                onClick={() => onToggleList('languages', lang)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-xs font-medium border',
                  formData.languages?.includes(lang)
                    ? 'bg-foreground text-background border-foreground'
                    : 'bg-background border-border text-foreground hover:border-foreground'
                )}
              >
                {lang}
              </button>
            ))}
          </div>
          {formErrors.languages && (
            <p className="text-xs text-destructive mt-1">{formErrors.languages}</p>
          )}
        </div>
        <Field label="Here For" error={formErrors.lookingFor}>
          <FieldInput
            value={formData.lookingFor}
            onChange={(e) => onUpdateField('lookingFor', e.target.value)}
            error={!!formErrors.lookingFor}
          />
        </Field>
      </section>

      <section className="space-y-3">
        <SectionHeader title="What I’m Like" subtitle="Traits, vibes & how I show up" />
        <div>
          <Label className="mb-2 block">
            Traits (Pick 3) <span className="text-destructive">*</span>
          </Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {TRAITS.map((t) => (
              <button
                key={t}
                onClick={() => onToggleList('traits', t, 3)}
                className={cn(
                  'px-4 py-3 rounded-lg text-sm font-medium border flex items-center gap-2 transition-all',
                  formData.traits?.includes(t)
                    ? 'bg-foreground text-background border-foreground'
                    : 'bg-background border-border text-foreground hover:border-foreground'
                )}
              >
                {t}
              </button>
            ))}
          </div>
          {formErrors.traits && (
            <p className="text-xs text-destructive mt-1">{formErrors.traits}</p>
          )}
        </div>
        <div className="mt-8">
          <Label className="mb-4 block">
            Interests (at least 3) <span className="text-destructive">*</span>
          </Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {INTERESTS.map(({ name, Icon }) => (
              <button
                key={name}
                onClick={() => onToggleList('interests', name)}
                className={cn(
                  'px-4 py-3 rounded-lg text-sm font-medium border flex items-center gap-2 transition-all',
                  formData.interests?.includes(name)
                    ? 'bg-foreground text-background border-foreground'
                    : 'bg-background border-border'
                )}
              >
                <Icon className="w-4 h-4" /> {name}
              </button>
            ))}
          </div>
          {formErrors.interests && (
            <p className="text-xs text-destructive mt-1">{formErrors.interests}</p>
          )}
        </div>
      </section>

      <section className="space-y-3">
        <SectionHeader title="My Favourites" subtitle="Small things that define me" />
        <div className="space-y-4">
          <Field label="Top Songs" error={formErrors.topSongs}>
            <FieldTextarea
              value={formData.topSongs}
              onChange={(e) => onUpdateField('topSongs', e.target.value)}
              className="min-h-[80px] scrollbar-hide"
              error={!!formErrors.topSongs}
            />
          </Field>
          <Field label="Favorite Places" error={formErrors.topPlaces}>
            <FieldTextarea
              value={formData.topPlaces}
              onChange={(e) => onUpdateField('topPlaces', e.target.value)}
              className="min-h-[80px] scrollbar-hide"
              error={!!formErrors.topPlaces}
            />
          </Field>
          <Field label="Joyful Moment" error={formErrors.joyfulMoment}>
            <FieldTextarea
              value={formData.joyfulMoment}
              onChange={(e) => onUpdateField('joyfulMoment', e.target.value)}
              className="min-h-[80px] scrollbar-hide"
              error={!!formErrors.joyfulMoment}
            />
          </Field>
        </div>
      </section>

      <section className="space-y-3">
        <SectionHeader title="Lifestyle" subtitle="Little habits that say a lot" />
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <Label className="mb-1.5 block">
              Drinks <span className="text-destructive">*</span>
            </Label>
            <FieldSelect
              value={formData.drinks}
              options={LIFESTYLE_OPTIONS}
              onChange={(v) => onUpdateField('drinks', v)}
              error={!!formErrors.drinks}
            />
            {formErrors.drinks && (
              <p className="text-xs text-destructive mt-1">{formErrors.drinks}</p>
            )}
          </div>
          <div>
            <Label className="mb-1.5 block">
              Smokes <span className="text-destructive">*</span>
            </Label>
            <FieldSelect
              value={formData.smoke}
              options={LIFESTYLE_OPTIONS}
              onChange={(v) => onUpdateField('smoke', v)}
              error={!!formErrors.smoke}
            />
            {formErrors.smoke && (
              <p className="text-xs text-destructive mt-1">{formErrors.smoke}</p>
            )}
          </div>
          <div>
            <Label className="mb-1.5 block">
              Weed <span className="text-destructive">*</span>
            </Label>
            <FieldSelect
              value={formData.weed}
              options={LIFESTYLE_OPTIONS}
              onChange={(v) => onUpdateField('weed', v)}
              error={!!formErrors.weed}
            />
            {formErrors.weed && <p className="text-xs text-destructive mt-1">{formErrors.weed}</p>}
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <SectionHeader title="Find Me Online" subtitle="A few links before we meet for real" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SOCIALS.map(({ id, Icon, placeholder }) => (
            <div
              key={id}
              className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card"
            >
              <div className="w-10 h-10 rounded-full bg-foreground text-background grid place-items-center shrink-0">
                <Icon className="w-5 h-5" />
              </div>
              <input
                className="w-full bg-transparent border-none outline-none text-sm placeholder:text-muted-foreground/50"
                placeholder={placeholder}
                value={formData.socialLinks?.[id] || ''}
                onChange={(e) => updateSocialLink(id, e.target.value)}
              />
            </div>
          ))}
        </div>
      </section>

      <div className="max-w-2xl mx-auto flex gap-3">
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={isSaving}
          className="w-full  flex-1 bg-background border-border hover:text-foreground hover:border-foreground hover:bg-secondary/50 transition-all h-12 font-medium"
        >
          Cancel
        </Button>
        <Button
          onClick={onSave}
          disabled={isSaving}
          className="w-full flex-1 bg-foreground hover:bg-foreground/90 text-background font-medium h-12 transition-all"
        >
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Done
        </Button>
      </div>
    </div>
  );
}
