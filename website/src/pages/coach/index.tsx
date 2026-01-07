import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/Layout';

const CoachDashboard = () => {
  return (
    <Layout title="Coach Dashboard - TeamUp India" description="Manage your coaching business on TeamUp India" showNav={false}>
      {/* Coach Navigation */}
      <nav className="bg-gray-900 text-white py-4 px-6 flex justify-between items-center">
        <div className="text-xl font-bold text-red-400">TeamUp India Coach</div>
        <div className="flex space-x-6">
          <Link href="/coach" className="hover:text-red-400">Dashboard</Link>
          <Link href="/coach/availability" className="hover:text-red-400">Availability</Link>
          <Link href="/coach/bookings" className="hover:text-red-400">Bookings</Link>
          <Link href="/coach/tournaments" className="hover:text-red-400">Tournaments</Link>
          <Link href="/coach/profile" className="hover:text-red-400">Profile</Link>
          <Link href="/coach/earnings" className="hover:text-red-400">Earnings</Link>
          <Link href="/coach/settings" className="hover:text-red-400">Settings</Link>
          <Link href="/logout" className="hover:text-red-400">Logout</Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-8 px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Hi Coach, Welcome Back!</h1>
          <p className="text-gray-600">Manage your coaching business and track your performance</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">Today's Sessions</h3>
            <p className="text-3xl font-bold text-red-600">3</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">Monthly Earnings</h3>
            <p className="text-3xl font-bold text-green-600">₹24,500</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">Rating</h3>
            <p className="text-3xl font-bold text-yellow-600">4.8 ⭐</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">Pending Requests</h3>
            <p className="text-3xl font-bold text-blue-600">5</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/coach/availability" className="bg-gray-100 hover:bg-gray-200 p-4 rounded-lg text-center transition duration-300">
              <div className="text-2xl mb-2">📅</div>
              <h3 className="font-semibold">Set Availability</h3>
            </Link>
            <Link href="/coach/tournaments/create" className="bg-gray-100 hover:bg-gray-200 p-4 rounded-lg text-center transition duration-300">
              <div className="text-2xl mb-2">🏆</div>
              <h3 className="font-semibold">Create Tournament</h3>
            </Link>
            <Link href="/coach/withdraw" className="bg-gray-100 hover:bg-gray-200 p-4 rounded-lg text-center transition duration-300">
              <div className="text-2xl mb-2">💰</div>
              <h3 className="font-semibold">Withdraw Earnings</h3>
            </Link>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Recent Bookings</h2>
            <Link href="/coach/bookings" className="text-red-600 hover:underline">View All</Link>
          </div>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Player</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sport</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">Rahul Sharma</td>
                  <td className="px-6 py-4 whitespace-nowrap">Cricket</td>
                  <td className="px-6 py-4 whitespace-nowrap">Jan 10, 2026 - 10:00 AM</td>
                  <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Confirmed</span></td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <Link href="/coach/bookings/1" className="text-red-600 hover:underline">View</Link>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">Priya Patel</td>
                  <td className="px-6 py-4 whitespace-nowrap">Tennis</td>
                  <td className="px-6 py-4 whitespace-nowrap">Jan 10, 2026 - 02:00 PM</td>
                  <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Pending</span></td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <Link href="/coach/bookings/2" className="text-red-600 hover:underline">View</Link>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">Amit Kumar</td>
                  <td className="px-6 py-4 whitespace-nowrap">Badminton</td>
                  <td className="px-6 py-4 whitespace-nowrap">Jan 11, 2026 - 06:00 PM</td>
                  <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">Requested</span></td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <Link href="/coach/bookings/3" className="text-red-600 hover:underline">View</Link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Upcoming Tournaments */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Upcoming Tournaments</h2>
            <Link href="/coach/tournaments" className="text-red-600 hover:underline">View All</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-bold text-lg mb-2">Summer Cricket League</h3>
              <p className="text-gray-600 mb-2">Date: Jan 15, 2026</p>
              <p className="text-gray-600 mb-4">Venue: Central Park Ground</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">4 Teams Registered</span>
                <Link href="/coach/tournaments/1" className="text-red-600 hover:underline text-sm">Manage</Link>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-bold text-lg mb-2">Tennis Championship</h3>
              <p className="text-gray-600 mb-2">Date: Jan 20, 2026</p>
              <p className="text-gray-600 mb-4">Venue: City Tennis Club</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">8 Players Registered</span>
                <Link href="/coach/tournaments/2" className="text-red-600 hover:underline text-sm">Manage</Link>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-bold text-lg mb-2">Badminton Open</h3>
              <p className="text-gray-600 mb-2">Date: Jan 25, 2026</p>
              <p className="text-gray-600 mb-4">Venue: Sports Complex</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">12 Players Registered</span>
                <Link href="/coach/tournaments/3" className="text-red-600 hover:underline text-sm">Manage</Link>
              </div>
            </div>
          </div>
        </div>

        {/* 3D Training Modules */}
        <div className="mt-12 bg-gradient-to-r from-blue-900 to-purple-900 text-white p-8 rounded-xl">
          <h2 className="text-2xl font-bold mb-6 text-center">3D Training Modules & Analytics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg text-center">
              <div className="bg-gray-300 border-2 border-dashed rounded-xl w-full h-32 mx-auto mb-3 flex items-center justify-center">
                <span className="text-gray-500">3D Cricket</span>
              </div>
              <h3 className="font-bold mb-1 text-white">Cricket Simulator</h3>
              <p className="text-sm text-gray-200">Batting/pitching practice</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg text-center">
              <div className="bg-gray-300 border-2 border-dashed rounded-xl w-full h-32 mx-auto mb-3 flex items-center justify-center">
                <span className="text-gray-500">3D Football</span>
              </div>
              <h3 className="font-bold mb-1 text-white">Football Trainer</h3>
              <p className="text-sm text-gray-200">Dribbling/shooting practice</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg text-center">
              <div className="bg-gray-300 border-2 border-dashed rounded-xl w-full h-32 mx-auto mb-3 flex items-center justify-center">
                <span className="text-gray-500">3D Tennis</span>
              </div>
              <h3 className="font-bold mb-1 text-white">Tennis Court</h3>
              <p className="text-sm text-gray-200">Serving/rally practice</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg text-center">
              <div className="bg-gray-300 border-2 border-dashed rounded-xl w-full h-32 mx-auto mb-3 flex items-center justify-center">
                <span className="text-gray-500">3D Badminton</span>
              </div>
              <h3 className="font-bold mb-1 text-white">Badminton Arena</h3>
              <p className="text-sm text-gray-200">Serving/smashing practice</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/10 p-4 rounded-lg">
              <h3 className="font-bold mb-2 text-center">Player Progress</h3>
              <div className="h-32 flex items-center justify-center">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-20 flex items-center justify-center">
                  <span className="text-gray-700 text-sm">Progress Chart</span>
                </div>
              </div>
            </div>
            <div className="bg-white/10 p-4 rounded-lg">
              <h3 className="font-bold mb-2 text-center">Session Analytics</h3>
              <div className="h-32 flex items-center justify-center">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-20 flex items-center justify-center">
                  <span className="text-gray-700 text-sm">Analytics Chart</span>
                </div>
              </div>
            </div>
            <div className="bg-white/10 p-4 rounded-lg">
              <h3 className="font-bold mb-2 text-center">Training Effectiveness</h3>
              <div className="h-32 flex items-center justify-center">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-20 flex items-center justify-center">
                  <span className="text-gray-700 text-sm">Effectiveness Chart</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <p className="mb-4">Enhance your coaching with immersive 3D sports training tools</p>
            <div className="flex justify-center space-x-4">
              <Link href="/contact" className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg">
                Learn More
              </Link>
              <Link href="/coach/3d-modules" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">
                Access Modules
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CoachDashboard;