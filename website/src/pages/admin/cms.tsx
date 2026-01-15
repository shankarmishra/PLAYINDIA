import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import AdminNav from '../../components/AdminNav';

const AdminCMSPage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('banners');
  const [adminInfo, setAdminInfo] = useState<any>(null);
  const [banners, setBanners] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [promotions, setPromotions] = useState<any[]>([]);

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

    // TODO: Fetch banners, announcements, promotions from API
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Content Management System - TeamUp India Admin</title>
        <meta name="description" content="Manage homepage banners, app announcements, and promotions" />
      </Head>

      <AdminNav adminInfo={adminInfo} />

      <div className="max-w-7xl mx-auto py-8 px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Content Management System</h1>
          <p className="text-gray-600">Manage homepage banners, app announcements, and promotions</p>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('banners')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'banners'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Homepage Banners
            </button>
            <button
              onClick={() => setActiveTab('announcements')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'announcements'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              App Announcements
            </button>
            <button
              onClick={() => setActiveTab('promotions')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'promotions'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Promotions
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'banners' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Homepage Banners</h2>
                <button className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700">
                  Add New Banner
                </button>
              </div>
              
              {banners.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {banners.map((banner) => (
                    <div key={banner.id} className="border rounded-lg overflow-hidden">
                      <div className="bg-gray-200 border-2 border-dashed w-full h-48" />
                      <div className="p-4">
                        <h3 className="font-bold">{banner.title}</h3>
                        <p className="text-sm text-gray-600">{banner.status}</p>
                        <div className="mt-4 flex space-x-2">
                          <button className="text-sm bg-gray-200 hover:bg-gray-300 py-1 px-3 rounded">Edit</button>
                          <button className="text-sm bg-red-100 hover:bg-red-200 text-red-700 py-1 px-3 rounded">Delete</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <p>No banners found. Click "Add New Banner" to create one.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'announcements' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">App Announcements</h2>
                <button className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700">
                  Add Announcement
                </button>
              </div>
              
              {announcements.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {announcements.map((announcement) => (
                        <tr key={announcement.id}>
                          <td className="px-6 py-4 whitespace-nowrap">{announcement.title}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{announcement.date}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              announcement.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {announcement.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button className="text-sm bg-gray-200 hover:bg-gray-300 py-1 px-3 rounded mr-2">Edit</button>
                            <button className="text-sm bg-red-100 hover:bg-red-200 text-red-700 py-1 px-3 rounded">Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <p>No announcements found. Click "Add Announcement" to create one.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'promotions' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Promotions</h2>
                <button className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700">
                  Add Promotion
                </button>
              </div>
              
              {promotions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {promotions.map((promo) => (
                    <div key={promo.id} className="border rounded-lg p-4">
                      <h3 className="font-bold text-lg">{promo.title}</h3>
                      <p className="text-gray-600">{promo.description}</p>
                      <div className="mt-4">
                        <p className="text-sm"><span className="font-semibold">Start Date:</span> {promo.startDate}</p>
                        <p className="text-sm"><span className="font-semibold">End Date:</span> {promo.endDate}</p>
                        <p className="text-sm"><span className="font-semibold">Status:</span> 
                          <span className={`ml-1 ${promo.status === 'active' ? 'text-green-600' : 'text-gray-600'} font-medium`}>
                            {promo.status}
                          </span>
                        </p>
                      </div>
                      <div className="mt-4 flex space-x-2">
                        <button className="text-sm bg-gray-200 hover:bg-gray-300 py-1 px-3 rounded">Edit</button>
                        <button className="text-sm bg-red-100 hover:bg-red-200 text-red-700 py-1 px-3 rounded">Deactivate</button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <p>No promotions found. Click "Add Promotion" to create one.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCMSPage;
