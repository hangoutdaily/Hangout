'use client';

import { useState, useContext } from 'react';
import { Heart, AlertTriangle, Calendar, Clock } from 'lucide-react';
import EventCard from './EventCard';
import { Skeleton } from './shadcn/skeleton';
import { AuthContext } from '@/context/AuthContext';
import Link from 'next/link';
import { formatCategory } from './EventGrid';
import {
  useMyLikes,
  useMyJoinedEvents,
  useJoinMutation,
  useCancelJoinMutation,
} from '@/hooks/useMyHangouts';
import { useLikeMutation, useUnlikeMutation } from '@/hooks/useEvents';
import { useQueries } from '@tanstack/react-query';
import * as eventApi from '@/api/event';
import JoinEventDialog from '../layout/JoinEventDialog';
import ConfirmUnjoinDialog from '../layout/ConfirmUnjoinDialog';
import { isHostOfEvent } from '@/lib/utils';
import { Button } from './shadcn/button';

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
  status?: 'UPCOMING' | 'COMPLETED' | 'CANCELLED';
  host: {
    name: string | null;
    selfie: string | null;
    photos: string[] | null;
    id: number;
  };
  _count: {
    attendees: number;
  };
};

type TabType = 'UPCOMING' | 'WISHLIST' | 'REQUESTED';

