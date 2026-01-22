import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ApiService } from '../../utils/api';
import StoreLayout from '../../components/StoreLayout';
import StoreErrorDisplay from '../../components/StoreErrorDisplay';

interface Product {
  _id: string;
  name: string;
  category: string;
  inventory: {
    quantity: number;
    lowStockThreshold?: number;
    totalSold?: number;
  };
  price: {
    selling: number;
  };
  availability: {
    isActive: boolean;
  };
}

const StoreInventoryPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [storeId, setStoreId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'low-stock' | 'out-of-stock'>('all');
  const [error, setError] = useState<string | null>(null);
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (!hasFetchedRef.current) {
      hasFetchedRef.current = true;
      loadStoreAndProducts();
    }
  }, []);

  const loadStoreAndProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = typeof window !== 'undefined' ? localStorage.getItem('userToken') : null;
      if (!token) {
        router.push('/login');
        return;
      }

      const profileResponse: any = await ApiService.stores.getProfile();
      if (profileResponse.data?.success && profileResponse.data?.data?._id) {
        const id = profileResponse.data.data._id;
        setStoreId(id);
        await loadProducts(id);
      } else {
        throw new Error('Store profile not found');
      }
    } catch (err: any) {
      // Check if error should be suppressed
      if (!err.suppressLog && !err.isNotFound) {
        console.error('Error loading inventory:', err);
      }
      
      // Check for "not found" errors
      const errorMessage = err.response?.data?.message || err.message || '';
      const isNotFound = err.isNotFound || 
                        err.response?.status === 404 || 
                        errorMessage.toLowerCase().includes('not found') ||
                        errorMessage.toLowerCase().includes('store profile not found') ||
                        errorMessage.toLowerCase().includes('store profile not found for current user');
      
      if (isNotFound) {
        err.isHandled = true;
        setLoading(false);
        router.replace('/store/register');
        return;
      }
      
      setError(err.response?.data?.message || err.message || 'Failed to load inventory');
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async (id: string) => {
    try {
      const response: any = await ApiService.stores.getProducts(id, { includeInactive: 'true' });
      if (response.data?.success) {
        setProducts(response.data.data || []);
      }
    } catch (err: any) {
      console.error('Error loading products:', err);
    }
  };

  const filteredProducts = products.filter((product) => {
    if (filter === 'low-stock') {
      const threshold = product.inventory.lowStockThreshold || 10;
      return product.inventory.quantity <= threshold && product.inventory.quantity > 0;
    }
    if (filter === 'out-of-stock') {
      return product.inventory.quantity === 0;
    }
    return true;
  });

  const lowStockCount = products.filter(
    (p) => p.inventory.quantity <= (p.inventory.lowStockThreshold || 10) && p.inventory.quantity > 0
  ).length;

  const outOfStockCount = products.filter((p) => p.inventory.quantity === 0).length;

  const totalValue = products.reduce(
    (sum, p) => sum + p.inventory.quantity * p.price.selling,
    0
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mb-4"></div>
          <p className="text-gray-600">Loading inventory...</p>
        </div>
      </div>
    );
  }

  return (
    <StoreLayout title="Store Inventory - TeamUp India" description="Manage your store inventory">
      <div className="max-w-7xl mx-auto py-8 px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-600">Track and manage your product inventory</p>
        </div>

        {error && (
          <div className="mb-6">
            <StoreErrorDisplay 
              error={error}
              onRetry={() => {
                setError(null);
                hasFetchedRef.current = false;
                loadStoreAndProducts();
              }}
            />
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">Total Products</h3>
            <p className="text-3xl font-bold text-blue-600">{products.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">Low Stock</h3>
            <p className="text-3xl font-bold text-yellow-600">{lowStockCount}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">Out of Stock</h3>
            <p className="text-3xl font-bold text-red-600">{outOfStockCount}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">Total Value</h3>
            <p className="text-3xl font-bold text-green-600">₹{totalValue.toLocaleString()}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex gap-2">
          {[
            { value: 'all', label: 'All Products' },
            { value: 'low-stock', label: `Low Stock (${lowStockCount})` },
            { value: 'out-of-stock', label: `Out of Stock (${outOfStockCount})` },
          ].map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value as any)}
              className={`px-4 py-2 rounded-lg font-semibold transition duration-300 ${
                filter === f.value
                  ? 'bg-red-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Inventory Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {filteredProducts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Value</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProducts.map((product) => {
                    const isLowStock = product.inventory.quantity <= (product.inventory.lowStockThreshold || 10);
                    const isOutOfStock = product.inventory.quantity === 0;
                    
                    return (
                      <tr key={product._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {product.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {product.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className={`text-sm font-semibold ${
                              isOutOfStock ? 'text-red-600' : isLowStock ? 'text-yellow-600' : 'text-gray-900'
                            }`}>
                              {product.inventory.quantity}
                            </span>
                            {product.inventory.lowStockThreshold && (
                              <span className="text-xs text-gray-500 ml-2">
                                / {product.inventory.lowStockThreshold} threshold
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          ₹{product.price.selling.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                          ₹{(product.inventory.quantity * product.price.selling).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            isOutOfStock
                              ? 'bg-red-100 text-red-800'
                              : isLowStock
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {isOutOfStock ? 'Out of Stock' : isLowStock ? 'Low Stock' : 'In Stock'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <Link
                            href={`/store/products/edit/${product._id}`}
                            className="text-blue-600 hover:underline"
                          >
                            Edit
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">No products found</h3>
              <p className="text-gray-600 mb-6">
                {filter !== 'all' 
                  ? `No products match the "${filter}" filter`
                  : 'Start by adding products to your store'}
              </p>
              <Link
                href="/store/products/add"
                className="inline-block bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition duration-300"
              >
                Add Products
              </Link>
            </div>
          )}
        </div>
      </div>
    </StoreLayout>
  );
};

export default StoreInventoryPage;
