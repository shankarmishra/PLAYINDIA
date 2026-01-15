import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

const DeliveryRegistrationStep5 = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    accountNumber: '',
    confirmAccountNumber: '',
    ifscCode: '',
    accountHolderName: ''
  });
  const [bankVerified, setBankVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verificationLoading, setVerificationLoading] = useState(false);

  // Load existing data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('deliveryRegistrationData');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setFormData({
        accountNumber: parsedData.accountNumber || '',
        confirmAccountNumber: parsedData.confirmAccountNumber || '',
        ifscCode: parsedData.ifscCode || '',
        accountHolderName: parsedData.accountHolderName || ''
      });
      setBankVerified(parsedData.bankVerified || false);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBankVerification = async () => {
    if (!formData.accountNumber || !formData.ifscCode || !formData.accountHolderName) {
      alert('Please fill all required fields');
      return;
    }

    if (formData.accountNumber !== formData.confirmAccountNumber) {
      alert('Account numbers do not match');
      return;
    }

    setVerificationLoading(true);
    
    // Simulate bank verification (penny drop method)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock verification - in real app, this would be an API call
    const mockBankData = {
      bankName: 'State Bank of India',
      branchName: 'Mumbai Central',
      accountType: 'Savings Account'
    };

    setBankVerified(true);
    setVerificationLoading(false);
    
    // Save to localStorage
    const existingData = JSON.parse(localStorage.getItem('deliveryRegistrationData') || '{}');
    const updatedData = {
      ...existingData,
      ...formData,
      bankVerified: true,
      bankName: mockBankData.bankName,
      branchName: mockBankData.branchName,
      accountType: mockBankData.accountType
    };
    localStorage.setItem('deliveryRegistrationData', JSON.stringify(updatedData));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Save current step data
    const existingData = JSON.parse(localStorage.getItem('deliveryRegistrationData') || '{}');
    const updatedData = {
      ...existingData,
      ...formData,
      bankVerified
    };
    localStorage.setItem('deliveryRegistrationData', JSON.stringify(updatedData));

    // Simulate API call delay for final submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setLoading(false);
    router.push('/register/delivery/success');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Head>
        <title>Delivery Registration - Step 5 | TeamUp India</title>
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
                <span className="text-sm font-medium">Step 5 of 5</span>
                <span className="text-sm font-medium">100% Complete</span>
              </div>
              <div className="w-full bg-blue-400 rounded-full h-2">
                <div className="bg-white h-2 rounded-full" style={{ width: '100%' }}></div>
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
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center mr-3">
                  <span className="text-sm font-bold">✓</span>
                </div>
                <span className="text-sm">Address</span>
              </div>
              
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center mr-3">
                  <span className="text-sm font-bold">✓</span>
                </div>
                <span className="text-sm">Vehicle Details</span>
              </div>
              
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center mr-3">
                  <span className="text-sm font-bold">✓</span>
                </div>
                <span className="text-sm">Documents</span>
              </div>
              
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-white text-blue-600 flex items-center justify-center mr-3">
                  <span className="text-sm font-bold">5</span>
                </div>
                <span className="text-sm font-medium">Bank Details</span>
              </div>
            </div>

            <div className="mt-8 text-center text-blue-200 text-sm">
              <p>Need help? Contact support@teamupindia.com</p>
            </div>
          </div>

          {/* Right side - Form */}
          <div className="md:w-3/5 p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Bank Details</h2>
            <p className="text-gray-600 mb-8">Please provide your bank account details for payments</p>

            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Account Holder Name</label>
                  <input
                    type="text"
                    name="accountHolderName"
                    value={formData.accountHolderName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter account holder name as per bank records"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                  <input
                    type="text"
                    name="accountNumber"
                    value={formData.accountNumber}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your bank account number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Account Number</label>
                  <input
                    type="text"
                    name="confirmAccountNumber"
                    value={formData.confirmAccountNumber}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Re-enter your bank account number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">IFSC Code</label>
                  <input
                    type="text"
                    name="ifscCode"
                    value={formData.ifscCode}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
                    placeholder="Enter IFSC code (e.g., SBIN0002499)"
                  />
                </div>

                <div>
                  <button
                    type="button"
                    onClick={handleBankVerification}
                    disabled={verificationLoading || bankVerified}
                    className={`w-full py-3 rounded-lg ${bankVerified ? 'bg-green-500 text-white' : 'bg-blue-600 text-white'} ${verificationLoading || bankVerified ? 'opacity-75 cursor-not-allowed' : 'hover:bg-blue-700'}`}
                  >
                    {verificationLoading ? 'Verifying Bank Details...' : bankVerified ? 'Bank Verified ✓' : 'Verify Bank Details (Penny Drop)'}
                  </button>
                  {bankVerified && (
                    <p className="text-green-600 text-sm mt-2">Bank details verified successfully</p>
                  )}
                </div>

                {bankVerified && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h3 className="font-medium text-gray-800 mb-2">Verified Bank Details</h3>
                    <p className="text-sm text-gray-600">Bank: State Bank of India</p>
                    <p className="text-sm text-gray-600">Branch: Mumbai Central</p>
                    <p className="text-sm text-gray-600">Account Type: Savings Account</p>
                  </div>
                )}

                {/* Auto-verification information */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-medium text-blue-800 mb-2">Auto-Verification System</h3>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Penny drop verification confirms account ownership</li>
                    <li>• Bank details verified automatically</li>
                    <li>• Daily payouts to verified bank accounts</li>
                    <li>• Admin will review and approve</li>
                  </ul>
                </div>

                <div className="flex justify-between">
                  <Link href="/register/delivery/step4" className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    Back
                  </Link>
                  <button
                    type="submit"
                    disabled={loading || !bankVerified}
                    className={`px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${loading || !bankVerified ? 'opacity-75 cursor-not-allowed' : ''}`}
                  >
                    {loading ? 'Submitting...' : 'Complete Registration'}
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

export default DeliveryRegistrationStep5;