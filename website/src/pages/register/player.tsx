import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

const PlayerRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    favoriteSports: [] as string[],
    location: '',
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const router = useRouter();

  const sportsOptions = [
    'Cricket', 'Football', 'Tennis', 'Badminton', 
    'Basketball', 'Swimming', 'Yoga', 'Boxing'
  ];

  // Password strength checker
  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, label: '', color: '' };
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    const levels = [
      { strength: 1, label: 'Very Weak', color: 'bg-red-500' },
      { strength: 2, label: 'Weak', color: 'bg-orange-500' },
      { strength: 3, label: 'Fair', color: 'bg-yellow-500' },
      { strength: 4, label: 'Good', color: 'bg-blue-500' },
      { strength: 5, label: 'Strong', color: 'bg-green-500' },
    ];

    return levels[Math.min(strength - 1, 4)] || levels[0];
  };

  const passwordStrength = getPasswordStrength(formData.password);

  // Validation functions
  const validateName = (name: string) => {
    if (!name.trim()) return 'Name is required';
    if (name.trim().length < 2) return 'Name must be at least 2 characters';
    if (!/^[a-zA-Z\s]+$/.test(name.trim())) return 'Name can only contain letters and spaces';
    return '';
  };

  const validateEmail = (email: string) => {
    if (!email.trim()) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) return 'Please enter a valid email address';
    return '';
  };

  const validateMobile = (mobile: string) => {
    if (!mobile.trim()) return 'Mobile number is required';
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(mobile.trim())) return 'Please enter a valid 10-digit mobile number';
    return '';
  };

  const validatePassword = (password: string) => {
    if (!password) return 'Password is required';
    if (password.length < 8) return 'Password must be at least 8 characters';
    if (!/[a-z]/.test(password)) return 'Password must contain at least one lowercase letter';
    if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter';
    if (!/[0-9]/.test(password)) return 'Password must contain at least one number';
    if (!/[^A-Za-z0-9]/.test(password)) return 'Password must contain at least one special character';
    return '';
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    
    let error = '';
    switch (field) {
      case 'name':
        error = validateName(formData.name);
        break;
      case 'email':
        error = validateEmail(formData.email);
        break;
      case 'mobile':
        error = validateMobile(formData.mobile);
        break;
      case 'password':
        error = validatePassword(formData.password);
        break;
    }
    
    if (error) {
      setFieldErrors(prev => ({ ...prev, [field]: error }));
    } else {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    
    // Clear field error when user starts typing
    if (fieldErrors[id]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[id];
        return newErrors;
      });
    }

    if (id === 'mobile') {
      // Only allow digits
      const digitsOnly = value.replace(/\D/g, '');
      if (digitsOnly.length <= 10) {
        setFormData(prev => ({ ...prev, [id]: digitsOnly }));
      }
    } else {
      setFormData(prev => ({ ...prev, [id]: value }));
    }
  };

  const handleSportToggle = (sport: string) => {
    setFormData(prev => {
      const normalizedSport = sport.toLowerCase();
      if (prev.favoriteSports.includes(normalizedSport)) {
        return {
          ...prev,
          favoriteSports: prev.favoriteSports.filter(s => s !== normalizedSport)
        };
      } else {
        return {
          ...prev,
          favoriteSports: [...prev.favoriteSports, normalizedSport]
        };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const errors: Record<string, string> = {};
    const nameError = validateName(formData.name);
    const emailError = validateEmail(formData.email);
    const mobileError = validateMobile(formData.mobile);
    const passwordError = validatePassword(formData.password);

    if (nameError) errors.name = nameError;
    if (emailError) errors.email = emailError;
    if (mobileError) errors.mobile = mobileError;
    if (passwordError) errors.password = passwordError;

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setTouched({
        name: true,
        email: true,
        mobile: true,
        password: true,
      });
      setError('Please fix the errors in the form');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Prepare form data for submission - backend normalizes mobile number
      const submissionData = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        mobile: formData.mobile.trim(),
        password: formData.password,
        role: 'user', // Backend uses 'user' for players
        // Additional fields (will be handled in profile update)
        favoriteSports: formData.favoriteSports,
        location: formData.location.trim(),
      };
      
      // Submit to Next.js API route which forwards to backend
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
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
        if (process.env.NODE_ENV === 'development') {
          console.error('Error parsing response:', parseError);
        }
        responseData = { 
          success: false, 
          message: 'Failed to process registration response. Please try again.' 
        };
      }
      
      if (response.ok && responseData.success) {
        // Success - redirect to login
        router.push('/login?registered=true');
      } else {
        const errorMsg = responseData?.message || responseData?.error || 'Registration failed. Please try again.';
        setError(errorMsg);
      }
    } catch (err: any) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Registration error:', err);
      }
      let errorMessage = 'An error occurred during registration. Please try again.';
      
      if (err.message) {
        errorMessage = err.message;
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <Head>
        <title>Register as Player - TeamUp India</title>
        <meta name="description" content="Register as a player on TeamUp India sports platform" />
      </Head>

      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">Register as Player</h1>
          <p className="text-center text-gray-600 mb-8">Join TeamUp India as a player to find coaches and connect with others</p>
          
          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-6">
              <label htmlFor="name" className="block text-gray-700 mb-2 font-medium">
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={handleChange}
                onBlur={() => handleBlur('name')}
                required
                className={`w-full px-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-600 focus:outline-none transition-colors duration-200 bg-white text-gray-900 font-medium ${
                  touched.name && fieldErrors.name 
                    ? 'border-red-500' 
                    : 'border-gray-700'
                }`}
                placeholder="Enter your full name"
                minLength={2}
              />
              {touched.name && fieldErrors.name && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.name}</p>
              )}
            </div>
            
            <div className="mb-6">
              <label htmlFor="email" className="block text-gray-700 mb-2 font-medium">
                Email *
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={() => handleBlur('email')}
                required
                className={`w-full px-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-600 focus:outline-none transition-colors duration-200 bg-white text-gray-900 font-medium ${
                  touched.email && fieldErrors.email 
                    ? 'border-red-500' 
                    : 'border-gray-700'
                }`}
                placeholder="your.email@example.com"
              />
              {touched.email && fieldErrors.email && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
              )}
            </div>
            
            <div className="mb-6">
              <label htmlFor="mobile" className="block text-gray-700 mb-2 font-medium">
                Mobile Number *
              </label>
              <input
                type="tel"
                id="mobile"
                value={formData.mobile}
                onChange={handleChange}
                onBlur={() => handleBlur('mobile')}
                required
                maxLength={10}
                className={`w-full px-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-600 focus:outline-none transition-colors duration-200 bg-white text-gray-900 font-medium ${
                  touched.mobile && fieldErrors.mobile 
                    ? 'border-red-500' 
                    : 'border-gray-700'
                }`}
                placeholder="10-digit mobile number"
              />
              {touched.mobile && fieldErrors.mobile && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.mobile}</p>
              )}
            </div>
            
            <div className="mb-6 relative">
              <label htmlFor="password" className="block text-gray-700 mb-2 font-medium">
                Password *
              </label>
              <input
                type={passwordVisible ? "text" : "password"}
                id="password"
                value={formData.password}
                onChange={handleChange}
                onBlur={() => handleBlur('password')}
                required
                className={`w-full px-4 py-2 pr-10 border-2 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-600 focus:outline-none transition-colors duration-200 bg-white text-gray-900 font-medium ${
                  touched.password && fieldErrors.password 
                    ? 'border-red-500' 
                    : 'border-gray-700'
                }`}
                placeholder="Create a strong password"
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
              {touched.password && fieldErrors.password && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.password}</p>
              )}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-600">Password strength:</span>
                    <span className={`text-xs font-medium ${passwordStrength.color.replace('bg-', 'text-')}`}>
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                      style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 mb-2 font-medium">
                Favorite Sport(s)
              </label>
              <div className="flex flex-wrap gap-2">
                {sportsOptions.map((sport) => (
                  <label
                    key={sport}
                    className={`inline-flex items-center px-4 py-2 rounded-lg border-2 cursor-pointer transition-colors duration-200 ${
                      formData.favoriteSports.includes(sport.toLowerCase())
                        ? 'bg-red-600 text-white border-red-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-red-500'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.favoriteSports.includes(sport.toLowerCase())}
                      onChange={() => handleSportToggle(sport)}
                      className="sr-only"
                    />
                    <span className="text-sm font-medium">{sport}</span>
                  </label>
                ))}
              </div>
              {formData.favoriteSports.length > 0 && (
                <p className="mt-2 text-sm text-gray-600">
                  Selected: {formData.favoriteSports.length} sport(s)
                </p>
              )}
            </div>
            
            <div className="mb-6">
              <label htmlFor="location" className="block text-gray-700 mb-2 font-medium">
                Location
              </label>
              <input
                type="text"
                id="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-2 border-2 border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-600 focus:outline-none transition-colors duration-200 bg-white text-gray-900 font-medium"
                placeholder="City name (optional)"
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-red-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                'Register as Player'
              )}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="text-red-600 hover:underline font-medium">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerRegister;
