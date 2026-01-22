import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ApiService } from '../../utils/api';
import StoreLayout from '../../components/StoreLayout';
import StoreErrorDisplay from '../../components/StoreErrorDisplay';

const StoreProfilePage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [storeProfile, setStoreProfile] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (!hasFetchedRef.current) {
      hasFetchedRef.current = true;
      loadProfile();
    }
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = typeof window !== 'undefined' ? localStorage.getItem('userToken') : null;
      if (!token) {
        router.push('/login');
        return;
      }

      const response: any = await Promise.race([
        ApiService.stores.getProfile(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), 15000)
        )
      ]) as any;

      if (response.data?.success) {
        setStoreProfile(response.data.data);
      }
    } catch (err: any) {
      // Check if error should be suppressed
      if (!err.suppressLog && !err.isNotFound && err.message !== 'Request timeout') {
        console.error('Error loading profile:', err);
      }
      
      // Check for "not found" errors
      const errorMessage = err.response?.data?.message || err.message || '';
      const isNotFound = err.isNotFound || 
                        err.response?.status === 404 || 
                        errorMessage.toLowerCase().includes('not found') ||
                        errorMessage.toLowerCase().includes('store profile not found');
      
      if (isNotFound) {
        err.isHandled = true;
        setLoading(false);
        router.replace('/store/register');
        return;
      }
      
      setError(err.response?.data?.message || err.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <StoreLayout title="Store Profile - TeamUp India" description="View your store profile">
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mb-4"></div>
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>
      </StoreLayout>
    );
  }

  return (
    <StoreLayout title="Store Profile - TeamUp India" description="View your store profile">
      <div className="max-w-4xl mx-auto py-8 px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Store Profile</h1>
          <p className="text-gray-600">View your store information and statistics</p>
        </div>

        {error && (
          <div className="mb-6">
            <StoreErrorDisplay 
              error={error}
              onRetry={() => {
                setError(null);
                hasFetchedRef.current = false;
                loadProfile();
              }}
            />
          </div>
        )}

        {storeProfile && (
          <div className="space-y-6">
            {/* Status Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {storeProfile.storeName || 'Store Name'}
                  </h2>
                  <p className="text-gray-600">{storeProfile.ownerName || 'Owner Name'}</p>
                </div>
                <div className="flex gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    storeProfile.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : storeProfile.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {storeProfile.status?.toUpperCase() || 'PENDING'}
                  </span>
                  {storeProfile.verified && (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                      Verified ✓
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Statistics */}
            {storeProfile.stats && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Orders</h3>
                  <p className="text-3xl font-bold text-blue-600">
                    {storeProfile.stats.totalOrders || 0}
                  </p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Revenue</h3>
                  <p className="text-3xl font-bold text-green-600">
                    ₹{storeProfile.stats.totalRevenue?.toLocaleString() || '0'}
                  </p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Average Rating</h3>
                  <p className="text-3xl font-bold text-yellow-600">
                    {storeProfile.stats.averageRating?.toFixed(1) || '0.0'}
                  </p>
                </div>
              </div>
            )}

            {/* Store Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Store Information</h2>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Store Name:</span>
                  <span className="font-medium">{storeProfile.storeName || 'N/A'}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Owner Name:</span>
                  <span className="font-medium">{storeProfile.ownerName || 'N/A'}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">GST Number:</span>
                  <span className="font-medium">{storeProfile.gst?.number || 'Not provided'}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-medium">{storeProfile.category || 'N/A'}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium">{storeProfile.userId?.email || 'N/A'}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Phone:</span>
                  <span className="font-medium">
                    {storeProfile.contact?.phone || storeProfile.userId?.mobile || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Address:</span>
                  <span className="font-medium text-right">
                    {storeProfile.address?.street
                      ? `${storeProfile.address.street}, ${storeProfile.address.city || ''}, ${storeProfile.address.state || ''} - ${storeProfile.address.pincode || ''}`
                      : 'Not provided'}
                  </span>
                </div>
              </div>
            </div>

            {/* Top Products */}
            {storeProfile.products && storeProfile.products.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Top Products</h2>
                <div className="space-y-2">
                  {storeProfile.products.slice(0, 5).map((product: any, index: number) => (
                    <div key={product._id || index} className="flex justify-between py-2 border-b">
                      <span className="text-gray-700">{product.name}</span>
                      <span className="text-gray-600">
                        Stock: {product.inventory?.quantity || 0} | 
                        Price: ₹{product.price?.selling?.toLocaleString() || '0'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-4">
              <Link
                href="/store/settings"
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg font-semibold text-center transition duration-300"
              >
                Edit Profile
              </Link>
              <Link
                href="/store/products"
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-semibold text-center transition duration-300"
              >
                Manage Products
              </Link>
            </div>
          </div>
        )}
      </div>
    </StoreLayout>
  );
};

export default StoreProfilePage;
