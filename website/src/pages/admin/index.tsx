import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import AdminNav from '../../components/AdminNav';
import { BACKEND_API_URL } from '../../config/constants';

interface DashboardStats {
  totalUsers: number;
  totalCoaches: number;
  totalStores: number;
  totalDelivery: number;
  pendingCoaches: number;
  pendingStores: number;
  pendingDelivery: number;
  totalRevenue: number;
  todayUsers: number;
  todayBookings: number;
  todayOrders: number;
  todayDeliveries: number;
}

interface RecentActivity {
  _id: string;
  activity: string;
  user: string;
  time: string;
  status: string;
  type: string;
}

const AdminDashboard = () => {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalCoaches: 0,
    totalStores: 0,
    totalDelivery: 0,
    pendingCoaches: 0,
    pendingStores: 0,
    pendingDelivery: 0,
    totalRevenue: 0,
    todayUsers: 0,
    todayBookings: 0,
    todayOrders: 0,
    todayDeliveries: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adminInfo, setAdminInfo] = useState<any>(null);

  useEffect(() => {
    // Check if admin is logged in
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

    fetchDashboardData();
  }, [router]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const backendUrl = BACKEND_API_URL;
      const adminToken = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;

      if (!adminToken) {
        throw new Error('Admin not authenticated');
      }

      // Helper function to fetch with delay to avoid rate limiting
      const fetchWithDelay = (url: string, delay: number) => 
        new Promise<Response>((resolve, reject) => 
          setTimeout(() => 
            fetch(url, { 
              headers: { 'Authorization': `Bearer ${adminToken}` } 
            }).then(resolve).catch(reject), 
            delay
          )
        );

      // Helper function to safely parse JSON response
      const parseResponse = async (response: Response) => {
        // Handle non-OK responses gracefully
        if (!response.ok) {
          try {
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
              const errorData = await response.json();
              const errorMessage = errorData.message || errorData.error || `HTTP error! status: ${response.status}`;
              
              // Handle permission errors gracefully
              if (response.status === 403 || errorMessage.includes('permission') || errorMessage.includes('Access denied')) {
                console.warn('Permission error:', errorMessage);
                // Return empty data instead of throwing
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
              
              // Handle rate limiting
              if (response.status === 429) {
                console.warn('Rate limit exceeded (429):', errorMessage);
                return { data: { users: [] }, success: false, message: 'Too many requests, please try again later.' };
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

      // Fetch all users with different roles - with delays to avoid rate limiting
      // Increased delays to prevent 429 errors
      const usersRes = await fetchWithDelay(`${backendUrl}/api/users?role=user`, 0);
      const coachesRes = await fetchWithDelay(`${backendUrl}/api/users?role=coach`, 1000);
      const storesRes = await fetchWithDelay(`${backendUrl}/api/users?role=seller`, 2000);
      const deliveryRes = await fetchWithDelay(`${backendUrl}/api/users?role=delivery`, 3000);

      // Parse responses with error handling
      let usersData, coachesData, storesData, deliveryData;
      
      try {
        usersData = await parseResponse(usersRes);
        if (!usersData.success && usersData.data) {
          usersData = usersData;
        }
      } catch (err: any) {
        console.error('Error parsing users data:', err);
        usersData = { data: { users: [] }, success: false };
      }

      try {
        coachesData = await parseResponse(coachesRes);
        if (!coachesData.success && coachesData.data) {
          coachesData = coachesData;
        }
      } catch (err: any) {
        console.error('Error parsing coaches data:', err);
        coachesData = { data: { users: [] }, success: false };
      }

      try {
        storesData = await parseResponse(storesRes);
        if (!storesData.success && storesData.data) {
          storesData = storesData;
        }
      } catch (err: any) {
        console.error('Error parsing stores data:', err);
        storesData = { data: { users: [] }, success: false };
      }

      try {
        deliveryData = await parseResponse(deliveryRes);
        if (!deliveryData.success && deliveryData.data) {
          deliveryData = deliveryData;
        }
      } catch (err: any) {
        console.error('Error parsing delivery data:', err);
        deliveryData = { data: { users: [] }, success: false };
      }
      
      // Check for permission errors
      const hasPermissionError = 
        (usersData.message && usersData.message.includes('permission')) ||
        (coachesData.message && coachesData.message.includes('permission')) ||
        (storesData.message && storesData.message.includes('permission')) ||
        (deliveryData.message && deliveryData.message.includes('permission'));
      
      if (hasPermissionError) {
        setError('You do not have permission to view user data. Please contact your administrator.');
      }

      // Helper function to safely get users array
      const getUsersArray = (data: any): any[] => {
        if (!data) return [];
        if (Array.isArray(data)) return data;
        if (data.users && Array.isArray(data.users)) return data.users;
        if (data.data && Array.isArray(data.data)) return data.data;
        if (data.data?.users && Array.isArray(data.data.users)) return data.data.users;
        return [];
      };

      // Calculate stats
      const usersArray = getUsersArray(usersData.data || usersData);
      const coachesArray = getUsersArray(coachesData.data || coachesData);
      const storesArray = getUsersArray(storesData.data || storesData);
      const deliveryArray = getUsersArray(deliveryData.data || deliveryData);

      const totalUsers = usersArray.length;
      const totalCoaches = coachesArray.length;
      const totalStores = storesArray.length;
      const totalDelivery = deliveryArray.length;

      // Count pending approvals
      const pendingCoaches = coachesArray.filter((u: any) => u.status === 'pending').length;
      const pendingStores = storesArray.filter((u: any) => u.status === 'pending').length;
      const pendingDelivery = deliveryArray.filter((u: any) => u.status === 'pending').length;

      // Get today's date
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Count today's registrations
      const todayUsers = usersArray.filter((u: any) => {
        if (!u.createdAt) return false;
        const created = new Date(u.createdAt);
        return created >= today;
      }).length;

      // Generate recent activity from recent users
      const allUsers = [
        ...usersArray,
        ...coachesArray,
        ...storesArray,
        ...deliveryArray,
      ].sort((a: any, b: any) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      }).slice(0, 10);

      const activity: RecentActivity[] = allUsers.map((user: any) => {
        const roleLabels: any = {
          user: 'Player',
          coach: 'Coach',
          seller: 'Store',
          delivery: 'Delivery Partner'
        };
        const activityTypes: any = {
          user: 'New Player Registration',
          coach: 'New Coach Registration',
          seller: 'New Store Registration',
          delivery: 'New Delivery Registration'
        };
        const timeAgo = getTimeAgo(new Date(user.createdAt));
        
        return {
          _id: user._id || user.id,
          activity: activityTypes[user.role] || 'New Registration',
          user: user.name || 'Unknown',
          time: timeAgo,
          status: user.status === 'pending' ? 'Pending' : user.status === 'active' ? 'Approved' : user.status,
          type: user.role
        };
      });

      setStats({
        totalUsers,
        totalCoaches,
        totalStores,
        totalDelivery,
        pendingCoaches,
        pendingStores,
        pendingDelivery,
        totalRevenue: 0, // Will be calculated from orders if available
        todayUsers,
        todayBookings: 0, // Can be fetched from bookings API
        todayOrders: 0, // Can be fetched from orders API
        todayDeliveries: 0, // Can be fetched from deliveries API
      });

      setRecentActivity(activity);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} mins ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('admin');
    }
    router.push('/admin/login');
  };

  const formatNumber = (num: number): string => {
    if (num >= 10000000) return `${(num / 10000000).toFixed(2)} Cr`;
    if (num >= 100000) return `${(num / 100000).toFixed(2)} L`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Admin Dashboard - TeamUp India</title>
        <meta name="description" content="Admin dashboard for TeamUp India platform management" />
      </Head>

      <AdminNav adminInfo={adminInfo} />

      <div className="max-w-7xl mx-auto py-8 px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Manage the TeamUp India platform and monitor performance</p>
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
                onClick={fetchDashboardData} 
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
            <p className="mt-4 text-gray-600">Loading dashboard data...</p>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Users</h3>
                <p className="text-3xl font-bold text-red-600 mb-1">{formatNumber(stats.totalUsers)}</p>
                <p className="text-sm text-gray-600 font-medium">+{stats.todayUsers} today</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Coaches</h3>
                <p className="text-3xl font-bold text-green-600 mb-1">{formatNumber(stats.totalCoaches)}</p>
                <p className="text-sm text-gray-600 font-medium">{stats.pendingCoaches} pending</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Stores</h3>
                <p className="text-3xl font-bold text-blue-600 mb-1">{formatNumber(stats.totalStores)}</p>
                <p className="text-sm text-gray-600 font-medium">{stats.pendingStores} pending</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Delivery Partners</h3>
                <p className="text-3xl font-bold text-purple-600 mb-1">{formatNumber(stats.totalDelivery)}</p>
                <p className="text-sm text-gray-600 font-medium">{stats.pendingDelivery} pending</p>
              </div>
            </div>

            {/* Platform Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Daily Activity</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-700 font-medium">New Users</span>
                      <span className="text-gray-900 font-semibold">{stats.todayUsers}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-red-600 h-2.5 rounded-full transition-all duration-300" 
                        style={{width: `${Math.min((stats.todayUsers / 100) * 100, 100)}%`}}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-700 font-medium">Bookings</span>
                      <span className="text-gray-900 font-semibold">{stats.todayBookings}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-green-600 h-2.5 rounded-full transition-all duration-300" 
                        style={{width: `${Math.min((stats.todayBookings / 100) * 100, 100)}%`}}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-700 font-medium">Orders</span>
                      <span className="text-gray-900 font-semibold">{stats.todayOrders}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                        style={{width: `${Math.min((stats.todayOrders / 100) * 100, 100)}%`}}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-700 font-medium">Deliveries</span>
                      <span className="text-gray-900 font-semibold">{stats.todayDeliveries}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-purple-600 h-2.5 rounded-full transition-all duration-300" 
                        style={{width: `${Math.min((stats.todayDeliveries / 100) * 100, 100)}%`}}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Pending Approvals</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-700 font-medium">Coach Registrations</span>
                    <span className="bg-yellow-100 text-yellow-800 text-sm font-semibold px-3 py-1 rounded-full border border-yellow-300">
                      {stats.pendingCoaches}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-700 font-medium">Store Registrations</span>
                    <span className="bg-yellow-100 text-yellow-800 text-sm font-semibold px-3 py-1 rounded-full border border-yellow-300">
                      {stats.pendingStores}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-700 font-medium">Delivery Registrations</span>
                    <span className="bg-yellow-100 text-yellow-800 text-sm font-semibold px-3 py-1 rounded-full border border-yellow-300">
                      {stats.pendingDelivery}
                    </span>
                  </div>
                  <div className="pt-4">
                    <Link href="/admin/approvals" className="text-red-600 hover:text-red-700 font-semibold transition-colors inline-flex items-center">
                      Review All Approvals →
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Link href="/admin/approvals" className="bg-white border-2 border-gray-200 hover:border-red-500 hover:bg-red-50 p-6 rounded-xl text-center transition-all duration-300 shadow-sm hover:shadow-md">
                  <div className="text-3xl mb-3">✅</div>
                  <h3 className="font-semibold text-gray-800">Approvals</h3>
                  <p className="text-sm text-gray-600 mt-1">Review pending</p>
                </Link>
                <Link href="/admin/users" className="bg-white border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 p-6 rounded-xl text-center transition-all duration-300 shadow-sm hover:shadow-md">
                  <div className="text-3xl mb-3">👥</div>
                  <h3 className="font-semibold text-gray-800">User Management</h3>
                  <p className="text-sm text-gray-600 mt-1">Manage users</p>
                </Link>
                <Link href="/admin/shop" className="bg-white border-2 border-gray-200 hover:border-green-500 hover:bg-green-50 p-6 rounded-xl text-center transition-all duration-300 shadow-sm hover:shadow-md">
                  <div className="text-4xl mb-3">🛍️</div>
                  <h3 className="font-bold text-lg mb-1">Shop Management</h3>
                  <p className="text-sm text-gray-600">Manage products, orders & revenue</p>
                </Link>
                <Link href="/admin/cms" className="bg-white border-2 border-gray-200 hover:border-green-500 hover:bg-green-50 p-6 rounded-xl text-center transition-all duration-300 shadow-sm hover:shadow-md">
                  <div className="text-3xl mb-3">📝</div>
                  <h3 className="font-semibold text-gray-800">Content Management</h3>
                  <p className="text-sm text-gray-600 mt-1">Manage content</p>
                </Link>
                <Link href="/admin/analytics" className="bg-white border-2 border-gray-200 hover:border-purple-500 hover:bg-purple-50 p-6 rounded-xl text-center transition-all duration-300 shadow-sm hover:shadow-md">
                  <div className="text-3xl mb-3">📊</div>
                  <h3 className="font-semibold text-gray-800">Analytics</h3>
                  <p className="text-sm text-gray-600 mt-1">View reports</p>
                </Link>
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Recent Platform Activity</h2>
                <button 
                  onClick={fetchDashboardData}
                  className="text-sm text-red-600 hover:underline"
                >
                  Refresh
                </button>
              </div>
              <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Activity</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Time</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentActivity.length > 0 ? (
                      recentActivity.map((activity) => (
                        <tr key={activity._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{activity.activity}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{activity.user}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{activity.time}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${
                              activity.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-300' :
                              activity.status === 'active' ? 'bg-green-100 text-green-800 border-green-300' :
                              activity.status === 'rejected' ? 'bg-red-100 text-red-800 border-red-300' :
                              'bg-blue-100 text-blue-800 border-blue-300'
                            }`}>
                              {activity.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {activity.status === 'pending' && (
                              <Link 
                                href={`/admin/approvals?type=${activity.type}`}
                                className="text-red-600 hover:text-red-700 font-semibold text-sm transition-colors"
                              >
                                Review
                              </Link>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 text-center text-gray-500 font-medium">
                          No recent activity
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
