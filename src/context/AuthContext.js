import React, { createContext, useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosConfig';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'));
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refreshToken'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load user from localStorage if tokens exist
    const savedUser = localStorage.getItem('user');
    if (accessToken && refreshToken && savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      // Clear everything if incomplete data
      // localStorage.clear();
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
    setLoading(false);
  }, [accessToken, refreshToken]);

  const login = (userData, newAccessToken, newRefreshToken) => {
    setUser(userData);
    setAccessToken(newAccessToken);
    setRefreshToken(newRefreshToken);
    
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('accessToken', newAccessToken);
    localStorage.setItem('refreshToken', newRefreshToken);
  };

  const logout = async () => {
    try {
      // Call logout API to invalidate refresh token
      await axiosInstance.post('/api/public/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local state and storage
      setUser(null);
      setAccessToken(null);
      setRefreshToken(null);
      // localStorage.clear();
    }
  };

  const register = (userData, newAccessToken, newRefreshToken) => {
    setUser(userData);
    setAccessToken(newAccessToken);
    setRefreshToken(newRefreshToken);
    
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('accessToken', newAccessToken);
    localStorage.setItem('refreshToken', newRefreshToken);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      accessToken, 
      refreshToken, 
      login, 
      logout, 
      register, 
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

