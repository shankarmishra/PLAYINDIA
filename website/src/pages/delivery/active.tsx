import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/Layout';

export default function DeliveryActive() {
  return (
    <Layout title="Active Deliveries - TeamUp India" description="Manage your active deliveries and track progress">
      <Head>
        <title>Active Deliveries - TeamUp India</title>
        <meta name="description" content="Manage your active deliveries and track progress" />
      </Head>

      {/* Active Deliveries Hero */}
      <section className="py-20 px-6 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">Active Deliveries</h1>
          <p className="text-xl text-gray-300">Manage your current deliveries and track progress</p>
        </div>
      </section>

      {/* Active Deliveries List */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Current Deliveries</h2>
            <div className="flex items-center">
              <span className="mr-4 text-gray-600">Status:</span>
              <select className="border border-gray-300 rounded-lg px-4 py-2">
                <option>All</option>
                <option>On the way</option>
                <option>Pending pickup</option>
                <option>Delivered</option>
              </select>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">Cricket Kit Delivery</h3>
                  <p className="text-gray-600 mt-1">To: Rahul Sharma, 42 MG Road, Mumbai</p>
                  <p className="text-gray-600">Order #ORD-789456, Placed: Jan 10, 2026</p>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    On the way
                  </span>
                  <p className="mt-2 font-semibold text-gray-800">₹1,200</p>
                </div>
              </div>
              <div className="mt-4 flex justify-between">
                <div className="flex space-x-4">
                  <button className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition duration-300">
                    Start Navigation
                  </button>
                  <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition duration-300">
                    Contact Customer
                  </button>
                </div>
                <button className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-lg transition duration-300">
                  Mark as Delivered
                </button>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">Tennis Racket Delivery</h3>
                  <p className="text-gray-600 mt-1">To: Priya Patel, 15 Park Street, Kolkata</p>
                  <p className="text-gray-600">Order #ORD-123789, Placed: Jan 10, 2026</p>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                    Pending pickup
                  </span>
                  <p className="mt-2 font-semibold text-gray-800">₹850</p>
                </div>
              </div>
              <div className="mt-4 flex justify-between">
                <div className="flex space-x-4">
                  <button className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition duration-300">
                    Go to Pickup
                  </button>
                  <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition duration-300">
                    Contact Store
                  </button>
                </div>
                <button className="bg-gray-300 text-gray-500 py-2 px-4 rounded-lg transition duration-300 cursor-not-allowed">
                  Mark as Delivered
                </button>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">Yoga Mat Delivery</h3>
                  <p className="text-gray-600 mt-1">To: Amit Kumar, 23 Connaught Place, Delhi</p>
                  <p className="text-gray-600">Order #ORD-456123, Placed: Jan 10, 2026</p>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    On the way
                  </span>
                  <p className="mt-2 font-semibold text-gray-800">₹600</p>
                </div>
              </div>
              <div className="mt-4 flex justify-between">
                <div className="flex space-x-4">
                  <button className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition duration-300">
                    Start Navigation
                  </button>
                  <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition duration-300">
                    Contact Customer
                  </button>
                </div>
                <button className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-lg transition duration-300">
                  Mark as Delivered
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Delivery Stats */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Delivery Performance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div className="bg-white p-6 rounded-xl border border-gray-200 text-center">
              <h3 className="text-2xl font-bold text-blue-700">24</h3>
              <p className="text-gray-600">Deliveries Today</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200 text-center">
              <h3 className="text-2xl font-bold text-green-700">₹6,500</h3>
              <p className="text-gray-600">Earnings Today</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200 text-center">
              <h3 className="text-2xl font-bold text-orange-700">98%</h3>
              <p className="text-gray-600">On-time Rate</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200 text-center">
              <h3 className="text-2xl font-bold text-purple-700">4.9</h3>
              <p className="text-gray-600">Avg. Rating</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Today's Route</h3>
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-64 flex items-center justify-center">
              <span className="text-gray-500">Map showing delivery locations</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-gradient-to-r from-green-500 to-blue-500 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready for More Deliveries?</h2>
          <p className="text-xl mb-8">Accept more deliveries to increase your earnings.</p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button className="bg-white text-green-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold transition duration-300">
              Go Online
            </button>
            <Link href="/delivery/history" className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-lg font-semibold transition duration-300">
              View History
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}