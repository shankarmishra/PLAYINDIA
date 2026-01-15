import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/Layout';

const PlayerBookingsPage = () => {
  const [activeTab, setActiveTab] = useState('find-coach');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSport, setSelectedSport] = useState('');

  return (
    <Layout title="Player Bookings - TeamUp India" description="Find and book coaches as a player">
      <Head>
        <title>Player Bookings - TeamUp India</title>
        <meta name="description" content="Find and book coaches as a player" />
      </Head>

      {/* Player Navigation */}
      <nav className="bg-gray-900 text-white py-4 px-6 flex justify-between items-center">
        <div className="text-xl font-bold text-red-400">TeamUp India Player Portal</div>
        <div className="flex space-x-6">
          <Link href="/profile" className="hover:text-red-400">Dashboard</Link>
          <Link href="/player/fitness" className="hover:text-red-400">Fitness Tracker</Link>
          <Link href="/player/tournaments" className="hover:text-red-400">Tournaments</Link>
          <Link href="/player/bookings" className="hover:text-red-400 font-medium underline">Bookings</Link>
          <Link href="/profile" className="hover:text-red-400">Profile</Link>
          <Link href="/logout" className="hover:text-red-400">Logout</Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-8 px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Coach Bookings</h1>
          <p className="text-gray-600">Find and book verified coaches for your favorite sports</p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('find-coach')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'find-coach'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Find Coaches
            </button>
            <button
              onClick={() => setActiveTab('my-bookings')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'my-bookings'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              My Bookings
            </button>
            <button
              onClick={() => setActiveTab('availability')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'availability'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              My Schedule
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'find-coach' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="w-full md:w-1/2">
                <input
                  type="text"
                  placeholder="Search coaches by name, location, or expertise..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                />
              </div>
              <div className="flex space-x-2">
                <select 
                  value={selectedSport}
                  onChange={(e) => setSelectedSport(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                >
                  <option value="">All Sports</option>
                  <option value="cricket">Cricket</option>
                  <option value="football">Football</option>
                  <option value="tennis">Tennis</option>
                  <option value="badminton">Badminton</option>
                  <option value="basketball">Basketball</option>
                  <option value="volleyball">Volleyball</option>
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                  <div className="ml-4">
                    <h3 className="font-bold text-lg">Rahul Sharma</h3>
                    <p className="text-gray-600">Cricket Coach</p>
                    <div className="flex items-center mt-1">
                      <span className="text-yellow-400">★</span>
                      <span className="text-yellow-400">★</span>
                      <span className="text-yellow-400">★</span>
                      <span className="text-yellow-400">★</span>
                      <span className="text-gray-300">★</span>
                      <span className="ml-1 text-gray-500">(4.2)</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between text-sm text-gray-500 mb-4">
                  <span>Experience: 8 years</span>
                  <span>₹1,200/session</span>
                </div>
                <p className="text-gray-600 text-sm mb-4">Specializes in batting and fielding techniques for all skill levels</p>
                <div className="flex space-x-2">
                  <button className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 text-sm flex-1">
                    Book Now
                  </button>
                  <button className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 text-sm">
                    Profile
                  </button>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                  <div className="ml-4">
                    <h3 className="font-bold text-lg">Priya Patel</h3>
                    <p className="text-gray-600">Tennis Coach</p>
                    <div className="flex items-center mt-1">
                      <span className="text-yellow-400">★</span>
                      <span className="text-yellow-400">★</span>
                      <span className="text-yellow-400">★</span>
                      <span className="text-yellow-400">★</span>
                      <span className="text-yellow-400">★</span>
                      <span className="ml-1 text-gray-500">(4.8)</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between text-sm text-gray-500 mb-4">
                  <span>Experience: 6 years</span>
                  <span>₹1,500/session</span>
                </div>
                <p className="text-gray-600 text-sm mb-4">Specializes in serving and groundstroke techniques for competitive players</p>
                <div className="flex space-x-2">
                  <button className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 text-sm flex-1">
                    Book Now
                  </button>
                  <button className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 text-sm">
                    Profile
                  </button>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                  <div className="ml-4">
                    <h3 className="font-bold text-lg">Amit Kumar</h3>
                    <p className="text-gray-600">Badminton Coach</p>
                    <div className="flex items-center mt-1">
                      <span className="text-yellow-400">★</span>
                      <span className="text-yellow-400">★</span>
                      <span className="text-yellow-400">★</span>
                      <span className="text-yellow-400">★</span>
                      <span className="text-gray-300">★</span>
                      <span className="ml-1 text-gray-500">(4.0)</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between text-sm text-gray-500 mb-4">
                  <span>Experience: 5 years</span>
                  <span>₹1,000/session</span>
                </div>
                <p className="text-gray-600 text-sm mb-4">Specializes in footwork and smash techniques for intermediate players</p>
                <div className="flex space-x-2">
                  <button className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 text-sm flex-1">
                    Book Now
                  </button>
                  <button className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 text-sm">
                    Profile
                  </button>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                  <div className="ml-4">
                    <h3 className="font-bold text-lg">Sneha Gupta</h3>
                    <p className="text-gray-600">Football Coach</p>
                    <div className="flex items-center mt-1">
                      <span className="text-yellow-400">★</span>
                      <span className="text-yellow-400">★</span>
                      <span className="text-yellow-400">★</span>
                      <span className="text-yellow-400">★</span>
                      <span className="text-gray-300">★</span>
                      <span className="ml-1 text-gray-500">(4.5)</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between text-sm text-gray-500 mb-4">
                  <span>Experience: 7 years</span>
                  <span>₹1,300/session</span>
                </div>
                <p className="text-gray-600 text-sm mb-4">Specializes in dribbling and shooting techniques for youth players</p>
                <div className="flex space-x-2">
                  <button className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 text-sm flex-1">
                    Book Now
                  </button>
                  <button className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 text-sm">
                    Profile
                  </button>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                  <div className="ml-4">
                    <h3 className="font-bold text-lg">Vikram Singh</h3>
                    <p className="text-gray-600">Basketball Coach</p>
                    <div className="flex items-center mt-1">
                      <span className="text-yellow-400">★</span>
                      <span className="text-yellow-400">★</span>
                      <span className="text-yellow-400">★</span>
                      <span className="text-yellow-400">★</span>
                      <span className="text-gray-300">★</span>
                      <span className="ml-1 text-gray-500">(4.3)</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between text-sm text-gray-500 mb-4">
                  <span>Experience: 9 years</span>
                  <span>₹1,400/session</span>
                </div>
                <p className="text-gray-600 text-sm mb-4">Specializes in shooting and defense techniques for competitive players</p>
                <div className="flex space-x-2">
                  <button className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 text-sm flex-1">
                    Book Now
                  </button>
                  <button className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 text-sm">
                    Profile
                  </button>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                  <div className="ml-4">
                    <h3 className="font-bold text-lg">Kavya Reddy</h3>
                    <p className="text-gray-600">Volleyball Coach</p>
                    <div className="flex items-center mt-1">
                      <span className="text-yellow-400">★</span>
                      <span className="text-yellow-400">★</span>
                      <span className="text-yellow-400">★</span>
                      <span className="text-yellow-400">★</span>
                      <span className="text-gray-300">★</span>
                      <span className="ml-1 text-gray-500">(4.6)</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between text-sm text-gray-500 mb-4">
                  <span>Experience: 4 years</span>
                  <span>₹1,100/session</span>
                </div>
                <p className="text-gray-600 text-sm mb-4">Specializes in serving and spiking techniques for intermediate players</p>
                <div className="flex space-x-2">
                  <button className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 text-sm flex-1">
                    Book Now
                  </button>
                  <button className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 text-sm">
                    Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'my-bookings' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">My Bookings</h2>
              <p className="text-gray-600">Your upcoming and past sessions</p>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coach</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sport</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-8 h-8" />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">Rahul Sharma</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">Cricket</td>
                    <td className="px-6 py-4 whitespace-nowrap">Jun 15, 2024 - 04:00 PM</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Confirmed</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">₹1,200</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button className="text-red-600 hover:underline mr-3">Cancel</button>
                      <button className="text-blue-600 hover:underline">Reschedule</button>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-8 h-8" />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">Priya Patel</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">Tennis</td>
                    <td className="px-6 py-4 whitespace-nowrap">Jun 14, 2024 - 06:00 PM</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Pending</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">₹1,500</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button className="text-red-600 hover:underline mr-3">Cancel</button>
                      <button className="text-blue-600 hover:underline">Confirm</button>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-8 h-8" />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">Amit Kumar</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">Badminton</td>
                    <td className="px-6 py-4 whitespace-nowrap">Jun 12, 2024 - 05:00 PM</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">Completed</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">₹1,000</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button className="text-green-600 hover:underline mr-3">Review</button>
                      <button className="text-blue-600 hover:underline">Repeat</button>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-8 h-8" />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">Sneha Gupta</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">Football</td>
                    <td className="px-6 py-4 whitespace-nowrap">Jun 10, 2024 - 03:00 PM</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Cancelled</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">₹1,300</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button className="text-blue-600 hover:underline">Book Again</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'availability' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900">My Schedule</h2>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-bold text-lg text-gray-900 mb-4">Set Your Availability</h3>
              <p className="text-gray-600 mb-6">Let coaches know when you're available for sessions</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Select Days</h4>
                  <div className="space-y-2">
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                      <div key={day} className="flex items-center">
                        <input
                          type="checkbox"
                          id={day.toLowerCase()}
                          className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                        />
                        <label htmlFor={day.toLowerCase()} className="ml-2 block text-sm text-gray-700">
                          {day}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Preferred Time Slots</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="morning"
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                      />
                      <label htmlFor="morning" className="ml-2 block text-sm text-gray-700">
                        Morning (6AM - 12PM)
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="afternoon"
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                      />
                      <label htmlFor="afternoon" className="ml-2 block text-sm text-gray-700">
                        Afternoon (12PM - 6PM)
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="evening"
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                      />
                      <label htmlFor="evening" className="ml-2 block text-sm text-gray-700">
                        Evening (6PM - 10PM)
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <button className="bg-red-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-700">
                  Save Availability
                </button>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-bold text-lg text-gray-900 mb-4">Your Current Availability</h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">Monday: Morning, Afternoon</span>
                <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">Tuesday: Evening</span>
                <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">Wednesday: Morning, Afternoon</span>
                <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">Thursday: Afternoon, Evening</span>
                <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">Saturday: Morning</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default PlayerBookingsPage;