import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/Layout';

const AdminDashboard = () => {
  return (
    <Layout title="Admin Dashboard - TeamUp India" description="Admin dashboard for TeamUp India platform management" showNav={false}>
      {/* Admin Navigation */}
      <nav className="bg-gray-900 text-white py-4 px-6 flex justify-between items-center">
        <div className="text-xl font-bold text-red-400">TeamUp India Admin</div>
        <div className="flex space-x-6">
          <Link href="/admin" className="hover:text-red-400">Dashboard</Link>
          <Link href="/admin/approvals" className="hover:text-red-400">Approvals</Link>
          <Link href="/admin/users" className="hover:text-red-400">Users</Link>
          <Link href="/admin/analytics" className="hover:text-red-400">Analytics</Link>
          <Link href="/admin/commissions" className="hover:text-red-400">Commissions</Link>
          <Link href="/admin/cms" className="hover:text-red-400">CMS</Link>
          <Link href="/admin/settings" className="hover:text-red-400">Settings</Link>
          <Link href="/logout" className="hover:text-red-400">Logout</Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-8 px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Manage the TeamUp India platform and monitor performance</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">Total Users</h3>
            <p className="text-3xl font-bold text-red-600">52,430</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">Total Coaches</h3>
            <p className="text-3xl font-bold text-green-600">2,150</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">Total Stores</h3>
            <p className="text-3xl font-bold text-blue-600">520</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">Total Revenue</h3>
            <p className="text-3xl font-bold text-purple-600">₹2.4 Cr</p>
          </div>
        </div>

        {/* Platform Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Daily Activity</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span>New Users</span>
                  <span>124</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-red-600 h-2 rounded-full" style={{width: '65%'}}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span>Bookings</span>
                  <span>342</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{width: '80%'}}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span>Orders</span>
                  <span>187</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{width: '55%'}}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span>Deliveries</span>
                  <span>298</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{width: '72%'}}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Pending Approvals</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Coach Registrations</span>
                <span className="bg-yellow-100 text-yellow-800 text-sm font-medium px-2.5 py-0.5 rounded-full">24</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Store Registrations</span>
                <span className="bg-yellow-100 text-yellow-800 text-sm font-medium px-2.5 py-0.5 rounded-full">12</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Delivery Registrations</span>
                <span className="bg-yellow-100 text-yellow-800 text-sm font-medium px-2.5 py-0.5 rounded-full">31</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Content Updates</span>
                <span className="bg-yellow-100 text-yellow-800 text-sm font-medium px-2.5 py-0.5 rounded-full">5</span>
              </div>
              <div className="pt-4">
                <Link href="/admin/approvals" className="text-red-600 hover:underline font-medium">
                  Review All Approvals →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Link href="/admin/approvals" className="bg-gray-100 hover:bg-gray-200 p-4 rounded-lg text-center transition duration-300">
              <div className="text-2xl mb-2">✅</div>
              <h3 className="font-semibold">Approvals</h3>
            </Link>
            <Link href="/admin/users" className="bg-gray-100 hover:bg-gray-200 p-4 rounded-lg text-center transition duration-300">
              <div className="text-2xl mb-2">👥</div>
              <h3 className="font-semibold">User Management</h3>
            </Link>
            <Link href="/admin/cms" className="bg-gray-100 hover:bg-gray-200 p-4 rounded-lg text-center transition duration-300">
              <div className="text-2xl mb-2">📝</div>
              <h3 className="font-semibold">Content Management</h3>
            </Link>
            <Link href="/admin/analytics" className="bg-gray-100 hover:bg-gray-200 p-4 rounded-lg text-center transition duration-300">
              <div className="text-2xl mb-2">📊</div>
              <h3 className="font-semibold">Analytics</h3>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Platform Activity</h2>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">New Coach Registration</td>
                  <td className="px-6 py-4 whitespace-nowrap">Rahul Sharma</td>
                  <td className="px-6 py-4 whitespace-nowrap">Just now</td>
                  <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Pending</span></td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">New Store Registration</td>
                  <td className="px-6 py-4 whitespace-nowrap">Sports Hub Delhi</td>
                  <td className="px-6 py-4 whitespace-nowrap">2 mins ago</td>
                  <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Approved</span></td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">New Booking</td>
                  <td className="px-6 py-4 whitespace-nowrap">Priya Patel</td>
                  <td className="px-6 py-4 whitespace-nowrap">5 mins ago</td>
                  <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">Confirmed</span></td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">New Order</td>
                  <td className="px-6 py-4 whitespace-nowrap">Amit Kumar</td>
                  <td className="px-6 py-4 whitespace-nowrap">8 mins ago</td>
                  <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">Processing</span></td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">Content Update</td>
                  <td className="px-6 py-4 whitespace-nowrap">Admin</td>
                  <td className="px-6 py-4 whitespace-nowrap">12 mins ago</td>
                  <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">Published</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Platform 3D Assets */}
        <div className="mt-12 bg-gradient-to-r from-blue-900 to-purple-900 text-white p-8 rounded-xl">
          <h2 className="text-2xl font-bold mb-6 text-center">Platform 3D Assets & Analytics</h2>
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
              <h3 className="font-bold mb-2 text-center">Model Performance</h3>
              <div className="h-32 flex items-center justify-center">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-20 flex items-center justify-center">
                  <span className="text-gray-700 text-sm">Performance Chart</span>
                </div>
              </div>
            </div>
            <div className="bg-white/10 p-4 rounded-lg">
              <h3 className="font-bold mb-2 text-center">Usage Analytics</h3>
              <div className="h-32 flex items-center justify-center">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-20 flex items-center justify-center">
                  <span className="text-gray-700 text-sm">Analytics Chart</span>
                </div>
              </div>
            </div>
            <div className="bg-white/10 p-4 rounded-lg">
              <h3 className="font-bold mb-2 text-center">User Engagement</h3>
              <div className="h-32 flex items-center justify-center">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-20 flex items-center justify-center">
                  <span className="text-gray-700 text-sm">Engagement Chart</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <p className="mb-4">Manage and deploy immersive 3D sports experiences across the platform</p>
            <div className="flex justify-center space-x-4">
              <Link href="/admin/cms" className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg">
                Manage 3D Content
              </Link>
              <Link href="/admin/analytics" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">
                View Analytics
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;