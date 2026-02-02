import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    // Validate inputs before sending
    if (!email.trim()) {
      setError('Please enter your email address');
      setLoading(false);
      return;
    }
    
    if (!password) {
      setError('Please enter your password');
      setLoading(false);
      return;
    }
    
    try {
      let response;
      let data;
      
      try {
        response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            password: password,
          }),
        });
        
        // Try to parse JSON response
        try {
          const text = await response.text();
          if (!text) {
            throw new Error('Empty response from server. Please check if the backend server is running.');
          }
          data = JSON.parse(text);
        } catch (parseError) {
          console.error('Failed to parse login response:', parseError);
          throw new Error('Invalid response from server. Please check if the backend server is running.');
        }
      } catch (fetchError) {
        // Network error - backend server is not reachable
        console.error('Login network error:', fetchError);
        setError('Cannot connect to server. Please ensure the backend server is running and try again.');
        setLoading(false);
        return;
      }
      
      // Log response for debugging
      console.log('Login response:', {
        status: response.status,
        success: data.success,
        message: data.message
      });
      
      // Handle pending approval - backend returns 403 with message
      if (response.status === 403 && data.message && data.message.includes('pending approval')) {
        // Store email in localStorage so status page can show it
        localStorage.setItem('pendingUserEmail', email.trim());
        // Try to get user data from response if available
        if (data.user) {
          localStorage.setItem('pendingUserData', JSON.stringify(data.user));
        }
        router.push('/registration-status?status=pending');
        return;
      }
      
      if (!response.ok) {
        // Provide more helpful error messages
        let errorMessage = data.message || 'Login failed';
        
        // Log the error for debugging
        console.error('Login error:', {
          status: response.status,
          message: errorMessage,
          data: data
        });
        
        // If it's an invalid credentials error, provide helpful hints
        if (errorMessage.toLowerCase().includes('invalid credentials') || response.status === 401) {
          errorMessage = 'Invalid email or password. Please check your credentials and try again.';
          
          // Provide additional help for common issues
          if (email.includes('@')) {
            errorMessage += ' Make sure you are using the correct email address and password.';
          }
        }
        
        // If it's a network/server error
        if (response.status === 503 || response.status === 500) {
          errorMessage = 'Unable to connect to server. Please check your internet connection and try again.';
        }
        
        // If account is pending approval
        if (response.status === 403 && errorMessage.toLowerCase().includes('pending')) {
          errorMessage = 'Your account is pending approval. Please wait for admin approval.';
        }
        
        throw new Error(errorMessage);
      }
      
      // Store the token and user info in localStorage
      if (data.token) {
        localStorage.setItem('userToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      
      // Check if user is pending (coach, seller, delivery) - backend already blocks login, but double-check
      const userRole = data.user?.role;
      const userStatus = data.user?.status;
      
      // If user is coach, seller, or delivery and status is pending, redirect to status page
      if ((userRole === 'coach' || userRole === 'seller' || userRole === 'delivery') && userStatus === 'pending') {
        router.push('/registration-status?status=pending');
        return;
      }
      
      // If user is rejected, redirect to status page
      if (userStatus === 'rejected') {
        router.push('/registration-status?status=rejected');
        return;
      }
      
      // Redirect based on user role (only if approved/active)
      switch(userRole) {
        case 'coach':
          router.push('/coach');
          break;
        case 'seller':
          router.push('/store');
          break;
        case 'delivery':
          router.push('/delivery');
          break;
        case 'admin':
          router.push('/admin');
          break;
        default:
          // Default to player dashboard
          router.push('/');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during login');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Head>
        <title>Login - TeamUp India Sports Platform</title>
        <meta name="description" content="Login to your TeamUp India account as player, coach, store, or delivery partner" />
      </Head>

      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-lg text-gray-600">Login to your TeamUp India account</p>
          </div>

          {/* Login Form Card */}
          <div className="bg-white rounded-xl shadow-2xl p-8 border border-gray-200">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded mb-6" role="alert">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">{error}</p>
                  </div>
                </div>
              </div>
            )}
            
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="appearance-none relative block w-full px-4 py-3 border-2 border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:z-10 transition"
                  placeholder="your.email@example.com"
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Password *
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={passwordVisible ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="appearance-none relative block w-full px-4 py-3 pr-12 border-2 border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:z-10 transition"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                    aria-label={passwordVisible ? "Hide password" : "Show password"}
                  >
                    {passwordVisible ? (
                      <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link href="/forgot-password" className="font-medium text-red-600 hover:text-red-500 transition">
                    Forgot password?
                  </Link>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-300 shadow-lg"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Logging in...
                  </span>
                ) : (
                  'Login'
                )}
              </button>
            </form>
            
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or</span>
                </div>
              </div>

              <div className="mt-6 text-center space-y-3">
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <Link href="/register" className="font-semibold text-red-600 hover:text-red-500 transition">
                    Register here
                  </Link>
                </p>
                <p className="text-sm text-gray-600">
                  Admin?{' '}
                  <Link href="/admin/login" className="font-semibold text-red-600 hover:text-red-500 transition">
                    Login as Admin
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-center">
            <div className="flex justify-center space-x-6 text-sm">
              <Link href="/register/coach" className="text-gray-600 hover:text-red-600 transition">
                Register as Coach
              </Link>
              <span className="text-gray-300">|</span>
              <Link href="/register/store" className="text-gray-600 hover:text-red-600 transition">
                Register as Store
              </Link>
              <span className="text-gray-300">|</span>
              <Link href="/register/delivery" className="text-gray-600 hover:text-red-600 transition">
                Register as Delivery
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;