'use client';

import { useState, useEffect, useContext } from 'react';
import { Heart, AlertTriangle } from 'lucide-react';
import EventCard from './EventCard';
import {
  getEvent,
  getMyLikes,
  unlikeEvent,
  getMyJoinedEvents,
  joinEvent,
  cancelJoinEvent,
} from '@/api/event';
import { Skeleton } from './shadcn/skeleton';
import { AuthContext } from '@/context/AuthContext';
import Link from 'next/link';
import { formatCategory } from './EventGrid';
import { ApiError } from '@/types';
import JoinEventDialog from '../layout/JoinEventDialog';
import ConfirmUnjoinDialog from '../layout/ConfirmUnjoinDialog';
import { isHostOfEvent } from '@/lib/utils';

type FetchedEvent = {
  id: number;
  title: string;
  description: string;
  city: string;
  addressLine: string;
  datetime: string;
  maxAttendees: number;
  category: string;
  priceType: 'FREE' | 'SPLIT_BILL';
  host: {
    name: string | null;
    selfie: string | null;
    id: number;
  };
  _count: {
    attendees: number;
  };
};

export default function WishlistGrid() {
  const [events, setEvents] = useState<FetchedEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useContext(AuthContext);
  const [joinStatus, setJoinStatus] = useState<
    Record<string, 'NONE' | 'REQUESTED' | 'JOINED' | 'REJECTED'>
  >({});
  const [joinDialogFor, setJoinDialogFor] = useState<number | null>(null);
  const [unjoinDialogFor, setUnjoinDialogFor] = useState<number | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const likesRes = await getMyLikes();
        const likedEventIds: number[] = likesRes.data.likedEventIds ?? [];

        if (likedEventIds.length === 0) {
          setEvents([]);
          setLoading(false);
          return;
        }

        const eventPromises = likedEventIds.map(async (id) => {
          try {
            const eventRes = await getEvent(String(id));
            const eventData = eventRes.data.event;
            if (!eventData._count) {
              eventData._count = { attendees: eventData.attendees?.length ?? 0 };
            }
            return eventData as FetchedEvent;
          } catch {
            return null;
          }
        });

        const fetchedEvents = (await Promise.all(eventPromises)).filter(
          (e): e is FetchedEvent => e !== null
        );

        setEvents(fetchedEvents);

        if (user) {
          try {
            const joinedReq = await getMyJoinedEvents();
            const statusMap: Record<string, 'NONE' | 'REQUESTED' | 'JOINED'> = {};

            joinedReq.data?.requestedEventIds?.forEach((id: number) => {
              statusMap[String(id)] = 'REQUESTED';
            });

            joinedReq.data?.joinedEventIds?.forEach((id: number) => {
              statusMap[String(id)] = 'JOINED';
            });
            setJoinStatus(statusMap);
          } catch (e) {
            console.error('Failed to fetch joined status', e);
          }
        }
      } catch (err) {
        const error = err as ApiError;
        setError(error.response?.data?.error || 'Failed to load your wishlist.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [user]);

  const handleUnlike = async (eventId: string) => {
    const eventToRevert = events.find((e) => String(e.id) === eventId);
    setEvents((prev) => prev.filter((e) => String(e.id) !== eventId));

    try {
      await unlikeEvent(eventId);
    } catch {
      if (eventToRevert) {
        setEvents((prev) => [...prev, eventToRevert].sort((a, b) => a.id - b.id));
      }
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-[420px] w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto px-4 py-10 text-center">
        <AlertTriangle className="w-10 h-10 text-destructive mx-auto mb-4" />
        <h2 className="text-xl font-bold mb-2">Oops! Something went wrong.</h2>
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-10 text-center">
        <Heart className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Sign in to view your Wishlist</h2>
        <p className="text-muted-foreground mb-6">
          Log in or create an account to start saving your favorite hangouts.
        </p>
        <Link
          href="/login"
          className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
        >
          Sign In
        </Link>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-10 text-center">
        <Heart className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Your Wishlist Looks Lonely</h2>
        <p className="text-muted-foreground mb-6">
          Explore some hangouts and show a little love by tapping that heart icon.
        </p>
        <Link
          href="/"
          className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
        >
          Discover Hangouts
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4">
      <JoinEventDialog
        open={joinDialogFor !== null}
        onClose={() => setJoinDialogFor(null)}
        onSubmit={async (message) => {
          const id = joinDialogFor!;
          await joinEvent(id, message);
          setJoinStatus((prev) => ({ ...prev, [String(id)]: 'REQUESTED' }));
          setJoinDialogFor(null);
        }}
      />

      <ConfirmUnjoinDialog
        open={unjoinDialogFor !== null}
        onClose={() => setUnjoinDialogFor(null)}
        onConfirm={async () => {
          const id = unjoinDialogFor!;
          await cancelJoinEvent(id);
          setJoinStatus((prev) => ({ ...prev, [String(id)]: 'NONE' }));
          setUnjoinDialogFor(null);
        }}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

          const idStr = event.id.toString();
          let status = joinStatus[idStr] || 'NONE';
          const isHost = isHostOfEvent(user, event.host?.id);
          if (isHost) status = 'JOINED';

          return (
            <EventCard
              key={event.id}
              {...eventProps}
              isLiked={true}
              status={status}
              onLike={() => handleUnlike(eventProps.id)}
              onJoin={() => {
                if (!user) return (window.location.href = '/login');
                if (isHost) return;
                if (status === 'NONE' || status === 'REJECTED') setJoinDialogFor(event.id);
                else setUnjoinDialogFor(event.id);
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
