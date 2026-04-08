'use client';

import { useState, useContext, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import EventCard from './EventCard';
import { useEvents, useLikeMutation, useUnlikeMutation } from '@/hooks/useEvents';
import {
  useMyLikes,
  useMyJoinedEvents,
  useJoinMutation,
  useCancelJoinMutation,
} from '@/hooks/useMyHangouts';
import { Skeleton } from './shadcn/skeleton';
import { AuthContext } from '@/context/AuthContext';
import JoinEventDialog from '../layout/JoinEventDialog';
import ConfirmUnjoinDialog from '../layout/ConfirmUnjoinDialog';
import { isHostOfEvent } from '@/lib/utils';

export function formatCategory(cat: string) {
  return cat
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

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
    id: number;
    name: string | null;
    selfie: string | null;
    photos: string[] | null;
  };
  _count: {
    attendees: number;
  };
};

export default function EventGrid() {
  const searchParams = useSearchParams();
  const search = searchParams.get('search') || undefined;
  const category = searchParams.get('category') || undefined;
  const time = searchParams.get('time') || undefined;
  const date = searchParams.get('date') || undefined;

  const { data: eventsData, isLoading: eventsLoading } = useEvents({
    search,
    category,
  });
  const { data: likesData } = useMyLikes();
  const { data: joinedData } = useMyJoinedEvents();

  const likeMutation = useLikeMutation();
  const unlikeMutation = useUnlikeMutation();
  const joinMutation = useJoinMutation();
  const cancelJoinMutation = useCancelJoinMutation();

  const [joinDialogFor, setJoinDialogFor] = useState<number | null>(null);
  const [unjoinDialogFor, setUnjoinDialogFor] = useState<number | null>(null);
  const { user } = useContext(AuthContext);

  const events = useMemo(() => eventsData?.events || [], [eventsData?.events]);
  const filteredEvents = useMemo(() => {
    return events.filter((event: FetchedEvent) => {
      const eventDateTime = new Date(event.datetime);

      if (date) {
        const [y, m, d] = date.split('-').map(Number);
        if (
          Number.isFinite(y) &&
          Number.isFinite(m) &&
          Number.isFinite(d) &&
          (eventDateTime.getFullYear() !== y ||
            eventDateTime.getMonth() + 1 !== m ||
            eventDateTime.getDate() !== d)
        ) {
          return false;
        }
      }

      if (time) {
        const hour = eventDateTime.getHours();
        const matchesTime =
          (time === 'morning' && hour >= 5 && hour < 12) ||
          (time === 'afternoon' && hour >= 12 && hour < 17) ||
          (time === 'evening' && hour >= 17 && hour < 21) ||
          (time === 'night' && (hour >= 21 || hour < 5));
        if (!matchesTime) return false;
      }

      return true;
    });
  }, [events, date, time]);
  const loading = eventsLoading;

  const likedEvents = new Set(likesData?.likedEventIds?.map(String) || []);

  const joinStatus: Record<string, 'NONE' | 'REQUESTED' | 'JOINED' | 'REJECTED'> = {};
  joinedData?.requestedEventIds?.forEach((id: number) => {
    joinStatus[String(id)] = 'REQUESTED';
  });
  joinedData?.joinedEventIds?.forEach((id: number) => {
    joinStatus[String(id)] = 'JOINED';
  });

  const handleLike = async (eventId: string) => {
    if (likedEvents.has(eventId)) {
      unlikeMutation.mutate(eventId);
    } else {
      likeMutation.mutate(eventId);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-[420px] w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (filteredEvents.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 text-center text-muted-foreground">
        No hangouts found.
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event: FetchedEvent) => {
          const idStr = String(event.id);
          let status = joinStatus[idStr] || 'NONE';
          const isHost = isHostOfEvent(user, event.host?.id);
          if (isHost) status = 'JOINED';

          return (
            <EventCard
              key={idStr}
              id={idStr}
              title={event.title}
              description={event.description}
              location={`${event.addressLine}, ${event.city}`}
              date={new Date(event.datetime).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })}
              time={new Date(event.datetime).toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
              })}
              attendees={event._count?.attendees ?? 0}
              maxAttendees={event.maxAttendees}
              category={formatCategory(event.category)}
              priceType={event.priceType.toLowerCase() as 'free' | 'split_bill'}
              creator={{
                name: event.host?.name || 'Hangout Host',
                avatar:
                  event.host?.photos?.[0] || event.host?.selfie || 'https://i.pravatar.cc/40?img=1',
              }}
              isLiked={likedEvents.has(idStr)}
              status={status}
              eventStatus={event.status}
              isPast={new Date(event.datetime) < new Date()}
              onLike={() => handleLike(idStr)}
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
