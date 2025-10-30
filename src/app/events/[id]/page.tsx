"use client";

import { useState } from "react";
import { MapPin, Calendar, Clock, Users, Heart, Share2, ArrowLeft, Tag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type EventDetailProps = {
  params: {
    id: string;
  };
};

const mockEvent = {
  id: "1",
  title: "Blackpink Concert",
  description: "Experience the electrifying performance of the world's biggest K-pop girl group. Get ready for an unforgettable night of music and dance! This concert promises to be one of the most spectacular events of the year with amazing stage production, incredible choreography, and all your favorite Blackpink hits performed live.",
  location: "123 Main Street, New York",
  date: "May 20, 2024",
  time: "8:00 PM",
  attendees: 1200,
  maxAttendees: 2000,
  category: "Concerts",
  price: 40.23,
  priceType: "paid",
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
};

const mockAttendees = [
  { id: "1", name: "Dhruv Chauhan", avatar: "https://i.pravatar.cc/40?img=2", status: "attending" },
  { id: "2", name: "Rushil Patel", avatar: "https://i.pravatar.cc/40?img=3", status: "attending" },
  { id: "3", name: "Emma Wilson", avatar: "https://i.pravatar.cc/40?img=4", status: "attending" },
  { id: "4", name: "Mike Chen", avatar: "https://i.pravatar.cc/40?img=5", status: "attending" },
  { id: "5", name: "Lisa Rodriguez", avatar: "https://i.pravatar.cc/40?img=6", status: "attending" },
  { id: "6", name: "David Park", avatar: "https://i.pravatar.cc/40?img=7", status: "attending" },
  { id: "7", name: "Alex Kumar", avatar: "https://i.pravatar.cc/40?img=8", status: "attending" },
  { id: "8", name: "Sarah Johnson", avatar: "https://i.pravatar.cc/40?img=9", status: "attending" }
];

const mockChats = [
  { id: "1", user: "Dhruv Chauhan", message: "Can't wait for this concert! 🎵", time: "2 hours ago" },
  { id: "2", user: "Rushil Patel", message: "Same here! First time seeing Blackpink live", time: "1 hour ago" },
  { id: "3", user: "Emma Wilson", message: "Anyone know what time doors open?", time: "45 min ago" },
  { id: "4", user: "Mike Chen", message: "Doors open at 7 PM according to the venue", time: "30 min ago" }
];

export default function EventDetail({ params }: EventDetailProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "attendees" | "chats">("overview");
  const [isLiked, setIsLiked] = useState(false);

  const formatPrice = () => {
    if (mockEvent.priceType === "free") return "Free";
    if (mockEvent.priceType === "split") return "Split";
    return `$${mockEvent.price}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-50 bg-background border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center text-foreground hover:text-accent transition-colors">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Events
            </Link>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className="p-2 rounded-full hover:bg-surface transition-colors"
              >
                <Heart className={`h-5 w-5 ${isLiked ? 'text-red-500 fill-red-500' : 'text-foreground'}`} />
              </button>
              <button className="p-2 rounded-full hover:bg-surface transition-colors">
                <Share2 className="h-5 w-5 text-foreground" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-accent/10 to-accent/5 rounded-2xl p-8 mb-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/20 flex items-center justify-center">
                <Tag className="h-8 w-8 text-accent" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">{mockEvent.category}</h2>
              <p className="text-muted">Event Category</p>
            </div>

            <div className="mb-6">
              <h1 className="text-3xl font-bold text-foreground mb-2">{mockEvent.title}</h1>
              <div className="flex items-center text-muted mb-4">
                <MapPin className="h-4 w-4 mr-2" />
                <span>{mockEvent.location}</span>
              </div>
              <div className="flex items-center gap-6 text-sm text-muted mb-4">
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
                  <span>{mockEvent.attendees}/{mockEvent.maxAttendees} attending</span>
                </div>
              </div>
            </div>

            <div className="border-b border-border mb-6">
              <nav className="flex space-x-8">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "overview"
                      ? "border-accent text-accent"
                      : "border-transparent text-muted hover:text-foreground"
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab("attendees")}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "attendees"
                      ? "border-accent text-accent"
                      : "border-transparent text-muted hover:text-foreground"
                  }`}
                >
                  Registered Attendees
                </button>
                <button
                  onClick={() => setActiveTab("chats")}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "chats"
                      ? "border-accent text-accent"
                      : "border-transparent text-muted hover:text-foreground"
                  }`}
                >
                  Chats
                </button>
              </nav>
            </div>

            <div className="min-h-[400px]">
              {activeTab === "overview" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-3">Description</h3>
                    <p className="text-muted leading-relaxed">{mockEvent.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-foreground mb-2">Date</h4>
                      <p className="text-muted">{mockEvent.date}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground mb-2">Time</h4>
                      <p className="text-muted">{mockEvent.time}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground mb-2">Location</h4>
                      <p className="text-muted">{mockEvent.location}</p>
                    </div>
                    <div>
                      <button className="bg-accent text-background px-4 py-2 rounded-lg font-medium hover:bg-accent-light transition-colors">
                        Google Maps
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "attendees" && (
                <div className="space-y-4">
                  {mockAttendees.map((attendee) => (
                    <div key={attendee.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                          <Image
                            src={attendee.avatar}
                            alt={attendee.name}
                            width={40}
                            height={40}
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{attendee.name}</p>
                          <p className="text-sm text-muted">lil about them</p>
                        </div>
                      </div>
                      <div className="w-4 h-4 rounded-full border-2 border-accent"></div>
                    </div>
                  ))}
                  <button className="w-full text-center py-2 text-accent hover:text-accent-light transition-colors">
                    More...
                  </button>
                </div>
              )}

              {activeTab === "chats" && (
                <div className="space-y-4">
                  {mockChats.map((chat) => (
                    <div key={chat.id} className="p-4 border border-border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-foreground">{chat.user}</p>
                        <p className="text-sm text-muted">{chat.time}</p>
                      </div>
                      <p className="text-muted">{chat.message}</p>
                    </div>
                  ))}
                  <div className="mt-6">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                      />
                      <button className="bg-accent text-background px-6 py-2 rounded-lg font-medium hover:bg-accent-light transition-colors">
                        Send
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-card-bg border border-border rounded-2xl p-6 mb-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-foreground mb-2">{formatPrice()}</div>
                  <button className="w-full bg-accent text-background py-3 px-4 rounded-lg font-semibold hover:bg-accent-light transition-colors mb-4">
                    Register
                  </button>
                  <div className="text-sm text-muted">
                    <div className="flex items-center justify-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>location</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-card-bg border border-border rounded-2xl p-6">
                <h3 className="font-semibold text-foreground mb-4">Event Creator</h3>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
                    <Image
                      src={mockEvent.creator.avatar}
                      alt={mockEvent.creator.name}
                      width={48}
                      height={48}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{mockEvent.creator.name}</p>
                    <p className="text-sm text-muted">Event Organizer</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
