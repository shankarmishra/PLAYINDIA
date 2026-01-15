import Head from 'next/head';
import Link from 'next/link';

export default function CoachRegisterStep3() {
  return (
    <div>
      <Head>
        <title>Register as Coach - Step 3 - TeamUp India</title>
        <meta name="description" content="Register as a coach on TeamUp India - Step 3: Location & Address" />
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
                  <div className="w-1 h-1 rounded-full bg-blue-500 self-center"></div>
                  <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center">2</div>
                  <div className="w-1 h-1 rounded-full bg-blue-500 self-center"></div>
                  <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center">3</div>
                  <div className="w-1 h-1 rounded-full bg-gray-300 self-center"></div>
                  <div className="w-8 h-8 rounded-full bg-gray-300 text-white flex items-center justify-center">4</div>
                  <div className="w-1 h-1 rounded-full bg-gray-300 self-center"></div>
                  <div className="w-8 h-8 rounded-full bg-gray-300 text-white flex items-center justify-center">5</div>
                </div>
              </div>
              <p className="text-center text-gray-600 text-sm mt-2">Step 3 of 5: Location & Address</p>
            </div>
            
            <form className="space-y-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Select Your Location *</label>
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-64 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl mb-2">📍</div>
                    <p className="text-gray-600">Google Maps Interface</p>
                    <p className="text-gray-500 text-sm mt-1">Coach drops pin on map</p>
                  </div>
                </div>
                <p className="text-gray-500 text-sm mt-2">Drag the marker to set your coaching location</p>
              </div>
              
              <div>
                <label htmlFor="address" className="block text-gray-700 font-medium mb-2">Full Address *</label>
                <textarea 
                  id="address" 
                  rows={3} 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  placeholder="Complete address will be auto-filled from map selection"
                ></textarea>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="city" className="block text-gray-700 font-medium mb-2">City *</label>
                  <input 
                    type="text" 
                    id="city" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    placeholder="City"
                  />
                </div>
                <div>
                  <label htmlFor="state" className="block text-gray-700 font-medium mb-2">State *</label>
                  <input 
                    type="text" 
                    id="state" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    placeholder="State"
                  />
                </div>
                <div>
                  <label htmlFor="pincode" className="block text-gray-700 font-medium mb-2">Pincode *</label>
                  <input 
                    type="text" 
                    id="pincode" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    placeholder="Pincode"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="coachingRadius" className="block text-gray-700 font-medium mb-2">Coaching Radius (km) *</label>
                <div className="flex items-center">
                  <input 
                    type="range" 
                    id="coachingRadius" 
                    min="1" 
                    max="50" 
                    defaultValue="10" 
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="ml-4 w-12 text-gray-700 font-medium">10 km</span>
                </div>
                <p className="text-gray-500 text-sm mt-1">Distance you're willing to travel for coaching sessions</p>
              </div>
              
              <div className="flex justify-between">
                <Link href="/register/coach/step2" className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg transition duration-300">
                  Back to Step 2
                </Link>
                <Link href="/register/coach/step4" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-300">
                  Continue to Step 4
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