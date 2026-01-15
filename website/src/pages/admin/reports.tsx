import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import AdminNav from '../../components/AdminNav';

const AdminReports = () => {
  const router = useRouter();
  const [adminInfo, setAdminInfo] = useState<any>(null);
  const [reportType, setReportType] = useState<string>('users');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState<any>(null);

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

  const generateReport = async () => {
    setLoading(true);
    // TODO: Implement API call to generate report
    setTimeout(() => {
      setReportData({
        type: reportType,
        dateRange,
        generatedAt: new Date().toISOString(),
        data: 'Report data will be generated here...'
      });
      setLoading(false);
      alert('Report generated successfully!');
    }, 2000);
  };

  const exportReport = (format: 'csv' | 'pdf' | 'excel') => {
    // TODO: Implement export functionality
    alert(`Exporting report as ${format.toUpperCase()}...`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Reports - TeamUp India Admin</title>
        <meta name="description" content="Generate and export platform reports" />
      </Head>

      <AdminNav adminInfo={adminInfo} />

      <div className="max-w-7xl mx-auto py-8 px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600">Generate and export platform reports</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Report Configuration */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Generate Report</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
                  <select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  >
                    <option value="users">User Report</option>
                    <option value="bookings">Bookings Report</option>
                    <option value="orders">Orders Report</option>
                    <option value="revenue">Revenue Report</option>
                    <option value="coaches">Coaches Report</option>
                    <option value="stores">Stores Report</option>
                    <option value="delivery">Delivery Report</option>
                    <option value="support">Support Tickets Report</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>

                <button
                  onClick={generateReport}
                  disabled={loading}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Generating...' : 'Generate Report'}
                </button>
              </div>

              {reportData && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Options</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => exportReport('csv')}
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition duration-300"
                    >
                      Export as CSV
                    </button>
                    <button
                      onClick={() => exportReport('pdf')}
                      className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition duration-300"
                    >
                      Export as PDF
                    </button>
                    <button
                      onClick={() => exportReport('excel')}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition duration-300"
                    >
                      Export as Excel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Report Preview */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Report Preview</h2>
              
              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
                  <p className="mt-4 text-gray-600">Generating report...</p>
                </div>
              ) : reportData ? (
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Report Details</h3>
                    <p className="text-sm text-gray-600">
                      <strong>Type:</strong> {reportData.type}<br />
                      <strong>Date Range:</strong> {reportData.dateRange.start} to {reportData.dateRange.end}<br />
                      <strong>Generated:</strong> {new Date(reportData.generatedAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-600">{reportData.data}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <p>Configure and generate a report to see preview</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;

