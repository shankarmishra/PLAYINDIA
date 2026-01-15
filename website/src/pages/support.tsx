import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

const SupportPage = () => {
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState('');
  const [ticketDescription, setTicketDescription] = useState('');

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you would send this data to your backend
    alert('Ticket submitted successfully! Our support team will contact you soon.');
    setTicketSubject('');
    setTicketCategory('');
    setTicketDescription('');
  };

  return (
    <div>
      <Head>
        <title>Support & Ticket System - TeamUp India</title>
        <meta name="description" content="Submit tickets and get support for TeamUp India platform" />
      </Head>

      {/* Hero Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Support & Ticket System</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Need help? Submit a ticket and our support team will assist you promptly
          </p>
        </div>
      </section>

      {/* Support Options */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How Can We Help You?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Phone Support</h3>
              <p className="text-gray-600 mb-4">
                Call our support team for immediate assistance with your queries
              </p>
              <p className="text-gray-900 font-semibold">+91 98765 43210</p>
              <p className="text-gray-500 text-sm">Mon-Fri, 9AM-6PM</p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Live Chat</h3>
              <p className="text-gray-600 mb-4">
                Connect with our support team in real-time for immediate assistance
              </p>
              <button className="text-red-600 font-semibold hover:underline">Start Chat</button>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Email Support</h3>
              <p className="text-gray-600 mb-4">
                Send us an email and we'll respond within 24 hours
              </p>
              <p className="text-gray-900 font-semibold">support@teamupindia.com</p>
            </div>
          </div>
        </div>
      </section>

      {/* Ticket Submission */}
      <section className="py-16 bg-gray-100 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Submit a Support Ticket</h2>
          <div className="bg-white p-8 rounded-lg shadow-md">
            <form onSubmit={handleTicketSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-gray-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Email Address *</label>
                  <input
                    type="email"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                    placeholder="Enter your email"
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 mb-2">Subject *</label>
                <input
                  type="text"
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                  placeholder="Briefly describe your issue"
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 mb-2">Category *</label>
                <select
                  value={ticketCategory}
                  onChange={(e) => setTicketCategory(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                >
                  <option value="">Select a category</option>
                  <option value="account">Account Issues</option>
                  <option value="payment">Payment Problems</option>
                  <option value="technical">Technical Issues</option>
                  <option value="booking">Booking Problems</option>
                  <option value="delivery">Delivery Issues</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 mb-2">Description *</label>
                <textarea
                  value={ticketDescription}
                  onChange={(e) => setTicketDescription(e.target.value)}
                  required
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                  placeholder="Please provide detailed information about your issue"
                ></textarea>
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 mb-2">Upload Screenshot (Optional)</label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.6 5.6 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                      </svg>
                      <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF (MAX. 5MB)</p>
                    </div>
                    <input type="file" className="hidden" />
                  </label>
                </div>
              </div>
              
              <button
                type="submit"
                className="w-full bg-red-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-red-700 transition duration-300"
              >
                Submit Ticket
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-bold text-gray-900 mb-2">How long does it take to resolve a ticket?</h3>
              <p className="text-gray-600">
                Most tickets are resolved within 24-48 hours. Critical issues are prioritized and addressed immediately.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Can I track my ticket status?</h3>
              <p className="text-gray-600">
                Yes, you can track your ticket status in your account dashboard or via the email updates we send.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-bold text-gray-900 mb-2">What information should I include in my ticket?</h3>
              <p className="text-gray-600">
                Please include detailed information about the issue, steps to reproduce it, screenshots if possible, and your account information.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Is there a ticket limit per user?</h3>
              <p className="text-gray-600">
                No, there is no limit on the number of tickets you can submit. However, please ensure each ticket addresses a different issue.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SupportPage;