'use client';

import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { MapPin, Bell, Home, Users, MessageCircle, Heart, PlusSquare, Search } from 'lucide-react';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/shadcn/avatar';

export default function Header() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const pathname = usePathname();
  const profileRef = useRef<HTMLDivElement | null>(null);

  const isHome = pathname === '/';

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    if (isProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProfileOpen]);

  const desktopNav = [
    { href: '/create', label: 'Create' },
    { href: '/chats', label: 'Chats' },
  ];

  const mobileNav = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/wishlist', label: 'Wishlist', icon: Heart },
    { href: '/create', label: 'Create', icon: PlusSquare },
    { href: '/chats', label: 'Chats', icon: MessageCircle },
    { href: '/profile', label: 'Profile', icon: Users },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-background">
      <div className="flex items-center justify-between h-14 px-4 md:hidden">
        <Link href="/" className="text-lg font-bold text-foreground">
          Hangout
        </Link>

        <div className="flex items-center text-sm font-medium text-foreground">
          <MapPin className="mr-1 h-4 w-4 text-accent" />
          Gandhinagar, India
        </div>

        <button
          aria-label="Notifications"
          className="p-2 rounded-md hover:bg-accent/10 transition"
          onClick={() => setIsProfileOpen(!isProfileOpen)}
        >
          <Bell className="h-5 w-5 text-foreground" />
        </button>
      </div>

      <div className="hidden md:flex h-16 items-center justify-between max-w-7xl mx-auto px-6 relative">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-2xl font-bold tracking-tight text-foreground">
            Hangout
          </Link>
          <div className="flex items-center text-sm text-muted">
            <MapPin className="mr-1 h-4 w-4 text-accent" />
            Gandhinagar, India
          </div>
        </div>

        <div className="flex-1 flex justify-center max-w-lg">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search Hangouts..."
              className="w-full rounded-lg border border-border bg-surface pl-10 pr-4 py-1.5 text-foreground placeholder:text-muted-foreground transition-all"
            />
          </div>
        </div>

        <div className="flex items-center gap-6 relative" ref={profileRef}>
          <nav className="flex gap-6 text-sm font-medium text-muted">
            {desktopNav.map(({ href, label }) => (
              <Link key={href} href={href} className="hover:text-foreground transition-colors">
                {label}
              </Link>
            ))}
            <Link
              href="/wishlist"
              title="Wishlist"
              className="hover:text-foreground transition-colors"
            >
              <Heart className="h-5 w-5" />
            </Link>
          </nav>

          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            aria-haspopup="menu"
            aria-expanded={isProfileOpen}
            className="relative flex items-center gap-2 p-1 rounded-lg hover:bg-accent/10 transition"
          >
            <Avatar>
              <AvatarImage src="https://i.pravatar.cc/40" />
              <AvatarFallback>User</AvatarFallback>
            </Avatar>
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 top-14 w-64 bg-popover border border-border rounded-lg shadow-md z-50 animate-in fade-in slide-in-from-top-2">
              <div className="p-4 border-b border-border flex items-center gap-3">
                <Avatar>
                  <AvatarImage src="https://i.pravatar.cc/40" />
                  <AvatarFallback>User</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-popover-foreground">User Name</p>
                  <p className="text-sm text-muted-foreground">user@example.com</p>
                </div>
              </div>
              <div className="p-4 space-y-3">
                <div>
                  <label className="text-sm font-medium text-popover-foreground mb-1 block">
                    Theme
                  </label>
                  <ThemeToggle />
                </div>
                <div className="pt-2 border-t border-border">
                  <Link
                    href="/profile"
                    onClick={() => setIsProfileOpen(false)}
                    className="block px-3 py-2 text-sm text-popover-foreground hover:bg-accent/10 rounded-md transition"
                  >
                    View Profile
                  </Link>
                  <button className="block w-full text-left px-3 py-2 text-sm text-popover-foreground hover:bg-accent/10 rounded-md transition">
                    Settings
                  </button>
                  <button className="block w-full text-left px-3 py-2 text-sm text-destructive hover:bg-accent/10 rounded-md transition">
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {isHome && (
        <div className="md:hidden px-4 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search Hangouts..."
              className="w-full rounded-xl border border-border bg-surface pl-10 pr-3 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none transition-all"
            />
          </div>
        </div>
      )}

      <nav className="fixed bottom-0 left-0 right-0 border-t border-border bg-background md:hidden z-40">
        <div className="flex justify-between items-center h-16 max-w-[500px] mx-auto w-full px-2 sm:px-4">
          {mobileNav.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center justify-center flex-1 text-xs py-2 transition',
                pathname === href
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon className="h-5 w-5 mb-1 shrink-0" />
              <span className="truncate text-[11px]">{label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
