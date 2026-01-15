import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/Layout';

const PlayerFitnessPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('this-month');

  return (
    <Layout title="Player Fitness Tracker - TeamUp India" description="Track your fitness and performance as a player">
      <Head>
        <title>Player Fitness Tracker - TeamUp India</title>
        <meta name="description" content="Track your fitness and performance as a player" />
      </Head>

      {/* Player Navigation */}
      <nav className="bg-gray-900 text-white py-4 px-6 flex justify-between items-center">
        <div className="text-xl font-bold text-red-400">TeamUp India Player Portal</div>
        <div className="flex space-x-6">
          <Link href="/profile" className="hover:text-red-400">Dashboard</Link>
          <Link href="/player/fitness" className="hover:text-red-400 font-medium underline">Fitness Tracker</Link>
          <Link href="/player/tournaments" className="hover:text-red-400">Tournaments</Link>
          <Link href="/player/bookings" className="hover:text-red-400">Bookings</Link>
          <Link href="/profile" className="hover:text-red-400">Profile</Link>
          <Link href="/logout" className="hover:text-red-400">Logout</Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-8 px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Fitness & Performance Tracker</h1>
          <p className="text-gray-600">Monitor your fitness progress and performance metrics</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">Current Fitness Level</h3>
            <p className="text-3xl font-bold text-green-600">8.2/10</p>
            <p className="text-sm text-green-500 mt-1">↑ 0.5 from last month</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">Training Hours</h3>
            <p className="text-3xl font-bold text-blue-600">32</p>
            <p className="text-sm text-gray-500 mt-1">This month</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">Avg. Performance</h3>
            <p className="text-3xl font-bold text-purple-600">7.8/10</p>
            <p className="text-sm text-gray-500 mt-1">Across all sports</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">Active Goals</h3>
            <p className="text-3xl font-bold text-yellow-600">3</p>
            <p className="text-sm text-gray-500 mt-1">Of 5 goals</p>
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
                onClick={() => setActiveTab('progress')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'progress'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Progress
              </button>
              <button
                onClick={() => setActiveTab('goals')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'goals'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Goals
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
              <h2 className="text-xl font-bold text-gray-900 mb-4">Fitness Overview</h2>
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-48 mx-auto mb-4" />
                  <p className="text-gray-500">Fitness chart visualization</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activities</h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Cricket Training</p>
                      <p className="text-sm text-gray-500">2 hours ago</p>
                    </div>
                    <p className="font-bold text-green-600">+0.2</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Tennis Practice</p>
                      <p className="text-sm text-gray-500">Yesterday</p>
                    </div>
                    <p className="font-bold text-green-600">+0.1</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Badminton Session</p>
                      <p className="text-sm text-gray-500">2 days ago</p>
                    </div>
                    <p className="font-bold text-green-600">+0.3</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Fitness Workout</p>
                      <p className="text-sm text-gray-500">3 days ago</p>
                    </div>
                    <p className="font-bold text-green-600">+0.1</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Sport Performance</h2>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Cricket</span>
                      <span>8.5/10</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Tennis</span>
                      <span>7.2/10</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '72%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Badminton</span>
                      <span>7.8/10</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: '78%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Football</span>
                      <span>6.9/10</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '69%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'progress' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Progress Tracking</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="font-bold text-gray-900 mb-4">Fitness Progress</h3>
                <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-48 mx-auto mb-4" />
                    <p className="text-gray-500">Fitness progress chart</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="font-bold text-gray-900 mb-4">Performance Trends</h3>
                <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-48 mx-auto mb-4" />
                    <p className="text-gray-500">Performance trend chart</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-bold text-gray-900 mb-4">Training Log</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sport</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Intensity</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Improvement</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">May 15, 2024</td>
                      <td className="px-6 py-4 whitespace-nowrap">Cricket</td>
                      <td className="px-6 py-4 whitespace-nowrap">2 hours</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">High</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-green-600">+0.2</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">May 14, 2024</td>
                      <td className="px-6 py-4 whitespace-nowrap">Tennis</td>
                      <td className="px-6 py-4 whitespace-nowrap">1.5 hours</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">Medium</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-green-600">+0.1</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">May 12, 2024</td>
                      <td className="px-6 py-4 whitespace-nowrap">Badminton</td>
                      <td className="px-6 py-4 whitespace-nowrap">1.5 hours</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">High</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-green-600">+0.3</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">May 10, 2024</td>
                      <td className="px-6 py-4 whitespace-nowrap">Fitness</td>
                      <td className="px-6 py-4 whitespace-nowrap">1 hour</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Medium</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-green-600">+0.1</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'goals' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Fitness Goals</h2>
              <button className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700">
                Add Goal
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
                <h3 className="font-bold text-lg text-gray-900">Improve Cricket Batting</h3>
                <p className="text-gray-600 mt-2">Increase batting average to 45</p>
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>65% complete</span>
                    <span>Aug 2024</span>
                  </div>
                </div>
                <div className="mt-4">
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">In Progress</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
                <h3 className="font-bold text-lg text-gray-900">Tennis Serve Accuracy</h3>
                <p className="text-gray-600 mt-2">Achieve 85% first serve accuracy</p>
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>45% complete</span>
                    <span>Jul 2024</span>
                  </div>
                </div>
                <div className="mt-4">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">In Progress</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
                <h3 className="font-bold text-lg text-gray-900">Badminton Footwork</h3>
                <p className="text-gray-600 mt-2">Improve court coverage by 20%</p>
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: '80%' }}></div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>80% complete</span>
                    <span>Jun 2024</span>
                  </div>
                </div>
                <div className="mt-4">
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Completed</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-bold text-gray-900 mb-4">Achievements</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-3xl mb-2">🏆</div>
                  <p className="font-medium">Cricket Pro</p>
                  <p className="text-sm text-gray-500">Level 5</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-3xl mb-2">🎾</div>
                  <p className="font-medium">Tennis Ace</p>
                  <p className="text-sm text-gray-500">Level 4</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-3xl mb-2">🏸</div>
                  <p className="font-medium">Badminton Pro</p>
                  <p className="text-sm text-gray-500">Level 6</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-3xl mb-2">💪</div>
                  <p className="font-medium">Fitness</p>
                  <p className="text-sm text-gray-500">Level 7</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default PlayerFitnessPage;