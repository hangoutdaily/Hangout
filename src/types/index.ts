export interface CreateEventPayload {
  title: string;
  description: string;
  category: string;
  city: string;
  state: string;
  addressLine: string;
  datetime: string;
  maxAttendees: number;
  priceType: string;
  geo?: { lat: number; lng: number } | null;
  photos?: string[];
}

export interface HostedEvent {
  id: number;
  title: string;
  description: string;
  city: string;
  addressLine: string;
  datetime: string;
  maxAttendees: number;
  category: string;
  priceType: 'FREE' | 'SPLIT_BILL';
  status?: 'UPCOMING' | 'COMPLETED' | 'CANCELLED';
  host: {
    name: string | null;
    selfie: string | null;
  };
  _count: {
    attendees: number;
  };
}

export interface ProfileData {
  id: number;
  displayId: string;
  name: string;
  age: number | string;
  gender: string;
  education: string;
  lifeEngagement: string;
  city: string;
  languages: string[];
  bio: string;
  lookingFor: string;
  traits: string[];
  interests: string[];
  topSongs: string;
  topPlaces: string;
  joyfulMoment: string;
  drinks: string;
  smoke: string;
  weed: string;
  photos: string[];
  selfie: string;
  socialLinks: Record<string, string>;
  createdEvents: HostedEvent[];
}

export interface User {
  id: number;
  email: string;
  phone?: string;
  profileId?: number;
  active?: boolean;
  profile?: {
    id: number;
    name?: string;
    selfie?: string;
    photos?: string[];
    city?: string;
  };
}

export interface ApiError {
  response?: {
    data?: {
      error?: string;
    };
  };
}

export interface ChatRoomCard {
  eventId: number;
  eventTitle: string;
  eventDatetime: string;
  eventPhoto: string | null;
  eventStatus: 'UPCOMING' | 'COMPLETED' | 'CANCELLED';
  memberCount: number;
  roomStatus: 'ACTIVE' | 'ARCHIVED';
  isRemoved: boolean;
  lastMessage: {
    content: string;
    senderName: string | null;
    createdAt: string;
  } | null;
}

export interface ChatMessage {
  id: number;
  chatRoomId: number;
  senderId: number;
  content: string;
  createdAt: string;
  sender: {
    id: number;
    name: string | null;
    selfie: string | null;
  };
}
