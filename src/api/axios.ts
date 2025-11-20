import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  withCredentials: true,
});

let refreshPromise: Promise<void> | null = null;

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    if (!error.response || error.response.status !== 401) {
      return Promise.reject(error);
    }

    const hasRefresh = document.cookie.includes('hangout_rt=');
    if (!hasRefresh) {
      return Promise.reject(error);
    }

    if (original?.url?.endsWith('/auth/refresh')) {
      return Promise.reject(error);
    }

    if (refreshPromise) {
      await refreshPromise;
      return api(original);
    }
    refreshPromise = api.post('/auth/refresh');
    await refreshPromise;
    refreshPromise = null;
    return api(original);
  }
);

export default api;
