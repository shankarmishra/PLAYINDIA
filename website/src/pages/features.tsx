import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

const FeaturesPage = () => {
  return (
    <div>
      <Head>
        <title>Platform Features - TeamUp India</title>
        <meta name="description" content="Explore the comprehensive features of TeamUp India sports platform" />
      </Head>

      {/* Hero Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Platform Features</h1>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto">
            Comprehensive features designed for players, coaches, stores, and delivery partners
          </p>
        </div>
      </section>

      {/* Player Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Features for Players</h2>
            <p className="text-lg text-gray-600">Everything you need to enhance your sports journey</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="mx-auto mb-4">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-red-600">Find Players</h3>
              <p className="text-gray-700">
                Connect with other players in your area who share your passion for sports. 
                Find teammates, opponents, and training partners based on location, skill level, and interests.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="mx-auto mb-4">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-red-600">Book Coaches</h3>
              <p className="text-gray-700">
                Discover verified coaches in your area with the right expertise for your sport. 
                Book sessions, check availability, and read reviews from other players.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="mx-auto mb-4">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-red-600">Join Tournaments</h3>
              <p className="text-gray-700">
                Participate in local and regional tournaments organized by verified coaches and sports organizations. 
                Compete, learn, and showcase your skills.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="mx-auto mb-4">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-red-600">Buy Equipment</h3>
              <p className="text-gray-700">
                Purchase quality sports equipment from verified stores. Compare prices, check availability, 
                and enjoy reliable delivery to your doorstep.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="mx-auto mb-4">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-red-600">Track Fitness</h3>
              <p className="text-gray-700">
                Monitor your performance, track your progress, and set goals with our comprehensive analytics tools. 
                See your improvement over time.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="mx-auto mb-4">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-red-600">Community Connect</h3>
              <p className="text-gray-700">
                Join our vibrant sports community. Share experiences, get advice, and stay updated with 
                the latest sports news and events in your area.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Coach Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Features for Coaches</h2>
            <p className="text-lg text-gray-600">Tools to grow your coaching business</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="mx-auto mb-4">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-red-600">Verified Profiles</h3>
              <p className="text-gray-700">
                Create a professional profile that showcases your expertise, experience, and achievements. 
                Gain credibility with verified badges and certifications.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="mx-auto mb-4">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-red-600">Booking Calendar</h3>
              <p className="text-gray-700">
                Manage your schedule with our intuitive calendar. Set availability, block time slots, 
                and track upcoming sessions with ease.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="mx-auto mb-4">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-red-600">Tournament Hosting</h3>
              <p className="text-gray-700">
                Organize and host tournaments on our platform. Manage registrations, schedules, 
                and results while reaching a wider audience.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="mx-auto mb-4">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-red-600">Earnings Dashboard</h3>
              <p className="text-gray-700">
                Track your earnings, view payment history, and manage payouts. Get insights into 
                your business performance and growth.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="mx-auto mb-4">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-red-600">Performance Analytics</h3>
              <p className="text-gray-700">
                Access detailed analytics about your students' progress, session attendance, 
                and overall impact on their development.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="mx-auto mb-4">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-red-600">Rating System</h3>
              <p className="text-gray-700">
                Build your reputation through genuine reviews and ratings from your students. 
                Higher ratings lead to increased visibility and bookings.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Store Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Features for Stores</h2>
            <p className="text-lg text-gray-600">Expand your business and reach more customers</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="mx-auto mb-4">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-red-600">Product Listings</h3>
              <p className="text-gray-700">
                List your sports equipment with detailed descriptions, images, and pricing. 
                Reach customers actively looking for sports gear in your area.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="mx-auto mb-4">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-red-600">Order Management</h3>
              <p className="text-gray-700">
                Efficiently manage incoming orders, track fulfillment status, and communicate 
                with customers throughout the delivery process.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="mx-auto mb-4">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-red-600">Delivery Assignment</h3>
              <p className="text-gray-700">
                Assign orders to reliable delivery partners for prompt and efficient delivery. 
                Track delivery status in real-time.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="mx-auto mb-4">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-red-600">Sales Analytics</h3>
              <p className="text-gray-700">
                Access detailed analytics about your sales, popular products, customer demographics, 
                and seasonal trends to optimize your inventory.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="mx-auto mb-4">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-red-600">Customer Management</h3>
              <p className="text-gray-700">
                Build relationships with your customers, track purchase history, and offer 
                personalized recommendations and promotions.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="mx-auto mb-4">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-red-600">Mobile Optimization</h3>
              <p className="text-gray-700">
                Manage your store on-the-go with our mobile-optimized dashboard. 
                Update inventory, process orders, and track sales from anywhere.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Delivery Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Features for Delivery Partners</h2>
            <p className="text-lg text-gray-600">Earn while contributing to the sports ecosystem</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="mx-auto mb-4">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-red-600">Smart Delivery</h3>
              <p className="text-gray-700">
                Receive delivery assignments based on your location and availability. 
                Optimize your route with our smart navigation system.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="mx-auto mb-4">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-red-600">Earnings Tracking</h3>
              <p className="text-gray-700">
                Track your daily, weekly, and monthly earnings. View payment history and 
                estimate future earnings based on your performance.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="mx-auto mb-4">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-red-600">Location Services</h3>
              <p className="text-gray-700">
                Enable location services to receive nearby delivery assignments. 
                Get directions to pickup and delivery locations seamlessly.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="mx-auto mb-4">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-red-600">Rating System</h3>
              <p className="text-gray-700">
                Build your reputation with ratings from stores and customers. 
                Higher ratings lead to more delivery opportunities.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="mx-auto mb-4">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-red-600">Communication</h3>
              <p className="text-gray-700">
                Communicate with stores and customers during the delivery process. 
                Provide updates and resolve issues efficiently.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="mx-auto mb-4">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-red-600">Delivery History</h3>
              <p className="text-gray-700">
                Maintain a record of all completed deliveries. Access proof of delivery 
                and customer feedback for quality assurance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to Experience Our Features?</h2>
          <p className="text-lg text-gray-700 mb-8">
            Join thousands of players, coaches, stores, and delivery partners already using TeamUp India.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/register" className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300">
              Register Now
            </Link>
            <Link href="/contact" className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 px-6 rounded-lg transition duration-300">
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FeaturesPage;