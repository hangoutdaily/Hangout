import axios from 'axios';

const adminApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  withCredentials: true,
});

const ADMIN_TOKEN_KEY = 'adminAccessToken';

adminApi.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? sessionStorage.getItem(ADMIN_TOKEN_KEY) : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export type AdminLoginPayload = {
  email: string;
  password: string;
};

export type AdminUserRow = {
  id: number;
  email: string | null;
  phone: string | null;
  verified: boolean;
  active: boolean;
  createdAt: string;
  profile: {
    id: number;
    name: string | null;
    displayId: string | null;
    selfie: string | null;
    photos: string[];
    city: string | null;
  } | null;
};

export type AdminHangoutRow = {
  id: number;
  title: string;
  isOpen: boolean;
  status: 'UPCOMING' | 'COMPLETED' | 'CANCELLED';
  datetime: string;
  createdAt: string;
  host: {
    id: number;
    name: string | null;
    displayId: string | null;
  };
  _count: {
    attendees: number;
  };
};

export const adminTokenKey = ADMIN_TOKEN_KEY;

export const adminLogin = (payload: AdminLoginPayload) => adminApi.post('/admin/login', payload);
export const getAdminSession = () => adminApi.get('/admin/me');

export const getAdminUsers = () => adminApi.get('/admin/users');
export const updateAdminUserStatus = (userId: number, active: boolean) =>
  adminApi.patch(`/admin/users/${userId}/status`, { active });

export const getAdminHangouts = () => adminApi.get('/admin/hangouts');
export const updateAdminHangoutStatus = (hangoutId: number, isOpen: boolean) =>
  adminApi.patch(`/admin/hangouts/${hangoutId}/status`, { isOpen });
