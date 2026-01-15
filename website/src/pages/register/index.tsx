import Head from 'next/head';
import Link from 'next/link';

export default function Register() {
  return (
    <div>
      <Head>
        <title>Register - TeamUp India Sports Platform</title>
        <meta name="description" content="Register as player, coach, store, or delivery partner on TeamUp India" />
      </Head>

      {/* Register Hero */}
      <section className="py-20 px-6 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-6">Join TeamUp India</h1>
          <p className="text-xl text-gray-300">Register as a coach, store, delivery partner, or player</p>
        </div>
      </section>

      {/* Registration Options */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Choose Your Role</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Link href="/register/coach" className="block bg-blue-50 hover:bg-blue-100 p-8 rounded-xl border border-blue-200 transition duration-300">
              <div className="text-5xl mb-4 text-center">👨‍🏫</div>
              <h3 className="text-2xl font-bold text-center mb-4 text-blue-700">Register as Coach</h3>
              <p className="text-gray-600 text-center mb-4">Are you a certified coach looking to grow your business? Register to connect with players and manage bookings.</p>
              <div className="text-center">
                <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition duration-300">
                  Register as Coach
                </button>
              </div>
            </Link>
            
            <Link href="/register/store" className="block bg-orange-50 hover:bg-orange-100 p-8 rounded-xl border border-orange-200 transition duration-300">
              <div className="text-5xl mb-4 text-center">🏪</div>
              <h3 className="text-2xl font-bold text-center mb-4 text-orange-700">Register as Store</h3>
              <p className="text-gray-600 text-center mb-4">Are you a sports equipment store? Register to reach more customers and grow your business.</p>
              <div className="text-center">
                <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-6 rounded-lg transition duration-300">
                  Register as Store
                </button>
              </div>
            </Link>
            
            <Link href="/register/delivery" className="block bg-purple-50 hover:bg-purple-100 p-8 rounded-xl border border-purple-200 transition duration-300">
              <div className="text-5xl mb-4 text-center">🚴</div>
              <h3 className="text-2xl font-bold text-center mb-4 text-purple-700">Register as Delivery</h3>
              <p className="text-gray-600 text-center mb-4">Earn by delivering sports equipment and connecting with customers. Register as a delivery partner.</p>
              <div className="text-center">
                <button className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-6 rounded-lg transition duration-300">
                  Register as Delivery
                </button>
              </div>
            </Link>
            
            <Link href="/register/player" className="block bg-green-50 hover:bg-green-100 p-8 rounded-xl border border-green-200 transition duration-300">
              <div className="text-5xl mb-4 text-center">⚽</div>
              <h3 className="text-2xl font-bold text-center mb-4 text-green-700">Register as Player</h3>
              <p className="text-gray-600 text-center mb-4">Join as a player to find coaches, book sessions, join tournaments, and connect with other players.</p>
              <div className="text-center">
                <button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg transition duration-300">
                  Register as Player
                </button>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Registration Benefits */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Why Register with TeamUp India?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3 text-green-600">Verified Platform</h3>
              <p className="text-gray-600">All coaches and service providers are verified to ensure quality and safety.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3 text-green-600">Earning Opportunities</h3>
              <p className="text-gray-600">Coaches and delivery partners can earn through bookings and deliveries.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3 text-green-600">Growth & Support</h3>
              <p className="text-gray-600">Access to analytics, marketing support, and business growth tools.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-gradient-to-r from-green-500 to-blue-500 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Join Our Ecosystem?</h2>
          <p className="text-xl mb-8">Register today and become part of India's largest sports community.</p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button className="bg-white text-green-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold transition duration-300">
              Download App
            </button>
            <Link href="/login" className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-lg font-semibold transition duration-300">
              Login
            </Link>
          </div>
        </div>
      </section>
      </div>
  );
}