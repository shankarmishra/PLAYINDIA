import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import AdminNav from '../../components/AdminNav';
import axios from 'axios';
import { BACKEND_API_URL } from '../../config/constants';

interface ShopAnalytics {
  overview: {
    totalStores: number;
    totalProducts: number;
    totalOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
  };
  storeAnalytics: Array<{
    _id: string;
    storeName: string;
    storeEmail: string;
    createdAt: string;
    totalProducts: number;
    totalOrders: number;
    totalRevenue: number;
    lastProductAdded: string;
  }>;
  productAnalytics: Array<{
    _id: string;
    name: string;
    category: string;
    price: { selling: number };
    inventory: { quantity: number; totalSold: number };
    ratings: { average: number };
    createdAt: string;
    storeName: string;
  }>;
  orderStatusBreakdown: Array<{
    _id: string;
    count: number;
    totalAmount: number;
  }>;
  revenueByDate: Array<{
    _id: string;
    revenue: number;
    orders: number;
  }>;
  topSellingProducts: Array<{
    _id: string;
    name: string;
    category: string;
    inventory: { totalSold: number };
    revenue: number;
    storeId: { storeName: string };
  }>;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

const AdminShopPage = () => {
  const router = useRouter();
  const [analytics, setAnalytics] = useState<ShopAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedStore, setSelectedStore] = useState<string>('');
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });
  const [showModal, setShowModal] = useState(false);
  const [selectedStoreDetails, setSelectedStoreDetails] = useState<any>(null);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  const API_BASE = BACKEND_API_URL;

  useEffect(() => {
    loadAnalytics();
  }, [selectedStore, dateRange]);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const showToast = (type: 'success' | 'error' | 'info', message: string) => {
    setToastMessage({ type, message });
  };

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const params: any = {};
      if (selectedStore) params.storeId = selectedStore;
      if (dateRange.startDate) params.startDate = dateRange.startDate;
      if (dateRange.endDate) params.endDate = dateRange.endDate;

      const response = await axios.get<ApiResponse<ShopAnalytics>>(`${API_BASE}/api/admin/shop/analytics`, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });

      if (response.data.success) {
        setAnalytics(response.data.data);
      }
    } catch (error: any) {
      showToast('error', error.response?.data?.message || 'Failed to load shop analytics');
    } finally {
      setLoading(false);
    }
  };

  const viewStoreDetails = async (storeId: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get<ApiResponse<any>>(`${API_BASE}/api/admin/shop/stores/${storeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setSelectedStoreDetails(response.data.data);
        setShowModal(true);
      }
    } catch (error: any) {
      showToast('error', 'Failed to load store details');
    }
  };

  const exportData = () => {
    showToast('info', 'Export functionality coming soon');
  };

  if (loading) {
    return (
      <>
        <Head>
          <title>Shop Management - Admin</title>
        </Head>
        <AdminNav />
        <div className="p-8">
          <p className="text-gray-600">Loading shop analytics...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Shop Management - Admin</title>
      </Head>
      <AdminNav />
      <div className="p-8">
        {/* Toast Notification */}
        {toastMessage && (
          <div
            className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
              toastMessage.type === 'error'
                ? 'bg-red-500 text-white'
                : toastMessage.type === 'success'
                ? 'bg-green-500 text-white'
                : 'bg-blue-500 text-white'
            }`}
          >
            {toastMessage.message}
          </div>
        )}

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Shop Management & Analytics</h1>
          <button
            onClick={exportData}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export Data
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg mb-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              placeholder="Start Date"
              type="date"
              value={dateRange.startDate}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDateRange({ ...dateRange, startDate: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              placeholder="End Date"
              type="date"
              value={dateRange.endDate}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDateRange({ ...dateRange, endDate: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={selectedStore}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedStore(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Stores</option>
              {analytics?.storeAnalytics.map((store) => (
                <option key={store._id} value={store._id}>
                  {store.storeName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-sm text-gray-600 mb-2">Total Stores</p>
            <p className="text-2xl font-bold text-gray-900">{analytics?.overview.totalStores || 0}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-sm text-gray-600 mb-2">Total Products</p>
            <p className="text-2xl font-bold text-gray-900">{analytics?.overview.totalProducts || 0}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-sm text-gray-600 mb-2">Total Orders</p>
            <p className="text-2xl font-bold text-gray-900">{analytics?.overview.totalOrders || 0}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-sm text-gray-600 mb-2">Total Revenue</p>
            <p className="text-2xl font-bold text-gray-900">₹{analytics?.overview.totalRevenue?.toLocaleString() || 0}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-sm text-gray-600 mb-2">Avg Order Value</p>
            <p className="text-2xl font-bold text-gray-900">₹{Math.round(analytics?.overview.averageOrderValue || 0).toLocaleString()}</p>
          </div>
        </div>

        {/* Store Analytics Table */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Store Analytics</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Store Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Products</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Product Added</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {analytics?.storeAnalytics.map((store) => (
                  <tr key={store._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{store.storeName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">{store.storeEmail}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-gray-900">{store.totalProducts}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-gray-900">{store.totalOrders}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-gray-900">₹{store.totalRevenue?.toLocaleString() || 0}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      {store.lastProductAdded ? new Date(store.lastProductAdded).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => viewStoreDetails(store._id)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        aria-label="View Details"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Top Selling Products</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Store</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Units Sold</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {analytics?.topSellingProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{product.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">{product.category}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">{product.storeId?.storeName || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-gray-900">{product.inventory?.totalSold || 0}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-gray-900">₹{product.revenue?.toLocaleString() || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Status Breakdown */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Order Status Breakdown</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {analytics?.orderStatusBreakdown.map((status) => (
              <div key={status._id} className="p-4 border border-gray-200 rounded-lg">
                <p className="font-bold text-gray-900 mb-2">{status._id.toUpperCase()}</p>
                <p className="text-2xl font-bold text-green-600">{status.count}</p>
                <p className="text-sm text-gray-600">₹{status.totalAmount.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Store Details Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={() => setShowModal(false)}>
            <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">Store Details</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-6">
                {selectedStoreDetails && (
                  <div>
                    <p className="font-bold text-gray-900 mb-2">Store Information</p>
                    <p className="text-gray-700">Name: {selectedStoreDetails.store.storeName}</p>
                    <p className="text-gray-700">Email: {selectedStoreDetails.store.storeEmail}</p>
                    <p className="text-gray-700 mb-4">
                      Created: {new Date(selectedStoreDetails.store.createdAt).toLocaleDateString()}
                    </p>

                    <p className="font-bold text-gray-900 mb-2">Statistics</p>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Total Products</p>
                        <p className="text-xl font-bold">{selectedStoreDetails.stats.totalProducts}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Active Products</p>
                        <p className="text-xl font-bold">{selectedStoreDetails.stats.activeProducts}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Total Orders</p>
                        <p className="text-xl font-bold">{selectedStoreDetails.stats.totalOrders}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Total Revenue</p>
                        <p className="text-xl font-bold text-green-600">
                          ₹{selectedStoreDetails.stats.totalRevenue.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <p className="font-bold text-gray-900 mb-2">Recent Products ({selectedStoreDetails.products.length})</p>
                    <div className="max-h-50 overflow-y-auto">
                      {selectedStoreDetails.products.slice(0, 5).map((product: any) => (
                        <div key={product._id} className="p-2 border border-gray-200 rounded-lg mb-2">
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-sm text-gray-600">
                            ₹{product.price.selling} • Added: {new Date(product.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminShopPage;
