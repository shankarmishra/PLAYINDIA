import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/Layout';

const RegistrationStatusPage = () => {
  return (
    <Layout title="Registration Status - TeamUp India" description="Track your registration status for coach, store, or delivery partner on TeamUp India">
      <Head>
        <title>Registration Status - TeamUp India</title>
        <meta name="description" content="Track your registration status for coach, store, or delivery partner on TeamUp India" />
      </Head>

      {/* Hero Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Registration Status</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Track your application status for coach, store, or delivery partner registration
          </p>
        </div>
      </section>

      {/* Status Tracking */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Track Your Application</h2>
            
            <div className="mb-8">
              <label className="block text-gray-700 mb-2">Enter Your Application ID or Email</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter application ID or email"
                  className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                />
                <button className="bg-red-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-700">
                  Track
                </button>
              </div>
            </div>
            
            {/* Application Status */}
            <div className="border border-gray-200 rounded-lg p-6 mb-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Rahul Sharma</h3>
                  <p className="text-gray-600">Application ID: COACH-2026-001234</p>
                  <p className="text-gray-600">Registration Type: Coach</p>
                </div>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">
                  Under Review
                </span>
              </div>
              
              <div className="mb-6">
                <h4 className="font-bold text-gray-900 mb-3">Application Progress</h4>
                <div className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">✓</div>
                    <span className="mt-2 text-sm text-gray-700">Submitted</span>
                  </div>
                  <div className="h-1 w-16 bg-gray-300"></div>
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center text-white font-bold">2</div>
                    <span className="mt-2 text-sm text-gray-700">Under Review</span>
                  </div>
                  <div className="h-1 w-16 bg-gray-300"></div>
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold">3</div>
                    <span className="mt-2 text-sm text-gray-700">Approved</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-bold text-gray-900 mb-2">Required Documents</h4>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center mr-2">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span>Aadhaar Card - Verified</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center mr-2">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span>PAN Card - Verified</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center mr-2">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span>Coaching Certificate - Verified</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-5 h-5 rounded-full bg-gray-300 flex items-center justify-center mr-2">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span>Bank Details - Pending Review</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                Your application is currently under review. Our team will verify your documents and credentials.
                You will receive an email notification once your application status changes.
              </p>
              <p className="text-sm text-gray-500">
                Expected review time: 3-5 business days
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Application Status Guide */}
      <section className="py-16 bg-gray-100 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Application Status Guide</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4 text-center">📝</div>
              <h3 className="text-xl font-bold text-center mb-3 text-gray-900">Pending / Under Review</h3>
              <p className="text-gray-600 text-center">
                Your application has been received and is currently being reviewed by our team. 
                Please allow 3-5 business days for the review process.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4 text-center">✅</div>
              <h3 className="text-xl font-bold text-center mb-3 text-gray-900">Approved</h3>
              <p className="text-gray-600 text-center">
                Your application has been approved. You will receive login credentials via email 
                to access your dashboard and start using our platform.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4 text-center">❌</div>
              <h3 className="text-xl font-bold text-center mb-3 text-gray-900">Rejected</h3>
              <p className="text-gray-600 text-center">
                Your application has been rejected. You will receive an email explaining the reason 
                and steps to reapply if applicable.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Need Help with Your Application?</h2>
          <p className="text-lg text-gray-700 mb-8">
            Our support team is ready to assist you with any questions about your registration status.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Contact Support</h3>
              <p className="text-gray-600 mb-4">
                Have questions about your application status?
              </p>
              <Link href="/contact" className="inline-block bg-red-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-700">
                Contact Us
              </Link>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-gray-900 mb-3">FAQ</h3>
              <p className="text-gray-600 mb-4">
                Find answers to common questions about registration.
              </p>
              <Link href="/help" className="inline-block bg-gray-800 text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-900">
                Visit Help Center
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3D Sports Models Section */}
      <section className="py-16 px-6 bg-gradient-to-r from-blue-900 to-purple-900 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">3D Sports Experience Awaits</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-48 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">3D Cricket Training</h3>
              <p className="text-gray-300">Advanced cricket training simulations</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-48 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">3D Football Training</h3>
              <p className="text-gray-300">Virtual football skill development</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-48 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">3D Tennis Training</h3>
              <p className="text-gray-300">Immersive tennis coaching modules</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-48 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">3D Badminton Training</h3>
              <p className="text-gray-300">Advanced badminton technique training</p>
            </div>
          </div>
          
          <div className="mt-12">
            <p className="text-xl mb-6">Join our platform and experience the future of sports training</p>
            <Link href="/register" className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300">
              Register Now
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default RegistrationStatusPage;