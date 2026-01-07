import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/Layout';

const RegisterPage = () => {
  return (
    <Layout title="Register - TeamUp India Sports Platform" description="Register as player, coach, store, or delivery partner on TeamUp India">
      <Head>
        <title>Register - TeamUp India Sports Platform</title>
        <meta name="description" content="Register as player, coach, store, or delivery partner on TeamUp India" />
      </Head>

      <div className="max-w-4xl mx-auto py-12 px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Join TeamUp India</h1>
          <p className="text-xl text-gray-600">
            Register as a player, coach, store, or delivery partner
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Link href="/coach/register" className="bg-white border border-gray-200 rounded-xl p-8 shadow-md hover:shadow-lg transition-shadow duration-300 text-center">
            <div className="text-5xl mb-4">👨‍🏫</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Register as Coach</h2>
            <p className="text-gray-600 mb-4">
              Are you a certified coach looking to grow your business? Register to create your profile and start accepting bookings.
            </p>
            <div className="inline-block bg-red-600 text-white py-2 px-6 rounded-lg font-medium">
              Register as Coach
            </div>
          </Link>

          <Link href="/store/register" className="bg-white border border-gray-200 rounded-xl p-8 shadow-md hover:shadow-lg transition-shadow duration-300 text-center">
            <div className="text-5xl mb-4">🏪</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Register as Store</h2>
            <p className="text-gray-600 mb-4">
              Own a sports equipment store? Register to list your products and reach customers in your area.
            </p>
            <div className="inline-block bg-green-600 text-white py-2 px-6 rounded-lg font-medium">
              Register as Store
            </div>
          </Link>

          <Link href="/delivery/register" className="bg-white border border-gray-200 rounded-xl p-8 shadow-md hover:shadow-lg transition-shadow duration-300 text-center">
            <div className="text-5xl mb-4">🚚</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Register as Delivery Partner</h2>
            <p className="text-gray-600 mb-4">
              Want to earn by delivering sports equipment? Register to start accepting delivery assignments.
            </p>
            <div className="inline-block bg-blue-600 text-white py-2 px-6 rounded-lg font-medium">
              Register as Delivery
            </div>
          </Link>

          <Link href="/register/player" className="bg-white border border-gray-200 rounded-xl p-8 shadow-md hover:shadow-lg transition-shadow duration-300 text-center">
            <div className="text-5xl mb-4">⚽</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Register as Player</h2>
            <p className="text-gray-600 mb-4">
              Are you a sports enthusiast looking for coaches or equipment? Register as a player to get started.
            </p>
            <div className="inline-block bg-purple-600 text-white py-2 px-6 rounded-lg font-medium">
              Register as Player
            </div>
          </Link>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            Already have an account?{' '}
            <Link href="/login" className="text-red-600 font-medium hover:underline">
              Login here
            </Link>
          </p>
          <p className="text-gray-500 text-sm">
            By registering, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default RegisterPage;