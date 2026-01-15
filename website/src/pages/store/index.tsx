import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ApiService } from '../../utils/api';

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check if user is logged in
        const token = typeof window !== 'undefined' ? localStorage.getItem('userToken') : null;
        if (!token) {
          router.push('/login');
          return;
        }

        // Get user info
        const userResponse: any = await ApiService.auth.me();
        if (userResponse.data && userResponse.data.success) {
          const userData = userResponse.data.user;
          setUser(userData);

          // Check if user is a seller/store
          if (userData.role !== 'seller') {
            router.push('/');
            return;
          }

          // Check if account is approved
          if (userData.status !== 'active') {
            router.push('/registration-status');
            return;
          }

          // Fetch store profile and stats
          // Note: You may need to create a store dashboard API endpoint
          // For now, we'll use the store profile
          try {
            const storeResponse: any = await ApiService.coaches.getProfile(); // Adjust API endpoint
            if (storeResponse.data && storeResponse.data.success) {
              // Set dashboard data based on store profile
              setDashboardData({
                store: storeResponse.data.data,
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
            }
          } catch (err) {
            // If no dashboard API, set default data
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
          }
        }
      } catch (err: any) {
        console.error('Error fetching dashboard:', err);
        if (err.response?.status === 401) {
          router.push('/login');
        } else {
          setError('Failed to load dashboard data');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Link href="/login" className="text-red-600 hover:underline">Go to Login</Link>
        </div>
      </div>
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
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Store Dashboard - TeamUp India</title>
        <meta name="description" content="Manage your sports store on TeamUp India" />
      </Head>

      {/* Store Navigation */}
      <nav className="bg-gray-900 text-white py-4 px-6 flex justify-between items-center">
        <div className="text-xl font-bold text-red-400">TeamUp India Store</div>
        <div className="flex space-x-6">
          <Link href="/store" className="hover:text-red-400">Dashboard</Link>
          <Link href="/store/products" className="hover:text-red-400">Products</Link>
          <Link href="/store/orders" className="hover:text-red-400">Orders</Link>
          <Link href="/store/inventory" className="hover:text-red-400">Inventory</Link>
          <Link href="/store/analytics" className="hover:text-red-400">Analytics</Link>
          <Link href="/store/profile" className="hover:text-red-400">Profile</Link>
          <Link href="/store/settings" className="hover:text-red-400">Settings</Link>
          <button onClick={handleLogout} className="hover:text-red-400">Logout</button>
        </div>
      </nav>

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
    </div>
  );
};

export default StoreDashboard;
