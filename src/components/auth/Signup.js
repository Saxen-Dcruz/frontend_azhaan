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
  const [passwordStrength, setPasswordStrength] = useState(''); // low, medium, high
  const [passwordError, setPasswordError] = useState('');
  const [submitted, setSubmitted] = useState(false); // Track if Sign Up clicked
  const [loading, setLoading] = useState(false);
  const [openNotification, setNotification] = useState({
    status: false,
    type: '',
    message: '',
  });

  const navigate = useNavigate();

  // Redirect if already logged in
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
      if (submitted) validatePassword(value); // Show error only after submit
    }
  };

  // Password validation
  const validatePassword = (pwd) => {
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
    const numberRegex = /[0-9]/;
    const emojiRegex =
      /[\u{1F600}-\u{1F6FF}\u{1F300}-\u{1F5FF}\u{1F700}-\u{1F77F}]/u;

    if (pwd.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return false;
    } else if (!specialCharRegex.test(pwd)) {
      setPasswordError('Password must include at least one special character');
      return false;
    } else if (!numberRegex.test(pwd)) {
      setPasswordError('Password must include at least one number');
      return false;
    } else if (emojiRegex.test(pwd)) {
      setPasswordError('Password contains invalid characters');
      return false;
    } else {
      setPasswordError('');
      return true;
    }
  };

  // Password strength
  const evaluateStrength = (pwd) => {
    if (pwd.length >= 8) {
      let strengthPoints = 0;
      if (/[0-9]/.test(pwd)) strengthPoints++;
      if (/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) strengthPoints++;
      if (strengthPoints <= 1) setPasswordStrength('low');
      else if (strengthPoints === 2) setPasswordStrength('medium');
      else setPasswordStrength('high');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true); // mark submit clicked
    setLoading(true);
    setNotification({ status: false, type: '', message: '' });

    if (!validatePassword(formData.password)) {
      setLoading(false);
      return;
    }

    RegisterService(
      formData,
      (response) => {
        setNotification({
          status: true,
          type: 'success',
          message: 'Registration Successful! Redirecting to Login...',
        });
        setLoading(false);
        setTimeout(() => navigate('/login'), 2000);
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

  // Google login (mock)
  const googleLogin = useGoogleLogin({
    onSuccess: async (credentialResponse) => {
      try {
        const payload = JSON.parse(
          atob(credentialResponse.credential.split('.')[1])
        );
        const mockGoogleUser = {
          id: `google_${payload.sub}`,
          email: payload.email,
          name: payload.name,
          avatar: payload.name.charAt(0).toUpperCase(),
          isGoogleUser: true,
        };
        localStorage.setItem(
          'streamvoice_token',
          `google-token-${mockGoogleUser.id}-${Date.now()}`
        );
        localStorage.setItem('streamvoice_user', JSON.stringify(mockGoogleUser));
        window.location.reload();
      } catch (error) {
        console.error('Google signup error:', error);
        alert('Google signup failed. Please try again.');
      }
    },
    onError: () => alert('Google signup failed. Please try again.'),
  });

  const GoogleSignupButton = () => (
    <button
      type="button"
      onClick={googleLogin}
      className="w-full flex items-center justify-center gap-3 bg-white text-gray-800 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200 border border-gray-300 shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
    >
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
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200"
                placeholder="Enter your Username"
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
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200"
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
                className={`w-full px-4 py-3 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200
                  ${submitted && passwordError ? 'border border-red-500 bg-red-100 text-red-900' : 'bg-gray-700/50 border border-gray-600 text-white'}`}
                placeholder="Create a password"
                required
              />
              <button
                type="button"
                onClick={() => setPasswordVisible(!passwordVisible)}
                className="absolute right-3 top-10 text-gray-300 hover:text-white transition"
              >
                {passwordVisible ? 'Hide' : 'Show'}
              </button>

              {/* Password strength bar (always shows while typing) */}
              <div className="h-2 mt-2 w-full bg-gray-600 rounded">
                <div className={`h-2 rounded transition-all duration-500 ${getStrengthColor()}`}></div>
              </div>

              {/* Error message (shows only after submit if invalid) */}
              {submitted && passwordError && <p className="text-red-500 mt-1 text-sm">{passwordError}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 transition-all duration-200"
            >
              {loading ? <LoadingSpinner size="sm" /> : 'SIGN UP'}
            </button>

            {/* Google */}
            <div className="mt-4">
              <GoogleSignupButton />
            </div>

            {/* Login Link */}
            <div className="text-center text-gray-400 text-sm mt-4">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium hover:underline">
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
