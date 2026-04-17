import api from './axios';

export type NotificationFilter = 'ALL' | 'UNREAD' | 'REQUESTS' | 'UPDATES';

export type NotificationActivityType =
  | 'JOIN_REQUEST_CREATED'
  | 'JOIN_REQUEST_APPROVED'
  | 'HANGOUT_UPDATED'
  | 'HANGOUT_CANCELLED';

export interface NotificationEventRef {
  id?: number;
  title?: string;
}

export interface NotificationActorRef {
  id?: number;
  name?: string;
  selfie?: string | null;
}

export interface AppNotification {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  event?: NotificationEventRef;
  actor?: NotificationActorRef;
  ctaPath?: string | null;
  metadata?: Record<string, unknown>;
}

export interface NotificationsPayload {
  notifications: AppNotification[];
  unreadCount: number;
  nextCursor?: string | null;
}

export interface GetNotificationsParams {
  filter?: NotificationFilter;
  limit?: number;
  cursor?: string;
}

export interface NotificationActivityPayload {
  type: NotificationActivityType;
  eventId: number;
  eventTitle?: string;
  targetProfileId?: number;
  message?: string;
  changedFields?: string[];
  metadata?: Record<string, unknown>;
  sendEmail?: boolean;
}

type JsonObject = Record<string, unknown>;

const asObject = (value: unknown): JsonObject | undefined =>
  value && typeof value === 'object' && !Array.isArray(value) ? (value as JsonObject) : undefined;

const asString = (value: unknown): string | undefined => {
  if (typeof value === 'string') return value;
  if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  return undefined;
};

const asNumber = (value: unknown): number | undefined => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim() !== '' && !Number.isNaN(Number(value))) {
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

const fallbackTitleByType = (type: string) => {
  if (type.includes('JOIN_REQUEST') && type.includes('APPROVED')) return 'Join request approved';
  if (type.includes('JOIN_REQUEST')) return 'New join request';
  if (type.includes('CANCELLED')) return 'Hangout called off';
  if (type.includes('UPDATED')) return 'Hangout updated';
  return 'Hangout notification';
};

const fallbackMessageByType = (type: string) => {
  if (type.includes('JOIN_REQUEST') && type.includes('APPROVED'))
    return 'Your request was approved by the host.';
  if (type.includes('JOIN_REQUEST'))
    return 'Someone requested to join your hangout. Tap to review.';
  if (type.includes('CANCELLED')) return 'This hangout has been called off by the host.';
  if (type.includes('UPDATED')) return 'Details of a hangout you joined were changed.';
  return 'You have a new activity update.';
};

const normalizeNotification = (raw: unknown, index: number): AppNotification => {
  const input = asObject(raw) ?? {};

  const type = asString(input.type) || asString(input.kind) || 'GENERIC';
  const createdAtCandidate =
    asString(input.createdAt) || asString(input.timestamp) || asString(input.created_at);
  const createdAt =
    createdAtCandidate && !Number.isNaN(new Date(createdAtCandidate).getTime())
      ? createdAtCandidate
      : new Date().toISOString();

  const eventObj = asObject(input.event);
  const actorObj = asObject(input.actor);

  const eventId =
    asNumber(input.eventId) || asNumber(eventObj?.id) || asNumber(input.entityId) || undefined;
  const eventTitle =
    asString(input.eventTitle) || asString(eventObj?.title) || asString(input.contextTitle);

  const actorId = asNumber(input.actorId) || asNumber(actorObj?.id) || undefined;
  const actorName = asString(input.actorName) || asString(actorObj?.name);
  const actorSelfie = asString(input.actorSelfie) || asString(actorObj?.selfie) || undefined;

  const id =
    asString(input.id) ||
    asString(input.notificationId) ||
    `${type}-${eventId || 'event'}-${createdAt}-${index}`;

  const title = asString(input.title) || fallbackTitleByType(type);
  const message =
    asString(input.message) ||
    asString(input.body) ||
    asString(input.description) ||
    fallbackMessageByType(type);

  const readAt = asString(input.readAt) || asString(input.read_at);
  const isRead = asBoolean(input.isRead) ?? Boolean(readAt);
  const ctaPath = asString(input.ctaPath) || asString(input.url) || null;

  return {
    id,
    type,
    title,
    message,
    isRead,
    createdAt,
    event: eventId || eventTitle ? { id: eventId, title: eventTitle } : undefined,
    actor: actorId || actorName ? { id: actorId, name: actorName, selfie: actorSelfie } : undefined,
    ctaPath,
    metadata: asObject(input.metadata),
  };
};

export const listNotifications = async (
  params?: GetNotificationsParams
): Promise<NotificationsPayload> => {
  const { data } = await api.get('/notifications', { params });
  const body = asObject(data) ?? {};
  const itemsRaw = Array.isArray(body.notifications)
    ? body.notifications
    : Array.isArray(body.items)
      ? body.items
      : [];

  const notifications = itemsRaw
    .map((item, index) => normalizeNotification(item, index))
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));

  const explicitUnread =
    asNumber(body.unreadCount) ??
    asNumber(body.unread) ??
    asNumber(asObject(body.meta)?.unreadCount) ??
    asNumber(asObject(body.pagination)?.unreadCount);

  const unreadCount =
    typeof explicitUnread === 'number'
      ? explicitUnread
      : notifications.filter((notification) => !notification.isRead).length;

  return {
    notifications,
    unreadCount,
    nextCursor:
      asString(body.nextCursor) || asString(asObject(body.pagination)?.nextCursor) || null,
  };
};

export const getUnreadNotificationsCount = async (): Promise<number> => {
  const { data } = await api.get('/notifications/unread-count');
  const body = asObject(data) ?? {};
  return (
    asNumber(body.unreadCount) ??
    asNumber(body.count) ??
    asNumber(asObject(body.data)?.unreadCount) ??
    0
  );
};

export const markNotificationRead = (notificationId: string) =>
  api.patch(`/notifications/${notificationId}/read`);

export const markAllNotificationsRead = () => api.post('/notifications/read-all');

export const dispatchNotificationActivity = (payload: NotificationActivityPayload) =>
  api.post('/notifications/activities', payload);
