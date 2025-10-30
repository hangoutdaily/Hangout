"use client";

import { MapPin, Calendar, Users, Clock, Heart, User, Tag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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
  priceType?: "free" | "split" | "paid";
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
  priceType = "free",
  creator,
  attendeeAvatars,
  isLiked = false,
  onLike,
  onJoin,
}: EventCardProps) {
  const formatPrice = () => {
    if (priceType === "free") return "Free";
    if (priceType === "split") return "Split";
    return `$${price}`;
  };

  return (
    <Link href={`/events/${id}`} className="block group">
      <div className="bg-card-bg border border-border rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:border-accent/50 group-hover:scale-[1.02] cursor-pointer">
        <div className="p-4 pb-2">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium text-accent bg-accent/10 px-2 py-1 rounded-full">
                {category}
              </span>
            </div>
            <button
              onClick={(e) => {
                e.preventDefault();
                onLike?.();
              }}
              className="p-2 rounded-full hover:bg-surface transition-colors"
            >
              <Heart 
                className={`h-5 w-5 ${isLiked ? 'text-destructive fill-destructive' : 'text-muted hover:text-foreground'}`} 
              />
            </button>
          </div>
          
          <h3 className="font-bold text-foreground text-xl mb-2 line-clamp-1 group-hover:text-accent transition-colors">
            {title}
          </h3>
          
          <p className="text-muted text-sm mb-4 line-clamp-2 leading-relaxed">
            {description}
          </p>
        </div>
        
        <div className="px-4 pb-4">
          <div className="flex items-center gap-4 mb-3">
            <div className="flex items-center text-sm text-muted">
              <Calendar className="h-4 w-4 mr-2" />
              <span className="font-medium">{date}</span>
            </div>
            <div className="flex items-center text-sm text-muted">
              <Clock className="h-4 w-4 mr-2" />
              <span>{time}</span>
            </div>
          </div>
          
          <div className="flex items-center text-sm text-muted mb-4">
            <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="truncate">{location}</span>
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="flex -space-x-2 mr-3">
                {attendeeAvatars.slice(0, 3).map((avatar, index) => (
                  <div
                    key={index}
                    className="w-8 h-8 rounded-full border-2 border-background overflow-hidden"
                  >
                    <Image
                      src={avatar}
                      alt={`Attendee ${index + 1}`}
                      width={32}
                      height={32}
                      className="object-cover"
                    />
                  </div>
                ))}
                {attendees > 3 && (
                  <div className="w-8 h-8 rounded-full border-2 border-background bg-surface flex items-center justify-center text-xs font-medium text-foreground">
                    +{attendees - 3}
                  </div>
                )}
              </div>
              <span className="text-sm text-muted">
                {attendees}/{maxAttendees} attending
              </span>
            </div>
            
            <div className="text-right">
              <span className="text-lg font-bold text-foreground">
                {formatPrice()}
              </span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full overflow-hidden mr-3">
                <Image
                  src={creator.avatar}
                  alt={creator.name}
                  width={32}
                  height={32}
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{creator.name}</p>
                <p className="text-xs text-muted">Organizer</p>
              </div>
            </div>
            
            <button
              onClick={(e) => {
                e.preventDefault();
                onJoin?.();
              }}
              className="bg-accent text-accent-foreground px-6 py-2 rounded-lg font-semibold hover:bg-accent/90 transition-colors shadow-sm hover:shadow-md"
            >
              Join Event
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
