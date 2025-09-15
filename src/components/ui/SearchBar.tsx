"use client";

import { Search } from "lucide-react";

export default function SearchBar() {
  return (
    <div className="w-full px-4 mt-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted" />
        <input
          type="text"
          placeholder="Search for events, people, or places"
          className="w-full rounded-lg border border-border bg-surface pl-10 pr-4 py-2 text-sm text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-foreground/20"
        />
      </div>
    </div>
  );
}
