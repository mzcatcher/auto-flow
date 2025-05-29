import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      if (window.Telegram?.WebApp?.initData) {
        const response = await axios.post('/api/auth/telegram', {
          initData: window.Telegram.WebApp.initData
        });
        
        setUser(response.data.user);
        
        // Set auth header for future requests
        axios.defaults.headers.common['X-Telegram-Init-Data'] = window.Telegram.WebApp.initData;
      } else {
        // Development mode - mock user
        setUser({
          id: '1',
          telegramId: '123456789',
          username: 'dev_user',
          firstName: 'Dev',
          lastName: 'User',
          role: 'super-admin' // Change this to test different roles
        });
      }
    } catch (error) {
      console.error('Auth initialization failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = (newRole) => {
    setUser(prev => ({ ...prev, role: newRole }));
  };

  const value = {
    user,
    loading,
    updateUserRole,
    isAuthenticated: !!user,
    isSuperAdmin: user?.role === 'super-admin',
    isAdmin: user?.role === 'admin' || user?.role === 'super-admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};