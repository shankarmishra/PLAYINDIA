import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function DeliveryRegister() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    workingArea: '',
    city: '',
    state: '',
    vehicleType: '',
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
      const response = await fetch('/api/delivery/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          mobile: formData.mobile,
          password: formData.password,
          workingArea: formData.workingArea,
          city: formData.city,
          state: formData.state,
          vehicleType: formData.vehicleType,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      
      // Registration successful - redirect to registration status page
      alert('Registration submitted successfully! Your application is under review.');
      router.push('/registration-status');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during registration');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Head>
        <title>Register as Delivery Partner - TeamUp India Sports Platform</title>
        <meta name="description" content="Register as a delivery partner on TeamUp India to earn by delivering sports equipment" />
      </Head>

      {/* Delivery Registration Hero */}
      <section className="py-20 px-6 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-6">Register as Delivery Partner</h1>
          <p className="text-xl text-gray-300">Earn by delivering sports equipment and connecting with customers</p>
        </div>
      </section>

      {/* Delivery Registration Form */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200">
            <div className="mb-8">
              <div className="flex items-center justify-center">
                <div className="text-4xl mr-4">🚴</div>
                <h2 className="text-2xl font-bold text-gray-800">Delivery Partner Registration</h2>
              </div>
              <p className="text-center text-gray-600 mt-2">Complete the form to register as a delivery partner</p>
            </div>
            
            <div className="mb-6">
              <div className="flex justify-center">
                <div className="flex space-x-2">
                  <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center">1</div>
                  <div className="w-1 h-1 rounded-full bg-gray-300 self-center"></div>
                  <div className="w-8 h-8 rounded-full bg-gray-300 text-white flex items-center justify-center">2</div>
                  <div className="w-1 h-1 rounded-full bg-gray-300 self-center"></div>
                  <div className="w-8 h-8 rounded-full bg-gray-300 text-white flex items-center justify-center">3</div>
                  <div className="w-1 h-1 rounded-full bg-gray-300 self-center"></div>
                  <div className="w-8 h-8 rounded-full bg-gray-300 text-white flex items-center justify-center">4</div>
                </div>
              </div>
              <p className="text-center text-gray-600 text-sm mt-2">Step 1 of 4: Personal Details</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-gray-700 font-medium mb-2">First Name</label>
                  <input 
                    type="text" 
                    id="firstName" 
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" 
                    placeholder="Enter your first name" 
                    required
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-gray-700 font-medium mb-2">Last Name</label>
                  <input 
                    type="text" 
                    id="lastName" 
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" 
                    placeholder="Enter your last name" 
                    required
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" 
                  placeholder="Enter your email address" 
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" 
                  placeholder="Enter your mobile number" 
                  required
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-gray-700 font-medium mb-2">Password</label>
                <input 
                  type="password" 
                  id="password" 
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" 
                  placeholder="Create a password" 
                  required
                />
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-2">Confirm Password</label>
                <input 
                  type="password" 
                  id="confirmPassword" 
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" 
                  placeholder="Confirm your password" 
                  required
                />
              </div>
              
              <div>
                <label htmlFor="workingArea" className="block text-gray-700 font-medium mb-2">Working Area</label>
                <textarea 
                  id="workingArea" 
                  value={formData.workingArea}
                  onChange={handleChange}
                  rows={2} 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" 
                  placeholder="Enter the area(s) where you can provide delivery services" 
                  required
                ></textarea>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="city" className="block text-gray-700 font-medium mb-2">City</label>
                  <input 
                    type="text" 
                    id="city" 
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" 
                    placeholder="City" 
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" 
                    placeholder="State" 
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="vehicleType" className="block text-gray-700 font-medium mb-2">Vehicle Type</label>
                <select 
                  id="vehicleType" 
                  value={formData.vehicleType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                >
                  <option value="">Select vehicle type</option>
                  <option value="bicycle">Bicycle</option>
                  <option value="scooter">Scooter</option>
                  <option value="motorcycle">Motorcycle</option>
                  <option value="car">Car</option>
                  <option value="bike">Bike</option>
                </select>
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
                  className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Processing...' : 'Continue to Step 2'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Benefits for Delivery Partners */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Why Register as Delivery Partner?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Earning Opportunities</h3>
              <p className="text-gray-600">Earn through deliveries and tips from customers.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="text-4xl mb-4">📍</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Flexible Schedule</h3>
              <p className="text-gray-600">Work on your own schedule and choose your hours.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Performance Tracking</h3>
              <p className="text-gray-600">Track your deliveries, earnings, and ratings.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="text-4xl mb-4">🚴</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Growing Demand</h3>
              <p className="text-gray-600">High demand for sports equipment delivery services.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-gradient-to-r from-green-500 to-blue-500 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Earning?</h2>
          <p className="text-xl mb-8">Join thousands of delivery partners on TeamUp India.</p>
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