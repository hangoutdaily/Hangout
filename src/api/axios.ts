import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  withCredentials: true,
});

let refreshing = false;
let queue: any[] = [];

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      if (!refreshing) {
        refreshing = true;
        try {
          await api.post('/auth/refresh');
          refreshing = false;

          queue.forEach((cb) => cb());
          queue = [];

          return api(original);
        } catch (err) {
          refreshing = false;
          queue = [];
          return Promise.reject(err);
        }
      }

      return new Promise((resolve) => queue.push(() => resolve(api(original))));
    }

    return Promise.reject(error);
  }
);

export default api;
