import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import AdminNav from '../../components/AdminNav';

const SecurityPage = () => {
  const router = useRouter();
  const [adminInfo, setAdminInfo] = useState<any>(null);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [loginNotifications, setLoginNotifications] = useState(true);
  const [securityEmail, setSecurityEmail] = useState('admin@playindia.com');
  const [activityLogs, setActivityLogs] = useState<any[]>([]);

  useEffect(() => {
    const adminToken = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
    const adminData = typeof window !== 'undefined' ? localStorage.getItem('admin') : null;

    if (!adminToken || !adminData) {
      router.push('/admin/login');
      return;
    }

    try {
      const parsed = JSON.parse(adminData);
      setAdminInfo(parsed);
      setSecurityEmail(parsed.email || 'admin@playindia.com');
    } catch (e) {
      console.error('Error parsing admin data:', e);
    }

    // TODO: Fetch activity logs from API
    setActivityLogs([
      { user: 'admin@playindia.com', action: 'Login', time: new Date().toLocaleString(), ip: '127.0.0.1' },
    ]);
  }, [router]);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement API call to save security settings
    alert('Security settings saved successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Security Settings - TeamUp India Admin</title>
        <meta name="description" content="Manage security settings for TeamUp India platform" />
      </Head>

      <AdminNav adminInfo={adminInfo} />

      <div className="max-w-7xl mx-auto py-8 px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Security Settings</h1>
          <p className="text-gray-600">Manage security features and protect your TeamUp India platform</p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Platform Security Settings</h2>

          <form onSubmit={handleSaveSettings}>
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Two-Factor Authentication</h3>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Admin Two-Factor Authentication</h4>
                  <p className="text-gray-600 text-sm">
                    Require an additional verification step when administrators sign in
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={twoFactorEnabled}
                    onChange={() => setTwoFactorEnabled(!twoFactorEnabled)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                </label>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Login Notifications</h3>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Security Email Notifications</h4>
                  <p className="text-gray-600 text-sm">
                    Send email notifications for admin logins and security events
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={loginNotifications}
                    onChange={() => setLoginNotifications(!loginNotifications)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                </label>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Security Email</h3>
              <div className="p-4 bg-gray-50 rounded-lg">
                <label className="block text-gray-700 mb-2">Security Notification Email</label>
                <input
                  type="email"
                  value={securityEmail}
                  onChange={(e) => setSecurityEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                  placeholder="Enter security email address"
                />
                <p className="text-gray-600 text-sm mt-2">
                  This email will receive security notifications and alerts
                </p>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Activity Logs</h3>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Recent Admin Activity</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {activityLogs.length > 0 ? (
                        activityLogs.map((log, index) => (
                          <tr key={index}>
                            <td className="px-4 py-3 text-sm text-gray-900">{log.user}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">{log.action}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">{log.time}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">{log.ip}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="px-4 py-3 text-sm text-gray-500 text-center">
                            No activity logs found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-red-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-red-700 transition duration-300"
              >
                Save Security Settings
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SecurityPage;
