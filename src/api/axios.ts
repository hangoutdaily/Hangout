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

    if (original?.url?.endsWith('/auth/refresh')) {
      return Promise.reject(error);
    }

    if (refreshPromise) {
      try {
        await refreshPromise;
        return api(original);
      } catch (err) {
        return Promise.reject(err);
      }
    }

    refreshPromise = (async () => {
      try {
        await api.post('/auth/refresh');
      } finally {
        refreshPromise = null;
      }
    })();

    try {
      await refreshPromise;
      return api(original);
    } catch (err) {
      return Promise.reject(err);
    }
  }
);

export default api;
