import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Include cookies for auth tokens
});

// Store pending requests to retry after token refresh
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

// Response interceptor for handling 401 errors and token refresh
api.interceptors.response.use(
  (response) => response.data, // Return response.data directly
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue requests while refreshing
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
        // Request new access token
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
        // Clear auth state and redirect to login
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    const errorResponse = error.response?.data || { message: 'An error occurred', success: false };
    throw new Error(errorResponse.message);
  }
);

// API methods
export const register = async (data) =>
  await api.post('/auth/register', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });


export const login = async (data) => 
   await api.post('/auth/login', data);

export const logout = async () => await api.post('/auth/logout');

export const getCurrentUser = async () => await api.get('/auth/current-user');

export const changePassword = async (data) => api.post('/auth/change-password', data);

export const updateAccountDetails = async (data) => api.patch('/auth/update-account', data);

export const updateAvatar = async (data) =>
  api.patch('/auth/update-avatar', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

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