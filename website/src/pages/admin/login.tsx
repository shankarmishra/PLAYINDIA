import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { BACKEND_API_URL } from '../../config/constants';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const backendUrl = BACKEND_API_URL;
      const apiUrl = `${backendUrl}/api/auth/admin/login`;
      
      let response;
      try {
        response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            password,
          }),
        });
      } catch (fetchError) {
        // Network error - backend server is not reachable
        throw new Error(
          `Cannot connect to backend server at ${backendUrl}. ` +
          `Please make sure the backend server is running on port 5000. ` +
          `Error: ${fetchError instanceof Error ? fetchError.message : 'Network error'}`
        );
      }
      
      // Try to parse JSON response
      let data;
      try {
        const text = await response.text();
        if (!text) {
          throw new Error('Empty response from server');
        }
        data = JSON.parse(text);
      } catch (parseError) {
        throw new Error(
          `Invalid response from server. ` +
          `Please check if the backend is running and accessible at ${backendUrl}`
        );
      }
      
      if (!response.ok) {
        // Show more helpful error messages
        if (data.message === 'Invalid credentials') {
          throw new Error('Invalid email or password. Default credentials: admin@playindia.com / admin123');
        }
        throw new Error(data.message || 'Admin login failed');
      }
      
      // Store the token and admin info in localStorage
      if (data.token) {
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('admin', JSON.stringify(data.admin));
      }
      
      // Redirect to admin dashboard
      router.push('/admin');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during admin login';
      setError(errorMessage);
      console.error('Admin login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center px-6">
      <Head>
        <title>Admin Login - TeamUp India</title>
        <meta name="description" content="Admin login for TeamUp India platform" />
      </Head>

      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Login</h1>
            <p className="text-gray-600">TeamUp India Admin Portal</p>
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800 font-medium">Default Credentials:</p>
              <p className="text-xs text-blue-700 mt-1">Email: admin@playindia.com</p>
              <p className="text-xs text-blue-700">Password: admin123</p>
            </div>
            <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
              <p className="font-medium">⚠️ Backend URL: {BACKEND_API_URL}</p>
              <p className="mt-1">Make sure the backend server is running!</p>
            </div>
          </div>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          
          <form onSubmit={handleLogin}>
            <div className="mb-6">
              <label htmlFor="admin-email" className="block text-gray-700 font-semibold mb-2">Email Address *</label>
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition bg-white text-gray-900"
                placeholder="admin@playindia.com"
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="admin-password" className="block text-gray-700 font-semibold mb-2">Password *</label>
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition bg-white text-gray-900"
                placeholder="Enter your password"
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-red-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {loading ? 'Logging in...' : 'Login to Admin Dashboard'}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <Link href="/login" className="text-gray-600 hover:text-red-600 transition">
              ← Back to User Login
            </Link>
          </div>
        </div>
        
        <div className="mt-6 text-center text-white text-sm">
          <p>Authorized personnel only</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

