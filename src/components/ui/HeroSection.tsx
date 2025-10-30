"use client";

import { Search, MapPin, Calendar } from "lucide-react";
import { useState } from "react";

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="relative bg-gradient-to-br from-foreground/5 via-background to-foreground/5 py-12 md:py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Discover Amazing
            <span className="block text-foreground/80">Hangouts Near You</span>
          </h1>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Connect with like-minded people and create unforgettable memories. 
            Join events, host your own, and make every moment count.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted" />
            <input
              type="text"
              placeholder="Search for events, activities, or places..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-border bg-input pl-12 pr-4 py-4 text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-ring focus:border-accent transition-all"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
              <select className="w-full rounded-lg border border-border bg-input pl-10 pr-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-accent">
                <option>Gandhinagar, India</option>
                <option>Ahmedabad, India</option>
                <option>Mumbai, India</option>
                <option>Delhi, India</option>
              </select>
            </div>
            <div className="relative flex-1">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
              <select className="w-full rounded-lg border border-border bg-input pl-10 pr-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-accent">
                <option>Any time</option>
                <option>Today</option>
                <option>This week</option>
                <option>This month</option>
              </select>
            </div>
            <button className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors whitespace-nowrap">
              Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
