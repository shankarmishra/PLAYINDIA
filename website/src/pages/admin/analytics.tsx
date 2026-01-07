import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/Layout';

export default function AdminAnalytics() {
  return (
    <Layout title="Admin Analytics - TeamUp India" description="Admin panel for platform analytics and reporting" showNav={false}>
      <Head>
        <title>Admin Analytics - TeamUp India</title>
        <meta name="description" content="Admin panel for platform analytics and reporting" />
      </Head>

      {/* Admin Navigation */}
      <nav className="bg-gray-900 text-white py-4 px-6 flex justify-between items-center">
        <div className="text-xl font-bold text-red-400">TeamUp India Admin</div>
        <div className="flex space-x-6">
          <Link href="/admin" className="hover:text-red-400">Dashboard</Link>
          <Link href="/admin/approvals" className="hover:text-red-400">Approvals</Link>
          <Link href="/admin/users" className="hover:text-red-400">Users</Link>
          <Link href="/admin/analytics" className="hover:text-red-400">Analytics</Link>
          <Link href="/admin/settings" className="hover:text-red-400">Settings</Link>
          <Link href="/admin/logout" className="hover:text-red-400">Logout</Link>
        </div>
      </nav>

      {/* Admin Analytics Hero */}
      <section className="py-20 px-6 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">Platform Analytics</h1>
          <p className="text-xl text-gray-300">Comprehensive analytics and reporting for platform performance</p>
        </div>
      </section>

      {/* Analytics Overview */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Platform Metrics</h2>
            <div className="flex space-x-4">
              <select className="border border-gray-300 rounded-lg px-4 py-2">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
                <option>Last 90 Days</option>
                <option>Custom Range</option>
              </select>
              <button className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition duration-300">
                Export Report
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
              <h3 className="text-2xl font-bold text-blue-700">10,248</h3>
              <p className="text-gray-600">Total Users</p>
              <p className="text-sm text-green-600 mt-2">↑ 12% from last month</p>
            </div>
            <div className="bg-green-50 p-6 rounded-xl border border-green-200">
              <h3 className="text-2xl font-bold text-green-700">₹2,45,000</h3>
              <p className="text-gray-600">Revenue (Monthly)</p>
              <p className="text-sm text-green-600 mt-2">↑ 18% from last month</p>
            </div>
            <div className="bg-orange-50 p-6 rounded-xl border border-orange-200">
              <h3 className="text-2xl font-bold text-orange-700">1,248</h3>
              <p className="text-gray-600">Orders (Monthly)</p>
              <p className="text-sm text-green-600 mt-2">↑ 22% from last month</p>
            </div>
            <div className="bg-purple-50 p-6 rounded-xl border border-purple-200">
              <h3 className="text-2xl font-bold text-purple-700">4.8</h3>
              <p className="text-gray-600">Avg. Rating</p>
              <p className="text-sm text-green-600 mt-2">↑ 0.2 from last month</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Revenue Overview</h3>
              <div className="h-64 flex items-end space-x-2 justify-center">
                <div className="w-8 bg-blue-500 rounded-t" style={{height: '60%'}}></div>
                <div className="w-8 bg-green-500 rounded-t" style={{height: '80%'}}></div>
                <div className="w-8 bg-purple-500 rounded-t" style={{height: '70%'}}></div>
                <div className="w-8 bg-orange-500 rounded-t" style={{height: '90%'}}></div>
                <div className="w-8 bg-red-500 rounded-t" style={{height: '75%'}}></div>
              </div>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">User Growth</h3>
              <div className="h-64 flex items-end space-x-2 justify-center">
                <div className="w-8 bg-blue-500 rounded-t" style={{height: '30%'}}></div>
                <div className="w-8 bg-green-500 rounded-t" style={{height: '50%'}}></div>
                <div className="w-8 bg-purple-500 rounded-t" style={{height: '70%'}}></div>
                <div className="w-8 bg-orange-500 rounded-t" style={{height: '85%'}}></div>
                <div className="w-8 bg-red-500 rounded-t" style={{height: '95%'}}></div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">User Distribution</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Players</span>
                  <span className="font-semibold">65%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{width: '65%'}}></div>
                </div>
                <div className="flex justify-between">
                  <span>Coaches</span>
                  <span className="font-semibold">20%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{width: '20%'}}></div>
                </div>
                <div className="flex justify-between">
                  <span>Stores</span>
                  <span className="font-semibold">10%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-orange-500 h-2 rounded-full" style={{width: '10%'}}></div>
                </div>
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span className="font-semibold">5%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{width: '5%'}}></div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Top Performing Sports</h3>
              <ul className="space-y-3">
                <li className="flex justify-between">
                  <span>Cricket</span>
                  <span className="font-semibold">32%</span>
                </li>
                <li className="flex justify-between">
                  <span>Football</span>
                  <span className="font-semibold">25%</span>
                </li>
                <li className="flex justify-between">
                  <span>Tennis</span>
                  <span className="font-semibold">18%</span>
                </li>
                <li className="flex justify-between">
                  <span>Badminton</span>
                  <span className="font-semibold">15%</span>
                </li>
                <li className="flex justify-between">
                  <span>Other</span>
                  <span className="font-semibold">10%</span>
                </li>
              </ul>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Active Sessions</h3>
              <div className="h-64 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-500">1,248</div>
                  <p className="mt-2 text-gray-600">Currently Active</p>
                  <div className="mt-4 text-sm text-gray-500">
                    <p>Players: 856</p>
                    <p>Coaches: 234</p>
                    <p>Stores: 128</p>
                    <p>Delivery: 30</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Analytics Actions */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Analytics Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Generate Reports</h3>
              <p className="text-gray-600 mb-4">Create detailed reports for business insights.</p>
              <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition duration-300">
                Generate Report
              </button>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Export Data</h3>
              <p className="text-gray-600 mb-4">Export analytics data for further analysis.</p>
              <button className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition duration-300">
                Export Data
              </button>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Set Alerts</h3>
              <p className="text-gray-600 mb-4">Configure alerts for important metrics.</p>
              <button className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-lg transition duration-300">
                Configure Alerts
              </button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}