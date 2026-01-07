import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/Layout';

const DeliveryDashboard = () => {
  return (
    <Layout title="Delivery Dashboard - TeamUp India" description="Manage your deliveries on TeamUp India" showNav={false}>
      {/* Delivery Navigation */}
      <nav className="bg-gray-900 text-white py-4 px-6 flex justify-between items-center">
        <div className="text-xl font-bold text-red-400">TeamUp India Delivery</div>
        <div className="flex space-x-6">
          <Link href="/delivery" className="hover:text-red-400">Dashboard</Link>
          <Link href="/delivery/active" className="hover:text-red-400">Active Deliveries</Link>
          <Link href="/delivery/history" className="hover:text-red-400">History</Link>
          <Link href="/delivery/earnings" className="hover:text-red-400">Earnings</Link>
          <Link href="/delivery/profile" className="hover:text-red-400">Profile</Link>
          <Link href="/delivery/documents" className="hover:text-red-400">Documents</Link>
          <Link href="/delivery/settings" className="hover:text-red-400">Settings</Link>
          <Link href="/logout" className="hover:text-red-400">Logout</Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-8 px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Hi Delivery Partner, Welcome Back!</h1>
          <p className="text-gray-600">Manage your deliveries and track your performance</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">Active Deliveries</h3>
            <p className="text-3xl font-bold text-red-600">2</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">Today's Earnings</h3>
            <p className="text-3xl font-bold text-green-600">₹1,250</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">Completed Today</h3>
            <p className="text-3xl font-bold text-blue-600">8</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">Avg. Rating</h3>
            <p className="text-3xl font-bold text-yellow-600">4.7 ⭐</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/delivery/active" className="bg-gray-100 hover:bg-gray-200 p-4 rounded-lg text-center transition duration-300">
              <div className="text-2xl mb-2">📦</div>
              <h3 className="font-semibold">View Active</h3>
            </Link>
            <Link href="/delivery/earnings" className="bg-gray-100 hover:bg-gray-200 p-4 rounded-lg text-center transition duration-300">
              <div className="text-2xl mb-2">💰</div>
              <h3 className="font-semibold">Track Earnings</h3>
            </Link>
            <Link href="/delivery/documents" className="bg-gray-100 hover:bg-gray-200 p-4 rounded-lg text-center transition duration-300">
              <div className="text-2xl mb-2">📄</div>
              <h3 className="font-semibold">Update Docs</h3>
            </Link>
          </div>
        </div>

        {/* Active Deliveries */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Active Deliveries</h2>
            <Link href="/delivery/active" className="text-red-600 hover:underline">View All</Link>
          </div>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destination</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Distance</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">#ORD-001</td>
                  <td className="px-6 py-4 whitespace-nowrap">Rahul Sharma</td>
                  <td className="px-6 py-4 whitespace-nowrap">Connaught Place, Delhi</td>
                  <td className="px-6 py-4 whitespace-nowrap">2.5 km</td>
                  <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Picked Up</span></td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <Link href="/delivery/active/1" className="text-red-600 hover:underline">Track</Link>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">#ORD-002</td>
                  <td className="px-6 py-4 whitespace-nowrap">Priya Patel</td>
                  <td className="px-6 py-4 whitespace-nowrap">Hauz Khas, Delhi</td>
                  <td className="px-6 py-4 whitespace-nowrap">4.2 km</td>
                  <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">In Transit</span></td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <Link href="/delivery/active/2" className="text-red-600 hover:underline">Track</Link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Earnings */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Recent Earnings</h2>
            <Link href="/delivery/earnings" className="text-red-600 hover:underline">View All</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-bold text-lg mb-2">Jan 10, 2026</h3>
              <p className="text-gray-600 mb-2">Deliveries Completed: 5</p>
              <p className="text-2xl font-bold text-green-600">₹750</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-bold text-lg mb-2">Jan 9, 2026</h3>
              <p className="text-gray-600 mb-2">Deliveries Completed: 7</p>
              <p className="text-2xl font-bold text-green-600">₹980</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-bold text-lg mb-2">Jan 8, 2026</h3>
              <p className="text-gray-600 mb-2">Deliveries Completed: 4</p>
              <p className="text-2xl font-bold text-green-600">₹600</p>
            </div>
          </div>
        </div>

        {/* 3D Delivery Experience */}
        <div className="mt-12 bg-gradient-to-r from-blue-900 to-purple-900 text-white p-8 rounded-xl">
          <h2 className="text-2xl font-bold mb-6 text-center">3D Sports Experience & Delivery Analytics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg text-center">
              <div className="bg-gray-300 border-2 border-dashed rounded-xl w-full h-32 mx-auto mb-3 flex items-center justify-center">
                <span className="text-gray-500">3D Cricket</span>
              </div>
              <h3 className="font-bold mb-1 text-white">Cricket Arena</h3>
              <p className="text-sm text-gray-200">Virtual training</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg text-center">
              <div className="bg-gray-300 border-2 border-dashed rounded-xl w-full h-32 mx-auto mb-3 flex items-center justify-center">
                <span className="text-gray-500">3D Football</span>
              </div>
              <h3 className="font-bold mb-1 text-white">Football Field</h3>
              <p className="text-sm text-gray-200">Virtual training</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg text-center">
              <div className="bg-gray-300 border-2 border-dashed rounded-xl w-full h-32 mx-auto mb-3 flex items-center justify-center">
                <span className="text-gray-500">3D Tennis</span>
              </div>
              <h3 className="font-bold mb-1 text-white">Tennis Court</h3>
              <p className="text-sm text-gray-200">Virtual training</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg text-center">
              <div className="bg-gray-300 border-2 border-dashed rounded-xl w-full h-32 mx-auto mb-3 flex items-center justify-center">
                <span className="text-gray-500">3D Badminton</span>
              </div>
              <h3 className="font-bold mb-1 text-white">Badminton Hall</h3>
              <p className="text-sm text-gray-200">Virtual training</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/10 p-4 rounded-lg">
              <h3 className="font-bold mb-2 text-center">Delivery Performance</h3>
              <div className="h-32 flex items-center justify-center">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-20 flex items-center justify-center">
                  <span className="text-gray-700 text-sm">Performance Chart</span>
                </div>
              </div>
            </div>
            <div className="bg-white/10 p-4 rounded-lg">
              <h3 className="font-bold mb-2 text-center">Customer Satisfaction</h3>
              <div className="h-32 flex items-center justify-center">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-20 flex items-center justify-center">
                  <span className="text-gray-700 text-sm">Satisfaction Chart</span>
                </div>
              </div>
            </div>
            <div className="bg-white/10 p-4 rounded-lg">
              <h3 className="font-bold mb-2 text-center">Route Optimization</h3>
              <div className="h-32 flex items-center justify-center">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-20 flex items-center justify-center">
                  <span className="text-gray-700 text-sm">Optimization Chart</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <p className="mb-4">Deliver 3D sports experiences to customers with their equipment</p>
            <div className="flex justify-center space-x-4">
              <Link href="/contact" className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg">
                Learn More
              </Link>
              <Link href="/delivery/3d-packages" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">
                Manage 3D Packages
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DeliveryDashboard;