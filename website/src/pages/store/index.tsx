import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ApiService } from '../../utils/api';
import StoreLayout from '../../components/StoreLayout';
import StoreErrorDisplay from '../../components/StoreErrorDisplay';

interface StoreData {
  store: any;
  stats: {
    totalProducts: number;
    todayOrders: number;
    monthlyRevenue: number;
    pendingOrders: number;
    totalOrders: number;
    completedOrders: number;
  };
  sections: {
    recentOrders: any[];
    topProducts: any[];
  };
}

const StoreDashboard = () => {
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<StoreData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const hasFetchedRef = React.useRef(false);

  const fetchData = React.useCallback(async () => {
    let userData: any = null; // Declare outside try block for use in catch
    try {
      setLoading(true);
      setError(null);
      
      // Check if user is logged in
      const token = typeof window !== 'undefined' ? localStorage.getItem('userToken') : null;
      if (!token) {
        router.push('/login');
        return;
      }

      // Get user info with timeout
      try {
        const userResponse: any = await Promise.race([
          ApiService.auth.me(),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Request timeout')), 15000)
          )
        ]) as any;

        if (!userResponse?.data?.success) {
          throw new Error('Failed to get user information');
        }

        userData = userResponse.data.user;
        setUser(userData);

        // Check if user is a seller/store
        if (userData.role !== 'seller' && userData.role !== 'store') {
          setError('You are not authorized to access store pages. Please login as a store owner.');
          setLoading(false);
          setTimeout(() => router.push('/login'), 3000);
          return;
        }

        // Check if account is approved
        if (userData.status !== 'active') {
          setError('Your store account is pending approval. Please wait for admin approval.');
          setLoading(false);
          // Don't redirect - show dashboard with message instead
          setDashboardData({
            store: userData.roleData || {},
            stats: {
              totalProducts: 0,
              todayOrders: 0,
              monthlyRevenue: 0,
              pendingOrders: 0,
              totalOrders: 0,
              completedOrders: 0
            },
            sections: {
              recentOrders: [],
              topProducts: []
            }
          });
          return;
        }
      } catch (userErr: any) {
        console.error('Error fetching user:', userErr);
        if (userErr.response?.status === 401) {
          localStorage.removeItem('userToken');
          localStorage.removeItem('user');
          router.push('/login');
          return;
        }
        setError('Failed to load user information. Please try again.');
        setLoading(false);
        return;
      }

      // Fetch store dashboard data with timeout
      try {
        let storeResponse: any;
        try {
          storeResponse = await Promise.race([
            ApiService.stores.getDashboard(),
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Dashboard request timeout')), 15000)
            )
          ]) as any;
        } catch (apiErr: any) {
          // Check if it's a network error (server not running, connection refused, etc.)
          const isNetworkError = apiErr.isNetworkError || 
                                apiErr.code === 'ECONNREFUSED' || 
                                apiErr.code === 'ENOTFOUND' ||
                                apiErr.message?.includes('Network Error') ||
                                apiErr.message?.includes('Failed to fetch') ||
                                apiErr.message?.includes('fetch failed');
          
          if (isNetworkError) {
            // Server might not be running - show dashboard with default data
            setDashboardData({
              store: userData.roleData || {},
              stats: {
                totalProducts: 0,
                todayOrders: 0,
                monthlyRevenue: 0,
                pendingOrders: 0,
                totalOrders: 0,
                completedOrders: 0
              },
              sections: {
                recentOrders: [],
                topProducts: []
              }
            });
            setLoading(false);
            setError('Unable to connect to server. Please ensure the backend server is running.');
            return; // Exit early with default data
          }
          
          // Check if it's a 500 error (server error)
          if (apiErr.response?.status === 500) {
            // Don't log if suppressed
            if (!apiErr.suppressLog) {
              console.error('Dashboard API returned 500 error:', apiErr.response?.data);
            }
            // Use default data
            setDashboardData({
              store: userData.roleData || {},
              stats: {
                totalProducts: 0,
                todayOrders: 0,
                monthlyRevenue: 0,
                pendingOrders: 0,
                totalOrders: 0,
                completedOrders: 0
              },
              sections: {
                recentOrders: [],
                topProducts: []
              }
            });
            setLoading(false);
            return; // Exit early with default data
          }
          
          // Check if it's a 404 error
          const errorMessage = apiErr.response?.data?.message || apiErr.message || '';
          const isNotFound = apiErr.response?.status === 404 || apiErr.isNotFound;
          
          // If dashboard endpoint returns 404, it might be because:
          // 1. Route not deployed yet (endpoint doesn't exist)
          // 2. Store profile doesn't exist
          // So we'll try profile API as fallback instead of redirecting immediately
          if (isNotFound) {
            // Silently handle 404 - don't log, just fall through to profile API
            // This handles the case where dashboard route isn't deployed yet
          } else {
            throw apiErr; // Re-throw if not a 404 or 500
          }
        }

        // Check if response is successful
        if (storeResponse?.data?.success) {
          const data = storeResponse.data.data;
          setDashboardData({
            store: data.store || userData.roleData || {},
            stats: {
              totalProducts: data.stats?.totalProducts || 0,
              todayOrders: data.stats?.todayOrders || 0,
              monthlyRevenue: data.stats?.totalRevenue || data.stats?.monthlyRevenue || 0,
              pendingOrders: data.stats?.pendingOrders || 0,
              totalOrders: data.stats?.totalOrders || 0,
              completedOrders: data.stats?.completedOrders || 0
            },
            sections: {
              recentOrders: data.sections?.recentOrders || [],
              topProducts: data.sections?.topSellingProducts || []
            }
          });
          setLoading(false);
          return; // Success, exit early
        } else {
          // If response exists but success is false, check status
          // For 404, silently handle - don't throw, let it fall through to profile API
          if (storeResponse?.status === 404 || storeResponse?.response?.status === 404) {
            // Silently handle 404 - don't throw, let it fall through to profile API
            // This prevents error logging
          } else {
            // Only throw for non-404 errors
            throw new Error(storeResponse?.data?.message || 'Dashboard API returned unsuccessful response');
          }
        }
      } catch (err: any) {
        // Completely suppress error logging for 404s and suppressed errors
        // Check multiple ways the 404 might be represented
        const is404 = err.response?.status === 404 || 
                      err.status === 404 ||
                      err.suppressLog || 
                      err.isNotFound;
        
        // Also suppress logging for "unsuccessful response" errors without status (likely 404)
        const isUnsuccessfulResponse = err.message?.includes('unsuccessful response') && 
                                       !err.response?.status &&
                                       !err.response;
        
        // Only log unexpected errors (not 404s, not suppressed, not "unsuccessful response" without status)
        if (!is404 && !isUnsuccessfulResponse && err.response?.status !== 404 && !err.suppressLog && !err.isNotFound) {
          // Only log if it's a real error with a status code
          if (err.response?.status) {
            console.error('Dashboard API failed:', {
              status: err.response?.status,
              message: err.message,
              data: err.response?.data
            });
          }
        }
        // For 404s and "unsuccessful response" errors, silently continue to profile API fallback
        
        // If dashboard API fails or returns 404, try profile API as fallback
        // This handles the case where dashboard route isn't deployed yet
        try {
          const profileResponse: any = await Promise.race([
            ApiService.stores.getProfile(),
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Profile request timeout')), 10000)
            )
          ]) as any;

          if (profileResponse?.data?.success) {
            // Profile exists, show dashboard with basic data
            setDashboardData({
              store: profileResponse.data.data || userData.roleData || {},
              stats: {
                totalProducts: 0,
                todayOrders: 0,
                monthlyRevenue: 0,
                pendingOrders: 0,
                totalOrders: 0,
                completedOrders: 0
              },
              sections: {
                recentOrders: [],
                topProducts: []
              }
            });
            setLoading(false);
            return; // Success, exit early
          } else {
            // Check if profile response indicates not found
            const isProfileNotFound = profileResponse?.data?.message?.includes('not found') ||
                                      profileResponse?.data?.message?.includes('Store profile not found');
            
            if (isProfileNotFound) {
              // Profile not found - show dashboard with empty data instead of redirecting
              setDashboardData({
                store: userData.roleData || {},
                stats: {
                  totalProducts: 0,
                  todayOrders: 0,
                  monthlyRevenue: 0,
                  pendingOrders: 0,
                  totalOrders: 0,
                  completedOrders: 0
                },
                sections: {
                  recentOrders: [],
                  topProducts: []
                }
              });
              setLoading(false);
              // Don't set error - show dashboard with warning banner instead
              return;
            }
            throw new Error('Profile API returned unsuccessful response');
          }
        } catch (profileErr: any) {
          // Check if error should be suppressed
          if (!profileErr.suppressLog && !profileErr.isNotFound && profileErr.message !== 'Profile request timeout') {
            console.error('Error loading profile:', profileErr);
          }
          
          // Check if profile API also returns 404 (store doesn't exist)
          const profileErrorMessage = profileErr.response?.data?.message || profileErr.message || '';
          const isProfileNotFound = profileErr.isNotFound || 
                                    profileErr.response?.status === 404 || 
                                    profileErrorMessage.toLowerCase().includes('not found') ||
                                    profileErrorMessage.toLowerCase().includes('store profile not found') ||
                                    profileErrorMessage.toLowerCase().includes('store profile not found for current user');
          
          if (isProfileNotFound) {
            // Both dashboard and profile returned 404 - store doesn't exist
            // Instead of redirecting immediately, show dashboard with empty data
            // User can still navigate and see the interface
            profileErr.isHandled = true;
            setDashboardData({
              store: userData.roleData || {},
              stats: {
                totalProducts: 0,
                todayOrders: 0,
                monthlyRevenue: 0,
                pendingOrders: 0,
                totalOrders: 0,
                completedOrders: 0
              },
              sections: {
                recentOrders: [],
                topProducts: []
              }
            });
            setLoading(false);
            // Don't set error - show dashboard with warning banner instead
            // This allows user to see the dashboard and navigate
            return; // Exit early
          }
          
          // For other errors (network, timeout, etc.), show dashboard with default data
          // This allows user to see the page even if some APIs fail
          setDashboardData({
            store: userData.roleData || {},
            stats: {
              totalProducts: 0,
              todayOrders: 0,
              monthlyRevenue: 0,
              pendingOrders: 0,
              totalOrders: 0,
              completedOrders: 0
            },
            sections: {
              recentOrders: [],
              topProducts: []
            }
          });
          setLoading(false);
        }
      } // Close catch at line 186
      } catch (outerErr: any) {
        // Check if error should be suppressed (404s, network errors, etc.)
        const shouldSuppress = outerErr.suppressLog || 
                              outerErr.isNotFound || 
                              outerErr.isNetworkError ||
                              outerErr.code === 'ECONNREFUSED' ||
                              outerErr.code === 'ENOTFOUND';
        
        // Only log unexpected errors that shouldn't be suppressed
        if (!shouldSuppress) {
          console.error('Unexpected error in fetchData:', outerErr);
        }
        
        // Check if it's a network error (server not running, connection refused, etc.)
        const isNetworkError = outerErr.isNetworkError || 
                              outerErr.code === 'ECONNREFUSED' || 
                              outerErr.code === 'ENOTFOUND' ||
                              outerErr.message?.includes('Network Error') ||
                              outerErr.message?.includes('Failed to fetch') ||
                              outerErr.message?.includes('fetch failed');
        
        if (isNetworkError) {
          setDashboardData({
            store: userData?.roleData || {},
            stats: {
              totalProducts: 0,
              todayOrders: 0,
              monthlyRevenue: 0,
              pendingOrders: 0,
              totalOrders: 0,
              completedOrders: 0
            },
            sections: {
              recentOrders: [],
              topProducts: []
            }
          });
          setError('Unable to connect to server. Please ensure the backend server is running.');
          setLoading(false);
          return;
        }
        
        // Check if it's a 401 error (unauthorized)
        if (outerErr.response?.status === 401 || outerErr.message?.includes('401')) {
          localStorage.removeItem('userToken');
          localStorage.removeItem('user');
          setLoading(false);
          router.push('/login');
          return;
        }
        
        // Check if it's a timeout error
        if (outerErr.message?.includes('timeout')) {
          setError('Request timed out. Please check your connection and try again.');
          setLoading(false);
          return;
        }
        
        // For other errors, show dashboard with default data
        setDashboardData({
          store: userData?.roleData || {},
          stats: {
            totalProducts: 0,
            todayOrders: 0,
            monthlyRevenue: 0,
            pendingOrders: 0,
            totalOrders: 0,
            completedOrders: 0
          },
          sections: {
            recentOrders: [],
            topProducts: []
          }
        });
        // Only show error message if it's not a suppressed error
        if (!shouldSuppress) {
          setError(outerErr.message || 'Failed to load dashboard data. Please try again later.');
        }
        setLoading(false);
      } finally {
        // Always set loading to false
        setLoading(false);
      }
  }, [router]);

  useEffect(() => {
    if (!hasFetchedRef.current) {
      hasFetchedRef.current = true;
      fetchData();
    }
  }, [fetchData]);

  // Don't auto-redirect - let user see the dashboard and decide when to register
  // User can manually navigate to register if needed via the UI

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Only show error display for critical errors, not for missing profile
  // Missing profile should show dashboard with warning banner
  const isCriticalError = error && !error.includes('Store profile not found') && !error.includes('store registration');
  
  if (isCriticalError) {
    return (
      <StoreLayout title="Store Dashboard - TeamUp India" description="Manage your sports store on TeamUp India">
        <StoreErrorDisplay 
          error={error} 
          onRetry={() => {
            setError(null);
            hasFetchedRef.current = false;
            setLoading(true);
            fetchData();
          }}
        />
      </StoreLayout>
    );
  }

  const stats = dashboardData?.stats || {
    totalProducts: 0,
    todayOrders: 0,
    monthlyRevenue: 0,
    pendingOrders: 0,
    totalOrders: 0,
    completedOrders: 0
  };

  const recentOrders = dashboardData?.sections?.recentOrders || [];
  const topProducts = dashboardData?.sections?.topProducts || [];
  const storeInfo = dashboardData?.store || user?.roleData || {};

  // Check if store profile exists
  const hasStoreProfile = storeInfo && storeInfo.storeName;
  const profileNotFound = !hasStoreProfile && !loading && dashboardData;

  return (
    <StoreLayout title="Store Dashboard - TeamUp India" description="Manage your sports store on TeamUp India">
      <div className="max-w-7xl mx-auto py-8 px-6">
        {/* Warning banner if profile not found */}
        {profileNotFound && (
          <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
            <div className="flex items-center justify-between">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    <strong>Store profile not found.</strong> Please complete your store registration to access all features.
                  </p>
                </div>
              </div>
              <Link 
                href="/store/register" 
                className="ml-4 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 px-4 py-2 rounded-md text-sm font-medium transition duration-300"
              >
                Complete Registration
              </Link>
            </div>
          </div>
        )}

        {/* Show other errors as banner (not blocking) */}
        {error && !profileNotFound && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Hi {user?.name || 'Store Owner'}, Welcome Back!
          </h1>
          <p className="text-gray-600">Manage your sports store and track your sales</p>
          {storeInfo.storeName && (
            <p className="text-gray-700 font-medium mt-2">Store: {storeInfo.storeName}</p>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Products</h3>
            <p className="text-3xl font-bold text-red-600">{stats.totalProducts}</p>
            <p className="text-sm text-gray-500 mt-1">Listed products</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Today's Orders</h3>
            <p className="text-3xl font-bold text-green-600">{stats.todayOrders}</p>
            <p className="text-sm text-gray-500 mt-1">New orders today</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Monthly Revenue</h3>
            <p className="text-3xl font-bold text-blue-600">₹{stats.monthlyRevenue.toLocaleString()}</p>
            <p className="text-sm text-gray-500 mt-1">This month</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Pending Orders</h3>
            <p className="text-3xl font-bold text-yellow-600">{stats.pendingOrders}</p>
            <p className="text-sm text-gray-500 mt-1">Awaiting processing</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/store/products/add" className="bg-white hover:bg-gray-50 p-4 rounded-lg shadow-md border border-gray-200 text-center transition duration-300">
              <div className="text-2xl mb-2">➕</div>
              <h3 className="font-semibold text-gray-900">Add Product</h3>
            </Link>
            <Link href="/store/orders" className="bg-white hover:bg-gray-50 p-4 rounded-lg shadow-md border border-gray-200 text-center transition duration-300">
              <div className="text-2xl mb-2">📦</div>
              <h3 className="font-semibold text-gray-900">View Orders</h3>
            </Link>
            <Link href="/store/inventory" className="bg-white hover:bg-gray-50 p-4 rounded-lg shadow-md border border-gray-200 text-center transition duration-300">
              <div className="text-2xl mb-2">📊</div>
              <h3 className="font-semibold text-gray-900">Manage Inventory</h3>
            </Link>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
            <Link href="/store/orders" className="text-red-600 hover:underline font-medium">View All</Link>
          </div>
          <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
            {recentOrders.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentOrders.slice(0, 5).map((order: any) => (
                    <tr key={order._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order.orderId || order._id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.userId?.name || 'Unknown Customer'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">₹{order.totalAmount?.toLocaleString() || '0'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status || 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <Link href="/store/orders" className="text-red-600 hover:underline">View Orders</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-8 text-center text-gray-500">
                <p>No orders yet. Start by adding products to your store!</p>
                <Link href="/store/products/add" className="text-red-600 hover:underline mt-2 inline-block">Add Products</Link>
              </div>
            )}
          </div>
        </div>

        {/* Top Selling Products */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Top Selling Products</h2>
            <Link href="/store/products" className="text-red-600 hover:underline font-medium">View All</Link>
          </div>
          {topProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topProducts.slice(0, 3).map((product: any) => (
                <div key={product._id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                  <h3 className="font-bold text-lg mb-2 text-gray-900">{product.name || 'Product Name'}</h3>
                  <p className="text-gray-600 mb-2">Brand: {product.brand || 'N/A'}</p>
                  <p className="text-gray-600 mb-4">Price: ₹{product.price?.toLocaleString() || '0'}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Sold: {product.soldCount || 0} units</span>
                    <Link href={`/store/products/edit/${product._id}`} className="text-red-600 hover:underline text-sm">Edit</Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200 text-center text-gray-500">
              <p>No products yet. Add your first product to get started!</p>
              <Link href="/store/products/add" className="text-red-600 hover:underline mt-2 inline-block">Add Product</Link>
            </div>
          )}
        </div>
      </div>
    </StoreLayout>
  );
};

export default StoreDashboard;
