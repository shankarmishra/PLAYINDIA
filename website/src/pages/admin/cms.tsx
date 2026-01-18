import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import AdminNav from '../../components/AdminNav';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://playindia-3.onrender.com';

const AdminCMSPage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('banners');
  const [adminInfo, setAdminInfo] = useState<any>(null);
  const [banners, setBanners] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [promotions, setPromotions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBannerModal, setShowBannerModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState<any>(null);
  const [bannerForm, setBannerForm] = useState({
    title: '',
    subtitle: '',
    image: '',
    link: '',
    linkType: 'none',
    linkId: '',
    status: 'active',
    priority: 0,
    startDate: '',
    endDate: '',
    targetAudience: ['all'],
  });

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

    fetchBanners();
  }, [router]);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const adminToken = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
      
      const response = await fetch(`${API_BASE_URL}/api/admin/banners`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setBanners(data.data || []);
        }
      }
    } catch (error) {
      console.error('Error fetching banners:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBanner = () => {
    setEditingBanner(null);
    setBannerForm({
      title: '',
      subtitle: '',
      image: '',
      link: '',
      linkType: 'none',
      linkId: '',
      status: 'active',
      priority: 0,
      startDate: '',
      endDate: '',
      targetAudience: ['all'],
    });
    setShowBannerModal(true);
  };

  const handleEditBanner = (banner: any) => {
    setEditingBanner(banner);
    setBannerForm({
      title: banner.title || '',
      subtitle: banner.subtitle || '',
      image: banner.image || '',
      link: banner.link || '',
      linkType: banner.linkType || 'none',
      linkId: banner.linkId || '',
      status: banner.status || 'active',
      priority: banner.priority || 0,
      startDate: banner.startDate ? new Date(banner.startDate).toISOString().split('T')[0] : '',
      endDate: banner.endDate ? new Date(banner.endDate).toISOString().split('T')[0] : '',
      targetAudience: banner.targetAudience || ['all'],
    });
    setShowBannerModal(true);
  };

  const handleSaveBanner = async () => {
    try {
      const adminToken = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
      
      const bannerData = {
        ...bannerForm,
        startDate: bannerForm.startDate ? new Date(bannerForm.startDate).toISOString() : undefined,
        endDate: bannerForm.endDate ? new Date(bannerForm.endDate).toISOString() : undefined,
      };

      const url = editingBanner
        ? `${API_BASE_URL}/api/admin/banners/${editingBanner._id}`
        : `${API_BASE_URL}/api/admin/banners`;

      const method = editingBanner ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bannerData),
      });

      if (response.ok) {
        await fetchBanners();
        setShowBannerModal(false);
        setEditingBanner(null);
        alert(editingBanner ? 'Banner updated successfully!' : 'Banner created successfully!');
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to save banner');
      }
    } catch (error) {
      console.error('Error saving banner:', error);
      alert('Failed to save banner. Please try again.');
    }
  };

  const handleDeleteBanner = async (bannerId: string) => {
    if (!confirm('Are you sure you want to delete this banner?')) return;

    try {
      const adminToken = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
      
      const response = await fetch(`${API_BASE_URL}/api/admin/banners/${bannerId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        await fetchBanners();
        alert('Banner deleted successfully!');
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to delete banner');
      }
    } catch (error) {
      console.error('Error deleting banner:', error);
      alert('Failed to delete banner. Please try again.');
    }
  };

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
                <button
                  onClick={handleAddBanner}
                  className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700"
                >
                  Add New Banner
                </button>
              </div>
              
              {loading ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">Loading banners...</p>
                </div>
              ) : banners.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {banners.map((banner) => (
                    <div key={banner._id || banner.id} className="border rounded-lg overflow-hidden shadow-sm">
                      <div className="relative w-full h-48 bg-gray-200">
                        {banner.image ? (
                          <img
                            src={banner.image}
                            alt={banner.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            No Image
                          </div>
                        )}
                        <div className="absolute top-2 right-2">
                          <span className={`px-2 py-1 text-xs font-semibold rounded ${
                            banner.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : banner.status === 'scheduled'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {banner.status}
                          </span>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-lg mb-1">{banner.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{banner.subtitle}</p>
                        <div className="text-xs text-gray-500 mb-4">
                          <p>Priority: {banner.priority}</p>
                          <p>Clicks: {banner.clicks || 0} | Views: {banner.views || 0}</p>
                        </div>
                        <div className="mt-4 flex space-x-2">
                          <button
                            onClick={() => handleEditBanner(banner)}
                            className="text-sm bg-gray-200 hover:bg-gray-300 py-1 px-3 rounded"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteBanner(banner._id || banner.id)}
                            className="text-sm bg-red-100 hover:bg-red-200 text-red-700 py-1 px-3 rounded"
                          >
                            Delete
                          </button>
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

      {/* Banner Modal */}
      {showBannerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">{editingBanner ? 'Edit Banner' : 'Add New Banner'}</h2>
              <button
                onClick={() => {
                  setShowBannerModal(false);
                  setEditingBanner(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  value={bannerForm.title}
                  onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Banner title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                <input
                  type="text"
                  value={bannerForm.subtitle}
                  onChange={(e) => setBannerForm({ ...bannerForm, subtitle: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Banner subtitle"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL *</label>
                <input
                  type="url"
                  value={bannerForm.image}
                  onChange={(e) => setBannerForm({ ...bannerForm, image: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="https://example.com/image.jpg"
                />
                {bannerForm.image && (
                  <img
                    src={bannerForm.image}
                    alt="Preview"
                    className="mt-2 w-full h-32 object-cover rounded"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Link Type</label>
                <select
                  value={bannerForm.linkType}
                  onChange={(e) => setBannerForm({ ...bannerForm, linkType: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="none">None</option>
                  <option value="tournament">Tournament</option>
                  <option value="product">Product</option>
                  <option value="coach">Coach</option>
                  <option value="external">External URL</option>
                </select>
              </div>

              {bannerForm.linkType !== 'none' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {bannerForm.linkType === 'external' ? 'External URL' : `${bannerForm.linkType} ID`}
                  </label>
                  <input
                    type="text"
                    value={bannerForm.linkType === 'external' ? bannerForm.link : bannerForm.linkId}
                    onChange={(e) => {
                      if (bannerForm.linkType === 'external') {
                        setBannerForm({ ...bannerForm, link: e.target.value });
                      } else {
                        setBannerForm({ ...bannerForm, linkId: e.target.value });
                      }
                    }}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder={bannerForm.linkType === 'external' ? 'https://example.com' : 'Enter ID'}
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={bannerForm.status}
                    onChange={(e) => setBannerForm({ ...bannerForm, status: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="scheduled">Scheduled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority (0-100)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={bannerForm.priority}
                    onChange={(e) => setBannerForm({ ...bannerForm, priority: parseInt(e.target.value) || 0 })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date (Optional)</label>
                  <input
                    type="date"
                    value={bannerForm.startDate}
                    onChange={(e) => setBannerForm({ ...bannerForm, startDate: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date (Optional)</label>
                  <input
                    type="date"
                    value={bannerForm.endDate}
                    onChange={(e) => setBannerForm({ ...bannerForm, endDate: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowBannerModal(false);
                  setEditingBanner(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveBanner}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                disabled={!bannerForm.title || !bannerForm.image}
              >
                {editingBanner ? 'Update Banner' : 'Create Banner'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCMSPage;
