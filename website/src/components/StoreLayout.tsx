import React, { ReactNode } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface StoreLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

const StoreLayout: React.FC<StoreLayoutProps> = ({ 
  children, 
  title = 'Store Dashboard - TeamUp India',
  description = 'Manage your sports store on TeamUp India'
}) => {
  const router = useRouter();

  const isActive = (path: string) => {
    return router.pathname === path || router.pathname.startsWith(path + '/');
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('userToken');
      localStorage.removeItem('user');
    }
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Head>

      {/* Store Navigation */}
      <nav className="bg-gray-900 text-white py-4 px-6 flex justify-between items-center">
        <div className="text-xl font-bold text-red-400">TeamUp India Store</div>
        <div className="flex space-x-6">
          <Link 
            href="/store" 
            className={`hover:text-red-400 transition duration-300 ${isActive('/store') && router.pathname === '/store' ? 'text-red-400 font-medium underline' : ''}`}
          >
            Dashboard
          </Link>
          <Link 
            href="/store/products" 
            className={`hover:text-red-400 transition duration-300 ${isActive('/store/products') ? 'text-red-400 font-medium underline' : ''}`}
          >
            Products
          </Link>
          <Link 
            href="/store/orders" 
            className={`hover:text-red-400 transition duration-300 ${isActive('/store/orders') ? 'text-red-400 font-medium underline' : ''}`}
          >
            Orders
          </Link>
          <Link 
            href="/store/inventory" 
            className={`hover:text-red-400 transition duration-300 ${isActive('/store/inventory') ? 'text-red-400 font-medium underline' : ''}`}
          >
            Inventory
          </Link>
          <Link 
            href="/store/analytics" 
            className={`hover:text-red-400 transition duration-300 ${isActive('/store/analytics') ? 'text-red-400 font-medium underline' : ''}`}
          >
            Analytics
          </Link>
          <Link 
            href="/store/profile" 
            className={`hover:text-red-400 transition duration-300 ${isActive('/store/profile') ? 'text-red-400 font-medium underline' : ''}`}
          >
            Profile
          </Link>
          <Link 
            href="/store/settings" 
            className={`hover:text-red-400 transition duration-300 ${isActive('/store/settings') ? 'text-red-400 font-medium underline' : ''}`}
          >
            Settings
          </Link>
          <button 
            onClick={handleLogout} 
            className="hover:text-red-400 transition duration-300"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        {children}
      </main>
    </div>
  );
};

export default StoreLayout;
