import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../../components/Layout';

const Access3DExperiencePage = () => {
  return (
    <Layout title="Access 3D Experience - TeamUp India" description="Access the immersive 3D sports experience">
      <Head>
        <title>Access 3D Experience - TeamUp India</title>
        <meta name="description" content="Access the immersive 3D sports experience" />
      </Head>

      <div className="max-w-7xl mx-auto py-8 px-6">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Access 3D Sports Experience</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">Get ready to experience sports like never before with our immersive 3D technology</p>
        </div>

        <div className="bg-gradient-to-r from-blue-900 to-purple-900 text-white rounded-xl p-8 mb-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">3D Sports Experience Ready</h2>
            <p className="text-gray-200 mb-6 max-w-2xl mx-auto">Your immersive 3D training environment is prepared. Make sure you have the required hardware and software to experience the full potential of our 3D technology.</p>
            
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-lg max-w-2xl mx-auto">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-64 mx-auto mb-6 flex items-center justify-center">
                <span className="text-gray-500 text-lg">3D Sports Experience Interface</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white/10 p-4 rounded-lg">
                  <h3 className="font-bold mb-2">System Check</h3>
                  <p className="text-sm text-gray-200">VR Ready: <span className="text-green-400">Compatible</span></p>
                </div>
                <div className="bg-white/10 p-4 rounded-lg">
                  <h3 className="font-bold mb-2">Connection</h3>
                  <p className="text-sm text-gray-200">Internet: <span className="text-green-400">Optimal</span></p>
                </div>
                <div className="bg-white/10 p-4 rounded-lg">
                  <h3 className="font-bold mb-2">Access</h3>
                  <p className="text-sm text-gray-200">Status: <span className="text-green-400">Available</span></p>
                </div>
              </div>
              
              <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg transition duration-300">
                Launch 3D Experience
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-gray-900 mb-4">System Requirements</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Modern web browser (Chrome, Firefox, Safari, Edge)</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Stable internet connection (minimum 10 Mbps)</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Compatible VR headset (optional but recommended)</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Graphics card supporting WebGL 2.0</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Minimum 4GB RAM</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-gray-900 mb-4">What to Expect</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Immersive 3D training environments for various sports</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Real-time performance feedback and analytics</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Interactive coaching and skill development modules</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Progress tracking and performance comparison</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Virtual opponents and challenge modes</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="text-center">
          <p className="text-gray-600 mb-6">Ready to transform your sports training experience?</p>
          <Link href="/player/experience" className="inline-block bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 px-6 rounded-lg transition duration-300">
            Back to 3D Experience
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default Access3DExperiencePage;