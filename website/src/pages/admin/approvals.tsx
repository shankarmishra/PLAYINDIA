import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import AdminNav from '../../components/AdminNav';

interface User {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  role: string;
  status: string;
  createdAt: string;
  location?: any;
  preferences?: any;
  roleData?: any; // Coach, Store, or Delivery profile data
  documents?: any; // Documents from role-specific profile
  verification?: any; // Verification data
}

const AdminApprovals = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'coach' | 'seller' | 'delivery'>('coach');
  const [coaches, setCoaches] = useState<User[]>([]);
  const [stores, setStores] = useState<User[]>([]);
  const [deliveries, setDeliveries] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adminInfo, setAdminInfo] = useState<any>(null);
  const [processing, setProcessing] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);

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

    // Fetch pending users on mount
    fetchPendingUsers();

    // Auto-refresh every 30 seconds to show new registrations
    const refreshInterval = setInterval(() => {
      fetchPendingUsers();
    }, 30000);

    return () => clearInterval(refreshInterval);
  }, [router]);

  const fetchPendingUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:5000';
      const adminToken = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;

      if (!adminToken) {
        throw new Error('Admin not authenticated');
      }

      // Helper function to safely parse JSON response
      const parseResponse = async (response: Response) => {
        // Handle non-OK responses gracefully
        if (!response.ok) {
          // Try to parse error message
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
                // Return empty data instead of throwing
                return { data: { users: [] }, success: false, message: errorMessage };
              }
              
              // For other errors, throw but with better message
              throw new Error(errorMessage);
            } else {
              const text = await response.text();
              throw new Error(text || `HTTP error! status: ${response.status}`);
            }
          } catch (parseError: any) {
            // If we can't parse the error, throw a generic one
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
        }).catch(err => {
          console.error(`Error fetching ${url}:`, err);
          return { ok: false, json: async () => ({ data: { users: [] }, success: false }) };
        });
      };

      // Fetch all pending users - use sequential requests with delays to avoid rate limiting
      // First fetch all pending users, then filter by role
      const allPendingRes = await fetchWithDelay(`${backendUrl}/api/users?status=pending&limit=1000`, 0);
      
      // Also try role-specific queries as backup
      const coachesRes = await fetchWithDelay(`${backendUrl}/api/users?role=coach&status=pending`, 500);
      const storesRes1 = await fetchWithDelay(`${backendUrl}/api/users?role=seller&status=pending`, 1000);
      const deliveryRes = await fetchWithDelay(`${backendUrl}/api/users?role=delivery&status=pending`, 1500);

      // Helper function to safely extract users array from response
      const extractUsers = (data: any): any[] => {
        if (!data) return [];
        if (Array.isArray(data)) return data;
        if (data.data) {
          if (Array.isArray(data.data)) return data.data;
          if (data.data.users && Array.isArray(data.data.users)) return data.data.users;
        }
        if (data.users && Array.isArray(data.users)) return data.users;
        return [];
      };

      // Parse responses with error handling
      let coachesData, storesData1, deliveryData, allPendingData;
      
      try {
        allPendingData = await parseResponse(allPendingRes as Response);
      } catch (err: any) {
        console.error('Error parsing all pending data:', err);
        allPendingData = { data: { users: [] }, success: false };
      }

      try {
        coachesData = await parseResponse(coachesRes as Response);
      } catch (err: any) {
        console.error('Error parsing coaches data:', err);
        coachesData = { data: { users: [] }, success: false };
      }

      try {
        storesData1 = await parseResponse(storesRes1 as Response);
      } catch (err: any) {
        console.error('Error parsing stores data (seller):', err);
        storesData1 = { data: { users: [] }, success: false };
      }

      try {
        deliveryData = await parseResponse(deliveryRes as Response);
      } catch (err: any) {
        console.error('Error parsing delivery data:', err);
        deliveryData = { data: { users: [] }, success: false };
      }
      
      // Check if we got permission errors
      const hasPermissionError = 
        (coachesData.message && coachesData.message.includes('permission')) ||
        (storesData1.message && storesData1.message.includes('permission')) ||
        (deliveryData.message && deliveryData.message.includes('permission')) ||
        (allPendingData.message && allPendingData.message.includes('permission'));
      
      if (hasPermissionError) {
        setError('You do not have permission to view user data. Please contact your administrator.');
      }

      // Extract users from all pending first (most reliable)
      const allPending = extractUsers(allPendingData.data || allPendingData);
      
      // Extract from role-specific queries
      let coaches = extractUsers(coachesData.data || coachesData);
      let stores1 = extractUsers(storesData1.data || storesData1);
      let deliveries = extractUsers(deliveryData.data || deliveryData);

      // If allPending has data, use it as primary source and filter by role
      // This ensures we get all stores regardless of how they were registered
      if (allPending.length > 0) {
        coaches = allPending.filter((u: any) => u.role === 'coach');
        const storesFromPending = allPending.filter((u: any) => u.role === 'seller' || u.role === 'store');
        deliveries = allPending.filter((u: any) => u.role === 'delivery');
        
        // Combine stores from both sources and remove duplicates
        const allStoresArray = [...stores1, ...storesFromPending];
        const uniqueStores = allStoresArray.filter((store: any, index: number, self: any[]) => {
          const storeId = store._id?.toString() || store.id?.toString();
          return storeId && index === self.findIndex((s: any) => {
            const sId = s._id?.toString() || s.id?.toString();
            return sId === storeId;
          });
        });
        
        // Log for debugging
        console.log('Fetched stores:', {
          fromPending: storesFromPending.length,
          fromSellerQuery: stores1.length,
          unique: uniqueStores.length,
          allPending: allPending.length
        });
        
        // Use unique stores
        stores1 = uniqueStores;
      } else {
        // If allPending is empty, use role-specific queries
        // Still combine and deduplicate
        const allStoresArray = [...stores1];
        const uniqueStoresFromQuery = allStoresArray.filter((store: any, index: number, self: any[]) => {
          const storeId = store._id?.toString() || store.id?.toString();
          return storeId && index === self.findIndex((s: any) => {
            const sId = s._id?.toString() || s.id?.toString();
            return sId === storeId;
          });
        });
        stores1 = uniqueStoresFromQuery;
      }

      // Final stores array (use stores1 which now contains unique stores)
      const finalStores = stores1;

      // Fetch role-specific data for each user to get documents
      const fetchUserDetails = async (users: any[], role: string) => {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:5000';
        const adminToken = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
        
        return Promise.all(users.map(async (user: any) => {
          try {
            // First, fetch complete user data with location
            try {
              const userRes = await fetch(`${backendUrl}/api/users/${user._id}`, {
                headers: { 'Authorization': `Bearer ${adminToken}` }
              });
              if (userRes.ok) {
                const userData = await userRes.json();
                if (userData.success && userData.data) {
                  // Update user with complete data including location
                  user = { ...user, ...userData.data };
                }
              }
            } catch (err) {
              console.error(`Error fetching user data for ${user._id}:`, err);
            }

            // Fetch role-specific profile data by finding profile with userId
            try {
              let roleData = null;
              
              if (role === 'coach') {
                // Get all coaches and find one with matching userId
                const coachesRes = await fetch(`${backendUrl}/api/coaches`, {
                  headers: { 'Authorization': `Bearer ${adminToken}` }
                });
                if (coachesRes.ok) {
                  const coachesData = await coachesRes.json();
                  if (coachesData.success && coachesData.data && Array.isArray(coachesData.data)) {
                    roleData = coachesData.data.find((c: any) => {
                      const userId = c.userId?._id || c.userId || c.userId?.toString();
                      const userMatchId = user._id || user.id || user._id?.toString();
                      return userId && userMatchId && (userId.toString() === userMatchId.toString());
                    });
                  }
                }
              } else if (role === 'seller' || role === 'store') {
                // Get all stores and find one with matching userId
                const storesRes = await fetch(`${backendUrl}/api/stores`, {
                  headers: { 'Authorization': `Bearer ${adminToken}` }
                });
                if (storesRes.ok) {
                  const storesData = await storesRes.json();
                  if (storesData.success && storesData.data && Array.isArray(storesData.data)) {
                    roleData = storesData.data.find((s: any) => {
                      const userId = s.userId?._id || s.userId || s.userId?.toString();
                      const userMatchId = user._id || user.id || user._id?.toString();
                      return userId && userMatchId && (userId.toString() === userMatchId.toString());
                    });
                  }
                }
              } else if (role === 'delivery') {
                // For delivery, try to get from delivery profile endpoint
                // First try available delivery boys
                const deliveryRes = await fetch(`${backendUrl}/api/delivery/available`, {
                  headers: { 'Authorization': `Bearer ${adminToken}` }
                });
                if (deliveryRes.ok) {
                  const deliveryData = await deliveryRes.json();
                  if (deliveryData.success && deliveryData.data && Array.isArray(deliveryData.data)) {
                    roleData = deliveryData.data.find((d: any) => {
                      const userId = d.userId?._id || d.userId || d.userId?.toString();
                      const userMatchId = user._id || user.id || user._id?.toString();
                      return userId && userMatchId && (userId.toString() === userMatchId.toString());
                    });
                  }
                }
              }
              
              if (roleData) {
                user.roleData = roleData;
                // Extract documents from roleData
                user.documents = roleData.documents || roleData.document || {};
                console.log(`Found roleData for user ${user._id}:`, {
                  hasDocuments: !!user.documents,
                  documentKeys: Object.keys(user.documents || {})
                });
              } else {
                console.log(`No roleData found for user ${user._id} with role ${role}`);
              }
            } catch (err) {
              console.error(`Error fetching role data for user ${user._id}:`, err);
            }
          } catch (err) {
            console.error(`Error fetching details for user ${user._id}:`, err);
          }
          return user;
        }));
      };

      // Fetch details for all users
      const coachesWithDetails = await fetchUserDetails(coaches, 'coach');
      const storesWithDetails = await fetchUserDetails(finalStores, 'seller');
      const deliveriesWithDetails = await fetchUserDetails(deliveries, 'delivery');
      
      setCoaches(Array.isArray(coachesWithDetails) ? coachesWithDetails : []);
      setStores(Array.isArray(storesWithDetails) ? storesWithDetails : []);
      setDeliveries(Array.isArray(deliveriesWithDetails) ? deliveriesWithDetails : []);
      
      // Log for debugging
      console.log('Fetched pending users with details:', {
        coaches: coachesWithDetails.length,
        stores: storesWithDetails.length,
        deliveries: deliveriesWithDetails.length
      });
      
      setError(null);
    } catch (err: any) {
      console.error('Error fetching pending users:', err);
      setError(err.message || 'Failed to load pending approvals. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateUserStatus = async (userId: string, status: 'active' | 'rejected') => {
    try {
      setProcessing(userId);
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:5000';
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

      // Refresh the list
      await fetchPendingUsers();
      
      // Show success message
      const message = `User ${status === 'active' ? 'approved' : 'rejected'} successfully!`;
      alert(message);
      
      // Optionally show a toast notification instead of alert
      if (typeof window !== 'undefined') {
        console.log(message);
      }
    } catch (err: any) {
      console.error('Error updating user status:', err);
      alert(err.message || 'Failed to update user status');
    } finally {
      setProcessing(null);
    }
  };

  const handleApprove = (userId: string) => {
    if (confirm('Are you sure you want to approve this user?')) {
      updateUserStatus(userId, 'active');
    }
  };

  const handleReject = (userId: string) => {
    if (confirm('Are you sure you want to reject this user?')) {
      updateUserStatus(userId, 'rejected');
    }
  };

  const fetchUserFullDetails = async (user: User) => {
    try {
      setLoadingDetails(true);
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:5000';
      const adminToken = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;

      if (!adminToken) {
        throw new Error('Admin not authenticated');
      }

      // Start with user data including any documents/roleData already fetched
      let userDetails = { 
        ...user,
        documents: user.documents || user.roleData?.documents || {},
        roleData: user.roleData || null
      };

      // Fetch user details with location
      const userRes = await fetch(`${backendUrl}/api/users/${user._id}`, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });

      if (userRes.ok) {
        const userData = await userRes.json();
        if (userData.success && userData.data) {
          // Merge user data but preserve existing documents and roleData
          userDetails = { 
            ...userDetails, 
            ...userData.data,
            // Preserve documents if they exist
            documents: userDetails.documents && Object.keys(userDetails.documents).length > 0 
              ? userDetails.documents 
              : (userData.data.documents || {}),
            // Preserve roleData if it exists
            roleData: userDetails.roleData || userData.data.roleData || null
          };
          console.log('User details fetched:', {
            hasLocation: !!userDetails.location,
            location: userDetails.location,
            hasDocuments: !!userDetails.documents,
            documentKeys: Object.keys(userDetails.documents || {})
          });
        }
      }

      // Fetch role-specific data by finding profile with userId
      try {
        let roleData = null;
        
        if (user.role === 'coach') {
          // Try to get coach profile
          const coachesRes = await fetch(`${backendUrl}/api/coaches`, {
            headers: { 'Authorization': `Bearer ${adminToken}` }
          });
          if (coachesRes.ok) {
            const coachesData = await coachesRes.json();
            if (coachesData.success && coachesData.data && Array.isArray(coachesData.data)) {
              roleData = coachesData.data.find((c: any) => {
                const userId = c.userId?._id || c.userId || c.userId?.toString();
                const userMatchId = user._id || user.id || user._id?.toString();
                return userId && userMatchId && (userId.toString() === userMatchId.toString());
              });
            }
          }
        } else if (user.role === 'seller' || user.role === 'store') {
          // For stores, try multiple approaches
          // First try getting all stores
          const storesRes = await fetch(`${backendUrl}/api/stores`, {
            headers: { 'Authorization': `Bearer ${adminToken}` }
          });
          if (storesRes.ok) {
            const storesData = await storesRes.json();
            if (storesData.success && storesData.data && Array.isArray(storesData.data)) {
              roleData = storesData.data.find((s: any) => {
                const userId = s.userId?._id || s.userId || s.userId?.toString();
                const userMatchId = user._id || user.id || user._id?.toString();
                return userId && userMatchId && (userId.toString() === userMatchId.toString());
              });
            }
          }
          
          // If not found, try to get from user's roleData if already loaded
          if (!roleData && user.roleData) {
            roleData = user.roleData;
          }
        } else if (user.role === 'delivery') {
          // Try available delivery endpoint
          const deliveryRes = await fetch(`${backendUrl}/api/delivery/available`, {
            headers: { 'Authorization': `Bearer ${adminToken}` }
          });
          if (deliveryRes.ok) {
            const deliveryData = await deliveryRes.json();
            if (deliveryData.success && deliveryData.data && Array.isArray(deliveryData.data)) {
              roleData = deliveryData.data.find((d: any) => {
                const userId = d.userId?._id || d.userId || d.userId?.toString();
                const userMatchId = user._id || user.id || user._id?.toString();
                return userId && userMatchId && (userId.toString() === userMatchId.toString());
              });
            }
          }
          
          // If not found, try to get from user's roleData if already loaded
          if (!roleData && user.roleData) {
            roleData = user.roleData;
          }
        }
        
        // If still no roleData, check if user already has it from initial fetch
        if (!roleData && user.roleData) {
          roleData = user.roleData;
        }
        
        if (roleData) {
          userDetails.roleData = roleData;
          // Extract documents - merge from multiple possible locations
          const roleDocuments = roleData.documents || roleData.document || {};
          const userDocuments = userDetails.documents || user.documents || {};
          
          // Merge documents, prioritizing roleData documents
          userDetails.documents = {
            ...userDocuments,
            ...roleDocuments,
            // For store documents, ensure proper structure
            ...(roleData.documents?.gstCertificate && {
              gstCertificate: roleData.documents.gstCertificate
            }),
            ...(roleData.documents?.shopLicense && {
              shopLicense: roleData.documents.shopLicense
            }),
            ...(roleData.documents?.ownerID && {
              ownerID: roleData.documents.ownerID
            }),
            // Merge additionalDocs arrays
            additionalDocs: [
              ...(userDocuments.additionalDocs || []),
              ...(roleDocuments.additionalDocs || [])
            ].filter((doc, index, self) => 
              doc && self.findIndex(d => d === doc) === index
            )
          };
          
          // Log for debugging
          console.log('Role data found:', {
            role: user.role,
            hasRoleData: !!roleData,
            hasDocuments: !!userDetails.documents,
            documentKeys: Object.keys(userDetails.documents || {}),
            roleDataKeys: Object.keys(roleData),
            documentsStructure: userDetails.documents,
            gstCertificate: userDetails.documents?.gstCertificate,
            shopLicense: userDetails.documents?.shopLicense,
            ownerID: userDetails.documents?.ownerID
          });
          
          // Also check if documents exist in nested structure
          if (!userDetails.documents || Object.keys(userDetails.documents).length === 0) {
            // Try to find documents in different nested structures
            if (roleData.documents) {
              userDetails.documents = roleData.documents;
            } else if (roleData.data?.documents) {
              userDetails.documents = roleData.data.documents;
            }
          }
        } else {
          // If no roleData found, try to use documents from user object
          if (user.documents) {
            userDetails.documents = user.documents;
          }
          console.log('No roleData found for user:', user._id, 'role:', user.role, 'user has documents:', !!user.documents);
        }
      } catch (err) {
        console.error('Error fetching role data:', err);
        // Fallback: use documents from user object if available
        if (user.documents) {
          userDetails.documents = user.documents;
        }
      }

      setSelectedUser(userDetails);
      setShowDetailsModal(true);
    } catch (err: any) {
      console.error('Error fetching user details:', err);
      alert('Failed to load user details: ' + (err.message || 'Unknown error'));
    } finally {
      setLoadingDetails(false);
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

  const currentUsers = activeTab === 'coach' ? coaches : activeTab === 'seller' ? stores : deliveries;
  const counts = {
    coach: coaches.length,
    seller: stores.length,
    delivery: deliveries.length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Admin Approvals - TeamUp India</title>
        <meta name="description" content="Admin approval management for TeamUp India platform" />
      </Head>

      <AdminNav adminInfo={adminInfo} />

      <div className="max-w-7xl mx-auto py-8 px-6">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Approvals Management</h1>
            <p className="text-gray-600">Review and approve new registrations</p>
          </div>
          <button
            onClick={fetchPendingUsers}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <svg className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>{loading ? 'Refreshing...' : 'Refresh'}</span>
          </button>
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
                onClick={fetchPendingUsers} 
                className="ml-4 text-red-800 hover:text-red-900 font-semibold underline text-sm"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Approval Tabs */}
        <div className="bg-white rounded-xl border-2 border-gray-200 shadow-md mb-6 p-4">
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setActiveTab('coach')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'coach'
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="flex items-center space-x-2">
                <span>Coaches</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  activeTab === 'coach' ? 'bg-white text-green-600' : 'bg-green-100 text-green-800'
                }`}>
                  {counts.coach}
                </span>
              </span>
            </button>
            <button
              onClick={() => setActiveTab('seller')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'seller'
                  ? 'bg-orange-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="flex items-center space-x-2">
                <span>Stores</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  activeTab === 'seller' ? 'bg-white text-orange-600' : 'bg-orange-100 text-orange-800'
                }`}>
                  {counts.seller}
                </span>
              </span>
            </button>
            <button
              onClick={() => setActiveTab('delivery')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'delivery'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="flex items-center space-x-2">
                <span>Delivery</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  activeTab === 'delivery' ? 'bg-white text-purple-600' : 'bg-purple-100 text-purple-800'
                }`}>
                  {counts.delivery}
                </span>
              </span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            <p className="mt-4 text-gray-600">Loading pending approvals...</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    {activeTab === 'coach' ? 'Coach' : activeTab === 'seller' ? 'Store' : 'Delivery Partner'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Registered</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentUsers.length > 0 ? (
                  currentUsers.map((user) => (
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
                        <div className="text-sm font-medium text-gray-900">{user.mobile}</div>
                        <div className="text-sm text-gray-600">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">
                        {user.location?.city ? `${user.location.city}${user.location.state ? ', ' + user.location.state : ''}` : 
                         user.location?.address || 
                         user.location?.state || 
                         user.roleData?.address?.city ? `${user.roleData.address.city}${user.roleData.address.state ? ', ' + user.roleData.address.state : ''}` :
                         'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">
                        {getTimeAgo(new Date(user.createdAt))}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full bg-yellow-100 text-yellow-900 border border-yellow-300">
                          Pending
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex flex-col space-y-2">
                          <button
                            onClick={() => fetchUserFullDetails(user)}
                            disabled={loadingDetails}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-1.5 rounded-lg transition-colors shadow-sm text-xs flex items-center justify-center space-x-1"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            <span>{loadingDetails ? 'Loading...' : 'View Details'}</span>
                          </button>
                          {processing === user._id ? (
                            <span className="text-gray-600 font-semibold text-xs text-center">Processing...</span>
                          ) : (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleApprove(user._id)}
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold px-3 py-1.5 rounded-lg transition-colors shadow-sm text-xs"
                              >
                                ✓ Approve
                              </button>
                              <button
                                onClick={() => handleReject(user._id)}
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold px-3 py-1.5 rounded-lg transition-colors shadow-sm text-xs"
                              >
                                ✗ Reject
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="text-6xl mb-4">📋</div>
                        <p className="text-gray-600 font-semibold text-lg mb-2">
                          No pending {activeTab === 'coach' ? 'coaches' : activeTab === 'seller' ? 'stores' : 'delivery partners'}
                        </p>
                        <p className="text-gray-500 text-sm">
                          All {activeTab === 'coach' ? 'coaches' : activeTab === 'seller' ? 'stores' : 'delivery partners'} have been reviewed.
                        </p>
                        <button
                          onClick={fetchPendingUsers}
                          className="mt-4 bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors"
                        >
                          Refresh to Check for New Registrations
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* User Details Modal */}
      {showDetailsModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={() => setShowDetailsModal(false)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-gray-900 text-white px-6 py-4 flex justify-between items-center rounded-t-xl">
              <h2 className="text-2xl font-bold">User Details & Documents</h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-white hover:text-red-400 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              {/* Basic Information */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 font-semibold">Name</p>
                    <p className="text-gray-900 font-medium">{selectedUser.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-semibold">Email</p>
                    <p className="text-gray-900 font-medium">{selectedUser.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-semibold">Mobile</p>
                    <p className="text-gray-900 font-medium">{selectedUser.mobile}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-semibold">Role</p>
                    <p className="text-gray-900 font-medium">{getRoleLabel(selectedUser.role)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-semibold">Status</p>
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full bg-yellow-100 text-yellow-900 border border-yellow-300`}>
                      {selectedUser.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-semibold">Registered On</p>
                    <p className="text-gray-900 font-medium">
                      {new Date(selectedUser.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  {(selectedUser.location || selectedUser.roleData?.address) && (
                    <>
                      {selectedUser.location?.address && (
                        <div className="md:col-span-2">
                          <p className="text-sm text-gray-600 font-semibold">Full Address</p>
                          <p className="text-gray-900 font-medium">{selectedUser.location.address}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-sm text-gray-600 font-semibold">City</p>
                        <p className="text-gray-900 font-medium">{selectedUser.location?.city || selectedUser.roleData?.address?.city || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-semibold">State</p>
                        <p className="text-gray-900 font-medium">{selectedUser.location?.state || selectedUser.roleData?.address?.state || 'N/A'}</p>
                      </div>
                      {selectedUser.location?.coordinates && (
                        <div>
                          <p className="text-sm text-gray-600 font-semibold">Coordinates</p>
                          <p className="text-gray-900 font-medium text-xs">
                            {selectedUser.location.coordinates[1]?.toFixed(4)}, {selectedUser.location.coordinates[0]?.toFixed(4)}
                          </p>
                        </div>
                      )}
                      {selectedUser.roleData?.address?.pincode && (
                        <div>
                          <p className="text-sm text-gray-600 font-semibold">Pincode</p>
                          <p className="text-gray-900 font-medium">{selectedUser.roleData.address.pincode}</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Role-Specific Information */}
              {selectedUser.roleData && (
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">
                    {selectedUser.role === 'coach' ? 'Coach' : selectedUser.role === 'seller' || selectedUser.role === 'store' ? 'Store' : 'Delivery'} Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedUser.role === 'coach' && selectedUser.roleData && (
                      <>
                        {selectedUser.roleData.experience && (
                          <div>
                            <p className="text-sm text-gray-600 font-semibold">Experience</p>
                            <p className="text-gray-900 font-medium">{selectedUser.roleData.experience.years || 0} years</p>
                          </div>
                        )}
                        {selectedUser.roleData.sports && selectedUser.roleData.sports.length > 0 && (
                          <div>
                            <p className="text-sm text-gray-600 font-semibold">Sports</p>
                            <p className="text-gray-900 font-medium">{Array.isArray(selectedUser.roleData.sports) ? selectedUser.roleData.sports.join(', ') : selectedUser.roleData.sports}</p>
                          </div>
                        )}
                        {selectedUser.roleData.specialization && (
                          <div>
                            <p className="text-sm text-gray-600 font-semibold">Specialization</p>
                            <p className="text-gray-900 font-medium">{selectedUser.roleData.specialization}</p>
                          </div>
                        )}
                        {selectedUser.roleData.coachingFees && (
                          <div>
                            <p className="text-sm text-gray-600 font-semibold">Coaching Fees</p>
                            <p className="text-gray-900 font-medium">
                              {selectedUser.roleData.coachingFees.perSession ? `₹${selectedUser.roleData.coachingFees.perSession}/session` : ''}
                              {selectedUser.roleData.coachingFees.perMonth ? ` ₹${selectedUser.roleData.coachingFees.perMonth}/month` : ''}
                            </p>
                          </div>
                        )}
                      </>
                    )}
                    {(selectedUser.role === 'seller' || selectedUser.role === 'store') && selectedUser.roleData && (
                      <>
                        {selectedUser.roleData.storeName && (
                          <div>
                            <p className="text-sm text-gray-600 font-semibold">Store Name</p>
                            <p className="text-gray-900 font-medium">{selectedUser.roleData.storeName}</p>
                          </div>
                        )}
                        {selectedUser.roleData.ownerName && (
                          <div>
                            <p className="text-sm text-gray-600 font-semibold">Owner Name</p>
                            <p className="text-gray-900 font-medium">{selectedUser.roleData.ownerName}</p>
                          </div>
                        )}
                        {selectedUser.roleData.category && (
                          <div>
                            <p className="text-sm text-gray-600 font-semibold">Category</p>
                            <p className="text-gray-900 font-medium">{selectedUser.roleData.category}</p>
                          </div>
                        )}
                        {selectedUser.roleData.gst && selectedUser.roleData.gst.number && (
                          <div>
                            <p className="text-sm text-gray-600 font-semibold">GST Number</p>
                            <p className="text-gray-900 font-medium">{selectedUser.roleData.gst.number}</p>
                          </div>
                        )}
                        {selectedUser.roleData.address && (
                          <div className="md:col-span-2">
                            <p className="text-sm text-gray-600 font-semibold">Address</p>
                            <p className="text-gray-900 font-medium">
                              {selectedUser.roleData.address.street || ''} {selectedUser.roleData.address.city || ''} {selectedUser.roleData.address.state || ''} {selectedUser.roleData.address.pincode || ''}
                            </p>
                          </div>
                        )}
                      </>
                    )}
                    {selectedUser.role === 'delivery' && selectedUser.roleData && (
                      <>
                        {selectedUser.roleData.vehicle && (
                          <>
                            <div>
                              <p className="text-sm text-gray-600 font-semibold">Vehicle Type</p>
                              <p className="text-gray-900 font-medium">{selectedUser.roleData.vehicle.type || 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600 font-semibold">Vehicle Number</p>
                              <p className="text-gray-900 font-medium">{selectedUser.roleData.vehicle.number || 'N/A'}</p>
                            </div>
                            {selectedUser.roleData.vehicle.licenseNumber && (
                              <div>
                                <p className="text-sm text-gray-600 font-semibold">License Number</p>
                                <p className="text-gray-900 font-medium">{selectedUser.roleData.vehicle.licenseNumber}</p>
                              </div>
                            )}
                          </>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Documents Section */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">Documents</h3>
                {(() => {
                  // Check if documents exist in multiple possible locations
                  const docs = selectedUser.documents || selectedUser.roleData?.documents || {};
                  
                  // Debug logging
                  console.log('Checking documents for display:', {
                    hasSelectedUserDocuments: !!selectedUser.documents,
                    hasRoleDataDocuments: !!selectedUser.roleData?.documents,
                    documentKeys: Object.keys(docs || {}),
                    fullDocs: docs
                  });
                  
                  const hasDocuments = docs && Object.keys(docs).length > 0 && 
                    (docs.aadhaar || docs.pan || docs.gstCertificate || docs.shopLicense || 
                     docs.ownerID || docs.drivingLicense || docs.vehicleRC || docs.insurance ||
                     (docs.additionalDocs && Array.isArray(docs.additionalDocs) && docs.additionalDocs.length > 0));
                  
                  return hasDocuments ? (
                    <div className="space-y-4">
                    {/* Aadhaar Documents */}
                    {(() => {
                      const docs = selectedUser.documents || selectedUser.roleData?.documents || {};
                      const aadhaar = docs.aadhaar;
                      return aadhaar && (aadhaar.front || aadhaar.back) && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-gray-900 mb-3">Aadhaar Card</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {aadhaar.front && (
                              <div>
                                <p className="text-sm text-gray-600 font-semibold mb-2">Front</p>
                                <a href={aadhaar.front} target="_blank" rel="noopener noreferrer" className="block">
                                  <img src={aadhaar.front} alt="Aadhaar Front" className="w-full h-48 object-cover rounded-lg border-2 border-gray-300 hover:border-blue-500 transition-colors cursor-pointer" onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder-image.png'; }} />
                                </a>
                              </div>
                            )}
                            {aadhaar.back && (
                              <div>
                                <p className="text-sm text-gray-600 font-semibold mb-2">Back</p>
                                <a href={aadhaar.back} target="_blank" rel="noopener noreferrer" className="block">
                                  <img src={aadhaar.back} alt="Aadhaar Back" className="w-full h-48 object-cover rounded-lg border-2 border-gray-300 hover:border-blue-500 transition-colors cursor-pointer" onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder-image.png'; }} />
                                </a>
                              </div>
                            )}
                          </div>
                          {aadhaar.verified !== undefined && (
                            <p className="text-sm mt-2">
                              <span className="font-semibold">Verified:</span> 
                              <span className={aadhaar.verified ? 'text-green-600 font-bold ml-1' : 'text-red-600 font-bold ml-1'}>
                                {aadhaar.verified ? 'Yes ✓' : 'No ✗'}
                              </span>
                            </p>
                          )}
                        </div>
                      );
                    })()}

                    {/* PAN Document */}
                    {(() => {
                      const docs = selectedUser.documents || selectedUser.roleData?.documents || {};
                      const pan = docs.pan;
                      return pan && pan.file && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-gray-900 mb-3">PAN Card</h4>
                          <a href={pan.file} target="_blank" rel="noopener noreferrer" className="block">
                            <img src={pan.file} alt="PAN Card" className="w-full max-w-md h-64 object-contain rounded-lg border-2 border-gray-300 hover:border-blue-500 transition-colors cursor-pointer bg-white" onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder-image.png'; }} />
                          </a>
                          {pan.verified !== undefined && (
                            <p className="text-sm mt-2">
                              <span className="font-semibold">Verified:</span> 
                              <span className={pan.verified ? 'text-green-600 font-bold ml-1' : 'text-red-600 font-bold ml-1'}>
                                {pan.verified ? 'Yes ✓' : 'No ✗'}
                              </span>
                            </p>
                          )}
                        </div>
                      );
                    })()}

                    {/* Store Documents */}
                    {(() => {
                      const docs = selectedUser.documents || selectedUser.roleData?.documents || {};
                      const isStore = selectedUser.role === 'seller' || selectedUser.role === 'store';
                      return isStore && (
                        <>
                          {docs.gstCertificate && docs.gstCertificate.file && (
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <h4 className="font-semibold text-gray-900 mb-3">GST Certificate</h4>
                              <a href={docs.gstCertificate.file} target="_blank" rel="noopener noreferrer" className="block">
                                <img src={docs.gstCertificate.file} alt="GST Certificate" className="w-full max-w-md h-64 object-contain rounded-lg border-2 border-gray-300 hover:border-blue-500 transition-colors cursor-pointer bg-white" onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder-image.png'; }} />
                              </a>
                            </div>
                          )}
                          {docs.shopLicense && docs.shopLicense.file && (
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <h4 className="font-semibold text-gray-900 mb-3">Shop License</h4>
                              <a href={docs.shopLicense.file} target="_blank" rel="noopener noreferrer" className="block">
                                <img src={docs.shopLicense.file} alt="Shop License" className="w-full max-w-md h-64 object-contain rounded-lg border-2 border-gray-300 hover:border-blue-500 transition-colors cursor-pointer bg-white" onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder-image.png'; }} />
                              </a>
                            </div>
                          )}
                          {docs.ownerID && (docs.ownerID.front || docs.ownerID.back) && (
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <h4 className="font-semibold text-gray-900 mb-3">Owner ID</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {docs.ownerID.front && (
                                  <div>
                                    <p className="text-sm text-gray-600 font-semibold mb-2">Front</p>
                                    <a href={docs.ownerID.front} target="_blank" rel="noopener noreferrer" className="block">
                                      <img src={docs.ownerID.front} alt="Owner ID Front" className="w-full h-48 object-cover rounded-lg border-2 border-gray-300 hover:border-blue-500 transition-colors cursor-pointer" onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder-image.png'; }} />
                                    </a>
                                  </div>
                                )}
                                {docs.ownerID.back && (
                                  <div>
                                    <p className="text-sm text-gray-600 font-semibold mb-2">Back</p>
                                    <a href={docs.ownerID.back} target="_blank" rel="noopener noreferrer" className="block">
                                      <img src={docs.ownerID.back} alt="Owner ID Back" className="w-full h-48 object-cover rounded-lg border-2 border-gray-300 hover:border-blue-500 transition-colors cursor-pointer" onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder-image.png'; }} />
                                    </a>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                          {/* Additional Documents (Bank Passbook, Store Photo, etc.) */}
                          {docs.additionalDocs && Array.isArray(docs.additionalDocs) && docs.additionalDocs.length > 0 && (
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <h4 className="font-semibold text-gray-900 mb-3">Additional Documents</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {docs.additionalDocs.map((docUrl: string, index: number) => (
                                  <div key={index}>
                                    <p className="text-sm text-gray-600 font-semibold mb-2">Document {index + 1}</p>
                                    <a href={docUrl} target="_blank" rel="noopener noreferrer" className="block">
                                      <img src={docUrl} alt={`Additional Document ${index + 1}`} className="w-full h-48 object-contain rounded-lg border-2 border-gray-300 hover:border-blue-500 transition-colors cursor-pointer bg-white" onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder-image.png'; }} />
                                    </a>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </>
                      );
                    })()}

                    {/* Delivery Documents */}
                    {(() => {
                      const docs = selectedUser.documents || selectedUser.roleData?.documents || {};
                      return selectedUser.role === 'delivery' && (
                        <>
                          {docs.drivingLicense && docs.drivingLicense.file && (
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <h4 className="font-semibold text-gray-900 mb-3">Driving License</h4>
                              <a href={docs.drivingLicense.file} target="_blank" rel="noopener noreferrer" className="block">
                                <img src={docs.drivingLicense.file} alt="Driving License" className="w-full max-w-md h-64 object-contain rounded-lg border-2 border-gray-300 hover:border-blue-500 transition-colors cursor-pointer bg-white" onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder-image.png'; }} />
                              </a>
                              {docs.drivingLicense.number && (
                                <p className="text-sm mt-2">
                                  <span className="font-semibold">License Number:</span> {docs.drivingLicense.number}
                                </p>
                              )}
                            </div>
                          )}
                          {docs.vehicleRC && docs.vehicleRC.file && (
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <h4 className="font-semibold text-gray-900 mb-3">Vehicle RC</h4>
                              <a href={docs.vehicleRC.file} target="_blank" rel="noopener noreferrer" className="block">
                                <img src={docs.vehicleRC.file} alt="Vehicle RC" className="w-full max-w-md h-64 object-contain rounded-lg border-2 border-gray-300 hover:border-blue-500 transition-colors cursor-pointer bg-white" onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder-image.png'; }} />
                              </a>
                            </div>
                          )}
                          {docs.insurance && docs.insurance.file && (
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <h4 className="font-semibold text-gray-900 mb-3">Insurance</h4>
                              <a href={docs.insurance.file} target="_blank" rel="noopener noreferrer" className="block">
                                <img src={docs.insurance.file} alt="Insurance" className="w-full max-w-md h-64 object-contain rounded-lg border-2 border-gray-300 hover:border-blue-500 transition-colors cursor-pointer bg-white" onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder-image.png'; }} />
                              </a>
                            </div>
                          )}
                        </>
                      );
                    })()}

                    {/* Additional Documents */}
                    {(() => {
                      const docs = selectedUser.documents || selectedUser.roleData?.documents || {};
                      return docs.additionalDocs && Array.isArray(docs.additionalDocs) && docs.additionalDocs.length > 0 && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-gray-900 mb-3">Additional Documents</h4>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {docs.additionalDocs.map((doc: string, index: number) => (
                              <a key={index} href={doc} target="_blank" rel="noopener noreferrer" className="block">
                                <img src={doc} alt={`Additional Doc ${index + 1}`} className="w-full h-32 object-cover rounded-lg border-2 border-gray-300 hover:border-blue-500 transition-colors cursor-pointer" onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder-image.png'; }} />
                              </a>
                            ))}
                          </div>
                        </div>
                      );
                    })()}
                    </div>
                  ) : (
                    <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                      <p className="text-yellow-800 font-medium">No documents uploaded yet.</p>
                      <p className="text-yellow-700 text-sm mt-1">Documents will appear here once the user uploads them during registration.</p>
                    </div>
                  );
                })()}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 pt-4 border-t-2 border-gray-200">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    handleReject(selectedUser._id);
                  }}
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors shadow-md"
                >
                  Reject
                </button>
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    handleApprove(selectedUser._id);
                  }}
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors shadow-md"
                >
                  Approve
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const getRoleLabel = (role: string) => {
  const labels: any = {
    user: 'Player',
    coach: 'Coach',
    seller: 'Store',
    store: 'Store',
    delivery: 'Delivery Partner',
    admin: 'Admin'
  };
  return labels[role] || role;
};

export default AdminApprovals;
