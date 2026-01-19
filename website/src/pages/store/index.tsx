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
      let userData;
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
          setTimeout(() => router.push('/store/register'), 3000);
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
          // Check if it's a 404 error (store profile not found)
          const errorMessage = apiErr.response?.data?.message || apiErr.message || '';
          const isNotFound = apiErr.response?.status === 404 || 
                            errorMessage.toLowerCase().includes('not found') || 
                            errorMessage.toLowerCase().includes('store profile not found') ||
                            errorMessage.toLowerCase().includes('store profile not found for current user');
          
          if (isNotFound) {
            setLoading(false);
            // Redirect immediately to registration page
            router.replace('/store/register');
            return; // Exit early, don't try profile API
          }
          throw apiErr; // Re-throw if not a 404
        }

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
          throw new Error(storeResponse?.data?.message || 'Dashboard API returned unsuccessful response');
        }
      } catch (err: any) {
        // If dashboard API fails for other reasons, try profile API
        try {
          const profileResponse: any = await Promise.race([
            ApiService.stores.getProfile(),
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Profile request timeout')), 10000)
            )
          ]) as any;

          if (profileResponse?.data?.success) {
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
              setError('Store profile not found. Please complete your store registration.');
              setLoading(false);
              setTimeout(() => {
                router.push('/store/register');
              }, 3000);
              return;
            }
            throw new Error('Profile API returned unsuccessful response');
          }
        } catch (profileErr: any) {
          // Check if profile API also returns 404
          const profileErrorMessage = profileErr.response?.data?.message || profileErr.message || '';
          const isProfileNotFound = profileErr.response?.status === 404 || 
                                    profileErrorMessage.toLowerCase().includes('not found') || 
                                    profileErrorMessage.toLowerCase().includes('store profile not found') ||
                                    profileErrorMessage.toLowerCase().includes('store profile not found for current user');
          
          if (isProfileNotFound) {
            setLoading(false);
            // Redirect immediately to registration page
            router.replace('/store/register');
            return; // Exit early
          }
          
          // For other errors, use default data
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
      }
      } catch (err: any) {
        // Check if it's a 404 error (store profile not found)
        const errorMessage = err.response?.data?.message || err.message || '';
        const isNotFound = err.response?.status === 404 || 
                          errorMessage.toLowerCase().includes('not found') || 
                          errorMessage.toLowerCase().includes('store profile not found') ||
                          errorMessage.toLowerCase().includes('store profile not found for current user');
        
        // Handle 404 errors (store profile not found)
        if (isNotFound && !error) {
          setLoading(false);
          // Redirect immediately to registration page
          router.replace('/store/register');
          return;
        }
        
        // Handle other errors that weren't already handled
        if (!error) {
          if (err.response?.status === 401 || err.message?.includes('401')) {
            localStorage.removeItem('userToken');
            localStorage.removeItem('user');
            setLoading(false);
            router.push('/login');
            return;
          } else if (err.message?.includes('timeout')) {
            setError('Request timed out. Please check your connection and try again.');
            setLoading(false);
          } else {
            setError(err.message || 'Failed to load dashboard data. Please try again later.');
            setLoading(false);
          }
        }
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

  // Redirect to registration if error is about missing profile
  useEffect(() => {
    if (error && (error.includes('not found') || error.includes('Store profile not found'))) {
      const timer = setTimeout(() => {
        router.replace('/store/register');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [error, router]);

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

  if (error) {
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

  return (
    <StoreLayout title="Store Dashboard - TeamUp India" description="Manage your sports store on TeamUp India">
      <div className="max-w-7xl mx-auto py-8 px-6">
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
                        <Link href={`/store/orders/${order._id}`} className="text-red-600 hover:underline">View</Link>
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
                    <Link href={`/store/products/${product._id}`} className="text-red-600 hover:underline text-sm">Edit</Link>
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
