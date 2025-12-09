'use client';

import { Field, FieldInput, FieldTextarea, FieldSelect } from '@/components/ui/FormField';
import { Label } from '@/components/ui/shadcn/label';
import { cn } from '@/lib/utils';
import { ProfileData } from '@/types';

interface Screen1Props {
  data: Partial<ProfileData>;
  onChange: (data: Partial<ProfileData>) => void;
  errors?: Record<string, string>;
}

export function Screen1({ data, onChange, errors = {} }: Screen1Props) {
  const handleChange = (field: string, value: string | string[]) => {
    onChange({ ...data, [field]: value });
  };

  const handleLanguageToggle = (lang: string) => {
    const currentLanguages = data.languages || [];
    const languages = currentLanguages.includes(lang)
      ? currentLanguages.filter((l: string) => l !== lang)
      : [...currentLanguages, lang];
    handleChange('languages', languages);
  };

  const languageOptions = [
    'English',
    'Spanish',
    'French',
    'German',
    'Mandarin',
    'Hindi',
    'Japanese',
  ];

  const genderOptions = [
    { value: 'MALE', label: 'Male' },
    { value: 'FEMALE', label: 'Female' },
    { value: 'NON_BINARY', label: 'Non-Binary' },
    { value: 'PREFER_NOT_TO_SAY', label: 'Prefer not to say' },
  ];

  const educationOptions = [
    'High School',
    'Bachelor’s Degree',
    'Master’s Degree',
    'Ph.D.',
    'Other',
  ];

  return (
    <div className="space-y-12">
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-medium tracking-tight text-foreground">
          Let&apos;s start with the basics
        </h1>
        <p className="text-base text-muted-foreground font-normal">
          We need a few details so your profile doesn’t look like an NPC.
        </p>
      </div>

      <div className="space-y-8">
        <Field label="Full Name" error={errors.name}>
          <FieldInput
            value={data.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="e.g. Jane Doe"
            error={!!errors.name}
          />
        </Field>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Field label="Age" error={errors.age}>
            <FieldSelect
              value={data.age ? String(data.age) : ''}
              onChange={(v) => handleChange('age', v)}
              options={Array.from({ length: 50 }, (_, i) => String(18 + i))}
              placeholder="Select age"
              error={!!errors.age}
            />
          </Field>

          <Field label="Gender" error={errors.gender}>
            <FieldSelect
              value={data.gender || ''}
              onChange={(v) => handleChange('gender', v)}
              options={genderOptions}
              placeholder="Select gender"
              error={!!errors.gender}
            />
          </Field>
        </div>

        <Field label="Education" error={errors.education}>
          <FieldSelect
            value={data.education || ''}
            onChange={(v) => handleChange('education', v)}
            options={['High School', 'Bachelor’s Degree', 'Master’s Degree', 'Ph.D.', 'Other']}
            placeholder="Select education level"
            error={!!errors.education}
          />
        </Field>

        <Field label="What are you currently engaged with in life?" error={errors.lifeEngagement}>
          <FieldTextarea
            placeholder="Studies, work, startup, travel..."
            rows={3}
            value={data.lifeEngagement || ''}
            onChange={(e) => handleChange('lifeEngagement', e.target.value)}
            error={!!errors.lifeEngagement}
          />
        </Field>

        <Field label="Where are you based?" error={errors.city}>
          <FieldInput
            value={data.city || ''}
            onChange={(e) => handleChange('city', e.target.value)}
            placeholder="e.g. New York, NY"
            error={!!errors.city}
          />
        </Field>

        <div className="space-y-3">
          <Label className="text-sm font-medium text-foreground">
            Languages you speak <span className="text-red-500">*</span>
          </Label>
          <div className="flex flex-wrap gap-2">
            {languageOptions.map((lang) => (
              <button
                key={lang}
                onClick={() => handleLanguageToggle(lang)}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-medium border transition-all',
                  (data.languages || []).includes(lang)
                    ? 'bg-foreground text-background border-foreground'
                    : 'bg-background border-border text-foreground hover:border-foreground'
                )}
              >
                {lang}
              </button>
            ))}
          </div>
          {errors.languages && <p className="text-xs text-destructive">{errors.languages}</p>}
        </div>
      </div>
    </div>
  );
}
