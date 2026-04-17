import {
  dispatchNotificationActivity,
  NotificationActivityPayload,
  NotificationActivityType,
} from '@/api/notifications';

interface BaseActivityInput {
  eventId: number;
  eventTitle?: string;
}

interface JoinRequestInput extends BaseActivityInput {
  message?: string;
}

interface JoinApprovedInput extends BaseActivityInput {
  targetProfileId: number;
}

interface HangoutUpdatedInput extends BaseActivityInput {
  changedFields: string[];
}

const sendActivity = async (
  type: NotificationActivityType,
  data: Omit<NotificationActivityPayload, 'type' | 'sendEmail'>
) => {
  try {
    await dispatchNotificationActivity({
      ...data,
      type,
      sendEmail: true,
      metadata: {
        ...(data.metadata || {}),
        source: 'web-client',
      },
    });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`Failed to dispatch ${type} notification activity`, error);
    }
  }
};

export const notifyJoinRequestSubmitted = ({ eventId, eventTitle, message }: JoinRequestInput) => {
  void sendActivity('JOIN_REQUEST_CREATED', {
    eventId,
    eventTitle,
    message,
  });
};

export const notifyJoinRequestApproved = ({
  eventId,
  eventTitle,
  targetProfileId,
}: JoinApprovedInput) => {
  void sendActivity('JOIN_REQUEST_APPROVED', {
    eventId,
    eventTitle,
    targetProfileId,
  });
};

export const notifyHangoutUpdated = ({
  eventId,
  eventTitle,
  changedFields,
}: HangoutUpdatedInput) => {
  if (!changedFields.length) return;
  void sendActivity('HANGOUT_UPDATED', {
    eventId,
    eventTitle,
    changedFields,
    message: `Updated: ${changedFields.join(', ')}`,
  });
};

export const notifyHangoutCancelled = ({ eventId, eventTitle }: BaseActivityInput) => {
  void sendActivity('HANGOUT_CANCELLED', {
    eventId,
    eventTitle,
  });
};
