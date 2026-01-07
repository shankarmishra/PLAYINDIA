import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/Layout';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // In a real application, you would authenticate with your backend
    // For this example, we'll simulate authentication and redirect based on role
    
    // Simulate API call
    setTimeout(() => {
      // Redirect based on selected role
      switch(role) {
        case 'coach':
          window.location.href = '/coach';
          break;
        case 'store':
          window.location.href = '/store';
          break;
        case 'delivery':
          window.location.href = '/delivery';
          break;
        case 'admin':
          window.location.href = '/admin';
          break;
        default:
          // Default to player dashboard
          window.location.href = '/';
      }
    }, 500);
  };

  return (
    <Layout title="Login - TeamUp India Sports Platform" description="Login to your TeamUp India account as player, coach, store, or delivery partner">
      <Head>
        <title>Login - TeamUp India Sports Platform</title>
        <meta name="description" content="Login to your TeamUp India account as player, coach, store, or delivery partner" />
      </Head>

      <div className="max-w-md mx-auto py-12 px-6">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">Login to TeamUp India</h1>
          <p className="text-center text-gray-600 mb-8">Access your account as player, coach, store, or delivery partner</p>
          
          <form onSubmit={handleLogin}>
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Email *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                placeholder="Enter your email"
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Password *</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                placeholder="Enter your password"
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Login As *</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
              >
                <option value="">Select your role</option>
                <option value="player">Player</option>
                <option value="coach">Coach</option>
                <option value="store">Store</option>
                <option value="delivery">Delivery Partner</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            
            <button
              type="submit"
              className="w-full bg-red-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-red-700 transition duration-300"
            >
              Login
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link href="/register" className="text-red-600 hover:underline">
                Register here
              </Link>
            </p>
            <p className="text-gray-600 mt-2">
              <Link href="/forgot-password" className="text-red-600 hover:underline">
                Forgot Password?
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;