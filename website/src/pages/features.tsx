import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
  Users,
  CalendarDays,
  Trophy,
  ShoppingBag,
  Activity,
  Share2,
  ShieldCheck,
  Calendar,
  Medal,
  LayoutDashboard,
  BarChart3,
  Star,
  Package,
  ClipboardList,
  Truck,
  TrendingUp,
  UserCircle,
  Smartphone,
  Navigation,
  Wallet,
  LocateFixed,
  ThumbsUp,
  MessageCircle,
  History,
  LucideIcon
} from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  iconColor?: string;
  iconBg?: string;
}

const FeatureCard = ({ icon: Icon, title, description, iconColor = "text-red-600", iconBg = "bg-red-50" }: FeatureCardProps) => (
  <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group">
    <div className={`w-14 h-14 ${iconBg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
      <Icon className={`w-7 h-7 ${iconColor}`} />
    </div>
    <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-red-600 transition-colors">{title}</h3>
    <p className="text-gray-600 leading-relaxed">
      {description}
    </p>
  </div>
);

interface SectionHeaderProps {
  title: string;
  subtitle: string;
}

const SectionHeader = ({ title, subtitle }: SectionHeaderProps) => (
  <div className="text-center mb-10 ">
    <h2 className="text-4xl font-bold text-gray-900 mb-4">{title}</h2>
    <div className="w-20 h-1.5 bg-red-600 mx-auto rounded-full mb-6"></div>
    <p className="text-xl text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
  </div>
);

const FeaturesPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Platform Features - TeamUp India</title>
        <meta name="description" content="Explore the comprehensive features of TeamUp India sports platform" />
      </Head>

      {/* Hero Section */}
      <section className="relative py-14 px-6 bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-red-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>

        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-5xl font-extrabold mb-8 tracking-tight">
            Our <span className="text-red-500">Powerful</span> Features
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            A complete ecosystem designed to empower players, coaches, stores, and delivery partners across the nation.
          </p>
        </div>
      </section>

      {/* Player Features */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader
            title="Features for Players"
            subtitle="Everything you need to enhance your sports journey and connect with the community."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={Users}
              title="Find Players"
              description="Connect with other players in your area who share your passion for sports. Find teammates, opponents, and training partners."
            />
            <FeatureCard
              icon={CalendarDays}
              title="Book Coaches"
              description="Discover verified coaches in your area with the right expertise. Book sessions, check availability, and read reviews."
            />
            <FeatureCard
              icon={Trophy}
              title="Join Tournaments"
              description="Participate in local and regional tournaments organized by verified organizations. Compete, learn, and showcase your skills."
            />
            <FeatureCard
              icon={ShoppingBag}
              title="Buy Equipment"
              description="Purchase quality sports equipment from verified stores. Compare prices and enjoy reliable delivery to your doorstep."
            />
            <FeatureCard
              icon={Activity}
              title="Track Fitness"
              description="Monitor your performance, track your progress, and set goals with our comprehensive analytics tools."
            />
            <FeatureCard
              icon={Share2}
              title="Community Connect"
              description="Join our vibrant sports community. Share experiences, get advice, and stay updated with the latest news."
            />
          </div>
        </div>
      </section>

      {/* Coach Features */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader
            title="Features for Coaches"
            subtitle="Professional tools designed to help you manage and grow your coaching business effectively."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={ShieldCheck}
              title="Verified Profiles"
              description="Create a professional profile that showcases your expertise. Gain credibility with verified badges and certifications."
              iconColor="text-blue-600"
              iconBg="bg-blue-50"
            />
            <FeatureCard
              icon={Calendar}
              title="Booking Calendar"
              description="Manage your schedule with our intuitive calendar. Set availability, block time slots, and track upcoming sessions."
              iconColor="text-blue-600"
              iconBg="bg-blue-50"
            />
            <FeatureCard
              icon={Medal}
              title="Tournament Hosting"
              description="Organize and host tournaments on our platform. Manage registrations, schedules, and results with ease."
              iconColor="text-blue-600"
              iconBg="bg-blue-50"
            />
            <FeatureCard
              icon={LayoutDashboard}
              title="Earnings Dashboard"
              description="Track your earnings, view payment history, and manage payouts. Get insights into your business performance."
              iconColor="text-blue-600"
              iconBg="bg-blue-50"
            />
            <FeatureCard
              icon={BarChart3}
              title="Performance Analytics"
              description="Access detailed analytics about your students' progress, session attendance, and overall development impact."
              iconColor="text-blue-600"
              iconBg="bg-blue-50"
            />
            <FeatureCard
              icon={Star}
              title="Rating System"
              description="Build your reputation through genuine reviews. Higher ratings lead to increased visibility and bookings."
              iconColor="text-blue-600"
              iconBg="bg-blue-50"
            />
          </div>
        </div>
      </section>

      {/* Store Features */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader
            title="Features for Stores"
            subtitle="Expand your digital presence and reach thousands of athletes looking for the best gear."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={Package}
              title="Product Listings"
              description="List your sports equipment with detailed descriptions and images. Reach customers actively looking for gear."
              iconColor="text-green-600"
              iconBg="bg-green-50"
            />
            <FeatureCard
              icon={ClipboardList}
              title="Order Management"
              description="Efficiently manage incoming orders, track fulfillment status, and communicate with customers seamlessly."
              iconColor="text-green-600"
              iconBg="bg-green-50"
            />
            <FeatureCard
              icon={Truck}
              title="Delivery Assignment"
              description="Assign orders to reliable delivery partners for prompt fulfillment. Track delivery status in real-time."
              iconColor="text-green-600"
              iconBg="bg-green-50"
            />
            <FeatureCard
              icon={TrendingUp}
              title="Sales Analytics"
              description="Access detailed analytics about your sales, popular products, and customer demographics to optimize inventory."
              iconColor="text-green-600"
              iconBg="bg-green-50"
            />
            <FeatureCard
              icon={UserCircle}
              title="Customer Management"
              description="Build relationships with your customers, track purchase history, and offer personalized recommendations."
              iconColor="text-green-600"
              iconBg="bg-green-50"
            />
            <FeatureCard
              icon={Smartphone}
              title="Mobile Optimization"
              description="Manage your store on-the-go with our mobile-optimized dashboard. Update inventory and track sales from anywhere."
              iconColor="text-green-600"
              iconBg="bg-green-50"
            />
          </div>
        </div>
      </section>

      {/* Delivery Features */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader
            title="Features for Delivery Partners"
            subtitle="Flexible opportunities to earn while supporting the local sports ecosystem."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={Navigation}
              title="Smart Delivery"
              description="Receive assignments based on your location. Optimize your route with our integrated navigation system."
              iconColor="text-orange-600"
              iconBg="bg-orange-50"
            />
            <FeatureCard
              icon={Wallet}
              title="Earnings Tracking"
              description="Track your daily and monthly earnings. View payment history and estimate future earnings based on performance."
              iconColor="text-orange-600"
              iconBg="bg-orange-50"
            />
            <FeatureCard
              icon={LocateFixed}
              title="Location Services"
              description="Enable location services to receive nearby assignments. Get directions to pickup and delivery locations seamlessly."
              iconColor="text-orange-600"
              iconBg="bg-orange-50"
            />
            <FeatureCard
              icon={ThumbsUp}
              title="Rating System"
              description="Build your reputation with ratings from stores and customers. Higher ratings lead to more opportunities."
              iconColor="text-orange-600"
              iconBg="bg-orange-50"
            />
            <FeatureCard
              icon={MessageCircle}
              title="Communication"
              description="Communicate with stores and customers during the delivery process. Resolve issues quickly and efficiently."
              iconColor="text-orange-600"
              iconBg="bg-orange-50"
            />
            <FeatureCard
              icon={History}
              title="Delivery History"
              description="Maintain a record of all completed deliveries. Access proof of delivery and customer feedback for quality assurance."
              iconColor="text-orange-600"
              iconBg="bg-orange-50"
            />
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-4 bg-white">
        <div className="max-w-10xl mx-auto text-center">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-1xl p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <h2 className="text-4xl font-bold text-gray-50 mb-6">Ready to Experience Our Features?</h2>
              <p className="text-xl text-gray-50 mb-10 max-w-2xl mx-auto">
                Join thousands of players, coaches, stores, and delivery partners already using TeamUp India to elevate their sports experience.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-6">
                <Link href="/register" className="bg-white text-red-600 hover:bg-gray-100 font-bold py-4 px-10 rounded-xl transition duration-300 shadow-lg">
                  Get Started Now
                </Link>
                <Link href="/contact" className="bg-red-700 text-white hover:bg-red-800 font-bold py-4 px-10 rounded-xl transition duration-300 border border-red-500">
                  Talk to Sales
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* App Screenshots & Download Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">Experience Our Mobile App</h2>
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <img
                  src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=400"
                  alt="App UI 1"
                  className="rounded-3xl w-full h-64 object-cover shadow-xl hover:scale-105 transition-transform duration-300"
                />
                <img
                  src="https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?auto=format&fit=crop&q=80&w=400"
                  alt="App UI 2"
                  className="rounded-3xl w-full h-64 object-cover shadow-xl hover:scale-105 transition-transform duration-300"
                />
                <img
                  src="https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&q=80&w=400"
                  alt="App UI 3"
                  className="rounded-3xl w-full h-64 object-cover shadow-xl hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
            <div className="lg:w-1/2 text-center lg:text-left">
              <h3 className="text-3xl font-bold text-gray-900 mb-6">Take TeamUp India Anywhere</h3>
              <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                Get the complete TeamUp India experience on your mobile device. Access coaches, book sessions,
                buy equipment, and connect with the sports community anytime, anywhere.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
                <button className="bg-black text-white font-bold py-4 px-8 rounded-2xl flex items-center justify-center gap-4 hover:bg-gray-800 transition-colors shadow-lg">
                  <span className="text-3xl">📱</span>
                  <div className="text-left">
                    <div className="text-xs uppercase opacity-70">Download on the</div>
                    <div className="text-xl">App Store</div>
                  </div>
                </button>
                <button className="bg-black text-white font-bold py-4 px-8 rounded-2xl flex items-center justify-center gap-4 hover:bg-gray-800 transition-colors shadow-lg">
                  <span className="text-3xl">🤖</span>
                  <div className="text-left">
                    <div className="text-xs uppercase opacity-70">GET IT ON</div>
                    <div className="text-xl">Google Play</div>
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

export default FeaturesPage;