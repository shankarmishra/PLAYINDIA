import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

const AboutPage = () => {
  return (
    <div>
      <Head>
        <title>About Us - TeamUp India</title>
        <meta name="description" content="Learn about TeamUp India's mission to connect the sports ecosystem in India" />
      </Head>

      {/* Hero Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About TeamUp India</h1>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto">
            Connecting the sports ecosystem across India - Players, Coaches, Stores, and Delivery Partners
          </p>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Vision</h2>
              <p className="text-lg text-gray-700 mb-6">
                To create the most comprehensive sports ecosystem in India that connects all stakeholders in the sports industry - 
                from grassroots players to professional coaches, from local sports stores to delivery partners ensuring seamless 
                experiences for everyone involved.
              </p>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-700">
                We are committed to making sports accessible, affordable, and enjoyable for everyone in India. 
                By connecting players with the right coaches, stores with customers, and delivery partners with 
                businesses, we're building a platform that enables growth, development, and success in the sports industry.
              </p>
            </div>
            <div className="flex justify-center">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-96" />
            </div>
          </div>
        </div>
      </section>

      {/* Problem We Solve */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">The Problem We Solve</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="text-4xl mb-4 text-red-500">🔍</div>
              <h3 className="text-xl font-bold mb-3">Finding the Right Coach</h3>
              <p className="text-gray-600">
                Players struggle to find verified, experienced coaches in their locality with the right expertise for their sport.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="text-4xl mb-4 text-green-500">🏪</div>
              <h3 className="text-xl font-bold mb-3">Access to Quality Equipment</h3>
              <p className="text-gray-600">
                Getting access to quality sports equipment from verified stores with reliable delivery options.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="text-4xl mb-4 text-blue-500">🤝</div>
              <h3 className="text-xl font-bold mb-3">Connecting the Ecosystem</h3>
              <p className="text-gray-600">
                Creating a unified platform where all sports stakeholders can connect, collaborate, and grow together.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why TeamUp India */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Why TeamUp India is Different</h2>
          <div className="space-y-12">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="md:w-1/3">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-64" />
              </div>
              <div className="md:w-2/3">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Verified Profiles</h3>
                <p className="text-gray-700">
                  All coaches, stores, and delivery partners on our platform are thoroughly verified to ensure 
                  quality and trust. We check credentials, certifications, and conduct background verification 
                  to provide a safe environment for everyone.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row-reverse items-center gap-8">
              <div className="md:w-1/3">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-64" />
              </div>
              <div className="md:w-2/3">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Comprehensive Ecosystem</h3>
                <p className="text-gray-700">
                  Unlike other platforms that focus on a single aspect, TeamUp India connects all stakeholders 
                  in the sports ecosystem - players, coaches, stores, and delivery partners - in one unified platform.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="md:w-1/3">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-64" />
              </div>
              <div className="md:w-2/3">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Technology-Driven Solutions</h3>
                <p className="text-gray-700">
                  We leverage advanced technology to match players with the right coaches, optimize delivery routes, 
                  and provide analytics for all stakeholders to grow their business effectively.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Founders Message */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Message from Our Founders</h2>
          <div className="max-w-3xl mx-auto">
            <p className="text-lg text-gray-700 italic mb-6">
              "We started TeamUp India with a simple vision - to make sports accessible to everyone in India. 
              Having experienced the challenges of finding the right coach, quality equipment, and reliable 
              delivery services ourselves, we knew there had to be a better way. Today, we're proud to connect 
              thousands of players, coaches, stores, and delivery partners across India, creating opportunities 
              for growth and success in the sports industry."
            </p>
            <p className="text-gray-900 font-semibold">- The TeamUp India Founders</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Join Our Sports Ecosystem</h2>
          <p className="text-lg text-gray-700 mb-8">
            Whether you're a player looking for coaching, a coach building your business, 
            a store expanding your customer base, or a delivery partner looking for opportunities, 
            TeamUp India is the platform for you.
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

export default AboutPage;