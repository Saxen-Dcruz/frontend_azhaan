import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import LoadingSpinner from '../ui/LoadingSpinner';
import { RegisterService } from '../../services/ApiService';
import NotificationBar from '../Notification/ServiceNotificationBar';

const successCaseCode = [200, 201];

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openNotification, setNotification] = useState({
    status: false,
    type: '',
    message: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    const userDetails = JSON.parse(sessionStorage.getItem('userDetails'));
    if (userDetails?.accessToken) navigate('/Dashboard');
  }, [navigate]);

  const handleCloseNotify = () => {
    setNotification({ status: false, type: '', message: '' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'password') {
      evaluateStrength(value);
      if (submitted) validatePassword(value);
    }
  };

  // ✅ Simplified Password Validation (No uppercase/lowercase restriction)
  const validatePassword = (pwd) => {
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
    const numberRegex = /[0-9]/;
    const emojiRegex = /[\u{1F600}-\u{1F6FF}\u{1F300}-\u{1F5FF}\u{1F700}-\u{1F77F}]/u;

    if (pwd.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return false;
    } else if (!numberRegex.test(pwd)) {
      setPasswordError('Password must include at least one number');
      return false;
    } else if (!specialCharRegex.test(pwd)) {
      setPasswordError('Password must include at least one special character');
      return false;
    } else if (emojiRegex.test(pwd)) {
      setPasswordError('Password contains invalid characters');
      return false;
    } else {
      setPasswordError('');
      return true;
    }
  };

  // ✅ Simplified Strength Evaluation
  const evaluateStrength = (pwd) => {
    if (!pwd) {
      setPasswordStrength('');
      return;
    }

    const hasNumber = /[0-9]/.test(pwd);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pwd);

    if (pwd.length < 8) {
      setPasswordStrength('low');
    } else if (pwd.length >= 8 && (!hasNumber || !hasSpecial)) {
      setPasswordStrength('medium');
    } else if (pwd.length >= 8 && hasNumber && hasSpecial) {
      setPasswordStrength('high');
    } else {
      setPasswordStrength('');
    }
  };

  const getStrengthColor = () => {
    switch (passwordStrength) {
      case 'low':
        return 'bg-red-500 w-1/3';
      case 'medium':
        return 'bg-yellow-400 w-2/3';
      case 'high':
        return 'bg-green-500 w-full';
      default:
        return 'bg-gray-400 w-0';
    }
  };

  const getStrengthText = () => {
    switch (passwordStrength) {
      case 'low':
        return 'Weak';
      case 'medium':
        return 'Medium';
      case 'high':
        return 'Strong';
      default:
        return '';
    }
  };

  const getStrengthTextColor = () => {
    switch (passwordStrength) {
      case 'low':
        return 'text-red-400';
      case 'medium':
        return 'text-yellow-400';
      case 'high':
        return 'text-green-400';
      default:
        return 'text-gray-400';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    setLoading(true);
    setNotification({ status: false, type: '', message: '' });

    if (!validatePassword(formData.password)) {
      setLoading(false);
      return;
    }

    RegisterService(
      formData,
      (response) => {
        if (successCaseCode.includes(response.status)) {
          setNotification({
            status: true,
            type: 'success',
            message: 'Registration Successful! Redirecting to Login...',
          });
          setTimeout(() => navigate('/login'), 2000);
        } else {
          setNotification({
            status: true,
            type: 'error',
            message: 'Registration failed. Please try again.',
          });
        }
        setLoading(false);
      },
      (error) => {
        setNotification({
          status: true,
          type: 'error',
          message: error || 'Registration failed. Please try again.',
        });
        setLoading(false);
      }
    );
  };

  // ✅ Google Signup Redirect
  const handleGoogleSignup = () => {
    window.location.href = 'http://localhost:8000/api/v1/auth/google/login';
  };

  const GoogleSignupButton = () => (
    <button
      type="button"
      onClick={handleGoogleSignup}
      className="w-full flex items-center justify-center gap-3 bg-white text-gray-800 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200 border border-gray-300 shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
    >
      <div className="w-5 h-5 flex items-center justify-center">
        <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
      </div>
      <span className="text-sm font-semibold">Sign up with Google</span>
    </button>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">StreamVoice</h1>
          <p className="text-gray-400">Create Your Account</p>
        </div>

        <div className="bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700/50 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your username"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Password */}
            <div className="relative">
              <label className="block text-gray-300 text-sm font-medium mb-2">Password</label>
              <input
                type={passwordVisible ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  submitted && passwordError
                    ? 'border border-red-500 bg-red-100 text-red-900'
                    : 'bg-gray-700/50 border border-gray-600 text-white'
                }`}
                placeholder="Create a strong password"
                required
              />
              <button
                type="button"
                onClick={() => setPasswordVisible(!passwordVisible)}
                className="absolute right-3 top-10 text-gray-300 hover:text-white transition"
              >
                {passwordVisible ? 'Hide' : 'Show'}
              </button>

              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-gray-400 text-sm">Password strength:</span>
                    <span className={`text-sm font-medium ${getStrengthTextColor()}`}>
                      {getStrengthText()}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-gray-600 rounded-full overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${getStrengthColor()}`}
                    ></div>
                  </div>
                  <div className="text-gray-400 text-xs mt-2">
                    Must include: at least one number and one special character
                  </div>
                </div>
              )}

              {submitted && passwordError && (
                <p className="text-red-400 mt-2 text-sm">{passwordError}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <LoadingSpinner size="sm" /> : 'SIGN UP'}
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600/50"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-gray-800 text-gray-400">Or continue with</span>
              </div>
            </div>

            <GoogleSignupButton />

            <div className="text-center text-gray-400 text-sm">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-blue-400 hover:text-blue-300 font-medium hover:underline"
              >
                Login
              </Link>
            </div>
          </form>
        </div>
      </div>

      <NotificationBar
        handleClose={handleCloseNotify}
        notificationContent={openNotification.message}
        openNotification={openNotification.status}
        type={openNotification.type}
      />
    </div>
  );
};

export default Signup;
