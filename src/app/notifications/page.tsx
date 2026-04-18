'use client';

import { useContext, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import { format, formatDistanceToNow, isToday, isYesterday } from 'date-fns';
import { BellRing, CheckCheck, RefreshCcw, UserPlus, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/shadcn/button';
import { EmptyState } from '@/components/ui/EmptyState';
import { cn } from '@/lib/utils';
import { AuthContext } from '@/context/AuthContext';
import { AppNotification, NotificationFilter } from '@/api/notifications';
import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotifications,
  useUnreadNotificationsCount,
} from '@/hooks/useNotifications';

const filters: { label: string; value: NotificationFilter }[] = [
  { label: 'All activity', value: 'ALL' },
  { label: 'Unread', value: 'UNREAD' },
  { label: 'Requests', value: 'REQUESTS' },
  { label: 'Updates', value: 'UPDATES' },
];

function getNotificationVisual(type: string) {
  if (type.includes('JOIN_REQUEST') && type.includes('APPROVED')) {
    return {
      Icon: CheckCheck,
      iconClass: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
      label: 'Approval',
    };
  }
  if (type.includes('JOIN_REQUEST')) {
    return {
      Icon: UserPlus,
      iconClass: 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
      label: 'Request',
    };
  }
  if (type.includes('CANCELLED')) {
    return {
      Icon: XCircle,
      iconClass: 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300',
      label: 'Cancelled',
    };
  }
  if (type.includes('UPDATED')) {
    return {
      Icon: RefreshCcw,
      iconClass: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
      label: 'Update',
    };
  }
  return {
    Icon: BellRing,
    iconClass: 'bg-muted text-muted-foreground',
    label: 'Activity',
  };
}

function getSectionLabel(dateLike: string) {
  const value = new Date(dateLike);
  if (Number.isNaN(value.getTime())) return 'Recent';
  if (isToday(value)) return 'Today';
  if (isYesterday(value)) return 'Yesterday';
  return format(value, 'dd MMM yyyy');
}

function getRelativeTime(dateLike: string) {
  const value = new Date(dateLike);
  if (Number.isNaN(value.getTime())) return 'just now';
  return formatDistanceToNow(value, { addSuffix: true });
}

const listVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 6 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2, ease: 'easeOut' } },
  exit: { opacity: 0, x: -6, transition: { duration: 0.15, ease: 'easeIn' } },
};

