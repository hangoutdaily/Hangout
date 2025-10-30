"use client";

import { useState } from "react";
import EventCard from "@/components/ui/EventCard";
import { MapPin, Edit, Star, MessageCircle, Heart, Share2, Settings } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const mockUser = {
  name: "Dhruv Patel",
  bio: "Passionate about technology and community building. Love organizing events and meeting new people!",
  location: "Gandhinagar, India",
  avatar: "https://i.pravatar.cc/150?img=1",
  coverPhoto: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=300&fit=crop",
  socialMedia: [
    { platform: "Twitter", url: "#" },
    { platform: "Instagram", url: "#" },
    { platform: "LinkedIn", url: "#" },
    { platform: "GitHub", url: "#" }
  ]
};

const mockPhotos = [
  {
    id: "1",
    type: "image",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
    title: "Amazing concert last night!",
    likes: 24,
    comments: 8
  },
  {
    id: "2",
    type: "image",
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop",
    title: "Coffee meetup was fantastic",
    likes: 12,
    comments: 5
  },
  {
    id: "3",
    type: "text",
    content: "Just finished organizing the tech talk event. Great turnout!",
    likes: 18,
    comments: 3
  },
  {
    id: "4",
    type: "image",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop",
    title: "Morning yoga session",
    likes: 15,
    comments: 7
  },
  {
    id: "5",
    type: "image",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop",
    title: "AI workshop was incredible",
    likes: 32,
    comments: 12
  },
  {
    id: "6",
    type: "text",
    content: "Looking forward to the next community event!",
    likes: 8,
    comments: 2
  }
];

const mockEventsHosted = [
  {
    id: "h1",
    title: "Community Coding Night",
    description: "Pair programming and pizza. Bring your laptop!",
    location: "Tech Hub, Gandhinagar",
    date: "Jan 12",
    time: "7:00 PM",
    attendees: 18,
    maxAttendees: 30,
    image: null as any,
    category: "Technology",
    price: 0,
    priceType: "free" as const,
    creator: { name: "Dhruv Patel", avatar: "https://i.pravatar.cc/40?img=1" },
    attendeeAvatars: ["https://i.pravatar.cc/40?img=2","https://i.pravatar.cc/40?img=3","https://i.pravatar.cc/40?img=4"]
  }
];

const mockEventsAttended = [
  {
    id: "a1",
    title: "Blackpink Concert",
    description: "Unforgettable night of music and dance!",
    location: "NYC Arena",
    date: "May 20",
    time: "8:00 PM",
    attendees: 1200,
    maxAttendees: 2000,
    image: undefined as any,
    category: "Concerts",
    price: 40.23,
    priceType: "paid" as const,
    creator: { name: "Sarah Johnson", avatar: "https://i.pravatar.cc/40?img=5" },
    attendeeAvatars: ["https://i.pravatar.cc/40?img=6","https://i.pravatar.cc/40?img=7","https://i.pravatar.cc/40?img=8"]
  }
];

const mockReviews = [
  {
    id: "1",
    reviewer: "Rushil Patel",
    avatar: "https://i.pravatar.cc/40?img=2",
    rating: 5,
    comment: "Dhruv organized an amazing tech meetup. Great speaker and excellent venue!",
    time: "1 day ago"
  },
  {
    id: "2",
    reviewer: "Emma Wilson",
    avatar: "https://i.pravatar.cc/40?img=3",
    rating: 5,
    comment: "Very professional and friendly. The event was well-structured and engaging.",
    time: "3 days ago"
  },
  {
    id: "3",
    reviewer: "Mike Chen",
    avatar: "https://i.pravatar.cc/40?img=4",
    rating: 4,
    comment: "Good event organizer. Would attend more events by Dhruv.",
    time: "1 week ago"
  }
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<"photos" | "events" | "reviews">("photos");

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-50 bg-background border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-foreground">Profile Page</h1>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-full hover:bg-surface transition-colors">
                <Settings className="h-5 w-5 text-foreground" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="relative mb-8">
          <div className="relative h-48 md:h-64 rounded-2xl overflow-hidden">
            <Image
              src={mockUser.coverPhoto}
              alt="Cover photo"
              fill
              className="object-cover"
            />
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

            <div className="flex gap-2">
              {mockUser.socialMedia.map((social, index) => (
                <button
                  key={index}
                  className="w-8 h-8 bg-surface border border-border rounded flex items-center justify-center hover:bg-accent hover:text-background transition-colors"
                >
                  <span className="text-xs font-medium">{social.platform[0]}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="border-b border-border mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab("photos")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "photos"
                  ? "border-accent text-accent"
                  : "border-transparent text-muted hover:text-foreground"
              }`}
            >
              Photos
            </button>
            <button
              onClick={() => setActiveTab("events")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "events"
                  ? "border-accent text-accent"
                  : "border-transparent text-muted hover:text-foreground"
              }`}
            >
              Events
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "reviews"
                  ? "border-accent text-accent"
                  : "border-transparent text-muted hover:text-foreground"
              }`}
            >
              Reviews
            </button>
          </nav>
        </div>

        <div className="min-h-[400px]">
          {activeTab === "photos" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockPhotos.map((post) => (
                <div key={post.id} className="bg-card-bg border border-border rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
                  {post.type === "image" ? (
                    <div className="relative h-48">
                      <Image
                        src={post.image as string}
                        alt={String((post as any).title ?? 'Photo')}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="p-4">
                      <p className="text-foreground">{post.content}</p>
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-medium text-foreground mb-2">{post.title}</h3>
                    <div className="flex items-center justify-between text-sm text-muted">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Heart className="h-4 w-4" />
                          <span>{post.likes}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="h-4 w-4" />
                          <span>{post.comments}</span>
                        </div>
                      </div>
                      <button className="p-1 hover:bg-surface rounded">
                        <Share2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "events" && (
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">Hosted</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mockEventsHosted.map(evt => (
                    <EventCard key={evt.id} {...evt} />
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">Attended</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mockEventsAttended.map(evt => (
                    <EventCard key={evt.id} {...evt} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
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
                                i < review.rating ? "text-warning fill-warning" : "text-muted"
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

        {activeTab === "photos" && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-foreground mb-4">Questions</h3>
            <div className="bg-card-bg border border-border rounded-2xl p-6">
              <p className="text-muted text-center">No questions yet. Be the first to ask!</p>
            </div>
          </div>
        )}
      </div>

      <nav className="fixed bottom-0 left-0 right-0 border-t border-border bg-background md:hidden z-40">
        <div className="relative flex justify-around items-center h-16">
          <Link href="/" className="flex flex-col items-center text-xs text-muted hover:text-foreground transition-colors py-2">
            <div className="w-6 h-6 rounded-full border-2 border-foreground mb-1"></div>
            Home
          </Link>
          <Link href="/create" className="flex flex-col items-center text-xs text-muted hover:text-foreground transition-colors py-2">
            <div className="w-6 h-6 rounded-full border-2 border-foreground mb-1"></div>
            Create
          </Link>
          <Link href="/profile" className="flex flex-col items-center text-xs text-foreground transition-colors py-2">
            <div className="w-6 h-6 rounded-full border-2 border-accent bg-accent mb-1"></div>
            My Space
          </Link>
          <Link href="/chats" className="flex flex-col items-center text-xs text-muted hover:text-foreground transition-colors py-2">
            <div className="w-6 h-6 rounded-full border-2 border-foreground mb-1"></div>
            Chats
          </Link>
        </div>
      </nav>
    </div>
  );
}
