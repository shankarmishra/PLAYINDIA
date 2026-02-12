import React, { useState } from 'react';
import Head from 'next/head';
import { ApiService } from '../../utils/api';
import { useRouter } from 'next/router';

const StoreRegistration = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isExistingUser, setIsExistingUser] = useState(false);
  const [formData, setFormData] = useState({
    // Step 1 - Store Details
    storeName: '',
    ownerName: '',
    email: '',
    mobile: '',
    password: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    // Step 2 - Business Info
    gstNumber: '',
    businessType: '',
    category: [] as string[],
    // Step 3 - Documents
    gstCertificate: null as File | null,
    shopAct: null as File | null,
    bankPassbook: null as File | null,
    ownerPhoto: null as File | null,
    storePhoto: null as File | null
  });

  // Check if user is already logged in
  React.useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('userToken') : null;
    if (token) {
      setIsExistingUser(true);
      // Try to get user info to pre-fill form
      ApiService.auth.me().then((response: any) => {
        if (response?.data?.success && response.data.user) {
          const user = response.data.user;
          setFormData(prev => ({
            ...prev,
            email: user.email || '',
            mobile: user.mobile || '',
            ownerName: user.name || ''
          }));
        }
      }).catch(() => {
        // If can't get user info, that's okay - user can still fill form
      });
    }
  }, []);

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
        alert(`File size should be less than 5MB. Selected file: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);
        e.target.value = ''; // Reset input
        setError(`File size too large. Maximum size is 5MB. Selected file: ${file.name}`);
        return;
      }
      
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        alert(`Invalid file type. Please upload an image (JPEG, PNG, GIF) or PDF file. Selected file: ${file.name}`);
        e.target.value = ''; // Reset input
        setError(`Invalid file type. Please upload an image or PDF file.`);
        return;
      }
      
      // Update form data with the file
      setFormData(prev => ({
        ...prev,
        [field]: file
      }));
      
      // Clear any previous errors
      setError(null);
    } else {
      // If no file selected, clear the field
      setFormData(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const handleCategoryChange = (category: string) => {
    setFormData(prev => {
      const newCategories = prev.category.includes(category)
        ? prev.category.filter(cat => cat !== category)
        : [...prev.category, category];
      return { ...prev, category: newCategories };
    });
  };

  const validateStep = (step: number): string | null => {
    if (step === 1) {
      // Validate Step 1 fields
      if (!formData.storeName || !formData.storeName.trim()) {
        return 'Store name is required';
      }
      if (!formData.ownerName || !formData.ownerName.trim()) {
        return 'Owner name is required';
      }
      const trimmedOwnerName = formData.ownerName.trim();
      if (trimmedOwnerName.length < 2 || trimmedOwnerName.length > 50) {
        return 'Owner name must be between 2 and 50 characters';
      }
      if (!formData.email || !formData.email.trim()) {
        return 'Email is required';
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        return 'Please provide a valid email address';
      }
      if (!formData.mobile || !formData.mobile.trim()) {
        return 'Mobile number is required';
      }
      const mobileDigits = formData.mobile.replace(/\D/g, '');
      if (mobileDigits.length !== 10) {
        return 'Please enter a valid 10-digit mobile number';
      }
      // Password validation only for new users
      if (!isExistingUser) {
        if (!formData.password || !formData.password.trim()) {
          return 'Password is required';
        }
        if (formData.password.length < 8) {
          return 'Password must be at least 8 characters';
        }
        const hasUpperCase = /[A-Z]/.test(formData.password);
        const hasLowerCase = /[a-z]/.test(formData.password);
        const hasNumber = /\d/.test(formData.password);
        const hasSpecialChar = /[@$!%*?&#^()_+\-=\[\]{};':"\\|,.<>\/]/.test(formData.password);
        if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
          return 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character';
        }
      }
      if (!formData.address || !formData.address.trim()) {
        return 'Store address is required';
      }
      if (!formData.city || !formData.city.trim()) {
        return 'City is required';
      }
      if (!formData.state || !formData.state.trim()) {
        return 'State is required';
      }
      if (!formData.pincode || !formData.pincode.trim()) {
        return 'Pincode is required';
      }
    } else if (step === 2) {
      // Validate Step 2 fields
      if (!formData.gstNumber || !formData.gstNumber.trim()) {
        return 'GST number is required';
      }
      if (!formData.businessType || !formData.businessType.trim()) {
        return 'Business type is required';
      }
      if (!formData.category || formData.category.length === 0) {
        return 'Please select at least one product category';
      }
    } else if (step === 3) {
      // Validate Step 3 fields (file uploads)
      if (!formData.gstCertificate) {
        return 'GST Certificate file upload is required. Please upload the GST Certificate document.';
      }
      if (!formData.shopAct) {
        return 'Shop & Establishment Certificate file upload is required. Please upload the Shop Act document.';
      }
      if (!formData.bankPassbook) {
        return 'Bank Passbook file upload is required. Please upload the Bank Passbook document.';
      }
      if (!formData.ownerPhoto) {
        return 'Owner Photo file upload is required. Please upload the owner\'s photo.';
      }
      if (!formData.storePhoto) {
        return 'Store Photo file upload is required. Please upload the store photo.';
      }
    }
    return null;
  };

  const handleNext = () => {
    const validationError = validateStep(currentStep);
    if (validationError) {
      setError(validationError);
      alert(validationError);
      return;
    }
    setError(null);
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
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all steps before submitting
    const step1Error = validateStep(1);
    if (step1Error) {
      setError(step1Error);
      alert(step1Error);
      setCurrentStep(1);
      return;
    }
    
    const step2Error = validateStep(2);
    if (step2Error) {
      setError(step2Error);
      alert(step2Error);
      setCurrentStep(2);
      return;
    }
    
    const step3Error = validateStep(3);
    if (step3Error) {
      setError(step3Error);
      alert(step3Error);
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Prepare form data for submission
      // Use ownerName for the 'name' field (required by backend)
      const normalizedMobile = formData.mobile && !formData.mobile.startsWith('+') ? `+91${formData.mobile}` : formData.mobile;
      const normalizedEmail = formData.email ? formData.email.toLowerCase().trim() : formData.email;
      const normalizedName = formData.ownerName ? formData.ownerName.trim() : '';
      
      // Validate name before submission
      if (!normalizedName || normalizedName.length < 2 || normalizedName.length > 50) {
        throw new Error('Name must be between 2 and 50 characters and is required');
      }
      
      // Validate email before submission
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!normalizedEmail || !emailRegex.test(normalizedEmail)) {
        throw new Error('Please provide a valid email');
      }
      
      // Validate password only for new users
      if (!isExistingUser) {
        if (!formData.password || formData.password.length < 8) {
          throw new Error('Password must be at least 8 characters');
        }
        const hasUpperCase = /[A-Z]/.test(formData.password);
        const hasLowerCase = /[a-z]/.test(formData.password);
        const hasNumber = /\d/.test(formData.password);
        const hasSpecialChar = /[@$!%*?&#^()_+\-=\[\]{};':"\\|,.<>\/]/.test(formData.password);
        if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
          throw new Error('Password must contain at least one uppercase letter, one lowercase letter, one number and one special character');
        }
      }
      
      // Create FormData object to handle both regular fields and files
      const submissionData = new FormData();
      submissionData.append('name', normalizedName);
      submissionData.append('email', normalizedEmail);
      submissionData.append('password', formData.password);
      submissionData.append('mobile', normalizedMobile);
      submissionData.append('role', 'seller');
      
      // Add store-specific fields
      if (formData.storeName) {
        submissionData.append('storeName', formData.storeName);
      }
      if (formData.ownerName) {
        submissionData.append('ownerName', formData.ownerName);
      }
      if (formData.address) {
        submissionData.append('address', formData.address);
      }
      if (formData.city) {
        submissionData.append('city', formData.city);
      }
      if (formData.state) {
        submissionData.append('state', formData.state);
      }
      if (formData.pincode) {
        submissionData.append('pincode', formData.pincode);
      }
      if (formData.gstNumber) {
        submissionData.append('gstNumber', formData.gstNumber);
      }
      if (formData.businessType) {
        submissionData.append('businessType', formData.businessType);
      }
      if (formData.category && formData.category.length > 0) {
        submissionData.append('category', JSON.stringify(formData.category));
      }
      
      // Add files if they exist
      if (formData.gstCertificate) {
        submissionData.append('gstCertificate', formData.gstCertificate, formData.gstCertificate.name);
      }
      if (formData.shopAct) {
        submissionData.append('shopAct', formData.shopAct, formData.shopAct.name);
      }
      if (formData.bankPassbook) {
        submissionData.append('bankPassbook', formData.bankPassbook, formData.bankPassbook.name);
      }
      if (formData.ownerPhoto) {
        submissionData.append('ownerPhoto', formData.ownerPhoto, formData.ownerPhoto.name);
      }
      if (formData.storePhoto) {
        submissionData.append('storePhoto', formData.storePhoto, formData.storePhoto.name);
      }
      
      // If user is already logged in, create store profile directly
      if (isExistingUser) {
        const token = typeof window !== 'undefined' ? localStorage.getItem('userToken') : null;
        if (!token) {
          throw new Error('Session expired. Please login again.');
        }

        // Create store profile using PUT /api/stores/profile
        const storeProfileFormData = new FormData();
        
        // Add store-specific fields (skip user registration fields)
        if (formData.storeName) storeProfileFormData.append('storeName', formData.storeName);
        if (formData.ownerName) storeProfileFormData.append('ownerName', formData.ownerName);
        if (formData.address) storeProfileFormData.append('address', formData.address);
        if (formData.city) storeProfileFormData.append('city', formData.city);
        if (formData.state) storeProfileFormData.append('state', formData.state);
        if (formData.pincode) storeProfileFormData.append('pincode', formData.pincode);
        if (formData.gstNumber) storeProfileFormData.append('gstNumber', formData.gstNumber);
        if (formData.businessType) storeProfileFormData.append('businessType', formData.businessType);
        if (formData.category && formData.category.length > 0) {
          storeProfileFormData.append('category', JSON.stringify(formData.category));
        }
        
        // Add files
        if (formData.gstCertificate) {
          storeProfileFormData.append('gstCertificate', formData.gstCertificate, formData.gstCertificate.name);
        }
        if (formData.shopAct) {
          storeProfileFormData.append('shopAct', formData.shopAct, formData.shopAct.name);
        }
        if (formData.bankPassbook) {
          storeProfileFormData.append('bankPassbook', formData.bankPassbook, formData.bankPassbook.name);
        }
        if (formData.ownerPhoto) {
          storeProfileFormData.append('ownerPhoto', formData.ownerPhoto, formData.ownerPhoto.name);
        }
        if (formData.storePhoto) {
          storeProfileFormData.append('storePhoto', formData.storePhoto, formData.storePhoto.name);
        }

        const response = await fetch('/api/stores/profile', {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: storeProfileFormData,
        });

        const text = await response.text();
        let responseData;
        try {
          responseData = JSON.parse(text);
        } catch {
          responseData = { 
            success: false, 
            message: text || 'Store profile creation failed. Please try again.' 
          };
        }

        if (response.ok && responseData.success) {
          // Store profile created successfully
          // Refresh user data to get updated store info
          try {
            const userResponse: any = await ApiService.auth.me();
            if (userResponse?.data?.success && userResponse.data.user) {
              localStorage.setItem('user', JSON.stringify(userResponse.data.user));
            }
          } catch (err) {
            // Ignore errors, just proceed with redirect
          }
          
          // Show success message
          alert('Store profile created successfully! Redirecting to dashboard...');
          
          // Redirect to store dashboard
          window.location.href = '/store';
        } else {
          const errorMsg = responseData?.message || responseData?.error || 'Store profile creation failed. Please try again.';
          setError(errorMsg);
          alert(errorMsg);
        }
        setIsSubmitting(false);
        return;
      }

      // For new users, use the existing registration flow
      // Submit to backend API
      const response = await fetch('/api/store/register', {
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
          try {
            responseData = JSON.parse(text);
          } catch {
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
        <title>Store Registration - TeamUp India</title>
        <meta name="description" content="Register as a sports store on TeamUp India platform" />
      </Head>

      <div className="max-w-4xl mx-auto py-12 px-6">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">Store Registration</h1>
          <p className="text-center text-gray-600 mb-8">Register your sports store on TeamUp India platform</p>
          
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
                  {step === 1 && 'Store Details'}
                  {step === 2 && 'Business Info'}
                  {step === 3 && 'Documents'}
                </span>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            {/* Step 1: Store Details */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Store Details</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 mb-2">Store Name *</label>
                    <input
                      type="text"
                      name="storeName"
                      value={formData.storeName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border-2 border-gray-700 rounded-lg focus:ring-red-500 focus:border-red-600 focus:outline-none focus:ring-2 transition-colors duration-200 bg-white text-gray-900 font-medium"
                      placeholder="Enter your store name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-2">Owner Name * (2-50 characters)</label>
                    <input
                      type="text"
                      name="ownerName"
                      value={formData.ownerName}
                      onChange={handleInputChange}
                      required
                      minLength={2}
                      maxLength={50}
                      className="w-full px-4 py-2 border-2 border-gray-700 rounded-lg focus:ring-red-500 focus:border-red-600 focus:outline-none focus:ring-2 transition-colors duration-200 bg-white text-gray-900 font-medium"
                      placeholder="Enter owner's name (2-50 characters)"
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
                      disabled={isExistingUser}
                      className={`w-full px-4 py-2 border-2 border-gray-700 rounded-lg focus:ring-red-500 focus:border-red-600 focus:outline-none focus:ring-2 transition-colors duration-200 bg-white text-gray-900 font-medium ${isExistingUser ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                      placeholder="Enter your email"
                    />
                    {isExistingUser && (
                      <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-2">Mobile Number *</label>
                    <input
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleInputChange}
                      required
                      disabled={isExistingUser}
                      className={`w-full px-4 py-2 border-2 border-gray-700 rounded-lg focus:ring-red-500 focus:border-red-600 focus:outline-none focus:ring-2 transition-colors duration-200 bg-white text-gray-900 font-medium ${isExistingUser ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                      placeholder="Enter your mobile number"
                    />
                    {isExistingUser && (
                      <p className="text-xs text-gray-500 mt-1">Mobile number cannot be changed</p>
                    )}
                  </div>
                  
                  {!isExistingUser && (
                    <div>
                      <label className="block text-gray-700 mb-2">Password *</label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        minLength={8}
                        className="w-full px-4 py-2 border-2 border-gray-700 rounded-lg focus:ring-red-500 focus:border-red-600 focus:outline-none focus:ring-2 transition-colors duration-200 bg-white text-gray-900 font-medium"
                        placeholder="Min 8 chars: uppercase, lowercase, number, special"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Password must be at least 8 characters and contain uppercase, lowercase, number, and special character
                      </p>
                    </div>
                  )}
                  
                  {isExistingUser && (
                    <div className="md:col-span-2 bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                      <p className="text-sm text-blue-700">
                        <strong>Note:</strong> You are already logged in. You only need to complete your store profile information. Password is not required.
                      </p>
                    </div>
                  )}
                  
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 mb-2">Store Address *</label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      rows={3}
                      className="w-full px-4 py-2 border-2 border-gray-700 rounded-lg focus:ring-red-500 focus:border-red-600 focus:outline-none focus:ring-2 transition-colors duration-200 bg-white text-gray-900 font-medium"
                      placeholder="Enter your store address"
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
                      placeholder="Enter city name"
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
                      placeholder="Enter pincode"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Business Information */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Business Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 mb-2">GST Number *</label>
                    <input
                      type="text"
                      name="gstNumber"
                      value={formData.gstNumber}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border-2 border-gray-700 rounded-lg focus:ring-red-500 focus:border-red-600 focus:outline-none focus:ring-2 transition-colors duration-200 bg-white text-gray-900 font-medium"
                      placeholder="Enter GST number"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-2">Business Type *</label>
                    <select
                      name="businessType"
                      value={formData.businessType}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border-2 border-gray-700 rounded-lg focus:ring-red-500 focus:border-red-600 focus:outline-none focus:ring-2 transition-colors duration-200 bg-white text-gray-900 font-medium"
                    >
                      <option value="">Select business type</option>
                      <option value="Proprietorship">Proprietorship</option>
                      <option value="Partnership">Partnership</option>
                      <option value="Private Limited">Private Limited</option>
                      <option value="Public Limited">Public Limited</option>
                      <option value="LLP">LLP</option>
                      <option value="Trust">Trust</option>
                      <option value="Society">Society</option>
                    </select>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 mb-2">Product Categories *</label>
                    <p className="text-sm text-gray-500 mb-3">Select all that apply</p>
                    <div className="flex flex-wrap gap-2">
                      {['Cricket', 'Football', 'Tennis', 'Badminton', 'Basketball', 'Swimming', 'Yoga', 'Boxing', 'Cycling', 'Running', 'Gym Equipment', 'Sports Accessories', 'Apparel', 'Shoes', 'Protective Gear'].map((category) => (
                        <label key={category} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.category.includes(category)}
                            onChange={() => handleCategoryChange(category)}
                            className="mr-2 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                          />
                          <span className="text-gray-700">{category}</span>
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
                <p className="text-gray-600 mb-2">Please upload the following documents to verify your business</p>
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        <strong>Important:</strong> GST Number (entered in Step 2) and GST Certificate Document (file upload below) are different. 
                        <strong className="text-red-600"> Both are required.</strong> Please upload the actual GST Certificate document file.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-gray-700 mb-2">
                      GST Certificate Document * 
                      <span className="text-xs text-gray-500 ml-2">(Upload PDF or Image file)</span>
                    </label>
                    <div className="flex items-center">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                          </svg>
                          <p className="text-sm text-gray-500 mt-2">Click to upload GST Certificate document</p>
                          <p className="text-xs text-gray-400 mt-1">(Max 5MB, PDF or Image)</p>
                          {formData.gstCertificate && (
                            <div className="mt-2">
                              <p className="text-xs text-green-600 font-semibold truncate max-w-xs">
                                ✓ Selected: {formData.gstCertificate.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                Size: {(formData.gstCertificate.size / 1024).toFixed(2)} KB
                              </p>
                            </div>
                          )}
                        </div>
                        <input 
                          type="file" 
                          className="hidden" 
                          onChange={(e) => handleFileChange(e, 'gstCertificate')}
                          accept="image/*,.pdf"
                          required
                        />
                      </label>
                    </div>
                    {!formData.gstCertificate && (
                      <p className="text-xs text-red-500 mt-1">Please upload the GST Certificate document file</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-2">Shop & Establishment Certificate *</label>
                    <div className="flex items-center">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                          </svg>
                          <p className="text-sm text-gray-500">Click to upload Shop Act Certificate</p>
                          {formData.shopAct && (
                            <p className="text-xs text-gray-500 mt-1 truncate max-w-xs">Selected: {formData.shopAct.name}</p>
                          )}
                        </div>
                        <input 
                          type="file" 
                          className="hidden" 
                          onChange={(e) => handleFileChange(e, 'shopAct')}
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
                    <label className="block text-gray-700 mb-2">Owner Photo *</label>
                    <div className="flex items-center">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                          </svg>
                          <p className="text-sm text-gray-500">Click to upload Owner Photo</p>
                          {formData.ownerPhoto && (
                            <p className="text-xs text-gray-500 mt-1 truncate max-w-xs">Selected: {formData.ownerPhoto.name}</p>
                          )}
                        </div>
                        <input 
                          type="file" 
                          className="hidden" 
                          onChange={(e) => handleFileChange(e, 'ownerPhoto')}
                          accept="image/*"
                        />
                      </label>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-2">Store Photo *</label>
                    <div className="flex items-center">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                          </svg>
                          <p className="text-sm text-gray-500">Click to upload Store Photo</p>
                          {formData.storePhoto && (
                            <p className="text-xs text-gray-500 mt-1 truncate max-w-xs">Selected: {formData.storePhoto.name}</p>
                          )}
                        </div>
                        <input 
                          type="file" 
                          className="hidden" 
                          onChange={(e) => handleFileChange(e, 'storePhoto')}
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

export default StoreRegistration;