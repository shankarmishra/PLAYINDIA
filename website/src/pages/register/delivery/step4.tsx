import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

const DeliveryRegistrationStep4 = () => {
  const router = useRouter();
  const [documents, setDocuments] = useState({
    aadhaarFront: null as File | null,
    aadhaarBack: null as File | null,
    drivingLicense: null as File | null,
    vehicleRC: null as File | null
  });
  const [documentPreviews, setDocumentPreviews] = useState({
    aadhaarFront: '',
    aadhaarBack: '',
    drivingLicense: '',
    vehicleRC: ''
  });
  const [loading, setLoading] = useState(false);

  // Load existing data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('deliveryRegistrationData');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      if (parsedData.documents) {
        setDocuments(parsedData.documents);
      }
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, docType: keyof typeof documents) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setDocuments(prev => ({
        ...prev,
        [docType]: file
      }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setDocumentPreviews(prev => ({
          ...prev,
          [docType]: reader.result as string
        }));
      };
      reader.readAsDataURL(file);

      // Save to localStorage
      const existingData = JSON.parse(localStorage.getItem('deliveryRegistrationData') || '{}');
      const updatedData = {
        ...existingData,
        documents: {
          ...existingData.documents,
          [docType]: file
        }
      };
      localStorage.setItem('deliveryRegistrationData', JSON.stringify(updatedData));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Save current step data
    const existingData = JSON.parse(localStorage.getItem('deliveryRegistrationData') || '{}');
    const updatedData = {
      ...existingData,
      documents,
      step: 4
    };
    localStorage.setItem('deliveryRegistrationData', JSON.stringify(updatedData));

    // Simulate API call delay for document upload and verification
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setLoading(false);
    router.push('/register/delivery/step5');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Head>
        <title>Delivery Registration - Step 4 | TeamUp India</title>
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
                <span className="text-sm font-medium">Step 4 of 5</span>
                <span className="text-sm font-medium">80% Complete</span>
              </div>
              <div className="w-full bg-blue-400 rounded-full h-2">
                <div className="bg-white h-2 rounded-full" style={{ width: '80%' }}></div>
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
                <div className="w-8 h-8 rounded-full bg-white text-blue-600 flex items-center justify-center mr-3">
                  <span className="text-sm font-bold">4</span>
                </div>
                <span className="text-sm font-medium">Documents</span>
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
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Upload Documents</h2>
            <p className="text-gray-600 mb-8">Please upload the required documents for verification</p>

            <form onSubmit={handleSubmit}>
              <div className="space-y-8">
                {/* Aadhaar Front Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Aadhaar Card (Front)</label>
                  <div className="flex items-center space-x-4">
                    <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                      {documentPreviews.aadhaarFront ? (
                        <img 
                          src={documentPreviews.aadhaarFront} 
                          alt="Aadhaar Front Preview" 
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg className="w-8 h-8 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                          </svg>
                          <p className="text-xs text-gray-500 mt-2">Upload</p>
                        </div>
                      )}
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*,application/pdf" 
                        onChange={(e) => handleFileChange(e, 'aadhaarFront')}
                      />
                    </label>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">Upload front side of your Aadhaar card</p>
                      <p className="text-xs text-gray-500 mt-1">PDF, JPG, or PNG (Max 5MB)</p>
                    </div>
                  </div>
                </div>

                {/* Aadhaar Back Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Aadhaar Card (Back)</label>
                  <div className="flex items-center space-x-4">
                    <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                      {documentPreviews.aadhaarBack ? (
                        <img 
                          src={documentPreviews.aadhaarBack} 
                          alt="Aadhaar Back Preview" 
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg className="w-8 h-8 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                          </svg>
                          <p className="text-xs text-gray-500 mt-2">Upload</p>
                        </div>
                      )}
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*,application/pdf" 
                        onChange={(e) => handleFileChange(e, 'aadhaarBack')}
                      />
                    </label>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">Upload back side of your Aadhaar card</p>
                      <p className="text-xs text-gray-500 mt-1">PDF, JPG, or PNG (Max 5MB)</p>
                    </div>
                  </div>
                </div>

                {/* Driving License Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Driving License</label>
                  <div className="flex items-center space-x-4">
                    <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                      {documentPreviews.drivingLicense ? (
                        <img 
                          src={documentPreviews.drivingLicense} 
                          alt="Driving License Preview" 
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg className="w-8 h-8 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                          </svg>
                          <p className="text-xs text-gray-500 mt-2">Upload</p>
                        </div>
                      )}
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*,application/pdf" 
                        onChange={(e) => handleFileChange(e, 'drivingLicense')}
                      />
                    </label>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">Upload your valid driving license</p>
                      <p className="text-xs text-gray-500 mt-1">PDF, JPG, or PNG (Max 5MB)</p>
                    </div>
                  </div>
                </div>

                {/* Vehicle RC Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle RC Book</label>
                  <div className="flex items-center space-x-4">
                    <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                      {documentPreviews.vehicleRC ? (
                        <img 
                          src={documentPreviews.vehicleRC} 
                          alt="Vehicle RC Preview" 
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg className="w-8 h-8 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                          </svg>
                          <p className="text-xs text-gray-500 mt-2">Upload</p>
                        </div>
                      )}
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*,application/pdf" 
                        onChange={(e) => handleFileChange(e, 'vehicleRC')}
                      />
                    </label>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">Upload your vehicle registration certificate</p>
                      <p className="text-xs text-gray-500 mt-1">PDF, JPG, or PNG (Max 5MB)</p>
                    </div>
                  </div>
                </div>

                {/* Auto-verification information */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-medium text-blue-800 mb-2">Auto-Verification System</h3>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• OCR technology reads document text</li>
                    <li>• DL expiry date checked automatically</li>
                    <li>• Name matching across all documents</li>
                    <li>• Photo comparison with selfie</li>
                    <li>• Admin will review and approve</li>
                  </ul>
                </div>

                <div className="flex justify-between">
                  <Link href="/register/delivery/step3" className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    Back
                  </Link>
                  <button
                    type="submit"
                    disabled={loading || !documents.aadhaarFront || !documents.aadhaarBack || !documents.drivingLicense || !documents.vehicleRC}
                    className={`px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${loading || !documents.aadhaarFront || !documents.aadhaarBack || !documents.drivingLicense || !documents.vehicleRC ? 'opacity-75 cursor-not-allowed' : ''}`}
                  >
                    {loading ? 'Submitting...' : 'Next: Bank Details'}
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

export default DeliveryRegistrationStep4;