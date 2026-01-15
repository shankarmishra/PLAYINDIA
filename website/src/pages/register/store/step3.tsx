import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

const StoreRegistrationStep3 = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    gstNumber: '',
    storeCategory: '',
    operatingHours: '',
    businessName: '',
    legalAddress: ''
  });
  const [gstVerified, setGstVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [gstLoading, setGstLoading] = useState(false);

  // Load existing data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('storeRegistrationData');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setFormData({
        gstNumber: parsedData.gstNumber || '',
        storeCategory: parsedData.storeCategory || '',
        operatingHours: parsedData.operatingHours || '',
        businessName: parsedData.businessName || '',
        legalAddress: parsedData.legalAddress || ''
      });
      setGstVerified(parsedData.gstVerified || false);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGstVerification = async () => {
    if (!formData.gstNumber) {
      alert('Please enter a GST number');
      return;
    }

    setGstLoading(true);
    
    // Simulate GST API verification
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock verification - in real app, this would be an API call
    const mockGstData = {
      businessName: 'Sports Gear Hub',
      legalAddress: '123 Main Street, Mumbai, Maharashtra 400001',
      status: 'Active'
    };

    setFormData(prev => ({
      ...prev,
      businessName: mockGstData.businessName,
      legalAddress: mockGstData.legalAddress
    }));
    setGstVerified(true);
    setGstLoading(false);
    
    // Save to localStorage
    const existingData = JSON.parse(localStorage.getItem('storeRegistrationData') || '{}');
    const updatedData = {
      ...existingData,
      ...formData,
      businessName: mockGstData.businessName,
      legalAddress: mockGstData.legalAddress,
      gstVerified: true
    };
    localStorage.setItem('storeRegistrationData', JSON.stringify(updatedData));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Save current step data
    const existingData = JSON.parse(localStorage.getItem('storeRegistrationData') || '{}');
    const updatedData = {
      ...existingData,
      ...formData,
      gstVerified
    };
    localStorage.setItem('storeRegistrationData', JSON.stringify(updatedData));

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setLoading(false);
    router.push('/register/store/step4');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Head>
        <title>Store Registration - Step 3 | TeamUp India</title>
        <meta name="description" content="Register your store with TeamUp India" />
      </Head>

      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="md:flex">
          {/* Left side - Progress and Info */}
          <div className="md:w-2/5 bg-gradient-to-b from-blue-600 to-indigo-700 text-white p-8 flex flex-col">
            <h1 className="text-2xl font-bold mb-6">Store Registration</h1>
            
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Step 3 of 4</span>
                <span className="text-sm font-medium">75% Complete</span>
              </div>
              <div className="w-full bg-blue-400 rounded-full h-2">
                <div className="bg-white h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>

            <div className="space-y-4 flex-grow">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center mr-3">
                  <span className="text-sm font-bold">✓</span>
                </div>
                <span className="text-sm">Store Details</span>
              </div>
              
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center mr-3">
                  <span className="text-sm font-bold">✓</span>
                </div>
                <span className="text-sm">Address & Location</span>
              </div>
              
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-white text-blue-600 flex items-center justify-center mr-3">
                  <span className="text-sm font-bold">3</span>
                </div>
                <span className="text-sm font-medium">Business Details</span>
              </div>
              
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center mr-3">
                  <span className="text-sm font-bold">4</span>
                </div>
                <span className="text-sm">Documents</span>
              </div>
            </div>

            <div className="mt-8 text-center text-blue-200 text-sm">
              <p>Need help? Contact support@teamupindia.com</p>
            </div>
          </div>

          {/* Right side - Form */}
          <div className="md:w-3/5 p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Business Details</h2>
            <p className="text-gray-600 mb-8">Please provide your business information and GST details</p>

            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">GST Number</label>
                  <div className="flex">
                    <input
                      type="text"
                      name="gstNumber"
                      value={formData.gstNumber}
                      onChange={handleInputChange}
                      required
                      className="flex-grow px-4 py-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter GST Number (e.g. 22AAAAA0000A1Z5)"
                    />
                    <button
                      type="button"
                      onClick={handleGstVerification}
                      disabled={gstLoading || gstVerified}
                      className={`px-4 py-3 rounded-r-lg ${gstVerified ? 'bg-green-500 text-white' : 'bg-blue-600 text-white'} ${gstLoading || gstVerified ? 'opacity-75 cursor-not-allowed' : 'hover:bg-blue-700'}`}
                    >
                      {gstLoading ? 'Verifying...' : gstVerified ? 'Verified ✓' : 'Verify'}
                    </button>
                  </div>
                  {gstVerified && (
                    <p className="text-green-600 text-sm mt-1">GST verified successfully</p>
                  )}
                </div>

                {gstVerified && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Business/Legal Name</label>
                      <input
                        type="text"
                        name="businessName"
                        value={formData.businessName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Business name from GST records"
                        readOnly
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Legal Address</label>
                      <textarea
                        name="legalAddress"
                        value={formData.legalAddress}
                        onChange={handleInputChange}
                        required
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Legal address from GST records"
                        readOnly
                      ></textarea>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Store Category</label>
                  <select
                    name="storeCategory"
                    value={formData.storeCategory}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select store category</option>
                    <option value="sports-equipment">Sports Equipment</option>
                    <option value="sports-clothing">Sports Clothing & Accessories</option>
                    <option value="fitness">Fitness Equipment</option>
                    <option value="outdoor-gear">Outdoor Sports Gear</option>
                    <option value="team-uniforms">Team Uniforms</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Operating Hours</label>
                  <textarea
                    name="operatingHours"
                    value={formData.operatingHours}
                    onChange={handleInputChange}
                    required
                    rows={2}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Monday to Saturday: 9 AM - 9 PM, Sunday: 10 AM - 6 PM"
                  ></textarea>
                </div>

                {/* Auto-verification information */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-medium text-blue-800 mb-2">Auto-Verification System</h3>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• GST number will be verified automatically</li>
                    <li>• Business details fetched from government database</li>
                    <li>• Address verification using official records</li>
                    <li>• Admin will review and approve</li>
                  </ul>
                </div>

                <div className="flex justify-between">
                  <Link href="/register/store/step2" className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    Back
                  </Link>
                  <button
                    type="submit"
                    disabled={loading || !gstVerified}
                    className={`px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${loading || !gstVerified ? 'opacity-75 cursor-not-allowed' : ''}`}
                  >
                    {loading ? 'Processing...' : 'Next: Documents'}
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

export default StoreRegistrationStep3;