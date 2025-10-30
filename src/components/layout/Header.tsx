"use client";

import { MapPin, Bell, Home, Users, Plus, MessageCircle, User, Search, Menu, X, Filter, Settings, Heart, PlusSquare } from "lucide-react";
import { useState } from "react";
import Avatar from "@/components/ui/Avatar";
import ThemeToggle from "@/components/ui/ThemeToggle";
import Link from "next/link";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <header className="w-full bg-background sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between md:hidden">
          <button className="p-2 rounded-md hover:bg-surface transition-colors">
            <Menu className="h-6 w-6 text-foreground" />
          </button>
          <div className="flex items-center text-sm font-medium text-foreground">
            <MapPin className="mr-1 h-4 w-4 text-accent" />
            Gandhinagar, India
          </div>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            aria-label="Open profile menu"
            className="p-1 rounded-full hover:bg-surface transition-colors"
          >
            <Avatar src="https://i.pravatar.cc/40" alt="User" size="sm" />
          </button>
        </div>

        {isProfileOpen && (
          <div className="md:hidden px-4">
            <div className="mt-2 w-full bg-popover border border-border rounded-lg shadow-lg z-50">
              <div className="p-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <Avatar src="https://i.pravatar.cc/40" alt="User" size="md" />
                  <div>
                    <p className="font-medium text-popover-foreground">User Name</p>
                    <p className="text-sm text-muted">user@example.com</p>
                  </div>
                </div>
              </div>
              <div className="p-4 space-y-3">
                <div>
                  <label className="text-sm font-medium text-popover-foreground mb-2 block">Theme</label>
                  <ThemeToggle />
                </div>
                <div className="pt-2 border-t border-border grid grid-cols-2 gap-2">
                  <Link href="/profile" className="px-3 py-2 text-sm text-popover-foreground hover:bg-surface rounded-lg transition-colors" onClick={() => setIsProfileOpen(false)}>
                    View Profile
                  </Link>
                  <button className="px-3 py-2 text-sm text-popover-foreground hover:bg-surface rounded-lg transition-colors">Settings</button>
                  <button className="col-span-2 px-3 py-2 text-sm text-destructive hover:bg-surface rounded-lg transition-colors">Sign Out</button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="md:hidden pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted" />
            <input
              type="text"
              placeholder="Search all events..."
              className="w-full rounded-xl border border-border bg-surface pl-10 pr-12 py-3 text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/50 transition-all"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 p-1">
              <Filter className="h-5 w-5 text-muted" />
            </button>
          </div>
        </div>

        <div className="hidden md:flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-2xl font-bold tracking-tight text-foreground">Hangout</Link>
            <div className="flex items-center text-sm text-muted">
              <MapPin className="mr-1 h-4 w-4 text-accent" />
              Gandhinagar, India
            </div>
          </div>
          
          <div className="flex-1 flex justify-center max-w-lg mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
              <input
                type="text"
                placeholder="Search all events..."
                className="w-full rounded-lg border border-border bg-surface pl-10 pr-4 py-1 text-foreground placeholder-muted focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none transition-all"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <nav className="hidden lg:flex gap-6 text-sm font-medium text-muted">
              <Link href="/create" className="hover:text-foreground transition-colors">Create</Link>
              <Link href="/profile" className="hover:text-foreground transition-colors">My Space</Link>
              <Link href="/chats" className="hover:text-foreground transition-colors">Chats</Link>
            </nav>
            <button className="p-2 rounded-md hover:bg-surface transition-colors">
              <Bell className="h-5 w-5 text-foreground" />
            </button>
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 p-1 rounded-lg hover:bg-surface transition-colors"
              >
                <Avatar src="https://i.pravatar.cc/40" alt="User" size="sm" />
                <Settings className="h-4 w-4 text-muted" />
              </button>
              
              {isProfileOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-popover border border-border rounded-lg shadow-lg z-50">
                  <div className="p-4 border-b border-border">
                    <div className="flex items-center gap-3">
                      <Avatar src="https://i.pravatar.cc/40" alt="User" size="md" />
                      <div>
                        <p className="font-medium text-popover-foreground">User Name</p>
                        <p className="text-sm text-muted">user@example.com</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 space-y-3">
                    <div>
                      <label className="text-sm font-medium text-popover-foreground mb-2 block">
                        Theme
                      </label>
                      <ThemeToggle />
                    </div>
                    <div className="pt-2 border-t border-border">
                      <Link 
                        href="/profile" 
                        className="block w-full text-left px-3 py-2 text-sm text-popover-foreground hover:bg-surface rounded-lg transition-colors"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        View Profile
                      </Link>
                      <button className="block w-full text-left px-3 py-2 text-sm text-popover-foreground hover:bg-surface rounded-lg transition-colors">
                        Settings
                      </button>
                      <button className="block w-full text-left px-3 py-2 text-sm text-destructive hover:bg-surface rounded-lg transition-colors">
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 border-t border-border bg-background md:hidden z-40">
        <div className="relative flex justify-around items-center h-16">
          <Link href="/" className="flex flex-col items-center text-xs text-muted hover:text-foreground transition-colors py-2">
            <Home className="h-5 w-5 mb-1" />
            Home
          </Link>
          <Link href="/" className="flex flex-col items-center text-xs text-muted hover:text-foreground transition-colors py-2">
            <Heart className="h-5 w-5 mb-1" />
            Wishlist
          </Link>
          <Link href="/" className="flex flex-col items-center text-xs text-muted hover:text-foreground transition-colors py-2">
            <PlusSquare className="h-5 w-5 mb-1" />
            Create
          </Link>
          <Link href="/chats" className="flex flex-col items-center text-xs text-muted hover:text-foreground transition-colors py-2">
            <MessageCircle className="h-5 w-5 mb-1" />
            Chats
          </Link>
          <Link href="/profile" className="flex flex-col items-center text-xs text-muted hover:text-foreground transition-colors py-2">
            <Users className="h-5 w-5 mb-1" />
            Profile
          </Link>
        </div>
      </nav>
    </header>
  );
}
