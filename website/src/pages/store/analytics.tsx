import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ApiService } from '../../utils/api';
import StoreLayout from '../../components/StoreLayout';
import StoreErrorDisplay from '../../components/StoreErrorDisplay';

interface AnalyticsData {
  totalSales: number;
  monthlyRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  topProducts: any[];
  monthlyBreakdown: any[];
  topCategories: any[];
}

const StoreAnalyticsPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('this-month');
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (!hasFetchedRef.current) {
      hasFetchedRef.current = true;
    }
    loadAnalytics();
  }, [dateRange]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = typeof window !== 'undefined' ? localStorage.getItem('userToken') : null;
      if (!token) {
        router.push('/login');
        return;
      }

      // Check store profile first
      let profileResponse: any;
      try {
        profileResponse = await ApiService.stores.getProfile();
      } catch (profileErr: any) {
        // Check if error should be suppressed
        if (!profileErr.suppressLog && !profileErr.isNotFound) {
          console.error('Error loading store profile:', profileErr);
        }
        
        const errorMessage = profileErr.response?.data?.message || profileErr.message || '';
        const isNotFound = profileErr.isNotFound || 
                          profileErr.response?.status === 404 || 
                          errorMessage.toLowerCase().includes('not found') ||
                          errorMessage.toLowerCase().includes('store profile not found') ||
                          errorMessage.toLowerCase().includes('store profile not found for current user');
        
        if (isNotFound) {
          profileErr.isHandled = true;
          setLoading(false);
          router.replace('/store/register');
          return;
        }
        
        throw profileErr;
      }

      if (!profileResponse?.data?.success) {
        setLoading(false);
        router.replace('/store/register');
        return;
      }

      // Get dashboard data which includes analytics
      const dashboardResponse: any = await Promise.race([
        ApiService.stores.getDashboard(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), 15000)
        )
      ]) as any;

      if (dashboardResponse.data?.success) {
        const data = dashboardResponse.data.data;
        const stats = data.stats || {};
        const sections = data.sections || {};
        
        // Calculate monthly revenue from order analytics
        const orderAnalytics = data.analytics?.orderAnalytics || [];
        const monthlyRevenue = orderAnalytics.reduce((sum: number, day: any) => 
          sum + (day.totalRevenue || 0), 0
        );

        setAnalytics({
          totalSales: stats.totalRevenue || 0,
          monthlyRevenue: monthlyRevenue || stats.totalRevenue || 0,
          totalOrders: stats.totalOrders || 0,
          averageOrderValue: stats.totalOrders > 0 
            ? (stats.totalRevenue || 0) / stats.totalOrders 
            : 0,
          topProducts: sections.topSellingProducts || [],
          monthlyBreakdown: orderAnalytics || [],
          topCategories: [], // Can be calculated from products
        });
      }
    } catch (err: any) {
      console.error('Error loading analytics:', err);
      setError(err.message || 'Failed to load analytics');
      // Set default data on error
      setAnalytics({
        totalSales: 0,
        monthlyRevenue: 0,
        totalOrders: 0,
        averageOrderValue: 0,
        topProducts: [],
        monthlyBreakdown: [],
        topCategories: [],
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <StoreLayout title="Store Analytics - TeamUp India" description="Track your store performance">
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mb-4"></div>
            <p className="text-gray-600">Loading analytics...</p>
          </div>
        </div>
      </StoreLayout>
    );
  }

  return (
    <StoreLayout title="Store Analytics Dashboard - TeamUp India" description="Track your store sales and performance metrics">
      <div className="max-w-7xl mx-auto py-8 px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Sales Analytics Dashboard</h1>
          <p className="text-gray-600">Track your store performance, sales, and customer insights</p>
        </div>

        {error && (
          <div className="mb-6">
            <StoreErrorDisplay 
              error={error}
              onRetry={() => {
                setError(null);
                hasFetchedRef.current = false;
                loadAnalytics();
              }}
            />
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">Total Sales</h3>
            <p className="text-3xl font-bold text-green-600">
              ₹{analytics?.totalSales.toLocaleString() || '0'}
            </p>
            <p className="text-sm text-gray-500 mt-1">All time</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">This Month</h3>
            <p className="text-3xl font-bold text-blue-600">
              ₹{analytics?.monthlyRevenue.toLocaleString() || '0'}
            </p>
            <p className="text-sm text-gray-500 mt-1">Current month</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">Total Orders</h3>
            <p className="text-3xl font-bold text-purple-600">
              {analytics?.totalOrders || 0}
            </p>
            <p className="text-sm text-gray-500 mt-1">All orders</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">Avg. Order Value</h3>
            <p className="text-3xl font-bold text-yellow-600">
              ₹{analytics?.averageOrderValue.toFixed(0) || '0'}
            </p>
            <p className="text-sm text-gray-500 mt-1">Per order</p>
          </div>
        </div>

        {/* Filters and Tabs */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('products')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'products'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Top Products
              </button>
            </nav>
          </div>
          
          <div>
            <select 
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
            >
              <option value="today">Today</option>
              <option value="this-week">This Week</option>
              <option value="this-month">This Month</option>
              <option value="last-3-months">Last 3 Months</option>
              <option value="this-year">This Year</option>
            </select>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Sales Overview</h2>
              {analytics?.monthlyBreakdown && analytics.monthlyBreakdown.length > 0 ? (
                <div className="space-y-4">
                  {analytics.monthlyBreakdown.slice(-7).map((day: any, index: number) => (
                    <div key={index}>
                      <div className="flex justify-between mb-1">
                        <span>{day._id || 'Date'}</span>
                        <span>₹{day.totalRevenue?.toLocaleString() || '0'}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ 
                            width: `${Math.min((day.totalRevenue / (analytics.monthlyRevenue || 1)) * 100, 100)}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-gray-500">No sales data available</p>
                    <p className="text-sm text-gray-400 mt-2">Start selling to see your analytics</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Top Selling Products</h2>

            {analytics?.topProducts && analytics.topProducts.length > 0 ? (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Units Sold</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {analytics.topProducts.map((product: any, index: number) => (
                        <tr key={product._id || index}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{product.name || 'Product'}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {product.category || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {product['analytics.purchases'] || product.analytics?.purchases || 0}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap font-bold text-sm">
                            ₹{((product['analytics.purchases'] || 0) * (product.price?.selling || 0)).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {product.ratings?.average ? (
                                <>
                                  <span className="text-yellow-400">★</span>
                                  <span className="ml-1 text-gray-500">
                                    {product.ratings.average.toFixed(1)} ({product.ratings.count || 0})
                                  </span>
                                </>
                              ) : (
                                <span className="text-gray-400">No ratings</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <p className="text-gray-500">No product data available</p>
                <Link href="/store/products" className="text-red-600 hover:underline mt-2 inline-block">
                  Add Products
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </StoreLayout>
  );
};

export default StoreAnalyticsPage;
