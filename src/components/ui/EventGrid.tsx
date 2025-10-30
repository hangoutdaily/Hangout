"use client";

import { useState } from "react";
import EventCard from "./EventCard";

const mockEvents = [
  {
    id: "1",
    title: "Blackpink Concert",
    description: "Experience the electrifying performance of the world's biggest K-pop girl group. Get ready for an unforgettable night of music and dance!",
    location: "123 Main Street, New York",
    date: "May 20",
    time: "8:00 PM",
    attendees: 1200,
    maxAttendees: 2000,
    category: "Concerts",
    price: 40.23,
    priceType: "paid" as const,
    creator: {
      name: "Sarah Johnson",
      avatar: "https://i.pravatar.cc/40?img=1"
    },
    attendeeAvatars: [
      "https://i.pravatar.cc/40?img=2",
      "https://i.pravatar.cc/40?img=3",
      "https://i.pravatar.cc/40?img=4",
      "https://i.pravatar.cc/40?img=5",
      "https://i.pravatar.cc/40?img=6"
    ]
  },
  {
    id: "2",
    title: "Weekend Brunch & Coffee Meetup",
    description: "Join us for a relaxing brunch and great conversations over coffee. Perfect way to start your weekend!",
    location: "Café Central, Gandhinagar",
    date: "Dec 15",
    time: "10:00 AM",
    attendees: 12,
    maxAttendees: 20,
    category: "Food",
    price: 0,
    priceType: "free" as const,
    creator: {
      name: "Mike Chen",
      avatar: "https://i.pravatar.cc/40?img=7"
    },
    attendeeAvatars: [
      "https://i.pravatar.cc/40?img=8",
      "https://i.pravatar.cc/40?img=9",
      "https://i.pravatar.cc/40?img=10"
    ]
  },
  {
    id: "3",
    title: "Morning Yoga in the Park",
    description: "Start your day with peaceful yoga session in the beautiful city park. All levels welcome!",
    location: "City Park, Gandhinagar",
    date: "Dec 16",
    time: "7:00 AM",
    attendees: 8,
    maxAttendees: 15,
    category: "Fitness",
    price: 0,
    priceType: "free" as const,
    creator: {
      name: "Emma Wilson",
      avatar: "https://i.pravatar.cc/40?img=11"
    },
    attendeeAvatars: [
      "https://i.pravatar.cc/40?img=12",
      "https://i.pravatar.cc/40?img=13"
    ]
  },
  {
    id: "4",
    title: "Tech Talk: Future of AI",
    description: "Interactive discussion about artificial intelligence and its impact on our daily lives.",
    location: "Tech Hub, Gandhinagar",
    date: "Dec 18",
    time: "6:00 PM",
    attendees: 25,
    maxAttendees: 50,
    category: "Education",
    price: 10,
    priceType: "split" as const,
    creator: {
      name: "Dr. Alex Kumar",
      avatar: "https://i.pravatar.cc/40?img=14"
    },
    attendeeAvatars: [
      "https://i.pravatar.cc/40?img=15",
      "https://i.pravatar.cc/40?img=16",
      "https://i.pravatar.cc/40?img=17",
      "https://i.pravatar.cc/40?img=18"
    ]
  },
  {
    id: "5",
    title: "Art Workshop: Watercolor Basics",
    description: "Learn the fundamentals of watercolor painting in a fun, creative environment. Materials provided!",
    location: "Art Studio, Gandhinagar",
    date: "Dec 20",
    time: "2:00 PM",
    attendees: 6,
    maxAttendees: 12,
    category: "Photography",
    price: 25,
    priceType: "paid" as const,
    creator: {
      name: "Lisa Rodriguez",
      avatar: "https://i.pravatar.cc/40?img=19"
    },
    attendeeAvatars: [
      "https://i.pravatar.cc/40?img=20",
      "https://i.pravatar.cc/40?img=21"
    ]
  },
  {
    id: "6",
    title: "Game Night: Board Games & Pizza",
    description: "Bring your favorite board games and enjoy pizza while playing with fellow game enthusiasts!",
    location: "Community Center, Gandhinagar",
    date: "Dec 23",
    time: "7:00 PM",
    attendees: 18,
    maxAttendees: 30,
    category: "Gaming",
    price: 12,
    priceType: "split" as const,
    creator: {
      name: "David Park",
      avatar: "https://i.pravatar.cc/40?img=22"
    },
    attendeeAvatars: [
      "https://i.pravatar.cc/40?img=23",
      "https://i.pravatar.cc/40?img=24",
      "https://i.pravatar.cc/40?img=25",
      "https://i.pravatar.cc/40?img=26"
    ]
  }
];

export default function EventGrid() {
  const [likedEvents, setLikedEvents] = useState<Set<string>>(new Set());

  const handleLike = (eventId: string) => {
    setLikedEvents(prev => {
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

  return (
    <div className="py-4">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockEvents.map((event) => (
            <EventCard
              key={event.id}
              {...event}
              isLiked={likedEvents.has(event.id)}
              onLike={() => handleLike(event.id)}
              onJoin={() => handleJoin(event.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
