import Head from 'next/head';
import Link from 'next/link';

export default function CoachRegisterStep5() {
  return (
    <div>
      <Head>
        <title>Register as Coach - Step 5 - TeamUp India</title>
        <meta name="description" content="Register as a coach on TeamUp India - Step 5: Document Upload" />
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
                  <div className="w-1 h-1 rounded-full bg-blue-500 self-center"></div>
                  <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center">3</div>
                  <div className="w-1 h-1 rounded-full bg-blue-500 self-center"></div>
                  <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center">4</div>
                  <div className="w-1 h-1 rounded-full bg-blue-500 self-center"></div>
                  <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center">5</div>
                </div>
              </div>
              <p className="text-center text-gray-600 text-sm mt-2">Step 5 of 5: Document Upload</p>
            </div>
            
            <form className="space-y-8">
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-800 mb-4">Auto Verification Process</h3>
                <p className="text-blue-700 mb-4">Our system will automatically verify your documents using OCR technology:</p>
                <ul className="list-disc pl-6 text-blue-700 space-y-2">
                  <li>Name matching between documents</li>
                  <li>Photo verification</li>
                  <li>Document authenticity check</li>
                  <li>Generating verification score</li>
                </ul>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Aadhaar / PAN Card *</label>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50">
                        <div className="text-center">
                          <svg className="mx-auto h-8 w-8 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <p className="text-sm text-gray-500">Front Side</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50">
                        <div className="text-center">
                          <svg className="mx-auto h-8 w-8 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <p className="text-sm text-gray-500">Back Side</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Coaching Certificate *</label>
                  <div className="flex items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50">
                    <div className="text-center">
                      <svg className="mx-auto h-8 w-8 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <p className="text-sm text-gray-500">Upload Coaching Certificate</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Achievement Proof (Optional)</label>
                  <div className="flex items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50">
                    <div className="text-center">
                      <svg className="mx-auto h-8 w-8 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <p className="text-sm text-gray-500">Upload Achievement Certificates</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between">
                <Link href="/register/coach/step4" className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg transition duration-300">
                  Back to Step 4
                </Link>
                <Link href="/register/coach/success" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-300">
                  Submit & Verify
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