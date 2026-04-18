'use client';

import { useState, useEffect, useContext } from 'react';
import {
  MapPin,
  Calendar,
  Clock,
  Heart,
  ArrowLeft,
  Share2,
  CheckCircle2,
  ShieldCheck,
  Loader2,
  Sparkles,
  Check,
  Copy,
  Facebook,
  Linkedin,
  Instagram,
  X as XIcon,
  Edit,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import {
  cancelJoinEvent,
  getEvent,
  getMyJoinedEvents,
  getMyLikes,
  joinEvent,
  likeEvent,
  unlikeEvent,
  getEventJoinRequests,
  approveJoinRequest,
  rejectJoinRequest,
  cancelHostedEvent,
} from '@/api/event';
import { AuthContext } from '@/context/AuthContext';
import ConfirmUnjoinDialog from '@/components/layout/ConfirmUnjoinDialog';
import JoinEventDialog from '@/components/layout/JoinEventDialog';
import { launchConfetti } from '@/lib/confetti';
import { Button } from '@/components/ui/shadcn/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/shadcn/avatar';
import { Badge } from '@/components/ui/shadcn/badge';
import { cn } from '@/lib/utils';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/shadcn/dialog';
import {
  getCategoryImageQuery,
  getUnsplashSourceImage,
  searchUnsplashPhotos,
} from '@/lib/unsplash';
import { ChatRoomCard } from '@/types';
import { ApiError } from '@/types';
import {
  notifyHangoutCancelled,
  notifyJoinRequestApproved,
  notifyJoinRequestSubmitted,
} from '@/lib/notificationActivity';
import { EmptyState } from '@/components/ui/EmptyState';

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function RedditIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
    </svg>
  );
}

interface EventDetailClientProps {
  id: string;
}

interface GeoLocation {
  lat: number;
  lng: number;
}

type Attendee = {
  id: number;
  name: string;
  selfie: string | null;
  age?: number;
  gender?: string;
  displayId?: string;
  photos?: string[];
};

type EventDetail = {
  id: number;
  title: string;
  description: string;
  city: string;
  addressLine: string;
  datetime: string;
  maxAttendees: number;
  category: string;
  priceType: 'FREE' | 'SPLIT_BILL';
  photos?: string[];
  geo?: GeoLocation;
  host: {
    id: number;
    name: string | null;
    selfie: string | null;
    bio: string | null;
    displayId: string | null;
    photos?: string[];
  };
  attendees: Attendee[];
  status: 'UPCOMING' | 'COMPLETED' | 'CANCELLED';
};

type JoinRequest = {
  id: number;
  message: string;
  profile: {
    id: number;
    name: string;
    selfie: string | null;
    displayId: string | null;
    photos?: string[];
  };
};

type MyChatsResponse = {
  active: ChatRoomCard[];
  archived: ChatRoomCard[];
};

function patchMyChatsCache(
  current: MyChatsResponse | undefined,
  eventId: number,
  update: (chat: ChatRoomCard) => ChatRoomCard
) {
  if (!current) return current;

  const patch = (list: ChatRoomCard[]) =>
    list.map((chat) => (chat.eventId === eventId ? update(chat) : chat));

  return {
    active: patch(current.active),
    archived: patch(current.archived),
  };
}

