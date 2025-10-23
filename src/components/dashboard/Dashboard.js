// src/components/dashboard/Dashboard.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../ui/LoadingSpinner';

const Dashboard = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Redirect to role-specific dashboard
  switch (user?.role) {
    case 'admin':
    case 'superuser':
      return <Navigate to="/admin-dashboard" replace />;
    case 'speaker':
      return <Navigate to="/speaker-dashboard" replace />;
    case 'listener':
      return <Navigate to="/listener-dashboard" replace />;
    default:
      return <Navigate to="/listener-dashboard" replace />;
  }
};

export default Dashboard;