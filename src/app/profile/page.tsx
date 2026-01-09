'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  MapPin,
  Heart,
  Star,
  Music,
  Zap,
  Calendar,
  Languages,
  GraduationCap,
  Cigarette,
  GlassWater,
  Leaf,
  ShieldCheck,
  AlertTriangle,
  SearchCheck,
  Edit2,
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
  Upload,
  X,
  User,
} from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/shadcn/skeleton';
import { Button } from '@/components/ui/shadcn/button';
import { Instagram, Twitter, Facebook, Linkedin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getProfile, updateProfile } from '@/api/profile';
import { getMyLikes, likeEvent, unlikeEvent } from '@/api/event';
import { ApiError, HostedEvent } from '@/types';
import { Field, FieldInput, FieldSelect, FieldTextarea } from '@/components/ui/FormField';
import { AuthContext } from '@/context/AuthContext';
import { useContext } from 'react';
import { Label } from '@/components/ui/shadcn/label';
import EventCard from '@/components/ui/EventCard';

interface ProfileData {
  id: number;
  name: string;
  age: number | string;
  gender: string;
  education: string;
  lifeEngagement: string;
  city: string;
  languages: string[];
  bio: string;
  lookingFor: string;
  traits: string[];
  interests: string[];
  topSongs: string;
  topPlaces: string;
  joyfulMoment: string;
  drinks: string;
  smoke: string;
  weed: string;
  photos: string[];
  selfie: string;
  socialLinks: Record<string, string>;
  createdEvents: HostedEvent[];
}

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

const DUMMY_REVIEWS = [
  {
    reviewer: 'Aarav Shah',
    avatar: 'https://i.pravatar.cc/40?img=12',
    rating: 5,
    comment: 'Dhruv hosted an amazing tech hangout. Great vibe, great people!',
    time: '2 days ago',
  },
  {
    reviewer: 'Emma Wilson',
    avatar: 'https://i.pravatar.cc/40?img=20',
    rating: 4,
    comment: 'Very friendly host. The meetup was well organised.',
    time: '1 week ago',
  },
];

const SectionHeader = ({ title, subtitle }: { title: string; subtitle?: string }) => (
  <div className="space-y-1 mb-4">
    <h1 className="text-3xl md:text-4xl font-medium tracking-tight">{title}</h1>
    {subtitle && <p className="text-base text-muted-foreground font-normal">{subtitle}</p>}
  </div>
);

interface ProfileInfoItemProps {
  icon: React.ElementType;
  label: string;
  value: string | null;
  children?: React.ReactNode;
}

const ProfileInfoItem = ({ icon: Icon, label, value, children }: ProfileInfoItemProps) => (
  <div className="flex items-start gap-3 py-2">
    <Icon className="w-5 h-5 text-muted-foreground mt-1 shrink-0" />
    <div className="text-base w-full">
      <span className="font-medium">{label}</span>
      {children ? children : value && <span className="text-foreground">: {value}</span>}
    </div>
  </div>
);

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

const formatEnum = (val?: string) => {
  if (!val) return '';
  return val
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

const formatCategory = (cat: string) => {
  return cat
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

function HostedEventsGrid({
  events,
  likedEventIds,
  onLike,
}: {
  events: HostedEvent[];
  likedEventIds: Set<string>;
  onLike: (eventId: string) => void;
}) {
  if (events.length === 0) {
    return (
      <div className="py-10 text-center border-2 border-dashed border-border rounded-xl mt-8 p-8 bg-secondary/30">
        <Calendar className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-foreground mb-2">
          You haven&apos;t hosted any Hangouts yet.
        </h3>
        <p className="text-muted-foreground mb-4">
          Ready to be a host? Share your passion with others and create your first hangout!
        </p>
        <Link href="/create" passHref legacyBehavior>
          <Button>Create New Hangout</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => {
        const eventProps = {
          id: event.id.toString(),
          title: event.title,
          description: event.description,
          location: `${event.addressLine}, ${event.city}`,
          date: new Date(event.datetime).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          }),
          time: new Date(event.datetime).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
          }),
          attendees: event._count.attendees,
          maxAttendees: event.maxAttendees,
          category: formatCategory(event.category),
          priceType: event.priceType.toLowerCase() as 'free' | 'split_bill',
          creator: {
            name: event.host?.name || 'Hangout Host',
            avatar: event.host?.selfie || 'https://i.pravatar.cc/40?img=1',
          },
        };

        return (
          <EventCard
            key={event.id}
            {...eventProps}
            isLiked={likedEventIds.has(eventProps.id)}
            status="JOINED"
            onLike={() => onLike(eventProps.id)}
            onJoin={() => console.log('Cannot join own event')}
          />
        );
      })}
    </div>
  );
}

