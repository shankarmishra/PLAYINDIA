import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/Layout';

const PlayerTournamentsPage = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <Layout title="Player Tournaments - TeamUp India" description="Find and join sports tournaments as a player">
      <Head>
        <title>Player Tournaments - TeamUp India</title>
        <meta name="description" content="Find and join sports tournaments as a player" />
      </Head>

      {/* Player Navigation */}
      <nav className="bg-gray-900 text-white py-4 px-6 flex justify-between items-center">
        <div className="text-xl font-bold text-red-400">TeamUp India Player Portal</div>
        <div className="flex space-x-6">
          <Link href="/profile" className="hover:text-red-400">Dashboard</Link>
          <Link href="/player/fitness" className="hover:text-red-400">Fitness Tracker</Link>
          <Link href="/player/tournaments" className="hover:text-red-400 font-medium underline">Tournaments</Link>
          <Link href="/player/bookings" className="hover:text-red-400">Bookings</Link>
          <Link href="/profile" className="hover:text-red-400">Profile</Link>
          <Link href="/logout" className="hover:text-red-400">Logout</Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-8 px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Tournaments</h1>
          <p className="text-gray-600">Find and join sports tournaments in your area</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="w-full md:w-auto">
            <input
              type="text"
              placeholder="Search tournaments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
            />
          </div>
          <div className="flex space-x-2">
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500">
              <option>All Sports</option>
              <option>Cricket</option>
              <option>Football</option>
              <option>Tennis</option>
              <option>Badminton</option>
              <option>Basketball</option>
              <option>Volleyball</option>
            </select>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500">
              <option>All Locations</option>
              <option>New Delhi</option>
              <option>Mumbai</option>
              <option>Bangalore</option>
              <option>Chennai</option>
              <option>Kolkata</option>
            </select>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'upcoming'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Upcoming Tournaments
            </button>
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
              onClick={() => setActiveTab('completed')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'completed'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Completed
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'upcoming' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Upcoming Tournaments</h2>
              <p className="text-gray-600">Find tournaments near you</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-bold text-gray-900">Summer Cricket League</h3>
                  <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">Open</span>
                </div>
                <p className="text-gray-600 mt-2">Local cricket tournament for youth players</p>
                <div className="mt-4 flex justify-between text-sm text-gray-500">
                  <span>Jun 15, 2024</span>
                  <span>Delhi</span>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-sm text-gray-500">Entry Fee: ₹500</span>
                  <button className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 text-sm">
                    Register
                  </button>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-bold text-gray-900">Winter Football Cup</h3>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Open</span>
                </div>
                <p className="text-gray-600 mt-2">Regional football championship for adults</p>
                <div className="mt-4 flex justify-between text-sm text-gray-500">
                  <span>Dec 1, 2024</span>
                  <span>Mumbai</span>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-sm text-gray-500">Entry Fee: ₹800</span>
                  <button className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 text-sm">
                    Register
                  </button>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-bold text-gray-900">Spring Tennis Open</h3>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">Open</span>
                </div>
                <p className="text-gray-600 mt-2">Annual tennis tournament for all skill levels</p>
                <div className="mt-4 flex justify-between text-sm text-gray-500">
                  <span>May 20, 2024</span>
                  <span>Bangalore</span>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-sm text-gray-500">Entry Fee: ₹1,200</span>
                  <button className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 text-sm">
                    Register
                  </button>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-bold text-gray-900">Badminton Championship</h3>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">Open</span>
                </div>
                <p className="text-gray-600 mt-2">National badminton tournament for all age groups</p>
                <div className="mt-4 flex justify-between text-sm text-gray-500">
                  <span>Jul 10, 2024</span>
                  <span>Chennai</span>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-sm text-gray-500">Entry Fee: ₹600</span>
                  <button className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 text-sm">
                    Register
                  </button>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-bold text-gray-900">Basketball League</h3>
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">Registration Ends Soon</span>
                </div>
                <p className="text-gray-600 mt-2">Inter-college basketball tournament</p>
                <div className="mt-4 flex justify-between text-sm text-gray-500">
                  <span>Jun 5, 2024</span>
                  <span>Kolkata</span>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-sm text-gray-500">Entry Fee: ₹400</span>
                  <button className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 text-sm">
                    Register
                  </button>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-indigo-500">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-bold text-gray-900">Volleyball Tournament</h3>
                  <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs font-medium rounded-full">Open</span>
                </div>
                <p className="text-gray-600 mt-2">Beach volleyball championship</p>
                <div className="mt-4 flex justify-between text-sm text-gray-500">
                  <span>Aug 15, 2024</span>
                  <span>Goa</span>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-sm text-gray-500">Entry Fee: ₹700</span>
                  <button className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 text-sm">
                    Register
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'my-tournaments' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">My Tournaments</h2>
              <p className="text-gray-600">Tournaments you've registered for</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-bold text-gray-900">Summer Cricket League</h3>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Confirmed</span>
                </div>
                <p className="text-gray-600 mt-2">Local cricket tournament for youth players</p>
                <div className="mt-4 flex justify-between text-sm text-gray-500">
                  <span>Jun 15, 2024</span>
                  <span>Delhi</span>
                </div>
                <div className="mt-4">
                  <button className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 text-sm w-full">
                    View Details
                  </button>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-bold text-gray-900">Tennis Championship</h3>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">Pending</span>
                </div>
                <p className="text-gray-600 mt-2">Annual tennis tournament for all skill levels</p>
                <div className="mt-4 flex justify-between text-sm text-gray-500">
                  <span>May 20, 2024</span>
                  <span>Bangalore</span>
                </div>
                <div className="mt-4">
                  <button className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 text-sm w-full">
                    View Details
                  </button>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-bold text-gray-900">Badminton Open</h3>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">Upcoming</span>
                </div>
                <p className="text-gray-600 mt-2">National badminton tournament</p>
                <div className="mt-4 flex justify-between text-sm text-gray-500">
                  <span>Jul 10, 2024</span>
                  <span>Chennai</span>
                </div>
                <div className="mt-4">
                  <button className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 text-sm w-full">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'completed' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Completed Tournaments</h2>
              <p className="text-gray-600">Tournaments you've participated in</p>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tournament</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sport</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Result</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prize</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">Winter Football Cup</div>
                      <div className="text-sm text-gray-500">Regional championship</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">Football</td>
                    <td className="px-6 py-4 whitespace-nowrap">Dec 15, 2023</td>
                    <td className="px-6 py-4 whitespace-nowrap">Mumbai</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">Semi-finalist</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">₹5,000</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">Cricket Championship</div>
                      <div className="text-sm text-gray-500">Local league</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">Cricket</td>
                    <td className="px-6 py-4 whitespace-nowrap">Oct 10, 2023</td>
                    <td className="px-6 py-4 whitespace-nowrap">Delhi</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Champion</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">₹15,000</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">Tennis Open</div>
                      <div className="text-sm text-gray-500">State championship</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">Tennis</td>
                    <td className="px-6 py-4 whitespace-nowrap">Aug 5, 2023</td>
                    <td className="px-6 py-4 whitespace-nowrap">Bangalore</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Quarter-finalist</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">₹2,000</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default PlayerTournamentsPage;