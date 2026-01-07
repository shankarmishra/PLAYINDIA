import React, { useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/Layout';

const LogoutPage = () => {
  useEffect(() => {
    // Simulate logout process
    // In a real application, you would clear user tokens and session data here
    setTimeout(() => {
      // Redirect to home page after logout
      window.location.href = '/';
    }, 2000);
  }, []);

  return (
    <Layout title="Logging Out - TeamUp India" description="Logging out of your TeamUp India account">
      <Head>
        <title>Logging Out - TeamUp India</title>
        <meta name="description" content="Logging out of your TeamUp India account" />
      </Head>

      <div className="max-w-md mx-auto py-20 px-6">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Logging Out</h1>
          <p className="text-gray-600 mb-6">
            You are being logged out of your TeamUp India account. Please wait...
          </p>
          
          <div className="flex justify-center mb-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
          </div>
          
          <p className="text-gray-500 text-sm">
            You will be redirected to the home page shortly.
          </p>
          
          <div className="mt-8">
            <Link href="/" className="text-red-600 hover:underline font-medium">
              Go to Home Page
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LogoutPage;