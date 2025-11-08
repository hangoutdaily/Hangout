'use client';

import { useState } from 'react';
import { Field, FieldInput, FieldSelect } from '@/components/ui/FormField';
import { Label } from '@/components/ui/shadcn/label';
import { Upload, Camera, Instagram, Twitter, Facebook, Linkedin } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Screen3Props {
  data: any;
  onChange: (data: any) => void;
  errors?: Record<string, string>;
}

export function Screen3({ data, onChange, errors = {} }: Screen3Props) {
  const [verificationMode, setVerificationMode] = useState(false);
  const [activeSocial, setActiveSocial] = useState<Record<string, boolean>>({
    instagram: !!data.socialLinks?.instagram,
    twitter: !!data.socialLinks?.twitter,
    facebook: !!data.socialLinks?.facebook,
    linkedin: !!data.socialLinks?.linkedin,
  });

  const lifestyleOptions = ['Yes', 'No', 'Occasionally', 'Prefer not to say'];
  const socials = [
    { id: 'instagram', Icon: Instagram, placeholder: '@username' },
    { id: 'twitter', Icon: Twitter, placeholder: '@handle' },
    { id: 'facebook', Icon: Facebook, placeholder: 'Profile URL' },
    { id: 'linkedin', Icon: Linkedin, placeholder: 'Profile URL' },
  ];

  const handleChange = (field: string, value: any) => onChange({ ...data, [field]: value });

  const toggleSocial = (id: string) => setActiveSocial((prev) => ({ ...prev, [id]: !prev[id] }));

  const handleSocialInput = (id: string, value: string) =>
    onChange({
      ...data,
      socialLinks: { ...data.socialLinks, [id]: value },
    });

  return (
    <div className="space-y-12">
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-medium tracking-tight text-foreground">
          Photos and final details
        </h1>
        <p className="text-base text-muted-foreground font-normal">
          Add photos and tell us about your lifestyle preferences
        </p>
      </div>

      <div className="space-y-8">
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-foreground">Lifestyle</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {['drinks', 'smoke', 'weed'].map((field) => (
              <Field key={field} label={`Do you ${field}?`} error={errors[field]}>
                <FieldSelect
                  value={data[field]}
                  onChange={(v) => handleChange(field, v)}
                  options={lifestyleOptions}
                  placeholder="Select"
                  error={!!errors[field]}
                />
              </Field>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <Label className="text-lg font-medium text-foreground">Add Photos</Label>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <button
                key={i}
                className="aspect-square rounded-lg border-2 border-dashed border-border hover:border-foreground transition-all flex items-center justify-center bg-secondary/30"
              >
                <Upload className="w-5 h-5 text-muted-foreground" />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <Label className="text-lg font-medium text-foreground">Verify your identity</Label>
          <button
            type="button"
            onClick={() => setVerificationMode(!verificationMode)}
            className={cn(
              'w-full border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center text-center transition-all',
              verificationMode
                ? 'border-foreground bg-foreground/5'
                : 'border-border hover:border-foreground'
            )}
          >
            <Camera className="w-8 h-8 mb-3 text-muted-foreground" />
            <p className="font-medium text-foreground">
              {verificationMode ? 'Camera Active' : 'Verify with Selfie'}
            </p>
          </button>
        </div>

        <div className="space-y-3">
          <Label className="text-lg font-medium text-foreground">Social Links (optional)</Label>
          <div className="flex gap-3 flex-wrap">
            {socials.map(({ id, Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => toggleSocial(id)}
                className={cn(
                  'p-3 rounded-lg border-2 transition-all',
                  activeSocial[id]
                    ? 'border-foreground bg-foreground text-background'
                    : 'border-border text-muted-foreground hover:border-foreground'
                )}
              >
                <Icon className="w-5 h-5" />
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {socials.map(
              ({ id, placeholder }) =>
                activeSocial[id] && (
                  <Field key={id} label={id.charAt(0).toUpperCase() + id.slice(1)}>
                    <FieldInput
                      placeholder={placeholder}
                      value={data.socialLinks?.[id] || ''}
                      onChange={(e) => handleSocialInput(id, e.target.value)}
                    />
                  </Field>
                )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
