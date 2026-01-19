import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import AdminNav from '../../components/AdminNav';
import { BACKEND_API_URL } from '../../config/constants';

interface User {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  role: string;
  status: string;
  createdAt: string;
}

const AdminUsers = () => {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adminInfo, setAdminInfo] = useState<any>(null);
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeCoaches: 0,
    activeStores: 0,
    activeDelivery: 0,
  });

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

    fetchAllUsers();
  }, [router]);

  useEffect(() => {
    filterUsers();
  }, [users, roleFilter, statusFilter, searchTerm]);

  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const backendUrl = BACKEND_API_URL;
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

      // Fetch all users
      const response = await fetch(`${backendUrl}/api/users?limit=1000`, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });

      const data = await parseResponse(response);
      const allUsers = data.data?.users || data.data || data.users || [];

      setUsers(allUsers);

      // Calculate stats
      setStats({
        totalUsers: allUsers.length,
        activeCoaches: allUsers.filter((u: User) => u.role === 'coach' && u.status === 'active').length,
        activeStores: allUsers.filter((u: User) => u.role === 'seller' && u.status === 'active').length,
        activeDelivery: allUsers.filter((u: User) => u.role === 'delivery' && u.status === 'active').length,
      });

      setError(null);
    } catch (err: any) {
      console.error('Error fetching users:', err);
      setError(err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = [...users];

    if (roleFilter !== 'all') {
      filtered = filtered.filter(u => u.role === roleFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(u => u.status === statusFilter);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(u =>
        u.name.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term) ||
        u.mobile.includes(term)
      );
    }

    setFilteredUsers(filtered);
  };

  const updateUserStatus = async (userId: string, status: string) => {
    try {
      const backendUrl = BACKEND_API_URL;
      const adminToken = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;

      if (!adminToken) {
        throw new Error('Admin not authenticated');
      }

      const response = await fetch(`${backendUrl}/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update user status');
      }

      await fetchAllUsers();
      alert(`User status updated to ${status} successfully!`);
    } catch (err: any) {
      console.error('Error updating user status:', err);
      alert(err.message || 'Failed to update user status');
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getRoleLabel = (role: string) => {
    const labels: any = {
      user: 'Player',
      coach: 'Coach',
      seller: 'Store',
      delivery: 'Delivery',
      admin: 'Admin'
    };
    return labels[role] || role;
  };

  const getRoleColor = (role: string) => {
    const colors: any = {
      user: 'bg-blue-100 text-blue-900 border-blue-300',
      coach: 'bg-green-100 text-green-900 border-green-300',
      seller: 'bg-orange-100 text-orange-900 border-orange-300',
      delivery: 'bg-purple-100 text-purple-900 border-purple-300',
      admin: 'bg-red-100 text-red-900 border-red-300'
    };
    return colors[role] || 'bg-gray-100 text-gray-900 border-gray-300';
  };

  const getStatusColor = (status: string) => {
    const colors: any = {
      active: 'bg-green-100 text-green-900 border-green-300',
      pending: 'bg-yellow-100 text-yellow-900 border-yellow-300',
      rejected: 'bg-red-100 text-red-900 border-red-300',
      inactive: 'bg-gray-100 text-gray-900 border-gray-300',
      suspended: 'bg-red-100 text-red-900 border-red-300'
    };
    return colors[status] || 'bg-gray-100 text-gray-900 border-gray-300';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Admin Users - TeamUp India</title>
        <meta name="description" content="Admin panel for managing platform users" />
      </Head>

      <AdminNav adminInfo={adminInfo} />

      <div className="max-w-7xl mx-auto py-8 px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">Manage all platform users, their roles, and permissions</p>
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
                onClick={fetchAllUsers} 
                className="ml-4 text-red-800 hover:text-red-900 font-semibold underline text-sm"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border-2 border-blue-300 shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-3xl font-bold text-blue-800 mb-2">{stats.totalUsers}</h3>
            <p className="text-gray-700 font-semibold">Total Users</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border-2 border-green-300 shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-3xl font-bold text-green-800 mb-2">{stats.activeCoaches}</h3>
            <p className="text-gray-700 font-semibold">Active Coaches</p>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border-2 border-orange-300 shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-3xl font-bold text-orange-800 mb-2">{stats.activeStores}</h3>
            <p className="text-gray-700 font-semibold">Active Stores</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border-2 border-purple-300 shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-3xl font-bold text-purple-800 mb-2">{stats.activeDelivery}</h3>
            <p className="text-gray-700 font-semibold">Active Delivery</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Search</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, email, or mobile"
                className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 placeholder-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Role</label>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 bg-white"
              >
                <option value="all">All Roles</option>
                <option value="user">Player</option>
                <option value="coach">Coach</option>
                <option value="seller">Store</option>
                <option value="delivery">Delivery</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 bg-white"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={fetchAllUsers}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 px-4 rounded-lg transition duration-300 shadow-md hover:shadow-lg"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            <p className="mt-4 text-gray-600">Loading users...</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border-2 border-gray-200 shadow-lg overflow-hidden">
            <div className="border-b-2 border-gray-200 px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">User List <span className="text-red-600">({filteredUsers.length})</span></h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">User</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Role</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Join Date</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center shadow-sm">
                              <span className="text-gray-800 font-bold text-lg">{user.name.charAt(0).toUpperCase()}</span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-semibold text-gray-900">{user.name}</div>
                              <div className="text-sm text-gray-600">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full border ${getRoleColor(user.role)}`}>
                            {getRoleLabel(user.role)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full border ${getStatusColor(user.status)}`}>
                            {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">
                          {formatDate(user.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <select
                            value={user.status}
                            onChange={(e) => updateUserStatus(user._id, e.target.value)}
                            className="text-sm border-2 border-gray-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-red-500 focus:border-red-500 font-medium text-gray-900 bg-white"
                          >
                            <option value="pending">Pending</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="suspended">Suspended</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-gray-600 font-medium">
                        No users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
