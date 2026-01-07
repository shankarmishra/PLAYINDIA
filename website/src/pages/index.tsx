import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/Layout';

const HomePage = () => {
  return (
    <Layout title="TeamUp India - Sports Platform for Players, Coaches, Stores & Delivery" description="TeamUp India connects players, coaches, sports stores, and delivery partners in one comprehensive platform">
      <Head>
        <title>TeamUp India - Sports Platform for Players, Coaches, Stores & Delivery</title>
        <meta name="description" content="TeamUp India connects players, coaches, sports stores, and delivery partners in one comprehensive platform" />
      </Head>

      {/* Hero Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Connect, Play & Grow with TeamUp India</h1>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto mb-10">
            The ultimate sports ecosystem connecting players, coaches, stores, and delivery partners across India
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/coach/register" className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300">
              Register as Coach
            </Link>
            <Link href="/store/register" className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300">
              Register as Store
            </Link>
            <Link href="/delivery/register" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300">
              Register as Delivery
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-3xl font-bold text-red-600">50K+</h3>
              <p className="text-gray-600">Active Players</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-3xl font-bold text-red-600">2K+</h3>
              <p className="text-gray-600">Verified Coaches</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-3xl font-bold text-red-600">500+</h3>
              <p className="text-gray-600">Sports Stores</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-3xl font-bold text-red-600">1K+</h3>
              <p className="text-gray-600">Delivery Partners</p>
            </div>
          </div>
        </div>
      </section>

      {/* What is TeamUp India */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">What is TeamUp India</h2>
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-lg text-gray-700 mb-6">
              TeamUp India is a comprehensive sports ecosystem that connects all stakeholders in the Indian sports community. 
              We bridge the gap between players looking for coaches, stores selling sports equipment, and delivery partners 
              facilitating seamless transactions.
            </p>
            <p className="text-lg text-gray-700">
              Our platform ensures quality, reliability, and growth for everyone involved in the sports industry.
            </p>
          </div>
        </div>
      </section>

      {/* Who is it for */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Who is it for</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-4xl mb-4">👨‍🏫</div>
              <h3 className="text-xl font-bold mb-2">Coaches</h3>
              <p className="text-gray-600">
                Verified coaches can create profiles, manage bookings, track earnings, and grow their coaching business.
              </p>
              <Link href="/coach/register" className="text-red-600 font-semibold mt-4 inline-block hover:underline">
                Register as Coach
              </Link>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-4xl mb-4">🏪</div>
              <h3 className="text-xl font-bold mb-2">Stores</h3>
              <p className="text-gray-600">
                Sports stores can list products, manage orders, track sales, and expand their customer base.
              </p>
              <Link href="/store/register" className="text-red-600 font-semibold mt-4 inline-block hover:underline">
                Register as Store
              </Link>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-4xl mb-4">🚚</div>
              <h3 className="text-xl font-bold mb-2">Delivery Partners</h3>
              <p className="text-gray-600">
                Delivery partners can earn by delivering sports equipment and connecting with stores and customers.
              </p>
              <Link href="/delivery/register" className="text-red-600 font-semibold mt-4 inline-block hover:underline">
                Register as Delivery
              </Link>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-4xl mb-4">⚽</div>
              <h3 className="text-xl font-bold mb-2">Players</h3>
              <p className="text-gray-600">
                Players can find coaches, book sessions, buy equipment, join tournaments, and connect with others.
              </p>
              <Link href="/login" className="text-red-600 font-semibold mt-4 inline-block hover:underline">
                Login as Player
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Platform Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-3 text-red-600">Coach Booking System</h3>
              <p className="text-gray-700">
                Players can easily find and book verified coaches based on location, sport, experience, and ratings.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-3 text-red-600">Equipment Marketplace</h3>
              <p className="text-gray-700">
                Buy quality sports equipment from verified stores with secure payment and reliable delivery.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-3 text-red-600">Tournament Management</h3>
              <p className="text-gray-700">
                Organize and participate in local and regional sports tournaments with our easy-to-use tools.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-3 text-red-600">Earnings Dashboard</h3>
              <p className="text-gray-700">
                Coaches and delivery partners can track earnings, manage payouts, and grow their income.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-3 text-red-600">Performance Tracking</h3>
              <p className="text-gray-700">
                Players can track their fitness, performance, and progress with our analytics tools.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-3 text-red-600">Community Connection</h3>
              <p className="text-gray-700">
                Connect with fellow players, coaches, and sports enthusiasts across India.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3D Sports Experience Section */}
      <section className="py-16 bg-gradient-to-r from-blue-900 to-purple-900 text-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-12">Immersive 3D Sports Experience</h2>
          <p className="text-xl text-gray-200 mb-12 max-w-3xl mx-auto">
            Experience sports like never before with our cutting-edge 3D technology that brings training to life
          </p>
                
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-48 mx-auto mb-4 flex items-center justify-center">
                <span className="text-gray-500 text-lg">3D Cricket Model</span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">3D Cricket Training</h3>
              <p className="text-gray-200">Virtual batting and bowling practice</p>
            </div>
                  
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-48 mx-auto mb-4 flex items-center justify-center">
                <span className="text-gray-500 text-lg">3D Football Model</span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">3D Football Training</h3>
              <p className="text-gray-200">Virtual dribbling and shooting practice</p>
            </div>
                  
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-48 mx-auto mb-4 flex items-center justify-center">
                <span className="text-gray-500 text-lg">3D Tennis Model</span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">3D Tennis Training</h3>
              <p className="text-gray-200">Virtual serving and rally practice</p>
            </div>
                  
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-48 mx-auto mb-4 flex items-center justify-center">
                <span className="text-gray-500 text-lg">3D Badminton Model</span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">3D Badminton Training</h3>
              <p className="text-gray-200">Virtual serving and smashing practice</p>
            </div>
          </div>
                
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4 text-white">Interactive Training Modules</h3>
              <div className="h-48 flex items-center justify-center">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full flex items-center justify-center">
                  <span className="text-gray-500 text-lg">Training Module</span>
                </div>
              </div>
            </div>
                  
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4 text-white">Performance Analytics</h3>
              <div className="h-48 flex items-center justify-center">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full flex items-center justify-center">
                  <span className="text-gray-500 text-lg">Analytics Dashboard</span>
                </div>
              </div>
            </div>
                  
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4 text-white">Virtual Coaching</h3>
              <div className="h-48 flex items-center justify-center">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full flex items-center justify-center">
                  <span className="text-gray-500 text-lg">Virtual Coach</span>
                </div>
              </div>
            </div>
          </div>
                
          <div className="mt-12">
            <p className="text-xl text-gray-200 mb-6">Transform your sports experience with our innovative 3D technology</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/app-screens" className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300">
                Explore 3D Experience
              </Link>
              <Link href="/3d-demo" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300">
                Try Demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-6 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Join TeamUp India?</h2>
          <p className="text-xl text-gray-200 mb-10">
            Whether you're a player, coach, store, or delivery partner, become part of India's premier sports ecosystem.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/coach/register" className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300">
              Register as Coach
            </Link>
            <Link href="/store/register" className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300">
              Register as Store
            </Link>
            <Link href="/delivery/register" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300">
              Register as Delivery
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;