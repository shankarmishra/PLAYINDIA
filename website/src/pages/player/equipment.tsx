import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/Layout';

const PlayerEquipmentPage = () => {
  const [activeTab, setActiveTab] = useState('browse');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  return (
    <Layout title="Player Equipment - TeamUp India" description="Buy quality sports equipment as a player">
      <Head>
        <title>Player Equipment - TeamUp India</title>
        <meta name="description" content="Buy quality sports equipment as a player" />
      </Head>

      {/* Player Navigation */}
      <nav className="bg-gray-900 text-white py-4 px-6 flex justify-between items-center">
        <div className="text-xl font-bold text-red-400">TeamUp India Player Portal</div>
        <div className="flex space-x-6">
          <Link href="/profile" className="hover:text-red-400">Dashboard</Link>
          <Link href="/player/fitness" className="hover:text-red-400">Fitness Tracker</Link>
          <Link href="/player/tournaments" className="hover:text-red-400">Tournaments</Link>
          <Link href="/player/bookings" className="hover:text-red-400">Bookings</Link>
          <Link href="/player/equipment" className="hover:text-red-400 font-medium underline">Equipment</Link>
          <Link href="/profile" className="hover:text-red-400">Profile</Link>
          <Link href="/logout" className="hover:text-red-400">Logout</Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-8 px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Sports Equipment</h1>
          <p className="text-gray-600">Buy quality sports equipment from verified stores</p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('browse')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'browse'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Browse Products
            </button>
            <button
              onClick={() => setActiveTab('my-orders')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'my-orders'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              My Orders
            </button>
            <button
              onClick={() => setActiveTab('cart')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'cart'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Cart (3)
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'browse' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="w-full md:w-1/2">
                <input
                  type="text"
                  placeholder="Search equipment by name, brand, or sport..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                />
              </div>
              <div className="flex space-x-2">
                <select 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                >
                  <option value="">All Categories</option>
                  <option value="cricket">Cricket</option>
                  <option value="football">Football</option>
                  <option value="tennis">Tennis</option>
                  <option value="badminton">Badminton</option>
                  <option value="basketball">Basketball</option>
                  <option value="athletic">Athletic Wear</option>
                  <option value="accessories">Accessories</option>
                </select>
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500">
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Top Rated</option>
                  <option>Newest First</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-48 mx-auto mb-4" />
                <h3 className="font-bold text-lg">Pro Cricket Bat</h3>
                <p className="text-gray-600 text-sm mb-2">SG Pro Series</p>
                <div className="flex items-center mb-2">
                  <span className="text-yellow-400">★</span>
                  <span className="text-yellow-400">★</span>
                  <span className="text-yellow-400">★</span>
                  <span className="text-yellow-400">★</span>
                  <span className="text-gray-300">★</span>
                  <span className="ml-1 text-gray-500 text-sm">(4.2)</span>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <span className="font-bold text-lg">₹2,499</span>
                  <button className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 text-sm">
                    Add to Cart
                  </button>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-48 mx-auto mb-4" />
                <h3 className="font-bold text-lg">Wilson Tennis Racket</h3>
                <p className="text-gray-600 text-sm mb-2">Ultra Team 2.0</p>
                <div className="flex items-center mb-2">
                  <span className="text-yellow-400">★</span>
                  <span className="text-yellow-400">★</span>
                  <span className="text-yellow-400">★</span>
                  <span className="text-yellow-400">★</span>
                  <span className="text-yellow-400">★</span>
                  <span className="ml-1 text-gray-500 text-sm">(4.8)</span>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <span className="font-bold text-lg">₹3,299</span>
                  <button className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 text-sm">
                    Add to Cart
                  </button>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-48 mx-auto mb-4" />
                <h3 className="font-bold text-lg">Yonex Badminton Set</h3>
                <p className="text-gray-600 text-sm mb-2">Nanoray 800</p>
                <div className="flex items-center mb-2">
                  <span className="text-yellow-400">★</span>
                  <span className="text-yellow-400">★</span>
                  <span className="text-yellow-400">★</span>
                  <span className="text-yellow-400">★</span>
                  <span className="text-gray-300">★</span>
                  <span className="ml-1 text-gray-500 text-sm">(4.0)</span>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <span className="font-bold text-lg">₹1,899</span>
                  <button className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 text-sm">
                    Add to Cart
                  </button>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-48 mx-auto mb-4" />
                <h3 className="font-bold text-lg">Adidas Football</h3>
                <p className="text-gray-600 text-sm mb-2">FIFA World Cup</p>
                <div className="flex items-center mb-2">
                  <span className="text-yellow-400">★</span>
                  <span className="text-yellow-400">★</span>
                  <span className="text-yellow-400">★</span>
                  <span className="text-yellow-400">★</span>
                  <span className="text-gray-300">★</span>
                  <span className="ml-1 text-gray-500 text-sm">(4.5)</span>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <span className="font-bold text-lg">₹1,299</span>
                  <button className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 text-sm">
                    Add to Cart
                  </button>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-48 mx-auto mb-4" />
                <h3 className="font-bold text-lg">Nike Basketball</h3>
                <p className="text-gray-600 text-sm mb-2">Elite Series</p>
                <div className="flex items-center mb-2">
                  <span className="text-yellow-400">★</span>
                  <span className="text-yellow-400">★</span>
                  <span className="text-yellow-400">★</span>
                  <span className="text-yellow-400">★</span>
                  <span className="text-gray-300">★</span>
                  <span className="ml-1 text-gray-500 text-sm">(4.3)</span>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <span className="font-bold text-lg">₹999</span>
                  <button className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 text-sm">
                    Add to Cart
                  </button>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-48 mx-auto mb-4" />
                <h3 className="font-bold text-lg">Puma Tracksuit</h3>
                <p className="text-gray-600 text-sm mb-2">Men's Fitness</p>
                <div className="flex items-center mb-2">
                  <span className="text-yellow-400">★</span>
                  <span className="text-yellow-400">★</span>
                  <span className="text-yellow-400">★</span>
                  <span className="text-yellow-400">★</span>
                  <span className="text-gray-300">★</span>
                  <span className="ml-1 text-gray-500 text-sm">(4.1)</span>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <span className="font-bold text-lg">₹2,199</span>
                  <button className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 text-sm">
                    Add to Cart
                  </button>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-48 mx-auto mb-4" />
                <h3 className="font-bold text-lg">Mongoose Helmet</h3>
                <p className="text-gray-600 text-sm mb-2">Cricket Safety</p>
                <div className="flex items-center mb-2">
                  <span className="text-yellow-400">★</span>
                  <span className="text-yellow-400">★</span>
                  <span className="text-yellow-400">★</span>
                  <span className="text-yellow-400">★</span>
                  <span className="text-gray-300">★</span>
                  <span className="ml-1 text-gray-500 text-sm">(4.6)</span>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <span className="font-bold text-lg">₹1,499</span>
                  <button className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 text-sm">
                    Add to Cart
                  </button>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-48 mx-auto mb-4" />
                <h3 className="font-bold text-lg">Head Tennis Balls</h3>
                <p className="text-gray-600 text-sm mb-2">Premium Set</p>
                <div className="flex items-center mb-2">
                  <span className="text-yellow-400">★</span>
                  <span className="text-yellow-400">★</span>
                  <span className="text-yellow-400">★</span>
                  <span className="text-yellow-400">★</span>
                  <span className="text-gray-300">★</span>
                  <span className="ml-1 text-gray-500 text-sm">(4.4)</span>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <span className="font-bold text-lg">₹899</span>
                  <button className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 text-sm">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'my-orders' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">My Orders</h2>
              <p className="text-gray-600">Track your recent purchases</p>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">#ORD-001234</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-8 h-8" />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">Pro Cricket Bat</div>
                          <div className="text-sm text-gray-500">SG Pro Series</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">May 15, 2024</td>
                    <td className="px-6 py-4 whitespace-nowrap">₹2,499</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Delivered</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button className="text-blue-600 hover:underline mr-3">Track</button>
                      <button className="text-green-600 hover:underline">Review</button>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">#ORD-001233</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-8 h-8" />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">Wilson Tennis Racket</div>
                          <div className="text-sm text-gray-500">Ultra Team 2.0</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">May 10, 2024</td>
                    <td className="px-6 py-4 whitespace-nowrap">₹3,299</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Shipped</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button className="text-blue-600 hover:underline mr-3">Track</button>
                      <button className="text-gray-500">Cancel</button>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">#ORD-001232</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-8 h-8" />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">Yonex Badminton Set</div>
                          <div className="text-sm text-gray-500">Nanoray 800</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">May 5, 2024</td>
                    <td className="px-6 py-4 whitespace-nowrap">₹1,899</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">Processing</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button className="text-blue-600 hover:underline mr-3">Track</button>
                      <button className="text-gray-500">Cancel</button>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">#ORD-001231</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-8 h-8" />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">Adidas Football</div>
                          <div className="text-sm text-gray-500">FIFA World Cup</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">Apr 28, 2024</td>
                    <td className="px-6 py-4 whitespace-nowrap">₹1,299</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Delivered</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button className="text-blue-600 hover:underline mr-3">Track</button>
                      <button className="text-green-600 hover:underline">Review</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'cart' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Shopping Cart</h2>
              <p className="text-gray-600">3 items in your cart</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                <div className="space-y-6">
                  <div className="flex items-center border-b pb-4">
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-20 h-20" />
                    <div className="ml-4 flex-1">
                      <h3 className="font-bold">Pro Cricket Bat</h3>
                      <p className="text-gray-600 text-sm">SG Pro Series</p>
                      <div className="flex items-center mt-2">
                        <span className="font-bold">₹2,499</span>
                        <div className="ml-4 flex items-center">
                          <button className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full">-</button>
                          <span className="mx-2">1</span>
                          <button className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full">+</button>
                        </div>
                      </div>
                    </div>
                    <button className="text-red-600 hover:text-red-800">
                      Remove
                    </button>
                  </div>

                  <div className="flex items-center border-b pb-4">
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-20 h-20" />
                    <div className="ml-4 flex-1">
                      <h3 className="font-bold">Wilson Tennis Racket</h3>
                      <p className="text-gray-600 text-sm">Ultra Team 2.0</p>
                      <div className="flex items-center mt-2">
                        <span className="font-bold">₹3,299</span>
                        <div className="ml-4 flex items-center">
                          <button className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full">-</button>
                          <span className="mx-2">1</span>
                          <button className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full">+</button>
                        </div>
                      </div>
                    </div>
                    <button className="text-red-600 hover:text-red-800">
                      Remove
                    </button>
                  </div>

                  <div className="flex items-center">
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-20 h-20" />
                    <div className="ml-4 flex-1">
                      <h3 className="font-bold">Yonex Badminton Set</h3>
                      <p className="text-gray-600 text-sm">Nanoray 800</p>
                      <div className="flex items-center mt-2">
                        <span className="font-bold">₹1,899</span>
                        <div className="ml-4 flex items-center">
                          <button className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full">-</button>
                          <span className="mx-2">1</span>
                          <button className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full">+</button>
                        </div>
                      </div>
                    </div>
                    <button className="text-red-600 hover:text-red-800">
                      Remove
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="font-bold text-lg text-gray-900 mb-4">Order Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹7,697</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span>₹99</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>₹587</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>₹8,383</span>
                  </div>
                </div>
                <button className="w-full bg-red-600 text-white font-bold py-3 mt-6 rounded-lg hover:bg-red-700">
                  Proceed to Checkout
                </button>
                <button className="w-full bg-gray-200 text-gray-800 font-bold py-3 mt-3 rounded-lg hover:bg-gray-300">
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default PlayerEquipmentPage;