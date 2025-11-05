'use client';

import { MapPin, Calendar, Clock, Heart, Zap } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

type EventCardProps = {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  time: string;
  attendees: number;
  maxAttendees: number;
  category: string;
  price?: number;
  priceType?: 'free' | 'split' | 'paid';
  creator: {
    name: string;
    avatar: string;
  };
  attendeeAvatars: string[];
  isLiked?: boolean;
  onLike?: () => void;
  onJoin?: () => void;
};

export default function EventCard({
  id,
  title,
  description,
  location,
  date,
  time,
  attendees,
  maxAttendees,
  category,
  price = 0,
  priceType = 'free',
  creator,
  attendeeAvatars,
  isLiked = false,
  onLike,
  onJoin,
}: EventCardProps) {
  const formatPrice = (): string => {
    if (priceType === 'free') return 'Free';
    if (priceType === 'split') return 'Split Bill';
    return `$${price}`;
  };

  return (
    <Link
      href={`/events/${id}`}
      className="block group rounded-xl overflow-hidden border border-border bg-card-bg hover:shadow-md hover:border-accent/30 transition-all duration-300"
    >
      <div className="px-5 pt-4 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm font-medium text-muted flex-1">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{time}</span>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.preventDefault();
            onLike?.();
          }}
          className="p-1.5 rounded-lg hover:bg-accent/10 transition-colors"
        >
          <Heart
            className={`h-5 w-5 ${
              isLiked ? 'text-red-500 fill-red-500' : 'text-muted hover:text-accent'
            }`}
          />
        </button>
      </div>

      <div className="px-5 pt-2 pb-3">
        <h3 className="font-semibold text-foreground text-lg mb-1 line-clamp-1 group-hover:text-accent transition-colors">
          {title}
        </h3>
        <p className="text-muted text-sm line-clamp-2 leading-relaxed">{description}</p>
      </div>

      <div className="px-5 py-3 border-t border-border/50 space-y-3">
        <div className="flex items-center gap-3 text-sm">
          <MapPin className="h-4 w-4 text-accent" />
          <span className="text-foreground truncate">{location}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex -space-x-2">
            {attendeeAvatars.slice(0, 4).map((avatar, i) => (
              <Image
                key={i}
                src={avatar}
                alt="Attendee"
                width={24}
                height={24}
                className="rounded-full border-2 border-background object-cover"
              />
            ))}
            {attendees > 4 && (
              <span className="text-xs text-muted ml-3">+{attendees - 4} more</span>
            )}
          </div>
          <span className="text-muted text-xs">
            {attendees}/{maxAttendees} attending
          </span>
        </div>
      </div>

      <div className="px-5 py-4 flex items-center justify-between border-t border-border/50">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full overflow-hidden bg-muted/20 flex-shrink-0">
            <Image
              src={creator.avatar || '/placeholder.svg'}
              alt={creator.name}
              width={28}
              height={28}
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-xs font-semibold text-foreground">{creator.name}</p>
            <p className="text-xs text-muted">Host</p>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.preventDefault();
            onJoin?.();
          }}
          className="bg-accent text-accent-foreground px-4 py-1.5 rounded-lg font-medium text-sm hover:opacity-90 transition-colors whitespace-nowrap"
        >
          Join
        </button>
      </div>

      <div className="px-5 py-3 flex items-center justify-between border-t border-border/50">
        <div className="flex items-center gap-2">
          <Zap className="h-3 w-3 text-accent" />
          <span className="text-xs text-muted">{category}</span>
        </div>
        <span className="text-xs font-medium text-foreground">{formatPrice()}</span>
      </div>
    </Link>
  );
}
