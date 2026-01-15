import React, { useState } from 'react';
import Head from 'next/head';
import { ApiService } from '../../utils/api';
import { useRouter } from 'next/router';

const DeliveryRegistration = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1 - Personal Details
    name: '',
    email: '',
    mobile: '',
    password: '',
    dob: '',
    gender: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    // Step 2 - Vehicle Details
    vehicleType: '',
    vehicleModel: '',
    vehicleNumber: '',
    vehicleRC: null as File | null,
    // Step 3 - Working Area & Documents
    workingArea: '',
    idProof: null as File | null,
    addressProof: null as File | null,
    bankPassbook: null as File | null,
    profilePhoto: null as File | null
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        [field]: e.target.files[0]
      });
    }
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Prepare form data for submission - backend normalizes mobile number
      const submissionData = {
        name: formData.name.trim(),
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
        mobile: formData.mobile.trim(), // Backend will normalize it
        role: 'delivery',
        // Include other form fields as needed
        dob: formData.dob,
        gender: formData.gender,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        vehicleType: formData.vehicleType,
        vehicleModel: formData.vehicleModel,
        vehicleNumber: formData.vehicleNumber,
        workingArea: formData.workingArea,
      };
      
      // Submit to backend API
      const response: any = await ApiService.auth.register(submissionData);
      
      if (response.data && response.data.success) {
        alert('Registration submitted successfully! Your application is under review.');
        router.push('/registration-status');
      } else {
        alert(response.data?.message || 'Registration failed. Please try again.');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.message || 'An error occurred during registration. Please try again.';
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Delivery Partner Registration - TeamUp India</title>
        <meta name="description" content="Register as a delivery partner on TeamUp India platform" />
      </Head>

      <div className="max-w-4xl mx-auto py-12 px-6">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">Delivery Partner Registration</h1>
          <p className="text-center text-gray-600 mb-8">Become a delivery partner on TeamUp India platform</p>
          
          {/* Progress Indicator */}
          <div className="flex justify-between mb-10 relative">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 -z-10"></div>
            <div 
              className="absolute top-1/2 left-0 h-1 bg-red-600 -translate-y-1/2 -z-10 transition-all duration-500" 
              style={{ width: `${(currentStep - 1) * 50}%` }}
            ></div>
            
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex flex-col items-center relative z-10">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                  currentStep >= step ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {step}
                </div>
                <span className={`text-sm ${
                  currentStep === step ? 'font-bold text-red-600' : 'text-gray-500'
                }`}>
                  {step === 1 && 'Personal'}
                  {step === 2 && 'Vehicle'}
                  {step === 3 && 'Documents'}
                </span>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            {/* Step 1: Personal Details */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Personal Details</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 mb-2">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border-2 border-gray-700 rounded-lg focus:ring-red-500 focus:border-red-600 focus:outline-none focus:ring-2 transition-colors duration-200 bg-white text-gray-900 font-medium"
                      placeholder="Full name"
                      minLength={2}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-2">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border-2 border-gray-700 rounded-lg focus:ring-red-500 focus:border-red-600 focus:outline-none focus:ring-2 transition-colors duration-200 bg-white text-gray-900 font-medium"
                      placeholder="your.email@example.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-2">Mobile Number *</label>
                    <input
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border-2 border-gray-700 rounded-lg focus:ring-red-500 focus:border-red-600 focus:outline-none focus:ring-2 transition-colors duration-200 bg-white text-gray-900 font-medium"
                      placeholder="10-digit mobile number (e.g., 9876543210)"
                      pattern="[0-9]{10}"
                      maxLength={10}
                    />
                  </div>
                  
                  <div className="relative">
                    <label className="block text-gray-700 mb-2">Password *</label>
                    <input
                      type={passwordVisible ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 pr-10 border-2 border-gray-700 rounded-lg focus:ring-red-500 focus:border-red-600 focus:outline-none focus:ring-2 transition-colors duration-200 bg-white text-gray-900 font-medium"
                      placeholder="Min 8 chars with uppercase, lowercase, number & special char"
                      minLength={8}
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
                    <label className="block text-gray-700 mb-2">Date of Birth *</label>
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border-2 border-gray-700 rounded-lg focus:ring-red-500 focus:border-red-600 focus:outline-none focus:ring-2 transition-colors duration-200 bg-white text-gray-900 font-medium"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-2">Gender *</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border-2 border-gray-700 rounded-lg focus:ring-red-500 focus:border-red-600 focus:outline-none focus:ring-2 transition-colors duration-200 bg-white text-gray-900 font-medium"
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 mb-2">Address *</label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      rows={3}
                      className="w-full px-4 py-2 border-2 border-gray-700 rounded-lg focus:ring-red-500 focus:border-red-600 focus:outline-none focus:ring-2 transition-colors duration-200 bg-white text-gray-900 font-medium"
                      placeholder="Complete address"
                    ></textarea>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-2">City *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border-2 border-gray-700 rounded-lg focus:ring-red-500 focus:border-red-600 focus:outline-none focus:ring-2 transition-colors duration-200 bg-white text-gray-900 font-medium"
                      placeholder="City name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-2">State *</label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border-2 border-gray-700 rounded-lg focus:ring-red-500 focus:border-red-600 focus:outline-none focus:ring-2 transition-colors duration-200 bg-white text-gray-900 font-medium"
                    >
                      <option value="">Select State</option>
                      <option value="Andhra Pradesh">Andhra Pradesh</option>
                      <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                      <option value="Assam">Assam</option>
                      <option value="Bihar">Bihar</option>
                      <option value="Chhattisgarh">Chhattisgarh</option>
                      <option value="Goa">Goa</option>
                      <option value="Gujarat">Gujarat</option>
                      <option value="Haryana">Haryana</option>
                      <option value="Himachal Pradesh">Himachal Pradesh</option>
                      <option value="Jharkhand">Jharkhand</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Kerala">Kerala</option>
                      <option value="Madhya Pradesh">Madhya Pradesh</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Manipur">Manipur</option>
                      <option value="Meghalaya">Meghalaya</option>
                      <option value="Mizoram">Mizoram</option>
                      <option value="Nagaland">Nagaland</option>
                      <option value="Odisha">Odisha</option>
                      <option value="Punjab">Punjab</option>
                      <option value="Rajasthan">Rajasthan</option>
                      <option value="Sikkim">Sikkim</option>
                      <option value="Tamil Nadu">Tamil Nadu</option>
                      <option value="Telangana">Telangana</option>
                      <option value="Tripura">Tripura</option>
                      <option value="Uttar Pradesh">Uttar Pradesh</option>
                      <option value="Uttarakhand">Uttarakhand</option>
                      <option value="West Bengal">West Bengal</option>
                      <option value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</option>
                      <option value="Chandigarh">Chandigarh</option>
                      <option value="Dadra and Nagar Haveli">Dadra and Nagar Haveli</option>
                      <option value="Daman and Diu">Daman and Diu</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Lakshadweep">Lakshadweep</option>
                      <option value="Puducherry">Puducherry</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-2">Pincode *</label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border-2 border-gray-700 rounded-lg focus:ring-red-500 focus:border-red-600 focus:outline-none focus:ring-2 transition-colors duration-200 bg-white text-gray-900 font-medium"
                      placeholder="6-digit pincode"
                      pattern="[0-9]{6}"
                      maxLength={6}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Vehicle Details */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Vehicle Details</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 mb-2">Vehicle Type *</label>
                    <select
                      name="vehicleType"
                      value={formData.vehicleType}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border-2 border-gray-700 rounded-lg focus:ring-red-500 focus:border-red-600 focus:outline-none focus:ring-2 transition-colors duration-200 bg-white text-gray-900 font-medium"
                    >
                      <option value="">Select vehicle type</option>
                      <option value="bicycle">Bicycle</option>
                      <option value="motorcycle">Motorcycle</option>
                      <option value="scooter">Scooter</option>
                      <option value="car">Car</option>
                      <option value="auto-rickshaw">Auto Rickshaw</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-2">Vehicle Model *</label>
                    <input
                      type="text"
                      name="vehicleModel"
                      value={formData.vehicleModel}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border-2 border-gray-700 rounded-lg focus:ring-red-500 focus:border-red-600 focus:outline-none focus:ring-2 transition-colors duration-200 bg-white text-gray-900 font-medium"
                      placeholder="Vehicle model (e.g., Activa, Splendor)"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 mb-2">Vehicle Number *</label>
                    <input
                      type="text"
                      name="vehicleNumber"
                      value={formData.vehicleNumber}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border-2 border-gray-700 rounded-lg focus:ring-red-500 focus:border-red-600 focus:outline-none focus:ring-2 transition-colors duration-200 bg-white text-gray-900 font-medium"
                      placeholder="Vehicle registration number (e.g., DL-01-AB-1234)"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 mb-2">Vehicle RC Book *</label>
                    <div className="flex items-center">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                          </svg>
                          <p className="text-sm text-gray-500">Click to upload Vehicle RC Book</p>
                          {formData.vehicleRC && (
                            <p className="text-xs text-gray-500 mt-1 truncate max-w-xs">Selected: {formData.vehicleRC.name}</p>
                          )}
                        </div>
                        <input 
                          type="file" 
                          className="hidden" 
                          onChange={(e) => handleFileChange(e, 'vehicleRC')}
                          accept="image/*,.pdf"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Working Area & Documents */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Working Area & Documents</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-gray-700 mb-2">Working Area *</label>
                    <input
                      type="text"
                      name="workingArea"
                      value={formData.workingArea}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border-2 border-gray-700 rounded-lg focus:ring-red-500 focus:border-red-600 focus:outline-none focus:ring-2 transition-colors duration-200 bg-white text-gray-900 font-medium"
                      placeholder="Working area (e.g., Delhi, Mumbai, Bangalore)"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-2">ID Proof *</label>
                    <div className="flex items-center">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                          </svg>
                          <p className="text-sm text-gray-500">Click to upload ID Proof (Aadhaar, PAN, Driving License)</p>
                          {formData.idProof && (
                            <p className="text-xs text-gray-500 mt-1 truncate max-w-xs">Selected: {formData.idProof.name}</p>
                          )}
                        </div>
                        <input 
                          type="file" 
                          className="hidden" 
                          onChange={(e) => handleFileChange(e, 'idProof')}
                          accept="image/*,.pdf"
                        />
                      </label>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-2">Address Proof *</label>
                    <div className="flex items-center">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                          </svg>
                          <p className="text-sm text-gray-500">Click to upload Address Proof</p>
                          {formData.addressProof && (
                            <p className="text-xs text-gray-500 mt-1 truncate max-w-xs">Selected: {formData.addressProof.name}</p>
                          )}
                        </div>
                        <input 
                          type="file" 
                          className="hidden" 
                          onChange={(e) => handleFileChange(e, 'addressProof')}
                          accept="image/*,.pdf"
                        />
                      </label>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-2">Bank Passbook *</label>
                    <div className="flex items-center">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                          </svg>
                          <p className="text-sm text-gray-500">Click to upload Bank Passbook</p>
                          {formData.bankPassbook && (
                            <p className="text-xs text-gray-500 mt-1 truncate max-w-xs">Selected: {formData.bankPassbook.name}</p>
                          )}
                        </div>
                        <input 
                          type="file" 
                          className="hidden" 
                          onChange={(e) => handleFileChange(e, 'bankPassbook')}
                          accept="image/*,.pdf"
                        />
                      </label>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-2">Profile Photo *</label>
                    <div className="flex items-center">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                          </svg>
                          <p className="text-sm text-gray-500">Click to upload Profile Photo</p>
                          {formData.profilePhoto && (
                            <p className="text-xs text-gray-500 mt-1 truncate max-w-xs">Selected: {formData.profilePhoto.name}</p>
                          )}
                        </div>
                        <input 
                          type="file" 
                          className="hidden" 
                          onChange={(e) => handleFileChange(e, 'profilePhoto')}
                          accept="image/*"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-10">
              <button
                type="button"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className={`px-6 py-2 rounded-lg ${
                  currentStep === 1 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Previous
              </button>
              
              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Registration'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DeliveryRegistration;