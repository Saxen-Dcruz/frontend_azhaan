// src/components/auth/AuthCallback.js
import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ApplicationStore from '../../utils/ApplicationStore';
import LoadingSpinner from '../ui/LoadingSpinner';

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth(); // Get the login function from your context

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
          role: userDetails.role, // Get the role from the userDetails
        };

        // 1. Store the data (just like in your regular login)
        ApplicationStore().setStorage('userDetails', data);

        // 2. Update your AuthContext
        login(data);

        // 3. Navigate to the correct dashboard based on role
        // (This logic is copied from your Login.js useEffect)
        switch (userDetails.role) {
          case 'superuser':
            navigate('/admin');
            break;
          case 'speaker':
            navigate('/broadcast'); // Your App.js route is /broadcast
            break;
          default:
            navigate('/dashboard'); // Default for 'listener', etc.
        }
      } catch (error) {
        console.error('Failed to parse user data from callback:', error);
        navigate('/login?error=true');
      }
    } else {
      // Handle cases where the token or user is missing
      console.error('Missing token or user data in callback');
      navigate('/login?error=true');
    }
    // We only want this to run once when the component mounts
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Show a loading spinner while the redirect is processed
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <LoadingSpinner size="lg" />
    </div>
  );
};

export default AuthCallback;