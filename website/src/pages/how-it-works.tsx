import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

const HowItWorksPage = () => {
  return (
    <div>
      <Head>
        <title>How It Works - TeamUp India</title>
        <meta name="description" content="Learn how TeamUp India connects players, coaches, stores, and delivery partners" />
      </Head>

      {/* Hero Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">How TeamUp India Works</h1>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto">
            Connecting the entire sports ecosystem in India - Simple, efficient, and effective
          </p>
        </div>
      </section>

      {/* Tabs for different user types */}
      <section className="py-12 bg-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="border-b border-gray-200">
            <nav className="flex flex-wrap -mb-px">
              <button className="py-4 px-6 text-center border-b-2 border-red-500 font-medium text-red-600">For Players</button>
              <button className="py-4 px-6 text-center border-b-2 border-transparent font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">For Coaches</button>
              <button className="py-4 px-6 text-center border-b-2 border-transparent font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">For Stores</button>
              <button className="py-4 px-6 text-center border-b-2 border-transparent font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">For Delivery</button>
            </nav>
          </div>
        </div>
      </section>

      {/* For Players */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How TeamUp India Works for Players</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-red-600">1</span>
              </div>
              <div className="mx-auto mb-3">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-bold mb-3">Sign Up</h3>
              <p className="text-gray-600">
                Create your free account as a player and set up your profile with your favorite sports and location.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-red-600">2</span>
              </div>
              <div className="mx-auto mb-3">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-bold mb-3">Find Coaches</h3>
              <p className="text-gray-600">
                Browse verified coaches in your area with the right expertise for your sport and skill level.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-red-600">3</span>
              </div>
              <div className="mx-auto mb-3">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-bold mb-3">Book Sessions</h3>
              <p className="text-gray-600">
                Book coaching sessions based on your availability and the coach's schedule.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-red-600">4</span>
              </div>
              <div className="mx-auto mb-3">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-bold mb-3">Track Progress</h3>
              <p className="text-gray-600">
                Monitor your performance, track your progress, and connect with other players.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* For Coaches */}
      <section className="py-12 bg-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How TeamUp India Works for Coaches</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">1</span>
              </div>
              <div className="mx-auto mb-3">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-bold mb-3">Register</h3>
              <p className="text-gray-600">
                Sign up as a coach and verify your credentials to create a trusted profile.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <div className="mx-auto mb-3">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-bold mb-3">Set Availability</h3>
              <p className="text-gray-600">
                Configure your calendar to show when you're available for coaching sessions.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">3</span>
              </div>
              <div className="mx-auto mb-3">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-bold mb-3">Receive Bookings</h3>
              <p className="text-gray-600">
                Get booking requests from players and manage your schedule efficiently.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">4</span>
              </div>
              <div className="mx-auto mb-3">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-bold mb-3">Earn & Grow</h3>
              <p className="text-gray-600">
                Track earnings, get paid, and grow your coaching business with verified reviews.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* For Stores */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How TeamUp India Works for Stores</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <div className="mx-auto mb-3">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-bold mb-3">Register Store</h3>
              <p className="text-gray-600">
                Register your sports store and verify your business credentials.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <div className="mx-auto mb-3">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-bold mb-3">List Products</h3>
              <p className="text-gray-600">
                Add your sports equipment inventory with descriptions, prices, and images.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">3</span>
              </div>
              <div className="mx-auto mb-3">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-bold mb-3">Receive Orders</h3>
              <p className="text-gray-600">
                Get orders from customers and manage your inventory efficiently.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">4</span>
              </div>
              <div className="mx-auto mb-3">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-bold mb-3">Manage Delivery</h3>
              <p className="text-gray-600">
                Assign orders to delivery partners and track the delivery process.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* For Delivery Partners */}
      <section className="py-12 bg-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How TeamUp India Works for Delivery Partners</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">1</span>
              </div>
              <div className="mx-auto mb-3">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-bold mb-3">Sign Up</h3>
              <p className="text-gray-600">
                Register as a delivery partner and verify your identity and vehicle details.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">2</span>
              </div>
              <div className="mx-auto mb-3">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-bold mb-3">Set Availability</h3>
              <p className="text-gray-600">
                Indicate when you're available for deliveries in your preferred areas.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <div className="mx-auto mb-3">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-bold mb-3">Receive Assignments</h3>
              <p className="text-gray-600">
                Get delivery assignments based on your location and availability.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">4</span>
              </div>
              <div className="mx-auto mb-3">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-bold mb-3">Earn Money</h3>
              <p className="text-gray-600">
                Complete deliveries and track your earnings with transparent payment system.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Representation */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Visual Overview of Our Ecosystem</h2>
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex flex-col items-center">
              <div className="flex flex-col md:flex-row justify-between items-center w-full max-w-4xl mb-10">
                <div className="text-center mb-6 md:mb-0">
                  <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <div className="text-3xl text-red-500">⚽</div>
                  </div>
                  <p className="font-bold text-lg">Players</p>
                </div>
                <div className="text-4xl text-gray-400 mb-6 md:mb-0">⟷</div>
                <div className="text-center mb-6 md:mb-0">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <div className="text-3xl text-green-500">🎓</div>
                  </div>
                  <p className="font-bold text-lg">Coaches</p>
                </div>
                <div className="text-4xl text-gray-400 mb-6 md:mb-0">⟷</div>
                <div className="text-center mb-6 md:mb-0">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <div className="text-3xl text-blue-500">🏪</div>
                  </div>
                  <p className="font-bold text-lg">Stores</p>
                </div>
                <div className="text-4xl text-gray-400 mb-6 md:mb-0">⟷</div>
                <div className="text-center">
                  <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <div className="text-3xl text-purple-500">🚚</div>
                  </div>
                  <p className="font-bold text-lg">Delivery</p>
                </div>
              </div>
              <p className="text-center text-gray-700 max-w-2xl">
                TeamUp India creates a seamless connection between all stakeholders in the sports ecosystem. 
                Players find coaches, coaches get students, stores reach customers, and delivery partners 
                facilitate the exchange of goods - all in one integrated platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to Join Our Ecosystem?</h2>
          <p className="text-lg text-gray-700 mb-8">
            Whether you're a player, coach, store, or delivery partner, become part of India's premier sports ecosystem.
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
    </div>
  );
};

export default HowItWorksPage;