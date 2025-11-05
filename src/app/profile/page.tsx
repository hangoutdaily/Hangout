'use client';

import { useState } from 'react';
import EventCard from '@/components/ui/EventCard';
import { MapPin, Edit, Star, MessageCircle, Heart, Share2 } from 'lucide-react';
import Image from 'next/image';

/* -------------------------------------------------------------------------- */
/*                                   TYPES                                   */
/* -------------------------------------------------------------------------- */

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

interface PhotoPost {
  id: string;
  type: 'image' | 'text';
  image?: string;
  title?: string;
  content?: string;
  likes: number;
  comments: number;
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

/* -------------------------------------------------------------------------- */
/*                                  MOCK DATA                                */
/* -------------------------------------------------------------------------- */

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
    { platform: 'GitHub', url: '#' },
  ],
};

const mockPhotos: PhotoPost[] = [
  {
    id: '1',
    type: 'image',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
    title: 'Amazing concert last night!',
    likes: 24,
    comments: 8,
  },
  {
    id: '2',
    type: 'image',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop',
    title: 'Coffee meetup was fantastic',
    likes: 12,
    comments: 5,
  },
  {
    id: '3',
    type: 'text',
    content: 'Just finished organizing the tech talk event. Great turnout!',
    likes: 18,
    comments: 3,
  },
  {
    id: '4',
    type: 'image',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop',
    title: 'Morning yoga session',
    likes: 15,
    comments: 7,
  },
];

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
    image: undefined,
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
  const [activeTab, setActiveTab] = useState<'events' | 'reviews' | 'photos'>('events');

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="relative mb-8">
          <div className="relative h-48 md:h-64 rounded-2xl overflow-hidden">
            <Image src={mockUser.coverPhoto} alt="Cover photo" fill className="object-cover" />
            <button className="absolute top-4 right-4 p-2 bg-background/80 backdrop-blur-sm rounded-full hover:bg-background/90 transition-colors">
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
            <h2 className="text-2xl font-bold text-foreground mb-1">{mockUser.name}</h2>
            <p className="text-muted mb-2">{mockUser.bio}</p>
            <div className="flex items-center text-muted mb-4">
              <MapPin className="h-4 w-4 mr-2" />
              <span>{mockUser.location}</span>
            </div>
          </div>
        </div>

        <div className="border-b border-border mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('events')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'events'
                  ? 'border-accent text-accent'
                  : 'border-transparent text-muted hover:text-foreground'
              }`}
            >
              Hangouts
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'reviews'
                  ? 'border-accent text-accent'
                  : 'border-transparent text-muted hover:text-foreground'
              }`}
            >
              Reviews
            </button>
          </nav>
        </div>

        <div className="min-h-[400px]">
          {activeTab === 'events' && (
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">Hosted</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mockEventsHosted.map((evt) => (
                    <EventCard key={evt.id} {...evt} />
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">Attended</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mockEventsAttended.map((evt) => (
                    <EventCard key={evt.id} {...evt} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-4">
              {mockReviews.map((review) => (
                <div key={review.id} className="bg-card-bg border border-border rounded-2xl p-6">
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
                              className={`h-4 w-4 ${
                                i < review.rating ? 'text-warning fill-warning' : 'text-muted'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted">{review.time}</p>
                  </div>
                  <p className="text-muted">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
