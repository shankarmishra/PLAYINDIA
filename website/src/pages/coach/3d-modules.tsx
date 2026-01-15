import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/Layout';

const Coach3DModulesPage = () => {
  return (
    <Layout title="3D Modules - TeamUp India Coach" description="Access 3D sports training modules for coaching">
      <Head>
        <title>3D Modules - TeamUp India Coach</title>
        <meta name="description" content="Access 3D sports training modules for coaching" />
      </Head>

      {/* Coach Navigation */}
      <nav className="bg-gray-900 text-white py-4 px-6 flex justify-between items-center">
        <div className="text-xl font-bold text-red-400">TeamUp India Coach</div>
        <div className="flex space-x-6">
          <Link href="/coach" className="hover:text-red-400">Dashboard</Link>
          <Link href="/coach/availability" className="hover:text-red-400">Availability</Link>
          <Link href="/coach/bookings" className="hover:text-red-400">Bookings</Link>
          <Link href="/coach/tournaments" className="hover:text-red-400">Tournaments</Link>
          <Link href="/coach/earnings" className="hover:text-red-400">Earnings</Link>
          <Link href="/coach/3d-modules" className="hover:text-red-400 font-medium underline">3D Modules</Link>
          <Link href="/profile" className="hover:text-red-400">Profile</Link>
          <Link href="/logout" className="hover:text-red-400">Logout</Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-8 px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">3D Sports Training Modules</h1>
          <p className="text-gray-600">Enhance your coaching with immersive 3D sports training tools</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold text-gray-900 mb-4">3D Training Modules</h2>
              <p className="text-gray-600 mb-6">Access advanced 3D training modules to enhance your coaching effectiveness and provide immersive learning experiences for your students</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border rounded-lg p-4">
                  <h3 className="font-bold text-lg">Cricket Simulator</h3>
                  <p className="text-gray-600 text-sm mt-2">Virtual batting and bowling practice with detailed analytics</p>
                  <div className="mt-4">
                    <p className="text-sm"><span className="font-semibold">Skills:</span> Batting, Bowling, Fielding</p>
                    <p className="text-sm"><span className="font-semibold">Difficulty:</span> Beginner to Expert</p>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="font-bold text-lg">Football Trainer</h3>
                  <p className="text-gray-600 text-sm mt-2">Dribbling, shooting, and tactical training modules</p>
                  <div className="mt-4">
                    <p className="text-sm"><span className="font-semibold">Skills:</span> Dribbling, Shooting, Passing</p>
                    <p className="text-sm"><span className="font-semibold">Difficulty:</span> Beginner to Expert</p>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="font-bold text-lg">Tennis Court</h3>
                  <p className="text-gray-600 text-sm mt-2">Serving and rally practice with real-time feedback</p>
                  <div className="mt-4">
                    <p className="text-sm"><span className="font-semibold">Skills:</span> Serving, Groundstrokes, Volleys</p>
                    <p className="text-sm"><span className="font-semibold">Difficulty:</span> Beginner to Expert</p>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="font-bold text-lg">Badminton Arena</h3>
                  <p className="text-gray-600 text-sm mt-2">Smashing and serving practice with technique analysis</p>
                  <div className="mt-4">
                    <p className="text-sm"><span className="font-semibold">Skills:</span> Serving, Smashing, Net Play</p>
                    <p className="text-sm"><span className="font-semibold">Difficulty:</span> Beginner to Expert</p>
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
                  <span>Enhanced student engagement</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Detailed performance analytics</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Improved technique visualization</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Weather-independent training</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Higher student retention</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md mt-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Statistics</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Students using 3D modules</span>
                    <span>245</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '78%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Engagement increase</span>
                    <span>+32%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Skill improvement</span>
                    <span>+42%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: '92%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Module Usage Analytics</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Module</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Students</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sessions</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg. Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">Cricket Simulator</div>
                    <div className="text-sm text-gray-500">Batting & Bowling Practice</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">86</td>
                  <td className="px-6 py-4 whitespace-nowrap">1,240</td>
                  <td className="px-6 py-4 whitespace-nowrap">42 min</td>
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button className="text-red-600 hover:underline mr-3">View</button>
                    <button className="text-blue-600 hover:underline">Schedule</button>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">Football Trainer</div>
                    <div className="text-sm text-gray-500">Dribbling & Shooting</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">72</td>
                  <td className="px-6 py-4 whitespace-nowrap">980</td>
                  <td className="px-6 py-4 whitespace-nowrap">38 min</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-yellow-400">★</span>
                      <span className="text-yellow-400">★</span>
                      <span className="text-yellow-400">★</span>
                      <span className="text-yellow-400">★</span>
                      <span className="text-yellow-400">★</span>
                      <span className="ml-1 text-gray-500">(4.7)</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button className="text-red-600 hover:underline mr-3">View</button>
                    <button className="text-blue-600 hover:underline">Schedule</button>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">Tennis Court</div>
                    <div className="text-sm text-gray-500">Serving & Rally Practice</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">64</td>
                  <td className="px-6 py-4 whitespace-nowrap">870</td>
                  <td className="px-6 py-4 whitespace-nowrap">35 min</td>
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button className="text-red-600 hover:underline mr-3">View</button>
                    <button className="text-blue-600 hover:underline">Schedule</button>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">Badminton Arena</div>
                    <div className="text-sm text-gray-500">Smashing & Serving</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">58</td>
                  <td className="px-6 py-4 whitespace-nowrap">750</td>
                  <td className="px-6 py-4 whitespace-nowrap">40 min</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-yellow-400">★</span>
                      <span className="text-yellow-400">★</span>
                      <span className="text-yellow-400">★</span>
                      <span className="text-yellow-400">★</span>
                      <span className="text-yellow-400">★</span>
                      <span className="ml-1 text-gray-500">(4.5)</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button className="text-red-600 hover:underline mr-3">View</button>
                    <button className="text-blue-600 hover:underline">Schedule</button>
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

export default Coach3DModulesPage;