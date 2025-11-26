'use client';

import { useState, useEffect, useContext } from 'react';
import {
  MapPin,
  Calendar,
  Clock,
  Heart,
  ArrowLeft,
  Star,
  MessageCircle,
  ChevronRight,
  Share2,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import {
  cancelJoinEvent,
  getEvent,
  getMyJoinedEvents,
  getMyLikes,
  joinEvent,
  likeEvent,
  unlikeEvent,
} from '@/api/event';
import { AuthContext } from '@/context/AuthContext';
import JoinEventDialog from '@/components/layout/JoinEventDialog';
import { launchConfetti } from '@/lib/cofetti';
import ConfirmUnjoinDialog from '@/components/layout/ConfirmUnJoinDialog';

interface EventDetailClientProps {
  id: string;
}

type EventHost = {
  name: string | null;
  selfie: string | null;
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
  host: EventHost;
  attendees: { id: number }[];
};

export default function EventDetailClient({ id }: EventDetailClientProps) {
  const { user } = useContext(AuthContext);
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);
  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const [showUnjoinDialog, setShowUnjoinDialog] = useState(false);

  const attendeeMetadata = {
    genderRatio: { male: 45, female: 55 },
    ageRange: { min: 18, max: 45, avg: 28 },
  };

  const mockReviews = [
    {
      id: '1',
      user: 'Dhruv Chauhan',
      rating: 5,
      text: 'Amazing event! Sarah did an incredible job organizing everything. Highly recommend!',
      date: '2 weeks ago',
    },
  ];

  const mockChats = [
    {
      id: '1',
      user: 'Dhruv Chauhan',
      avatar: 'https://i.pravatar.cc/40?img=2',
      message: "Can't wait for this concert! Is anyone meeting before?",
      time: '2 hours ago',
    },
  ];

  useEffect(() => {
    async function load() {
      try {
        const res = await getEvent(id);
        const ev: EventDetail = res.data.event;
        setEvent(ev);
        if (user) {
          const likesRes = await getMyLikes();
          setIsLiked(likesRes.data.likedEventIds?.includes(ev.id));
          const joinedRes = await getMyJoinedEvents();
          setHasJoined(joinedRes.data.joinedEventIds?.includes(ev.id));
        } else {
          setIsLiked(false);
        }
      } catch (err) {
        console.error('Failed to load event', err);
        setEvent(null);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id, user]);

  const handleToggleLike = async () => {
    if (!user) {
      alert('Login required to like events');
      return;
    }
    const next = !isLiked;
    setIsLiked(next);
    try {
      if (next) {
        await likeEvent(id);
      } else {
        await unlikeEvent(id);
      }
    } catch (err) {
      console.error('Failed to toggle like', err);
      setIsLiked(!next);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!event) return <div className="p-6 text-red-500">Event not found.</div>;

  const eventDate = new Date(event.datetime);
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const formattedTime = eventDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

  const attendeesCount = event.attendees?.length ?? 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-3 flex justify-between items-center">
          <Link
            href="/"
            className="flex items-center gap-2 text-foreground hover:text-muted transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm font-medium">Back</span>
          </Link>

          <div className="flex items-center gap-2">
            <button>
              <Share2 className="h-5 w-5 text-foreground" />
            </button>
            <button
              onClick={handleToggleLike}
              className="p-2.5 rounded-full hover:bg-secondary transition-colors"
            >
              <Heart
                className={`h-5 w-5 ${
                  isLiked ? 'fill-destructive text-destructive' : 'text-foreground'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">{event.title}</h1>
              <p className="text-muted">{event.category}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-muted flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs uppercase tracking-wide text-muted font-medium">Date</p>
                <p className="text-foreground">{formattedDate}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-muted flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs uppercase tracking-wide text-muted font-medium">Time</p>
                <p className="text-foreground">{formattedTime}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-muted flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs uppercase tracking-wide text-muted font-medium">Location</p>
                <p className="text-foreground text-sm">{event.addressLine}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 pb-8 border-b border-border">
            <div className="px-3 py-1 bg-secondary rounded-full">
              <p className="text-sm font-medium text-foreground">
                {event.priceType === 'SPLIT_BILL' ? 'Split the Bill' : 'Free'}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6 pb-8 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">Things to know</h3>
          <p className="text-foreground leading-relaxed mb-8">{event.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-secondary rounded-2xl p-6 flex flex-col">
              <p className="text-xs uppercase tracking-wide text-muted font-medium mb-4">
                People Joined
              </p>
              <div className="space-y-3">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-foreground">{attendeesCount}</span>
                  <span className="text-lg text-muted">/ {event.maxAttendees}</span>
                </div>
                <div className="w-full bg-border rounded-full h-1.5">
                  <div
                    className="bg-foreground h-1.5 rounded-full"
                    style={{
                      width: `${Math.min(
                        100,
                        (attendeesCount / (event.maxAttendees || 1)) * 100
                      )}%`,
                    }}
                  />
                </div>
                <p className="text-xs text-muted">
                  {Math.round((attendeesCount / (event.maxAttendees || 1)) * 100)}% capacity
                </p>
              </div>
            </div>

            <div className="bg-secondary rounded-2xl p-6 flex flex-col">
              <p className="text-xs uppercase tracking-wide text-muted font-medium mb-4">
                Gender Mix
              </p>
              <div className="space-y-4 flex-1 flex flex-col justify-center">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">Male</span>
                    <span className="text-2xl font-bold text-foreground">
                      {attendeeMetadata.genderRatio.male}%
                    </span>
                  </div>
                  <div className="w-full bg-border rounded-full h-1 overflow-hidden">
                    <div
                      className="bg-foreground h-full"
                      style={{ width: `${attendeeMetadata.genderRatio.male}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">Female</span>
                    <span className="text-2xl font-bold text-foreground">
                      {attendeeMetadata.genderRatio.female}%
                    </span>
                  </div>
                  <div className="w-full bg-border rounded-full h-1 overflow-hidden">
                    <div
                      className="bg-foreground h-full"
                      style={{ width: `${attendeeMetadata.genderRatio.female}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-secondary rounded-2xl p-6 flex flex-col justify-center">
              <p className="text-xs uppercase tracking-wide text-muted font-medium mb-4">
                Age Range
              </p>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted mb-1">Average</p>
                  <p className="text-4xl font-bold text-foreground">
                    {attendeeMetadata.ageRange.avg}
                  </p>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted">{attendeeMetadata.ageRange.min}</span>
                  <span className="text-muted">to</span>
                  <span className="text-muted">{attendeeMetadata.ageRange.max}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6 pb-8 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground mb-6">Meet the host</h3>
          <div className="bg-secondary rounded-2xl p-8 flex flex-col items-center text-center">
            <Image
              src={event.host.selfie || '/placeholder.svg'}
              alt={event.host.name || 'Host'}
              width={100}
              height={100}
              className="rounded-full mb-4 object-cover"
            />
            <h4 className="text-2xl font-bold text-foreground mb-1">
              {event.host.name || 'Hangout Host'}
            </h4>
            <p className="text-sm text-muted font-medium mb-4">
              Friendly local host who loves meeting new people and organizing great experiences.
            </p>

            <div className="flex items-center gap-4 mb-6 text-sm">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-foreground text-foreground" />
                <span className="font-semibold text-foreground">4.9</span>
                <span className="text-muted">(42 reviews)</span>
              </div>
            </div>

            <p className="text-foreground leading-relaxed mb-6 max-w-xl text-sm">
              I love hosting experiences that bring people together. Expect a chill vibe, good
              conversations, and a safe, welcoming space for everyone.
            </p>

            <button className="px-6 py-2.5 border border-border rounded-lg hover:bg-background transition-colors text-sm font-medium text-foreground">
              Contact Host
            </button>
          </div>
        </div>

        <div className="mb-6 pb-8 border-b border-border">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">Host Reviews</h3>
            <button className="text-sm font-medium text-foreground hover:text-muted transition-colors flex items-center gap-1">
              View all
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-2 snap-x scrollbar-hide">
            {mockReviews.map((review) => (
              <div
                key={review.id}
                className="flex-shrink-0 w-80 p-4 bg-secondary rounded-lg border border-border snap-start"
              >
                <div className="flex items-start justify-between mb-3">
                  <p className="font-medium text-foreground text-sm">{review.user}</p>
                  <div className="flex items-center gap-0.5">
                    {Array(review.rating)
                      .fill(null)
                      .map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-foreground text-foreground" />
                      ))}
                  </div>
                </div>
                <p className="text-sm text-foreground mb-3 leading-relaxed">{review.text}</p>
                <p className="text-xs text-muted">{review.date}</p>
              </div>
            ))}
          </div>
        </div>

        {hasJoined && (
          <div className="mb-12">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Event Chat
            </h3>
            <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
              {mockChats.map((chat) => (
                <div key={chat.id} className="flex items-start gap-3">
                  <Image
                    src={chat.avatar || '/placeholder.svg'}
                    alt={chat.user}
                    width={32}
                    height={32}
                    className="rounded-full flex-shrink-0"
                  />
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2 mb-1">
                      <p className="font-medium text-foreground text-sm">{chat.user}</p>
                      <p className="text-xs text-muted">{chat.time}</p>
                    </div>
                    <p className="text-sm text-foreground">{chat.message}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Share your thoughts..."
                className="flex-1 px-4 py-2 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-accent"
              />
              <button className="px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:opacity-90 transition-opacity font-medium text-sm">
                Send
              </button>
            </div>
          </div>
        )}

        <div className="flex gap-3 pt-8 border-t border-border">
          {!hasJoined ? (
            <button
              onClick={() => setShowJoinDialog(true)}
              className="flex-1 px-6 py-3 bg-accent text-accent-foreground rounded-lg hover:opacity-90 font-semibold"
            >
              Request to Join
            </button>
          ) : (
            <button
              onClick={() => setShowUnjoinDialog(true)}
              className="flex-1 px-6 py-3 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 font-semibold"
            >
              Cancel Request
            </button>
          )}
        </div>
        <JoinEventDialog
          open={showJoinDialog}
          onClose={() => setShowJoinDialog(false)}
          onSubmit={async (message) => {
            await joinEvent(id, message);
            setHasJoined(true);
            setShowJoinDialog(false);
            launchConfetti();
          }}
        />

        <ConfirmUnjoinDialog
          open={showUnjoinDialog}
          onClose={() => setShowUnjoinDialog(false)}
          onConfirm={async () => {
            await cancelJoinEvent(id);
            setHasJoined(false);
            setShowUnjoinDialog(false);
          }}
        />
      </div>
    </div>
  );
}
