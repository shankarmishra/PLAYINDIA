import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/Layout';

const StoreDashboard = () => {
  return (
    <Layout title="Store Dashboard - TeamUp India" description="Manage your sports store on TeamUp India" showNav={false}>
      {/* Store Navigation */}
      <nav className="bg-gray-900 text-white py-4 px-6 flex justify-between items-center">
        <div className="text-xl font-bold text-red-400">TeamUp India Store</div>
        <div className="flex space-x-6">
          <Link href="/store" className="hover:text-red-400">Dashboard</Link>
          <Link href="/store/products" className="hover:text-red-400">Products</Link>
          <Link href="/store/orders" className="hover:text-red-400">Orders</Link>
          <Link href="/store/inventory" className="hover:text-red-400">Inventory</Link>
          <Link href="/store/analytics" className="hover:text-red-400">Analytics</Link>
          <Link href="/store/profile" className="hover:text-red-400">Profile</Link>
          <Link href="/store/settings" className="hover:text-red-400">Settings</Link>
          <Link href="/logout" className="hover:text-red-400">Logout</Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-8 px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Hi Store Owner, Welcome Back!</h1>
          <p className="text-gray-600">Manage your sports store and track your sales</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">Total Products</h3>
            <p className="text-3xl font-bold text-red-600">42</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">Today's Orders</h3>
            <p className="text-3xl font-bold text-green-600">8</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">Monthly Revenue</h3>
            <p className="text-3xl font-bold text-blue-600">₹1,24,500</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">Pending Orders</h3>
            <p className="text-3xl font-bold text-yellow-600">3</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/store/products/add" className="bg-gray-100 hover:bg-gray-200 p-4 rounded-lg text-center transition duration-300">
              <div className="text-2xl mb-2">➕</div>
              <h3 className="font-semibold">Add Product</h3>
            </Link>
            <Link href="/store/orders" className="bg-gray-100 hover:bg-gray-200 p-4 rounded-lg text-center transition duration-300">
              <div className="text-2xl mb-2">📦</div>
              <h3 className="font-semibold">View Orders</h3>
            </Link>
            <Link href="/store/inventory" className="bg-gray-100 hover:bg-gray-200 p-4 rounded-lg text-center transition duration-300">
              <div className="text-2xl mb-2">📊</div>
              <h3 className="font-semibold">Manage Inventory</h3>
            </Link>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
            <Link href="/store/orders" className="text-red-600 hover:underline">View All</Link>
          </div>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">#ORD-001</td>
                  <td className="px-6 py-4 whitespace-nowrap">Rahul Sharma</td>
                  <td className="px-6 py-4 whitespace-nowrap">Jan 10, 2026</td>
                  <td className="px-6 py-4 whitespace-nowrap">₹2,450</td>
                  <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Delivered</span></td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <Link href="/store/orders/1" className="text-red-600 hover:underline">View</Link>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">#ORD-002</td>
                  <td className="px-6 py-4 whitespace-nowrap">Priya Patel</td>
                  <td className="px-6 py-4 whitespace-nowrap">Jan 10, 2026</td>
                  <td className="px-6 py-4 whitespace-nowrap">₹1,200</td>
                  <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Processing</span></td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <Link href="/store/orders/2" className="text-red-600 hover:underline">View</Link>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">#ORD-003</td>
                  <td className="px-6 py-4 whitespace-nowrap">Amit Kumar</td>
                  <td className="px-6 py-4 whitespace-nowrap">Jan 11, 2026</td>
                  <td className="px-6 py-4 whitespace-nowrap">₹3,750</td>
                  <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">Shipped</span></td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <Link href="/store/orders/3" className="text-red-600 hover:underline">View</Link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Selling Products */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Top Selling Products</h2>
            <Link href="/store/products" className="text-red-600 hover:underline">View All</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-bold text-lg mb-2">Cricket Bat</h3>
              <p className="text-gray-600 mb-2">Brand: SG</p>
              <p className="text-gray-600 mb-4">Price: ₹1,200</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Sold: 24 units</span>
                <Link href="/store/products/1" className="text-red-600 hover:underline text-sm">Edit</Link>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-bold text-lg mb-2">Tennis Racket</h3>
              <p className="text-gray-600 mb-2">Brand: Wilson</p>
              <p className="text-gray-600 mb-4">Price: ₹2,500</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Sold: 18 units</span>
                <Link href="/store/products/2" className="text-red-600 hover:underline text-sm">Edit</Link>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-bold text-lg mb-2">Badminton Set</h3>
              <p className="text-gray-600 mb-2">Brand: Yonex</p>
              <p className="text-gray-600 mb-4">Price: ₹1,800</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Sold: 15 units</span>
                <Link href="/store/products/3" className="text-red-600 hover:underline text-sm">Edit</Link>
              </div>
            </div>
          </div>
        </div>

        {/* 3D Product Visualization */}
        <div className="mt-12 bg-gradient-to-r from-blue-900 to-purple-900 text-white p-8 rounded-xl">
          <h2 className="text-2xl font-bold mb-6 text-center">3D Product Visualization & Customer Experience</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg text-center">
              <div className="bg-gray-300 border-2 border-dashed rounded-xl w-full h-32 mx-auto mb-3 flex items-center justify-center">
                <span className="text-gray-500">3D Cricket Bat</span>
              </div>
              <h3 className="font-bold mb-1 text-white">3D Cricket Arena</h3>
              <p className="text-sm text-gray-200">Virtual training</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg text-center">
              <div className="bg-gray-300 border-2 border-dashed rounded-xl w-full h-32 mx-auto mb-3 flex items-center justify-center">
                <span className="text-gray-500">3D Football</span>
              </div>
              <h3 className="font-bold mb-1 text-white">3D Football Field</h3>
              <p className="text-sm text-gray-200">Virtual training</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg text-center">
              <div className="bg-gray-300 border-2 border-dashed rounded-xl w-full h-32 mx-auto mb-3 flex items-center justify-center">
                <span className="text-gray-500">3D Tennis Racket</span>
              </div>
              <h3 className="font-bold mb-1 text-white">3D Tennis Court</h3>
              <p className="text-sm text-gray-200">Virtual training</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg text-center">
              <div className="bg-gray-300 border-2 border-dashed rounded-xl w-full h-32 mx-auto mb-3 flex items-center justify-center">
                <span className="text-gray-500">3D Badminton Racket</span>
              </div>
              <h3 className="font-bold mb-1 text-white">3D Badminton Hall</h3>
              <p className="text-sm text-gray-200">Virtual training</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/10 p-4 rounded-lg">
              <h3 className="font-bold mb-2 text-center">Customer Engagement</h3>
              <div className="h-32 flex items-center justify-center">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-20 flex items-center justify-center">
                  <span className="text-gray-700 text-sm">Engagement Chart</span>
                </div>
              </div>
            </div>
            <div className="bg-white/10 p-4 rounded-lg">
              <h3 className="font-bold mb-2 text-center">3D Product Views</h3>
              <div className="h-32 flex items-center justify-center">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-20 flex items-center justify-center">
                  <span className="text-gray-700 text-sm">3D Views Chart</span>
                </div>
              </div>
            </div>
            <div className="bg-white/10 p-4 rounded-lg">
              <h3 className="font-bold mb-2 text-center">Sales Conversion</h3>
              <div className="h-32 flex items-center justify-center">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-20 flex items-center justify-center">
                  <span className="text-gray-700 text-sm">Conversion Chart</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <p className="mb-4">Offer immersive 3D sports experiences to your customers to boost engagement and sales</p>
            <div className="flex justify-center space-x-4">
              <Link href="/contact" className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg">
                Learn More
              </Link>
              <Link href="/store/3d-products" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">
                Manage 3D Products
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default StoreDashboard;