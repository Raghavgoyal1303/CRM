import React, { createContext, useState, useContext, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { authApi } from '../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkLogin();
  }, []);

  const checkLogin = async () => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      if (token) {
        const response = await authApi.getMe();
        if (response.data) {
          setUser(response.data);
        }
      }
    } catch (error) {
      console.log('[Auth] Persisted login failed or no token found');
      await SecureStore.deleteItemAsync('userToken');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await authApi.login({ email, password });
      console.log('[Auth] Login response:', response.data);
      
      const { user } = response.data;
      // Search for token in response.data or response.data.data
      const token = response.data.token || (response.data.data && response.data.data.token);
      
      if (token) {
        const tokenString = typeof token === 'string' ? token : (token.token || token.value || String(token));
        await SecureStore.setItemAsync('userToken', tokenString);
        setUser(user || response.data.data?.user || response.data);
        return { success: true };
      }
      return { success: false, message: 'Invalid server response: token missing' };
    } catch (error) {
      console.error('[Auth] Login error:', error.response?.data?.message || error.message);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Invalid credentials' 
      };
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('[Auth] Logout error', error);
    } finally {
      await SecureStore.deleteItemAsync('userToken');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
