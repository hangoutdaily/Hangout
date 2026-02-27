import api from './axios';

export const getMyChats = () => api.get('/chats');
export const getChatMessages = (eventId: number | string, cursor?: number) =>
  api.get(`/chats/${eventId}/messages`, {
    params: cursor ? { cursor } : undefined,
  });
