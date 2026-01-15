import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ApiService } from '../../utils/api';

interface DeliveryData {
  delivery: any;
  stats: {
    activeDeliveries: number;
    todayEarnings: number;
    completedToday: number;
    avgRating: number;
    totalEarnings: number;
    monthlyEarnings: number;
  };
  sections: {
    activeDeliveries: any[];
    recentEarnings: any[];
  };
}

const DeliveryDashboard = () => {
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<DeliveryData | null>(null);
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

          // Check if user is a delivery partner
          if (userData.role !== 'delivery') {
            router.push('/');
            return;
          }

          // Check if account is approved
          if (userData.status !== 'active') {
            router.push('/registration-status');
            return;
          }

          // Set dashboard data based on delivery profile
          setDashboardData({
            delivery: userData.roleData || {},
            stats: {
              activeDeliveries: 0,
              todayEarnings: 0,
              completedToday: 0,
              avgRating: 0,
              totalEarnings: userData.roleData?.earnings?.total || 0,
              monthlyEarnings: 0
            },
            sections: {
              activeDeliveries: [],
              recentEarnings: []
            }
          });
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
    activeDeliveries: 0,
    todayEarnings: 0,
    completedToday: 0,
    avgRating: 0,
    totalEarnings: 0,
    monthlyEarnings: 0
  };

  const activeDeliveries = dashboardData?.sections?.activeDeliveries || [];
  const recentEarnings = dashboardData?.sections?.recentEarnings || [];
  const deliveryInfo = dashboardData?.delivery || {};

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Delivery Dashboard - TeamUp India</title>
        <meta name="description" content="Manage your deliveries on TeamUp India" />
      </Head>

      {/* Delivery Navigation */}
      <nav className="bg-gray-900 text-white py-4 px-6 flex justify-between items-center">
        <div className="text-xl font-bold text-red-400">TeamUp India Delivery</div>
        <div className="flex space-x-6">
          <Link href="/delivery" className="hover:text-red-400">Dashboard</Link>
          <Link href="/delivery/active" className="hover:text-red-400">Active Deliveries</Link>
          <Link href="/delivery/history" className="hover:text-red-400">History</Link>
          <Link href="/delivery/earnings" className="hover:text-red-400">Earnings</Link>
          <Link href="/delivery/profile" className="hover:text-red-400">Profile</Link>
          <Link href="/delivery/documents" className="hover:text-red-400">Documents</Link>
          <Link href="/delivery/settings" className="hover:text-red-400">Settings</Link>
          <button onClick={handleLogout} className="hover:text-red-400">Logout</button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-8 px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Hi {user?.name || 'Delivery Partner'}, Welcome Back!
          </h1>
          <p className="text-gray-600">Manage your deliveries and track your performance</p>
          {deliveryInfo.vehicle?.type && (
            <p className="text-gray-700 font-medium mt-2">Vehicle: {deliveryInfo.vehicle.type}</p>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Active Deliveries</h3>
            <p className="text-3xl font-bold text-red-600">{stats.activeDeliveries}</p>
            <p className="text-sm text-gray-500 mt-1">In progress</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Today's Earnings</h3>
            <p className="text-3xl font-bold text-green-600">₹{stats.todayEarnings.toLocaleString()}</p>
            <p className="text-sm text-gray-500 mt-1">Earned today</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Completed Today</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.completedToday}</p>
            <p className="text-sm text-gray-500 mt-1">Deliveries completed</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Earnings</h3>
            <p className="text-3xl font-bold text-yellow-600">₹{stats.totalEarnings.toLocaleString()}</p>
            <p className="text-sm text-gray-500 mt-1">All time earnings</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/delivery/active" className="bg-white hover:bg-gray-50 p-4 rounded-lg shadow-md border border-gray-200 text-center transition duration-300">
              <div className="text-2xl mb-2">📦</div>
              <h3 className="font-semibold text-gray-900">View Active</h3>
            </Link>
            <Link href="/delivery/earnings" className="bg-white hover:bg-gray-50 p-4 rounded-lg shadow-md border border-gray-200 text-center transition duration-300">
              <div className="text-2xl mb-2">💰</div>
              <h3 className="font-semibold text-gray-900">Track Earnings</h3>
            </Link>
            <Link href="/delivery/documents" className="bg-white hover:bg-gray-50 p-4 rounded-lg shadow-md border border-gray-200 text-center transition duration-300">
              <div className="text-2xl mb-2">📄</div>
              <h3 className="font-semibold text-gray-900">Update Docs</h3>
            </Link>
          </div>
        </div>

        {/* Active Deliveries */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Active Deliveries</h2>
            <Link href="/delivery/active" className="text-red-600 hover:underline font-medium">View All</Link>
          </div>
          <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
            {activeDeliveries.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destination</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Distance</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {activeDeliveries.slice(0, 5).map((delivery: any) => (
                    <tr key={delivery._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{delivery.orderId || delivery._id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{delivery.customerName || 'Unknown Customer'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{delivery.destination || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{delivery.distance || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          delivery.status === 'picked_up' ? 'bg-yellow-100 text-yellow-800' :
                          delivery.status === 'in_transit' ? 'bg-blue-100 text-blue-800' :
                          delivery.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {delivery.status || 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <Link href={`/delivery/active/${delivery._id}`} className="text-red-600 hover:underline">Track</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-8 text-center text-gray-500">
                <p>No active deliveries at the moment. Check back soon for new delivery assignments!</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Earnings */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Recent Earnings</h2>
            <Link href="/delivery/earnings" className="text-red-600 hover:underline font-medium">View All</Link>
          </div>
          {recentEarnings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentEarnings.slice(0, 3).map((earning: any, index: number) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                  <h3 className="font-bold text-lg mb-2 text-gray-900">
                    {earning.date ? new Date(earning.date).toLocaleDateString() : 'Recent'}
                  </h3>
                  <p className="text-gray-600 mb-2">Deliveries Completed: {earning.completedCount || 0}</p>
                  <p className="text-2xl font-bold text-green-600">₹{earning.amount?.toLocaleString() || '0'}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200 text-center text-gray-500">
              <p>No earnings yet. Start accepting deliveries to earn money!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeliveryDashboard;
