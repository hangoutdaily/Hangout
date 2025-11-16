'use client';

import { useState, useEffect } from 'react';
import EventCard from './EventCard';
import { getAllEvents } from '@/api/event';
import { Skeleton } from './shadcn/skeleton';

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

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await getAllEvents();
        console.log(res);
        setEvents(res.data.events);
      } catch (err) {
        console.error('Failed to fetch events', err);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  const handleLike = (eventId: string) => {
    setLikedEvents((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(eventId)) {
        newSet.delete(eventId);
      } else {
        newSet.add(eventId);
      }
      return newSet;
    });
  };

  const handleJoin = (eventId: string) => {
    console.log(`Joining event ${eventId}`);
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

          return (
            <EventCard
              key={event.id}
              {...eventProps}
              isLiked={likedEvents.has(eventProps.id)}
              onLike={() => handleLike(eventProps.id)}
              onJoin={() => handleJoin(eventProps.id)}
            />
          );
        })}
      </div>
    </div>
  );
}
