import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

const ThreeDSportsExperiencePage = () => {
  return (
    <div>
      <Head>
        <title>3D Sports Experience - TeamUp India</title>
        <meta name="description" content="Experience immersive 3D sports training and visualization on TeamUp India" />
      </Head>

      {/* Hero Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-900 to-purple-900 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Immersive 3D Sports Experience</h1>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto">
            Experience sports like never before with our cutting-edge 3D technology that brings training to life
          </p>
        </div>
      </section>

      {/* 3D Sports Modules */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">3D Sports Modules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-48 mx-auto mb-4 flex items-center justify-center">
                <span className="text-gray-500">3D Cricket</span>
              </div>
              <h3 className="text-xl font-bold mb-2">3D Cricket Simulator</h3>
              <p className="text-gray-600 mb-4">
                Practice batting, bowling, and fielding in a realistic 3D cricket environment
              </p>
              <button className="bg-red-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-700">
                Try Experience
              </button>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-48 mx-auto mb-4 flex items-center justify-center">
                <span className="text-gray-500">3D Football</span>
              </div>
              <h3 className="text-xl font-bold mb-2">3D Football Trainer</h3>
              <p className="text-gray-600 mb-4">
                Improve your dribbling, shooting, and passing skills in a 3D football environment
              </p>
              <button className="bg-red-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-700">
                Try Experience
              </button>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-48 mx-auto mb-4 flex items-center justify-center">
                <span className="text-gray-500">3D Tennis</span>
              </div>
              <h3 className="text-xl font-bold mb-2">3D Tennis Court</h3>
              <p className="text-gray-600 mb-4">
                Practice your serves, volleys, and groundstrokes in a realistic tennis environment
              </p>
              <button className="bg-red-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-700">
                Try Experience
              </button>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-48 mx-auto mb-4 flex items-center justify-center">
                <span className="text-gray-500">3D Badminton</span>
              </div>
              <h3 className="text-xl font-bold mb-2">3D Badminton Arena</h3>
              <p className="text-gray-600 mb-4">
                Perfect your serves, smashes, and net play in a 3D badminton environment
              </p>
              <button className="bg-red-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-700">
                Try Experience
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">How 3D Sports Experience Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-red-600">1</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Select Sport</h3>
              <p className="text-gray-600">
                Choose from a variety of sports available in our 3D experience platform
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Customize Training</h3>
              <p className="text-gray-600">
                Set your skill level, training duration, and specific areas to focus on
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">3</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Train & Improve</h3>
              <p className="text-gray-600">
                Engage in immersive 3D training sessions and track your progress
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Benefits of 3D Sports Training</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4 text-red-500">🎯</div>
              <h3 className="text-xl font-bold mb-3">Precision Training</h3>
              <p className="text-gray-600">
                Practice specific techniques and movements with precise feedback in a risk-free environment
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4 text-green-500">📊</div>
              <h3 className="text-xl font-bold mb-3">Performance Analytics</h3>
              <p className="text-gray-600">
                Get detailed analytics on your performance to identify areas for improvement
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4 text-blue-500">🔄</div>
              <h3 className="text-xl font-bold mb-3">Repeatable Scenarios</h3>
              <p className="text-gray-600">
                Practice challenging game situations repeatedly until you master them
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4 text-yellow-500">🛡️</div>
              <h3 className="text-xl font-bold mb-3">Injury Prevention</h3>
              <p className="text-gray-600">
                Practice movements safely without the risk of physical injury
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4 text-indigo-500">🌍</div>
              <h3 className="text-xl font-bold mb-3">Accessible Anywhere</h3>
              <p className="text-gray-600">
                Access training modules from anywhere with an internet connection
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4 text-purple-500">👥</div>
              <h3 className="text-xl font-bold mb-3">Coach Integration</h3>
              <p className="text-gray-600">
                Coaches can assign specific 3D training modules to their players
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Integration with Platform */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Seamless Integration with TeamUp India</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
            Our 3D sports experience seamlessly integrates with the TeamUp India platform, allowing coaches to assign training modules, 
            players to track their progress, and stores to offer 3D equipment visualization.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-3 text-red-600">For Coaches</h3>
              <p className="text-gray-600">
                Assign 3D training modules to players and track their virtual performance
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-3 text-red-600">For Players</h3>
              <p className="text-gray-600">
                Access immersive training sessions and improve skills in a virtual environment
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-3 text-red-600">For Stores</h3>
              <p className="text-gray-600">
                Offer 3D product visualization to help customers make informed purchases
              </p>
            </div>
          </div>
          
          <Link href="/register" className="inline-block bg-red-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-red-700 transition duration-300">
            Get Started with 3D Training
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ThreeDSportsExperiencePage;