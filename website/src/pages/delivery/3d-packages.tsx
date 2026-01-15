import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/Layout';

const Delivery3DPackagesPage = () => {
  return (
    <Layout title="3D Packages - TeamUp India Delivery" description="Manage 3D sports experience packages for deliveries">
      <Head>
        <title>3D Packages - TeamUp India Delivery</title>
        <meta name="description" content="Manage 3D sports experience packages for deliveries" />
      </Head>

      {/* Delivery Navigation */}
      <nav className="bg-gray-900 text-white py-4 px-6 flex justify-between items-center">
        <div className="text-xl font-bold text-red-400">TeamUp India Delivery</div>
        <div className="flex space-x-6">
          <Link href="/delivery" className="hover:text-red-400">Dashboard</Link>
          <Link href="/delivery/active" className="hover:text-red-400">Active Deliveries</Link>
          <Link href="/delivery/history" className="hover:text-red-400">History</Link>
          <Link href="/delivery/earnings" className="hover:text-red-400">Earnings</Link>
          <Link href="/delivery/3d-packages" className="hover:text-red-400 font-medium underline">3D Packages</Link>
          <Link href="/profile" className="hover:text-red-400">Profile</Link>
          <Link href="/logout" className="hover:text-red-400">Logout</Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-8 px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">3D Sports Experience Packages</h1>
          <p className="text-gray-600">Deliver immersive 3D sports experiences to customers with their equipment</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold text-gray-900 mb-4">3D Experience Packages</h2>
              <p className="text-gray-600 mb-6">Enhance your delivery service by providing customers with access to immersive 3D sports experiences along with their equipment</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border rounded-lg p-4">
                  <h3 className="font-bold text-lg">Starter Package</h3>
                  <p className="text-gray-600 text-sm mt-2">Basic 3D experience with 1 sport access</p>
                  <div className="mt-4">
                    <p className="text-sm"><span className="font-semibold">Duration:</span> 1 month</p>
                    <p className="text-sm"><span className="font-semibold">Sports:</span> 1</p>
                    <p className="text-sm"><span className="font-semibold">Cost:</span> ₹99</p>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="font-bold text-lg">Pro Package</h3>
                  <p className="text-gray-600 text-sm mt-2">Advanced 3D experience with 3 sport access</p>
                  <div className="mt-4">
                    <p className="text-sm"><span className="font-semibold">Duration:</span> 3 months</p>
                    <p className="text-sm"><span className="font-semibold">Sports:</span> 3</p>
                    <p className="text-sm"><span className="font-semibold">Cost:</span> ₹249</p>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="font-bold text-lg">Elite Package</h3>
                  <p className="text-gray-600 text-sm mt-2">Premium 3D experience with all sport access</p>
                  <div className="mt-4">
                    <p className="text-sm"><span className="font-semibold">Duration:</span> 6 months</p>
                    <p className="text-sm"><span className="font-semibold">Sports:</span> All</p>
                    <p className="text-sm"><span className="font-semibold">Cost:</span> ₹499</p>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="font-bold text-lg">Team Package</h3>
                  <p className="text-gray-600 text-sm mt-2">Multi-user 3D experience for teams</p>
                  <div className="mt-4">
                    <p className="text-sm"><span className="font-semibold">Duration:</span> 3 months</p>
                    <p className="text-sm"><span className="font-semibold">Users:</span> Up to 10</p>
                    <p className="text-sm"><span className="font-semibold">Cost:</span> ₹899</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Benefits</h2>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Higher delivery value proposition</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Additional income opportunities</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Enhanced customer satisfaction</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Competitive advantage</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Partnership with sports ecosystem</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md mt-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Statistics</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Packages delivered</span>
                    <span>842</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '72%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Customer satisfaction</span>
                    <span>4.7/5</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '94%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Repeat customers</span>
                    <span>68%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: '68%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent 3D Package Deliveries</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Package</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivery Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Earnings</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">ORD-001234</td>
                  <td className="px-6 py-4 whitespace-nowrap">Rahul Sharma</td>
                  <td className="px-6 py-4 whitespace-nowrap">Pro Package</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Delivered</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">May 15, 2024</td>
                  <td className="px-6 py-4 whitespace-nowrap">₹249</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">ORD-001233</td>
                  <td className="px-6 py-4 whitespace-nowrap">Priya Patel</td>
                  <td className="px-6 py-4 whitespace-nowrap">Starter Package</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">In Transit</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">May 14, 2024</td>
                  <td className="px-6 py-4 whitespace-nowrap">₹99</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">ORD-001232</td>
                  <td className="px-6 py-4 whitespace-nowrap">Amit Kumar</td>
                  <td className="px-6 py-4 whitespace-nowrap">Elite Package</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Processing</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">May 12, 2024</td>
                  <td className="px-6 py-4 whitespace-nowrap">₹499</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">ORD-001231</td>
                  <td className="px-6 py-4 whitespace-nowrap">Sneha Gupta</td>
                  <td className="px-6 py-4 whitespace-nowrap">Team Package</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Delivered</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">May 10, 2024</td>
                  <td className="px-6 py-4 whitespace-nowrap">₹899</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Delivery3DPackagesPage;