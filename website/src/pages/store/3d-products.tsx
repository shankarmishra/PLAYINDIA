import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/Layout';

const Store3DProductsPage = () => {
  return (
    <Layout title="3D Products - TeamUp India Store" description="Manage 3D sports experiences for your customers">
      <Head>
        <title>3D Products - TeamUp India Store</title>
        <meta name="description" content="Manage 3D sports experiences for your customers" />
      </Head>

      {/* Store Navigation */}
      <nav className="bg-gray-900 text-white py-4 px-6 flex justify-between items-center">
        <div className="text-xl font-bold text-red-400">TeamUp India Store</div>
        <div className="flex space-x-6">
          <Link href="/store" className="hover:text-red-400">Dashboard</Link>
          <Link href="/store/products" className="hover:text-red-400">Products</Link>
          <Link href="/store/orders" className="hover:text-red-400">Orders</Link>
          <Link href="/store/inventory" className="hover:text-red-400">Inventory</Link>
          <Link href="/store/analytics" className="hover:text-red-400">Analytics</Link>
          <Link href="/store/3d-products" className="hover:text-red-400 font-medium underline">3D Products</Link>
          <Link href="/profile" className="hover:text-red-400">Profile</Link>
          <Link href="/logout" className="hover:text-red-400">Logout</Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-8 px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">3D Sports Products</h1>
          <p className="text-gray-600">Offer immersive 3D sports experiences to your customers</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold text-gray-900 mb-4">3D Sports Experience Packages</h2>
              <p className="text-gray-600 mb-6">Enhance your product offerings with virtual 3D sports experiences that customers can access with their purchases</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border rounded-lg p-4">
                  <h3 className="font-bold text-lg">Cricket VR Experience</h3>
                  <p className="text-gray-600 text-sm mt-2">Virtual batting and bowling practice with professional coaching</p>
                  <div className="mt-4">
                    <p className="text-sm"><span className="font-semibold">Included with:</span> Bats, Helmets</p>
                    <p className="text-sm"><span className="font-semibold">Duration:</span> 3 months access</p>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="font-bold text-lg">Football Training Module</h3>
                  <p className="text-gray-600 text-sm mt-2">Virtual dribbling and shooting practice</p>
                  <div className="mt-4">
                    <p className="text-sm"><span className="font-semibold">Included with:</span> Footballs, Shin Guards</p>
                    <p className="text-sm"><span className="font-semibold">Duration:</span> 2 months access</p>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="font-bold text-lg">Tennis Skill Builder</h3>
                  <p className="text-gray-600 text-sm mt-2">Virtual coaching for serves and groundstrokes</p>
                  <div className="mt-4">
                    <p className="text-sm"><span className="font-semibold">Included with:</span> Rackets, Balls</p>
                    <p className="text-sm"><span className="font-semibold">Duration:</span> 3 months access</p>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="font-bold text-lg">Badminton Pro</h3>
                  <p className="text-gray-600 text-sm mt-2">Virtual coaching for serves and smashes</p>
                  <div className="mt-4">
                    <p className="text-sm"><span className="font-semibold">Included with:</span> Rackets, Shuttles</p>
                    <p className="text-sm"><span className="font-semibold">Duration:</span> 2 months access</p>
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
                  <span>Increased customer engagement</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Higher product value proposition</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Additional revenue stream</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Competitive advantage</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Enhanced customer retention</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md mt-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Statistics</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Customers with 3D access</span>
                    <span>1,245</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Engagement rate</span>
                    <span>78%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '78%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Repeat purchases</span>
                    <span>42%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: '42%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Manage 3D Experience Inventory</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">3D Experience</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Available</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">SG Pro Cricket Bat</div>
                    <div className="text-sm text-gray-500">Cricket VR Experience</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">3 months</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Available</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button className="text-red-600 hover:underline mr-3">Edit</button>
                    <button className="text-blue-600 hover:underline">Deactivate</button>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">Wilson Tennis Racket</div>
                    <div className="text-sm text-gray-500">Tennis Skill Builder</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">3 months</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Available</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button className="text-red-600 hover:underline mr-3">Edit</button>
                    <button className="text-blue-600 hover:underline">Deactivate</button>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">Adidas Football</div>
                    <div className="text-sm text-gray-500">Football Training Module</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2 months</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Limited</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button className="text-red-600 hover:underline mr-3">Edit</button>
                    <button className="text-blue-600 hover:underline">Deactivate</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Store3DProductsPage;