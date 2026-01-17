'use client';

import { useState, useEffect } from 'react';
import { Screen1 } from '@/app/onboarding/components/Screen1';
import { Screen2 } from '@/app/onboarding/components/Screen2';
import { Screen3 } from '@/app/onboarding/components/Screen3';
import { ProgressBar } from './ProgressBar';
import { useRouter } from 'next/navigation';
import { NavigationControls } from './NavigationControls';
import { ProfileData } from '@/types';
import { createProfile } from '@/api/profile';

export function OnboardingContainer() {
  const [currentScreen, setCurrentScreen] = useState(0);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [formData, setFormData] = useState<Partial<ProfileData>>({
    // Screen 1
    name: '',
    age: '',
    gender: 'PREFER_NOT_TO_SAY',
    education: '',
    lifeEngagement: '',
    city: '',
    languages: [] as string[],

    // Screen 2
    bio: '',
    lookingFor: '',
    traits: [] as string[],
    interests: [] as string[],
    topSongs: '',
    topPlaces: '',
    joyfulMoment: '',

    // Screen 3
    drinks: 'PREFER_NOT_TO_SAY',
    smoke: 'PREFER_NOT_TO_SAY',
    weed: 'PREFER_NOT_TO_SAY',
    photos: [] as string[],
    selfie: '',
    socialLinks: {},
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const router = useRouter();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentScreen]);

  const validateScreenRealtime = (
    screenIndex: number,
    data: Partial<ProfileData>
  ): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (screenIndex === 0) {
      if (!data.name?.trim()) errors.name = 'Full name is required';
      if (!data.age) errors.age = 'Age is required';
      if (!data.gender) errors.gender = 'Gender is required';
      if (!data.education) errors.education = 'Education is required';
      if (!data.lifeEngagement?.trim()) errors.lifeEngagement = 'This field is required';
      if (!data.city?.trim()) errors.city = 'Location is required';
      if ((data.languages || []).length === 0) errors.languages = 'Select at least one language';
    } else if (screenIndex === 1) {
      if (!data.bio?.trim()) errors.bio = 'Bio is required';
      if (!data.lookingFor?.trim()) errors.lookingFor = "Tell us what you're looking for";
      if ((data.traits || []).length !== 3) errors.traits = 'Select exactly 3 traits';
      if ((data.interests || []).length < 1) errors.interests = 'Select at least 1 interest';
      // if (!data.topSongs?.trim()) errors.topSongs = 'Share your favorite songs';
      // if (!data.topPlaces?.trim()) errors.topPlaces = 'Share your favorite places';
      // if (!data.joyfulMoment?.trim()) errors.joyfulMoment = 'Share your joyful moment';
    } else if (screenIndex === 2) {
      if (!data.drinks) errors.drinks = 'Please select an option';
      if (!data.smoke) errors.smoke = 'Please select an option';
      if (!data.weed) errors.weed = 'Please select an option';
      if ((data.photos || []).length < 3) errors.photos = 'Upload at least 3 photos';
      if (!data.selfie) errors.selfie = 'Selfie verification is required';
    }

    return errors;
  };

  const handleFormChange = (newData: Partial<ProfileData>) => {
    setFormData(newData);
    // Re-validate on every change to clear errors if field becomes valid
    if (hasAttemptedSubmit) {
      const errors = validateScreenRealtime(currentScreen, newData);
      setValidationErrors(errors);
    }
  };

  const validateScreen = (screenIndex: number): boolean => {
    const errors = validateScreenRealtime(screenIndex, formData);
    setValidationErrors(errors);
    setHasAttemptedSubmit(true);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateScreen(currentScreen)) {
      if (currentScreen < screens.length - 1) {
        setCurrentScreen(currentScreen + 1);
        setHasAttemptedSubmit(false);
        setValidationErrors({});
      }
    }
  };

  const handlePrev = () => {
    if (currentScreen > 0) {
      setCurrentScreen(currentScreen - 1);
      setHasAttemptedSubmit(false);
      setValidationErrors({});
    }
  };

  const handleSubmit = async () => {
    try {
      // For now ignoring photos upload
      const payload = {
        ...formData,
        age: Number(formData.age),
        traits: Array.from(formData.traits || []),
        interests: Array.from(formData.interests || []),
        languages: Array.from(formData.languages || []),
      };
      await createProfile(payload);
      router.push('/');
    } catch (err) {}
  };

  const screens = [
    <Screen1
      key="screen-1"
      data={formData}
      onChange={handleFormChange}
      errors={validationErrors}
    />,
    <Screen2
      key="screen-2"
      data={formData}
      onChange={handleFormChange}
      errors={validationErrors}
    />,
    <Screen3
      key="screen-3"
      data={formData}
      onChange={handleFormChange}
      errors={validationErrors}
    />,
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <ProgressBar current={currentScreen + 1} total={screens.length} />

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-2xl">{screens[currentScreen]}</div>
      </div>

      <NavigationControls
        currentScreen={currentScreen}
        totalScreens={screens.length}
        onNext={handleNext}
        onPrev={handlePrev}
        onSubmit={handleSubmit}
        isValid={Object.keys(validationErrors).length === 0}
      />
    </div>
  );
}
