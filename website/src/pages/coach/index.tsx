import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ApiService } from '../../utils/api';

interface DashboardData {
  coach: any;
  stats: {
    totalSessions: number;
    completedSessions: number;
    totalEarnings: number;
    availableEarnings: number;
    pendingEarnings: number;
    rating: number;
    totalRatings: number;
  };
  sections: {
    recentBookings: any[];
    upcomingBookings: any[];
    recentReviews: any[];
    monthlyEarnings: any[];
  };
}

const CoachDashboard = () => {
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
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

          // Check if user is a coach
          if (userData.role !== 'coach') {
            router.push('/');
            return;
          }

          // Check if account is approved
          if (userData.status !== 'active') {
            router.push('/registration-status');
            return;
          }

          // Fetch dashboard data
          const dashboardResponse: any = await ApiService.coaches.getDashboard();
          if (dashboardResponse.data && dashboardResponse.data.success) {
            setDashboardData(dashboardResponse.data.data);
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
    totalSessions: 0,
    completedSessions: 0,
    totalEarnings: 0,
    availableEarnings: 0,
    pendingEarnings: 0,
    rating: 0,
    totalRatings: 0
  };

  const recentBookings = dashboardData?.sections?.recentBookings || [];
  const upcomingBookings = dashboardData?.sections?.upcomingBookings || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Coach Dashboard - TeamUp India</title>
        <meta name="description" content="Manage your coaching business on TeamUp India" />
      </Head>

      {/* Coach Navigation */}
      <nav className="bg-gray-900 text-white py-4 px-6 flex justify-between items-center">
        <div className="text-xl font-bold text-red-400">TeamUp India Coach</div>
        <div className="flex space-x-6">
          <Link href="/coach" className="hover:text-red-400">Dashboard</Link>
          <Link href="/coach/availability" className="hover:text-red-400">Availability</Link>
          <Link href="/coach/bookings" className="hover:text-red-400">Bookings</Link>
          <Link href="/coach/tournaments" className="hover:text-red-400">Tournaments</Link>
          <Link href="/coach/profile" className="hover:text-red-400">Profile</Link>
          <Link href="/coach/earnings" className="hover:text-red-400">Earnings</Link>
          <Link href="/coach/settings" className="hover:text-red-400">Settings</Link>
          <button onClick={handleLogout} className="hover:text-red-400">Logout</button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-8 px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Hi {user?.name || 'Coach'}, Welcome Back!
          </h1>
          <p className="text-gray-600">Manage your coaching business and track your performance</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Sessions</h3>
            <p className="text-3xl font-bold text-red-600">{stats.totalSessions}</p>
            <p className="text-sm text-gray-500 mt-1">Completed: {stats.completedSessions}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Earnings</h3>
            <p className="text-3xl font-bold text-green-600">₹{stats.totalEarnings.toLocaleString()}</p>
            <p className="text-sm text-gray-500 mt-1">Available: ₹{stats.availableEarnings.toLocaleString()}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Rating</h3>
            <p className="text-3xl font-bold text-yellow-600">
              {stats.rating > 0 ? `${stats.rating.toFixed(1)} ⭐` : 'N/A'}
            </p>
            <p className="text-sm text-gray-500 mt-1">{stats.totalRatings} reviews</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Pending Requests</h3>
            <p className="text-3xl font-bold text-blue-600">{upcomingBookings.length}</p>
            <p className="text-sm text-gray-500 mt-1">Awaiting response</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/coach/availability" className="bg-white hover:bg-gray-50 p-4 rounded-lg shadow-md border border-gray-200 text-center transition duration-300">
              <div className="text-2xl mb-2">📅</div>
              <h3 className="font-semibold text-gray-900">Set Availability</h3>
            </Link>
            <Link href="/coach/tournaments/create" className="bg-white hover:bg-gray-50 p-4 rounded-lg shadow-md border border-gray-200 text-center transition duration-300">
              <div className="text-2xl mb-2">🏆</div>
              <h3 className="font-semibold text-gray-900">Create Tournament</h3>
            </Link>
            <Link href="/coach/earnings" className="bg-white hover:bg-gray-50 p-4 rounded-lg shadow-md border border-gray-200 text-center transition duration-300">
              <div className="text-2xl mb-2">💰</div>
              <h3 className="font-semibold text-gray-900">Withdraw Earnings</h3>
            </Link>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Recent Bookings</h2>
            <Link href="/coach/bookings" className="text-red-600 hover:underline font-medium">View All</Link>
          </div>
          <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
            {recentBookings.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Player</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sport</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentBookings.slice(0, 5).map((booking: any) => (
                    <tr key={booking._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {booking.userId?.name || 'Unknown Player'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {booking.sport || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {booking.schedule?.date ? new Date(booking.schedule.date).toLocaleDateString() : 'N/A'}
                        {booking.schedule?.time && ` - ${booking.schedule.time}`}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          booking.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {booking.status || 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <Link href={`/coach/bookings/${booking._id}`} className="text-red-600 hover:underline">View</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-8 text-center text-gray-500">
                <p>No bookings yet. Start by setting your availability!</p>
                <Link href="/coach/availability" className="text-red-600 hover:underline mt-2 inline-block">Set Availability</Link>
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Bookings */}
        {upcomingBookings.length > 0 && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Upcoming Bookings</h2>
              <Link href="/coach/bookings" className="text-red-600 hover:underline font-medium">View All</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingBookings.slice(0, 3).map((booking: any) => (
                <div key={booking._id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                  <h3 className="font-bold text-lg mb-2 text-gray-900">
                    {booking.userId?.name || 'Unknown Player'}
                  </h3>
                  <p className="text-gray-600 mb-2">Sport: {booking.sport || 'N/A'}</p>
                  <p className="text-gray-600 mb-2">
                    Date: {booking.schedule?.date ? new Date(booking.schedule.date).toLocaleDateString() : 'N/A'}
                  </p>
                  <p className="text-gray-600 mb-4">
                    Time: {booking.schedule?.time || 'N/A'}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className={`text-sm px-2 py-1 rounded-full ${
                      booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {booking.status || 'Pending'}
                    </span>
                    <Link href={`/coach/bookings/${booking._id}`} className="text-red-600 hover:underline text-sm">Manage</Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoachDashboard;
