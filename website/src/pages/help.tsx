import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

const HelpPage = () => {
  return (
    <div>
      <Head>
        <title>Help Center - TeamUp India</title>
        <meta name="description" content="Get help and support for TeamUp India platform" />
      </Head>

      {/* Hero Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Help Center</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Find answers to your questions or get in touch with our support team
          </p>
        </div>
      </section>

      {/* Search Bar */}
      <section className="py-8 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for help topics..."
              className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
            />
            <div className="absolute left-4 top-3.5">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Help Categories */}
      <section className="py-16 bg-white px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How can we help you?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Link href="/help/account" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="text-4xl mb-4 text-red-500">👤</div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Account Help</h3>
              <p className="text-gray-600">
                Registration, login, profile management, and account security
              </p>
            </Link>
            
            <Link href="/help/coach" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="text-4xl mb-4 text-green-500">👨‍🏫</div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Coach Support</h3>
              <p className="text-gray-600">
                Booking management, earnings, profile setup, and coaching tools
              </p>
            </Link>
            
            <Link href="/help/store" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="text-4xl mb-4 text-blue-500">🏪</div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Store Support</h3>
              <p className="text-gray-600">
                Product listings, orders, inventory, and sales management
              </p>
            </Link>
            
            <Link href="/help/delivery" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="text-4xl mb-4 text-purple-500">🚚</div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Delivery Support</h3>
              <p className="text-gray-600">
                Delivery assignments, earnings, and route optimization
              </p>
            </Link>
            
            <Link href="/help/payment" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="text-4xl mb-4 text-yellow-500">💳</div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Payment Issues</h3>
              <p className="text-gray-600">
                Payment methods, refunds, billing, and transaction history
              </p>
            </Link>
            
            <Link href="/help/technical" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="text-4xl mb-4 text-indigo-500">💻</div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Technical Support</h3>
              <p className="text-gray-600">
                App issues, website problems, and technical troubleshooting
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Help Topics */}
      <section className="py-16 bg-white px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Popular Help Topics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-bold text-gray-900 mb-3">How do I update my profile information?</h3>
              <p className="text-gray-600 mb-4">
                Learn how to update your personal information, profile picture, and preferences.
              </p>
              <Link href="/help/profile-update" className="text-red-600 font-medium hover:underline">Learn more →</Link>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-bold text-gray-900 mb-3">How do I reset my password?</h3>
              <p className="text-gray-600 mb-4">
                Step-by-step guide to reset your password if you've forgotten it.
              </p>
              <Link href="/help/password-reset" className="text-red-600 font-medium hover:underline">Learn more →</Link>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-bold text-gray-900 mb-3">How do I cancel a booking?</h3>
              <p className="text-gray-600 mb-4">
                Information about canceling bookings and understanding cancellation policies.
              </p>
              <Link href="/help/booking-cancel" className="text-red-600 font-medium hover:underline">Learn more →</Link>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-bold text-gray-900 mb-3">How do I track my order?</h3>
              <p className="text-gray-600 mb-4">
                Learn how to track your sports equipment orders from purchase to delivery.
              </p>
              <Link href="/help/order-tracking" className="text-red-600 font-medium hover:underline">Learn more →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-16 bg-white px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Still need help?</h2>
          <p className="text-lg text-gray-700 mb-8">
            Our support team is here to assist you. Contact us through your preferred channel.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2">Phone Support</h3>
              <p className="text-gray-600">+91 98765 43210</p>
              <p className="text-gray-500 text-sm">Mon-Fri, 9AM-6PM</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2">Live Chat</h3>
              <p className="text-gray-600">Chat with our support team</p>
              <button className="mt-2 text-red-600 font-medium hover:underline">Start Chat</button>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2">Email Support</h3>
              <p className="text-gray-600">support@teamupindia.com</p>
              <p className="text-gray-500 text-sm">Response within 24 hours</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HelpPage;