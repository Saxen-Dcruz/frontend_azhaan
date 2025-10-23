// src/components/auth/AuthCallback.js
import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ApplicationStore from '../../utils/ApplicationStore';
import LoadingSpinner from '../ui/LoadingSpinner';

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    const userJson = searchParams.get('user');

    if (token && userJson) {
      try {
        const userDetails = JSON.parse(userJson);

        // Reconstruct the data object that your 'login' function expects
        const data = {
          access_token: token,
          userDetails: userDetails,
          role: userDetails.role,
        };

        // 1. Store the data
        ApplicationStore().setStorage('userDetails', data);

        // 2. Update your AuthContext
        login(data);

        // 3. Navigate to the correct dashboard based on role
        // UPDATED: Use the new dashboard routes
        switch (userDetails.role) {
          case 'Superuser':
          case 'admin':
            navigate('/admin-dashboard');
            break;
          case 'Speaker':
            navigate('/speaker-dashboard');
            break;
          case 'Listener':
            navigate('/listener-dashboard');
            break;
          default:
            navigate('/dashboard'); // This will auto-redirect based on role
        }
      } catch (error) {
        console.error('Failed to parse user data from callback:', error);
        navigate('/login?error=auth_failed');
      }
    } else {
      // Handle cases where the token or user is missing
      console.error('Missing token or user data in callback');
      navigate('/login?error=missing_data');
    }
  }, [searchParams, navigate, login]);

  // Show a loading spinner while the redirect is processed
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="text-gray-400 mt-4">Completing authentication...</p>
      </div>
    </div>
  );
};

export default AuthCallback;