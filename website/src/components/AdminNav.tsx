import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface AdminNavProps {
  adminInfo?: any;
  onLogout?: () => void;
}

const AdminNav: React.FC<AdminNavProps> = ({ adminInfo, onLogout }) => {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('admin');
      }
      router.push('/admin/login');
    }
  };

  const navLinks = [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/approvals', label: 'Approvals' },
    { href: '/admin/users', label: 'Users' },
    { href: '/admin/analytics', label: 'Analytics' },
    { href: '/admin/commissions', label: 'Commissions' },
    { href: '/admin/cms', label: 'CMS' },
    { href: '/admin/security', label: 'Security' },
    { href: '/admin/settings', label: 'Settings' },
    { href: '/admin/bookings', label: 'Bookings' },
    { href: '/admin/orders', label: 'Orders' },
    { href: '/admin/support', label: 'Support' },
    { href: '/admin/reports', label: 'Reports' },
  ];

  const isActive = (href: string) => router.pathname === href;

  return (
    <nav className="bg-gray-900 text-white shadow-lg">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/admin" className="text-xl font-bold text-red-400 hover:text-red-300 transition-colors">
              TeamUp India Admin
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:space-x-1 xl:space-x-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? 'bg-red-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {adminInfo && (
              <span className="ml-4 px-3 py-2 text-sm text-gray-200 border-l border-gray-700">
                Welcome, <span className="font-semibold text-white">{adminInfo.name}</span>
              </span>
            )}
            <button
              onClick={handleLogout}
              className="ml-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md transition-colors"
            >
              Logout
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center space-x-4">
            {adminInfo && (
              <span className="text-sm text-gray-200 hidden sm:block">
                {adminInfo.name}
              </span>
            )}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-800 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-gray-800 border-t border-gray-700">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive(link.href)
                    ? 'bg-red-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium bg-red-600 hover:bg-red-700 text-white transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default AdminNav;

