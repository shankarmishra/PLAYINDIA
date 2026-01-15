import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { ApiService } from '../../utils/api';

export default function StoreRegister() {
  const [formData, setFormData] = useState({
    storeName: '',
    ownerName: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    storeAddress: '',
    city: '',
    state: '',
    pincode: '',
    storeType: '',
    gstNumber: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Prepare form data for submission - backend accepts name, fullName, ownerName, or storeName
      const submissionData = {
        name: formData.ownerName.trim() || formData.storeName.trim(),
        email: formData.email.trim(),
        mobile: formData.mobile.trim(),
        password: formData.password,
        role: 'seller', // Backend User model uses 'seller', not 'store'
        // Additional store-specific fields (will be handled in profile update)
        storeName: formData.storeName.trim(),
        address: formData.storeAddress.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        pincode: formData.pincode.trim(),
        storeType: formData.storeType,
        gstNumber: formData.gstNumber.trim(),
      };
      
      // Submit to backend API
      const response: any = await ApiService.auth.register(submissionData);
      
      if (response.data && response.data.success) {
        alert('Registration submitted successfully! Your application is under review.');
        router.push('/registration-status');
      } else {
        setError(response.data?.message || 'Registration failed. Please try again.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred during registration. Please try again.');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Head>
        <title>Register as Store - TeamUp India Sports Platform</title>
        <meta name="description" content="Register your sports equipment store on TeamUp India to reach more customers" />
      </Head>

      {/* Store Registration Hero */}
      <section className="py-20 px-6 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-6">Register as Store</h1>
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
                </div>
              </div>
              <p className="text-center text-gray-600 text-sm mt-2">Step 1 of 4: Store Details</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="storeName" className="block text-gray-700 font-medium mb-2">Store Name</label>
                  <input 
                    type="text" 
                    id="storeName" 
                    value={formData.storeName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" 
                    placeholder="Store name" 
                    required
                    minLength={2}
                  />
                </div>
                <div>
                  <label htmlFor="ownerName" className="block text-gray-700 font-medium mb-2">Owner Name</label>
                  <input 
                    type="text" 
                    id="ownerName" 
                    value={formData.ownerName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" 
                    placeholder="Owner's full name" 
                    required
                    minLength={2}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" 
                  placeholder="your.email@example.com" 
                  required
                />
              </div>
              
              <div>
                <label htmlFor="mobile" className="block text-gray-700 font-medium mb-2">Mobile Number</label>
                <input 
                  type="tel" 
                  id="mobile" 
                  value={formData.mobile}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" 
                  placeholder="Enter 10-digit mobile number (e.g., 9876543210)" 
                  required
                  pattern="[0-9]{10}"
                  maxLength={10}
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-gray-700 font-medium mb-2">Password</label>
                <input 
                  type="password" 
                  id="password" 
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" 
                  placeholder="Min 8 chars with uppercase, lowercase, number & special char" 
                  required
                  minLength={8}
                />
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-2">Confirm Password</label>
                <input 
                  type="password" 
                  id="confirmPassword" 
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" 
                  placeholder="Re-enter your password" 
                  required
                  minLength={8}
                />
              </div>
              
              <div>
                <label htmlFor="storeAddress" className="block text-gray-700 font-medium mb-2">Store Address</label>
                  <textarea 
                  id="storeAddress" 
                  value={formData.storeAddress}
                  onChange={handleChange}
                  rows={3} 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" 
                  placeholder="Complete store address" 
                  required
                ></textarea>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="city" className="block text-gray-700 font-medium mb-2">City</label>
                  <input 
                    type="text" 
                    id="city" 
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" 
                    placeholder="City name" 
                    required
                  />
                </div>
                <div>
                  <label htmlFor="state" className="block text-gray-700 font-medium mb-2">State</label>
                  <input 
                    type="text" 
                    id="state" 
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" 
                    placeholder="State name" 
                    required
                  />
                </div>
                <div>
                  <label htmlFor="pincode" className="block text-gray-700 font-medium mb-2">Pincode</label>
                  <input 
                    type="text" 
                    id="pincode" 
                    value={formData.pincode}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" 
                    placeholder="6-digit pincode" 
                    required
                    pattern="[0-9]{6}"
                    maxLength={6}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="storeType" className="block text-gray-700 font-medium mb-2">Store Type</label>
                <select 
                  id="storeType" 
                  value={formData.storeType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                >
                  <option value="">Select store type</option>
                  <option value="sports-equipment">Sports Equipment</option>
                  <option value="fitness">Fitness Equipment</option>
                  <option value="apparel">Sports Apparel</option>
                  <option value="multi">Multi-Sport Store</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="gstNumber" className="block text-gray-700 font-medium mb-2">GST Number (Optional)</label>
                  <input 
                  type="text" 
                  id="gstNumber" 
                  value={formData.gstNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" 
                  placeholder="GST number (optional)" 
                />
              </div>
              
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                  <span className="block sm:inline">{error}</span>
                </div>
              )}
              
              <div className="flex justify-between">
                <Link href="/register" className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg transition duration-300">
                  Back to Registration
                </Link>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Processing...' : 'Continue to Step 2'}
                </button>
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

      {/* CTA */}
      <section className="py-16 px-6 bg-gradient-to-r from-green-500 to-blue-500 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Grow Your Business?</h2>
          <p className="text-xl mb-8">Join thousands of sports stores on TeamUp India.</p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button className="bg-white text-green-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold transition duration-300">
              Download App
            </button>
            <Link href="/login" className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-lg font-semibold transition duration-300">
              Login
            </Link>
          </div>
        </div>
      </section>

      </div>
  );
}