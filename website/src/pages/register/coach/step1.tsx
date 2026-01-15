import Head from 'next/head';
import Link from 'next/link';

export default function CoachRegisterStep1() {
  return (
    <div>
      <Head>
        <title>Register as Coach - Step 1 - TeamUp India</title>
        <meta name="description" content="Register as a coach on TeamUp India - Step 1: Basic Details" />
      </Head>

      {/* Coach Registration Hero */}
      <section className="py-20 px-6 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-6">Become a Verified Coach</h1>
          <p className="text-xl text-gray-300">Join our verified coach network and grow your business</p>
        </div>
      </section>

      {/* Coach Registration Form */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200">
            <div className="mb-8">
              <div className="flex items-center justify-center">
                <div className="text-4xl mr-4">👨‍🏫</div>
                <h2 className="text-2xl font-bold text-gray-800">Coach Registration</h2>
              </div>
              <p className="text-center text-gray-600 mt-2">Complete the form to register as a verified coach</p>
            </div>
            
            <div className="mb-6">
              <div className="flex justify-center">
                <div className="flex space-x-2">
                  <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center">1</div>
                  <div className="w-1 h-1 rounded-full bg-gray-300 self-center"></div>
                  <div className="w-8 h-8 rounded-full bg-gray-300 text-white flex items-center justify-center">2</div>
                  <div className="w-1 h-1 rounded-full bg-gray-300 self-center"></div>
                  <div className="w-8 h-8 rounded-full bg-gray-300 text-white flex items-center justify-center">3</div>
                  <div className="w-1 h-1 rounded-full bg-gray-300 self-center"></div>
                  <div className="w-8 h-8 rounded-full bg-gray-300 text-white flex items-center justify-center">4</div>
                  <div className="w-1 h-1 rounded-full bg-gray-300 self-center"></div>
                  <div className="w-8 h-8 rounded-full bg-gray-300 text-white flex items-center justify-center">5</div>
                </div>
              </div>
              <p className="text-center text-gray-600 text-sm mt-2">Step 1 of 5: Basic Details</p>
            </div>
            
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-gray-700 font-medium mb-2">Full Name *</label>
                  <input 
                    type="text" 
                    id="firstName" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    placeholder="Enter your full name" 
                  />
                </div>
                <div>
                  <label htmlFor="mobile" className="block text-gray-700 font-medium mb-2">Mobile Number *</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">+91</span>
                    <input 
                      type="tel" 
                      id="mobile" 
                      className="flex-1 min-w-0 block w-full px-3 py-3 rounded-none rounded-r-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500" 
                      placeholder="Enter your mobile number" 
                    />
                  </div>
                  <button type="button" className="mt-2 text-blue-600 hover:underline text-sm">
                    Send OTP
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email Address *</label>
                  <input 
                    type="email" 
                    id="email" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    placeholder="Enter your email address" 
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-gray-700 font-medium mb-2">Password *</label>
                  <input 
                    type="password" 
                    id="password" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    placeholder="Create a password" 
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="profileImage" className="block text-gray-700 font-medium mb-2">Profile Photo *</label>
                <div className="flex items-center">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg w-16 h-16 flex items-center justify-center">
                    <span className="text-gray-400 text-2xl">+</span>
                  </div>
                  <div className="ml-4">
                    <button type="button" className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-lg text-sm">
                      Upload Photo
                    </button>
                    <p className="text-gray-500 text-xs mt-1">JPG, PNG up to 2MB</p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between">
                <Link href="/register" className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg transition duration-300">
                  Back to Registration
                </Link>
                <Link href="/register/coach/step2" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-300">
                  Continue to Step 2
                </Link>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Benefits for Coaches */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Why Register as a Coach?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Earning Opportunities</h3>
              <p className="text-gray-600">Earn through bookings and grow your coaching business.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Verified Status</h3>
              <p className="text-gray-600">Get verified status to build trust with players.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Analytics</h3>
              <p className="text-gray-600">Track your bookings, earnings, and performance.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Community</h3>
              <p className="text-gray-600">Connect with players and other coaches.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}