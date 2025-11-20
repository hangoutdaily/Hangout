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
  User,
  Languages,
  GraduationCap,
  Cigarette,
  GlassWater,
  Leaf,
  Link as LinkIcon,
  ShieldCheck,
  AlertTriangle,
  SearchCheck,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/shadcn/skeleton';
import { Instagram, Twitter, Facebook, Linkedin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getProfile } from '@/api/profile';

interface ProfileData {
  id: number;
  name: string | null;
  age: number | null;
  gender: string | null;
  education: string | null;
  lifeEngagement: string | null;
  city: string | null;
  languages: string[];
  bio: string | null;
  lookingFor: string | null;
  traits: string[];
  interests: string[];
  topSongs: string | null;
  topPlaces: string | null;
  joyfulMoment: string | null;
  drinks: string | null;
  smoke: string | null;
  weed: string | null;
  photos: string[];
  selfie: string | null;
  socialLinks: Record<string, any> | null;
  createdEvents: {
    id: number;
    title: string;
    datetime: string;
    city: string;
    state: string;
  }[];
}

const dummyReviews = [
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

const ProfileInfoItem = ({ icon: Icon, label, value }: any) => (
  <div className="flex items-start gap-3 py-2">
    <Icon className="w-5 h-5 text-muted-foreground mt-1" />
    <div className="text-base">
      <span className="font-medium">{label}</span>
      {value && <span className="text-foreground">: {value}</span>}
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

export default function ProfileScreen() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await getProfile();
        setProfile(res.data.profile);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to load profile.');
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  if (loading) return <ProfileScreenSkeleton />;

  if (error)
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <AlertTriangle className="w-10 h-10 text-destructive mx-auto mb-2" />
        <h2 className="text-2xl font-bold mb-1">Error Loading Profile</h2>
        <p className="text-muted-foreground">{error}</p>
      </div>
    );

  if (!profile)
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <AlertTriangle className="w-10 h-10 text-destructive mx-auto mb-2" />
        <h2 className="text-2xl font-bold mb-1">Profile Not Found</h2>
      </div>
    );

  const allPhotos = [profile.selfie, ...profile.photos].filter(Boolean);

  const displayPhotos =
    allPhotos.length > 0
      ? allPhotos.slice(0, 3)
      : [
          'https://images.unsplash.com/photo-1552058544-f2b08422138a?q=80',
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80',
          'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80',
        ];
  const socials = [
    { id: 'instagram', Icon: Instagram, placeholder: '@username' },
    { id: 'twitter', Icon: Twitter, placeholder: '@handle' },
    { id: 'facebook', Icon: Facebook, placeholder: 'Profile URL' },
    { id: 'linkedin', Icon: Linkedin, placeholder: 'Profile URL' },
  ];

  return (
    <div className="space-y-16 max-w-3xl mx-auto px-4 py-10">
      <SectionHeader
        title={`${profile.name || 'Hangouter'}, ${profile.age || 'N/A'}`}
        subtitle={profile.city || 'Location Unknown'}
      />

      {profile.bio && <p className="text-base leading-relaxed">{profile.bio}</p>}

      <div className="flex gap-4 overflow-x-auto pb-3 snap-x scrollbar-hide">
        {displayPhotos.map((src, i) => (
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

      <section className="space-y-3">
        <SectionHeader title="The Basics" subtitle="Stuff you should probably know" />

        {profile.education && (
          <ProfileInfoItem icon={GraduationCap} label="My education" value={profile.education} />
        )}

        {profile.lifeEngagement && (
          <ProfileInfoItem icon={Zap} label="My Life Right Now" value={profile.lifeEngagement} />
        )}

        {profile.languages.length > 0 && (
          <ProfileInfoItem icon={Languages} label="Speaks" value={profile.languages.join(', ')} />
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
              {profile.traits.map((t) => (
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
              {profile.interests.map((i) => (
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
          value={profile.drinks?.replaceAll('_', ' ')}
        />

        <ProfileInfoItem
          icon={Cigarette}
          label="Smokes"
          value={profile.smoke?.replaceAll('_', ' ')}
        />

        <ProfileInfoItem icon={Leaf} label="Weed" value={profile.weed?.replaceAll('_', ' ')} />
      </section>

      {profile.socialLinks && Object.keys(profile.socialLinks).length > 0 && (
        <section className="space-y-3">
          <SectionHeader title="Find Me Online" subtitle="A few links before we meet for real" />

          <div className="flex gap-3 flex-wrap">
            {Object.entries(profile.socialLinks).map(([key, val]) => {
              const social = socials.find((s) => s.id === key);
              const Icon = social?.Icon;

              return (
                <a
                  key={key}
                  href={val as string}
                  target="_blank"
                  className="
          w-12 h-12 flex items-center justify-center 
          rounded-lg border border-border
          hover:border-accent hover:bg-accent/10 
          transition-all
        "
                >
                  {Icon && <Icon className="w-6 h-6" />}
                </a>
              );
            })}
          </div>
        </section>
      )}

      <section className="space-y-3">
        <SectionHeader title="Hosted Hangouts" subtitle="Things I've organised" />

        <div className="space-y-3">
          {profile.createdEvents.length > 0 ? (
            profile.createdEvents.map((ev) => (
              <div key={ev.id} className="border-b border-border pb-3">
                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                  <Calendar className="w-4 h-4" />
                  {ev.city}, {ev.state}
                </div>
                <p className="font-medium">{ev.title}</p>
                <p className="text-muted-foreground text-sm">
                  {new Date(ev.datetime).toLocaleDateString()}
                </p>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground">No hangouts hosted yet.</p>
          )}
        </div>
      </section>

      <section className="space-y-3">
        <SectionHeader title="Reviews" subtitle="What people say about my events" />

        <div className="space-y-4">
          {dummyReviews.map((r, idx) => (
            <div key={idx} className="border-b border-border pb-4">
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
              <p className="text-sm mt-2 italic">{r.comment}</p>
              <p className="text-xs text-muted-foreground text-right mt-1">{r.time}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
