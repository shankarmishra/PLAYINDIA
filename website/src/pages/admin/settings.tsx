import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import AdminNav from '../../components/AdminNav';

const AdminSettings = () => {
  const router = useRouter();
  const [adminInfo, setAdminInfo] = useState<any>(null);
  const [settings, setSettings] = useState({
    platformName: 'TeamUp India',
    defaultCurrency: 'INR',
    defaultTimezone: 'Asia/Kolkata',
    coachCommission: 15,
    storeCommission: 10,
    deliveryCommission: 5,
    coachRegistration: true,
    storeRegistration: true,
    deliveryRegistration: true,
    tournamentFeature: true,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const adminToken = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
    const adminData = typeof window !== 'undefined' ? localStorage.getItem('admin') : null;

    if (!adminToken || !adminData) {
      router.push('/admin/login');
      return;
    }

    try {
      setAdminInfo(JSON.parse(adminData));
    } catch (e) {
      console.error('Error parsing admin data:', e);
    }
  }, [router]);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // TODO: Implement API call to save settings
    setTimeout(() => {
      alert('Settings saved successfully!');
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Admin Settings - TeamUp India</title>
        <meta name="description" content="Admin panel for platform settings and configuration" />
      </Head>

      <AdminNav adminInfo={adminInfo} />

      <div className="max-w-7xl mx-auto py-8 px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Platform Settings</h1>
          <p className="text-gray-600">Configure platform settings and manage system configuration</p>
        </div>

        <form onSubmit={handleSaveSettings}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">General Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Platform Name</label>
                  <input
                    type="text"
                    value={settings.platformName}
                    onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Default Currency</label>
                  <select
                    value={settings.defaultCurrency}
                    onChange={(e) => setSettings({ ...settings, defaultCurrency: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Default Timezone</label>
                  <select
                    value={settings.defaultTimezone}
                    onChange={(e) => setSettings({ ...settings, defaultTimezone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="Asia/Kolkata">(GMT+05:30) India Standard Time</option>
                    <option value="UTC">(GMT+00:00) GMT</option>
                    <option value="America/New_York">(GMT-05:00) EST</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Commission Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Coach Commission (%)</label>
                  <input
                    type="number"
                    value={settings.coachCommission}
                    onChange={(e) => setSettings({ ...settings, coachCommission: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Store Commission (%)</label>
                  <input
                    type="number"
                    value={settings.storeCommission}
                    onChange={(e) => setSettings({ ...settings, storeCommission: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Delivery Commission (%)</label>
                  <input
                    type="number"
                    value={settings.deliveryCommission}
                    onChange={(e) => setSettings({ ...settings, deliveryCommission: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-8">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Feature Management</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="coachRegistration"
                  checked={settings.coachRegistration}
                  onChange={(e) => setSettings({ ...settings, coachRegistration: e.target.checked })}
                  className="h-4 w-4 text-red-500 focus:ring-red-500 border-gray-300 rounded"
                />
                <label htmlFor="coachRegistration" className="ml-2 block text-gray-700">
                  Coach Registration
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="storeRegistration"
                  checked={settings.storeRegistration}
                  onChange={(e) => setSettings({ ...settings, storeRegistration: e.target.checked })}
                  className="h-4 w-4 text-red-500 focus:ring-red-500 border-gray-300 rounded"
                />
                <label htmlFor="storeRegistration" className="ml-2 block text-gray-700">
                  Store Registration
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="deliveryRegistration"
                  checked={settings.deliveryRegistration}
                  onChange={(e) => setSettings({ ...settings, deliveryRegistration: e.target.checked })}
                  className="h-4 w-4 text-red-500 focus:ring-red-500 border-gray-300 rounded"
                />
                <label htmlFor="deliveryRegistration" className="ml-2 block text-gray-700">
                  Delivery Registration
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="tournamentFeature"
                  checked={settings.tournamentFeature}
                  onChange={(e) => setSettings({ ...settings, tournamentFeature: e.target.checked })}
                  className="h-4 w-4 text-red-500 focus:ring-red-500 border-gray-300 rounded"
                />
                <label htmlFor="tournamentFeature" className="ml-2 block text-gray-700">
                  Tournament Feature
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-center space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-red-500 hover:bg-red-600 text-white py-3 px-8 rounded-lg font-semibold transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 px-8 rounded-lg font-semibold transition duration-300"
            >
              Reset to Default
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminSettings;
