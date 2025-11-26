import api from './axios';

export const createEvent = (data: any) => api.post('/events', data);
export const getAllEvents = () => api.get('/events');
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
