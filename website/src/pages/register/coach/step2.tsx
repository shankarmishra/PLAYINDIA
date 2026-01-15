import Head from 'next/head';
import Link from 'next/link';

export default function CoachRegisterStep2() {
  return (
    <div>
      <Head>
        <title>Register as Coach - Step 2 - TeamUp India</title>
        <meta name="description" content="Register as a coach on TeamUp India - Step 2: Professional Details" />
      </Head>

      {/* Coach Registration Hero */}
      <section className="py-20 px-6 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-6">Become a Verified Coach</h1>
          <p className="text-xl text-gray-300">Join our verified coach network and grow your business</p>
        </div>
      </section>

      {/* Coach Registration Form */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200">
            <div className="mb-8">
              <div className="flex items-center justify-center">
                <div className="text-4xl mr-4">👨‍🏫</div>
                <h2 className="text-2xl font-bold text-gray-800">Coach Registration</h2>
              </div>
              <p className="text-center text-gray-600 mt-2">Complete the form to register as a verified coach</p>
            </div>
            
            <div className="mb-6">
              <div className="flex justify-center">
                <div className="flex space-x-2">
                  <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center">1</div>
                  <div className="w-1 h-1 rounded-full bg-blue-500 self-center"></div>
                  <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center">2</div>
                  <div className="w-1 h-1 rounded-full bg-gray-300 self-center"></div>
                  <div className="w-8 h-8 rounded-full bg-gray-300 text-white flex items-center justify-center">3</div>
                  <div className="w-1 h-1 rounded-full bg-gray-300 self-center"></div>
                  <div className="w-8 h-8 rounded-full bg-gray-300 text-white flex items-center justify-center">4</div>
                  <div className="w-1 h-1 rounded-full bg-gray-300 self-center"></div>
                  <div className="w-8 h-8 rounded-full bg-gray-300 text-white flex items-center justify-center">5</div>
                </div>
              </div>
              <p className="text-center text-gray-600 text-sm mt-2">Step 2 of 5: Professional Details</p>
            </div>
            
            <form className="space-y-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Sports Category *</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {['Cricket', 'Football', 'Tennis', 'Badminton', 'Basketball', 'Swimming'].map((sport) => (
                    <div key={sport} className="flex items-center">
                      <input 
                        type="checkbox" 
                        id={sport.toLowerCase()} 
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" 
                      />
                      <label htmlFor={sport.toLowerCase()} className="ml-2 text-gray-700">{sport}</label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="experience" className="block text-gray-700 font-medium mb-2">Experience (Years) *</label>
                  <select 
                    id="experience" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select years of experience</option>
                    <option value="0-1">0-1 years</option>
                    <option value="1-3">1-3 years</option>
                    <option value="3-5">3-5 years</option>
                    <option value="5-10">5-10 years</option>
                    <option value="10+">10+ years</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Coaching Type *</label>
                  <div className="space-y-2">
                    {['Personal', 'Group', 'Academy'].map((type) => (
                      <div key={type} className="flex items-center">
                        <input 
                          type="radio" 
                          id={type.toLowerCase()} 
                          name="coachingType" 
                          className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" 
                        />
                        <label htmlFor={type.toLowerCase()} className="ml-2 text-gray-700">{type}</label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div>
                <label htmlFor="languages" className="block text-gray-700 font-medium mb-2">Languages Spoken *</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {['Hindi', 'English', 'Tamil', 'Telugu', 'Marathi', 'Bengali', 'Punjabi', 'Gujarati', 'Kannada', 'Malayalam'].map((lang) => (
                    <div key={lang} className="flex items-center">
                      <input 
                        type="checkbox" 
                        id={lang.toLowerCase()} 
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" 
                      />
                      <label htmlFor={lang.toLowerCase()} className="ml-2 text-gray-700">{lang}</label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <label htmlFor="about" className="block text-gray-700 font-medium mb-2">About Coach *</label>
                <textarea 
                  id="about" 
                  rows={4} 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  placeholder="Tell us about your coaching experience, achievements, and what makes you a great coach"
                ></textarea>
              </div>
              
              <div className="flex justify-between">
                <Link href="/register/coach/step1" className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg transition duration-300">
                  Back to Step 1
                </Link>
                <Link href="/register/coach/step3" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-300">
                  Continue to Step 3
                </Link>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Benefits for Coaches */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Why Register as a Coach?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Earning Opportunities</h3>
              <p className="text-gray-600">Earn through bookings and grow your coaching business.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Verified Status</h3>
              <p className="text-gray-600">Get verified status to build trust with players.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Analytics</h3>
              <p className="text-gray-600">Track your bookings, earnings, and performance.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Community</h3>
              <p className="text-gray-600">Connect with players and other coaches.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}