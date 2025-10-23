// import React, { useState, useEffect } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { useGoogleLogin } from '@react-oauth/google';
// import { useAuth } from '../../contexts/AuthContext';
// import LoadingSpinner from '../ui/LoadingSpinner';

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [rememberMe, setRememberMe] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const navigate = useNavigate();
//   const { isAuthenticated, login, role } = useAuth();

//   useEffect(() => {
//     if (isAuthenticated && role) {
//       // Redirect based on role
//       switch (role) {
//         case 'admin':
//           navigate('/admin-dashboard');
//           break;
//         case 'speaker':
//           navigate('/speaker-dashboard');
//           break;
//         case 'listener':
//           navigate('/listener-dashboard');
//           break;
//         default:
//           navigate('/dashboard');
//       }
//     }
//   }, [isAuthenticated, role, navigate]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setNotification({ status: false, message: '', type: '' });

//     LoginService({ email, password })
//       .then((response) => {
//         if (successCaseCode.includes(response.status)) {
//           setNotification({
//             status: true,
//             type: 'success',
//             message: 'Login Successful!',
//           });
//           return response.json();
//         }
//         throw {
//           errorStatus: response.status,
//           errorObject: response.json(),
//         };
//       })
//       .then((data) => {
//         // Store in ApplicationStore
//         ApplicationStore().setStorage('userDetails', data);
        
//         // Update AuthContext - this is crucial!
//         login(data);
        
//         // Navigation will happen automatically due to the useEffect above
//         // Remove the setTimeout navigation since useEffect will handle it
//       })
//       .catch((error) => {
//         error?.errorObject?.then((errorResponse) => {
//           setNotification({
//             status: true,
//             type: 'error',
//             message: errorResponse.error || errorResponse.message,
//           });
//         });
//       })
//       .finally(() => {
//         setLoading(false);
//       });
//   };

//   const handleGoogleSuccess = async (credentialResponse) => {
//     try {
//       const googleToken = credentialResponse.credential;
//       const payload = JSON.parse(atob(googleToken.split('.')[1]));

//       const mockResponse = {
//         access_token: `google-token-${Date.now()}`,
//         userDetails: {
//           id: `google_${payload.sub}`,
//           email: payload.email,
//           name: payload.name,
//           role: 'listener', // Default role for Google signups
//           avatar: payload.name.charAt(0).toUpperCase(),
//           isGoogleUser: true
//         },
//         role: 'listener'
//       };
      
//       login(mockResponse);
      
//     } catch (error) {
//       console.error('Google login error:', error);
//       setError('Google login failed. Please try again.');
//     }
//   };

//   const handleGoogleError = () => {
//     setError('Google login failed. Please try again.');
//   };

//   const googleLogin = useGoogleLogin({
//     onSuccess: handleGoogleSuccess,
//     onError: handleGoogleError,
//   });

//   const GoogleLoginButton = () => (
//     <button
//       type="button"
//       onClick={() => googleLogin()}
//       className="w-full flex items-center justify-center gap-3 bg-white text-gray-800 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200 border border-gray-300 shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
//     >
//       <div className="w-5 h-5 flex items-center justify-center">
//         <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
//           <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
//           <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
//           <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
//           <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
//         </svg>
//       </div>
//       <span className="text-sm font-semibold">Continue with Google</span>
//     </button>
//   );

//   if (isAuthenticated) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <LoadingSpinner size="lg" />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
//       <div className="max-w-md w-full">
//         {/* Header */}
//         <div className="text-center mb-8">
//           <div className="flex items-center justify-center mb-4">
//             <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
//               <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
//               </svg>
//             </div>
//           </div>
//           <h1 className="text-3xl font-bold text-white mb-2">StreamVoice</h1>
//           <p className="text-gray-400">Audio Platform</p>
//         </div>

//         {/* Login Form */}
//         <div className="bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700/50 p-8">
//           <form onSubmit={handleSubmit} className="space-y-6">
//             {error && (
//               <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg text-sm">
//                 {error}
//               </div>
//             )}
            
//             {/* Email Field */}
//             <div>
//               <label className="block text-gray-300 text-sm font-medium mb-2">
//                 Email
//               </label>
//               <input
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                 placeholder="Enter your email"
//                 required
//                 disabled={loading}
//               />
//             </div>

//             {/* Password Field */}
//             <div>
//               <label className="block text-gray-300 text-sm font-medium mb-2">
//                 Password
//               </label>
//               <input
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                 placeholder="Enter your password"
//                 required
//                 disabled={loading}
//               />
//             </div>

