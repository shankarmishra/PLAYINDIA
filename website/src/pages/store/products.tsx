import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ApiService } from '../../utils/api';
import StoreLayout from '../../components/StoreLayout';
import StoreErrorDisplay from '../../components/StoreErrorDisplay';

interface Product {
  _id: string;
  name: string;
  description?: string;
  price: {
    original: number;
    selling: number;
  };
  category: string;
  images?: string[];
  inventory: {
    quantity: number;
    lowStockThreshold?: number;
  };
  availability: {
    isActive: boolean;
  };
  ratings?: {
    average: number;
    count: number;
  };
}

const StoreProducts = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [storeId, setStoreId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [error, setError] = useState<string | null>(null);

  const categories = [
    { value: 'all', label: 'All', icon: '🏷️' },
    { value: 'cricket', label: 'Cricket', icon: '🏏' },
    { value: 'football', label: 'Football', icon: '⚽' },
    { value: 'badminton', label: 'Badminton', icon: '🏸' },
    { value: 'tennis', label: 'Tennis', icon: '🎾' },
    { value: 'gym', label: 'Gym', icon: '💪' },
    { value: 'yoga', label: 'Yoga', icon: '🧘' },
    { value: 'sports-wear', label: 'Sports Wear', icon: '👕' },
    { value: 'accessories', label: 'Accessories', icon: '🎒' },
  ];

  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (!hasFetchedRef.current) {
      hasFetchedRef.current = true;
      loadStoreAndProducts();
    }
  }, []);

  useEffect(() => {
    if (storeId) {
      loadProducts(storeId);
    }
  }, [selectedCategory, searchQuery, storeId]);

  const loadStoreAndProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Check authentication
      const token = typeof window !== 'undefined' ? localStorage.getItem('userToken') : null;
      if (!token) {
        router.push('/login');
        return;
      }

      // First check if user is a store/seller
      try {
        const userResponse: any = await ApiService.auth.me();
        if (userResponse.data?.success) {
          const userData = userResponse.data.user;
          
          // Check if user is a seller/store
          if (userData.role !== 'seller' && userData.role !== 'store') {
            setError('You are not authorized to access store pages. Please login as a store owner.');
            setTimeout(() => router.push('/login'), 3000);
            return;
          }

          // Check if account is approved
          if (userData.status !== 'active') {
            setError('Your store account is pending approval. Please wait for admin approval.');
            setTimeout(() => router.push('/store/register'), 3000);
            return;
          }
        }
      } catch (userErr: any) {
        console.error('Error checking user:', userErr);
        if (userErr.response?.status === 401) {
          router.push('/login');
          return;
        }
      }

      // Get store profile first - handle "not found" silently
      let profileResponse: any;
      try {
        profileResponse = await ApiService.stores.getProfile();
      } catch (profileErr: any) {
        // Check if error should be suppressed
        if (profileErr.suppressLog) {
          // Don't log suppressed errors
        } else {
          // Only log non-suppressed errors
          const errorMessage = profileErr.response?.data?.message || profileErr.message || '';
          const isNotFound = profileErr.isNotFound || 
                            profileErr.response?.status === 404 || 
                            errorMessage.toLowerCase().includes('not found') ||
                            errorMessage.toLowerCase().includes('store profile not found') ||
                            errorMessage.toLowerCase().includes('store profile not found for current user');
          
          if (!isNotFound) {
            // Only log if it's not a "not found" error
            console.error('Error loading store profile:', profileErr);
          }
        }
        
        // Check for "not found" errors
        const errorMessage = profileErr.response?.data?.message || profileErr.message || '';
        const isNotFound = profileErr.isNotFound || 
                          profileErr.response?.status === 404 || 
                          errorMessage.toLowerCase().includes('not found') ||
                          errorMessage.toLowerCase().includes('store profile not found') ||
                          errorMessage.toLowerCase().includes('store profile not found for current user');
        
        // Only redirect if it's definitely a "not found" error
        if (isNotFound) {
          profileErr.isHandled = true;
          setLoading(false);
          // Immediate redirect without delay
          router.replace('/store/register');
          return;
        }
        
        // For other errors, show error message but don't redirect
        setError(profileErr.response?.data?.message || profileErr.message || 'Failed to load store profile. Please try again.');
        setLoading(false);
        return;
      }

      // Check if profile response is successful
      if (profileResponse?.data?.success) {
        const profileData = profileResponse.data.data;
        
        // Check if we have a store ID (could be in different places)
        const storeIdFromResponse = profileData?._id || profileData?.storeId || profileData?.id;
        
        if (storeIdFromResponse) {
          setStoreId(storeIdFromResponse);
          
          // Load products
          await loadProducts(storeIdFromResponse);
          setLoading(false);
          return; // Success, exit early
        } else {
          // Profile exists but no store ID - this shouldn't happen, but don't redirect
          console.warn('Store profile found but no store ID');
          setError('Store profile found but missing store ID. Please contact support.');
          setLoading(false);
          return;
        }
      } else {
        // Response was not successful, but not a 404 - don't redirect
        const errorMessage = profileResponse?.data?.message || 'Failed to load store profile';
        setError(errorMessage);
        setLoading(false);
        return;
      }
    } catch (err: any) {
      // Check if error was already handled
      if (err.isHandled) {
        return;
      }
      
      // Check if it's a "not found" error that wasn't caught earlier
      const errorMessage = err.response?.data?.message || err.message || '';
      const isNotFound = err.response?.status === 404 || 
                        err.isNotFound ||
                        errorMessage.toLowerCase().includes('not found') ||
                        errorMessage.toLowerCase().includes('store profile not found') ||
                        errorMessage.toLowerCase().includes('store profile not found for current user');
      
      if (isNotFound) {
        err.isHandled = true;
        setLoading(false);
        setTimeout(() => {
          router.replace('/store/register');
        }, 0);
        return;
      }
      
      // Only log non-not-found errors
      console.error('Unexpected error loading products:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load products');
      setLoading(false);
    }
  };

  const loadProducts = async (id: string) => {
    try {
      const params: any = {
        includeInactive: 'true' // Store owners should see all products including inactive ones
      };
      if (selectedCategory !== 'all') {
        params.category = selectedCategory;
      }
      if (searchQuery) {
        params.search = searchQuery;
      }
      
      const response: any = await ApiService.stores.getProducts(id, params);
      if (response.data?.success) {
        setProducts(response.data.data || []);
      }
    } catch (err: any) {
      console.error('Error loading products:', err);
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }
    
    try {
      await ApiService.stores.deleteProduct(productId);
      if (storeId) {
        await loadProducts(storeId);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to delete product');
    }
  };

  const handleToggleStatus = async (product: Product) => {
    try {
      await ApiService.stores.updateProduct(product._id, {
        availability: {
          isActive: !product.availability.isActive,
        },
      });
      if (storeId) {
        await loadProducts(storeId);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update product status');
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const lowStockProducts = products.filter(
    (p) => p.inventory.quantity <= (p.inventory.lowStockThreshold || 10)
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <StoreLayout title="Store Products - TeamUp India" description="Manage your sports equipment products and inventory">

      {/* Header */}
      <section className="py-12 px-6 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2">Manage Products</h1>
              <p className="text-xl text-gray-300">Add, edit, and manage your sports equipment inventory</p>
            </div>
            <Link
              href="/store/products/add"
              className="bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg font-semibold transition duration-300"
            >
              Add New Product
            </Link>
          </div>
        </div>
      </section>

      {error && (
        <div className="max-w-7xl mx-auto px-6 pt-6">
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

      {/* Search and Filters */}
      <section className="py-6 px-6 bg-white border-b">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition duration-300 ${
                    selectedCategory === cat.value
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span className="mr-2">{cat.icon}</span>
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Low Stock Alert */}
      {lowStockProducts.length > 0 && (
        <section className="py-4 px-6 bg-yellow-50 border-b border-yellow-200">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-2xl mr-2">⚠️</span>
                <span className="font-semibold text-yellow-800">
                  {lowStockProducts.length} product{lowStockProducts.length > 1 ? 's' : ''} running low on stock
                </span>
              </div>
              <Link href="/store/inventory" className="text-yellow-800 hover:underline font-medium">
                View Inventory
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Products Grid */}
      <section className="py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Your Products ({filteredProducts.length})
            </h2>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div key={product._id} className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition duration-300">
                  <div className="mb-4">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-200 border-2 border-dashed rounded-lg flex items-center justify-center">
                        <span className="text-gray-400">No Image</span>
                      </div>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">{product.name}</h3>
                  <p className="text-gray-600 mb-3 text-sm line-clamp-2">
                    {product.description || 'No description'}
                  </p>
                  
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <span className="text-lg font-bold text-green-600">
                        ₹{product.price.selling.toLocaleString()}
                      </span>
                      {product.price.original > product.price.selling && (
                        <span className="text-sm text-gray-500 line-through ml-2">
                          ₹{product.price.original.toLocaleString()}
                        </span>
                      )}
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      product.availability.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {product.availability.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center mb-4 text-sm text-gray-600">
                    <span>Stock: {product.inventory.quantity}</span>
                    {product.ratings && (
                      <span>⭐ {product.ratings.average.toFixed(1)} ({product.ratings.count})</span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => router.push(`/store/products/edit/${product._id}`)}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded text-sm font-semibold transition duration-300"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleToggleStatus(product)}
                      className={`flex-1 px-3 py-2 rounded text-sm font-semibold transition duration-300 ${
                        product.availability.isActive
                          ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                          : 'bg-green-500 hover:bg-green-600 text-white'
                      }`}
                    >
                      {product.availability.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded text-sm font-semibold transition duration-300"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-12 rounded-xl border border-gray-200 text-center">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">No products found</h3>
              <p className="text-gray-600 mb-6">
                {searchQuery || selectedCategory !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Start by adding your first product to your store'}
              </p>
              <Link
                href="/store/products/add"
                className="inline-block bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition duration-300"
              >
                Add Your First Product
              </Link>
            </div>
          )}
        </div>
      </section>
    </StoreLayout>
  );
};

export default StoreProducts;
