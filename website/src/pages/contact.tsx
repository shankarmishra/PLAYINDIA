import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
  Phone,
  Mail,
  MapPin,
  MessageSquare,
  Send,
  HelpCircle,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
  HeadphonesIcon
} from 'lucide-react';

const ContactPage = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      question: "How do I register as a coach on TeamUp India?",
      answer: "You can register as a coach by visiting our registration page and completing the multi-step form. You'll need to provide personal details, professional information, upload documents, and set your coaching preferences. Our team will verify your credentials before approving your profile."
    },
    {
      question: "How do players find coaches on the platform?",
      answer: "Players can search for coaches based on location, sport, experience, and ratings. They can view coach profiles, check availability, read reviews, and book sessions directly through the platform."
    },
    {
      question: "How do stores list their products?",
      answer: "Stores can log in to their dashboard and navigate to the product management section. They can add product details, images, pricing, and inventory information. Our platform supports various sports equipment categories."
    },
    {
      question: "How do delivery partners get paid?",
      answer: "Delivery partners earn for each successful delivery completed through our platform. Payments are processed regularly, and earnings can be tracked in the delivery partner dashboard. Payment details are linked to your bank account during registration."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-indigo-100">
      <Head>
        <title>Contact Us - TeamUp India</title>
        <meta name="description" content="Get in touch with TeamUp India for any queries or support" />
      </Head>

      {/* Hero Section */}

      <section className="relative py-14 px-6 bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-red-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
        <div className="relative z-10 max-w-7xl mx-auto text-center">

          <h1 className="text-4xl md:text-4xl font-bold mb-6 text-500">Get in <span className="text-red-400">Touch</span></h1>
          <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed font-medium">
            Have questions? We're here to help. Reach out to our dedicated support team or explore partnership opportunities.
          </p>

        </div>
      </section>

      {/* <section className="relative py-4 px-6 bg-slate-950 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]"></div>

        <div className="relative z-10 max-w-7xl mx-auto text-center">
         
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter">
            Get in <span className="bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent">Touch</span>
          </h1>
        
        </div>
      </section> */}

      {/* Main Contact Section */}
      <section className="py-24 -mt-12 relative z-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8 md:p-12">

            {/* Contact Information (Left Side) */}
            <div className="lg:col-span-2 space-y-10">
              <div>
                <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Contact Information</h2>
                <p className="text-slate-600 text-lg">
                  Fill up the form and our team will get back to you within 24 hours.
                </p>
              </div>

              <div className="space-y-8 mt-10">
                <div className="flex items-start group">
                  <div className="flex-shrink-0 bg-indigo-50 p-4 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                    <Phone className="w-6 h-6 text-indigo-600 group-hover:text-white transition-colors" />
                  </div>
                  <div className="ml-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-1">Phone Line</h3>
                    <p className="text-slate-600 font-medium">+91 98765 43210</p>
                    <p className="text-slate-500 text-sm mt-1">Mon-Fri from 9:00 AM to 6:00 PM</p>
                  </div>
                </div>

                <div className="flex items-start group">
                  <div className="flex-shrink-0 bg-blue-50 p-4 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                    <Mail className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />
                  </div>
                  <div className="ml-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-1">Email Address</h3>
                    <p className="text-slate-600 font-medium">support@teamupindia.com</p>
                    <p className="text-slate-600 font-medium">partnerships@teamupindia.com</p>
                  </div>
                </div>

                <div className="flex items-start group">
                  <div className="flex-shrink-0 bg-emerald-50 p-4 rounded-2xl group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                    <MapPin className="w-6 h-6 text-emerald-600 group-hover:text-white transition-colors" />
                  </div>
                  <div className="ml-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-1">Our Office</h3>
                    <p className="text-slate-600 font-medium">123, Sports Complex Road</p>
                    <p className="text-slate-600 font-medium">Connaught Place, New Delhi - 110001</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form (Right Side) */}
            <div className="lg:col-span-3 bg-slate-50 p-8 md:p-10 rounded-[2rem] border border-slate-100">
              <h3 className="text-2xl font-bold text-slate-900 mb-8 tracking-tight">Send us a Message</h3>
              <form className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      className="w-full px-5 py-4 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-medium placeholder-slate-400"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-5 py-4 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-medium placeholder-slate-400"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-bold text-slate-700 mb-2">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    className="w-full px-5 py-4 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-medium placeholder-slate-400"
                    placeholder="How can we help you?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-bold text-slate-700 mb-2">Message</label>
                  <textarea
                    id="message"
                    rows={5}
                    className="w-full px-5 py-4 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-medium placeholder-slate-400 resize-none"
                    placeholder="Describe your issue or inquiry in detail..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white font-bold py-4 px-8 rounded-xl hover:bg-indigo-700 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_10px_20px_rgba(79,70,229,0.2)] hover:shadow-[0_15px_30px_rgba(79,70,229,0.3)]"
                >
                  <Send className="w-5 h-5" />
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Support Options */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Need Immediate Help?</h2>
            <div className="w-20 h-1.5 bg-indigo-600 mx-auto rounded-full mb-6"></div>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium">Choose the support channel that works best for you.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-50 border border-slate-100 p-8 rounded-[2rem] text-center hover:shadow-xl transition-all duration-300 group hover:-translate-y-2">
              <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300">
                <MessageSquare className="h-10 w-10 text-indigo-600" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-slate-900 group-hover:text-indigo-600 transition-colors">Live Chat</h3>
              <p className="text-slate-600 mb-6 font-medium leading-relaxed">
                Connect with our support team in real-time for immediate assistance.
              </p>
              <button className="text-indigo-600 font-bold bg-indigo-50 py-3 px-8 rounded-xl hover:bg-indigo-100 transition-colors">Start Chat</button>
            </div>

            <div className="bg-slate-50 border border-slate-100 p-8 rounded-[2rem] text-center hover:shadow-xl transition-all duration-300 group hover:-translate-y-2">
              <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300">
                <HeadphonesIcon className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-slate-900 group-hover:text-blue-600 transition-colors">Phone Support</h3>
              <p className="text-slate-600 mb-6 font-medium leading-relaxed">
                Call our technical team for detailed assistance with your queries.
              </p>
              <div className="text-slate-900 font-extrabold text-xl">+91 98765 43210</div>
            </div>

            <div className="bg-slate-50 border border-slate-100 p-8 rounded-[2rem] text-center hover:shadow-xl transition-all duration-300 group hover:-translate-y-2">
              <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300">
                <Mail className="h-10 w-10 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-slate-900 group-hover:text-emerald-600 transition-colors">Email Us</h3>
              <p className="text-slate-600 mb-6 font-medium leading-relaxed">
                Send us an email anytime and we'll respond within 24 business hours.
              </p>
              <div className="text-slate-900 font-extrabold">support@teamupindia.com</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-slate-50 border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Frequently Asked Questions</h2>
            <div className="w-20 h-1.5 bg-indigo-600 mx-auto rounded-full mb-6"></div>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium">Find quick answers to common questions about our platform.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`bg-white border rounded-2xl overflow-hidden transition-all duration-300 ${openFaq === index ? 'border-indigo-200 shadow-lg' : 'border-slate-200 hover:border-indigo-100 shadow-sm'}`}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-8 py-6 flex justify-between items-center text-left focus:outline-none"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${openFaq === index ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-600'}`}>
                      <HelpCircle className="w-5 h-5" />
                    </div>
                    <h3 className={`font-bold text-lg md:text-xl transition-colors ${openFaq === index ? 'text-indigo-600' : 'text-slate-900'}`}>{faq.question}</h3>
                  </div>
                  <div className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full transition-colors ${openFaq === index ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-50 text-slate-400'}`}>
                    {openFaq === index ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${openFaq === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <div className="px-8 pb-6 pt-2 text-slate-600 font-medium leading-relaxed pl-[4.5rem]">
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
        <div className="max-w-10xl mx-auto text-center">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-1xl p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl"></div>

            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter">Ready to Get Started?</h2>
              <p className="text-xl md:text-2xl text-slate-400 mb-12 max-w-2xl mx-auto font-medium">
                Join India's premier sports ecosystem and experience the difference today.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-6">
                <Link href="/register" className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-5 px-12 rounded-2xl transition-all duration-300 shadow-[0_20px_40px_rgba(79,70,229,0.3)] hover:scale-105 active:scale-95 text-xl">
                  Create Account
                </Link>
                <Link href="/how-it-works" className="bg-white/5 text-white hover:bg-white/10 font-bold py-5 px-12 rounded-2xl transition-all duration-300 border border-white/10 backdrop-blur-sm text-xl">
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;