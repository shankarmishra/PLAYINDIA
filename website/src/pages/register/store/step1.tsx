import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';

export default function StoreRegisterStep1() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  
  return (
    <div>
      <Head>
        <title>Register as Store - Step 1 - TeamUp India</title>
        <meta name="description" content="Register your sports equipment store on TeamUp India - Step 1: Store Details" />
      </Head>

      {/* Store Registration Hero */}
      <section className="py-20 px-6 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-6">Sell Sports Products on TeamUp</h1>
          <p className="text-xl text-gray-300">Expand your sports equipment business with TeamUp India</p>
        </div>
      </section>

      {/* Store Registration Form */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200">
            <div className="mb-8">
              <div className="flex items-center justify-center">
                <div className="text-4xl mr-4">🏪</div>
                <h2 className="text-2xl font-bold text-gray-800">Store Registration</h2>
              </div>
              <p className="text-center text-gray-600 mt-2">Complete the form to register your sports equipment store</p>
            </div>
            
            <div className="mb-6">
              <div className="flex justify-center">
                <div className="flex space-x-2">
                  <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center">1</div>
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
              <p className="text-center text-gray-600 text-sm mt-2">Step 1 of 5: Store Details</p>
            </div>
            
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="storeName" className="block text-gray-700 font-medium mb-2">Store Name *</label>
                  <input 
                    type="text" 
                    id="storeName" 
                    className="w-full px-4 py-3 border-2 border-gray-700 rounded-lg focus:ring-orange-500 focus:border-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-200 transition-colors duration-200 bg-white text-gray-900 font-medium"
                    placeholder="Enter your store name" 
                  />
                </div>
                <div>
                  <label htmlFor="ownerName" className="block text-gray-700 font-medium mb-2">Owner Name *</label>
                  <input 
                    type="text" 
                    id="ownerName" 
                    className="w-full px-4 py-3 border-2 border-gray-700 rounded-lg focus:ring-orange-500 focus:border-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-200 transition-colors duration-200 bg-white text-gray-900 font-medium"
                    placeholder="Enter owner's name" 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email Address *</label>
                  <input 
                    type="email" 
                    id="email" 
                    className="w-full px-4 py-3 border-2 border-gray-700 rounded-lg focus:ring-orange-500 focus:border-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-200 transition-colors duration-200 bg-white text-gray-900 font-medium"
                    placeholder="Enter your email address" 
                  />
                </div>
                <div>
                  <label htmlFor="mobile" className="block text-gray-700 font-medium mb-2">Mobile Number *</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">+91</span>
                    <input 
                      type="tel" 
                      id="mobile" 
                      className="flex-1 min-w-0 block w-full px-3 py-3 rounded-none rounded-r-md border border-gray-300 focus:ring-orange-500 focus:border-orange-500" 
                      placeholder="Enter your mobile number" 
                    />
                  </div>
                  <button type="button" className="mt-2 text-orange-600 hover:underline text-sm">
                    Send OTP
                  </button>
                </div>
              </div>
              
              <div className="relative">
                <label htmlFor="password" className="block text-gray-700 font-medium mb-2">Password *</label>
                <input 
                  type={passwordVisible ? "text" : "password"} 
                  id="password" 
                  className="w-full px-4 py-3 pr-10 border-2 border-gray-700 rounded-lg focus:ring-orange-500 focus:border-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-200 transition-colors duration-200 bg-white text-gray-900 font-medium"
                  placeholder="Create a password" 
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                  aria-label={passwordVisible ? "Hide password" : "Show password"}
                >
                  {passwordVisible ? (
                    <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                    </svg>
                  )}
                </button>
              </div>
              
              <div>
                <label htmlFor="storeAddress" className="block text-gray-700 font-medium mb-2">Store Address *</label>
                <textarea 
                  id="storeAddress" 
                  rows={3} 
                  className="w-full px-4 py-3 border-2 border-gray-700 rounded-lg focus:ring-orange-500 focus:border-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-200 transition-colors duration-200 bg-white text-gray-900 font-medium"
                  placeholder="Enter your complete store address" 
                ></textarea>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="city" className="block text-gray-700 font-medium mb-2">City *</label>
                  <input 
                    type="text" 
                    id="city" 
                    className="w-full px-4 py-3 border-2 border-gray-700 rounded-lg focus:ring-orange-500 focus:border-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-200 transition-colors duration-200 bg-white text-gray-900 font-medium"
                    placeholder="City" 
                  />
                </div>
                <div>
                  <label htmlFor="state" className="block text-gray-700 font-medium mb-2">State *</label>
                  <input 
                    type="text" 
                    id="state" 
                    className="w-full px-4 py-3 border-2 border-gray-700 rounded-lg focus:ring-orange-500 focus:border-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-200 transition-colors duration-200 bg-white text-gray-900 font-medium"
                    placeholder="State" 
                  />
                </div>
                <div>
                  <label htmlFor="pincode" className="block text-gray-700 font-medium mb-2">Pincode *</label>
                  <input 
                    type="text" 
                    id="pincode" 
                    className="w-full px-4 py-3 border-2 border-gray-700 rounded-lg focus:ring-orange-500 focus:border-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-200 transition-colors duration-200 bg-white text-gray-900 font-medium"
                    placeholder="Pincode" 
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="storeType" className="block text-gray-700 font-medium mb-2">Store Type *</label>
                <select 
                  id="storeType" 
                  className="w-full px-4 py-3 border-2 border-gray-700 rounded-lg focus:ring-orange-500 focus:border-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-200 transition-colors duration-200 bg-white text-gray-900 font-medium"
                >
                  <option value="">Select store type</option>
                  <option value="sports-equipment">Sports Equipment</option>
                  <option value="fitness">Fitness Equipment</option>
                  <option value="apparel">Sports Apparel</option>
                  <option value="multi">Multi-Sport Store</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="serviceRadius" className="block text-gray-700 font-medium mb-2">Service Radius (km) *</label>
                <div className="flex items-center">
                  <input 
                    type="range" 
                    id="serviceRadius" 
                    min="1" 
                    max="50" 
                    defaultValue="5" 
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="ml-4 w-12 text-gray-700 font-medium">5 km</span>
                </div>
              </div>
              
              <div className="flex justify-between">
                <Link href="/register" className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg transition duration-300">
                  Back to Registration
                </Link>
                <Link href="/register/store/step2" className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-300">
                  Continue to Step 2
                </Link>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Benefits for Stores */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Why Register as a Store?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="text-4xl mb-4">📈</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Increased Sales</h3>
              <p className="text-gray-600">Reach more customers and increase your sales.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="text-4xl mb-4">🚚</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Delivery Network</h3>
              <p className="text-gray-600">Connect with delivery partners for fast delivery.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Analytics</h3>
              <p className="text-gray-600">Track sales, popular products, and customer insights.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Customer Base</h3>
              <p className="text-gray-600">Access to a large customer base of sports enthusiasts.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}