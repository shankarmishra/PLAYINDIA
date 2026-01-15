import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/Layout';

const CoachTournamentsPage = () => {
  const [activeTab, setActiveTab] = useState('my-tournaments');

  return (
    <Layout title="Coach Tournaments - TeamUp India" description="Create and manage sports tournaments as a coach">
      <Head>
        <title>Coach Tournaments - TeamUp India</title>
        <meta name="description" content="Create and manage sports tournaments as a coach" />
      </Head>

      {/* Coach Navigation */}
      <nav className="bg-gray-900 text-white py-4 px-6 flex justify-between items-center">
        <div className="text-xl font-bold text-red-400">TeamUp India Coach Portal</div>
        <div className="flex space-x-6">
          <Link href="/coach" className="hover:text-red-400">Dashboard</Link>
          <Link href="/coach/bookings" className="hover:text-red-400">Bookings</Link>
          <Link href="/coach/tournaments" className="hover:text-red-400 font-medium underline">Tournaments</Link>
          <Link href="/profile" className="hover:text-red-400">Profile</Link>
          <Link href="/logout" className="hover:text-red-400">Logout</Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-8 px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Tournament Management</h1>
          <p className="text-gray-600">Create and manage sports tournaments for your students</p>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('my-tournaments')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'my-tournaments'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              My Tournaments
            </button>
            <button
              onClick={() => setActiveTab('create-tournament')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'create-tournament'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Create Tournament
            </button>
            <button
              onClick={() => setActiveTab('participants')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'participants'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Participants
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'my-tournaments' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">My Tournaments</h2>
              <Link href="/coach/tournaments?tab=create-tournament" className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700">
                Create New Tournament
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-bold text-gray-900">Summer Cricket League</h3>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">Ongoing</span>
                </div>
                <p className="text-gray-600 mt-2">Local cricket tournament for youth players</p>
                <div className="mt-4 flex justify-between text-sm text-gray-500">
                  <span>Started: Jun 1, 2024</span>
                  <span>Teams: 12</span>
                </div>
                <div className="mt-4">
                  <Link href="#" className="text-red-600 hover:underline font-medium">View Details</Link>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-bold text-gray-900">Winter Football Cup</h3>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Upcoming</span>
                </div>
                <p className="text-gray-600 mt-2">Regional football championship for adults</p>
                <div className="mt-4 flex justify-between text-sm text-gray-500">
                  <span>Starts: Dec 15, 2024</span>
                  <span>Teams: 8</span>
                </div>
                <div className="mt-4">
                  <Link href="#" className="text-red-600 hover:underline font-medium">View Details</Link>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-bold text-gray-900">Spring Tennis Open</h3>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">Completed</span>
                </div>
                <p className="text-gray-600 mt-2">Annual tennis tournament for all skill levels</p>
                <div className="mt-4 flex justify-between text-sm text-gray-500">
                  <span>Ended: May 30, 2024</span>
                  <span>Participants: 32</span>
                </div>
                <div className="mt-4">
                  <Link href="#" className="text-red-600 hover:underline font-medium">View Results</Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'create-tournament' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Create New Tournament</h2>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 mb-2">Tournament Name</label>
                    <input
                      type="text"
                      placeholder="Enter tournament name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Sport Type</label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500">
                      <option>Select sport</option>
                      <option>Cricket</option>
                      <option>Football</option>
                      <option>Tennis</option>
                      <option>Badminton</option>
                      <option>Basketball</option>
                      <option>Volleyball</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 mb-2">Start Date</label>
                    <input
                      type="date"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">End Date</label>
                    <input
                      type="date"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 mb-2">Location</label>
                    <input
                      type="text"
                      placeholder="Enter tournament location"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Max Participants</label>
                    <input
                      type="number"
                      placeholder="Enter maximum participants"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">Tournament Description</label>
                  <textarea
                    placeholder="Describe your tournament..."
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                  ></textarea>
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">Entry Fee (₹)</label>
                  <input
                    type="number"
                    placeholder="Enter entry fee amount"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="accept-payments"
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  />
                  <label htmlFor="accept-payments" className="ml-2 block text-sm text-gray-900">
                    Enable online payment collection
                  </label>
                </div>
                
                <div className="pt-4">
                  <button type="button" className="bg-red-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-700">
                    Create Tournament
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'participants' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Tournament Participants</h2>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900">Summer Cricket League Participants</h3>
                <div className="flex space-x-2">
                  <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg">
                    Export List
                  </button>
                  <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg">
                    Send Message
                  </button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registration Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">Rahul Sharma</td>
                      <td className="px-6 py-4 whitespace-nowrap">rahul@example.com</td>
                      <td className="px-6 py-4 whitespace-nowrap">+91 9876543210</td>
                      <td className="px-6 py-4 whitespace-nowrap">May 15, 2024</td>
                      <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Confirmed</span></td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button className="text-red-600 hover:text-red-900 mr-3">Message</button>
                        <button className="text-blue-600 hover:text-blue-900">Details</button>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">Priya Patel</td>
                      <td className="px-6 py-4 whitespace-nowrap">priya@example.com</td>
                      <td className="px-6 py-4 whitespace-nowrap">+91 8765432109</td>
                      <td className="px-6 py-4 whitespace-nowrap">May 16, 2024</td>
                      <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Confirmed</span></td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button className="text-red-600 hover:text-red-900 mr-3">Message</button>
                        <button className="text-blue-600 hover:text-blue-900">Details</button>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">Amit Kumar</td>
                      <td className="px-6 py-4 whitespace-nowrap">amit@example.com</td>
                      <td className="px-6 py-4 whitespace-nowrap">+91 7654321098</td>
                      <td className="px-6 py-4 whitespace-nowrap">May 17, 2024</td>
                      <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Pending</span></td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button className="text-red-600 hover:text-red-900 mr-3">Message</button>
                        <button className="text-blue-600 hover:text-blue-900">Details</button>
                      </td>
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

export default CoachTournamentsPage;