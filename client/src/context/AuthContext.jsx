import React, { createContext, useState, useEffect, useContext } from 'react';
import { getCurrentUser, logout as apiLogout } from '../services/api';
import Spinner from '../components/common/Spinner';

export const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refetchUser = async () => {
    setLoading(true);
    try {
      const response = await getCurrentUser();
      setUser(response.data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetchUser();
  }, []);

  const logout = async () => {
    try {
      await apiLogout();
      setUser(null);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };
  
  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    refetchUser,
    logout,
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gray-900">
        <Spinner />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};