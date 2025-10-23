// src/App.js - UPDATED VERSION
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { SocketProvider } from './contexts/SocketContext';
import { LiveKitProvider } from './contexts/LiveKitContext';
import { StreamProvider } from './contexts/StreamContext';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import Dashboard from './components/dashboard/Dashboard';
import AdminDashboard from './components/dashboard/AdminDashboard';
import SpeakerDashboard from './components/dashboard/SpeakerDashboard';
import ListenerDashboard from './components/dashboard/ListenerDashboard';
import AdminPanel from './components/admin/AdminPanel';
import StreamBroadcast from './components/streams/StreamBroadcast';
import AdvancedBroadcastStudio from './components/streams/AdvancedBroadcastStudio';
import AuthCallback from './components/auth/AuthCallback';
import LoadingSpinner from './components/ui/LoadingSpinner';

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || 'your-google-oauth-client-id-here';

function ProtectedRoute({ children, requiredRole }) {
  const { user, isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (requiredRole && user.role !== requiredRole) return <Navigate to="/dashboard" />;
  
  return children;
}

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <SocketProvider>
          <LiveKitProvider>
            <StreamProvider>
              <Router>
                <div className="min-h-screen bg-gray-900">
                  <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/auth/callback" element={<AuthCallback />} />
                    
                    {/* Main Dashboard - Auto-redirects based on role */}
                    <Route path="/dashboard" element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    } />
                    
                    {/* Role-specific dashboards */}
                    <Route path="/admin-dashboard" element={
                      <ProtectedRoute requiredRole="admin">
                        <AdminDashboard />
                      </ProtectedRoute>
                    } />
                    <Route path="/speaker-dashboard" element={
                      <ProtectedRoute requiredRole="speaker">
                        <SpeakerDashboard />
                      </ProtectedRoute>
                    } />
                    <Route path="/listener-dashboard" element={
                      <ProtectedRoute requiredRole="listener">
                        <ListenerDashboard />
                      </ProtectedRoute>
                    } />
                    
                    {/* Admin Panel */}
                    <Route path="/admin" element={
                      <ProtectedRoute requiredRole="admin">
                        <AdminPanel />
                      </ProtectedRoute>
                    } />
                    
                    {/* Broadcast Routes */}
                    <Route path="/broadcast" element={
                      <ProtectedRoute requiredRole="speaker">
                        <StreamBroadcast />
                      </ProtectedRoute>
                    } />
                    <Route path="/studio" element={
                      <ProtectedRoute requiredRole="speaker">
                        <AdvancedBroadcastStudio />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/" element={<Navigate to="/dashboard" />} />
                  </Routes>
                </div>
              </Router>
            </StreamProvider>
          </LiveKitProvider>
        </SocketProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;