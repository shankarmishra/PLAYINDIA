import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/Layout';

const StoreAnalyticsPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('this-month');

  return (
    <Layout title="Store Analytics Dashboard - TeamUp India" description="Track your store sales and performance metrics">
      <Head>
        <title>Store Analytics Dashboard - TeamUp India</title>
        <meta name="description" content="Track your store sales and performance metrics" />
      </Head>

      {/* Store Navigation */}
      <nav className="bg-gray-900 text-white py-4 px-6 flex justify-between items-center">
        <div className="text-xl font-bold text-red-400">TeamUp India Store Portal</div>
        <div className="flex space-x-6">
          <Link href="/store" className="hover:text-red-400">Dashboard</Link>
          <Link href="/store/products" className="hover:text-red-400">Products</Link>
          <Link href="/store/analytics" className="hover:text-red-400 font-medium underline">Analytics</Link>
          <Link href="/profile" className="hover:text-red-400">Profile</Link>
          <Link href="/logout" className="hover:text-red-400">Logout</Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-8 px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Sales Analytics Dashboard</h1>
          <p className="text-gray-600">Track your store performance, sales, and customer insights</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">Total Sales</h3>
            <p className="text-3xl font-bold text-green-600">₹4,25,000</p>
            <p className="text-sm text-gray-500 mt-1">This year</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">This Month</h3>
            <p className="text-3xl font-bold text-blue-600">₹52,300</p>
            <p className="text-sm text-green-500 mt-1">↑ 8% from last month</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">Orders</h3>
            <p className="text-3xl font-bold text-purple-600">248</p>
            <p className="text-sm text-gray-500 mt-1">This month</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">Avg. Order Value</h3>
            <p className="text-3xl font-bold text-yellow-600">₹2,100</p>
            <p className="text-sm text-gray-500 mt-1">Per order</p>
          </div>
        </div>

        {/* Filters and Tabs */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('products')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'products'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Top Products
              </button>
              <button
                onClick={() => setActiveTab('customers')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'customers'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Customers
              </button>
            </nav>
          </div>
          
          <div>
            <select 
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
            >
              <option value="today">Today</option>
              <option value="this-week">This Week</option>
              <option value="this-month">This Month</option>
              <option value="last-3-months">Last 3 Months</option>
              <option value="this-year">This Year</option>
            </select>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Sales Overview</h2>
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-48 mx-auto mb-4" />
                  <p className="text-gray-500">Sales chart visualization</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Top Performing Categories</h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Cricket Equipment</p>
                    </div>
                    <p className="font-bold text-green-600">₹18,500</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Football Gear</p>
                    </div>
                    <p className="font-bold text-green-600">₹15,200</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Tennis Accessories</p>
                    </div>
                    <p className="font-bold text-green-600">₹12,800</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Athletic Wear</p>
                    </div>
                    <p className="font-bold text-green-600">₹9,400</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Monthly Breakdown</h2>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>April 2024</span>
                      <span>₹52,300</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '95%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>March 2024</span>
                      <span>₹48,500</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '88%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>February 2024</span>
                      <span>₹45,200</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: '82%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>January 2024</span>
                      <span>₹42,800</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '78%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Top Selling Products</h2>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Units Sold</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">Pro Cricket Bat</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">Cricket</td>
                      <td className="px-6 py-4 whitespace-nowrap">124</td>
                      <td className="px-6 py-4 whitespace-nowrap font-bold">₹31,000</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-yellow-400">★</span>
                          <span className="text-yellow-400">★</span>
                          <span className="text-yellow-400">★</span>
                          <span className="text-yellow-400">★</span>
                          <span className="text-gray-300">★</span>
                          <span className="ml-1 text-gray-500">(4.2)</span>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">Football Size 5</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">Football</td>
                      <td className="px-6 py-4 whitespace-nowrap">98</td>
                      <td className="px-6 py-4 whitespace-nowrap font-bold">₹24,500</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-yellow-400">★</span>
                          <span className="text-yellow-400">★</span>
                          <span className="text-yellow-400">★</span>
                          <span className="text-yellow-400">★</span>
                          <span className="text-yellow-400">★</span>
                          <span className="ml-1 text-gray-500">(4.8)</span>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">Tennis Racket Pro</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">Tennis</td>
                      <td className="px-6 py-4 whitespace-nowrap">76</td>
                      <td className="px-6 py-4 whitespace-nowrap font-bold">₹22,800</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-yellow-400">★</span>
                          <span className="text-yellow-400">★</span>
                          <span className="text-yellow-400">★</span>
                          <span className="text-yellow-400">★</span>
                          <span className="text-gray-300">★</span>
                          <span className="ml-1 text-gray-500">(4.0)</span>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">Basketball Official</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">Basketball</td>
                      <td className="px-6 py-4 whitespace-nowrap">65</td>
                      <td className="px-6 py-4 whitespace-nowrap font-bold">₹19,500</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-yellow-400">★</span>
                          <span className="text-yellow-400">★</span>
                          <span className="text-yellow-400">★</span>
                          <span className="text-yellow-400">★</span>
                          <span className="text-gray-300">★</span>
                          <span className="ml-1 text-gray-500">(4.1)</span>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'customers' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Customer Insights</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="font-bold text-gray-900 mb-4">Customer Demographics</h3>
                <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-48 mx-auto mb-4" />
                    <p className="text-gray-500">Demographics chart</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="font-bold text-gray-900 mb-4">Customer Retention</h3>
                <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-48 mx-auto mb-4" />
                    <p className="text-gray-500">Retention chart</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-bold text-gray-900 mb-4">Top Customers</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Spent</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Order</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">Rahul Sharma</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">rahul@example.com</td>
                      <td className="px-6 py-4 whitespace-nowrap">24</td>
                      <td className="px-6 py-4 whitespace-nowrap font-bold">₹28,500</td>
                      <td className="px-6 py-4 whitespace-nowrap">Apr 15, 2024</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">Priya Patel</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">priya@example.com</td>
                      <td className="px-6 py-4 whitespace-nowrap">18</td>
                      <td className="px-6 py-4 whitespace-nowrap font-bold">₹22,400</td>
                      <td className="px-6 py-4 whitespace-nowrap">Apr 12, 2024</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">Amit Kumar</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">amit@example.com</td>
                      <td className="px-6 py-4 whitespace-nowrap">15</td>
                      <td className="px-6 py-4 whitespace-nowrap font-bold">₹19,800</td>
                      <td className="px-6 py-4 whitespace-nowrap">Apr 10, 2024</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">Sneha Gupta</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">sneha@example.com</td>
                      <td className="px-6 py-4 whitespace-nowrap">12</td>
                      <td className="px-6 py-4 whitespace-nowrap font-bold">₹16,500</td>
                      <td className="px-6 py-4 whitespace-nowrap">Apr 8, 2024</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default StoreAnalyticsPage;