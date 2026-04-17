'use client';

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { AppNotification, NotificationFilter, NotificationsPayload } from '@/api/notifications';
import { notificationKeys } from '@/hooks/useNotifications';
import { useSocket } from '@/providers/SocketProvider';

type SocketNewNotificationPayload = {
  notification?: unknown;
  unreadCount?: unknown;
};

type SocketUnreadCountPayload = {
  unreadCount?: unknown;
};

const REQUEST_TYPES = new Set(['JOIN_REQUEST_CREATED', 'JOIN_REQUEST_APPROVED']);
const UPDATE_TYPES = new Set(['HANGOUT_UPDATED', 'HANGOUT_CANCELLED']);

const asObject = (value: unknown): Record<string, unknown> | undefined =>
  value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : undefined;

const asString = (value: unknown): string | undefined => {
  if (typeof value === 'string') return value;
  if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  return undefined;
};

const asNumber = (value: unknown): number | undefined => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim() && !Number.isNaN(Number(value))) {
    return Number(value);
  }
  return undefined;
};

const asBoolean = (value: unknown): boolean | undefined => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    if (value.toLowerCase() === 'true') return true;
    if (value.toLowerCase() === 'false') return false;
  }
  return undefined;
};

const normalizeIncomingNotification = (raw: unknown): AppNotification | null => {
  const input = asObject(raw);
  if (!input) return null;

  const createdAtRaw = asString(input.createdAt) || new Date().toISOString();
  const createdAt = Number.isNaN(new Date(createdAtRaw).getTime())
    ? new Date().toISOString()
    : createdAtRaw;

  const eventObject = asObject(input.event);
  const actorObject = asObject(input.actor);

  const id = asString(input.id);
  const type = asString(input.type) || 'GENERIC';
  if (!id) return null;

  return {
    id,
    type,
    title: asString(input.title) || 'Hangout activity',
    message: asString(input.message) || 'You have a new hangout update.',
    isRead: asBoolean(input.isRead) ?? false,
    createdAt,
    ctaPath: asString(input.ctaPath) || null,
    metadata: (asObject(input.metadata) as Record<string, unknown> | undefined) || undefined,
    event: eventObject
      ? {
          id: asNumber(eventObject.id),
          title: asString(eventObject.title),
        }
      : undefined,
    actor: actorObject
      ? {
          id: asNumber(actorObject.id),
          name: asString(actorObject.name),
          selfie: asString(actorObject.selfie) || null,
        }
      : undefined,
  };
};

function shouldIncludeForFilter(filter: NotificationFilter, notification: AppNotification) {
  if (filter === 'UNREAD') return !notification.isRead;
  if (filter === 'REQUESTS') return REQUEST_TYPES.has(notification.type);
  if (filter === 'UPDATES') return UPDATE_TYPES.has(notification.type);
  return true;
}

function upsertNotification(
  notifications: AppNotification[],
  incoming: AppNotification
): AppNotification[] {
  const existingIndex = notifications.findIndex((item) => item.id === incoming.id);
  const next = [...notifications];

  if (existingIndex >= 0) {
    next[existingIndex] = { ...next[existingIndex], ...incoming };
  } else {
    next.unshift(incoming);
  }

  return next.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
}

export default function NotificationRealtimeBridge() {
  const queryClient = useQueryClient();
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = (payload: SocketNewNotificationPayload) => {
      const notification = normalizeIncomingNotification(payload?.notification);
      if (!notification) return;

      const unreadCount = asNumber(payload?.unreadCount);

      if (typeof unreadCount === 'number') {
        queryClient.setQueryData<number>(notificationKeys.unreadCount, unreadCount);
      }

      const feedCaches = queryClient.getQueriesData<NotificationsPayload>({
        queryKey: ['notifications', 'feed'],
      });

      feedCaches.forEach(([key, current]) => {
        if (!current) return;

        const keyParts = key as readonly unknown[];
        const filter = (
          typeof keyParts[2] === 'string' ? keyParts[2] : 'ALL'
        ) as NotificationFilter;

        if (!shouldIncludeForFilter(filter, notification)) {
          queryClient.setQueryData<NotificationsPayload>(key, {
            ...current,
            unreadCount:
              typeof unreadCount === 'number'
                ? unreadCount
                : Math.max(0, current.notifications.filter((item) => !item.isRead).length),
          });
          return;
        }

        const nextNotifications = upsertNotification(current.notifications, notification);

        queryClient.setQueryData<NotificationsPayload>(key, {
          ...current,
          notifications: nextNotifications,
          unreadCount:
            typeof unreadCount === 'number'
              ? unreadCount
              : Math.max(0, nextNotifications.filter((item) => !item.isRead).length),
        });
      });
    };

    const handleUnreadCount = (payload: SocketUnreadCountPayload) => {
      const unreadCount = asNumber(payload?.unreadCount);
      if (typeof unreadCount !== 'number') return;

      queryClient.setQueryData<number>(notificationKeys.unreadCount, unreadCount);

      const feedCaches = queryClient.getQueriesData<NotificationsPayload>({
        queryKey: ['notifications', 'feed'],
      });

      feedCaches.forEach(([key, current]) => {
        if (!current) return;
        queryClient.setQueryData<NotificationsPayload>(key, {
          ...current,
          unreadCount,
        });
      });
    };

    socket.on('notification:new', handleNewNotification);
    socket.on('notification:unread_count', handleUnreadCount);

    return () => {
      socket.off('notification:new', handleNewNotification);
      socket.off('notification:unread_count', handleUnreadCount);
    };
  }, [socket, queryClient]);

  return null;
}
