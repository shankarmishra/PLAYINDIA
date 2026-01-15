import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

const DeliveryRegistrationStep3 = () => {
  const router = useRouter();
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [vehicleDetails, setVehicleDetails] = useState({
    vehicleType: '',
    brand: '',
    model: '',
    fuelType: '',
    year: ''
  });
  const [vehicleFetched, setVehicleFetched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);

  // Load existing data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('deliveryRegistrationData');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      if (parsedData.vehicleNumber) {
        setVehicleNumber(parsedData.vehicleNumber);
        setVehicleFetched(parsedData.vehicleFetched || false);
        if (parsedData.vehicleDetails) {
          setVehicleDetails(parsedData.vehicleDetails);
        }
      }
    }
  }, []);

  const handleFetchVehicleDetails = async () => {
    if (!vehicleNumber) {
      alert('Please enter a vehicle number');
      return;
    }

    setFetchLoading(true);
    
    // Simulate vehicle API fetch
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock vehicle data - in real app, this would be an API call
    const mockVehicleData = {
      vehicleType: 'Two Wheeler',
      brand: 'Honda',
      model: 'Activa',
      fuelType: 'Petrol',
      year: '2022'
    };

    setVehicleDetails(mockVehicleData);
    setVehicleFetched(true);
    setFetchLoading(false);
    
    // Save to localStorage
    const existingData = JSON.parse(localStorage.getItem('deliveryRegistrationData') || '{}');
    const updatedData = {
      ...existingData,
      vehicleNumber,
      vehicleDetails: mockVehicleData,
      vehicleFetched: true
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
      vehicleNumber,
      vehicleDetails,
      vehicleFetched
    };
    localStorage.setItem('deliveryRegistrationData', JSON.stringify(updatedData));

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setLoading(false);
    router.push('/register/delivery/step4');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Head>
        <title>Delivery Registration - Step 3 | TeamUp India</title>
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
                <span className="text-sm font-medium">Step 3 of 5</span>
                <span className="text-sm font-medium">60% Complete</span>
              </div>
              <div className="w-full bg-blue-400 rounded-full h-2">
                <div className="bg-white h-2 rounded-full" style={{ width: '60%' }}></div>
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
                <div className="w-8 h-8 rounded-full bg-white text-blue-600 flex items-center justify-center mr-3">
                  <span className="text-sm font-bold">3</span>
                </div>
                <span className="text-sm font-medium">Vehicle Details</span>
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
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Vehicle Details</h2>
            <p className="text-gray-600 mb-8">Enter your vehicle number to auto-fetch details</p>

            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Number</label>
                  <div className="flex">
                    <input
                      type="text"
                      value={vehicleNumber}
                      onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
                      required
                      className="flex-grow px-4 py-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
                      placeholder="e.g., KA01AB1234"
                    />
                    <button
                      type="button"
                      onClick={handleFetchVehicleDetails}
                      disabled={fetchLoading || vehicleFetched}
                      className={`px-4 py-3 rounded-r-lg ${vehicleFetched ? 'bg-green-500 text-white' : 'bg-blue-600 text-white'} ${fetchLoading || vehicleFetched ? 'opacity-75 cursor-not-allowed' : 'hover:bg-blue-700'}`}
                    >
                      {fetchLoading ? 'Fetching...' : vehicleFetched ? 'Fetched ✓' : 'Fetch'}
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Enter your vehicle registration number to auto-fetch details</p>
                </div>

                {vehicleFetched && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h3 className="font-medium text-gray-800 mb-3">Fetched Vehicle Details</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label>
                        <input
                          type="text"
                          value={vehicleDetails.vehicleType}
                          readOnly
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                        <input
                          type="text"
                          value={vehicleDetails.brand}
                          readOnly
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                        <input
                          type="text"
                          value={vehicleDetails.model}
                          readOnly
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Type</label>
                        <input
                          type="text"
                          value={vehicleDetails.fuelType}
                          readOnly
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                        <input
                          type="text"
                          value={vehicleDetails.year}
                          readOnly
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Auto-verification information */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-medium text-blue-800 mb-2">Auto-Verification System</h3>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Vehicle details fetched automatically from government database</li>
                    <li>• No manual entry required</li>
                    <li>• Details verified against RC book</li>
                    <li>• Admin will cross-check documents</li>
                  </ul>
                </div>

                <div className="flex justify-between">
                  <Link href="/register/delivery/step2" className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    Back
                  </Link>
                  <button
                    type="submit"
                    disabled={loading || !vehicleFetched}
                    className={`px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${loading || !vehicleFetched ? 'opacity-75 cursor-not-allowed' : ''}`}
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

export default DeliveryRegistrationStep3;