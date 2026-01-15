import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import AdminNav from '../../components/AdminNav';

const AdminCommissions = () => {
  const router = useRouter();
  const [adminInfo, setAdminInfo] = useState<any>(null);
  const [commissionRates, setCommissionRates] = useState({
    coach: 15,
    store: 10,
    delivery: 5,
    tournament: 20,
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

  const handleUpdateRates = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // TODO: Implement API call to save commission rates
    setTimeout(() => {
      alert('Commission rates updated successfully!');
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Commission Management - TeamUp India Admin</title>
        <meta name="description" content="Manage commission rates and view payout reports" />
      </Head>

      <AdminNav adminInfo={adminInfo} />

      <div className="max-w-7xl mx-auto py-8 px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Commission Management</h1>
          <p className="text-gray-600">Set commission rates and manage payout reports</p>
        </div>

        {/* Commission Settings */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Current Commission Rates</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Coach Bookings</span>
                <span className="font-bold">{commissionRates.coach}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Store Sales</span>
                <span className="font-bold">{commissionRates.store}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Delivery Fees</span>
                <span className="font-bold">{commissionRates.delivery}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Tournament Entry</span>
                <span className="font-bold">{commissionRates.tournament}%</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md lg:col-span-2">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Update Commission Rates</h2>
            <form onSubmit={handleUpdateRates} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">Coach Bookings (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={commissionRates.coach}
                    onChange={(e) => setCommissionRates({ ...commissionRates, coach: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Store Sales (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={commissionRates.store}
                    onChange={(e) => setCommissionRates({ ...commissionRates, store: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Delivery Fees (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={commissionRates.delivery}
                    onChange={(e) => setCommissionRates({ ...commissionRates, delivery: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Tournament Entry (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={commissionRates.tournament}
                    onChange={(e) => setCommissionRates({ ...commissionRates, tournament: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                  />
                </div>
              </div>
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-red-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Updating...' : 'Update Rates'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Export Options */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Export Reports</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="bg-gray-100 hover:bg-gray-200 p-4 rounded-lg text-center transition duration-300">
              <div className="text-2xl mb-2">📊</div>
              <h3 className="font-semibold">Revenue Report</h3>
            </button>
            <button className="bg-gray-100 hover:bg-gray-200 p-4 rounded-lg text-center transition duration-300">
              <div className="text-2xl mb-2">📋</div>
              <h3 className="font-semibold">Commission Report</h3>
            </button>
            <button className="bg-gray-100 hover:bg-gray-200 p-4 rounded-lg text-center transition duration-300">
              <div className="text-2xl mb-2">📁</div>
              <h3 className="font-semibold">Full Financial Data</h3>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCommissions;