const formatCategory = (cat: string) => {
  return cat
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export default function EventDetailClient({ id }: EventDetailClientProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useContext(AuthContext);
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const [showUnjoinDialog, setShowUnjoinDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [isSubmittingJoin, setIsSubmittingJoin] = useState(false);

  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const [requestStatus, setRequestStatus] = useState<'NONE' | 'REQUESTED' | 'JOINED' | 'REJECTED'>(
    'NONE'
  );

  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [fallbackCoverImage, setFallbackCoverImage] = useState<string | null>(null);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  });

  const MAP_CONTAINER_STYLE = {
    width: '100%',
    height: '100%',
    borderRadius: '1rem',
  };

  useEffect(() => {
    async function load() {
      try {
        const res = await getEvent(id);
        const ev: EventDetail = res.data.event;
        setEvent(ev);

        if (!ev.photos?.length) {
          const categoryQuery = getCategoryImageQuery(ev.category);
          setFallbackCoverImage(getUnsplashSourceImage(categoryQuery));
          try {
            const suggestions = await searchUnsplashPhotos({ query: categoryQuery, perPage: 1 });
            if (suggestions[0]) {
              setFallbackCoverImage(suggestions[0].regularUrl);
            }
          } catch (err) {
            console.error('Failed to fetch Unsplash cover suggestion', err);
          }
        } else {
          setFallbackCoverImage(null);
        }

        if (!user) return;

        const likesRes = await getMyLikes();
        setIsLiked(likesRes.data.likedEventIds?.includes(ev.id));

        const joinedRes = await getMyJoinedEvents();
        const requestedIds = joinedRes.data.requestedEventIds || [];
        const joinedIds = joinedRes.data.joinedEventIds || [];

        const isHost = user.profileId === ev.host.id;

        if (isHost) {
          setRequestStatus('JOINED');
          fetchJoinRequests(ev.id);
        } else if (joinedIds.includes(ev.id)) {
          setRequestStatus('JOINED');
        } else if (requestedIds.includes(ev.id)) {
          setRequestStatus('REQUESTED');
        } else {
          setRequestStatus('NONE');
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, user]);

  const fetchJoinRequests = async (eventId: number) => {
    try {
      const res = await getEventJoinRequests(eventId);
      setJoinRequests(res.data.requests);
    } catch (e) {
      console.error('Failed to load requests', e);
    }
  };

  const handleHostAction = async (profileId: number, action: 'approve' | 'reject') => {
    if (!event || event.status === 'CANCELLED') return;
    try {
      if (action === 'approve') {
        await approveJoinRequest(event.id, profileId);
        notifyJoinRequestApproved({
          eventId: event.id,
          eventTitle: event.title,
          targetProfileId: profileId,
        });
        launchConfetti();
      } else {
        await rejectJoinRequest(event.id, profileId);
      }
      setJoinRequests((prev) => prev.filter((r) => r.profile.id !== profileId));
      if (action === 'approve') {
        const res = await getEvent(id);
        setEvent(res.data.event);
      }
    } catch {
      setToastMessage('Too popular! This hangout is full');
    }
  };

  const handleCancelEvent = async () => {
    if (!event) return;
    try {
      await cancelHostedEvent(event.id);
      notifyHangoutCancelled({ eventId: event.id, eventTitle: event.title });
      setEvent({ ...event, status: 'CANCELLED' });
      queryClient.setQueryData<MyChatsResponse>(['myChats'], (current) =>
        patchMyChatsCache(current, event.id, (chat) => ({
          ...chat,
          eventStatus: 'CANCELLED',
          roomStatus: 'ARCHIVED',
        }))
      );
      queryClient.invalidateQueries({ queryKey: ['myChats'] });
      setToastMessage('Hangout has been cancelled.');
      setShowCancelDialog(false);
    } catch {
      setToastMessage('Failed to cancel hangout.');
    }
  };

  const handleToggleLike = async () => {
    const next = !isLiked;
    setIsLiked(next);
    try {
      if (next) {
        await likeEvent(id);
      } else {
        await unlikeEvent(id);
      }
    } catch {
      setIsLiked(!next);
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const sharePlatforms = [
    {
      name: 'WhatsApp',
      icon: <WhatsAppIcon className="w-6 h-6" />,
      action: () => {
        const url = `https://wa.me/?text=${encodeURIComponent(
          `Check out this hangout: ${event?.title} ${window.location.href}`
        )}`;
        window.open(url, '_blank');
      },
    },
    {
      name: 'Instagram',
      icon: <Instagram className="w-6 h-6" />,
      action: () => {
        copyLink();
        const url = `https://www.instagram.com/direct/inbox/`;
        window.open(url, '_blank');
      },
    },
    {
      name: 'Facebook',
      icon: <Facebook className="w-6 h-6" />,
      action: () => {
        const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          window.location.href
        )}`;
        window.open(url, '_blank');
      },
    },
    {
      name: 'X',
      icon: <XIcon className="w-5 h-5" />,
      action: () => {
        const url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
          window.location.href
        )}&text=${encodeURIComponent(event?.title || 'Cool hangout!')}`;
        window.open(url, '_blank');
      },
    },
    {
      name: 'LinkedIn',
      icon: <Linkedin className="w-6 h-6" />,
      action: () => {
        const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
          window.location.href
        )}`;
        window.open(url, '_blank');
      },
    },
    {
      name: 'Reddit',
      icon: <RedditIcon className="w-6 h-6" />,
      action: () => {
        const url = `https://reddit.com/submit?url=${encodeURIComponent(
          window.location.href
        )}&title=${encodeURIComponent(event?.title || '')}`;
        window.open(url, '_blank');
      },
    },
  ];

  if (loading)
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <Loader2 className="animate-spin text-muted-foreground" />
      </div>
    );
  if (!event)
    return (
      <div className="px-4 py-10">
        <EmptyState
          illustrationSrc="/assets/illustrations/no-hangouts.png"
          title="Hangout not found"
          description="This hangout may have been removed or is no longer available."
          action={{ href: '/', label: 'Browse Hangouts' }}
          className="my-0"
        />
      </div>
    );

  const isHost = user?.profileId === event.host.id;
  const eventDate = new Date(event.datetime);
  const attendeesCount = event.attendees.length;
  const coverImage =
    event.photos?.[0] ||
    fallbackCoverImage ||
    getUnsplashSourceImage(getCategoryImageQuery(event.category));

  const isPast = eventDate < new Date();
  const isFull = attendeesCount >= event.maxAttendees;
  const isCancelled = event.status === 'CANCELLED';
  const isCompleted = event.status === 'COMPLETED';
  const isEditable = isHost && !isCancelled && !isCompleted && !isPast;

  const ActionButton = () => (
    <Button
      size="lg"
      className={cn(
        'w-full font-medium text-base h-12 transition-all rounded-xl',
        isCancelled || isPast || isCompleted
          ? 'bg-muted text-muted-foreground cursor-not-allowed hover:bg-muted'
          : 'bg-black text-white hover:bg-black/90 dark:bg-foreground dark:text-background dark:hover:bg-foreground/90'
      )}
      disabled={isHost || isCancelled || isPast || (isFull && requestStatus === 'NONE')}
      onClick={() => {
        if (!user) {
          router.push('/login');
          return;
        }
        if (isHost || isCancelled || isPast || isCompleted) return;
        if (requestStatus === 'JOINED' || requestStatus === 'REQUESTED') setShowUnjoinDialog(true);
        else setShowJoinDialog(true);
      }}
    >
      {isHost ? (
        'You are Hosting'
      ) : (
        <>
          {isCancelled && 'Hangout Cancelled'}
          {isCompleted && 'Hangout Completed'}
          {!isCancelled && !isCompleted && isPast && 'Hangout Ended'}
          {!isCancelled && !isCompleted && !isPast && (
            <>
              {requestStatus === 'JOINED' && (
                <>
                  <CheckCircle2 className="mr-2 h-5 w-5" /> Joined
                </>
              )}
              {requestStatus === 'REQUESTED' && (
                <>
                  <Clock className="mr-2 h-5 w-5" /> Requested
                </>
              )}
              {requestStatus === 'NONE' && (isFull ? 'Hangout Full' : 'Join Hangout')}
              {requestStatus === 'REJECTED' && 'Request Again'}
            </>
          )}
        </>
      )}
    </Button>
  );

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Navbar - Restored to match original spacing/flow, removing fixed/blur that might block global header */}
      <nav className="w-full z-50 h-16 px-4 lg:px-8 mt-4">
        <div className="max-w-7xl mx-auto w-full h-full flex items-center justify-between">
          <Link
            href="/"
            className="p-2 -ml-2 hover:bg-secondary rounded-full transition-colors text-foreground/80 hover:text-foreground"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-secondary text-foreground/80 hover:text-foreground"
              onClick={() => setIsShareOpen(true)}
              title="Share Hangout"
            >
              <Share2 className="h-5 w-5" />
            </Button>
            {isEditable && (
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-secondary text-foreground/80 hover:text-foreground"
                asChild
                title="Edit Hangout"
              >
                <Link href={`/events/${event.id}/edit`}>
                  <Edit className="h-5 w-5" />
                </Link>
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-secondary text-foreground/80 hover:text-foreground"
              onClick={handleToggleLike}
            >
              <Heart
                className={cn(
                  'h-5 w-5 transition-colors',
                  isLiked ? 'fill-red-500 text-red-500' : ''
                )}
              />
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 lg:px-8 pt-8 space-y-12">
        {/* Top Split Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
          {/* Left Column: Image */}
          <div className="relative aspect-square w-full rounded-3xl overflow-hidden shadow-sm border border-border bg-muted">
            <Image
              src={coverImage}
              alt={event.title}
              fill
              className="object-cover transition-transform hover:scale-105 duration-700"
              priority
            />
          </div>

          {/* Right Column: Details (Restored Original Designs) */}
          <div className="space-y-8">
            {/* Header / Badges */}
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge
                  variant="secondary"
                  className="bg-background/90 backdrop-blur-md text-foreground border-none font-medium px-3 py-1"
                >
                  <Sparkles className="w-3 h-3 mr-1.5 text-yellow-500" />
                  {formatCategory(event.category)}
                </Badge>
                {isCancelled && (
                  <Badge variant="destructive" className="font-medium px-3 py-1">
                    Called Off
                  </Badge>
                )}
                {!isCancelled && isPast && (
                  <Badge
                    variant="secondary"
                    className="bg-muted text-muted-foreground font-medium px-3 py-1"
                  >
                    Done
                  </Badge>
                )}
                {!isCancelled && !isPast && isFull && (
                  <Badge variant="destructive" className="bg-red-500 font-medium px-3 py-1">
                    FULL
                  </Badge>
                )}
              </div>
              <h1 className="text-3xl md:text-5xl font-medium tracking-tight text-foreground drop-shadow-sm">
                {event.title}
              </h1>
            </div>

            {/* Info Grid (Restored) */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-secondary/20 rounded-2xl p-4 border border-border flex items-center justify-start gap-3 h-auto hover:bg-secondary/40 transition-colors group">
                <Calendar className="h-5 w-5 text-foreground shrink-0" />
                <p className="text-lg font-medium tracking-tight text-foreground">
                  {eventDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                </p>
              </div>

              <div className="bg-secondary/20 rounded-2xl p-4 border border-border flex items-center justify-start gap-3 h-auto hover:bg-secondary/40 transition-colors group">
                <Clock className="h-5 w-5 text-foreground shrink-0" />
                <p className="text-lg font-medium tracking-tight text-foreground">
                  {eventDate.toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                  })}
                </p>
              </div>

              <div className="col-span-2 bg-secondary/20 rounded-2xl p-4 border border-border flex items-start gap-3 hover:bg-secondary/40 transition-colors">
                <MapPin className="h-5 w-5 text-foreground mt-0.5" />
                <div className="w-full">
                  <p className="text-lg tracking-tight text-foreground leading-tight">
                    {event.city}
                  </p>
                </div>
              </div>
            </div>

            {/* Description (Restored) */}
            <div className="prose dark:prose-invert max-w-none">
              <h2 className="text-2xl font-medium tracking-tight text-foreground mb-4">
                About the hangout
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-wrap font-normal">
                {event.description}
              </p>

              {/* Cost & Spots (Restored) */}
              <div className="mt-3 pt-4 border-border/60">
                <div className="flex w-full items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground font-medium mb-1 uppercase tracking-wide">
                      Cost
                    </p>
                    <p className="text-3xl font-medium tracking-tight text-foreground">
                      {event.priceType === 'FREE' ? 'Free' : 'Split Bill'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium mb-1 uppercase tracking-wide text-right">
                      Spots Left
                    </p>
                    <p className="text-3xl font-medium tracking-tight text-foreground text-right">
                      {Math.max(0, event.maxAttendees - attendeesCount)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Map, Host, Attendees etc. */}
        <div className="space-y-16 w-full">
          {isLoaded && event.geo && (
            <section className="space-y-4">
              <h2 className="text-2xl font-medium tracking-tight text-foreground">
                Where we&apos;ll meet
              </h2>
              <div className="w-full h-[300px] rounded-2xl overflow-hidden border border-border opacity-90 hover:opacity-100 transition-opacity">
                <GoogleMap
                  mapContainerStyle={MAP_CONTAINER_STYLE}
                  center={event.geo}
                  zoom={15}
                  options={{
                    disableDefaultUI: true,
                    zoomControl: true,
                  }}
                >
                  <Marker position={event.geo} />
                </GoogleMap>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>
                  {event.addressLine}, {event.city}
                </span>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${event.geo.lat},${event.geo.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="ml-auto text-primary underline hover:no-underline font-medium"
                >
                  Get Directions
                </a>
              </div>
            </section>
          )}

          <section className="space-y-5">
            <h2 className="text-2xl font-medium tracking-tight text-foreground">Meet your host</h2>

            <Link
              href={event.host.displayId ? `/profile/${event.host.displayId}` : '#'}
              className="flex items-start gap-5 p-6 rounded-3xl border border-border bg-card/40 hover:bg-card/80 hover:shadow-sm transition-all w-full"
            >
              <div className="relative shrink-0">
                <Avatar className="h-20 w-20 border-2 border-background shadow-md">
                  <AvatarImage
                    src={event.host.photos?.[0] || event.host.selfie || ''}
                    className="object-cover"
                  />
                  <AvatarFallback className="text-xl bg-muted text-muted-foreground">
                    {event.host.name?.charAt(0) || 'H'}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-foreground text-background text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Host
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <h3 className="text-lg font-semibold text-foreground">
                  {event.host.name || 'Anonymous Host'}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {event.host.bio
                    ? event.host.bio
                    : `Hi! I'm ${event.host.name}. I love creating spaces for people to connect and share good vibes. Can't wait to see you there!`}
                </p>
                <div className="flex gap-2 pt-1">
                  <Badge
                    variant="outline"
                    className="text-xs font-normal text-muted-foreground rounded-full border-border/60 bg-transparent"
                  >
                    <ShieldCheck className="w-3 h-3 mr-1" /> Identity Verified
                  </Badge>
                </div>
              </div>
            </Link>
          </section>

          {event.attendees.length > 0 && (
            <section className="space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-medium tracking-tight text-foreground">
                  Who&apos;s going
                </h2>
                <p className="text-sm text-muted-foreground font-medium">
                  {attendeesCount} / {event.maxAttendees} Joined
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                {event.attendees.map((attendee) => (
                  <Link
                    key={attendee.id}
                    href={attendee.displayId ? `/profile/${attendee.displayId}` : '#'}
                    className="group flex flex-col items-center gap-2 w-16 cursor-pointer"
                  >
                    <Avatar className="h-16 w-16 border-2 border-transparent group-hover:border-foreground transition-all">
                      <AvatarImage
                        src={attendee.photos?.[0] || attendee.selfie || ''}
                        className="object-cover"
                      />
                      <AvatarFallback>{attendee.name[0]}</AvatarFallback>
                    </Avatar>
                    <p className="text-xs text-muted-foreground group-hover:text-foreground transition-colors truncate w-full text-center">
                      {attendee.name.split(' ')[0]}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {isHost && joinRequests.length > 0 && (
            <section className="space-y-4 pt-4 border-t border-border/60">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-medium tracking-tight">Join Requests</h2>
                <Badge variant="destructive" className="rounded-full px-3">
                  {joinRequests.length}
                </Badge>
              </div>

              <div className="grid gap-3">
                <AnimatePresence>
                  {joinRequests.map((req) => (
                    <motion.div
                      key={req.id}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-4 rounded-xl border border-border bg-card flex flex-col sm:flex-row sm:items-start justify-between gap-4"
                    >
                      <div className="flex items-start gap-3 w-full">
                        <Avatar className="shrink-0">
                          <AvatarImage
                            src={req.profile.photos?.[0] || req.profile.selfie || ''}
                            className="object-cover"
                          />
                          <AvatarFallback>{req.profile.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="space-y-1 w-full">
                          <p className="font-medium text-sm">{req.profile.name}</p>
                          <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                            {req.message}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2 shrink-0 self-end sm:self-start">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 px-3 rounded-lg text-xs"
                          asChild
                        >
                          <Link href={`/profile/${req.profile.displayId}`}>View Profile</Link>
                        </Button>
                        <Button
                          size="sm"
                          className="h-8 px-3 rounded-lg text-xs"
                          disabled={isCancelled}
                          onClick={() => handleHostAction(req.profile.id, 'approve')}
                        >
                          Approve
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </section>
          )}

          {/* CTA Buttons - Moved to Bottom */}
          <div className="flex flex-col gap-4 justify-center pt-8 pb-12 items-center">
            <div className="w-full max-w-md">
              <ActionButton />
            </div>
            {isEditable && (
              <div className="flex flex-col gap-2 w-full max-w-md">
                <Button
                  variant="ghost"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 w-full"
                  onClick={() => setShowCancelDialog(true)}
                >
                  Cancel Hangout
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Dialog open={isShareOpen} onOpenChange={setIsShareOpen}>
        <DialogContent className="sm:max-w-md bg-background border-border">
          <DialogHeader>
            <DialogTitle className="text-xl font-medium text-center">Share Hangout</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-4 gap-y-6 py-6 px-2">
            {sharePlatforms.map((platform) => (
              <button
                key={platform.name}
                onClick={platform.action}
                className="flex flex-col items-center gap-2 group"
              >
                <div
                  className={cn(
                    'w-12 h-12 flex items-center justify-center rounded-lg border border-border hover:border-accent hover:bg-accent/10 transition-all text-foreground'
                  )}
                >
                  {platform.icon}
                </div>
                <span className="text-xs text-muted-foreground font-medium group-hover:text-foreground transition-colors">
                  {platform.name}
                </span>
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2 p-1.5 rounded-xl border border-border bg-secondary/20 mt-2">
            <div className="flex-1 min-w-0 pl-3">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5 font-medium">
                Hangout Link
              </p>
              <input
                readOnly
                value={window.location.href}
                className="w-full bg-transparent border-none text-sm p-0 focus:outline-none text-foreground truncate font-medium"
              />
            </div>
            <Button
              size="sm"
              onClick={copyLink}
              className={cn(
                'shrink-0 h-9 px-4 rounded-lg transition-all font-medium',
                isCopied
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-foreground text-background hover:bg-foreground/90'
              )}
            >
              {isCopied ? (
                <Check className="w-4 h-4 mr-1.5" />
              ) : (
                <Copy className="w-4 h-4 mr-1.5" />
              )}
              {isCopied ? 'Copied' : 'Copy'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <JoinEventDialog
        open={showJoinDialog}
        onClose={() => setShowJoinDialog(false)}
        isSubmitting={isSubmittingJoin}
        onSubmit={async (message: string) => {
          setIsSubmittingJoin(true);
          try {
            await joinEvent(event.id, message);
            notifyJoinRequestSubmitted({ eventId: event.id, eventTitle: event.title, message });
            setRequestStatus('REQUESTED');
            queryClient.invalidateQueries({ queryKey: ['my-joined'] });
            queryClient.invalidateQueries({ queryKey: ['events'] });
            setShowJoinDialog(false);
            launchConfetti();
          } catch (err) {
            const error = err as ApiError;
            setToastMessage(
              error.response?.data?.error || 'Unable to send request right now. Please try again.'
            );
          } finally {
            setIsSubmittingJoin(false);
          }
        }}
      />
      <ConfirmUnjoinDialog
        open={showUnjoinDialog}
        onClose={() => setShowUnjoinDialog(false)}
        onConfirm={async () => {
          await cancelJoinEvent(event.id);
          queryClient.setQueryData<MyChatsResponse>(['myChats'], (current) =>
            patchMyChatsCache(current, event.id, (chat) => ({
              ...chat,
              isRemoved: true,
              roomStatus: 'ARCHIVED',
            }))
          );
          queryClient.invalidateQueries({ queryKey: ['myChats'] });
          setRequestStatus('NONE');
          setShowUnjoinDialog(false);
        }}
      />

      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Cancel Hangout</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>
              Are you sure you want to cancel this hangout? This action cannot be undone and all
              attendees will be notified.
            </p>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
              Keep it
            </Button>
            <Button variant="destructive" onClick={handleCancelEvent}>
              Yes, Cancel it
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 bg-red-600 text-white font-medium rounded-full shadow-xl animate-in fade-in slide-in-from-bottom-4">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
