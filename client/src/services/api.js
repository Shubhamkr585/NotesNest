import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL  ;

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

export const register = async (data) => api.post('/auth/register', data);
export const login = async (data) => api.post('/auth/login', data);
export const logout = async () => api.post('/auth/logout');
export const getCurrentUser = async () => api.get('/auth/current-user');
export const updateAccountDetails = async (data) => api.patch('/auth/update-account', data);
export const updateAvatar = async (data) => api.patch('/auth/update-avatar', data);
export const getUserByUsername = async (username) => api.get(`/auth/${username}`);
export const createNote = async (data) => api.post('/notes', data);
export const getNotes = async (params) => api.get('/notes', { params });
export const getNoteById = async (noteId) => api.get(`/notes/${noteId}`);
export const getUploadedNotes = async (username) => api.get(`/notes/uploaded/${username}`);
export const createOrder = async (data) => api.post('/orders', data);
export const verifyPayment = async (data) => api.post('/orders/verify', data);
export const getPurchasedNotes = async () => api.get('/orders/purchased');
export const viewNote = async (noteId) => api.get(`/views/${noteId}`);