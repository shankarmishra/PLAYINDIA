import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface StoreErrorDisplayProps {
  error: string;
  onRetry?: () => void;
}

const StoreErrorDisplay: React.FC<StoreErrorDisplayProps> = ({ error, onRetry }) => {
  const router = useRouter();
  const isProfileNotFound = error.includes('not found') || error.includes('Store profile not found');

  // Auto-redirect to registration if profile not found
  useEffect(() => {
    if (isProfileNotFound) {
      const timer = setTimeout(() => {
        router.push('/store/register');
      }, 2000); // Redirect after 2 seconds
      return () => clearTimeout(timer);
    }
  }, [isProfileNotFound, router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md w-full">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
          <span className="block sm:inline">{error}</span>
        </div>
        
        {isProfileNotFound ? (
          <div className="space-y-4">
            <p className="text-gray-600 mb-4">
              You need to complete your store registration to access the dashboard.
            </p>
            <Link
              href="/store/register"
              className="inline-block bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition duration-300"
            >
              Complete Store Registration
            </Link>
            <p className="text-sm text-gray-500 mt-4">
              Redirecting automatically in 2 seconds, or click the button above to start immediately.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {onRetry && (
              <button
                onClick={onRetry}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition duration-300"
              >
                Try Again
              </button>
            )}
            <Link
              href="/store"
              className="inline-block bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition duration-300"
            >
              Go to Dashboard
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoreErrorDisplay;
