'use client';

import { useState, useEffect, useContext } from 'react';
import EventCard from './EventCard';
import {
  getAllEvents,
  getMyLikes,
  getMyJoinedEvents,
  joinEvent,
  likeEvent,
  unlikeEvent,
  cancelJoinEvent,
} from '@/api/event';
import { Skeleton } from './shadcn/skeleton';
import { AuthContext } from '@/context/AuthContext';
import JoinEventDialog from '../layout/JoinEventDialog';
import ConfirmUnjoinDialog from '../layout/ConfirmUnjoinDialog';

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
  host: {
    id: number;
    name: string | null;
    selfie: string | null;
  };
  _count: {
    attendees: number;
  };
};

export default function EventGrid() {
  const [events, setEvents] = useState<FetchedEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedEvents, setLikedEvents] = useState<Set<string>>(new Set());
  const [joinStatus, setJoinStatus] = useState<
    Record<string, 'NONE' | 'REQUESTED' | 'JOINED' | 'REJECTED'>
  >({});
  const [joinDialogFor, setJoinDialogFor] = useState<number | null>(null);
  const [unjoinDialogFor, setUnjoinDialogFor] = useState<number | null>(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    async function fetchData() {
      try {
        const eventsRes = await getAllEvents();
        setEvents(eventsRes.data.events);

        if (user) {
          const likesRes = await getMyLikes();
          setLikedEvents(new Set(likesRes.data.likedEventIds.map(String)));

          const joinedReq = await getMyJoinedEvents();
          const statusMap: Record<string, 'NONE' | 'REQUESTED' | 'JOINED'> = {};

          // If later you add requested IDs in the API, they’ll just start working
          joinedReq.data?.requestedEventIds?.forEach((id: number) => {
            statusMap[String(id)] = 'REQUESTED';
          });

          joinedReq.data?.joinedEventIds?.forEach((id: number) => {
            statusMap[String(id)] = 'JOINED';
          });

          setJoinStatus(statusMap);
        } else {
          setLikedEvents(new Set());
          setJoinStatus({});
        }
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [user]);

  const isHostOfEvent = (user: any, hostId?: number | null) => {
    if (!user || hostId == null) return false;

    const possibleIds = [user.profileId, user.id, user.profile?.id].filter((v) => v != null);

    return possibleIds.some((val) => Number(val) === Number(hostId));
  };

  const handleLike = async (eventId: string) => {
    const currentlyLiked = likedEvents.has(eventId);
    setLikedEvents((prev) => {
      const updated = new Set(prev);
      currentlyLiked ? updated.delete(eventId) : updated.add(eventId);
      return updated;
    });

    try {
      currentlyLiked ? await unlikeEvent(eventId) : await likeEvent(eventId);
    } catch {
      setLikedEvents((prev) => {
        const updated = new Set(prev);
        currentlyLiked ? updated.add(eventId) : updated.delete(eventId);
        return updated;
      });
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

  if (events.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 text-center text-muted-foreground">
        No events found.
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
              attendees={event._count.attendees}
              maxAttendees={event.maxAttendees}
              category={formatCategory(event.category)}
              priceType={event.priceType.toLowerCase() as 'free' | 'split_bill'}
              creator={{
                name: event.host?.name || 'Hangout Host',
                avatar: event.host?.selfie || 'https://i.pravatar.cc/40?img=1',
              }}
              isLiked={likedEvents.has(idStr)}
              status={status}
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
