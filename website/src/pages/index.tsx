import Head from 'next/head';
import Link from 'next/link';

const HomePage = () => {
  return (
    <div>
      <Head>
        <title>TeamUp India - Sports Platform for Players, Coaches, Stores & Delivery</title>
        <meta name="description" content="TeamUp India connects players, coaches, sports stores, and delivery partners in one comprehensive platform" />
      </Head>

      {/* Hero Section */}
      <section className="relative h-[95vh] flex items-center justify-center overflow-hidden text-white">
        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute z-0 w-auto min-w-full min-h-full max-w-none object-cover"
        >
          <source
            src="https://assets.mixkit.co/videos/43479/43479-720.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>

        {/* Overlay for better text readability */}
        <div className="absolute z-10 w-full h-full bg-black/60"></div>

        <div className="relative z-20 max-w-7xl mx-auto text-center px-6">
          <h1 className="text-2xl md:text-3xl font-extrabold mb-6 tracking-tight">
            Connect, Play & <span className="text-red-500">Grow</span> with TeamUp India
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto mb-10 leading-relaxed">
            The ultimate sports ecosystem connecting players, coaches, stores, and delivery partners across India
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link href="/coach/register" className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-full transition duration-300 transform hover:scale-105 shadow-lg">
              Register as Coach
            </Link>
            <Link href="/store/register" className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-full transition duration-300 transform hover:scale-105 shadow-lg">
              Register as Store
            </Link>
            <Link href="/delivery/register" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-full transition duration-300 transform hover:scale-105 shadow-lg">
              Register as Delivery
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-3xl font-bold text-red-600">50K+</h3>
              <p className="text-gray-900">Active Players</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-3xl font-bold text-red-600">2K+</h3>
              <p className="text-gray-900">Verified Coaches</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-3xl font-bold text-red-600">500+</h3>
              <p className="text-gray-900">Sports Stores</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-3xl font-bold text-red-600">1K+</h3>
              <p className="text-gray-900">Delivery Partners</p>
            </div>
          </div>
        </div>
      </section>

      {/* What is TeamUp India */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">What is TeamUp India</h2>
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-lg text-gray-700 mb-6">
              TeamUp India is a comprehensive sports ecosystem that connects all stakeholders in the Indian sports community.
              We bridge the gap between players looking for coaches, stores selling sports equipment, and delivery partners
              facilitating seamless transactions.
            </p>
            <p className="text-lg text-gray-700">
              Our platform ensures quality, reliability, and growth for everyone involved in the sports industry.
            </p>
          </div>
        </div>
      </section>

      {/* Who is it for */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Who is it for</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-4xl mb-4 text-red-500">🎓</div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">Coaches</h3>
              <p className="text-gray-600">
                Verified coaches can create profiles, manage bookings, track earnings, and grow their coaching business.
              </p>
              <Link href="/coach/register" className="text-red-600 font-semibold mt-4 inline-block hover:underline">
                Register as Coach
              </Link>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-4xl mb-4 text-green-500">🏪</div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">Stores</h3>
              <p className="text-gray-600">
                Sports stores can list products, manage orders, track sales, and expand their customer base.
              </p>
              <Link href="/store/register" className="text-red-600 font-semibold mt-4 inline-block hover:underline">
                Register as Store
              </Link>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-4xl mb-4 text-blue-500">🚚</div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">Delivery Partners</h3>
              <p className="text-gray-600">
                Delivery partners can earn by delivering sports equipment and connecting with stores and customers.
              </p>
              <Link href="/delivery/register" className="text-red-600 font-semibold mt-4 inline-block hover:underline">
                Register as Delivery
              </Link>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-4xl mb-4 text-yellow-500">⚽</div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">Players</h3>
              <p className="text-gray-600">
                Players can find coaches, book sessions, buy equipment, join tournaments, and connect with others.
              </p>
              <Link href="/login" className="text-red-600 font-semibold mt-4 inline-block hover:underline">
                Login as Player
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Logos */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Trusted by Sports Communities</h2>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            <div className="text-4xl text-red-500">🏆</div>
            <div className="text-4xl text-green-500">⚽</div>
            <div className="text-4xl text-blue-500">🎾</div>
            <div className="text-4xl text-yellow-500">🏀</div>
            <div className="text-4xl text-purple-500">🏸</div>
            <div className="text-4xl text-indigo-500">🏊</div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Platform Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4 text-red-500">📅</div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Coach Booking System</h3>
              <p className="text-gray-700">
                Players can easily find and book verified coaches based on location, sport, experience, and ratings.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4 text-red-500">🛒</div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Equipment Marketplace</h3>
              <p className="text-gray-700">
                Buy quality sports equipment from verified stores with secure payment and reliable delivery.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4 text-red-500">🏆</div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Tournament Management</h3>
              <p className="text-gray-700">
                Organize and participate in local and regional sports tournaments with our easy-to-use tools.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4 text-red-500">💰</div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Earnings Dashboard</h3>
              <p className="text-gray-700">
                Coaches and delivery partners can track earnings, manage payouts, and grow their income.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4 text-red-500">📈</div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Performance Tracking</h3>
              <p className="text-gray-700">
                Players can track their fitness, performance, and progress with our analytics tools.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4 text-red-500">👥</div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Community Connection</h3>
              <p className="text-gray-700">
                Connect with fellow players, coaches, and sports enthusiasts across India.
              </p>
            </div>
          </div>
        </div>
      </section>



      {/* Call to Action */}
      <section className="relative py-10 px-6 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=2000"
            alt="Sports Background"
            className="w-full h-full object-cover"
          />
          {/* Dark Overlay for readability */}
          <div className="absolute inset-0 bg-black/70 bg-blend-multiply"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-4xl font-black mb-6 text-white tracking-tight">
            Ready to Join TeamUp India?
          </h2>
          <p className="text-xl md:text-2xl text-gray-200 mb-12 max-w-2xl mx-auto font-medium">
            Whether you're a player, coach, store, or delivery partner, become part of India's premier sports ecosystem today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-7">
            <Link href="/coach/register" className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-10 rounded-full transition duration-300 transform hover:scale-105 shadow-[0_0_20px_rgba(220,38,38,0.4)]">
              Register as Coach
            </Link>
            <Link href="/store/register" className="bg-white hover:bg-gray-100 text-gray-900 font-bold py-4 px-10 rounded-full transition duration-300 transform hover:scale-105 shadow-lg">
              Register as Store
            </Link>
            <Link href="/delivery/register" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-full transition duration-300 transform hover:scale-105 shadow-lg">
              Register as Delivery
            </Link>
          </div>
        </div>
      </section>

      {/* App Screenshots & Download Section */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Experience Our App</h2>
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <img
                  src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=400"
                  alt="App UI 1"
                  className="rounded-xl w-full h-48 object-cover shadow-md hover:scale-105 transition-transform duration-300"
                />
                <img
                  src="https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?auto=format&fit=crop&q=80&w=400"
                  alt="App UI 2"
                  className="rounded-xl w-full h-48 object-cover shadow-md hover:scale-105 transition-transform duration-300"
                />
                <img
                  src="https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&q=80&w=400"
                  alt="App UI 3"
                  className="rounded-xl w-full h-48 object-cover shadow-md hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
            <div className="lg:w-1/2 text-center lg:text-left">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Download Our Mobile App</h3>
              <p className="text-gray-700 mb-6">
                Get the complete TeamUp India experience on your mobile device. Access coaches, book sessions,
                buy equipment, and connect with the sports community anytime, anywhere.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button className="bg-black text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2">
                  <span className="text-2xl">📱</span>
                  <div className="text-left">
                    <div className="text-xs">Download on the</div>
                    <div className="text-sm">App Store</div>
                  </div>
                </button>
                <button className="bg-black text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2">
                  <span className="text-2xl">🤖</span>
                  <div className="text-left">
                    <div className="text-xs">GET IT ON</div>
                    <div className="text-sm">Google Play</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;