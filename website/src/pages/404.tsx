import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/Layout';

const Custom404 = () => {
  return (
    <Layout title="Page Not Found - TeamUp India" description="The page you're looking for doesn't exist">
      <Head>
        <title>Page Not Found - TeamUp India</title>
        <meta name="description" content="The page you're looking for doesn't exist" />
      </Head>

      {/* 404 Hero */}
      <section className="py-20 px-6 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-6xl font-bold mb-6">404</h1>
          <h2 className="text-3xl font-bold mb-6">Page Not Found</h2>
          <p className="text-xl text-gray-300">Sorry, the page you're looking for doesn't exist</p>
        </div>
      </section>

      {/* 404 Content */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gray-50 p-8 rounded-xl border border-gray-200">
            <div className="text-6xl mb-6 text-red-500">🔍</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Oops! Page Not Found</h2>
            <p className="text-gray-600 mb-8">
              The page you're looking for might have been moved, deleted, or never existed in the first place. 
              Don't worry, you can find your way back to our main pages using the links below.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link href="/" className="bg-red-600 hover:bg-red-700 text-white py-3 px-8 rounded-lg font-semibold transition duration-300">
                Go to Home
              </Link>
              <Link href="/contact" className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 px-8 rounded-lg font-semibold transition duration-300">
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Suggested Pages */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Suggested Pages</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link href="/" className="bg-white p-6 rounded-xl shadow-sm text-center hover:shadow-md transition-shadow duration-300">
              <div className="text-4xl mb-4">🏠</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Home</h3>
              <p className="text-gray-600">Return to our main page</p>
            </Link>
            <Link href="/features" className="bg-white p-6 rounded-xl shadow-sm text-center hover:shadow-md transition-shadow duration-300">
              <div className="text-4xl mb-4">⭐</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Features</h3>
              <p className="text-gray-600">Explore our platform features</p>
            </Link>
            <Link href="/contact" className="bg-white p-6 rounded-xl shadow-sm text-center hover:shadow-md transition-shadow duration-300">
              <div className="text-4xl mb-4">📞</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Contact</h3>
              <p className="text-gray-600">Get in touch with support</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Support */}
      <section className="py-16 px-6 bg-gradient-to-r from-red-500 to-blue-500 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Need Help Finding Something?</h2>
          <p className="text-xl mb-8">Our support team is ready to help you navigate our platform.</p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link href="/help" className="bg-white text-red-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold transition duration-300">
              Help Center
            </Link>
            <Link href="/contact" className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-lg font-semibold transition duration-300">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Custom404;