//             {/* Remember Me & Forgot Password */}
//             <div className="flex items-center justify-between">
//               <label className="flex items-center space-x-2 text-gray-300 text-sm cursor-pointer">
//                 <input
//                   type="checkbox"
//                   checked={rememberMe}
//                   onChange={(e) => setRememberMe(e.target.checked)}
//                   className="sr-only"
//                   disabled={loading}
//                 />
//                 <div className={`w-4 h-4 border-2 rounded ${rememberMe ? 'bg-blue-500 border-blue-500' : 'bg-gray-700 border-gray-600'}`}>
//                   {rememberMe && (
//                     <svg className="w-3 h-3 text-white mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
//                     </svg>
//                   )}
//                 </div>
//                 <span>Remember Me</span>
//               </label>
//               <button type="button" className="text-blue-400 hover:text-blue-300 text-sm hover:underline">
//                 Forgot Password?
//               </button>
//             </div>

//             {/* Login Button */}
//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50"
//             >
//               {loading ? <LoadingSpinner size="sm" /> : 'LOGIN'}
//             </button>

//             {/* Divider */}
//             <div className="relative">
//               <div className="absolute inset-0 flex items-center">
//                 <div className="w-full border-t border-gray-600/50"></div>
//               </div>
//               <div className="relative flex justify-center text-sm">
//                 <span className="px-3 bg-gray-800 text-gray-400">Or continue with</span>
//               </div>
//             </div>

//             {/* Google Login */}
//             <GoogleLoginButton />

//             {/* Sign up link */}
//             <div className="text-center text-gray-400 text-sm">
//               Don't have an account?{' '}
//               <Link to="/signup" className="text-blue-400 hover:text-blue-300 font-medium hover:underline">
//                 Sign up
//               </Link>
//             </div>
//           </form>
//         </div>

        
//       </div>
//     </div>
//   );
// };

// export default Login;
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../ui/LoadingSpinner';
import NotificationBar from '../Notification/ServiceNotificationBar';
import { LoginService  } from '../../services/ApiService';
import ApplicationStore from '../../utils/ApplicationStore';

const successCaseCode = [200, 201];

// ✅ Google Button Component
const GoogleLoginButton = ({ onClick, disabled }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
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
    <span className="text-sm font-semibold">Continue with Google</span>
  </button>
);
// ✅ Add PropTypes validation
GoogleLoginButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

GoogleLoginButton.defaultProps = {
  disabled: false,
};

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ status: false, message: '', type: '' });
  const [error] = useState('');

  const navigate = useNavigate();
  const { isAuthenticated, login, role } = useAuth();

  // In Login.js - Update the useEffect
useEffect(() => {
  if (isAuthenticated && role) {
    switch (role) {
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
        navigate('/dashboard'); // This will auto-redirect
    }
  }
}, [isAuthenticated, role, navigate]);

  // ✅ Regular Email/Password Login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setNotification({ status: false, message: '', type: '' });

    LoginService({ email, password })
      .then((response) => {
        if (successCaseCode.includes(response.status)) {
          setNotification({ status: true, type: 'success', message: 'Login Successful!' });
          return response.json();
        }
        throw { errorStatus: response.status, errorObject: response.json() };
      })
      .then((data) => {
        ApplicationStore().setStorage('userDetails', data);
        login(data);
      })
      .catch((error) => {
        error?.errorObject?.then((errorResponse) => {
          setNotification({
            status: true,
            type: 'error',
            message: errorResponse.error || errorResponse.message,
          });
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // ✅ Google Login using your backend GoogleService
  const handleGoogleLogin = () => {
    // You don't need to set loading, send notifications, or call an API service.
    // Just tell the browser to go to the login URL.
    // Your backend will handle the redirect to Google.
    window.location.href = 'http://localhost:8000/api/v1/auth/google/login';
  };

  // ✅ Show spinner while authenticated
  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">StreamVoice</h1>
          <p className="text-gray-400">Audio Platform</p>
        </div>

        {/* Login Form */}
        <div className="bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700/50 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {notification.status && (
              <NotificationBar
                type={notification.type}
                message={notification.message}
                onClose={() => setNotification({ status: false, message: '', type: '' })}
              />
            )}

            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your email"
                required
                disabled={loading}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your password"
                required
                disabled={loading}
              />
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 text-gray-300 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="sr-only"
                  disabled={loading}
                />
                <div
                  className={`w-4 h-4 border-2 rounded ${
                    rememberMe ? 'bg-blue-500 border-blue-500' : 'bg-gray-700 border-gray-600'
                  }`}
                >
                  {rememberMe && (
                    <svg className="w-3 h-3 text-white mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span>Remember Me</span>
              </label>
              <button type="button" className="text-blue-400 hover:text-blue-300 text-sm hover:underline">
                Forgot Password?
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50"
            >
              {loading ? <LoadingSpinner size="sm" /> : 'LOGIN'}
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

            {/* ✅ Google Login Button */}
            <GoogleLoginButton onClick={handleGoogleLogin} disabled={loading} />

            {/* Signup */}
            <div className="text-center text-gray-400 text-sm">
              Don&apos;t have an account?{' '}
              <Link to="/signup" className="text-blue-400 hover:text-blue-300 font-medium hover:underline">
                Sign up
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

