// File: src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { getCurrentUser, logout as apiLogout } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    if (!document.cookie.includes('refreshToken')) {
      setIsAuthenticated(false);
      setUser(null);
      setLoading(false);
      return false;
    }
    try {
      const res = await getCurrentUser();
      setIsAuthenticated(true);
      setUser(res.data);
      return true;
    } catch (err) {
      setIsAuthenticated(false);
      setUser(null);
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = (response) => {
    setIsAuthenticated(true);
    setUser(response.user);
    setLoading(false);
  };

  const logout = async () => {
    try {
      await apiLogout();
      setIsAuthenticated(false);
      setUser(null);
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, loading, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};