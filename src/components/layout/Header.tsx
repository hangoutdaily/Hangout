"use client";

import { MapPin, Bell, Home, Users, Plus, MessageCircle, User } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import SearchBar from "../ui/SearchBar";
import CategoryFilters from "../ui/CategoryFilters";

export default function Header() {
  return (
    <header className="w-full border-b border-border bg-background">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-14 items-center justify-between md:hidden">
          <Avatar src="https://i.pravatar.cc/40" alt="User" size="sm" />
          <div className="flex items-center text-sm font-medium text-foreground">
            <MapPin className="mr-1 h-4 w-4" />
            Gandhinagar, India
          </div>
          <button className="p-2 rounded-md hover:bg-surface transition-colors">
            <Bell className="h-5 w-5 text-foreground" />
          </button>
        </div>
        <div className="md:hidden">
          <SearchBar />
          <CategoryFilters />
        </div>
        <div className="hidden md:flex h-14 items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-lg font-semibold tracking-tight text-foreground">Hangout</span>
            <div className="flex items-center text-sm text-muted">
              <MapPin className="mr-1 h-4 w-4" />
              Gandhinagar, India
            </div>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="relative w-full max-w-md">
              <input
                type="text"
                placeholder="Search hangouts..."
                className="w-full rounded-md border border-border bg-surface px-4 py-2 text-sm text-foreground placeholder-muted focus:border-foreground focus:ring-0 focus:outline-none transition-colors"
              />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <nav className="flex gap-6 text-sm font-medium text-muted">
              <a href="#" className="hover:text-foreground transition-colors">Create</a>
              <a href="#" className="hover:text-foreground transition-colors">My Space</a>
              <a href="#" className="hover:text-foreground transition-colors">Chats</a>
            </nav>
            <Avatar src="https://i.pravatar.cc/40" alt="User" size="sm" />
          </div>
        </div>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 border-t border-border bg-background md:hidden">
        <div className="relative flex justify-around items-center h-14">
          <a href="#" className="flex flex-col items-center text-xs text-muted hover:text-foreground transition-colors">
            <Home className="h-5 w-5 mb-1" />
            Home
          </a>
          <a href="#" className="flex flex-col items-center text-xs text-muted hover:text-foreground transition-colors">
            <Users className="h-5 w-5 mb-1" />
            Spaces
          </a>
          <button className="absolute -top-6 flex h-12 w-12 items-center justify-center rounded-full bg-foreground text-background shadow-lg transition-transform active:scale-95">
            <Plus className="h-6 w-6" />
          </button>
          <a href="#" className="flex flex-col items-center text-xs text-muted hover:text-foreground transition-colors">
            <MessageCircle className="h-5 w-5 mb-1" />
            Chats
          </a>
          <a href="#" className="flex flex-col items-center text-xs text-muted hover:text-foreground transition-colors">
            <User className="h-5 w-5 mb-1" />
            Me
          </a>
        </div>
      </nav>
    </header>
  );
}
