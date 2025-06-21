// src/services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const errorResponse = error.response?.data || { message: 'An error occurred', success: false };
    throw new Error(errorResponse.message);
  }
);

// Auth APIs
export const register = async (data) =>
  api.post('/auth/register', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const login = async (data) => {
  const response = await api.post('/auth/login', data);
  return response; // { user: { id, fullName } }
};

export const logout = async () => {
  await api.post('/auth/logout');
  document.cookie = 'refreshToken=; Max-Age=0; path=/';
  document.cookie = 'accessToken=; Max-Age=0; path=/';
};

export const getCurrentUser = async () => api.get('/auth/current-user');

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