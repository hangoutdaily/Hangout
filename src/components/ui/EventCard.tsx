'use client';

import { MapPin, Calendar, Clock, Users, Heart, Zap } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

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
  onLike,
  onJoin,
}: EventCardProps) {
  const formatPrice = () => {
    if (priceType === 'free') return 'Free';
    if (priceType === 'split_bill') return 'Split';
    return `$${price}`;
  };

  return (
    <Link
      href={`/events/${id}`}
      className="flex flex-col h-full rounded-xl overflow-hidden border border-border bg-card hover:shadow-md hover:border-accent/30 transition-all duration-300"
    >
      <div className="px-5 pt-4 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm text-muted flex-1">
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
