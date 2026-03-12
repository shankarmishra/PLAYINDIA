import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
  Phone,
  MessageSquare,
  Mail,
  UploadCloud,
  Send,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Ticket
} from 'lucide-react';

const SupportPage = () => {
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState('');
  const [ticketDescription, setTicketDescription] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Ticket submitted successfully! Our support team will contact you soon.');
    setTicketSubject('');
    setTicketCategory('');
    setTicketDescription('');
  };

  const faqs = [
    {
      question: "How long does it take to resolve a ticket?",
      answer: "Most tickets are resolved within 24-48 hours. Critical issues regarding bookings or payments are prioritized and addressed immediately within business hours."
    },
    {
      question: "Can I track my ticket status?",
      answer: "Yes, once submitted, you'll receive a confirmation email with a unique ticket ID. You can use this ID to track your status or reply directly to the email for updates."
    },
    {
      question: "What information should I include in my ticket?",
      answer: "Please provide detailed information about your issue, including the exact steps to reproduce it, screenshots or screen recordings if applicable, and the device/browser you are using."
    },
    {
      question: "Is there a limit on how many tickets I can submit?",
      answer: "No, there is no limit. However, we recommend consolidating related issues into a single ticket whenever possible to help our team resolve them faster."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 selection:bg-red-100">
      <Head>
        <title>Support & Help Desk - TeamUp India</title>
        <meta name="description" content="Submit tickets and get support for the TeamUp India sports platform" />
      </Head>

      {/* Hero Section */}
      <section className="relative py-20 px-6 bg-gradient-to-r from-gray-900 to-gray-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-30 z-0"></div>
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-red-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>

        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-full px-4 py-1.5 text-red-400 text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4" />
            <span>Premium Help Desk</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight">
            How Can We <span className="text-red-500">Help?</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto font-light leading-relaxed">
            Our specialized support team is ready to resolve your issues quickly and get you back in the game.
          </p>
        </div>
      </section>

      {/* Support Channels */}
      <section className="py-20 -mt-12 relative z-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            <div className="bg-white border border-gray-100 p-8 rounded-2xl text-center shadow-md hover:shadow-xl transition-all duration-300 group hover:-translate-y-2">
              <div className="w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-red-600 group-hover:scale-110 transition-all duration-300">
                <Phone className="h-10 w-10 text-red-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900 group-hover:text-red-600 transition-colors">Phone Support</h3>
              <p className="text-gray-600 mb-6 font-medium leading-relaxed">
                Call our support team for immediate assistance with critical queries.
              </p>
              <div className="text-gray-900 font-extrabold text-xl">+91 98765 43210</div>
              <p className="text-gray-400 text-sm mt-2 font-medium">Mon-Fri, 9:00 AM - 6:00 PM</p>
            </div>

            <div className="bg-white border border-gray-100 p-8 rounded-2xl text-center shadow-md hover:shadow-xl transition-all duration-300 group hover:-translate-y-2 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-full blur-3xl -z-10 group-hover:bg-green-100 transition-colors"></div>
              <div className="w-20 h-20 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-green-600 group-hover:scale-110 transition-all duration-300">
                <MessageSquare className="h-10 w-10 text-green-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900 group-hover:text-green-600 transition-colors">Live Chat</h3>
              <p className="text-gray-600 mb-6 font-medium leading-relaxed">
                Connect with an agent in real-time for instant troubleshooting.
              </p>
              <button className="text-green-600 font-bold bg-green-50 py-3 px-8 rounded-xl hover:bg-green-600 hover:text-white transition-colors">Start Chat</button>
            </div>

            <div className="bg-white border border-gray-100 p-8 rounded-2xl text-center shadow-md hover:shadow-xl transition-all duration-300 group hover:-translate-y-2">
              <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-600 group-hover:scale-110 transition-all duration-300">
                <Mail className="h-10 w-10 text-blue-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900 group-hover:text-blue-600 transition-colors">Email Support</h3>
              <p className="text-gray-600 mb-6 font-medium leading-relaxed">
                Send us a detailed email and we'll reply within 24 business hours.
              </p>
              <div className="text-gray-900 font-extrabold text-lg">support@teamupindia.com</div>
              <p className="text-gray-400 text-sm mt-2 font-medium">Avg. response time: 2 hrs</p>
            </div>

          </div>
        </div>
      </section>

      {/* Ticket Submission */}
      <section className="py-20 px-6 bg-white border-y border-gray-100">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Ticket className="w-8 h-8" />
            </div>
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Open a Support Ticket</h2>
            <div className="w-20 h-1.5 bg-red-600 mx-auto rounded-full mb-6"></div>
            <p className="text-xl text-gray-500 font-medium">Provide details about your issue, and our specialists will handle it.</p>
          </div>

          <div className="bg-gray-50 p-8 md:p-12 rounded-[2rem] border border-gray-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-100 rounded-full blur-[80px] opacity-40 pointer-events-none"></div>

            <form onSubmit={handleTicketSubmit} className="relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    required
                    className="w-full px-5 py-4 bg-white border border-gray-300 rounded-xl focus:ring-4 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all font-medium placeholder-gray-400 shadow-sm"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Email Address *</label>
                  <input
                    type="email"
                    required
                    className="w-full px-5 py-4 bg-white border border-gray-300 rounded-xl focus:ring-4 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all font-medium placeholder-gray-400 shadow-sm"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="mb-8">
                <label className="block text-sm font-bold text-gray-700 mb-2">Subject *</label>
                <input
                  type="text"
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  required
                  className="w-full px-5 py-4 bg-white border border-gray-300 rounded-xl focus:ring-4 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all font-medium placeholder-gray-400 shadow-sm"
                  placeholder="Briefly describe your issue..."
                />
              </div>

              <div className="mb-8">
                <label className="block text-sm font-bold text-gray-700 mb-2">Category *</label>
                <select
                  value={ticketCategory}
                  onChange={(e) => setTicketCategory(e.target.value)}
                  required
                  className="w-full px-5 py-4 bg-white border border-gray-300 rounded-xl focus:ring-4 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all font-medium text-gray-700 shadow-sm appearance-none"
                >
                  <option value="" disabled>Select a relevant category</option>
                  <option value="account">Account & Profile</option>
                  <option value="payment">Billing & Payments</option>
                  <option value="technical">Technical Glitch / Bug</option>
                  <option value="booking">Coaching Bookings</option>
                  <option value="delivery">Store / Delivery Orders</option>
                  <option value="other">General Inquiry</option>
                </select>
              </div>

              <div className="mb-8">
                <label className="block text-sm font-bold text-gray-700 mb-2">Description *</label>
                <textarea
                  value={ticketDescription}
                  onChange={(e) => setTicketDescription(e.target.value)}
                  required
                  rows={6}
                  className="w-full px-5 py-4 bg-white border border-gray-300 rounded-xl focus:ring-4 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all font-medium placeholder-gray-400 resize-none shadow-sm"
                  placeholder="Please provide as much detail as possible to help us understand..."
                ></textarea>
              </div>

              <div className="mb-10">
                <label className="block text-sm font-bold text-gray-700 mb-2">Upload Attachments (Optional)</label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-white hover:bg-gray-50 hover:border-red-400 transition-colors group">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <div className="w-12 h-12 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mb-4 group-hover:bg-red-50 group-hover:text-red-500 transition-colors">
                        <UploadCloud className="w-6 h-6" />
                      </div>
                      <p className="mb-2 text-sm text-gray-600 font-medium"><span className="text-red-600 font-bold">Click to upload</span> or drag and drop</p>
                      <p className="text-xs text-gray-400 font-medium">PNG, JPG, PDF (Max 5MB)</p>
                    </div>
                    <input type="file" className="hidden" multiple />
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-red-600 text-white font-bold py-4 px-8 rounded-xl hover:bg-red-700 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 shadow-lg"
              >
                <Send className="w-5 h-5" />
                Submit Request
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Ticketing FAQs</h2>
            <div className="w-20 h-1.5 bg-red-600 mx-auto rounded-full mb-6"></div>
            <p className="text-xl text-gray-500 font-medium">Learn more about our support process.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`bg-white border rounded-2xl overflow-hidden transition-all duration-300 ${openFaq === index ? 'border-red-300 shadow-md' : 'border-gray-200 hover:border-red-100 shadow-sm'}`}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-8 py-6 flex justify-between items-center text-left focus:outline-none"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${openFaq === index ? 'bg-red-600 text-white' : 'bg-red-50 text-red-600'}`}>
                      <HelpCircle className="w-5 h-5" />
                    </div>
                    <h3 className={`font-bold text-lg md:text-xl transition-colors ${openFaq === index ? 'text-red-600' : 'text-gray-900'}`}>{faq.question}</h3>
                  </div>
                  <div className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full transition-colors ${openFaq === index ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-400'}`}>
                    {openFaq === index ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${openFaq === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <div className="px-8 pb-6 pt-2 text-gray-600 font-medium leading-relaxed pl-[4.5rem]">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-4 bg-white">
        <div className="max-w-[100rem] mx-auto text-center px-6">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-red-600/10 rounded-full blur-3xl"></div>

            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">Everything Resolved?</h2>
              <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto font-light">
                Head back and continue experiencing the best of the TeamUp India ecosystem.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-6">
                <Link href="/" className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-10 rounded-full transition-all duration-300 shadow-lg hover:scale-105">
                  Go to Homepage
                </Link>
                <Link href="/contact" className="bg-gray-800 border border-gray-700 text-white hover:bg-gray-700 font-bold py-4 px-10 rounded-full transition-all duration-300 shadow-lg hover:scale-105">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SupportPage;