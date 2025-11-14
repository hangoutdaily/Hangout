import api from './axios';

export const signup = (data: { email?: string; phone?: string; password: string }) =>
  api.post('/auth/signup', data);

export const login = (data: { email?: string; phone?: string; password: string }) =>
  api.post('/auth/login', data);

export const checkAuth = () => api.get('/auth/checkAuth');

export const logout = () => api.post('/auth/logout');
export const refresh = () => api.post('/auth/refresh');
