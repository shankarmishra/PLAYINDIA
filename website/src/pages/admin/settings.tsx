import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/Layout';

export default function AdminSettings() {
  return (
    <Layout title="Admin Settings - TeamUp India" description="Admin panel for platform settings and configuration" showNav={false}>
      <Head>
        <title>Admin Settings - TeamUp India</title>
        <meta name="description" content="Admin panel for platform settings and configuration" />
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

      {/* Admin Settings Hero */}
      <section className="py-20 px-6 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">Platform Settings</h1>
          <p className="text-xl text-gray-300">Configure platform settings and manage system configuration</p>
        </div>
      </section>

      {/* Settings Overview */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">System Configuration</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">General Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Platform Name</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" 
                    defaultValue="TeamUp India" 
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Default Currency</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500">
                    <option>INR (₹)</option>
                    <option>USD ($)</option>
                    <option>EUR (€)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Default Timezone</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500">
                    <option>(GMT+05:30) India Standard Time</option>
                    <option>(GMT+00:00) GMT</option>
                    <option>(GMT-05:00) EST</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Commission Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Coach Commission (%)</label>
                  <input 
                    type="number" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" 
                    defaultValue="15" 
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Store Commission (%)</label>
                  <input 
                    type="number" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" 
                    defaultValue="10" 
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Delivery Commission (%)</label>
                  <input 
                    type="number" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" 
                    defaultValue="5" 
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Feature Management</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="coachRegistration" 
                  className="h-4 w-4 text-red-500 focus:ring-red-500 border-gray-300 rounded" 
                  defaultChecked
                />
                <label htmlFor="coachRegistration" className="ml-2 block text-gray-700">
                  Coach Registration
                </label>
              </div>
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="storeRegistration" 
                  className="h-4 w-4 text-red-500 focus:ring-red-500 border-gray-300 rounded" 
                  defaultChecked
                />
                <label htmlFor="storeRegistration" className="ml-2 block text-gray-700">
                  Store Registration
                </label>
              </div>
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="deliveryRegistration" 
                  className="h-4 w-4 text-red-500 focus:ring-red-500 border-gray-300 rounded" 
                  defaultChecked
                />
                <label htmlFor="deliveryRegistration" className="ml-2 block text-gray-700">
                  Delivery Registration
                </label>
              </div>
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="tournamentFeature" 
                  className="h-4 w-4 text-red-500 focus:ring-red-500 border-gray-300 rounded" 
                  defaultChecked
                />
                <label htmlFor="tournamentFeature" className="ml-2 block text-gray-700">
                  Tournament Feature
                </label>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3D Model Visualization */}
      <section className="py-16 px-6 bg-gradient-to-r from-blue-900 to-purple-900 text-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">3D Model Management</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg text-center">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-48 mx-auto mb-3 flex items-center justify-center">
                <span className="text-gray-700 text-sm">3D Cricket Model</span>
              </div>
              <h3 className="font-bold mb-1">Cricket Arena</h3>
              <p className="text-sm text-gray-200">Virtual training environment</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg text-center">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-48 mx-auto mb-3 flex items-center justify-center">
                <span className="text-gray-700 text-sm">3D Football Model</span>
              </div>
              <h3 className="font-bold mb-1">Football Field</h3>
              <p className="text-sm text-gray-200">Virtual training environment</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg text-center">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-48 mx-auto mb-3 flex items-center justify-center">
                <span className="text-gray-700 text-sm">3D Tennis Model</span>
              </div>
              <h3 className="font-bold mb-1">Tennis Court</h3>
              <p className="text-sm text-gray-200">Virtual training environment</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg text-center">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-48 mx-auto mb-3 flex items-center justify-center">
                <span className="text-gray-700 text-sm">3D Badminton Model</span>
              </div>
              <h3 className="font-bold mb-1">Badminton Hall</h3>
              <p className="text-sm text-gray-200">Virtual training environment</p>
            </div>
          </div>
          
          <div className="text-center mb-12">
            <h3 className="text-xl font-bold mb-4">Platform 3D Assets</h3>
            <p className="max-w-3xl mx-auto mb-6 text-gray-200">
              Manage and deploy 3D models for immersive sports experiences across the platform. 
              Configure rendering settings, optimize performance, and track usage analytics.
            </p>
            <div className="flex justify-center space-x-4">
              <button className="bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded-lg font-semibold transition duration-300">
                Upload New Model
              </button>
              <button className="bg-white/20 hover:bg-white/30 text-white py-2 px-6 rounded-lg font-semibold transition duration-300">
                View Analytics
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Security Settings */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Security Settings</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Admin Security</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Session Timeout (minutes)</label>
                  <input 
                    type="number" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" 
                    defaultValue="30" 
                  />
                </div>
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="twoFactorAuth" 
                    className="h-4 w-4 text-red-500 focus:ring-red-500 border-gray-300 rounded" 
                    defaultChecked
                  />
                  <label htmlFor="twoFactorAuth" className="ml-2 block text-gray-700">
                    Two-Factor Authentication
                  </label>
                </div>
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="adminLoginAlerts" 
                    className="h-4 w-4 text-red-500 focus:ring-red-500 border-gray-300 rounded" 
                    defaultChecked
                  />
                  <label htmlFor="adminLoginAlerts" className="ml-2 block text-gray-700">
                    Login Alerts
                  </label>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Content Management</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Homepage Banner</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" 
                    placeholder="Enter banner text" 
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">App Announcement</label>
                  <textarea 
                    rows={3} 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" 
                    placeholder="Enter announcement text"
                  ></textarea>
                </div>
                <button className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition duration-300">
                  Update Content
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Actions */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Save Configuration</h2>
          <div className="flex justify-center space-x-4">
            <button className="bg-red-500 hover:bg-red-600 text-white py-3 px-8 rounded-lg font-semibold transition duration-300">
              Save Changes
            </button>
            <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 px-8 rounded-lg font-semibold transition duration-300">
              Reset to Default
            </button>
          </div>
        </div>
      </section>
    </Layout>
  );
}