import Head from 'next/head';
import Link from 'next/link';

export default function StoreRegistrationSuccess() {
  return (
    <div>
      <Head>
        <title>Registration Success - TeamUp India</title>
        <meta name="description" content="Store registration submitted successfully - Awaiting admin approval" />
      </Head>

      {/* Registration Success Hero */}
      <section className="py-20 px-6 bg-gradient-to-r from-green-700 to-green-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-6xl mb-6">✅</div>
          <h1 className="text-4xl font-bold mb-6">Registration Submitted Successfully!</h1>
          <p className="text-xl">Thank you for registering your store. Your application is under review.</p>
        </div>
      </section>

      {/* Success Content */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200 text-center">
            <div className="mb-8">
              <div className="text-6xl mx-auto mb-6">🏪</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Verification in Progress</h2>
              <p className="text-gray-600 text-lg">Your documents are being reviewed by our team</p>
            </div>
            
            <div className="mb-10">
              <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                <div className="bg-green-600 h-4 rounded-full" style={{ width: '100%' }}></div>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Store Details</span>
                <span>Business Info</span>
                <span>Location</span>
                <span>Documents</span>
                <span>Review</span>
              </div>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 mb-8">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">What happens next?</h3>
              <ul className="list-disc pl-6 text-blue-700 text-left space-y-2">
                <li>Our team will review your submitted documents</li>
                <li>We'll verify your business information</li>
                <li>Your store profile will be approved if everything is in order</li>
                <li>You'll receive an email/SMS notification with login credentials</li>
                <li>Estimated approval time: 2-3 business days</li>
              </ul>
            </div>
            
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Need Help?</h3>
              <p className="text-gray-600 mb-4">If you have any questions about your registration</p>
              <Link href="/contact" className="inline-block bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg transition duration-300">
                Contact Support
              </Link>
            </div>
            
            <div>
              <Link href="/" className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits for Stores */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Why Register as a Store?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="text-4xl mb-4">📈</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Increased Sales</h3>
              <p className="text-gray-600">Reach more customers and increase your sales.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="text-4xl mb-4">🚚</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Delivery Network</h3>
              <p className="text-gray-600">Connect with delivery partners for fast delivery.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Analytics</h3>
              <p className="text-gray-600">Track sales, popular products, and customer insights.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Customer Base</h3>
              <p className="text-gray-600">Access to a large customer base of sports enthusiasts.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}