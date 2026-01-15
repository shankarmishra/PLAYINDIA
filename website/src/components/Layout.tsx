import React, { ReactNode } from 'react';
import Head from 'next/head';
import Link from 'next/link';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  showNav?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  title = 'TeamUp India - Sports Platform for Players, Coaches, Stores & Delivery', 
  description = 'TeamUp India connects players, coaches, sports stores, and delivery partners in one comprehensive platform',
  showNav = true 
}) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {showNav && (
        <header className="bg-gray-900 text-white py-4 px-6">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="text-2xl font-bold text-red-500">TeamUp India</div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="hover:text-red-400">Home</Link>
              <Link href="/about" className="hover:text-red-400">About</Link>
              <Link href="/features" className="hover:text-red-400">Features</Link>
              <Link href="/how-it-works" className="hover:text-red-400">How It Works</Link>

              <Link href="/contact" className="hover:text-red-400">Contact</Link>
              <Link href="/support" className="hover:text-red-400">Support</Link>
              <Link href="/login" className="hover:text-red-400">Login</Link>
            </nav>
            <div className="md:hidden">
              <button className="text-white focus:outline-none">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              </button>
            </div>
          </div>
        </header>
      )}

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-gray-800 text-white py-8 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold text-red-400 mb-4">TeamUp India</h3>
            <p>Connecting players, coaches, stores, and delivery partners in the sports ecosystem.</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="hover:text-red-400">Home</Link></li>
              <li><Link href="/about" className="hover:text-red-400">About</Link></li>
              <li><Link href="/features" className="hover:text-red-400">Features</Link></li>
              <li><Link href="/contact" className="hover:text-red-400">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">User Types</h4>
            <ul className="space-y-2">
              <li><Link href="/coach/register" className="hover:text-red-400">Coaches</Link></li>
              <li><Link href="/store/register" className="hover:text-red-400">Stores</Link></li>
              <li><Link href="/delivery/register" className="hover:text-red-400">Delivery Partners</Link></li>
              <li><Link href="/login" className="hover:text-red-400">Players</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="hover:text-red-400">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-red-400">Terms of Service</Link></li>
              <li><Link href="/help" className="hover:text-red-400">Help Center</Link></li>
              <li><Link href="/support" className="hover:text-red-400">Support Tickets</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-gray-700 text-center">
          <p>&copy; {new Date().getFullYear()} TeamUp India. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;