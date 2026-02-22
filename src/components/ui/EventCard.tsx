'use client';

import { MapPin, Calendar, Clock, Users, Heart, Zap } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

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
  priceType?: 'free' | 'split_bill' | 'paid';
  creator: { name: string; avatar: string };
  isLiked?: boolean;
  status?: 'NONE' | 'REQUESTED' | 'JOINED' | 'REJECTED';
  eventStatus?: 'UPCOMING' | 'COMPLETED' | 'CANCELLED';
  isPast?: boolean;
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
  isLiked = false,
  status = 'NONE',
  eventStatus = 'UPCOMING',
  isPast = false,
  onLike,
  onJoin,
}: EventCardProps) {
  const isCancelled = eventStatus === 'CANCELLED';
  const isDone = eventStatus === 'COMPLETED' || isPast;

  const formatPrice = () => {
    if (priceType === 'free') return 'Free';
    if (priceType === 'split_bill') return 'Split';
    return `$${price}`;
  };

  return (
    <Link
      href={`/events/${id}`}
      className={cn(
        'flex flex-col h-full rounded-xl overflow-hidden border border-border bg-card transition-all duration-300 relative group',
        isDone || isCancelled
          ? 'bg-secondary/20 hover:bg-secondary/30'
          : 'hover:shadow-md hover:border-accent/30'
      )}
    >
      {(isDone || isCancelled) && (
        <div className="absolute inset-0 bg-background/5 mix-blend-multiply pointer-events-none" />
      )}

      <div className="px-5 pt-4 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-muted flex-1 overflow-hidden">
          {isCancelled ? (
            <span className="shrink-0 px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 text-[10px] font-bold uppercase tracking-wider border border-rose-500/20">
              Called Off
            </span>
          ) : isDone ? (
            <span className="shrink-0 px-2 py-0.5 rounded-full bg-slate-500/10 text-slate-600 text-[10px] font-bold uppercase tracking-wider border border-slate-500/20">
              Done
            </span>
          ) : null}

          <div className="flex items-center gap-1.5 shrink-0">
            <Calendar className="h-3.5 w-3.5 opacity-70" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <Clock className="h-3.5 w-3.5 opacity-70" />
            <span>{time}</span>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onLike?.();
          }}
          className="p-1.5 rounded-lg hover:bg-accent/10 transition-colors"
        >
          <motion.div
            key={isLiked ? 'liked' : 'unliked'}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 12 }}
          >
            <Heart className={`h-5 w-5 ${isLiked ? 'text-red-500 fill-red-500' : 'text-muted'}`} />
          </motion.div>
        </button>
      </div>

      <div className="px-5 pb-3">
        <h3 className="font-semibold text-foreground text-lg mb-1 line-clamp-1 group-hover:text-accent transition-colors">
          {title}
        </h3>
        <p className="text-muted text-sm line-clamp-2 leading-relaxed">{description}</p>
      </div>

      <div className="px-5 py-3 space-y-2.5 flex-1">
        <div className="flex items-center gap-3 text-sm">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100">
            <MapPin className="h-4 w-4 text-gray-700" />
          </div>
          <span className="truncate">{location}</span>
        </div>

        <div className="flex items-center gap-3 text-sm">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100">
            <Users className="h-4 w-4 text-gray-700" />
          </div>
          <span className="font-medium">
            {attendees}/{maxAttendees} Joined
          </span>
        </div>
      </div>

      <div className="px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image
            src={creator.avatar}
            alt={creator.name}
            width={28}
            height={28}
            className="rounded-full object-cover border border-border"
          />
          <div>
            <p className="text-xs font-semibold text-foreground">{creator.name}</p>
            <p className="text-xs text-muted">Host</p>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onJoin?.();
          }}
          className={`px-4 py-1.5 rounded-lg font-semibold text-sm cursor-pointer transition-all whitespace-nowrap
            ${
              status === 'JOINED'
                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                : status === 'REQUESTED'
                  ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                  : status === 'REJECTED'
                    ? 'bg-destructive/20 text-destructive hover:bg-destructive/30'
                    : 'bg-accent text-accent-foreground hover:opacity-90'
            }`}
        >
          {status === 'JOINED'
            ? 'Joined'
            : status === 'REQUESTED'
              ? 'Requested'
              : status === 'REJECTED'
                ? 'Request Again'
                : 'Request to Join'}
        </button>
      </div>

      <div className="px-5 py-3 flex items-center justify-between border-t border-border/50 text-xs">
        <div className="flex items-center gap-1 text-muted">
          <Zap className="h-3 w-3 text-accent" />
          {category}
        </div>
        <span className="font-medium text-foreground">{formatPrice()}</span>
      </div>
    </Link>
  );
}
