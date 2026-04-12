'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { Check, ImageIcon, Loader2, Search, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/shadcn/button';
import { Input } from '@/components/ui/shadcn/input';
import { cn } from '@/lib/utils';
import {
  getCategoryImageQuery,
  getUnsplashSourceImage,
  isUnsplashAccessKeyConfigured,
  searchUnsplashPhotos,
  UnsplashPhoto,
} from '@/lib/unsplash';

interface CoverImagePickerProps {
  category?: string;
  selectedImage: string;
  onSelectImage: (imageUrl: string) => void;
  lockAutoSelection?: boolean;
}

export default function CoverImagePicker({
  category,
  selectedImage,
  onSelectImage,
  lockAutoSelection = false,
}: CoverImagePickerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeQuery, setActiveQuery] = useState('');
  const [results, setResults] = useState<UnsplashPhoto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const manuallyPickedRef = useRef(Boolean(selectedImage));
  const initializedRef = useRef(false);

  const categoryQuery = useMemo(() => getCategoryImageQuery(category), [category]);
  const keyConfigured = isUnsplashAccessKeyConfigured();
  const defaultInviteQuery = 'you are invited comic illustration poster pop art';

  const loadImages = useCallback(
    async (query: string, autoSelect = false) => {
      if (!query.trim()) return;

      setIsLoading(true);
      setError(null);
      setActiveQuery(query);

      try {
        if (!keyConfigured) {
          const fallbackImage = getUnsplashSourceImage(query);
          const fallbackResult: UnsplashPhoto = {
            id: `source-${query}`,
            altDescription: `${query} cover image`,
            thumbUrl: fallbackImage,
            regularUrl: fallbackImage,
            photographerName: 'Unsplash',
            photographerLink: 'https://unsplash.com',
          };
          setResults([fallbackResult]);
          if (autoSelect && !manuallyPickedRef.current && !lockAutoSelection) {
            onSelectImage(fallbackImage);
          }
          return;
        }

        const photos = await searchUnsplashPhotos({ query, perPage: 12, page: 1 });
        setResults(photos);

        if (photos.length === 0) {
          setError('No matching images found. Try another keyword.');
        } else if (autoSelect && !manuallyPickedRef.current && !lockAutoSelection) {
          onSelectImage(photos[0].regularUrl);
        }
      } catch {
        setError('Unable to load images right now. Try again.');
      } finally {
        setIsLoading(false);
      }
    },
    [keyConfigured, lockAutoSelection, onSelectImage]
  );

  useEffect(() => {
    if (initializedRef.current) return;

    const initialQuery = category ? categoryQuery : defaultInviteQuery;
    setSearchQuery(initialQuery);
    void loadImages(initialQuery, true);

    initializedRef.current = true;
  }, [category, categoryQuery, defaultInviteQuery, loadImages]);

  const handleSearch = () => {
    manuallyPickedRef.current = true;
    void loadImages(searchQuery || categoryQuery);
  };

  const selectImage = (photo: UnsplashPhoto) => {
    manuallyPickedRef.current = true;
    onSelectImage(photo.regularUrl);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-secondary/20 overflow-hidden">
        {selectedImage ? (
          <div className="relative h-48 sm:h-56">
            <Image src={selectedImage} alt="Selected cover image" fill className="object-cover" />
            <div className="absolute left-3 top-3 rounded-full bg-black/60 text-white px-3 py-1 text-xs font-medium flex items-center gap-1">
              <Check className="h-3.5 w-3.5" />
              Selected Cover
            </div>
          </div>
        ) : (
          <div className="h-48 sm:h-56 flex items-center justify-center text-muted-foreground gap-2">
            <ImageIcon className="w-5 h-5" />
            Pick a cover image
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSearch();
              }
            }}
            className="pl-9"
            placeholder="Search Unsplash covers"
          />
        </div>
        <Button type="button" variant="outline" onClick={handleSearch} disabled={isLoading}>
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Search'}
        </Button>
      </div>

      {!keyConfigured && (
        <p className="text-xs text-muted-foreground">
          Add `NEXT_PUBLIC_UNSPLASH_ACCESS_KEY` for full Unsplash gallery search.
        </p>
      )}

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground flex items-center gap-1.5">
          <Sparkles className="h-4 w-4 text-accent" />
          Suggestions for: <span className="font-medium text-foreground">{activeQuery || '-'}</span>
        </p>
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {results.map((photo) => {
          const isSelected = photo.regularUrl === selectedImage;

          return (
            <button
              key={photo.id}
              type="button"
              onClick={() => selectImage(photo)}
              className={cn(
                'relative h-28 sm:h-32 rounded-xl overflow-hidden border transition-all',
                isSelected
                  ? 'border-accent ring-2 ring-accent/30'
                  : 'border-border hover:border-accent/50'
              )}
            >
              <Image
                src={photo.thumbUrl}
                alt={photo.altDescription}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 50vw, 33vw"
              />

              {isSelected && (
                <div className="absolute right-2 top-2 bg-black/60 text-white rounded-full p-1">
                  <Check className="h-3.5 w-3.5" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
