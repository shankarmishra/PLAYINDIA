import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import AdminNav from '../../components/AdminNav';

interface AnalyticsData {
  totalUsers: number;
  totalCoaches: number;
  totalStores: number;
  totalDelivery: number;
  userDistribution: {
    players: number;
    coaches: number;
    stores: number;
    delivery: number;
  };
}

const AdminAnalytics = () => {
  const router = useRouter();
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalUsers: 0,
    totalCoaches: 0,
    totalStores: 0,
    totalDelivery: 0,
    userDistribution: {
      players: 0,
      coaches: 0,
      stores: 0,
      delivery: 0,
    },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adminInfo, setAdminInfo] = useState<any>(null);
  const [timeRange, setTimeRange] = useState('30');

  useEffect(() => {
    const adminToken = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
    const adminData = typeof window !== 'undefined' ? localStorage.getItem('admin') : null;

    if (!adminToken || !adminData) {
      router.push('/admin/login');
      return;
    }

    try {
      setAdminInfo(JSON.parse(adminData));
    } catch (e) {
      console.error('Error parsing admin data:', e);
    }

    fetchAnalytics();
  }, [router, timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'https://playindia-3.onrender.com';
      const adminToken = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;

      if (!adminToken) {
        throw new Error('Admin not authenticated');
      }

      // Helper function to safely parse JSON response
      const parseResponse = async (response: Response) => {
        // Handle non-OK responses gracefully
        if (!response.ok) {
          try {
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
              const errorData = await response.json();
              const errorMessage = errorData.message || errorData.error || `HTTP error! status: ${response.status}`;
              
              // Handle rate limiting (429) gracefully
              if (response.status === 429) {
                console.warn('Rate limited:', errorMessage);
                return { data: { users: [] }, success: false, message: 'Too many requests, please try again later.' };
              }
              
              // Handle permission errors gracefully
              if (response.status === 403 || errorMessage.includes('permission') || errorMessage.includes('Access denied')) {
                console.warn('Permission error:', errorMessage);
                return { data: { users: [] }, success: false, message: errorMessage };
              }
              
              // For authentication errors, redirect to login
              if (response.status === 401) {
                if (typeof window !== 'undefined') {
                  localStorage.removeItem('adminToken');
                  localStorage.removeItem('admin');
                  window.location.href = '/admin/login';
                }
                throw new Error('Session expired. Please login again.');
              }
              
              throw new Error(errorMessage);
            } else {
              const text = await response.text();
              throw new Error(text || `HTTP error! status: ${response.status}`);
            }
          } catch (parseError: any) {
            throw new Error(parseError.message || `Request failed with status ${response.status}`);
          }
        }
        
        // Parse successful response
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await response.text();
          throw new Error(text || 'Invalid response from server');
        }
        
        return await response.json();
      };

      // Helper to fetch with delay to avoid rate limiting
      const fetchWithDelay = async (url: string, delay: number) => {
        await new Promise(resolve => setTimeout(resolve, delay));
        return fetch(url, {
          headers: { 'Authorization': `Bearer ${adminToken}` }
        });
      };

      // Fetch all users by role - with delays to avoid rate limiting
      const usersRes = await fetchWithDelay(`${backendUrl}/api/users?role=user`, 0);
      const coachesRes = await fetchWithDelay(`${backendUrl}/api/users?role=coach`, 500);
      const storesRes = await fetchWithDelay(`${backendUrl}/api/users?role=seller`, 1000);
      const deliveryRes = await fetchWithDelay(`${backendUrl}/api/users?role=delivery`, 1500);

      const [usersData, coachesData, storesData, deliveryData] = await Promise.all([
        parseResponse(usersRes),
        parseResponse(coachesRes),
        parseResponse(storesRes),
        parseResponse(deliveryRes),
      ]);

      const totalUsers = usersData.data?.users?.length || usersData.data?.length || 0;
      const totalCoaches = coachesData.data?.users?.length || coachesData.data?.length || 0;
      const totalStores = storesData.data?.users?.length || storesData.data?.length || 0;
      const totalDelivery = deliveryData.data?.users?.length || deliveryData.data?.length || 0;

      const total = totalUsers + totalCoaches + totalStores + totalDelivery;

      setAnalytics({
        totalUsers,
        totalCoaches,
        totalStores,
        totalDelivery,
        userDistribution: {
          players: total > 0 ? Math.round((totalUsers / total) * 100) : 0,
          coaches: total > 0 ? Math.round((totalCoaches / total) * 100) : 0,
          stores: total > 0 ? Math.round((totalStores / total) * 100) : 0,
          delivery: total > 0 ? Math.round((totalDelivery / total) * 100) : 0,
        },
      });

      setError(null);
    } catch (err: any) {
      console.error('Error fetching analytics:', err);
      setError(err.message || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number): string => {
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
    if (num >= 100000) return `₹${(num / 100000).toFixed(2)} L`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Admin Analytics - TeamUp India</title>
        <meta name="description" content="Admin panel for platform analytics and reporting" />
      </Head>

      <AdminNav adminInfo={adminInfo} />

      <div className="max-w-7xl mx-auto py-8 px-6">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Platform Analytics</h1>
            <p className="text-gray-600">Comprehensive analytics and reporting for platform performance</p>
          </div>
          <div className="flex space-x-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="7">Last 7 Days</option>
              <option value="30">Last 30 Days</option>
              <option value="90">Last 90 Days</option>
            </select>
            <button
              onClick={fetchAnalytics}
              className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition duration-300"
            >
              Refresh
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border-2 border-red-400 text-red-800 px-6 py-4 rounded-lg relative mb-4 shadow-md" role="alert">
            <div className="flex items-start">
              <svg className="w-6 h-6 text-red-600 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="flex-1">
                <p className="font-semibold mb-1">Error</p>
                <p className="text-sm">{error}</p>
                {error.includes('permission') && (
                  <p className="text-xs mt-2 text-red-700">
                    Please make sure you are logged in as an administrator with proper permissions.
                  </p>
                )}
              </div>
              <button 
                onClick={fetchAnalytics} 
                className="ml-4 text-red-800 hover:text-red-900 font-semibold underline text-sm"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            <p className="mt-4 text-gray-600">Loading analytics...</p>
          </div>
        ) : (
          <>
            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border-2 border-blue-300 shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-3xl font-bold text-blue-800 mb-2">{formatNumber(analytics.totalUsers)}</h3>
                <p className="text-gray-700 font-semibold">Total Users</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border-2 border-green-300 shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-3xl font-bold text-green-800 mb-2">{formatNumber(analytics.totalCoaches)}</h3>
                <p className="text-gray-700 font-semibold">Total Coaches</p>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border-2 border-orange-300 shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-3xl font-bold text-orange-800 mb-2">{formatNumber(analytics.totalStores)}</h3>
                <p className="text-gray-700 font-semibold">Total Stores</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border-2 border-purple-300 shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-3xl font-bold text-purple-800 mb-2">{formatNumber(analytics.totalDelivery)}</h3>
                <p className="text-gray-700 font-semibold">Delivery Partners</p>
              </div>
            </div>

            {/* User Distribution */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div className="bg-white p-6 rounded-xl border-2 border-gray-200 shadow-md">
                <h3 className="text-xl font-bold mb-4 text-gray-900">User Distribution</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-700 font-semibold">Players</span>
                      <span className="font-bold text-gray-900">{analytics.userDistribution.players}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                        style={{ width: `${analytics.userDistribution.players}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-700 font-semibold">Coaches</span>
                      <span className="font-bold text-gray-900">{analytics.userDistribution.coaches}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-green-600 h-2.5 rounded-full transition-all duration-300"
                        style={{ width: `${analytics.userDistribution.coaches}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-700 font-semibold">Stores</span>
                      <span className="font-bold text-gray-900">{analytics.userDistribution.stores}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-orange-600 h-2.5 rounded-full transition-all duration-300"
                        style={{ width: `${analytics.userDistribution.stores}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-700 font-semibold">Delivery</span>
                      <span className="font-bold text-gray-900">{analytics.userDistribution.delivery}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-purple-600 h-2.5 rounded-full transition-all duration-300"
                        style={{ width: `${analytics.userDistribution.delivery}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border-2 border-gray-200 shadow-md">
                <h3 className="text-xl font-bold mb-4 text-gray-900">Role Statistics</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-700 font-semibold">Total Users</span>
                    <span className="font-bold text-lg text-gray-900">{analytics.totalUsers + analytics.totalCoaches + analytics.totalStores + analytics.totalDelivery}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-700 font-semibold">Active Coaches</span>
                    <span className="font-bold text-gray-900">{analytics.totalCoaches}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-700 font-semibold">Active Stores</span>
                    <span className="font-bold text-gray-900">{analytics.totalStores}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-700 font-semibold">Delivery Partners</span>
                    <span className="font-bold text-gray-900">{analytics.totalDelivery}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border-2 border-gray-200 shadow-md">
                <h3 className="text-xl font-bold mb-4 text-gray-900">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg transition duration-300 shadow-md hover:shadow-lg">
                    Export Report
                  </button>
                  <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 px-4 rounded-lg transition duration-300 shadow-md hover:shadow-lg">
                    Generate Analytics
                  </button>
                  <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2.5 px-4 rounded-lg transition duration-300 shadow-md hover:shadow-lg">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminAnalytics;
