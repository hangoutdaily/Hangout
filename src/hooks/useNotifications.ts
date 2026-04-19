'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getUnreadNotificationsCount,
  listNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  NotificationFilter,
  NotificationsPayload,
} from '@/api/notifications';

export const notificationKeys = {
  all: ['notifications'] as const,
  feed: (filter: NotificationFilter, limit: number) =>
    ['notifications', 'feed', filter, limit] as const,
  unreadCount: ['notifications', 'unread-count'] as const,
};

interface UseNotificationsOptions {
  filter?: NotificationFilter;
  limit?: number;
  enabled?: boolean;
}

export const useNotifications = ({
  filter = 'ALL',
  limit = 100,
  enabled = true,
}: UseNotificationsOptions = {}) => {
  return useQuery({
    queryKey: notificationKeys.feed(filter, limit),
    queryFn: () => listNotifications({ filter, limit }),
    enabled,
    refetchInterval: 30_000,
  });
};

export const useUnreadNotificationsCount = (enabled = true) => {
  return useQuery({
    queryKey: notificationKeys.unreadCount,
    enabled,
    queryFn: async () => {
      try {
        return await getUnreadNotificationsCount();
      } catch {
        const fallback = await listNotifications({ filter: 'UNREAD', limit: 100 });
        return fallback.unreadCount;
      }
    },
    refetchInterval: 30_000,
  });
};

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) => markNotificationRead(notificationId),
    onMutate: async (notificationId) => {
      await queryClient.cancelQueries({ queryKey: notificationKeys.all });
      const snapshots = queryClient.getQueriesData<NotificationsPayload>({
        queryKey: ['notifications', 'feed'],
      });

      snapshots.forEach(([key, value]) => {
        if (!value) return;
        queryClient.setQueryData<NotificationsPayload>(key, {
          ...value,
          notifications: value.notifications.map((notification) =>
            notification.id === notificationId ? { ...notification, isRead: true } : notification
          ),
          unreadCount: Math.max(
            0,
            value.notifications.reduce(
              (count, notification) =>
                count + (notification.id === notificationId || notification.isRead ? 0 : 1),
              0
            )
          ),
        });
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
};

export const useMarkAllNotificationsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => markAllNotificationsRead(),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: notificationKeys.all });
      const snapshots = queryClient.getQueriesData<NotificationsPayload>({
        queryKey: ['notifications', 'feed'],
      });

      snapshots.forEach(([key, value]) => {
        if (!value) return;
        queryClient.setQueryData<NotificationsPayload>(key, {
          ...value,
          notifications: value.notifications.map((notification) => ({
            ...notification,
            isRead: true,
          })),
          unreadCount: 0,
        });
      });
      queryClient.setQueryData<number>(notificationKeys.unreadCount, 0);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
};
