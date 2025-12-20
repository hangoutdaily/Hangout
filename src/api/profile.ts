import api from './axios';
import { ProfileData } from '@/types';

export const getProfile = () => api.get('/profile');
export const updateProfile = (data: Partial<ProfileData>) => api.patch('/profile', data);
export const createProfile = (data: Partial<ProfileData>) => api.post('/profile', data);
