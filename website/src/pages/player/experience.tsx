import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/Layout';

const PlayerExperiencePage = () => {
  const [activeTab, setActiveTab] = useState('cricket');

  return (
    <Layout title="3D Sports Experience - TeamUp India" description="Experience immersive 3D sports training">
      <Head>
        <title>3D Sports Experience - TeamUp India</title>
        <meta name="description" content="Experience immersive 3D sports training" />
      </Head>

      {/* Player Navigation */}
      <nav className="bg-gray-900 text-white py-4 px-6 flex justify-between items-center">
        <div className="text-xl font-bold text-red-400">TeamUp India Player Portal</div>
        <div className="flex space-x-6">
          <Link href="/profile" className="hover:text-red-400">Dashboard</Link>
          <Link href="/player/fitness" className="hover:text-red-400">Fitness Tracker</Link>
          <Link href="/player/tournaments" className="hover:text-red-400">Tournaments</Link>
          <Link href="/player/bookings" className="hover:text-red-400">Bookings</Link>
          <Link href="/player/equipment" className="hover:text-red-400">Equipment</Link>
          <Link href="/player/experience" className="hover:text-red-400 font-medium underline">3D Experience</Link>
          <Link href="/profile" className="hover:text-red-400">Profile</Link>
          <Link href="/logout" className="hover:text-red-400">Logout</Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-8 px-6">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Immersive 3D Sports Experience</h1>
          <p className="text-gray-600 max-w-3xl mx-auto">Experience sports like never before with our cutting-edge 3D technology that brings training to life</p>
        </div>

        {/* Sports Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex flex-wrap justify-center gap-4 md:gap-8">
            <button
              onClick={() => setActiveTab('cricket')}
              className={`py-3 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'cricket'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Cricket
            </button>
            <button
              onClick={() => setActiveTab('football')}
              className={`py-3 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'football'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Football
            </button>
            <button
              onClick={() => setActiveTab('tennis')}
              className={`py-3 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'tennis'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Tennis
            </button>
            <button
              onClick={() => setActiveTab('badminton')}
              className={`py-3 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'badminton'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Badminton
            </button>
            <button
              onClick={() => setActiveTab('basketball')}
              className={`py-3 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'basketball'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Basketball
            </button>
          </nav>
        </div>

        {/* 3D Experience Content */}
        <div className="bg-gradient-to-r from-blue-900 to-purple-900 text-white rounded-xl p-8 mb-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-4">Experience {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} in 3D</h2>
            <p className="text-gray-200 max-w-2xl mx-auto">Immerse yourself in realistic 3D training environments designed to improve your skills and technique</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-64 mx-auto mb-4 flex items-center justify-center">
                <span className="text-gray-500 text-lg">3D {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Experience</span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-center">Virtual Training Environment</h3>
              <p className="text-gray-200 text-center">Practice in realistic scenarios with real-time feedback</p>
            </div>
            
            <div className="space-y-6">
              <div className="bg-white/10 p-4 rounded-lg">
                <h3 className="font-bold mb-2 flex items-center">
                  <span className="text-2xl mr-2">🎯</span>
                  Skill Development
                </h3>
                <p className="text-gray-200">Enhance your {activeTab} skills through interactive 3D training modules</p>
              </div>
              
              <div className="bg-white/10 p-4 rounded-lg">
                <h3 className="font-bold mb-2 flex items-center">
                  <span className="text-2xl mr-2">📊</span>
                  Performance Analytics
                </h3>
                <p className="text-gray-200">Get detailed analytics on your technique and performance metrics</p>
              </div>
              
              <div className="bg-white/10 p-4 rounded-lg">
                <h3 className="font-bold mb-2 flex items-center">
                  <span className="text-2xl mr-2">🏆</span>
                  Challenge Modes
                </h3>
                <p className="text-gray-200">Test your skills against virtual opponents of varying difficulty levels</p>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-4xl mb-4 text-center">🎮</div>
            <h3 className="font-bold text-lg text-center mb-2">Interactive Training</h3>
            <p className="text-gray-600 text-center">Engage with realistic 3D environments that respond to your movements</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-4xl mb-4 text-center">📊</div>
            <h3 className="font-bold text-lg text-center mb-2">Real-time Analytics</h3>
            <p className="text-gray-600 text-center">Get instant feedback on your performance and technique</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-4xl mb-4 text-center">🏆</div>
            <h3 className="font-bold text-lg text-center mb-2">Competitive Scenarios</h3>
            <p className="text-gray-600 text-center">Practice in game-like situations against virtual opponents</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-4xl mb-4 text-center">🔄</div>
            <h3 className="font-bold text-lg text-center mb-2">Progress Tracking</h3>
            <p className="text-gray-600 text-center">Monitor your improvement over time with detailed progress reports</p>
          </div>
        </div>

        {/* Equipment Integration */}
        <div className="bg-gradient-to-r from-green-900 to-blue-900 text-white rounded-xl p-8 mb-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-4">3D Experience + Equipment</h2>
            <p className="text-gray-200 max-w-2xl mx-auto">Combine our immersive 3D training with quality equipment for the ultimate sports experience</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-xl font-bold mb-4">How It Works</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  <span>Practice in our 3D environment to improve your skills</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  <span>Get recommendations for equipment based on your training</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  <span>Purchase recommended equipment directly from our platform</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  <span>Combine virtual training with real-world practice</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-48 mx-auto mb-4 flex items-center justify-center">
                <span className="text-gray-500">3D Training + Equipment</span>
              </div>
              <p className="text-center text-gray-200">Seamless integration between virtual training and physical equipment</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Experience Sports in 3D?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">Join thousands of players who are already improving their skills with our immersive 3D training technology</p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/player/experience/access" className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300">
              Access 3D Experience
            </Link>
            <Link href="/player/equipment" className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 px-6 rounded-lg transition duration-300">
              Shop Equipment
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PlayerExperiencePage;