function ReviewsSection({ reviews }: { reviews: typeof DUMMY_REVIEWS }) {
  if (reviews.length === 0) {
    return (
      <div className="py-10 text-center border-2 border-dashed border-border rounded-xl mt-8 p-8 bg-secondary/30">
        <Star className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-foreground mb-2">No Reviews Yet</h3>
        <p className="text-muted-foreground">
          Gather reviews after you host your first few successful hangouts!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 pt-8">
      {reviews.map((r, idx) => (
        <div key={idx} className="border border-border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <Image
              src={r.avatar}
              alt={r.reviewer}
              width={40}
              height={40}
              className="rounded-full"
            />
            <div>
              <p className="font-medium">{r.reviewer}</p>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      'w-4 h-4',
                      i < r.rating ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground'
                    )}
                  />
                ))}
              </div>
            </div>
          </div>
          <p className="text-sm mt-3 italic">{r.comment}</p>
          <p className="text-xs text-muted-foreground text-right mt-2">{r.time}</p>
        </div>
      ))}
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

export default function ProfileScreen() {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ProfileData | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'hosted' | 'reviews'>('profile');
  const [likedEventIds, setLikedEventIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [user]);

  async function fetchProfile() {
    try {
      const res = await getProfile();
      const profileData: ProfileData = res.data.profile;
      setProfile(profileData);
      setFormData(profileData);

      try {
        const likesRes = await getMyLikes();
        const likedIds = new Set<string>(likesRes.data.likedEventIds?.map(String) || []);
        setLikedEventIds(likedIds);
      } catch {}
    } catch (err) {
      const error = err as ApiError;
      setError(error.response?.data?.error || 'Failed to load profile.');
    } finally {
      setLoading(false);
    }
  }

  const handleLike = async (eventId: string) => {
    const isCurrentlyLiked = likedEventIds.has(eventId);

    setLikedEventIds((prev) => {
      const updated = new Set(prev);
      if (isCurrentlyLiked) updated.delete(eventId);
      else updated.add(eventId);
      return updated;
    });

    try {
      if (isCurrentlyLiked) {
        await unlikeEvent(eventId);
      } else {
        await likeEvent(eventId);
      }
    } catch {
      setLikedEventIds((prev) => {
        const updated = new Set(prev);
        if (isCurrentlyLiked) updated.add(eventId);
        else updated.delete(eventId);
        return updated;
      });
      alert('Failed to update wishlist status. Please try again.');
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
    if (formData.languages.length === 0) errors.languages = 'Select at least one language';
    if (!formData.lookingFor?.trim()) errors.lookingFor = 'This field is required';

    if (formData.traits.length !== 3) errors.traits = 'Select exactly 3 traits';
    if (formData.interests.length < 3) errors.interests = 'Select at least 3 interests';

    if (!formData.topSongs?.trim()) errors.topSongs = 'This field is required';
    if (!formData.topPlaces?.trim()) errors.topPlaces = 'This field is required';
    if (!formData.joyfulMoment?.trim()) errors.joyfulMoment = 'This field is required';

    if (!formData.drinks) errors.drinks = 'Please select an option';
    if (!formData.smoke) errors.smoke = 'Please select an option';
    if (!formData.weed) errors.weed = 'Please select an option';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!formData) return;
    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        ...formData,
        age: Number(formData.age),
      };
      await updateProfile(payload);
      setProfile(formData);
      setIsEditing(false);
    } catch {
    } finally {
      setIsSaving(false);
    }
  };

  const updateField = (field: keyof ProfileData, value: string | number | string[]) => {
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

  if (!user) {
    return (
      <div className="min-h-screen bg-background pt-10">
        <UnauthenticatedProfile />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <AlertTriangle className="w-10 h-10 text-destructive mx-auto mb-2" />
        <h2 className="text-2xl font-bold mb-1">Error Loading Profile</h2>
        <p className="text-muted-foreground">{error || 'Profile not found'}</p>
      </div>
    );
  }

  const allPhotos = [profile.selfie, ...profile.photos].filter(Boolean);
  const displayPhotos =
    allPhotos.length > 0
      ? allPhotos.slice(0, 3)
      : [
          'https://images.unsplash.com/photo-1552058544-f2b08422138a?q=80',
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80',
          'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80',
        ];

  // --- View Mode ---
  if (!isEditing) {
    return (
      <div className="min-h-screen bg-background">
        <div className="space-y-16 max-w-3xl mx-auto px-4 py-10 relative">
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

          <div>
            <SectionHeader
              title={`${profile.name || 'Hangouter'}, ${profile.age || 'N/A'}`}
              subtitle={profile.city || 'Location Unknown'}
            />
            {profile.bio && <p className="text-base leading-relaxed pr-20">{profile.bio}</p>}
          </div>

          <div className="flex gap-4 overflow-x-auto pb-3 snap-x scrollbar-hide">
            {displayPhotos.map((src: string, i: number) => (
              <div
                key={i}
                className="w-64 h-80 rounded-2xl overflow-hidden bg-muted flex-shrink-0 snap-center"
              >
                <Image
                  src={src || ''}
                  alt="Profile photo"
                  width={300}
                  height={500}
                  className="object-cover w-full h-full"
                />
              </div>
            ))}
          </div>

          <div className="border-b border-border">
            <div className="flex gap-6 -mb-px overflow-x-auto pb-1 scrollbar-hide">
              <button
                onClick={() => setActiveTab('profile')}
                className={cn(
                  'px-1 pb-2 text-lg font-semibold transition-colors flex-shrink-0',
                  activeTab === 'profile'
                    ? 'border-b-2 border-foreground text-foreground'
                    : 'text-muted-foreground hover:text-foreground/80'
                )}
              >
                About Me
              </button>
              <button
                onClick={() => setActiveTab('hosted')}
                className={cn(
                  'px-1 pb-2 text-lg font-semibold transition-colors flex items-center gap-1 flex-shrink-0',
                  activeTab === 'hosted'
                    ? 'border-b-2 border-foreground text-foreground'
                    : 'text-muted-foreground hover:text-foreground/80'
                )}
              >
                Hosted Hangouts{' '}
                <span className="text-sm font-medium">({profile.createdEvents.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={cn(
                  'px-1 pb-2 text-lg font-semibold transition-colors flex-shrink-0',
                  activeTab === 'reviews'
                    ? 'border-b-2 border-foreground text-foreground'
                    : 'text-muted-foreground hover:text-foreground/80'
                )}
              >
                Reviews
              </button>
            </div>
          </div>
        </div>

        {activeTab === 'profile' && (
          <div className="space-y-16 max-w-3xl mx-auto px-4 pb-16">
            <section className="space-y-3">
              <SectionHeader title="The Basics" subtitle="Stuff you should probably know" />
              {profile.gender && (
                <ProfileInfoItem icon={User} label="Gender" value={formatEnum(profile.gender)} />
              )}
              {profile.education && (
                <ProfileInfoItem
                  icon={GraduationCap}
                  label="My education"
                  value={profile.education}
                />
              )}
              {profile.lifeEngagement && (
                <ProfileInfoItem
                  icon={Zap}
                  label="My Life Right Now"
                  value={profile.lifeEngagement}
                />
              )}
              {profile.languages.length > 0 && (
                <ProfileInfoItem
                  icon={Languages}
                  label="Speaks"
                  value={profile.languages.join(', ')}
                />
              )}
              {profile.city && (
                <ProfileInfoItem icon={MapPin} label="Lives in" value={`${profile.city}, India`} />
              )}
              {profile.lookingFor && (
                <ProfileInfoItem icon={SearchCheck} label="Here For" value={profile.lookingFor} />
              )}
              <ProfileInfoItem icon={ShieldCheck} label="Identity verified" value={null} />
            </section>

            <section className="space-y-3">
              <SectionHeader title="What I’m Like" subtitle="Traits, vibes & how I show up" />
              {profile.traits.length > 0 && (
                <div>
                  <p className="text-muted-foreground text-sm mb-2 flex items-center gap-2">
                    <Star className="w-4 h-4" /> Traits
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {profile.traits.map((t: string) => (
                      <span
                        key={t}
                        className="px-4 py-2 rounded-full text-sm font-medium bg-foreground text-background"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {profile.interests.length > 0 && (
                <div>
                  <p className="text-muted-foreground text-sm mb-2 flex items-center gap-2">
                    <Heart className="w-4 h-4" /> Interests
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {profile.interests.map((i: string) => (
                      <span
                        key={i}
                        className="px-4 py-2 rounded-full text-sm font-medium bg-foreground text-background"
                      >
                        {i}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {(profile.topSongs || profile.topPlaces || profile.joyfulMoment) && (
              <section className="space-y-3">
                <SectionHeader title="My Favourites" subtitle="Small things that define me" />
                {profile.topSongs && (
                  <div>
                    <p className="text-muted-foreground text-sm flex items-center gap-2 mb-1">
                      <Music className="w-4 h-4" /> Top Songs
                    </p>
                    <p>{profile.topSongs}</p>
                  </div>
                )}
                {profile.topPlaces && (
                  <div>
                    <p className="text-muted-foreground text-sm flex items-center gap-2 mb-1">
                      <MapPin className="w-4 h-4" /> Favorite Places
                    </p>
                    <p>{profile.topPlaces}</p>
                  </div>
                )}
                {profile.joyfulMoment && (
                  <div>
                    <p className="text-muted-foreground text-sm flex items-center gap-2 mb-1">
                      <Star className="w-4 h-4" /> Joyful Moment
                    </p>
                    <p>{profile.joyfulMoment}</p>
                  </div>
                )}
              </section>
            )}

            <section className="space-y-3">
              <SectionHeader title="Lifestyle" subtitle="Little habits that say a lot" />
              <ProfileInfoItem
                icon={GlassWater}
                label="Drinks"
                value={formatEnum(profile.drinks)}
              />
              <ProfileInfoItem icon={Cigarette} label="Smokes" value={formatEnum(profile.smoke)} />
              <ProfileInfoItem icon={Leaf} label="Weed" value={formatEnum(profile.weed)} />
            </section>

            {profile.socialLinks && Object.keys(profile.socialLinks).length > 0 && (
              <section className="space-y-3">
                <SectionHeader
                  title="Find Me Online"
                  subtitle="A few links before we meet for real"
                />
                <div className="flex gap-3 flex-wrap">
                  {Object.entries(profile.socialLinks).map(([key, val]) => {
                    const social = SOCIALS.find((s) => s.id === key);
                    const Icon = social?.Icon;
                    if (!val) return null;
                    return (
                      <a
                        key={key}
                        href={val as string}
                        target="_blank"
                        className="w-12 h-12 flex items-center justify-center rounded-lg border border-border hover:border-accent hover:bg-accent/10 transition-all"
                      >
                        {Icon && <Icon className="w-6 h-6" />}
                      </a>
                    );
                  })}
                </div>
              </section>
            )}
          </div>
        )}

        {activeTab === 'hosted' && (
          <div className="mx-auto max-w-7xl px-4 pb-16">
            <HostedEventsGrid
              events={profile.createdEvents}
              likedEventIds={likedEventIds}
              onLike={handleLike}
            />
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="max-w-3xl mx-auto px-4 pb-16">
            <ReviewsSection reviews={DUMMY_REVIEWS} />
          </div>
        )}
      </div>
    );
  }

  // --- Edit Mode ---
  if (!formData) return null;
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
              onChange={(e) => updateField('name', e.target.value)}
              error={!!formErrors.name}
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Age" error={formErrors.age}>
              <FieldSelect
                value={String(formData.age)}
                options={Array.from({ length: 50 }, (_, i) => String(18 + i))}
                onChange={(v) => updateField('age', v)}
                error={!!formErrors.age}
              />
            </Field>
            <Field label="Gender" error={formErrors.gender}>
              <FieldSelect
                value={formData.gender}
                options={GENDER_OPTIONS}
                onChange={(v) => updateField('gender', v)}
                error={!!formErrors.gender}
              />
            </Field>
          </div>
        </div>
        <Field label="Location" error={formErrors.city}>
          <FieldInput
            value={formData.city}
            onChange={(e) => updateField('city', e.target.value)}
            error={!!formErrors.city}
          />
        </Field>
        <div className="mt-4">
          <Field label="Bio" error={formErrors.bio}>
            <FieldTextarea
              value={formData.bio}
              onChange={(e) => updateField('bio', e.target.value)}
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
        {displayPhotos.map((src: string, i: number) => (
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
            onChange={(v) => updateField('education', v)}
            error={!!formErrors.education}
          />
        </Field>
        <Field label="My Life Right Now" error={formErrors.lifeEngagement}>
          <FieldInput
            value={formData.lifeEngagement}
            onChange={(e) => updateField('lifeEngagement', e.target.value)}
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
                onClick={() => toggleList('languages', lang)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-xs font-medium border',
                  formData.languages.includes(lang)
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
            onChange={(e) => updateField('lookingFor', e.target.value)}
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
                onClick={() => toggleList('traits', t, 3)}
                className={cn(
                  'px-4 py-3 rounded-lg text-sm font-medium border flex items-center gap-2 transition-all',
                  formData.traits.includes(t)
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
                onClick={() => toggleList('interests', name)}
                className={cn(
                  'px-4 py-3 rounded-lg text-sm font-medium border flex items-center gap-2 transition-all',
                  formData.interests.includes(name)
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
              onChange={(e) => updateField('topSongs', e.target.value)}
              className="min-h-[80px] scrollbar-hide"
              error={!!formErrors.topSongs}
            />
          </Field>
          <Field label="Favorite Places" error={formErrors.topPlaces}>
            <FieldTextarea
              value={formData.topPlaces}
              onChange={(e) => updateField('topPlaces', e.target.value)}
              className="min-h-[80px] scrollbar-hide"
              error={!!formErrors.topPlaces}
            />
          </Field>
          <Field label="Joyful Moment" error={formErrors.joyfulMoment}>
            <FieldTextarea
              value={formData.joyfulMoment}
              onChange={(e) => updateField('joyfulMoment', e.target.value)}
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
              onChange={(v) => updateField('drinks', v)}
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
              onChange={(v) => updateField('smoke', v)}
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
              onChange={(v) => updateField('weed', v)}
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
                onChange={(e) =>
                  setFormData((prev) =>
                    prev
                      ? {
                          ...prev,
                          socialLinks: { ...prev.socialLinks, [id]: e.target.value },
                        }
                      : null
                  )
                }
              />
            </div>
          ))}
        </div>
      </section>

      <div className="max-w-2xl mx-auto flex gap-3">
        <Button
          variant="outline"
          onClick={handleCancel}
          disabled={isSaving}
          className="w-full  flex-1 bg-background border-border hover:text-foreground hover:border-foreground hover:bg-secondary/50 transition-all h-12 font-medium"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
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
