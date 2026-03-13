'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Heart, PlusSquare, MessageCircle, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useScrollDirection } from '@/hooks/useScrollDirection';

const mobileNavItems = [
  { href: '/', icon: Home },
  { href: '/my-hangouts', icon: Heart },
  { href: '/create', icon: PlusSquare, isSpecial: true },
  { href: '/chats', icon: MessageCircle },
  { href: '/profile', icon: Users },
];

export default function MobileNav() {
  const pathname = usePathname();
  const scrollDirection = useScrollDirection();

  // Hide nav inside individual chat rooms (e.g. /chats/123) and onboarding flows
  const isChatRoom = /^\/chats\/\d+/.test(pathname);
  const isOnboarding = ['/login', '/signup', '/onboarding'].some((path) =>
    pathname.startsWith(path)
  );

  if (isChatRoom || isOnboarding) return null;

  return (
    <nav
      className={cn(
        'fixed left-1/2 -translate-x-1/2 w-[92%] max-w-[420px] h-18 bg-background/80 backdrop-blur-xl border border-border/40 rounded-3xl shadow-2xl z-50 md:hidden px-3 transition-[bottom] duration-300 ease-in-out',
        scrollDirection === 'down' ? '-bottom-24' : 'bottom-6'
      )}
    >
      <div className="flex justify-between items-center h-full relative">
        <AnimatePresence>
          {mobileNavItems.map(({ href, icon: Icon, isSpecial }) => {
            const isActive = pathname === href;

            if (isSpecial) {
              return (
                <Link
                  key={href}
                  href={href}
                  className="relative flex items-center justify-center w-14 h-14 bg-foreground rounded-2xl shadow-lg transition-transform active:scale-90 mx-1"
                >
                  <Icon className="h-6 w-6 text-background" />
                </Link>
              );
            }

            return (
              <Link
                key={href}
                href={href}
                className="relative flex items-center justify-center flex-1 h-full group active:scale-95"
              >
                {isActive && (
                  <motion.div
                    layoutId="bubble"
                    className="absolute inset-x-2 inset-y-3 bg-accent/10 rounded-2xl -z-10"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}

                <motion.div
                  animate={{
                    scale: isActive ? 1.2 : 1,
                    y: isActive ? -1 : 0,
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                  className={cn(
                    'relative transition-colors duration-300',
                    isActive ? 'text-accent' : 'text-muted-foreground group-hover:text-foreground'
                  )}
                >
                  <Icon className="h-5 w-5" />
                </motion.div>
              </Link>
            );
          })}
        </AnimatePresence>
      </div>
    </nav>
  );
}
