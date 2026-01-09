import { User } from '@/types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isHostOfEvent = (user: User | null, hostId?: number | null) => {
  if (!user || hostId == null) return false;

  const possibleIds = [user.profileId, user.id, user.profile?.id].filter((v) => v != null);

  return possibleIds.some((val) => Number(val) === Number(hostId));
};
