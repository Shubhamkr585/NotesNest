import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

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

export const register = (data) => api.post('/auth/register', data);
export const login = (data) =>{
  console.log(data);
  return api.post('/auth/login', data);
}
export const sendForgotPasswordEmail = (email) => api.post("/auth/forgot-password", { email });
export const resetPassword = (token, password) => api.put(`/auth/reset-password/${token}`, { password });
// export const changePassword = (data) => api.post("/auth/change-password", data);
export const logout = () => api.post('/auth/logout');
export const getCurrentUser = () => api.get('/auth/current-user');
export const updateAccountDetails = (data) => api.patch('/auth/update-account', data);
export const updateAvatar = (data) => api.patch('/auth/update-avatar', data);
export const getUserByUsername = (username) => api.get(`/auth/${username}`);
export const createNote = (data) => api.post('/notes', data);
export const getNotes = (params) => api.get('/notes', { params });
export const getNoteById = (noteId) => api.get(`/notes/${noteId}`);
export const getUploadedNotes = (username) => api.get(`/notes/uploaded/${username}`);
export const createOrder = (data) => api.post('/orders', data);
export const verifyPayment = (data) => api.post('/orders/verify', data);
export const getPurchasedNotes = () => api.get('/orders/purchased');
export const viewNote = (noteId) => api.get(`/views/${noteId}`);