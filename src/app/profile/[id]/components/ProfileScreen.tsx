'use client';

import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { ProfileData } from '@/types';
import { useProfile, usePublicProfile, useUpdateProfileMutation } from '@/hooks/useProfile';
import { useMyLikes } from '@/hooks/useMyHangouts';
import { useLikeMutation, useUnlikeMutation } from '@/hooks/useEvents';
import ProfileView from './ProfileView';
import ProfileEditForm from './ProfileEditForm';
import { Skeleton } from '@/components/ui/shadcn/skeleton';
import { AlertTriangle, User, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/shadcn/button';
import Link from 'next/link';

interface ProfileScreenProps {
  id?: string;
}

function ProfileScreenSkeleton() {
  return (
    <div className="space-y-12 max-w-3xl mx-auto px-4 py-10 animate-pulse">
      <Skeleton className="h-10 w-2/3" />
      <Skeleton className="h-6 w-1/3" />
      <div className="flex gap-4">
        <Skeleton className="w-64 h-80 rounded-2xl" />
        <Skeleton className="w-64 h-80 rounded-2xl" />
      </div>
      <Skeleton className="h-6 w-1/3" />
      <Skeleton className="h-16 w-full rounded-xl" />
    </div>
  );
}

const UnauthenticatedProfile = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center space-y-4">
    <div className="w-16 h-16 bg-secondary/30 rounded-full flex items-center justify-center mb-4">
      <User className="w-8 h-8 text-muted-foreground" />
    </div>
    <h2 className="text-2xl font-bold tracking-tight">Strangers need profiles too</h2>
    <p className="text-muted-foreground max-w-sm mx-auto">
      Sign in to create your profile, host hangouts, and turn awkward hellos into real
      conversations.
    </p>
    <Link href="/login" passHref legacyBehavior>
      <Button size="lg" className="mt-4 font-semibold px-8">
        Sign In
      </Button>
    </Link>
  </div>
);

