import api from './axios';

export const createEvent = (data: any) => api.post('/events', data);
export const getAllEvents = () => api.get('/events');
export const getEvent = (id: string) => api.get(`/events/${id}`);
export const getCategories = () => api.get('/events/categories');