export default function MyHangoutsGrid() {
  const [activeTab, setActiveTab] = useState<TabType>('UPCOMING');
  const { user } = useContext(AuthContext);

  const { data: likesData, isLoading: likesLoading } = useMyLikes();
  const { data: joinedData, isLoading: joinedLoading } = useMyJoinedEvents();

  const likeMutation = useLikeMutation();
  const unlikeMutation = useUnlikeMutation();
  const joinMutation = useJoinMutation();
  const cancelJoinMutation = useCancelJoinMutation();

  const [joinDialogFor, setJoinDialogFor] = useState<number | null>(null);
  const [unjoinDialogFor, setUnjoinDialogFor] = useState<number | null>(null);

  const likedIds = new Set(likesData?.likedEventIds || []);

  let targetIds: number[] = [];
  if (user) {
    if (activeTab === 'WISHLIST') {
      targetIds = likesData?.likedEventIds || [];
    } else if (activeTab === 'UPCOMING') {
      targetIds = joinedData?.joinedEventIds || [];
    } else if (activeTab === 'REQUESTED') {
      targetIds = joinedData?.requestedEventIds || [];
    }
  }

  const eventQueries = useQueries({
    queries: targetIds.map((id) => ({
      queryKey: ['event', String(id)],
      queryFn: async () => {
        const res = await eventApi.getEvent(String(id));
        return res.data.event;
      },
      enabled: !!user && targetIds.length > 0,
    })),
  });

  const allEvents = eventQueries.map((q) => q.data).filter((e): e is FetchedEvent => !!e);

  const now = new Date();

  const futureEvents = allEvents
    .filter((e) => new Date(e.datetime) >= now && e.status !== 'CANCELLED')
    .sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime());

  const doneOrCancelledEvents = allEvents
    .filter((e) => new Date(e.datetime) < now || e.status === 'CANCELLED')
    .sort((a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime());

  const events = [...futureEvents, ...doneOrCancelledEvents];

  const loading = likesLoading || joinedLoading || eventQueries.some((q) => q.isLoading);
  const error = null;

  const joinStatus: Record<string, 'NONE' | 'REQUESTED' | 'JOINED' | 'REJECTED'> = {};
  if (joinedData) {
    joinedData.requestedEventIds?.forEach((id: number) => {
      joinStatus[String(id)] = 'REQUESTED';
    });
    joinedData.joinedEventIds?.forEach((id: number) => {
      joinStatus[String(id)] = 'JOINED';
    });
  }

  const handleToggleLike = async (eventId: string) => {
    if (likedIds.has(Number(eventId))) {
      unlikeMutation.mutate(eventId);
    } else {
      likeMutation.mutate(eventId);
    }
  };

  const renderEmptyState = () => {
    if (activeTab === 'WISHLIST') {
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
    if (activeTab === 'UPCOMING') {
      return (
        <div className="max-w-md mx-auto px-4 py-10 text-center">
          <Calendar className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">No Upcoming Hangouts</h2>
          <p className="text-muted-foreground mb-6">
            You haven&apos;t joined any hangouts yet. Find one that interests you!
          </p>
          <Link
            href="/"
            className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            Browse Hangouts
          </Link>
        </div>
      );
    }
    return (
      // REQUESTED
      <div className="max-w-md mx-auto px-4 py-10 text-center">
        <Clock className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">No Pending Requests</h2>
        <p className="text-muted-foreground mb-6">
          You don&apos;t have any pending join requests at the moment.
        </p>
        <Link
          href="/"
          className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
        >
          Find More Hangouts
        </Link>
      </div>
    );
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-10 text-center">
        <Heart className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Sign in to view My Hangouts</h2>
        <p className="text-muted-foreground mb-6">
          Log in or create an account to track your upcoming and favorite hangouts.
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

  return (
    <div className="mx-auto max-w-7xl px-4">
      <div className="flex gap-2 mb-8 overflow-x-auto scrollbar-hide">
        <Button
          variant={activeTab === 'UPCOMING' ? 'default' : 'outline'}
          onClick={() => setActiveTab('UPCOMING')}
          className="rounded-full"
        >
          Upcoming
        </Button>
        <Button
          variant={activeTab === 'WISHLIST' ? 'default' : 'outline'}
          onClick={() => setActiveTab('WISHLIST')}
          className="rounded-full"
        >
          Wishlist
        </Button>
        <Button
          variant={activeTab === 'REQUESTED' ? 'default' : 'outline'}
          onClick={() => setActiveTab('REQUESTED')}
          className="rounded-full"
        >
          Requested
        </Button>
      </div>

      <JoinEventDialog
        open={joinDialogFor !== null}
        onClose={() => setJoinDialogFor(null)}
        onSubmit={async (message) => {
          const id = joinDialogFor!;
          joinMutation.mutate({ id, message });
          setJoinDialogFor(null);
        }}
      />

      <ConfirmUnjoinDialog
        open={unjoinDialogFor !== null}
        onClose={() => setUnjoinDialogFor(null)}
        onConfirm={async () => {
          const id = unjoinDialogFor!;
          cancelJoinMutation.mutate(id);
          setUnjoinDialogFor(null);
        }}
      />

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-[420px] w-full rounded-xl" />
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="max-w-md mx-auto px-4 py-10 text-center">
          <AlertTriangle className="w-10 h-10 text-destructive mx-auto mb-4" />
          <p className="text-muted-foreground">{error}</p>
        </div>
      )}

      {!loading && !error && events.length === 0 && renderEmptyState()}

      {!loading && !error && events.length > 0 && (
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
              attendees: event._count?.attendees ?? 0,
              maxAttendees: event.maxAttendees,
              category: formatCategory(event.category),
              priceType: event.priceType.toLowerCase() as 'free' | 'split_bill',
              creator: {
                name: event.host?.name || 'Hangout Host',
                avatar:
                  event.host?.photos?.[0] || event.host?.selfie || 'https://i.pravatar.cc/40?img=1',
              },
              eventStatus: event.status,
              isPast: new Date(event.datetime) < now,
            };

            const idStr = event.id.toString();
            let status = joinStatus[idStr] || 'NONE';
            const isHost = isHostOfEvent(user, event.host?.id);
            if (isHost) status = 'JOINED';

            return (
              <EventCard
                key={event.id}
                {...eventProps}
                isLiked={likedIds.has(event.id)}
                status={status}
                onLike={() => handleToggleLike(eventProps.id)}
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
      )}
    </div>
  );
}
