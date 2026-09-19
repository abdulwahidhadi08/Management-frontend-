import React, { createContext, useState, useEffect, useContext } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if token exists on mount and load user details
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await authAPI.getMe();
          setUser(res.data.user);
          setProfile(res.data.profile);
        } catch (err) {
          console.error('Failed to load user with token', err);
          localStorage.removeItem('token');
          setUser(null);
          setProfile(null);
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await authAPI.login({ email, password });
      const { token, user: loggedUser, profile: userProfile } = res.data;
      
      localStorage.setItem('token', token);
      setUser(loggedUser);
      setProfile(userProfile);
      setLoading(false);
      return loggedUser;
    } catch (err) {
      setLoading(false);
      let message;
      if (!err.response) {
        message = 'Unable to connect to backend server. Please check your internet connection or backend server status.';
      } else {
        message = err.response.data?.message || 'Invalid email or password.';
      }
      setError(message);
      throw new Error(message);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setProfile(null);
    setError(null);
  };

  const refreshMe = async () => {
    try {
      const res = await authAPI.getMe();
      setUser(res.data.user);
      setProfile(res.data.profile);
    } catch (err) {
      console.error('Failed to refresh user profile', err);
    }
  };

  const updatePassword = async (currentPassword, newPassword) => {
    try {
      await authAPI.updatePassword({ currentPassword, newPassword });
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update password.';
      throw new Error(message);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        error,
        login,
        logout,
        refreshMe,
        updatePassword,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isHeadmaster: user?.role === 'headmaster',
        isStudent: user?.role === 'student',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
