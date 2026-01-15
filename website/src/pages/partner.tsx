import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

const PartnerPage = () => {
  return (
    <div>
      <Head>
        <title>Partner with Us - TeamUp India</title>
        <meta name="description" content="Learn about partnership and franchise opportunities with TeamUp India" />
      </Head>

      {/* Hero Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Partner with TeamUp India</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Join our network of PlayPoints and become part of India's premier sports ecosystem
          </p>
        </div>
      </section>

      {/* What are PlayPoints */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">What are PlayPoints?</h2>
              <p className="text-lg text-gray-700 mb-6">
                PlayPoints are our physical touchpoints across India that serve as sports hubs for the local community. 
                These are strategically located centers that provide access to coaches, equipment, and sports facilities.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="flex-shrink-0 bg-red-100 p-1 rounded-full mr-3">
                    <svg className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Centralized sports facilities in local communities</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 bg-red-100 p-1 rounded-full mr-3">
                    <svg className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Access to certified coaches and trainers</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 bg-red-100 p-1 rounded-full mr-3">
                    <svg className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Quality sports equipment and gear</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 bg-red-100 p-1 rounded-full mr-3">
                    <svg className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Tournament and event hosting capabilities</span>
                </li>
              </ul>
            </div>
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-96" />
          </div>
        </div>
      </section>

      {/* Franchise Benefits */}
      <section className="py-16 bg-white px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Franchise Benefits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Revenue Sharing</h3>
              <p className="text-gray-600">
                Attractive revenue sharing model with multiple income streams from coaching, equipment sales, and events.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Brand Support</h3>
              <p className="text-gray-600">
                Full brand support, marketing materials, and operational guidance to ensure success.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Network Access</h3>
              <p className="text-gray-600">
                Access to our entire network of coaches, players, and sports enthusiasts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How to Apply */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How to Apply</h2>
            <p className="text-lg text-gray-600">Join us as a PlayPoint franchise partner</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Application Process</h3>
              <div className="space-y-6">
                <div className="flex">
                  <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold mr-4">1</div>
                  <div>
                    <h4 className="font-bold text-gray-900">Submit Application</h4>
                    <p className="text-gray-600">Fill out the application form with your details and preferred location</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold mr-4">2</div>
                  <div>
                    <h4 className="font-bold text-gray-900">Document Verification</h4>
                    <p className="text-gray-600">Submit required documents for verification and background check</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold mr-4">3</div>
                  <div>
                    <h4 className="font-bold text-gray-900">Location Assessment</h4>
                    <p className="text-gray-600">Our team evaluates the potential location for the PlayPoint</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold mr-4">4</div>
                  <div>
                    <h4 className="font-bold text-gray-900">Agreement Signing</h4>
                    <p className="text-gray-600">Sign the franchise agreement and begin setup process</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Apply Now</h3>
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                    placeholder="Enter your email"
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                    placeholder="Enter your phone number"
                  />
                </div>
                
                <div>
                  <label htmlFor="location" className="block text-gray-700 mb-2">Preferred Location</label>
                  <input
                    type="text"
                    id="location"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                    placeholder="Enter city/area where you want to establish PlayPoint"
                  />
                </div>
                
                <div>
                  <label htmlFor="investment" className="block text-gray-700 mb-2">Investment Capacity</label>
                  <select id="investment" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500">
                    <option>Select investment capacity</option>
                    <option>₹5 Lakhs - ₹10 Lakhs</option>
                    <option>₹10 Lakhs - ₹25 Lakhs</option>
                    <option>₹25 Lakhs - ₹50 Lakhs</option>
                    <option>Above ₹50 Lakhs</option>
                  </select>
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-red-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-red-700 transition duration-300"
                >
                  Submit Application
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-16 bg-white px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Requirements to Partner</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-4xl mb-4 text-red-500">💼</div>
              <h3 className="text-lg font-bold mb-3 text-gray-900">Business Experience</h3>
              <p className="text-gray-600 text-sm">
                Prior experience in sports, fitness, retail, or service industry preferred
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-4xl mb-4 text-green-500">💰</div>
              <h3 className="text-lg font-bold mb-3 text-gray-900">Investment</h3>
              <p className="text-gray-600 text-sm">
                Minimum investment capacity of ₹5 Lakhs for a PlayPoint setup
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-4xl mb-4 text-blue-500">📍</div>
              <h3 className="text-lg font-bold mb-3 text-gray-900">Location</h3>
              <p className="text-gray-600 text-sm">
                Access to high-traffic area with good connectivity and parking
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-4xl mb-4 text-purple-500">🤝</div>
              <h3 className="text-lg font-bold mb-3 text-gray-900">Commitment</h3>
              <p className="text-gray-600 text-sm">
                Long-term commitment to grow the sports ecosystem in your area
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3D Sports Models Section */}
      <section className="py-16 px-6 bg-gradient-to-r from-blue-900 to-purple-900 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">3D Sports Experience for Partners</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-48 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">3D Cricket Arena</h3>
              <p className="text-gray-300">Virtual cricket training for your customers</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-48 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">3D Football Field</h3>
              <p className="text-gray-300">Immersive football training environment</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-48 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">3D Tennis Court</h3>
              <p className="text-gray-300">Virtual tennis coaching experience</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-48 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">3D Badminton Hall</h3>
              <p className="text-gray-300">Advanced badminton training modules</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to Partner with TeamUp India?</h2>
          <p className="text-lg text-gray-700 mb-8">
            Join our PlayPoints network and be part of India's largest sports ecosystem.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="#apply" className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300">
              Apply Now
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

export default PartnerPage;