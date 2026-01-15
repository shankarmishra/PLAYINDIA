import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

const DeliveryRegistrationStep2 = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    address: '',
    city: '',
    state: '',
    pincode: ''
  });
  const [loading, setLoading] = useState(false);

  // Load existing data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('deliveryRegistrationData');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setFormData({
        address: parsedData.address || '',
        city: parsedData.city || '',
        state: parsedData.state || '',
        pincode: parsedData.pincode || ''
      });
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Save current step data
    const existingData = JSON.parse(localStorage.getItem('deliveryRegistrationData') || '{}');
    const updatedData = {
      ...existingData,
      ...formData
    };
    localStorage.setItem('deliveryRegistrationData', JSON.stringify(updatedData));

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setLoading(false);
    router.push('/register/delivery/step3');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Head>
        <title>Delivery Registration - Step 2 | TeamUp India</title>
        <meta name="description" content="Register as a delivery partner with TeamUp India" />
      </Head>

      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="md:flex">
          {/* Left side - Progress and Info */}
          <div className="md:w-2/5 bg-gradient-to-b from-blue-600 to-indigo-700 text-white p-8 flex flex-col">
            <h1 className="text-2xl font-bold mb-6">Delivery Partner Registration</h1>
            
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Step 2 of 5</span>
                <span className="text-sm font-medium">40% Complete</span>
              </div>
              <div className="w-full bg-blue-400 rounded-full h-2">
                <div className="bg-white h-2 rounded-full" style={{ width: '40%' }}></div>
              </div>
            </div>

            <div className="space-y-4 flex-grow">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center mr-3">
                  <span className="text-sm font-bold">✓</span>
                </div>
                <span className="text-sm">Personal Details</span>
              </div>
              
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-white text-blue-600 flex items-center justify-center mr-3">
                  <span className="text-sm font-bold">2</span>
                </div>
                <span className="text-sm font-medium">Address</span>
              </div>
              
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center mr-3">
                  <span className="text-sm font-bold">3</span>
                </div>
                <span className="text-sm">Vehicle Details</span>
              </div>
              
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center mr-3">
                  <span className="text-sm font-bold">4</span>
                </div>
                <span className="text-sm">Documents</span>
              </div>
              
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center mr-3">
                  <span className="text-sm font-bold">5</span>
                </div>
                <span className="text-sm">Bank Details</span>
              </div>
            </div>

            <div className="mt-8 text-center text-blue-200 text-sm">
              <p>Need help? Contact support@teamupindia.com</p>
            </div>
          </div>

          {/* Right side - Form */}
          <div className="md:w-3/5 p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Address Details</h2>
            <p className="text-gray-600 mb-8">Please provide your current address for verification</p>

            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Address</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your complete address"
                  ></textarea>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="State"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Pincode"
                  />
                </div>

                {/* Google Maps Placeholder */}
                <div className="border border-gray-300 rounded-lg h-48 flex items-center justify-center bg-gray-100">
                  <div className="text-center">
                    <div className="text-gray-500 mb-2">Google Maps Integration</div>
                    <p className="text-sm text-gray-600">Map will show your location for verification</p>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Link href="/register/delivery/step1" className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    Back
                  </Link>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
                  >
                    {loading ? 'Processing...' : 'Next: Vehicle Details'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryRegistrationStep2;