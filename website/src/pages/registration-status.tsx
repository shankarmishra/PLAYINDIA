import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ApiService } from '../utils/api';

interface UserStatus {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: string;
  status: 'pending' | 'active' | 'inactive' | 'suspended' | 'rejected';
  profileComplete: boolean;
  createdAt: string;
  roleData?: any;
}

const RegistrationStatusPage = () => {
  const router = useRouter();
  const [userStatus, setUserStatus] = useState<UserStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchEmail, setSearchEmail] = useState('');
  const [searching, setSearching] = useState(false);

  // Fetch user status on component mount
  useEffect(() => {
    const fetchUserStatus = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const token = typeof window !== 'undefined' ? localStorage.getItem('userToken') : null;
        const pendingEmail = typeof window !== 'undefined' ? localStorage.getItem('pendingUserEmail') : null;
        const storedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
        const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
        const statusParam = urlParams?.get('status');

        // If user has pending email from login attempt, try to get user data
        if (pendingEmail && statusParam === 'pending') {
          // Try to get user data from pendingUserData first, then stored user
          const pendingUserData = typeof window !== 'undefined' ? localStorage.getItem('pendingUserData') : null;
          
          if (pendingUserData) {
            try {
              const userData = JSON.parse(pendingUserData);
              setUserStatus({
                id: userData.id || userData._id || '',
                name: userData.name || 'User',
                email: userData.email || pendingEmail,
                mobile: userData.mobile || '',
                role: userData.role || 'pending',
                status: userData.status || 'pending',
                profileComplete: userData.profileComplete || false,
                createdAt: userData.createdAt || new Date().toISOString(),
                roleData: userData.roleData || null
              });
              setLoading(false);
              return;
            } catch (e) {
              console.error('Error parsing pending user data:', e);
            }
          }
          
          // Try to get user data from stored user
          if (storedUser) {
            try {
              const userData = JSON.parse(storedUser);
              setUserStatus({
                id: userData.id || userData._id || '',
                name: userData.name || 'User',
                email: userData.email || pendingEmail,
                mobile: userData.mobile || '',
                role: userData.role || 'pending',
                status: userData.status || 'pending',
                profileComplete: userData.profileComplete || false,
                createdAt: userData.createdAt || new Date().toISOString(),
                roleData: userData.roleData || null
              });
              setLoading(false);
              return;
            } catch (e) {
              console.error('Error parsing stored user:', e);
            }
          }
          
          // If no stored user, show basic pending status
          setUserStatus({
            id: '',
            name: 'User',
            email: pendingEmail,
            mobile: '',
            role: 'pending',
            status: 'pending',
            profileComplete: false,
            createdAt: new Date().toISOString(),
            roleData: null
          });
          setLoading(false);
          return;
        }

        // If user is logged in, fetch their current status
        if (token) {
          try {
            const response: any = await ApiService.auth.me();
            if (response.data && response.data.success && response.data.user) {
              const user = response.data.user;
              setUserStatus({
                id: user.id || user._id || '',
                name: user.name || 'User',
                email: user.email || '',
                mobile: user.mobile || '',
                role: user.role || 'user',
                status: user.status || 'pending',
                profileComplete: user.profileComplete || false,
                createdAt: user.createdAt || new Date().toISOString(),
                roleData: user.roleData || null
              });
            }
          } catch (err: any) {
            console.error('Error fetching user status:', err);
            if (err.response?.status === 401) {
              // Token expired, clear it
              if (typeof window !== 'undefined') {
                localStorage.removeItem('userToken');
                localStorage.removeItem('user');
              }
            } else if (err.response?.status === 429 || err.isRateLimit) {
              setError(err.message || 'Too many requests, please try again later. Please wait a moment and refresh the page.');
            } else {
              setError('Failed to load registration status');
            }
          }
        }
      } catch (err: any) {
        console.error('Error in fetchUserStatus:', err);
        setError('Failed to load registration status');
      } finally {
        setLoading(false);
      }
    };

    fetchUserStatus();

    // Auto-refresh every 60 seconds to check for status updates (reduced frequency to avoid rate limiting)
    const refreshInterval = setInterval(() => {
      // Only refresh if user is logged in and status is pending
      const token = typeof window !== 'undefined' ? localStorage.getItem('userToken') : null;
      if (token && userStatus?.status === 'pending') {
        fetchUserStatus();
      }
    }, 60000); // Increased to 60 seconds to reduce API calls

    return () => clearInterval(refreshInterval);
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchEmail.trim()) {
      setError('Please enter an email address');
      return;
    }

    setSearching(true);
    setError(null);

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'https://playindia-3.onrender.com';
      const token = typeof window !== 'undefined' ? localStorage.getItem('userToken') : null;
      
      // Try to fetch user by email using admin API (if admin) or check logged-in user
      if (token) {
        // First check if logged-in user matches
        try {
          const response: any = await ApiService.auth.me();
          if (response.data && response.data.success && response.data.user) {
            const user = response.data.user;
            if (user.email && user.email.toLowerCase() === searchEmail.toLowerCase().trim()) {
              setUserStatus({
                id: user.id || user._id || '',
                name: user.name || 'User',
                email: user.email || searchEmail,
                mobile: user.mobile || '',
                role: user.role || 'user',
                status: user.status || 'pending',
                profileComplete: user.profileComplete || false,
                createdAt: user.createdAt || new Date().toISOString(),
                roleData: user.roleData || null
              });
              setSearching(false);
              return;
            }
          }
        } catch (err: any) {
          console.error('Error fetching user:', err);
          if (err.response?.status === 429 || err.isRateLimit) {
            setError(err.message || 'Too many requests, please try again later.');
            setSearching(false);
            return;
          }
        }

        // If email doesn't match, show error
        setError('No registration found with this email address. Please make sure you are logged in with the correct account.');
      } else {
        setError('Please login first to check your registration status');
      }
    } catch (err: any) {
      console.error('Search error:', err);
      setError(err.response?.data?.message || 'Failed to search registration status');
    } finally {
      setSearching(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'suspended':
        return 'bg-orange-100 text-orange-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Approved';
      case 'pending':
        return 'Under Review';      case 'rejected':
        return 'Rejected';
      case 'suspended':
        return 'Suspended';
      case 'inactive':
        return 'Inactive';
      default:
        return status;
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'user':
        return 'Player';
      case 'coach':
        return 'Coach';
      case 'seller':
        return 'Store Owner';
      case 'delivery':
        return 'Delivery Partner';
      default:
        return role.charAt(0).toUpperCase() + role.slice(1);
    }
  };

  const getProgressSteps = (status: string) => {
    const steps = [
      { label: 'Submitted', completed: true, active: false },
      { label: 'Under Review', completed: status === 'active' || status === 'rejected', active: status === 'pending' },
      { label: 'Approved', completed: status === 'active', active: false }
    ];
    return steps;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Registration Status - TeamUp India</title>
        <meta name="description" content="Track your registration status for coach, store, or delivery partner on TeamUp India" />
      </Head>

      {/* Hero Section */}
        <section className="py-20 px-6 bg-gray-900 text-white" style={{ background: 'linear-gradient(to right, #111827, #1f2937)' }}>
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Registration Status</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Track your application status for coach, store, or delivery partner registration
          </p>
        </div>
      </section>

      {/* Status Tracking */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Track Your Application</h2>
            
            {!userStatus && (
              <div className="mb-8">
                <label className="block text-gray-700 mb-2 font-semibold">Enter Your Email Address</label>
                <form onSubmit={handleSearch} className="flex gap-2">
                  <input
                    type="email"
                    value={searchEmail}
                    onChange={(e) => setSearchEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="grow px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                    required
                  />
                  <button 
                    type="submit"
                    disabled={searching}
                    className="bg-red-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    {searching ? 'Searching...' : 'Track'}
                  </button>
                </form>
                <p className="text-sm text-gray-600 mt-2">
                  Or <Link href="/login" className="text-red-600 hover:underline font-medium">login</Link> to view your status automatically
                </p>
              </div>
            )}

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                <span className="block sm:inline">{error}</span>
              </div>
            )}

            {loading && (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
                <p className="mt-4 text-gray-600">Loading your registration status...</p>
              </div>
            )}

            {userStatus && !loading && (
              <>
                {/* Application Status */}
                <div className="border-2 border-gray-200 rounded-xl p-6 mb-8 bg-white shadow-md">
                  <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{userStatus.name || 'User'}</h3>
                      <div className="space-y-2">
                        <p className="text-gray-700 font-semibold">
                          <span className="text-gray-600">Email:</span> {userStatus.email || 'N/A'}
                        </p>
                        {userStatus.mobile && (
                          <p className="text-gray-700 font-semibold">
                            <span className="text-gray-600">Mobile:</span> {userStatus.mobile}
                          </p>
                        )}
                        <p className="text-gray-700 font-semibold">
                          <span className="text-gray-600">Registration Type:</span> {getRoleLabel(userStatus.role)}
                        </p>
                        {userStatus.createdAt && (
                          <p className="text-gray-600 text-sm mt-2">
                            <span className="font-semibold">Registered on:</span> {new Date(userStatus.createdAt).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="shrink-0">
                      <span className={`px-4 py-2 ${getStatusColor(userStatus.status)} text-sm font-bold rounded-full border-2 ${
                        userStatus.status === 'active' ? 'border-green-300' :
                        userStatus.status === 'pending' ? 'border-yellow-300' :
                        userStatus.status === 'rejected' ? 'border-red-300' :
                        'border-gray-300'
                      }`}>
                        {getStatusLabel(userStatus.status)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="font-bold text-gray-900 mb-3">Application Progress</h4>
                    <div className="flex items-center">
                      {getProgressSteps(userStatus.status).map((step, index) => (
                        <React.Fragment key={index}>
                          <div className="flex flex-col items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                              step.completed ? 'bg-green-500' : step.active ? 'bg-yellow-500' : 'bg-gray-300'
                            }`}>
                              {step.completed ? '✓' : index + 1}
                            </div>
                            <span className="mt-2 text-sm text-gray-700 font-medium">{step.label}</span>
                          </div>
                          {index < getProgressSteps(userStatus.status).length - 1 && (
                            <div className={`h-1 w-16 ${step.completed ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>

                  {userStatus.status === 'pending' && (
                    <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-4">
                      <p className="text-yellow-800 font-medium">
                        Your application is currently under review. Our team will verify your documents and credentials.
                        You will receive an email notification once your application status changes.
                      </p>
                      <p className="text-sm text-yellow-700 mt-2 font-semibold">
                        Expected review time: 3-5 business days
                      </p>
                    </div>
                  )}

                  {userStatus.status === 'active' && (
                    <div className="bg-green-50 border border-green-200 p-4 rounded-lg mb-4">
                      <p className="text-green-800 font-medium">
                        🎉 Congratulations! Your application has been approved. You can now access your dashboard and start using our platform.
                      </p>
                      <div className="mt-4">
                        <Link 
                          href={`/${userStatus.role === 'user' ? '' : userStatus.role === 'seller' ? 'store' : userStatus.role}`}
                          className="inline-block bg-green-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-700 transition"
                        >
                          Go to Dashboard
                        </Link>
                      </div>
                    </div>
                  )}

                  {userStatus.status === 'rejected' && (
                    <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-4">
                      <p className="text-red-800 font-medium">
                        Your application has been rejected. Please check your email for details about the rejection reason.
                        You may reapply after addressing the issues mentioned.
                      </p>
                      <div className="mt-4">
                        <Link 
                          href="/register"
                          className="inline-block bg-red-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-700 transition"
                        >
                          Reapply
                        </Link>
                      </div>
                    </div>
                  )}

                  {userStatus.roleData && Object.keys(userStatus.roleData).length > 0 && (
                    <div className="bg-linear-to-br from-gray-50 to-gray-100 p-5 rounded-lg mt-4 border border-gray-200">
                      <h4 className="font-bold text-gray-900 mb-3 text-lg">Additional Profile Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        {userStatus.role === 'coach' && userStatus.roleData && (
                          <>
                            {userStatus.roleData.experience?.years && (
                              <p className="text-gray-700">
                                <span className="font-semibold text-gray-900">Experience:</span> {userStatus.roleData.experience.years} years
                              </p>
                            )}
                            {userStatus.roleData.sports && userStatus.roleData.sports.length > 0 && (
                              <p className="text-gray-700">
                                <span className="font-semibold text-gray-900">Sports:</span> {Array.isArray(userStatus.roleData.sports) ? userStatus.roleData.sports.join(', ') : userStatus.roleData.sports}
                              </p>
                            )}
                            <p className="text-gray-700">
                              <span className="font-semibold text-gray-900">Verified:</span> 
                              <span className={userStatus.roleData.verified ? 'text-green-600 font-bold ml-1' : 'text-red-600 font-bold ml-1'}>
                                {userStatus.roleData.verified ? 'Yes ✓' : 'No ✗'}
                              </span>
                            </p>
                          </>
                        )}
                        {(userStatus.role === 'seller' || userStatus.role === 'store') && userStatus.roleData && (
                          <>
                            {userStatus.roleData.storeName && (
                              <p className="text-gray-700">
                                <span className="font-semibold text-gray-900">Store Name:</span> {userStatus.roleData.storeName}
                              </p>
                            )}
                            <p className="text-gray-700">
                              <span className="font-semibold text-gray-900">Verified:</span> 
                              <span className={userStatus.roleData.verified ? 'text-green-600 font-bold ml-1' : 'text-red-600 font-bold ml-1'}>
                                {userStatus.roleData.verified ? 'Yes ✓' : 'No ✗'}
                              </span>
                            </p>
                          </>
                        )}
                        {userStatus.role === 'delivery' && userStatus.roleData && (
                          <>
                            {userStatus.roleData.vehicle?.type && (
                              <p className="text-gray-700">
                                <span className="font-semibold text-gray-900">Vehicle Type:</span> {userStatus.roleData.vehicle.type}
                              </p>
                            )}
                            <p className="text-gray-700">
                              <span className="font-semibold text-gray-900">Verified:</span> 
                              <span className={userStatus.roleData.verified ? 'text-green-600 font-bold ml-1' : 'text-red-600 font-bold ml-1'}>
                                {userStatus.roleData.verified ? 'Yes ✓' : 'No ✗'}
                              </span>
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Refresh Button */}
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => {
                        setLoading(true);
                        const fetchUserStatus = async () => {
                          try {
                            const token = typeof window !== 'undefined' ? localStorage.getItem('userToken') : null;
                            if (token) {
                              const response: any = await ApiService.auth.me();
                              if (response.data && response.data.success && response.data.user) {
                                const user = response.data.user;
                                setUserStatus({
                                  id: user.id || user._id || '',
                                  name: user.name || 'User',
                                  email: user.email || '',
                                  mobile: user.mobile || '',
                                  role: user.role || 'user',
                                  status: user.status || 'pending',
                                  profileComplete: user.profileComplete || false,
                                  createdAt: user.createdAt || new Date().toISOString(),
                                  roleData: user.roleData || null
                                });
                              }
                            }
                          } catch (err: any) {
                            console.error('Error refreshing status:', err);
                            if (err.response?.status === 429 || err.isRateLimit) {
                              setError(err.message || 'Too many requests, please try again later.');
                            }
                          } finally {
                            setLoading(false);
                          }
                        };
                        fetchUserStatus();
                      }}
                      disabled={loading}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      <svg className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span>{loading ? 'Refreshing...' : 'Refresh Status'}</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Application Status Guide */}
      <section className="py-16 bg-gray-100 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Application Status Guide</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <div className="text-4xl mb-4 text-center">📝</div>
              <h3 className="text-xl font-bold text-center mb-3 text-gray-900">Pending / Under Review</h3>
              <p className="text-gray-700 text-center leading-relaxed">
                Your application has been received and is currently being reviewed by our team. 
                Please allow 3-5 business days for the review process.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <div className="text-4xl mb-4 text-center">✅</div>
              <h3 className="text-xl font-bold text-center mb-3 text-gray-900">Approved</h3>
              <p className="text-gray-700 text-center leading-relaxed">
                Your application has been approved. You can access your dashboard 
                and start using our platform immediately.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <div className="text-4xl mb-4 text-center">❌</div>
              <h3 className="text-xl font-bold text-center mb-3 text-gray-900">Rejected</h3>
              <p className="text-gray-700 text-center leading-relaxed">
                Your application has been rejected. You will receive an email explaining the reason 
                and steps to reapply if applicable.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Need Help with Your Application?</h2>
          <p className="text-lg text-gray-800 mb-8 font-medium">
            Our support team is ready to assist you with any questions about your registration status.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Contact Support</h3>
              <p className="text-gray-700 mb-4 font-medium">
                Have questions about your application status?
              </p>
              <Link href="/contact" className="inline-block bg-red-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-700 transition duration-300">
                Contact Us
              </Link>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-3">FAQ</h3>
              <p className="text-gray-700 mb-4 font-medium">
                Find answers to common questions about registration.
              </p>
              <Link href="/help" className="inline-block bg-gray-800 text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-900 transition duration-300">
                Visit Help Center
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RegistrationStatusPage;
