import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/Layout';

export default function AdminUsers() {
  return (
    <Layout title="Admin Users - TeamUp India" description="Admin panel for managing platform users" showNav={false}>
      <Head>
        <title>Admin Users - TeamUp India</title>
        <meta name="description" content="Admin panel for managing platform users" />
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

      {/* Admin Users Hero */}
      <section className="py-20 px-6 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">User Management</h1>
          <p className="text-xl text-gray-300">Manage all platform users, their roles, and permissions</p>
        </div>
      </section>

      {/* Users Overview */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Platform Users</h2>
            <div className="flex space-x-4">
              <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition duration-300">
                Filter
              </button>
              <button className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition duration-300">
                Export
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
              <h3 className="text-2xl font-bold text-blue-700">10,248</h3>
              <p className="text-gray-600">Total Users</p>
            </div>
            <div className="bg-green-50 p-6 rounded-xl border border-green-200">
              <h3 className="text-2xl font-bold text-green-700">542</h3>
              <p className="text-gray-600">Active Coaches</p>
            </div>
            <div className="bg-orange-50 p-6 rounded-xl border border-orange-200">
              <h3 className="text-2xl font-bold text-orange-700">210</h3>
              <p className="text-gray-600">Active Stores</p>
            </div>
            <div className="bg-purple-50 p-6 rounded-xl border border-purple-200">
              <h3 className="text-2xl font-bold text-purple-700">98</h3>
              <p className="text-gray-600">Active Delivery</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="border-b border-gray-200 px-6 py-4 bg-gray-50">
              <h3 className="text-xl font-semibold text-gray-800">User List</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">Rahul Sharma</div>
                          <div className="text-sm text-gray-500">rahul.sharma@example.com</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">Coach</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Active</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      2026-01-05
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                      <button className="text-yellow-600 hover:text-yellow-900 mr-3">Edit</button>
                      <button className="text-red-600 hover:text-red-900">Block</button>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">Sports Hub</div>
                          <div className="text-sm text-gray-500">contact@sportshub.com</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800">Store</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Active</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      2026-01-05
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                      <button className="text-yellow-600 hover:text-yellow-900 mr-3">Edit</button>
                      <button className="text-red-600 hover:text-red-900">Block</button>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">Amit Kumar</div>
                          <div className="text-sm text-gray-500">amit.kumar@example.com</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">Delivery</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Pending</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      2026-01-06
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                      <button className="text-yellow-600 hover:text-yellow-900 mr-3">Edit</button>
                      <button className="text-red-600 hover:text-red-900">Block</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* User Actions */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">User Management Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Block Users</h3>
              <p className="text-gray-600 mb-4">Temporarily or permanently block users for violations.</p>
              <button className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition duration-300">
                Block Users
              </button>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Role Management</h3>
              <p className="text-gray-600 mb-4">Change user roles and permissions as needed.</p>
              <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition duration-300">
                Manage Roles
              </button>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">User Reports</h3>
              <p className="text-gray-600 mb-4">Review user reports and take appropriate action.</p>
              <button className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-lg transition duration-300">
                View Reports
              </button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}