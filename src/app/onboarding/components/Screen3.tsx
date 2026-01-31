'use client';

import { useState, useRef, useMemo } from 'react';
import { Field, FieldInput, FieldSelect } from '@/components/ui/FormField';
import { Label } from '@/components/ui/shadcn/label';
import { Upload, Camera, Instagram, Twitter, Facebook, Linkedin, X } from 'lucide-react';
import imageCompression from 'browser-image-compression';
import { cn } from '@/lib/utils';
import { ProfileData } from '@/types';

interface Screen3Props {
  data: Partial<ProfileData>;
  onChange: (data: Partial<ProfileData>) => void;
  errors: Record<string, string>;
  pendingFiles?: File[];
  onPendingFilesChange?: (files: File[]) => void;
}

export function Screen3({
  data,
  onChange,
  errors,
  pendingFiles = [],
  onPendingFilesChange,
}: Screen3Props) {
  const [verificationMode, setVerificationMode] = useState(false);
  const [activeSocial, setActiveSocial] = useState<Record<string, boolean>>({
    instagram: !!data.socialLinks?.instagram,
    twitter: !!data.socialLinks?.twitter,
    facebook: !!data.socialLinks?.facebook,
    linkedin: !!data.socialLinks?.linkedin,
  });
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const allPhotos = useMemo(() => {
    const s3Urls = (data.photos || []).map((url) => ({ type: 'url', url }));
    const localUrls = pendingFiles.map((file) => ({
      type: 'file',
      url: URL.createObjectURL(file),
      file,
    }));
    return [...s3Urls, ...localUrls];
  }, [data.photos, pendingFiles]);

  const lifestyleOptions = [
    { value: 'YES', label: 'Yes' },
    { value: 'NO', label: 'No' },
    { value: 'OCCASIONALLY', label: 'Occasionally' },
    { value: 'PREFER_NOT_TO_SAY', label: 'Prefer not to say' },
  ];
  const socials = [
    { id: 'instagram', Icon: Instagram, placeholder: '@username' },
    { id: 'twitter', Icon: Twitter, placeholder: '@handle' },
    { id: 'facebook', Icon: Facebook, placeholder: 'Profile URL' },
    { id: 'linkedin', Icon: Linkedin, placeholder: 'Profile URL' },
  ];

  const handleChange = (field: keyof ProfileData, value: string | boolean | object | number) => {
    onChange({ ...data, [field]: value });
  };

  const toggleSocial = (id: string) => setActiveSocial((prev) => ({ ...prev, [id]: !prev[id] }));

  const handleSocialInput = (id: string, value: string) =>
    onChange({
      ...data,
      socialLinks: { ...(data.socialLinks || {}), [id]: value },
    });

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    e.target.value = '';

    const currentCount = allPhotos.length;
    const remainingSlots = 4 - currentCount;

    if (remainingSlots <= 0) {
      return;
    }

    const filesToProcess = files.slice(0, remainingSlots);

    setUploading(true);

    try {
      const processedFiles: File[] = [];
      await Promise.all(
        filesToProcess.map(async (file) => {
          if (!file.type.startsWith('image/')) return;

          const options = {
            maxSizeMB: 0.8,
            maxWidthOrHeight: 1280,
            useWebWorker: true,
          };
          try {
            const compressedFile = await imageCompression(file, options);
            if (compressedFile.size <= 1024 * 1024) {
              // 1MB check
              processedFiles.push(compressedFile);
            }
          } catch (e) {
            console.error('Compression error', e);
          }
        })
      );

      if (processedFiles.length > 0 && onPendingFilesChange) {
        onPendingFilesChange([...pendingFiles, ...processedFiles]);
      }
    } catch (error) {
      console.error('Processing failed', error);
    } finally {
      setUploading(false);
    }
  };

  const removePhoto = (index: number) => {
    const photoToRemove = allPhotos[index];

    if (photoToRemove.type === 'url') {
      const newUrls = (data.photos || []).filter((url) => url !== photoToRemove.url);
      handleChange('photos', newUrls);
    } else {
      const s3Count = (data.photos || []).length;
      const localIndex = index - s3Count;
      if (localIndex >= 0 && onPendingFilesChange) {
        const newPending = [...pendingFiles];
        newPending.splice(localIndex, 1);
        onPendingFilesChange(newPending);
      }
    }
  };

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
            {(['drinks', 'smoke', 'weed'] as const).map((field) => (
              <Field key={field} label={`Do you ${field}?`} error={errors[field]}>
                <FieldSelect
                  value={(data[field] as string) || ''}
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
          <Label className="text-lg font-medium text-foreground">Add Photos (Min 3, Max 4)</Label>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => {
              const photo = allPhotos[i];
              return (
                <div
                  key={i}
                  className={cn(
                    'aspect-square rounded-lg border-2 border-dashed transition-all flex items-center justify-center relative overflow-hidden',
                    photo
                      ? 'border-transparent'
                      : 'border-border hover:border-foreground bg-secondary/30'
                  )}
                  onClick={() => !photo && !uploading && fileInputRef.current?.click()}
                >
                  {photo ? (
                    <div className="w-full h-full relative group">
                      <img
                        src={photo.url}
                        alt={`User photo ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removePhoto(i);
                        }}
                        className="absolute top-2 right-2 bg-black/50 text-white p-1.5 rounded-full hover:bg-black/70 transition-all"
                        type="button"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : uploading ? (
                    <span className="text-xs text-muted-foreground animate-pulse">
                      Uploading...
                    </span>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <Upload className="w-6 h-6" />
                      <span className="text-xs font-medium">Add Photo</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          {errors.photos && <p className="text-sm text-red-500">{errors.photos}</p>}
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
          {errors.selfie && <p className="text-sm text-red-500">{errors.selfie}</p>}
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
