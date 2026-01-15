import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

const BlogPage = () => {
  return (
    <div>
      <Head>
        <title>Blog & Resources - TeamUp India</title>
        <meta name="description" content="Sports tips, training guides, and platform updates from TeamUp India" />
      </Head>

      {/* Hero Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Blog & Resources</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Sports tips, training guides, and platform updates to help you excel in your sport
          </p>
        </div>
      </section>

      {/* Featured Articles */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Featured Articles</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="bg-gray-200 border-2 border-dashed w-full h-48" />
              <div className="p-6">
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <span>Sports Tips</span>
                  <span className="mx-2">•</span>
                  <span>5 min read</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Top 10 Cricket Training Drills for Beginners</h3>
                <p className="text-gray-600 mb-4">
                  Improve your cricket skills with these proven drills that professional coaches use to train players.
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Jan 10, 2026</span>
                  <Link href="/blog/cricket-drills" className="text-red-600 font-medium hover:underline">Read More</Link>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="bg-gray-200 border-2 border-dashed w-full h-48" />
              <div className="p-6">
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <span>Training Guides</span>
                  <span className="mx-2">•</span>
                  <span>7 min read</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Football Fitness: Complete Conditioning Program</h3>
                <p className="text-gray-600 mb-4">
                  A comprehensive fitness program designed specifically for football players of all levels.
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Jan 8, 2026</span>
                  <Link href="/blog/football-fitness" className="text-red-600 font-medium hover:underline">Read More</Link>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="bg-gray-200 border-2 border-dashed w-full h-48" />
              <div className="p-6">
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <span>Platform Updates</span>
                  <span className="mx-2">•</span>
                  <span>3 min read</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">New Features in TeamUp India App v2.0</h3>
                <p className="text-gray-600 mb-4">
                  Discover the latest features and improvements in our updated platform for players and coaches.
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Jan 5, 2026</span>
                  <Link href="/blog/app-updates" className="text-red-600 font-medium hover:underline">Read More</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sports Categories */}
      <section className="py-16 bg-white px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Sports Categories</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/blog/category/cricket" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 text-center">
              <div className="text-4xl mb-4 text-red-500">🏏</div>
              <h3 className="text-lg font-bold mb-2 text-gray-900">Cricket</h3>
              <p className="text-gray-600">Training tips, techniques, and strategies</p>
            </Link>
            
            <Link href="/blog/category/football" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 text-center">
              <div className="text-4xl mb-4 text-green-500">⚽</div>
              <h3 className="text-lg font-bold mb-2 text-gray-900">Football</h3>
              <p className="text-gray-600">Fitness, skills, and match preparation</p>
            </Link>
            
            <Link href="/blog/category/tennis" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 text-center">
              <div className="text-4xl mb-4 text-blue-500">🎾</div>
              <h3 className="text-lg font-bold mb-2 text-gray-900">Tennis</h3>
              <p className="text-gray-600">Techniques, equipment, and training</p>
            </Link>
            
            <Link href="/blog/category/badminton" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 text-center">
              <div className="text-4xl mb-4 text-yellow-500">🏸</div>
              <h3 className="text-lg font-bold mb-2 text-gray-900">Badminton</h3>
              <p className="text-gray-600">Skills, strategies, and improvement</p>
            </Link>
            
            <Link href="/blog/category/basketball" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 text-center">
              <div className="text-4xl mb-4 text-orange-500">🏀</div>
              <h3 className="text-lg font-bold mb-2 text-gray-900">Basketball</h3>
              <p className="text-gray-600">Drills, techniques, and conditioning</p>
            </Link>
            
            <Link href="/blog/category/swimming" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 text-center">
              <div className="text-4xl mb-4 text-purple-500">🏊</div>
              <h3 className="text-lg font-bold mb-2 text-gray-900">Swimming</h3>
              <p className="text-gray-600">Strokes, training, and performance</p>
            </Link>
            
            <Link href="/blog/category/yoga" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 text-center">
              <div className="text-4xl mb-4 text-pink-500">🧘</div>
              <h3 className="text-lg font-bold mb-2 text-gray-900">Yoga</h3>
              <p className="text-gray-600">Flexibility, strength, and mindfulness</p>
            </Link>
            
            <Link href="/blog/category/boxing" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 text-center">
              <div className="text-4xl mb-4 text-indigo-500">🥊</div>
              <h3 className="text-lg font-bold mb-2 text-gray-900">Boxing</h3>
              <p className="text-gray-600">Techniques, training, and conditioning</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Articles */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Latest Articles</h2>
          
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-md overflow-hidden">
              <div className="md:w-1/3">
                <div className="bg-gray-200 border-2 border-dashed w-full h-48 md:h-full" />
              </div>
              <div className="md:w-2/3 p-6">
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <span>Training Guides</span>
                  <span className="mx-2">•</span>
                  <span>Jan 12, 2026</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">How to Improve Your Tennis Serve: A Complete Guide</h3>
                <p className="text-gray-600 mb-4">
                  Master your tennis serve with these step-by-step instructions from professional coaches. 
                  Learn about grip, stance, and timing to add power and accuracy to your serve.
                </p>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="bg-gray-200 border-2 border-dashed rounded-full w-8 h-8 mr-2" />
                    <span className="text-sm text-gray-700">Coach Ajay Sharma</span>
                  </div>
                  <Link href="/blog/tennis-serve" className="text-red-600 font-medium hover:underline">Read More</Link>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-md overflow-hidden">
              <div className="md:w-1/3">
                <div className="bg-gray-200 border-2 border-dashed w-full h-48 md:h-full" />
              </div>
              <div className="md:w-2/3 p-6">
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <span>Sports Nutrition</span>
                  <span className="mx-2">•</span>
                  <span>Jan 10, 2026</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Nutrition Tips for Athletes: Fueling Your Performance</h3>
                <p className="text-gray-600 mb-4">
                  Learn about the right foods and timing to maximize your athletic performance. 
                  Understand the importance of macronutrients and hydration for optimal results.
                </p>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="bg-gray-200 border-2 border-dashed rounded-full w-8 h-8 mr-2" />
                    <span className="text-sm text-gray-700">Sports Nutritionist Priya</span>
                  </div>
                  <Link href="/blog/sports-nutrition" className="text-red-600 font-medium hover:underline">Read More</Link>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-md overflow-hidden">
              <div className="md:w-1/3">
                <div className="bg-gray-200 border-2 border-dashed w-full h-48 md:h-full" />
              </div>
              <div className="md:w-2/3 p-6">
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <span>Platform Updates</span>
                  <span className="mx-2">•</span>
                  <span>Jan 8, 2026</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">New AI-Powered Matching System for Players and Coaches</h3>
                <p className="text-gray-600 mb-4">
                  We've launched our new AI-powered system that matches players with the most suitable coaches 
                  based on skill level, location, and training goals.
                </p>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="bg-gray-200 border-2 border-dashed rounded-full w-8 h-8 mr-2" />
                    <span className="text-sm text-gray-700">TeamUp India Tech Team</span>
                  </div>
                  <Link href="/blog/ai-matching" className="text-red-600 font-medium hover:underline">Read More</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-white px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Stay Updated with Sports News</h2>
          <p className="text-lg text-gray-600 mb-8">
            Subscribe to our newsletter for the latest sports tips, training guides, and platform updates
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-grow px-4 py-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
            />
            <button className="bg-red-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-red-700 transition duration-300">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* 3D Sports Models Section */}
      <section className="py-16 px-6 bg-gradient-to-r from-blue-900 to-purple-900 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">3D Sports Training Resources</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-48 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">3D Cricket Training</h3>
              <p className="text-gray-300">Interactive cricket drills and techniques</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-48 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">3D Football Training</h3>
              <p className="text-gray-300">Virtual football skill development</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-48 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">3D Tennis Training</h3>
              <p className="text-gray-300">Immersive tennis coaching modules</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-48 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">3D Badminton Training</h3>
              <p className="text-gray-300">Advanced badminton technique training</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to Improve Your Sports Performance?</h2>
          <p className="text-lg text-gray-700 mb-8">
            Access our complete library of sports resources and connect with professional coaches.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/register" className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300">
              Join Now
            </Link>
            <Link href="/coaches" className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 px-6 rounded-lg transition duration-300">
              Find a Coach
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogPage;