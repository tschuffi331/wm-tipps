import axios from 'axios';

// Upgrade http:// → https:// when the page itself is served over HTTPS,
// so a misconfigured VITE_API_URL secret never causes a mixed-content block.
const _rawUrl = import.meta.env.VITE_API_URL || '/api';
const API_URL =
  typeof window !== 'undefined' &&
  window.location.protocol === 'https:' &&
  _rawUrl.startsWith('http://')
    ? _rawUrl.replace(/^http:\/\//, 'https://')
    : _rawUrl;

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('wm_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('wm_token');
      localStorage.removeItem('wm_user');
      window.location.hash = '#/login';
    }
    return Promise.reject(err);
  }
);

export default api;
