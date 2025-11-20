import api from './axios';

export const getProfile = () => api.get('/profile');
