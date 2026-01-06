import api from './axios';
import { CreateEventPayload } from '@/types';

export const createEvent = (data: CreateEventPayload) => api.post('/events', data);
export const getAllEvents = (params?: {
  search?: string;
  category?: string;
  time?: string;
  date?: string;
}) => api.get('/events', { params });
export const getEvent = (id: string) => api.get(`/events/${id}`);
export const getCategories = () => api.get('/events/categories');

export const likeEvent = (id: string | number) => api.post(`/events/like/${id}`);
export const unlikeEvent = (id: string | number) => api.post(`/events/unlike/${id}`);
export const getEventLikes = (id: string | number) => api.get(`/events/likes/${id}`);
export const getMyLikes = () => api.get('/events/likes/me');

export const joinEvent = (id: string | number, message: string) =>
  api.post(`/events/join/${id}`, { message });
export const cancelJoinEvent = (id: string | number) => api.post(`/events/cancel/${id}`);
export const getMyJoinedEvents = () => api.get('/events/joined/me');

export const getEventJoinRequests = (id: string | number) => api.get(`/events/${id}/requests`);
export const approveJoinRequest = (eventId: string | number, profileId: string | number) =>
  api.post(`/events/${eventId}/requests/${profileId}/approve`);
export const rejectJoinRequest = (eventId: string | number, profileId: string | number) =>
  api.post(`/events/${eventId}/requests/${profileId}/reject`);
