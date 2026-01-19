import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ApiService } from '../../utils/api';
import StoreLayout from '../../components/StoreLayout';
import StoreErrorDisplay from '../../components/StoreErrorDisplay';

const Store3DProductsPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  const [storeId, setStoreId] = useState<string | null>(null);
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
      const token = typeof window !== 'undefined' ? localStorage.getItem('userToken') : null;
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const profileResponse: any = await ApiService.stores.getProfile();
        if (profileResponse.data?.success && profileResponse.data?.data?._id) {
          const id = profileResponse.data.data._id;
          setStoreId(id);
          
          const productsResponse: any = await ApiService.stores.getProducts(id, {});
          if (productsResponse.data?.success) {
            setProducts(productsResponse.data.data || []);
          }
        } else {
          throw new Error('Store profile not found');
        }
      } catch (profileErr: any) {
        console.error('Error loading store profile:', profileErr);
        if (profileErr.response?.status === 404 || profileErr.message?.includes('not found')) {
          setError('Store profile not found. Please complete your store registration.');
          setTimeout(() => {
            router.push('/store/register');
          }, 3000);
          return;
        }
        throw profileErr;
      }
    } catch (err: any) {
      console.error('Error loading 3D products:', err);
      if (err.response?.status === 404 || err.message?.includes('not found')) {
        setError('Store profile not found. Please complete your store registration.');
        setTimeout(() => {
          router.push('/store/register');
        }, 3000);
      } else {
        setError(err.message || 'Failed to load products.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mb-4"></div>
          <p className="text-gray-600">Loading 3D products...</p>
        </div>
      </div>
    );
  }

  return (
    <StoreLayout title="3D Products - TeamUp India Store" description="Manage 3D sports experiences for your customers">
      <div className="max-w-7xl mx-auto py-8 px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">3D Sports Products</h1>
          <p className="text-gray-600">Offer immersive 3D sports experiences to your customers</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold text-gray-900 mb-4">3D Sports Experience Packages</h2>
              <p className="text-gray-600 mb-6">Enhance your product offerings with virtual 3D sports experiences that customers can access with their purchases</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border rounded-lg p-4">
                  <h3 className="font-bold text-lg">Cricket VR Experience</h3>
                  <p className="text-gray-600 text-sm mt-2">Virtual batting and bowling practice with professional coaching</p>
                  <div className="mt-4">
                    <p className="text-sm"><span className="font-semibold">Included with:</span> Bats, Helmets</p>
                    <p className="text-sm"><span className="font-semibold">Duration:</span> 3 months access</p>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="font-bold text-lg">Football Training Module</h3>
                  <p className="text-gray-600 text-sm mt-2">Virtual dribbling and shooting practice</p>
                  <div className="mt-4">
                    <p className="text-sm"><span className="font-semibold">Included with:</span> Footballs, Shin Guards</p>
                    <p className="text-sm"><span className="font-semibold">Duration:</span> 2 months access</p>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="font-bold text-lg">Tennis Skill Builder</h3>
                  <p className="text-gray-600 text-sm mt-2">Virtual coaching for serves and groundstrokes</p>
                  <div className="mt-4">
                    <p className="text-sm"><span className="font-semibold">Included with:</span> Rackets, Balls</p>
                    <p className="text-sm"><span className="font-semibold">Duration:</span> 3 months access</p>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="font-bold text-lg">Badminton Pro</h3>
                  <p className="text-gray-600 text-sm mt-2">Virtual coaching for serves and smashes</p>
                  <div className="mt-4">
                    <p className="text-sm"><span className="font-semibold">Included with:</span> Rackets, Shuttles</p>
                    <p className="text-sm"><span className="font-semibold">Duration:</span> 2 months access</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Benefits</h2>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Increased customer engagement</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Higher product value proposition</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Additional revenue stream</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Competitive advantage</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Enhanced customer retention</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md mt-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Statistics</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Customers with 3D access</span>
                    <span>1,245</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Engagement rate</span>
                    <span>78%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '78%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Repeat purchases</span>
                    <span>42%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: '42%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Manage 3D Experience Inventory</h2>
          {products.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">3D Experience</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((product: any) => {
                    const experienceMap: Record<string, string> = {
                      cricket: 'Cricket VR Experience',
                      football: 'Football Training Module',
                      tennis: 'Tennis Skill Builder',
                      badminton: 'Badminton Pro',
                      gym: 'Fitness VR Training',
                      yoga: 'Yoga Virtual Studio',
                    };
                    const experience = experienceMap[product.category] || '3D Experience';
                    
                    return (
                      <tr key={product._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500">{experience}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {product.category || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {experience}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            product.inventory.quantity > 0
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {product.inventory.quantity > 0 ? 'Available' : 'Out of Stock'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <Link
                            href={`/store/products/edit/${product._id}`}
                            className="text-blue-600 hover:underline mr-3"
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
              <div className="text-6xl mb-4">🎮</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">No products with 3D experiences</h3>
              <p className="text-gray-600 mb-6">Add products to enable 3D experiences for your customers</p>
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

export default Store3DProductsPage;