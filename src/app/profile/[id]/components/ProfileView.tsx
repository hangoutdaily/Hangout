import React, { useState, useEffect } from 'react';
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
  SearchCheck,
  User,
  Instagram,
  Twitter,
  Facebook,
  Linkedin,
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
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { ProfileData, HostedEvent } from '@/types';
import EventCard from '@/components/ui/EventCard';

const SOCIALS = [
  { id: 'instagram', Icon: Instagram },
  { id: 'twitter', Icon: Twitter },
  { id: 'facebook', Icon: Facebook },
  { id: 'linkedin', Icon: Linkedin },
];

const DUMMY_REVIEWS = [
  {
    reviewer: 'Aarav Shah',
    avatar: 'https://i.pravatar.cc/40?img=12',
    rating: 5,
    comment: 'Hosted an amazing tech hangout. Great vibe, great people!',
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
  if (!events || events.length === 0) {
    return (
      <div className="py-10 text-center border-2 border-dashed border-border rounded-xl mt-8 p-8 bg-secondary/30">
        <Calendar className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-foreground mb-2">
          This user hasn&apos;t hosted any Hangouts yet.
        </h3>
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
          attendees: event._count?.attendees ?? 0,
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
            eventStatus={event.status}
            isPast={new Date(event.datetime) < new Date()}
            onLike={() => onLike(eventProps.id)}
            onJoin={() => {}}
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

interface ProfileViewProps {
  profile: ProfileData;
  activeTab: 'profile' | 'hosted' | 'reviews';
  setActiveTab: (tab: 'profile' | 'hosted' | 'reviews') => void;
  likedEventIds: Set<string>;
  handleLike: (eventId: string) => void;
}

export default function ProfileView({
  profile,
  activeTab,
  setActiveTab,
  likedEventIds,
  handleLike,
}: ProfileViewProps) {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  const allPhotos = [profile.selfie, ...profile.photos].filter(Boolean);
  const displayPhotos =
    allPhotos.length > 0
      ? allPhotos
      : [
          'https://images.unsplash.com/photo-1552058544-f2b08422138a?q=80',
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80',
          'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80',
        ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedPhotoIndex(null);
      if (selectedPhotoIndex === null) return;

      if (e.key === 'ArrowLeft') {
        setSelectedPhotoIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : prev));
      } else if (e.key === 'ArrowRight') {
        setSelectedPhotoIndex((prev) =>
          prev !== null && prev < displayPhotos.length - 1 ? prev + 1 : prev
        );
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPhotoIndex, displayPhotos.length]);

  return (
    <div className="min-h-screen bg-background">
      <div className="space-y-16 max-w-3xl mx-auto px-4 py-10 relative">
        <div>
          <SectionHeader
            title={`${profile.name || 'Hangouter'}, ${profile.age || 'N/A'}`}
            subtitle={profile.city || 'Location Unknown'}
          />
          {profile.bio && <p className="text-base leading-relaxed pr-20">{profile.bio}</p>}
        </div>

        <div className="flex gap-4 overflow-x-auto pb-3 snap-x scrollbar-hide">
          {displayPhotos.map((src, i) => (
            <button
              key={i}
              onClick={() => setSelectedPhotoIndex(i)}
              className="w-64 md:w-auto h-80 md:aspect-[4/5] md:h-auto rounded-2xl overflow-hidden bg-muted flex-shrink-0 snap-center relative group cursor-zoom-in transition-transform active:scale-[0.98]"
            >
              <Image
                src={src || ''}
                alt="Profile photo"
                width={300}
                height={500}
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            </button>
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
              <span className="text-sm font-medium">({profile.createdEvents?.length || 0})</span>
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
            {profile.languages && profile.languages.length > 0 && (
              <ProfileInfoItem
                icon={Languages}
                label="Speaks"
                value={profile.languages.join(', ')}
              />
            )}
            {profile.city && (
              <ProfileInfoItem icon={MapPin} label="Lives in" value={`${profile.city}`} />
            )}
            {profile.lookingFor && (
              <ProfileInfoItem icon={SearchCheck} label="Here For" value={profile.lookingFor} />
            )}
            <ProfileInfoItem icon={ShieldCheck} label="Identity verified" value={null} />
          </section>

          <section className="space-y-3">
            <SectionHeader title="What I’m Like" subtitle="Traits, vibes & how I show up" />
            {profile.traits && profile.traits.length > 0 && (
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
            {profile.interests && profile.interests.length > 0 && (
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
            <ProfileInfoItem icon={GlassWater} label="Drinks" value={formatEnum(profile.drinks)} />
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
                      href={val}
                      target="_blank"
                      className="w-12 h-12 flex items-center justify-center rounded-lg border border-border hover:border-accent hover:bg-accent/10 transition-all font-medium"
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

      {/* Lightbox */}
      {selectedPhotoIndex !== null && (
        <div
          className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedPhotoIndex(null)}
        >
          <button
            onClick={() => setSelectedPhotoIndex(null)}
            className="absolute top-4 right-4 p-2 rounded-full bg-secondary/50 hover:bg-secondary text-foreground transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div
            className="relative max-w-5xl max-h-[90vh] w-full h-full flex items-center justify-center outline-none"
            onClick={(e) => e.stopPropagation()}
          >
            {displayPhotos[selectedPhotoIndex] && (
              <Image
                src={displayPhotos[selectedPhotoIndex]!}
                alt="Enlarged profile photo"
                fill
                className="object-contain"
                priority
              />
            )}
          </div>

          {displayPhotos.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPhotoIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : prev));
                }}
                disabled={selectedPhotoIndex === 0}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-secondary/50 hover:bg-secondary text-foreground transition-colors disabled:opacity-0"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPhotoIndex((prev) =>
                    prev !== null && prev < displayPhotos.length - 1 ? prev + 1 : prev
                  );
                }}
                disabled={selectedPhotoIndex === displayPhotos.length - 1}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-secondary/50 hover:bg-secondary text-foreground transition-colors disabled:opacity-0"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
