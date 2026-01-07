import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/Layout';

const AppScreensPage = () => {
  return (
    <Layout title="App Screens Showcase - TeamUp India" description="View TeamUp India app screens for players, coaches, stores, and delivery partners">
      <Head>
        <title>App Screens Showcase - TeamUp India</title>
        <meta name="description" content="View TeamUp India app screens for players, coaches, stores, and delivery partners" />
      </Head>

      {/* Hero Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">App Screens Showcase</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Explore the TeamUp India app interface designed for players, coaches, stores, and delivery partners
          </p>
        </div>
      </section>

      {/* Players Section */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">For Players</h2>
            <p className="text-lg text-gray-600">Experience the app from a player's perspective</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-64 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2 text-gray-900">Find Coaches</h3>
              <p className="text-gray-600">Browse verified coaches in your area with detailed profiles and ratings</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-64 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2 text-gray-900">Book Sessions</h3>
              <p className="text-gray-600">Easily book coaching sessions based on your schedule and preferences</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-64 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2 text-gray-900">Tournament Participation</h3>
              <p className="text-gray-600">Join local and regional tournaments organized by verified coaches</p>
            </div>
          </div>
        </div>
      </section>

      {/* Coaches Section */}
      <section className="py-16 bg-gray-100 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">For Coaches</h2>
            <p className="text-lg text-gray-600">Manage your coaching business efficiently</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-64 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2 text-gray-900">Booking Calendar</h3>
              <p className="text-gray-600">Manage your schedule with our intuitive calendar system</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-64 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2 text-gray-900">Earnings Dashboard</h3>
              <p className="text-gray-600">Track your earnings and view payment history</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-64 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2 text-gray-900">Tournament Management</h3>
              <p className="text-gray-600">Organize and manage tournaments with ease</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stores Section */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">For Stores</h2>
            <p className="text-lg text-gray-600">Manage your sports equipment business</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-64 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2 text-gray-900">Product Management</h3>
              <p className="text-gray-600">List and manage your sports equipment inventory</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-64 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2 text-gray-900">Order Management</h3>
              <p className="text-gray-600">Track and manage customer orders efficiently</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-64 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2 text-gray-900">Sales Analytics</h3>
              <p className="text-gray-600">Access detailed analytics about your sales and performance</p>
            </div>
          </div>
        </div>
      </section>

      {/* Delivery Partners Section */}
      <section className="py-16 bg-gray-100 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">For Delivery Partners</h2>
            <p className="text-lg text-gray-600">Manage your delivery assignments effectively</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-64 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2 text-gray-900">Delivery Assignments</h3>
              <p className="text-gray-600">View and accept delivery assignments based on location</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-64 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2 text-gray-900">Earnings Tracking</h3>
              <p className="text-gray-600">Track your earnings and view payment history</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-64 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2 text-gray-900">Navigation</h3>
              <p className="text-gray-600">Get optimized routes for pickup and delivery locations</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3D Sports Models Section */}
      <section className="py-16 px-6 bg-gradient-to-r from-blue-900 to-purple-900 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">3D Sports Experience</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-48 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">3D Cricket Experience</h3>
              <p className="text-gray-300">Interactive cricket training simulations</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-48 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">3D Football Experience</h3>
              <p className="text-gray-300">Virtual football training environments</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-48 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">3D Tennis Experience</h3>
              <p className="text-gray-300">Immersive tennis practice sessions</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-48 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">3D Badminton Experience</h3>
              <p className="text-gray-300">Advanced badminton training modules</p>
            </div>
          </div>
          
          <div className="mt-12">
            <p className="text-xl mb-6">Our platform integrates cutting-edge 3D technology to enhance your sports experience</p>
            <Link href="/register" className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300">
              Join Now
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to Experience TeamUp India?</h2>
          <p className="text-lg text-gray-700 mb-8">
            Download our app or register on our platform to start your sports journey today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/register" className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300">
              Register Now
            </Link>
            <Link href="/contact" className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 px-6 rounded-lg transition duration-300">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default AppScreensPage;