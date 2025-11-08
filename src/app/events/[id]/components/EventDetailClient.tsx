'use client';

import { useState } from 'react';
import { MapPin, Calendar, Clock, Users, Heart, Share2, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface EventDetailClientProps {
  id: string;
}

export default function EventDetailClient({ id }: EventDetailClientProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'attendees' | 'chats'>('overview');
  const [isLiked, setIsLiked] = useState(false);

  const mockEvent = {
    id,
    title: 'Blackpink Concert',
    description:
      "Experience the electrifying performance of the world's biggest K-pop girl group. Get ready for an unforgettable night of music and dance!",
    location: '123 Main Street, New York',
    date: 'May 20, 2024',
    time: '8:00 PM',
    attendees: 1200,
    maxAttendees: 2000,
    category: 'Concerts',
    price: 40.23,
    priceType: 'paid',
    creator: {
      name: 'Sarah Johnson',
      avatar: 'https://i.pravatar.cc/40?img=1',
    },
  };

  const mockAttendees = [
    { id: '1', name: 'Dhruv Chauhan', avatar: 'https://i.pravatar.cc/40?img=2' },
    { id: '2', name: 'Rushil Patel', avatar: 'https://i.pravatar.cc/40?img=3' },
    { id: '3', name: 'Emma Wilson', avatar: 'https://i.pravatar.cc/40?img=4' },
    { id: '4', name: 'Mike Chen', avatar: 'https://i.pravatar.cc/40?img=5' },
  ];

  const mockChats = [
    {
      id: '1',
      user: 'Dhruv Chauhan',
      message: "Can't wait for this concert! 🎵",
      time: '2 hours ago',
    },
    {
      id: '2',
      user: 'Rushil Patel',
      message: 'Same here! First time seeing Blackpink live',
      time: '1 hour ago',
    },
  ];

  const tabs: Array<'overview' | 'attendees' | 'chats'> = ['overview', 'attendees', 'chats'];

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-50 bg-background border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-4 flex justify-between items-center">
          <Link
            href="/"
            className="flex items-center text-foreground hover:text-accent transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </Link>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsLiked(!isLiked)}
              className="p-2 rounded-full hover:bg-surface transition-colors"
            >
              <Heart
                className={`h-5 w-5 ${isLiked ? 'text-red-500 fill-red-500' : 'text-foreground'}`}
              />
            </button>
            <button className="p-2 rounded-full hover:bg-surface transition-colors">
              <Share2 className="h-5 w-5 text-foreground" />
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6">
        <h1 className="text-3xl font-bold mb-4">{mockEvent.title}</h1>

        <div className="flex items-center text-muted mb-4">
          <MapPin className="h-4 w-4 mr-2" />
          <span>{mockEvent.location}</span>
        </div>

        <div className="flex gap-6 text-sm text-muted mb-4">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            <span>{mockEvent.date}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            <span>{mockEvent.time}</span>
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-2" />
            <span>
              {mockEvent.attendees}/{mockEvent.maxAttendees} attending
            </span>
          </div>
        </div>

        <div className="border-b border-border mb-6">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? 'border-accent text-accent'
                    : 'border-transparent text-muted hover:text-foreground'
                }`}
              >
                {tab === 'overview'
                  ? 'Overview'
                  : tab === 'attendees'
                    ? 'Registered Attendees'
                    : 'Chats'}
              </button>
            ))}
          </nav>
        </div>

        {activeTab === 'overview' && (
          <div>
            <p className="text-muted mb-6">{mockEvent.description}</p>
            <button className="bg-accent text-background px-4 py-2 rounded-lg font-medium hover:bg-accent-light transition-colors">
              View on Google Maps
            </button>
          </div>
        )}

        {activeTab === 'attendees' && (
          <div className="space-y-3">
            {mockAttendees.map((a) => (
              <div key={a.id} className="flex items-center gap-3 border p-3 rounded-lg">
                <Image
                  src={a.avatar}
                  alt={a.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <p>{a.name}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'chats' && (
          <div className="space-y-3">
            {mockChats.map((chat) => (
              <div key={chat.id} className="border p-3 rounded-lg">
                <p className="font-semibold">{chat.user}</p>
                <p className="text-sm text-muted">{chat.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
