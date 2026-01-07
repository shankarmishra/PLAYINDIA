import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/Layout';

const PlayerRegister = () => {
  return (
    <Layout title="Register as Player - TeamUp India" description="Register as a player on TeamUp India sports platform">
      <Head>
        <title>Register as Player - TeamUp India</title>
        <meta name="description" content="Register as a player on TeamUp India sports platform" />
      </Head>

      <div className="max-w-md mx-auto py-12 px-6">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">Register as Player</h1>
          <p className="text-center text-gray-600 mb-8">Join TeamUp India as a player to find coaches and connect with others</p>
          
          <form>
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Full Name *</label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                placeholder="Enter your full name"
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Email *</label>
              <input
                type="email"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                placeholder="Enter your email"
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Mobile Number *</label>
              <input
                type="tel"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                placeholder="Enter your mobile number"
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Password *</label>
              <input
                type="password"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                placeholder="Create a password"
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Favorite Sport(s)</label>
              <select multiple className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500">
                <option>Cricket</option>
                <option>Football</option>
                <option>Tennis</option>
                <option>Badminton</option>
                <option>Basketball</option>
                <option>Swimming</option>
                <option>Yoga</option>
                <option>Boxing</option>
              </select>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Location</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                placeholder="Enter your city"
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-red-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-red-700 transition duration-300"
            >
              Register as Player
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
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

export default PlayerRegister;