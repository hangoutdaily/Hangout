'use client';

import { useState } from 'react';
import Image from 'next/image';
import { MapPin, Edit, Star } from 'lucide-react';
import EventCard from '@/components/ui/EventCard';
import { cn } from '@/lib/utils';

interface SocialMediaLink {
  platform: string;
  url: string;
}

interface UserProfile {
  name: string;
  bio: string;
  location: string;
  avatar: string;
  coverPhoto: string;
  socialMedia: SocialMediaLink[];
}

interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  time: string;
  attendees: number;
  maxAttendees: number;
  image?: string | null;
  category: string;
  price: number;
  priceType: 'free' | 'paid' | 'split';
  creator: { name: string; avatar: string };
  attendeeAvatars: string[];
}

interface Review {
  id: string;
  reviewer: string;
  avatar: string;
  rating: number;
  comment: string;
  time: string;
}

const mockUser: UserProfile = {
  name: 'Dhruv Patel',
  bio: 'Passionate about technology and community building. Love organizing events and meeting new people!',
  location: 'Gandhinagar, India',
  avatar: 'https://i.pravatar.cc/150?img=1',
  coverPhoto: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=300&fit=crop',
  socialMedia: [
    { platform: 'Twitter', url: '#' },
    { platform: 'Instagram', url: '#' },
    { platform: 'LinkedIn', url: '#' },
  ],
};

const mockEventsHosted: Event[] = [
  {
    id: 'h1',
    title: 'Community Coding Night',
    description: 'Pair programming and pizza. Bring your laptop!',
    location: 'Tech Hub, Gandhinagar',
    date: 'Jan 12',
    time: '7:00 PM',
    attendees: 18,
    maxAttendees: 30,
    image: null,
    category: 'Technology',
    price: 0,
    priceType: 'free',
    creator: { name: 'Dhruv Patel', avatar: 'https://i.pravatar.cc/40?img=1' },
    attendeeAvatars: [
      'https://i.pravatar.cc/40?img=2',
      'https://i.pravatar.cc/40?img=3',
      'https://i.pravatar.cc/40?img=4',
    ],
  },
];

const mockEventsAttended: Event[] = [
  {
    id: 'a1',
    title: 'Blackpink Concert',
    description: 'Unforgettable night of music and dance!',
    location: 'NYC Arena',
    date: 'May 20',
    time: '8:00 PM',
    attendees: 1200,
    maxAttendees: 2000,
    category: 'Concerts',
    price: 40.23,
    priceType: 'paid',
    creator: { name: 'Sarah Johnson', avatar: 'https://i.pravatar.cc/40?img=5' },
    attendeeAvatars: [
      'https://i.pravatar.cc/40?img=6',
      'https://i.pravatar.cc/40?img=7',
      'https://i.pravatar.cc/40?img=8',
    ],
  },
];

const mockReviews: Review[] = [
  {
    id: '1',
    reviewer: 'Rushil Patel',
    avatar: 'https://i.pravatar.cc/40?img=2',
    rating: 5,
    comment: 'Dhruv organized an amazing tech meetup. Great speaker and excellent venue!',
    time: '1 day ago',
  },
  {
    id: '2',
    reviewer: 'Emma Wilson',
    avatar: 'https://i.pravatar.cc/40?img=3',
    rating: 5,
    comment: 'Very professional and friendly. The event was well-structured and engaging.',
    time: '3 days ago',
  },
  {
    id: '3',
    reviewer: 'Mike Chen',
    avatar: 'https://i.pravatar.cc/40?img=4',
    rating: 4,
    comment: 'Good event organizer. Would attend more events by Dhruv.',
    time: '1 week ago',
  },
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<'events' | 'reviews'>('events');

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="relative mb-10">
          <div className="relative h-48 md:h-64 rounded-2xl overflow-hidden">
            <Image src={mockUser.coverPhoto} alt="Cover" fill className="object-cover" />
            <button className="absolute top-4 right-4 p-2 bg-background/80 backdrop-blur-sm rounded-full hover:bg-background transition">
              <Edit className="h-4 w-4 text-foreground" />
            </button>
          </div>

          <div className="relative -mt-16 md:-mt-20 ml-6">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-background overflow-hidden">
              <Image
                src={mockUser.avatar}
                alt={mockUser.name}
                width={128}
                height={128}
                className="object-cover"
              />
            </div>
          </div>

          <div className="mt-4 ml-6">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-1">{mockUser.name}</h2>
            <p className="text-muted-foreground mb-2 max-w-xl">{mockUser.bio}</p>
            <div className="flex items-center text-muted-foreground text-sm">
              <MapPin className="h-4 w-4 mr-2" />
              <span>{mockUser.location}</span>
            </div>
          </div>
        </div>

        <div className="border-b border-border mb-6">
          <nav className="flex space-x-8">
            {[
              { key: 'events', label: 'Hangouts' },
              { key: 'reviews', label: 'Reviews' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as 'events' | 'reviews')}
                className={cn(
                  'py-2 px-1 border-b-2 font-medium text-sm transition-colors',
                  activeTab === tab.key
                    ? 'border-accent text-accent'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                )}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="min-h-[400px] space-y-10">
          {activeTab === 'events' && (
            <>
              <EventSection title="Hosted" events={mockEventsHosted} />
              <EventSection title="Attended" events={mockEventsAttended} />
            </>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-4">
              {mockReviews.map((review) => (
                <div key={review.id} className="border border-border bg-card rounded-xl p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                        <Image
                          src={review.avatar}
                          alt={review.reviewer}
                          width={40}
                          height={40}
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{review.reviewer}</p>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={cn(
                                'h-4 w-4',
                                i < review.rating
                                  ? 'text-yellow-500 fill-yellow-500'
                                  : 'text-muted-foreground'
                              )}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">{review.time}</p>
                  </div>
                  <p className="text-sm text-foreground/90 leading-relaxed">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function EventSection({ title, events }: { title: string; events: Event[] }) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-foreground mb-3">{title}</h3>
      {events.length === 0 ? (
        <p className="text-sm text-muted-foreground">No events found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {events.map((evt) => (
            <EventCard key={evt.id} {...evt} />
          ))}
        </div>
      )}
    </div>
  );
}
