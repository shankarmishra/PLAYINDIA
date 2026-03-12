import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import {
  UserPlus, Search, CalendarCheck, TrendingUp,
  Award, CalendarDays, BellRing, Wallet,
  Store, PackagePlus, ShoppingCart, Truck,
  Navigation, Clock, MapPin, Coins
} from 'lucide-react';

const HowItWorksPage = () => {
  return (
    <div>
      <Head>
        <title>How It Works - TeamUp India</title>
        <meta name="description" content="Learn how TeamUp India connects players, coaches, stores, and delivery partners" />
      </Head>

      {/* Hero Section */}
      <section className="relative py-14 px-6 bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-red-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight">How TeamUp India Works</h1>
          <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto font-light">
            Connecting the entire sports ecosystem in India — Simple, efficient, and effective.
          </p>
        </div>
      </section>

      {/* Tabs for different user types */}
      <section className="py-6 bg-white sticky top-0 z-20 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex justify-center flex-wrap gap-4">
            <a href="#players" className="py-2 px-6 rounded-full bg-red-50 text-red-600 font-semibold border border-red-200 hover:bg-red-100 transition-colors">For Players</a>
            <a href="#coaches" className="py-2 px-6 rounded-full bg-green-50 text-green-600 font-semibold border border-green-200 hover:bg-green-100 transition-colors">For Coaches</a>
            <a href="#stores" className="py-2 px-6 rounded-full bg-blue-50 text-blue-600 font-semibold border border-blue-200 hover:bg-blue-100 transition-colors">For Stores</a>
            <a href="#delivery" className="py-2 px-6 rounded-full bg-purple-50 text-purple-600 font-semibold border border-purple-200 hover:bg-purple-100 transition-colors">For Delivery</a>
          </nav>
        </div>
      </section>

      {/* For Players */}
      <section id="players" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-16">How TeamUp India Works for Players</h2>
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="w-full lg:w-1/2">
              <div className="relative h-96 w-full rounded-3xl overflow-hidden shadow-2xl group">
                <Image src="/images/player.png" alt="Players Ecosystem" layout="fill" objectFit="cover" className="group-hover:scale-110 transition-transform duration-1000" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-2xl font-bold">Find & Connect</h3>
                  <p className="opacity-90">Seamlessly book coaching sessions</p>
                </div>
              </div>
            </div>
            <div className="w-full lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center">
                    <UserPlus className="w-7 h-7 text-red-600" />
                  </div>
                  <span className="text-4xl font-black text-gray-100">01</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Sign Up</h3>
                <p className="text-gray-600">Create your free account and set up your profile with your favorite sports.</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center">
                    <Search className="w-7 h-7 text-red-600" />
                  </div>
                  <span className="text-4xl font-black text-gray-100">02</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Find Coaches</h3>
                <p className="text-gray-600">Browse verified coaches in your area with the right expertise.</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center">
                    <CalendarCheck className="w-7 h-7 text-red-600" />
                  </div>
                  <span className="text-4xl font-black text-gray-100">03</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Book Sessions</h3>
                <p className="text-gray-600">Book coaching sessions based on your availability and schedule.</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-7 h-7 text-red-600" />
                  </div>
                  <span className="text-4xl font-black text-gray-100">04</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Track Progress</h3>
                <p className="text-gray-600">Monitor your performance and connect with other players.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For Coaches */}
      <section id="coaches" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-16">How TeamUp India Works for Coaches</h2>
          <div className="flex flex-col lg:flex-row-reverse items-center gap-12">
            <div className="w-full lg:w-1/2">
              <div className="relative h-96 w-full rounded-3xl overflow-hidden shadow-2xl group">
                <Image src="/images/coach.png" alt="Coaches Ecosystem" layout="fill" objectFit="cover" className="group-hover:scale-110 transition-transform duration-1000" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-2xl font-bold">Manage & Grow</h3>
                  <p className="opacity-90">Take your coaching business online</p>
                </div>
              </div>
            </div>
            <div className="w-full lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-gray-50 border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
                    <Award className="w-7 h-7 text-green-600" />
                  </div>
                  <span className="text-4xl font-black text-gray-200">01</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Register</h3>
                <p className="text-gray-600">Sign up as a coach and verify your credentials for a trusted profile.</p>
              </div>
              <div className="bg-gray-50 border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
                    <CalendarDays className="w-7 h-7 text-green-600" />
                  </div>
                  <span className="text-4xl font-black text-gray-200">02</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Set Availability</h3>
                <p className="text-gray-600">Configure your calendar to show when you're available for coaching.</p>
              </div>
              <div className="bg-gray-50 border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
                    <BellRing className="w-7 h-7 text-green-600" />
                  </div>
                  <span className="text-4xl font-black text-gray-200">03</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Receive Bookings</h3>
                <p className="text-gray-600">Get booking requests from players and manage your schedule.</p>
              </div>
              <div className="bg-gray-50 border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
                    <Wallet className="w-7 h-7 text-green-600" />
                  </div>
                  <span className="text-4xl font-black text-gray-200">04</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Earn & Grow</h3>
                <p className="text-gray-600">Track earnings, get paid, and grow your business with reviews.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For Stores */}
      <section id="stores" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-16">How TeamUp India Works for Stores</h2>
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="w-full lg:w-1/2">
              <div className="relative h-96 w-full rounded-3xl overflow-hidden shadow-2xl group">
                <Image src="/images/store.png" alt="Stores Ecosystem" layout="fill" objectFit="cover" className="group-hover:scale-110 transition-transform duration-1000" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-2xl font-bold">Sell Sports Gear</h3>
                  <p className="opacity-90">Reach athletes directly on our platform</p>
                </div>
              </div>
            </div>
            <div className="w-full lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Store className="w-7 h-7 text-blue-600" />
                  </div>
                  <span className="text-4xl font-black text-gray-100">01</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Register Store</h3>
                <p className="text-gray-600">Register your sports store and verify your business credentials.</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                    <PackagePlus className="w-7 h-7 text-blue-600" />
                  </div>
                  <span className="text-4xl font-black text-gray-100">02</span>
                </div>
                <h3 className="text-xl font-bold mb-2">List Products</h3>
                <p className="text-gray-600">Add your sports equipment inventory with descriptions and images.</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                    <ShoppingCart className="w-7 h-7 text-blue-600" />
                  </div>
                  <span className="text-4xl font-black text-gray-100">03</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Receive Orders</h3>
                <p className="text-gray-600">Get orders from customers and manage your inventory efficiently.</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Truck className="w-7 h-7 text-blue-600" />
                  </div>
                  <span className="text-4xl font-black text-gray-100">04</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Manage Delivery</h3>
                <p className="text-gray-600">Assign orders to delivery partners and track the process.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For Delivery Partners */}
      <section id="delivery" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-16">How TeamUp India Works for Delivery</h2>
          <div className="flex flex-col lg:flex-row-reverse items-center gap-12">
            <div className="w-full lg:w-1/2">
              <div className="relative h-96 w-full rounded-3xl overflow-hidden shadow-2xl group">
                <Image src="/images/delivery.png" alt="Delivery Ecosystem" layout="fill" objectFit="cover" className="group-hover:scale-110 transition-transform duration-1000" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-2xl font-bold">Fast Deliveries</h3>
                  <p className="opacity-90">Earn money on your own schedule</p>
                </div>
              </div>
            </div>
            <div className="w-full lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-gray-50 border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Navigation className="w-7 h-7 text-purple-600" />
                  </div>
                  <span className="text-4xl font-black text-gray-200">01</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Sign Up</h3>
                <p className="text-gray-600">Register as a delivery partner and verify your vehicle details.</p>
              </div>
              <div className="bg-gray-50 border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Clock className="w-7 h-7 text-purple-600" />
                  </div>
                  <span className="text-4xl font-black text-gray-200">02</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Set Availability</h3>
                <p className="text-gray-600">Indicate when you're available for deliveries in your areas.</p>
              </div>
              <div className="bg-gray-50 border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center">
                    <MapPin className="w-7 h-7 text-purple-600" />
                  </div>
                  <span className="text-4xl font-black text-gray-200">03</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Get Assignments</h3>
                <p className="text-gray-600">Receive delivery assignments based on location and availability.</p>
              </div>
              <div className="bg-gray-50 border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Coins className="w-7 h-7 text-purple-600" />
                  </div>
                  <span className="text-4xl font-black text-gray-200">04</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Earn Money</h3>
                <p className="text-gray-600">Complete deliveries and track your earnings transparently.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Representation */}
      <section className="py-24 bg-gray-900 text-white border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16">Visual Overview of Our Ecosystem</h2>
          <div className="bg-gray-800 rounded-3xl shadow-2xl p-10 md:p-14 border border-gray-700">
            <div className="flex flex-col items-center">
              <div className="flex flex-col md:flex-row justify-between items-center w-full max-w-5xl mb-12">
                <div className="text-center group mx-4 mb-8 md:mb-0">
                  <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/30 group-hover:bg-red-500/30 transition-colors shadow-[0_0_30px_rgba(239,68,68,0.2)]">
                    <span className="text-4xl">⚽</span>
                  </div>
                  <p className="font-bold text-xl">Players</p>
                </div>
                <div className="hidden md:block text-5xl text-gray-600 mb-6 md:mb-0 animate-pulse">⟷</div>
                <div className="text-center group mx-4 mb-8 md:mb-0">
                  <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/30 group-hover:bg-green-500/30 transition-colors shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                    <span className="text-4xl">🎓</span>
                  </div>
                  <p className="font-bold text-xl">Coaches</p>
                </div>
                <div className="hidden md:block text-5xl text-gray-600 mb-6 md:mb-0 animate-pulse">⟷</div>
                <div className="text-center group mx-4 mb-8 md:mb-0">
                  <div className="w-24 h-24 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/30 group-hover:bg-blue-500/30 transition-colors shadow-[0_0_30px_rgba(59,130,246,0.2)]">
                    <span className="text-4xl">🏪</span>
                  </div>
                  <p className="font-bold text-xl">Stores</p>
                </div>
                <div className="hidden md:block text-5xl text-gray-600 mb-6 md:mb-0 animate-pulse">⟷</div>
                <div className="text-center group mx-4">
                  <div className="w-24 h-24 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-purple-500/30 group-hover:bg-purple-500/30 transition-colors shadow-[0_0_30px_rgba(168,85,247,0.2)]">
                    <span className="text-4xl">🚚</span>
                  </div>
                  <p className="font-bold text-xl">Delivery</p>
                </div>
              </div>
              <p className="text-center text-gray-300 max-w-3xl text-lg leading-relaxed">
                TeamUp India creates a seamless connection between all stakeholders in the sports ecosystem.
                Players find coaches, coaches get students, stores reach customers, and delivery partners
                facilitate the exchange of goods — all in one unified, intelligent platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-4 bg-gray-900 text-white">
        <div className="max-w-10xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-black mb-6">Ready to Join Our Ecosystem?</h2>
          <p className="text-xl text-red-100 mb-10 font-light">
            Whether you're a player, coach, store, or delivery partner, become part of India's premier sports ecosystem.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link href="/register" className="bg-white text-red-600 font-bold py-4 px-8 rounded-full shadow-lg hover:bg-gray-50 hover:scale-105 transition-all duration-300">
              Register Now
            </Link>
            <Link href="/contact" className="bg-red-800 text-white font-bold py-4 px-8 rounded-full border border-red-700 shadow-lg hover:bg-red-900 hover:scale-105 transition-all duration-300">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorksPage;