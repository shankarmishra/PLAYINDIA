import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/Layout';

const ProfilePage = () => {
  return (
    <Layout title="Player Profile - TeamUp India" description="Manage your player profile on TeamUp India">
      <Head>
        <title>Player Profile - TeamUp India</title>
        <meta name="description" content="Manage your player profile on TeamUp India" />
      </Head>

      <div className="max-w-4xl mx-auto py-8 px-6">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-8">
            <div className="flex flex-col md:flex-row items-center">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-24 h-24 mb-4 md:mb-0 md:mr-6" />
              <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold">Rahul Sharma</h1>
                <p className="text-gray-300">Player • New Delhi</p>
                <div className="flex flex-wrap justify-center md:justify-start mt-2">
                  <span className="bg-red-600 text-white text-sm px-3 py-1 rounded-full mr-2 mb-2">Cricket</span>
                  <span className="bg-green-600 text-white text-sm px-3 py-1 rounded-full mr-2 mb-2">Football</span>
                  <span className="bg-blue-600 text-white text-sm px-3 py-1 rounded-full mr-2 mb-2">Tennis</span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button className="py-4 px-1 border-b-2 border-red-500 font-medium text-red-600">Profile</button>
              <button className="py-4 px-1 border-b-2 border-transparent font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">Activity</button>
              <button className="py-4 px-1 border-b-2 border-transparent font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">Bookings</button>
              <button className="py-4 px-1 border-b-2 border-transparent font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">Settings</button>
            </nav>
          </div>

          {/* Profile Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Left Column - Profile Info */}
              <div className="md:col-span-2">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Personal Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                    <p className="text-gray-900">Rahul Sharma</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="text-gray-900">rahul.sharma@example.com</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <p className="text-gray-900">+91 98765 43210</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Location</label>
                    <p className="text-gray-900">New Delhi, India</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Sports</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">Cricket</span>
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Football</span>
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Tennis</span>
                      <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">Badminton</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">About</label>
                    <p className="text-gray-900">
                      Passionate sports enthusiast with 5+ years of experience in cricket and football. 
                      Looking to improve my skills and connect with professional coaches.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column - Stats */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Player Stats</h2>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Bookings</span>
                      <span className="font-bold">12</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tournaments</span>
                      <span className="font-bold">3</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Purchases</span>
                      <span className="font-bold">8</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Reviews</span>
                      <span className="font-bold">5 ⭐</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Joined</span>
                      <span className="font-bold">Jan 2026</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <div className="bg-red-100 p-2 rounded-full mr-3">
                        <svg className="h-4 w-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-900">Booked cricket session with Coach Ajay</p>
                        <p className="text-xs text-gray-500">2 days ago</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-blue-100 p-2 rounded-full mr-3">
                        <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-900">Purchased cricket bat from Sports Hub</p>
                        <p className="text-xs text-gray-500">1 week ago</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-green-100 p-2 rounded-full mr-3">
                        <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-900">Joined Summer Cricket League</p>
                        <p className="text-xs text-gray-500">2 weeks ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex justify-end space-x-4">
              <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                Edit Profile
              </button>
              <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                Update Information
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;