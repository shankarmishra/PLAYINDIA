import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { ApiService } from '../../utils/api';
import StoreLayout from '../../components/StoreLayout';
import StoreErrorDisplay from '../../components/StoreErrorDisplay';

interface Review {
  _id: string;
  userId: {
    name: string;
    email: string;
  };
  productId?: {
    name: string;
    images?: string[];
  };
  rating: number;
  comment: string;
  createdAt: string;
  helpful?: number;
  verified?: boolean;
}

const StoreReviewsPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filter, setFilter] = useState('all'); // all, 5, 4, 3, 2, 1
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (!hasFetchedRef.current) {
      hasFetchedRef.current = true;
      loadReviews();
    }
  }, []);

  const loadReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = typeof window !== 'undefined' ? localStorage.getItem('userToken') : null;
      if (!token) {
        router.push('/login');
        return;
      }

      // Get store profile first
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

      // For now, we'll use a placeholder since reviews API might not exist
      // In a real implementation, you'd fetch reviews from /api/stores/reviews or /api/reviews/store
      setReviews([]);
      
    } catch (err: any) {
      console.error('Error loading reviews:', err);
      const errorMessage = err.response?.data?.message || err.message || '';
      const isNotFound = err.response?.status === 404 || 
                        errorMessage.toLowerCase().includes('not found') ||
                        errorMessage.toLowerCase().includes('store profile not found');
      
      if (isNotFound) {
        setError('Store profile not found. Please complete your store registration.');
        setTimeout(() => router.replace('/store/register'), 2000);
      } else {
        setError(err.response?.data?.message || err.message || 'Failed to load reviews');
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredReviews = reviews.filter((review) => {
    const matchesFilter = filter === 'all' || review.rating === parseInt(filter);
    const matchesSearch = searchQuery === '' || 
      review.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.productId?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getRatingStats = () => {
    const stats = {
      total: reviews.length,
      five: reviews.filter(r => r.rating === 5).length,
      four: reviews.filter(r => r.rating === 4).length,
      three: reviews.filter(r => r.rating === 3).length,
      two: reviews.filter(r => r.rating === 2).length,
      one: reviews.filter(r => r.rating === 1).length,
    };
    const average = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;
    return { ...stats, average };
  };

  const stats = getRatingStats();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-300'}>
        ★
      </span>
    ));
  };

  if (loading) {
    return (
      <StoreLayout title="Product Reviews - TeamUp India" description="View and manage product reviews">
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mb-4"></div>
            <p className="text-gray-600">Loading reviews...</p>
          </div>
        </div>
      </StoreLayout>
    );
  }

  return (
    <StoreLayout title="Product Reviews - TeamUp India" description="View and manage product reviews">
      <div className="max-w-7xl mx-auto py-8 px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Product Reviews</h1>
          <p className="text-gray-600">View and manage customer reviews for your products</p>
        </div>

        {error && (
          <div className="mb-6">
            <StoreErrorDisplay 
              error={error}
              onRetry={() => {
                setError(null);
                hasFetchedRef.current = false;
                loadReviews();
              }}
            />
          </div>
        )}

        {/* Rating Overview */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Rating Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center mb-4">
                <div className="text-5xl font-bold text-gray-900 mr-4">
                  {stats.average.toFixed(1)}
                </div>
                <div>
                  <div className="flex text-2xl mb-1">
                    {renderStars(Math.round(stats.average))}
                  </div>
                  <p className="text-gray-600">Based on {stats.total} reviews</p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = stats[rating as keyof typeof stats] as number;
                const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;
                return (
                  <div key={rating} className="flex items-center">
                    <span className="text-sm font-medium text-gray-700 w-12">{rating} ★</span>
                    <div className="flex-1 mx-2 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-12 text-right">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search reviews..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {['all', '5', '4', '3', '2', '1'].map((rating) => (
                <button
                  key={rating}
                  onClick={() => setFilter(rating)}
                  className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition duration-300 ${
                    filter === rating
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {rating === 'all' ? 'All Ratings' : `${rating} ★`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {filteredReviews.length > 0 ? (
            filteredReviews.map((review) => (
              <div key={review._id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                        <span className="text-gray-600 font-semibold">
                          {review.userId.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{review.userId.name}</h3>
                        <p className="text-sm text-gray-500">{formatDate(review.createdAt)}</p>
                      </div>
                      {review.verified && (
                        <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          Verified Purchase ✓
                        </span>
                      )}
                    </div>
                    {review.productId && (
                      <div className="mb-2">
                        <span className="text-sm text-gray-600">Product: </span>
                        <span className="text-sm font-medium text-gray-900">
                          {review.productId.name}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="flex text-lg mb-1">
                      {renderStars(review.rating)}
                    </div>
                    <span className="text-sm text-gray-600">{review.rating}/5</span>
                  </div>
                </div>
                <p className="text-gray-700 mb-3">{review.comment}</p>
                {review.helpful !== undefined && (
                  <div className="text-sm text-gray-500">
                    {review.helpful} people found this helpful
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <div className="text-6xl mb-4">⭐</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">No reviews found</h3>
              <p className="text-gray-600">
                {searchQuery || filter !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Reviews will appear here when customers rate your products'}
              </p>
            </div>
          )}
        </div>
      </div>
    </StoreLayout>
  );
};

export default StoreReviewsPage;
