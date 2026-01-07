import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/Layout';

export default function StoreProducts() {
  return (
    <Layout title="Store Products - TeamUp India" description="Manage your sports equipment products and inventory">
      <Head>
        <title>Store Products - TeamUp India</title>
        <meta name="description" content="Manage your sports equipment products and inventory" />
      </Head>

      {/* Store Products Hero */}
      <section className="py-20 px-6 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">Manage Products</h1>
          <p className="text-xl text-gray-300">Add, edit, and manage your sports equipment inventory</p>
        </div>
      </section>

      {/* Products Actions */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Your Products</h2>
            <button className="bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg font-semibold transition duration-300">
              Add New Product
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-48 mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Cricket Bat</h3>
              <p className="text-gray-600 mb-2">Premium willow cricket bat for professional play</p>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-green-600">₹3,500</span>
                <div className="flex space-x-2">
                  <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm">Edit</button>
                  <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm">Delete</button>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-48 mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Tennis Racket</h3>
              <p className="text-gray-600 mb-2">Professional tennis racket with advanced grip</p>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-green-600">₹2,800</span>
                <div className="flex space-x-2">
                  <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm">Edit</button>
                  <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm">Delete</button>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-48 mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Yoga Mat</h3>
              <p className="text-gray-600 mb-2">Non-slip yoga mat for comfortable practice</p>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-green-600">₹800</span>
                <div className="flex space-x-2">
                  <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm">Edit</button>
                  <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm">Delete</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Product Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm text-center">
              <div className="text-4xl mb-4">🏏</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Cricket</h3>
              <p className="text-gray-600 mb-4">Bats, balls, stumps, pads, etc.</p>
              <button className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition duration-300">
                View Products
              </button>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm text-center">
              <div className="text-4xl mb-4">⚽</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Football</h3>
              <p className="text-gray-600 mb-4">Footballs, shin guards, etc.</p>
              <button className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition duration-300">
                View Products
              </button>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm text-center">
              <div className="text-4xl mb-4">🎾</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Tennis</h3>
              <p className="text-gray-600 mb-4">Rackets, balls, nets, etc.</p>
              <button className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition duration-300">
                View Products
              </button>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm text-center">
              <div className="text-4xl mb-4">🏸</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Badminton</h3>
              <p className="text-gray-600 mb-4">Rackets, shuttles, nets, etc.</p>
              <button className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition duration-300">
                View Products
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Inventory Management */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Inventory Management</h2>
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Low Stock Alerts</h3>
            <ul className="space-y-3">
              <li className="flex justify-between items-center">
                <span>Cricket Balls</span>
                <span className="font-semibold text-red-500">Only 3 left</span>
              </li>
              <li className="flex justify-between items-center">
                <span>Tennis Balls</span>
                <span className="font-semibold text-red-500">Only 7 left</span>
              </li>
              <li className="flex justify-between items-center">
                <span>Badminton Shuttles</span>
                <span className="font-semibold text-red-500">Only 2 left</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-gradient-to-r from-green-500 to-blue-500 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Expand Your Product Range</h2>
          <p className="text-xl mb-8">Add more products to attract more customers.</p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button className="bg-white text-green-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold transition duration-300">
              Add Products
            </button>
            <Link href="/store/settings" className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-lg font-semibold transition duration-300">
              Settings
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}