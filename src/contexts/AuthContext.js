// src/contexts/AuthContext.js
import React, { createContext, useContext, useReducer, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import ApplicationStore from '../utils/ApplicationStore';

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, loading: true, error: null };
    case 'LOGIN_SUCCESS':
      sessionStorage.setItem('userDetails', JSON.stringify(action.payload));
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.userDetails,
        token: action.payload.access_token,
        role: action.payload.role || action.payload.userDetails?.role,
        loading: false,
        error: null
      };
    case 'TOKEN_REFRESHED':
      const updatedPayload = {
        ...JSON.parse(sessionStorage.getItem('userDetails')),
        access_token: action.payload.access_token
      };
      sessionStorage.setItem('userDetails', JSON.stringify(updatedPayload));
      return {
        ...state,
        token: action.payload.access_token
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload,
        isAuthenticated: false,
        user: null,
        token: null
      };
    case 'LOGOUT':
      sessionStorage.removeItem('userDetails');
      return {
        isAuthenticated: false,
        user: null,
        token: null,
        role: null,
        loading: false,
        error: null
      };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
  role: null,
  loading: false,
  error: null
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const refreshTimerRef = useRef(null);

  // Token refresh function
  const refreshToken = async () => {
    try {
      const storedData = sessionStorage.getItem('userDetails');
      if (!storedData) return;

      const userData = JSON.parse(storedData);
      const response = await fetch('http://localhost:8000/api/v1/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userData.access_token}`
        },
        credentials: 'include'
      });

      if (response.ok) {
        const newTokenData = await response.json();
        dispatch({ 
          type: 'TOKEN_REFRESHED', 
          payload: { access_token: newTokenData.access_token } 
        });
        
        // Schedule next refresh
        scheduleTokenRefresh(newTokenData.expires_in || 1800);
      } else {
        console.warn('Token refresh failed, logging out...');
        dispatch({ type: 'LOGOUT' });
      }
    } catch (error) {
      console.error('Token refresh error:', error);
    }
  };

  // Schedule token refresh based on expiry time
  const scheduleTokenRefresh = (expiresIn = 1800) => {
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
    }

    // Refresh 5 minutes before expiry (300 seconds)
    const refreshTime = (expiresIn - 300) * 1000;
    
    // If token expires in less than 5 minutes, refresh immediately
    if (refreshTime < 0) {
      refreshToken();
      return;
    }

    refreshTimerRef.current = setTimeout(() => {
      refreshToken();
    }, refreshTime);
  };

  // Load sessionStorage on mount and setup token refresh
  useEffect(() => {
    const storedData = sessionStorage.getItem('userDetails');
    if (storedData) {
      try {
        const parsed = JSON.parse(storedData);
        dispatch({ type: 'LOGIN_SUCCESS', payload: parsed });
        
        // Setup token refresh for the loaded token
        scheduleTokenRefresh(parsed.expires_in || 1800);
      } catch (err) {
        console.error('Error parsing sessionStorage userDetails:', err);
        dispatch({ type: 'LOGOUT' });
      }
    }

    return () => {
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
      }
    };
  }, []);

  const login = (payload) => {
    dispatch({ type: 'LOGIN_SUCCESS', payload });
    // Setup token refresh after login
    scheduleTokenRefresh(payload.expires_in || 1800);
  };

  const logout = () => {
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
    }
    dispatch({ type: 'LOGOUT' });
  };

  const clearError = () => dispatch({ type: 'CLEAR_ERROR' });

  return (
    <AuthContext.Provider value={{ ...state, login, logout, clearError, refreshToken }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};