import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { ApiService } from '../../utils/api';
import StoreLayout from '../../components/StoreLayout';
import StoreErrorDisplay from '../../components/StoreErrorDisplay';

interface ReportData {
  sales: {
    total: number;
    thisMonth: number;
    lastMonth: number;
    growth: number;
  };
  orders: {
    total: number;
    completed: number;
    cancelled: number;
    pending: number;
  };
  products: {
    total: number;
    active: number;
    lowStock: number;
    outOfStock: number;
  };
  customers: {
    total: number;
    newThisMonth: number;
    returning: number;
  };
}

const StoreReportsPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [dateRange, setDateRange] = useState('this-month');
  const [reportType, setReportType] = useState('sales');
  const [error, setError] = useState<string | null>(null);
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (!hasFetchedRef.current) {
      hasFetchedRef.current = true;
    }
    loadReports();
  }, [dateRange]);

  const loadReports = async () => {
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

      // Get dashboard data for reports
      const dashboardResponse: any = await Promise.race([
        ApiService.stores.getDashboard(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), 15000)
        )
      ]) as any;

      if (dashboardResponse.data?.success) {
        const data = dashboardResponse.data.data;
        const stats = data.stats || {};
        
        setReportData({
          sales: {
            total: stats.totalRevenue || 0,
            thisMonth: stats.monthlyRevenue || 0,
            lastMonth: 0, // Would need historical data
            growth: 0, // Would calculate from historical data
          },
          orders: {
            total: stats.totalOrders || 0,
            completed: stats.completedOrders || 0,
            cancelled: 0, // Would need from orders
            pending: stats.pendingOrders || 0,
          },
          products: {
            total: stats.totalProducts || 0,
            active: stats.totalProducts || 0, // Would need from products
            lowStock: 0, // Would need from inventory
            outOfStock: 0, // Would need from inventory
          },
          customers: {
            total: 0, // Would need from orders/users
            newThisMonth: 0,
            returning: 0,
          },
        });
      }
    } catch (err: any) {
      console.error('Error loading reports:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load reports');
      // Set default data
      setReportData({
        sales: { total: 0, thisMonth: 0, lastMonth: 0, growth: 0 },
        orders: { total: 0, completed: 0, cancelled: 0, pending: 0 },
        products: { total: 0, active: 0, lowStock: 0, outOfStock: 0 },
        customers: { total: 0, newThisMonth: 0, returning: 0 },
      });
    } finally {
      setLoading(false);
    }
  };

  const exportReport = (type: string) => {
    // In a real implementation, this would generate and download a PDF/CSV
    alert(`Exporting ${type} report...`);
  };

  if (loading) {
    return (
      <StoreLayout title="Store Reports - TeamUp India" description="View detailed store reports">
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mb-4"></div>
            <p className="text-gray-600">Loading reports...</p>
          </div>
        </div>
      </StoreLayout>
    );
  }

  return (
    <StoreLayout title="Store Reports - TeamUp India" description="View detailed store reports">
      <div className="max-w-7xl mx-auto py-8 px-6">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Store Reports</h1>
            <p className="text-gray-600">Detailed analytics and insights for your store</p>
          </div>
          <div className="flex gap-4">
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
            <button
              onClick={() => exportReport(reportType)}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition duration-300"
            >
              Export Report
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6">
            <StoreErrorDisplay 
              error={error}
              onRetry={() => {
                setError(null);
                hasFetchedRef.current = false;
                loadReports();
              }}
            />
          </div>
        )}

        {/* Report Type Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex space-x-8">
            {['sales', 'orders', 'products', 'customers'].map((type) => (
              <button
                key={type}
                onClick={() => setReportType(type)}
                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                  reportType === type
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {type}
              </button>
            ))}
          </nav>
        </div>

        {/* Sales Report */}
        {reportType === 'sales' && reportData && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Sales</h3>
                <p className="text-3xl font-bold text-green-600">
                  ₹{reportData.sales.total.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 mt-1">All time</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">This Month</h3>
                <p className="text-3xl font-bold text-blue-600">
                  ₹{reportData.sales.thisMonth.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 mt-1">Current month</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Last Month</h3>
                <p className="text-3xl font-bold text-purple-600">
                  ₹{reportData.sales.lastMonth.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 mt-1">Previous month</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Growth</h3>
                <p className={`text-3xl font-bold ${reportData.sales.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {reportData.sales.growth >= 0 ? '+' : ''}{reportData.sales.growth.toFixed(1)}%
                </p>
                <p className="text-sm text-gray-500 mt-1">Month over month</p>
              </div>
            </div>
          </div>
        )}

        {/* Orders Report */}
        {reportType === 'orders' && reportData && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Orders</h3>
                <p className="text-3xl font-bold text-blue-600">{reportData.orders.total}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Completed</h3>
                <p className="text-3xl font-bold text-green-600">{reportData.orders.completed}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Pending</h3>
                <p className="text-3xl font-bold text-yellow-600">{reportData.orders.pending}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Cancelled</h3>
                <p className="text-3xl font-bold text-red-600">{reportData.orders.cancelled}</p>
              </div>
            </div>
          </div>
        )}

        {/* Products Report */}
        {reportType === 'products' && reportData && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Products</h3>
                <p className="text-3xl font-bold text-blue-600">{reportData.products.total}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Active</h3>
                <p className="text-3xl font-bold text-green-600">{reportData.products.active}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Low Stock</h3>
                <p className="text-3xl font-bold text-yellow-600">{reportData.products.lowStock}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Out of Stock</h3>
                <p className="text-3xl font-bold text-red-600">{reportData.products.outOfStock}</p>
              </div>
            </div>
          </div>
        )}

        {/* Customers Report */}
        {reportType === 'customers' && reportData && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Customers</h3>
                <p className="text-3xl font-bold text-blue-600">{reportData.customers.total}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">New This Month</h3>
                <p className="text-3xl font-bold text-green-600">{reportData.customers.newThisMonth}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Returning</h3>
                <p className="text-3xl font-bold text-purple-600">{reportData.customers.returning}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </StoreLayout>
  );
};

export default StoreReportsPage;