export default function ProfileScreen({ id }: ProfileScreenProps) {
  const { user } = useContext(AuthContext);
  const publicProfile = usePublicProfile(id || '');
  const privateProfile = useProfile(!id);

  const profileData = id ? publicProfile.data : privateProfile.data;
  const profileLoading = id ? publicProfile.isLoading : privateProfile.isLoading;
  const profileError = id ? publicProfile.error : privateProfile.error;

  const { data: likesData } = useMyLikes();
  const updateProfileMutation = useUpdateProfileMutation();
  const likeMutation = useLikeMutation();
  const unlikeMutation = useUnlikeMutation();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ProfileData | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<'profile' | 'hosted' | 'reviews'>('profile');

  const profile = profileData?.profile || profileData || null; // API structure handling
  const loading = profileLoading;
  const error = profileError ? 'Failed to load profile.' : null;

  const isOwnProfile = !id || (user && profile && user.profileId === profile.id);
  const likedEventIds = new Set<string>(likesData?.likedEventIds?.map(String) || []);

  useEffect(() => {
    if (profile && !formData) {
      setFormData(profile);
    }
  }, [profile, formData]);

  const handleLike = async (eventId: string) => {
    if (likedEventIds.has(eventId)) {
      unlikeMutation.mutate(eventId);
    } else {
      likeMutation.mutate(eventId);
    }
  };

  const handleStartEdit = () => {
    if (!profile) return;
    setFormData({
      ...profile,
      age: String(profile.age),
      socialLinks: profile.socialLinks || {},
      traits: profile.traits || [],
      interests: profile.interests || [],
      languages: profile.languages || [],
      photos: profile.photos || [],
    });
    setFormErrors({});
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormErrors({});
    setFormData(profile);
  };

  const validateForm = () => {
    if (!formData) return false;
    const errors: Record<string, string> = {};
    if (!formData.name?.trim()) errors.name = 'Full name is required';
    if (!formData.age) errors.age = 'Age is required';
    if (!formData.gender) errors.gender = 'Gender is required';
    if (!formData.city?.trim()) errors.city = 'Location is required';
    if (!formData.bio?.trim()) errors.bio = 'Bio is required';
    if (!formData.education) errors.education = 'Education is required';
    if (!formData.lifeEngagement?.trim()) errors.lifeEngagement = 'Life engagement is required';
    if (!formData.languages || formData.languages.length === 0)
      errors.languages = 'Select at least one language';
    if (!formData.lookingFor?.trim()) errors.lookingFor = 'This field is required';

    if (!formData.traits || formData.traits.length !== 3) errors.traits = 'Select exactly 3 traits';
    if (!formData.interests || formData.interests.length < 3)
      errors.interests = 'Select at least 3 interests';

    if (!formData.topSongs?.trim()) errors.topSongs = 'This field is required';
    if (!formData.topPlaces?.trim()) errors.topPlaces = 'This field is required';
    if (!formData.joyfulMoment?.trim()) errors.joyfulMoment = 'This field is required';

    if (!formData.drinks) errors.drinks = 'Please select an option';
    if (!formData.smoke) errors.smoke = 'Please select an option';
    if (!formData.weed) errors.weed = 'Please select an option';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async (dataOverride?: Partial<ProfileData>) => {
    const dataToSave = dataOverride && formData ? { ...formData, ...dataOverride } : formData;

    if (!dataToSave) return;

    setFormData(dataToSave);

    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    try {
      await updateProfileMutation.mutateAsync({ ...dataToSave, age: Number(dataToSave.age) });
      setIsEditing(false);
    } catch {
      alert('Failed to save profile changes.');
    }
  };

  const updateField = (
    field: keyof ProfileData,
    value: string | number | string[] | Record<string, string>
  ) => {
    if (!formData) return;
    setFormData((prev) => (prev ? { ...prev, [field]: value } : null));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const toggleList = (key: 'traits' | 'interests' | 'languages', item: string, limit?: number) => {
    setFormData((prev) => {
      if (!prev) return null;
      const list = (prev[key] as string[]) || [];
      const isSelected = list.includes(item);
      let newList;

      if (isSelected) {
        newList = list.filter((i: string) => i !== item);
      } else {
        if (limit && list.length >= limit) return prev;
        newList = [...list, item];
      }

      if (formErrors[key]) {
        const isValid = key === 'traits' ? newList.length === 3 : newList.length >= 3;
        if (isValid) setFormErrors((errs) => ({ ...errs, [key]: '' }));
      }

      return { ...prev, [key]: newList };
    });
  };

  if (loading) return <ProfileScreenSkeleton />;

  if (!user && !id) {
    return (
      <div className="min-h-screen bg-background pt-10">
        <UnauthenticatedProfile />
      </div>
    );
  }

  if (id && !user) {
    return (
      <div className="min-h-screen bg-background pt-10">
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center space-y-4">
          <div className="w-16 h-16 bg-secondary/30 rounded-full flex items-center justify-center mb-4">
            <User className="w-8 h-8 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Nice try 👀</h2>
          <p className="text-muted-foreground max-w-sm mx-auto">
            Profiles are for members only. Sign in to unlock the full story behind this person.
          </p>
          <Link href="/login" passHref legacyBehavior>
            <Button size="lg" className="mt-4 font-semibold px-8">
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <AlertTriangle className="w-10 h-10 text-destructive mx-auto mb-2" />
        <h2 className="text-2xl font-bold mb-1">
          Oops! We couldn’t load your profile. Please log in again.
        </h2>
        <p className="text-muted-foreground">{error || 'We lost the thread.'}</p>
      </div>
    );
  }

  if (isEditing && isOwnProfile && formData) {
    return (
      <ProfileEditForm
        formData={formData}
        formErrors={formErrors}
        isSaving={updateProfileMutation.isPending}
        onUpdateField={updateField}
        onToggleList={toggleList}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <div className="relative">
      {isOwnProfile && !isEditing && (
        <div className="max-w-3xl mx-auto px-4 relative">
          <div className="absolute top-10 right-4 z-10 flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleStartEdit}
              className="gap-2 bg-background border-border hover:text-foreground hover:border-foreground hover:bg-secondary/50 transition-all "
            >
              <Edit2 className="w-4 h-4" /> Edit
            </Button>
          </div>
        </div>
      )}
      <ProfileView
        profile={profile}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        likedEventIds={likedEventIds}
        handleLike={handleLike}
      />
    </div>
  );
}
