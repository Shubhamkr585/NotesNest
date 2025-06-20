// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { getCurrentUser } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      if (!document.cookie.includes('refreshToken')) {
        setIsAuthenticated(false);
        return;
      }
      try {
        await getCurrentUser();
        setIsAuthenticated(true);
      } catch (err) {
        console.log('Auth check failed:', err.message);
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  const login = () => {
    // Assume login sets refreshToken cookie; update state
    setIsAuthenticated(true);
  };

  const logout = () => {
    // Clear refreshToken cookie
    document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};