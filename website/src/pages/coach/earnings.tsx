import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/Layout';

const CoachEarningsPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('this-month');

  return (
    <Layout title="Coach Earnings Dashboard - TeamUp India" description="Track your earnings and payouts as a coach">
      <Head>
        <title>Coach Earnings Dashboard - TeamUp India</title>
        <meta name="description" content="Track your earnings and payouts as a coach" />
      </Head>

      {/* Coach Navigation */}
      <nav className="bg-gray-900 text-white py-4 px-6 flex justify-between items-center">
        <div className="text-xl font-bold text-red-400">TeamUp India Coach Portal</div>
        <div className="flex space-x-6">
          <Link href="/coach" className="hover:text-red-400">Dashboard</Link>
          <Link href="/coach/bookings" className="hover:text-red-400">Bookings</Link>
          <Link href="/coach/tournaments" className="hover:text-red-400">Tournaments</Link>
          <Link href="/coach/earnings" className="hover:text-red-400 font-medium underline">Earnings</Link>
          <Link href="/profile" className="hover:text-red-400">Profile</Link>
          <Link href="/logout" className="hover:text-red-400">Logout</Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-8 px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Earnings Dashboard</h1>
          <p className="text-gray-600">Track your earnings, payouts, and financial performance</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">Total Earnings</h3>
            <p className="text-3xl font-bold text-green-600">₹2,45,000</p>
            <p className="text-sm text-gray-500 mt-1">This year</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">This Month</h3>
            <p className="text-3xl font-bold text-blue-600">₹32,500</p>
            <p className="text-sm text-green-500 mt-1">↑ 12% from last month</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">Pending Payout</h3>
            <p className="text-3xl font-bold text-yellow-600">₹8,750</p>
            <p className="text-sm text-gray-500 mt-1">Next payout: May 5</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">Avg. Per Session</h3>
            <p className="text-3xl font-bold text-purple-600">₹1,250</p>
            <p className="text-sm text-gray-500 mt-1">Average rate</p>
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
                onClick={() => setActiveTab('payouts')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'payouts'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Payouts
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'analytics'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Analytics
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
              <h2 className="text-xl font-bold text-gray-900 mb-4">Earnings Overview</h2>
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-48 mx-auto mb-4" />
                  <p className="text-gray-500">Earnings chart visualization</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Top Performing Sessions</h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Cricket Coaching</p>
                      <p className="text-sm text-gray-500">Mon, Wed, Fri - 6PM</p>
                    </div>
                    <p className="font-bold text-green-600">₹12,500</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Tennis Training</p>
                      <p className="text-sm text-gray-500">Tue, Thu - 7PM</p>
                    </div>
                    <p className="font-bold text-green-600">₹9,800</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Badminton Clinic</p>
                      <p className="text-sm text-gray-500">Sat - 10AM</p>
                    </div>
                    <p className="font-bold text-green-600">₹7,200</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Football Skills</p>
                      <p className="text-sm text-gray-500">Sun - 4PM</p>
                    </div>
                    <p className="font-bold text-green-600">₹5,400</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Monthly Breakdown</h2>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>April 2024</span>
                      <span>₹28,500</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '90%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>March 2024</span>
                      <span>₹25,200</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '80%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>February 2024</span>
                      <span>₹22,800</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: '72%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>January 2024</span>
                      <span>₹20,500</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'payouts' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Payout History</h2>
              <button className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700">
                Request Payout
              </button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">Apr 25, 2024</td>
                      <td className="px-6 py-4 whitespace-nowrap font-bold">₹25,400</td>
                      <td className="px-6 py-4 whitespace-nowrap">Bank Transfer</td>
                      <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Completed</span></td>
                      <td className="px-6 py-4 whitespace-nowrap">TXN-2024-001234</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">Mar 25, 2024</td>
                      <td className="px-6 py-4 whitespace-nowrap font-bold">₹28,750</td>
                      <td className="px-6 py-4 whitespace-nowrap">Bank Transfer</td>
                      <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Completed</span></td>
                      <td className="px-6 py-4 whitespace-nowrap">TXN-2024-001122</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">Feb 25, 2024</td>
                      <td className="px-6 py-4 whitespace-nowrap font-bold">₹22,300</td>
                      <td className="px-6 py-4 whitespace-nowrap">Bank Transfer</td>
                      <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Completed</span></td>
                      <td className="px-6 py-4 whitespace-nowrap">TXN-2024-001010</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">Jan 25, 2024</td>
                      <td className="px-6 py-4 whitespace-nowrap font-bold">₹19,800</td>
                      <td className="px-6 py-4 whitespace-nowrap">Bank Transfer</td>
                      <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Completed</span></td>
                      <td className="px-6 py-4 whitespace-nowrap">TXN-2024-000987</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Payout Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Account Details</h3>
                  <p className="text-gray-700">Rahul Sharma</p>
                  <p className="text-gray-700">ICICI Bank</p>
                  <p className="text-gray-700">XXXXXX4567</p>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Payout Schedule</h3>
                  <p className="text-gray-700">Monthly on 25th</p>
                  <p className="text-gray-700">Minimum payout: ₹1,000</p>
                  <p className="text-gray-700">Processing time: 3-5 business days</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Earnings Analytics</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="font-bold text-gray-900 mb-4">Earnings by Sport</h3>
                <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-48 mx-auto mb-4" />
                    <p className="text-gray-500">Sport distribution chart</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="font-bold text-gray-900 mb-4">Session Attendance</h3>
                <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-48 mx-auto mb-4" />
                    <p className="text-gray-500">Attendance trend chart</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-bold text-gray-900 mb-4">Performance Metrics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-red-600 mb-2">4.8</div>
                  <p className="text-gray-600">Avg. Rating</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">87%</div>
                  <p className="text-gray-600">Attendance Rate</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">124</div>
                  <p className="text-gray-600">Total Students</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CoachEarningsPage;