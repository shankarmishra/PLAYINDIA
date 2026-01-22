import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { ApiService } from '../../utils/api';
import StoreLayout from '../../components/StoreLayout';
import StoreErrorDisplay from '../../components/StoreErrorDisplay';
import Head from 'next/head';

interface Order {
  _id: string;
  orderNumber?: string;
  orderId?: string;
  totalAmount: number;
  status: string;
  payment: {
    method: string;
    status: string;
  };
  shipping: {
    address: {
      street: string;
      city: string;
      state: string;
      pincode: string;
    };
  };
  items: Array<{
    name: string;
    quantity: number;
    total: number;
  }>;
  userId?: {
    name: string;
    email: string;
    mobile: string;
  };
  createdAt: string;
}

const StoreOrdersPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadOrders();
  }, [selectedStatus]);

  const loadOrders = async () => {
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
        
        setError(profileErr.response?.data?.message || profileErr.message || 'Failed to load store profile');
        setLoading(false);
        return;
      }

      if (!profileResponse?.data?.success) {
        setLoading(false);
        router.replace('/store/register');
        return;
      }

      const params: any = {};
      if (selectedStatus !== 'all') {
        params.status = selectedStatus;
      }

      const response: any = await Promise.race([
        ApiService.orders.getStoreOrders(params),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), 15000)
        )
      ]) as any;

      if (response.data?.success) {
        setOrders(response.data.data || []);
      }
    } catch (err: any) {
      // Check if error was already handled
      if (err.isHandled) {
        return;
      }
      
      console.error('Error loading orders:', err);
      setError(err.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      await ApiService.orders.updateOrderStatus(orderId, { status: newStatus });
      alert('Order status updated successfully');
      await loadOrders();
      setShowModal(false);
    } catch (err: any) {
      alert(err.message || 'Failed to update order status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-purple-100 text-purple-800';
      case 'shipped': return 'bg-cyan-100 text-cyan-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getNextStatus = (currentStatus: string) => {
    const statusFlow = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
    const currentIndex = statusFlow.indexOf(currentStatus.toLowerCase());
    if (currentIndex < statusFlow.length - 1) {
      return statusFlow[currentIndex + 1];
    }
    return null;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <StoreLayout title="Store Orders - TeamUp India" description="Manage your store orders">
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mb-4"></div>
            <p className="text-gray-600">Loading orders...</p>
          </div>
        </div>
      </StoreLayout>
    );
  }

  return (
    <StoreLayout title="Store Orders - TeamUp India" description="Manage your store orders">
      <div className="max-w-7xl mx-auto py-8 px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Orders Management</h1>
          <p className="text-gray-600">View and manage all your store orders</p>
        </div>

        {error && (
          <div className="mb-6">
            <StoreErrorDisplay 
              error={error}
              onRetry={() => {
                setError(null);
                loadOrders();
              }}
            />
          </div>
        )}

        {/* Status Filters */}
        <div className="mb-6 flex gap-2 overflow-x-auto">
          {['all', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition duration-300 ${
                selectedStatus === status
                  ? 'bg-red-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {orders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{order.orderNumber || order.orderId || order._id.slice(-6)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {order.userId?.name || 'Unknown Customer'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                        ₹{order.totalAmount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                          {order.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowModal(true);
                          }}
                          className="text-red-600 hover:underline mr-3"
                        >
                          View
                        </button>
                        {getNextStatus(order.status) && (
                          <button
                            onClick={() => handleStatusUpdate(order._id, getNextStatus(order.status)!)}
                            className="text-green-600 hover:underline"
                          >
                            Mark as {getNextStatus(order.status)?.toUpperCase()}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">No orders found</h3>
              <p className="text-gray-600">
                {selectedStatus !== 'all' 
                  ? `No orders with status "${selectedStatus}"`
                  : 'Orders will appear here when customers place them'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Order Detail Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Order Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order Number:</span>
                    <span className="font-medium">#{selectedOrder.orderNumber || selectedOrder.orderId || selectedOrder._id.slice(-6)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">{formatDate(selectedOrder.createdAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Amount:</span>
                    <span className="font-bold text-lg">₹{selectedOrder.totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedOrder.status)}`}>
                      {selectedOrder.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Customer Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium">{selectedOrder.userId?.name || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">{selectedOrder.userId?.email || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mobile:</span>
                    <span className="font-medium">{selectedOrder.userId?.mobile || 'N/A'}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Shipping Address</h3>
                <p className="text-sm text-gray-600">
                  {selectedOrder.shipping.address.street}<br />
                  {selectedOrder.shipping.address.city}, {selectedOrder.shipping.address.state} - {selectedOrder.shipping.address.pincode}
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Order Items</h3>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm border-b pb-2">
                      <span>{item.name} × {item.quantity}</span>
                      <span className="font-medium">₹{item.total.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              {getNextStatus(selectedOrder.status) && (
                <button
                  onClick={() => handleStatusUpdate(selectedOrder._id, getNextStatus(selectedOrder.status)!)}
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg font-semibold transition duration-300"
                >
                  Mark as {getNextStatus(selectedOrder.status)?.toUpperCase()}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </StoreLayout>
  );
};

export default StoreOrdersPage;