export default function NotificationsPage() {
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<NotificationFilter>('ALL');

  const { data, isLoading } = useNotifications({
    filter: activeFilter,
    enabled: Boolean(user),
  });
  const { data: unreadCount = 0 } = useUnreadNotificationsCount(Boolean(user));
  const markReadMutation = useMarkNotificationRead();
  const markAllMutation = useMarkAllNotificationsRead();

  const groupedNotifications = useMemo(() => {
    const groups = new Map<string, AppNotification[]>();
    (data?.notifications || []).forEach((notification) => {
      const key = getSectionLabel(notification.createdAt);
      const list = groups.get(key) || [];
      groups.set(key, [...list, notification]);
    });
    return Array.from(groups.entries());
  }, [data]);

  const handleMarkAllRead = () => {
    if (!data?.unreadCount) return;
    markAllMutation.mutate();
  };

  const handleNotificationClick = (notificationId: string, ctaPath?: string | null) => {
    markReadMutation.mutate(notificationId);
    if (ctaPath) router.push(ctaPath);
  };

  if (!user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <EmptyState
          illustrationSrc="/assets/illustrations/no-login.png"
          title="Sign in to view notifications"
          description="Join requests, approvals, and hangout changes will appear here."
          showSignIn
          className="w-full max-w-md my-0"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 md:px-6 pt-8 pb-24 space-y-5">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="flex items-center justify-between"
        >
          <h1 className="text-2xl font-medium tracking-tight">Notifications</h1>
          <div className="flex items-center gap-2">
            <AnimatePresence>
              {unreadCount > 0 && (
                <motion.span
                  key="badge"
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  transition={{ duration: 0.15 }}
                  className="inline-flex items-center rounded-full bg-foreground text-background px-2.5 py-0.5 text-[11px] font-medium"
                >
                  {unreadCount} unread
                </motion.span>
              )}
            </AnimatePresence>
            <button
              onClick={handleMarkAllRead}
              disabled={markAllMutation.isPending || unreadCount === 0}
              className={cn(
                'text-xs font-medium px-3 py-1.5 rounded-full border border-border transition-all duration-150',
                'text-muted-foreground hover:text-foreground hover:border-foreground/30',
                'disabled:opacity-40 disabled:cursor-not-allowed'
              )}
            >
              Mark all read
            </button>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.04, ease: 'easeOut' }}
          className="flex gap-2 mb-2 overflow-x-auto pb-2 scrollbar-hide"
        >
          {filters.map((filter) => (
            <Button
              key={filter.value}
              onClick={() => setActiveFilter(filter.value)}
              variant={activeFilter === filter.value ? 'default' : 'outline'}
              className={cn(
                'rounded-full whitespace-nowrap transition-all duration-200',
                activeFilter !== filter.value && 'border-border hover:border-foreground/30'
              )}
            >
              {filter.label}
            </Button>
          ))}
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="rounded-xl border border-border overflow-hidden divide-y divide-border"
            >
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-start gap-3 p-4 bg-card animate-pulse">
                  <div className="h-8 w-8 rounded-lg bg-muted flex-shrink-0 mt-0.5" />
                  <div className="space-y-2 flex-1 py-0.5">
                    <div className="h-3 w-28 bg-muted rounded-full" />
                    <div className="h-2.5 w-3/4 bg-muted/70 rounded-full" />
                    <div className="h-2 w-1/3 bg-muted/50 rounded-full mt-1" />
                  </div>
                </div>
              ))}
            </motion.div>
          ) : (data?.notifications?.length || 0) === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="px-4"
            >
              <EmptyState
                illustrationSrc="/assets/illustrations/no-notifications.png"
                title="All quiet for now."
                description="Jump into a hangout or make a move. This space wakes up when you do."
                action={{ href: '/', label: 'Explore Hangouts' }}
                className="my-2"
              />
            </motion.div>
          ) : (
            <motion.div
              key={activeFilter}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="space-y-5"
            >
              {groupedNotifications.map(([groupLabel, notifications]) => (
                <section key={groupLabel} className="space-y-1.5">
                  <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground/70 px-0.5">
                    {groupLabel}
                  </p>

                  <motion.div
                    variants={listVariants}
                    initial="hidden"
                    animate="visible"
                    className="rounded-xl border border-border overflow-hidden divide-y divide-border"
                  >
                    <AnimatePresence>
                      {notifications.map((notification) => {
                        const { Icon, iconClass, label } = getNotificationVisual(notification.type);
                        const ctaPath =
                          notification.ctaPath ||
                          (notification.event?.id ? `/events/${notification.event.id}` : null);

                        return (
                          <motion.button
                            key={notification.id}
                            variants={itemVariants}
                            exit="exit"
                            layout
                            onClick={() => handleNotificationClick(notification.id, ctaPath)}
                            className={cn(
                              'w-full text-left flex items-start gap-3 px-4 py-3.5 transition-colors duration-100',
                              'bg-card hover:bg-muted/40 relative',
                              !notification.isRead && 'bg-card'
                            )}
                          >
                            {/* Unread accent bar */}
                            <AnimatePresence>
                              {!notification.isRead && (
                                <motion.span
                                  key="bar"
                                  initial={{ scaleY: 0 }}
                                  animate={{ scaleY: 1 }}
                                  exit={{ scaleY: 0, opacity: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="absolute left-0 top-0 bottom-0 w-0.5 bg-foreground origin-top"
                                />
                              )}
                            </AnimatePresence>

                            {/* Icon */}
                            <div
                              className={cn(
                                'h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5',
                                iconClass
                              )}
                            >
                              <Icon className="h-3.5 w-3.5" />
                            </div>

                            {/* Body */}
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-foreground truncate">
                                {notification.title}
                              </p>
                              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed">
                                {notification.message}
                              </p>
                              <div className="mt-2 flex items-center gap-1.5 text-[11px] text-muted-foreground/70">
                                <span>{label}</span>
                                <span className="w-0.5 h-0.5 rounded-full bg-muted-foreground/40 flex-shrink-0" />
                                <span>{getRelativeTime(notification.createdAt)}</span>
                                {notification.event?.title && (
                                  <>
                                    <span className="w-0.5 h-0.5 rounded-full bg-muted-foreground/40 flex-shrink-0" />
                                    <span className="truncate">{notification.event.title}</span>
                                  </>
                                )}
                              </div>
                            </div>

                            {/* Unread dot */}
                            <AnimatePresence>
                              {!notification.isRead && (
                                <motion.span
                                  key="dot"
                                  initial={{ opacity: 0, scale: 0.5 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.5 }}
                                  transition={{ duration: 0.15 }}
                                  className="w-1.5 h-1.5 rounded-full bg-foreground flex-shrink-0 mt-2"
                                />
                              )}
                            </AnimatePresence>
                          </motion.button>
                        );
                      })}
                    </AnimatePresence>
                  </motion.div>
                </section>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
