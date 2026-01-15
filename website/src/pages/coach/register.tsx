import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

const CoachRegistration = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [formData, setFormData] = useState({
    // Step 1 - Personal Details
    name: '',
    mobile: '',
    email: '',
    password: '',
    profilePhoto: null as File | null,
    // Step 2 - Professional Details
    sportsCategory: [] as string[],
    experience: '',
    coachingType: '',
    bio: '',
    languages: [] as string[],
    // Step 3 - Documents
    aadhaar: null as File | null,
    pan: null as File | null,
    coachingCertificate: null as File | null,
    achievementProof: null as File | null,
    bankAccount: '',
    bankIFSC: '',
    // Step 4 - Location & Fees
    coachingArea: '',
    radius: '',
    feePerSession: '',
    availableDays: [] as string[]
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
      const file = e.target.files[0];
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert(`File size too large. Please select a file smaller than 5MB.`);
        return;
      }
      
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        alert(`Invalid file type. Please upload an image (JPG, PNG) or PDF file.`);
        return;
      }
      
      setFormData({
        ...formData,
        [field]: file
      });
    }
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear previous errors
    setIsSubmitting(true);
    
    try {
      // Basic validation
      if (!formData.name || !formData.email || !formData.password || !formData.mobile) {
        setError('Please fill in all required fields');
        setIsSubmitting(false);
        return;
      }

      if (formData.sportsCategory.length === 0) {
        setError('Please select at least one sports category');
        setIsSubmitting(false);
        return;
      }

      if (!formData.aadhaar || !formData.pan || !formData.coachingCertificate) {
        setError('Please upload all required documents (Aadhaar, PAN, and Coaching Certificate)');
        setIsSubmitting(false);
        return;
      }

      // Prepare form data for submission
      const normalizedMobile = formData.mobile && !formData.mobile.startsWith('+') ? `+91${formData.mobile}` : formData.mobile;
      
      // Create FormData object to handle both regular fields and files
      const submissionData = new FormData();
      submissionData.append('name', formData.name);
      submissionData.append('email', formData.email);
      submissionData.append('password', formData.password);
      submissionData.append('mobile', normalizedMobile);
      submissionData.append('role', 'coach');
      
      // Add other form fields
      submissionData.append('sportsCategory', JSON.stringify(formData.sportsCategory));
      submissionData.append('languages', JSON.stringify(formData.languages));
      submissionData.append('availableDays', JSON.stringify(formData.availableDays));
      submissionData.append('experience', formData.experience);
      submissionData.append('coachingType', formData.coachingType);
      submissionData.append('bio', formData.bio);
      submissionData.append('coachingArea', formData.coachingArea);
      submissionData.append('radius', formData.radius);
      submissionData.append('feePerSession', formData.feePerSession);
      submissionData.append('bankAccount', formData.bankAccount);
      submissionData.append('bankIFSC', formData.bankIFSC);
      
      // Add files if they exist
      if (formData.profilePhoto) {
        submissionData.append('profilePhoto', formData.profilePhoto, formData.profilePhoto.name);
      }
      if (formData.aadhaar) {
        submissionData.append('aadhaar', formData.aadhaar, formData.aadhaar.name);
      }
      if (formData.pan) {
        submissionData.append('pan', formData.pan, formData.pan.name);
      }
      if (formData.coachingCertificate) {
        submissionData.append('coachingCertificate', formData.coachingCertificate, formData.coachingCertificate.name);
      }
      if (formData.achievementProof) {
        submissionData.append('achievementProof', formData.achievementProof, formData.achievementProof.name);
      }
      
      // Submit to backend API
      const response = await fetch('/api/coach/register', {
        method: 'POST',
        body: submissionData,
      });
      
      // Parse response safely
      let responseData;
      const contentType = response.headers.get('content-type');
      try {
        if (contentType && contentType.includes('application/json')) {
          responseData = await response.json();
        } else {
          const text = await response.text();
          // Try to parse as JSON if it looks like JSON
          try {
            responseData = JSON.parse(text);
          } catch {
            // If not JSON, create error object
            responseData = { 
              success: false, 
              message: text || 'Registration failed. Please try again.' 
            };
          }
        }
      } catch (parseError: any) {
        console.error('Error parsing response:', parseError);
        responseData = { 
          success: false, 
          message: 'Failed to process registration response. Please try again.' 
        };
      }
      
      if (response.ok && responseData.success) {
        alert('Registration submitted successfully! Your application is under review.');
        router.push('/registration-status');
      } else {
        const errorMsg = responseData?.message || responseData?.error || 'Registration failed. Please try again.';
        setError(errorMsg);
        alert(errorMsg);
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      let errorMessage = 'An error occurred during registration. Please try again.';
      
      if (error.message) {
        errorMessage = error.message;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Coach Registration - TeamUp India</title>
        <meta name="description" content="Register as a coach on TeamUp India sports platform" />
      </Head>

      <div className="max-w-4xl mx-auto py-12 px-6">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">Coach Registration</h1>
          <p className="text-center text-gray-600 mb-8">Join TeamUp India as a verified coach</p>
          
          {/* Progress Indicator */}
          <div className="flex justify-between mb-10 relative">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 -z-10"></div>
            <div 
              className="absolute top-1/2 left-0 h-1 bg-red-600 -translate-y-1/2 -z-10 transition-all duration-500" 
              style={{ width: `${(currentStep - 1) * 33.33}%` }}
            ></div>
            
            {[1, 2, 3, 4].map((step) => (
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
                  {step === 2 && 'Professional'}
                  {step === 3 && 'Documents'}
                  {step === 4 && 'Location'}
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
                  <div>
                    <label className="block text-gray-700 mb-2">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border-2 border-gray-700 rounded-lg focus:ring-red-500 focus:border-red-600 focus:outline-none focus:ring-2 transition-colors duration-200 bg-white text-gray-900 font-medium"
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
                  
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 mb-2">Profile Photo</label>
                    <div className="flex items-center">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                          </svg>
                          <p className="text-sm text-gray-500">Click to upload profile photo</p>
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

            {/* Step 2: Professional Details */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Professional Details</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 mb-2">Sports Category *</label>
                    <div className="flex flex-wrap gap-2">
                      {['Cricket', 'Football', 'Tennis', 'Badminton', 'Basketball', 'Swimming', 'Yoga', 'Boxing', 'Karate', 'Chess'].map((sport) => (
                        <label key={sport} className="flex items-center">
                          <input
                            type="checkbox"
                            name="sportsCategory"
                            value={sport}
                            onChange={(e) => {
                              const newSports = e.target.checked
                                ? [...formData.sportsCategory, sport]
                                : formData.sportsCategory.filter((s: string) => s !== sport);
                              setFormData({ ...formData, sportsCategory: newSports });
                            }}
                            className="mr-2 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                          />
                          <span className="text-gray-700">{sport}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-2">Experience (Years) *</label>
                    <select
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border-2 border-gray-700 rounded-lg focus:ring-red-500 focus:border-red-600 focus:outline-none focus:ring-2 transition-colors duration-200 bg-white text-gray-900 font-medium"
                    >
                      <option value="">Select years of experience</option>
                      {[...Array(30)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>{i + 1} year{i + 1 > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-2">Coaching Type *</label>
                    <select
                      name="coachingType"
                      value={formData.coachingType}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border-2 border-gray-700 rounded-lg focus:ring-red-500 focus:border-red-600 focus:outline-none focus:ring-2 transition-colors duration-200 bg-white text-gray-900 font-medium"
                    >
                      <option value="">Select coaching type</option>
                      <option value="personal">Personal Coaching</option>
                      <option value="group">Group Coaching</option>
                      <option value="both">Both</option>
                    </select>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 mb-2">Bio (About Coach) *</label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      className="w-full px-4 py-2 border-2 border-gray-700 rounded-lg focus:ring-red-500 focus:border-red-600 focus:outline-none focus:ring-2 transition-colors duration-200 bg-white text-gray-900 font-medium"
                      placeholder="Tell us about your coaching philosophy, achievements, and what makes you unique"
                    ></textarea>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 mb-2">Languages Spoken *</label>
                    <div className="flex flex-wrap gap-2">
                      {['Hindi', 'English', 'Tamil', 'Telugu', 'Marathi', 'Bengali', 'Kannada', 'Malayalam', 'Punjabi', 'Gujarati'].map((lang) => (
                        <label key={lang} className="flex items-center">
                          <input
                            type="checkbox"
                            name="languages"
                            value={lang}
                            onChange={(e) => {
                              const newLangs = e.target.checked
                                ? [...formData.languages, lang]
                                : formData.languages.filter((l: string) => l !== lang);
                              setFormData({ ...formData, languages: newLangs });
                            }}
                            className="mr-2 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                          />
                          <span className="text-gray-700">{lang}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Documents Upload */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Document Upload</h2>
                <p className="text-gray-600 mb-6">Please upload the following documents to verify your identity and credentials</p>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-gray-700 mb-2">Aadhaar Card *</label>
                    <div className="flex items-center">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                          </svg>
                          <p className="text-sm text-gray-500">Click to upload Aadhaar Card</p>
                          {formData.aadhaar && (
                            <p className="text-xs text-gray-500 mt-1 truncate max-w-xs">Selected: {formData.aadhaar.name}</p>
                          )}
                        </div>
                        <input 
                          type="file" 
                          className="hidden" 
                          onChange={(e) => handleFileChange(e, 'aadhaar')}
                          accept="image/*,.pdf"
                        />
                      </label>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-2">PAN Card *</label>
                    <div className="flex items-center">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                          </svg>
                          <p className="text-sm text-gray-500">Click to upload PAN Card</p>
                          {formData.pan && (
                            <p className="text-xs text-gray-500 mt-1 truncate max-w-xs">Selected: {formData.pan.name}</p>
                          )}
                        </div>
                        <input 
                          type="file" 
                          className="hidden" 
                          onChange={(e) => handleFileChange(e, 'pan')}
                          accept="image/*,.pdf"
                        />
                      </label>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-2">Coaching Certificate *</label>
                    <div className="flex items-center">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                          </svg>
                          <p className="text-sm text-gray-500">Click to upload Coaching Certificate</p>
                          {formData.coachingCertificate && (
                            <p className="text-xs text-gray-500 mt-1 truncate max-w-xs">Selected: {formData.coachingCertificate.name}</p>
                          )}
                        </div>
                        <input 
                          type="file" 
                          className="hidden" 
                          onChange={(e) => handleFileChange(e, 'coachingCertificate')}
                          accept="image/*,.pdf"
                        />
                      </label>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-2">Achievement Proof (Optional)</label>
                    <div className="flex items-center">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                          </svg>
                          <p className="text-sm text-gray-500">Click to upload Achievement Proof</p>
                          {formData.achievementProof && (
                            <p className="text-xs text-gray-500 mt-1 truncate max-w-xs">Selected: {formData.achievementProof.name}</p>
                          )}
                        </div>
                        <input 
                          type="file" 
                          className="hidden" 
                          onChange={(e) => handleFileChange(e, 'achievementProof')}
                          accept="image/*,.pdf"
                        />
                      </label>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-700 mb-2">Bank Account Number *</label>
                      <input
                        type="text"
                        name="bankAccount"
                        value={formData.bankAccount}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border-2 border-gray-700 rounded-lg focus:ring-red-500 focus:border-red-600 focus:outline-none focus:ring-2 transition-colors duration-200 bg-white text-gray-900 font-medium"
                        placeholder="Enter your bank account number"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 mb-2">Bank IFSC Code *</label>
                      <input
                        type="text"
                        name="bankIFSC"
                        value={formData.bankIFSC}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border-2 border-gray-700 rounded-lg focus:ring-red-500 focus:border-red-600 focus:outline-none focus:ring-2 transition-colors duration-200 bg-white text-gray-900 font-medium"
                        placeholder="Enter your bank IFSC code"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Location & Fees */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Location & Fees</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 mb-2">Coaching Area *</label>
                    <input
                      type="text"
                      name="coachingArea"
                      value={formData.coachingArea}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border-2 border-gray-700 rounded-lg focus:ring-red-500 focus:border-red-600 focus:outline-none focus:ring-2 transition-colors duration-200 bg-white text-gray-900 font-medium"
                      placeholder="Enter your coaching area (e.g., Delhi, Mumbai, Bangalore)"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-2">Preferred Radius (km) *</label>
                    <select
                      name="radius"
                      value={formData.radius}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border-2 border-gray-700 rounded-lg focus:ring-red-500 focus:border-red-600 focus:outline-none focus:ring-2 transition-colors duration-200 bg-white text-gray-900 font-medium"
                    >
                      <option value="">Select radius</option>
                      <option value="5">5 km</option>
                      <option value="10">10 km</option>
                      <option value="15">15 km</option>
                      <option value="20">20 km</option>
                      <option value="25">25 km</option>
                      <option value="30">30 km</option>
                      <option value="50">50 km</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-2">Fee per Session (₹) *</label>
                    <input
                      type="number"
                      name="feePerSession"
                      value={formData.feePerSession}
                      onChange={handleInputChange}
                      required
                      min="0"
                      className="w-full px-4 py-2 border-2 border-gray-700 rounded-lg focus:ring-red-500 focus:border-red-600 focus:outline-none focus:ring-2 transition-colors duration-200 bg-white text-gray-900 font-medium"
                      placeholder="Enter your fee per session"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 mb-2">Available Days *</label>
                    <div className="flex flex-wrap gap-2">
                      {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                        <label key={day} className="flex items-center">
                          <input
                            type="checkbox"
                            name="availableDays"
                            value={day}
                            onChange={(e) => {
                              const newDays = e.target.checked
                                ? [...formData.availableDays, day]
                                : formData.availableDays.filter((d: string) => d !== day);
                              setFormData({ ...formData, availableDays: newDays });
                            }}
                            className="mr-2 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                          />
                          <span className="text-gray-700">{day.substring(0, 3)}</span>
                        </label>
                      ))}
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
              
              {currentStep < 4 ? (
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

export default CoachRegistration;