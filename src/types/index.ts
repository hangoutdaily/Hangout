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
  profile?: {
    id: number;
    name?: string;
    selfie?: string;
  };
}

export interface ApiError {
  response?: {
    data?: {
      error?: string;
    };
  };
}
