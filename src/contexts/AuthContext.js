import React, { createContext, useContext, useReducer, useEffect } from 'react';
import PropTypes from 'prop-types';


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
          user: action.payload.userDetails, // Make sure this matches your API response
          token: action.payload.access_token, // Make sure this matches your API response  
          role: action.payload.role || action.payload.userDetails?.role, // Handle both structures
          loading: false,
          error: null
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

  // Load sessionStorage on mount
  useEffect(() => {
    const storedData = sessionStorage.getItem('userDetails');
    if (storedData) {
      try {
        const parsed = JSON.parse(storedData);
        dispatch({ type: 'LOGIN_SUCCESS', payload: parsed });
      } catch (err) {
        console.error('Error parsing sessionStorage userDetails:', err);
        dispatch({ type: 'LOGOUT' });
      }
    }
  }, []);

  const login = (payload) => {
    dispatch({ type: 'LOGIN_SUCCESS', payload });
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  const clearError = () => dispatch({ type: 'CLEAR_ERROR' });

  return (
    <AuthContext.Provider value={{ ...state, login, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  );
};
// Add PropTypes validation
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
