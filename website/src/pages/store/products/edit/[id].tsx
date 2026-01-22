import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ApiService } from '../../../../utils/api';
import StoreLayout from '../../../../components/StoreLayout';
import StoreErrorDisplay from '../../../../components/StoreErrorDisplay';

interface ProductFormData {
  name: string;
  description: string;
  category: string;
  originalPrice: string;
  sellingPrice: string;
  quantity: string;
  lowStockThreshold: string;
  brand: string;
  sku: string;
  weight: string;
  dimensions: string;
  isActive: boolean;
  images: File[];
  existingImages: string[];
}

const EditProductPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [storeId, setStoreId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    category: 'cricket',
    originalPrice: '',
    sellingPrice: '',
    quantity: '',
    lowStockThreshold: '10',
    brand: '',
    sku: '',
    weight: '',
    dimensions: '',
    isActive: true,
    images: [],
    existingImages: [],
  });

  const categories = [
    { value: 'cricket', label: 'Cricket', icon: '🏏' },
    { value: 'football', label: 'Football', icon: '⚽' },
    { value: 'badminton', label: 'Badminton', icon: '🏸' },
    { value: 'tennis', label: 'Tennis', icon: '🎾' },
    { value: 'gym', label: 'Gym', icon: '💪' },
    { value: 'yoga', label: 'Yoga', icon: '🧘' },
    { value: 'sports-wear', label: 'Sports Wear', icon: '👕' },
    { value: 'accessories', label: 'Accessories', icon: '🎒' },
    { value: 'multi-sports', label: 'Multi Sports', icon: '🏃' },
  ];

  useEffect(() => {
    if (id) {
      loadStoreProfile();
      loadProduct();
    }
  }, [id]);

  const loadStoreProfile = async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('userToken') : null;
      if (!token) {
        router.push('/login');
        return;
      }

      const response: any = await ApiService.stores.getProfile();
      if (response.data?.success && response.data?.data?._id) {
        setStoreId(response.data.data._id);
      } else {
        throw new Error('Store profile not found');
      }
    } catch (err: any) {
      // Check if error should be suppressed
      if (!err.suppressLog && !err.isNotFound) {
        console.error('Error loading store profile:', err);
      }
      
      const errorMessage = err.response?.data?.message || err.message || '';
      const isNotFound = err.isNotFound || 
                        err.response?.status === 404 || 
                        errorMessage.toLowerCase().includes('not found') ||
                        errorMessage.toLowerCase().includes('store profile not found');
      
      if (isNotFound) {
        err.isHandled = true;
        router.replace('/store/register');
        return;
      }
      
      setError(err.response?.data?.message || err.message || 'Failed to load store profile');
    }
  };

  const loadProduct = async () => {
    if (!id || typeof id !== 'string') return;

    try {
      setLoading(true);
      setError(null);

      // First get store profile to get store ID
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
                          errorMessage.toLowerCase().includes('store profile not found');
        
        if (isNotFound) {
          profileErr.isHandled = true;
          setLoading(false);
          router.replace('/store/register');
          return;
        }
        
        throw profileErr;
      }
      
      if (!profileResponse.data?.success || !profileResponse.data?.data?._id) {
        setLoading(false);
        router.replace('/store/register');
        return;
      }

      const storeIdFromProfile = profileResponse.data.data._id;
      setStoreId(storeIdFromProfile);

      // Get products and find the one with matching ID
      const productsResponse: any = await ApiService.stores.getProducts(storeIdFromProfile, { includeInactive: 'true' });
      if (productsResponse.data?.success) {
        const products = productsResponse.data.data || [];
        const product = products.find((p: any) => p._id === id);

        if (product) {
          setFormData({
            name: product.name || '',
            description: product.description || '',
            category: product.category || 'cricket',
            originalPrice: product.price?.original?.toString() || '',
            sellingPrice: product.price?.selling?.toString() || '',
            quantity: product.inventory?.quantity?.toString() || '0',
            lowStockThreshold: product.inventory?.lowStockThreshold?.toString() || '10',
            brand: product.brand || '',
            sku: product.sku || '',
            weight: product.weight || '',
            dimensions: product.dimensions || '',
            isActive: product.availability?.isActive !== false,
            images: [],
            existingImages: product.images || [],
          });
        } else {
          throw new Error('Product not found');
        }
      } else {
        throw new Error('Failed to load product');
      }
    } catch (err: any) {
      console.error('Error loading product:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setFormData(prev => ({ ...prev, images: [...prev.images, ...files] }));
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const removeExistingImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      existingImages: prev.existingImages.filter((_, i) => i !== index)
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError('Product name is required');
      return false;
    }
    if (!formData.description.trim()) {
      setError('Product description is required');
      return false;
    }
    if (!formData.originalPrice || parseFloat(formData.originalPrice) <= 0) {
      setError('Original price must be greater than 0');
      return false;
    }
    if (!formData.sellingPrice || parseFloat(formData.sellingPrice) <= 0) {
      setError('Selling price must be greater than 0');
      return false;
    }
    if (parseFloat(formData.sellingPrice) > parseFloat(formData.originalPrice)) {
      setError('Selling price cannot be greater than original price');
      return false;
    }
    if (!formData.quantity || parseInt(formData.quantity) < 0) {
      setError('Quantity must be 0 or greater');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    if (!id || typeof id !== 'string') {
      setError('Product ID not found');
      return;
    }

    setSaving(true);

    try {
      // Prepare product data
      const productData: any = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        category: formData.category,
        price: {
          original: parseFloat(formData.originalPrice),
          selling: parseFloat(formData.sellingPrice),
        },
        inventory: {
          quantity: parseInt(formData.quantity),
          lowStockThreshold: parseInt(formData.lowStockThreshold) || 10,
        },
        availability: {
          isActive: formData.isActive,
        },
        images: formData.existingImages, // Keep existing images
      };

      // Add optional fields
      if (formData.brand) productData.brand = formData.brand.trim();
      if (formData.sku) productData.sku = formData.sku.trim();
      if (formData.weight) productData.weight = formData.weight.trim();
      if (formData.dimensions) productData.dimensions = formData.dimensions.trim();

      const response: any = await ApiService.stores.updateProduct(id, productData);
      
      if (response.data?.success) {
        alert('Product updated successfully!');
        router.push('/store/products');
      } else {
        throw new Error(response.data?.message || 'Failed to update product');
      }
    } catch (err: any) {
      console.error('Error updating product:', err);
      setError(err.response?.data?.message || err.message || 'Failed to update product. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <StoreLayout title="Edit Product - TeamUp India" description="Edit product details">
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mb-4"></div>
            <p className="text-gray-600">Loading product...</p>
          </div>
        </div>
      </StoreLayout>
    );
  }

  return (
    <StoreLayout title="Edit Product - TeamUp India" description="Edit product details">
      <div className="max-w-4xl mx-auto py-8 px-6">
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="text-gray-600 hover:text-gray-900 mb-4 flex items-center"
          >
            ← Back to Products
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
          <p className="text-gray-600 mt-2">Update product details</p>
        </div>

        {error && (
          <div className="mb-6">
            <StoreErrorDisplay 
              error={error}
              onRetry={() => {
                setError(null);
                loadProduct();
              }}
            />
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Enter product name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Enter product description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.icon} {cat.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Pricing</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Original Price (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="originalPrice"
                  value={formData.originalPrice}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selling Price (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="sellingPrice"
                  value={formData.sellingPrice}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          {/* Inventory */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Inventory</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Low Stock Threshold
                </label>
                <input
                  type="number"
                  name="lowStockThreshold"
                  value={formData.lowStockThreshold}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="10"
                />
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Additional Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brand
                </label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Enter brand name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SKU
                </label>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Enter SKU"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weight
                </label>
                <input
                  type="text"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="e.g., 500g, 1kg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dimensions
                </label>
                <input
                  type="text"
                  name="dimensions"
                  value={formData.dimensions}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="e.g., 10x10x5 cm"
                />
              </div>
            </div>
          </div>

          {/* Images */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Product Images</h2>
            
            {/* Existing Images */}
            {formData.existingImages.length > 0 && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Images
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {formData.existingImages.map((imageUrl, index) => (
                    <div key={index} className="relative">
                      <img
                        src={imageUrl}
                        alt={`Product ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add New Images
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
              <p className="text-sm text-gray-500 mt-1">You can upload multiple images</p>
              
              {formData.images.length > 0 && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {formData.images.map((file, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              />
              <span className="ml-2 text-sm font-medium text-gray-700">
                Product is active and visible to customers
              </span>
            </label>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg font-semibold transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Updating Product...' : 'Update Product'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition duration-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </StoreLayout>
  );
};

export default EditProductPage;
