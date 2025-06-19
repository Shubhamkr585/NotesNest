import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Required for cookies
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (token) {
      prom.resolve(token);
    } else {
      prom.reject(error);
    }
  });
  failedQueue = [];
};
api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/auth/refresh-token') &&
      !originalRequest.url.includes('/auth/login') // Prevent loop on login
    ) {
      const hasRefreshToken = document.cookie.includes('refreshToken');
      if (!hasRefreshToken) {
        // Avoid redirect if already on login page
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        return Promise.reject(new Error('Session expired'));
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { accessToken } = await axios.post(
          `${API_URL}/auth/refresh-token`,
          {},
          { withCredentials: true }
        );

        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        processQueue(null, accessToken);
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        // Clear cookies on refresh failure
        document.cookie = 'refreshToken=; Max-Age=0; path=/';
        // Avoid redirect loop
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    const errorResponse = error.response?.data || { message: 'An error occurred', success: false };
    throw new Error(errorResponse.message);
  }
);

// Auth APIs
export const register = async (data) =>
  await api.post('/auth/register', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const login = async (data) => {
  const response = await api.post('/auth/login', data);
  api.defaults.headers.common['Authorization'] = `Bearer ${response.accessToken}`;
  return response;
};

export const logout = async () => {
  await api.post('/auth/logout');
  delete api.defaults.headers.common['Authorization'];
};

export const getCurrentUser = async () => await api.get('/auth/current-user');

export const changePassword = async (data) => api.post('/auth/change-password', data);
export const updateAccountDetails = async (data) => api.patch('/auth/update-account', data);
export const updateAvatar = async (data) =>
  api.patch('/auth/update-avatar', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

// Notes + Orders APIs
export const createNote = async (data) =>
  api.post('/notes', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const deleteNote = async (noteId) => api.delete(`/notes/${noteId}`);
export const createOrder = async (data) => api.post('/orders', data);
export const verifyPayment = async (data) => api.post('/orders/verify', data);
export const viewNote = async (noteId) => api.get(`/views/${noteId}`);
export const getPurchasedNotes = async () => api.get('/users/purchased');
export const getUploadedNotes = async () => api.get('/users/uploaded');

export default api;
