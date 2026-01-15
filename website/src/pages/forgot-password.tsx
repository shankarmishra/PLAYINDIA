import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/Layout';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you would send a password reset email
    setSubmitted(true);
  };

  return (
    <Layout title="Forgot Password - TeamUp India" description="Reset your TeamUp India account password">
      <Head>
        <title>Forgot Password - TeamUp India</title>
        <meta name="description" content="Reset your TeamUp India account password" />
      </Head>

      <div className="max-w-md mx-auto py-12 px-6">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">Forgot Password?</h1>
          <p className="text-center text-gray-600 mb-8">Enter your email to receive a password reset link</p>
          
          {submitted ? (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
              <p>Password reset link has been sent to your email address.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label className="block text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                  placeholder="Enter your registered email"
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-red-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-red-700 transition duration-300"
              >
                Send Reset Link
              </button>
            </form>
          )}
          
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Remember your password?{' '}
              <Link href="/login" className="text-red-600 hover:underline">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ForgotPasswordPage;