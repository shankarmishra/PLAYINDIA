import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/Layout';

const TermsPage = () => {
  return (
    <Layout title="Terms and Conditions - TeamUp India" description="TeamUp India terms and conditions for using our platform">
      <Head>
        <title>Terms and Conditions - TeamUp India</title>
        <meta name="description" content="TeamUp India terms and conditions for using our platform" />
      </Head>

      {/* Hero Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Terms and Conditions</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Please read these terms and conditions carefully before using TeamUp India platform
          </p>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Last updated: January 1, 2026</h2>
            
            <p className="text-gray-700 mb-6">
              Welcome to TeamUp India. These terms and conditions outline the rules and regulations 
              for the use of TeamUp India's Website and Mobile Application.
            </p>
            
            <p className="text-gray-700 mb-6">
              By accessing this website and using our mobile application, we assume you accept 
              these terms and conditions. Do not continue to use TeamUp India if you do not agree 
              to take all of the terms and conditions stated on this page.
            </p>
            
            <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">Eligibility</h3>
            <p className="text-gray-700 mb-6">
              By agreeing to these Terms, you represent and warrant to us: (i) that you are at least 
              18 years of age; (ii) that you have not previously been suspended or removed from our 
              Service; and (iii) that your registration and your use of our Service is in compliance 
              with any and all applicable laws and regulations.
            </p>
            
            <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">Account Registration</h3>
            <p className="text-gray-700 mb-4">
              When you register for an account with TeamUp India, you agree to:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>Provide accurate, current, and complete information about yourself</li>
              <li>Maintain and promptly update your account information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Accept all risks of unauthorized access to your account and the information you provide to us</li>
            </ul>
            
            <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">User Conduct</h3>
            <p className="text-gray-700 mb-4">
              As a user of the Service, you agree not to:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>Use the Service for any illegal or unauthorized purpose</li>
              <li>Violate any local, state, national, or international laws</li>
              <li>Interfere with or disrupt the Service or servers or networks connected to the Service</li>
              <li>Use the Service in any manner that could disable, overburden, damage, or impair the Service</li>
              <li>Use any robot, spider, crawler, scraper, or other automated means to access the Service</li>
              <li>Attempt to gain unauthorized access to any portion of the Service</li>
              <li>Harass, abuse, or harm another person</li>
            </ul>
            
            <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">Booking and Payment Terms</h3>
            <p className="text-gray-700 mb-4">
              For users booking coaching sessions or purchasing products:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>All bookings are subject to coach availability and confirmation</li>
              <li>Payment must be made at the time of booking</li>
              <li>Cancellations must be made at least 24 hours in advance to receive a refund</li>
              <li>TeamUp India reserves the right to charge cancellation fees</li>
              <li>Coaches may have their own cancellation policies</li>
            </ul>
            
            <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">Coach and Store Terms</h3>
            <p className="text-gray-700 mb-4">
              For coaches and stores using the platform:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>You must provide accurate and up-to-date information about your services</li>
              <li>You are responsible for the quality of services you provide</li>
              <li>You must maintain all required licenses and certifications</li>
              <li>You agree to honor all bookings and orders made through our platform</li>
              <li>You are responsible for any issues related to the services you provide</li>
              <li>TeamUp India is not responsible for the quality of services provided</li>
            </ul>
            
            <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">Intellectual Property</h3>
            <p className="text-gray-700 mb-6">
              The Service and its original content, features, and functionality are and will remain 
              the exclusive property of TeamUp India and its licensors. The Service is protected by 
              copyright, trademark, and other laws of both India and foreign countries. Our trademarks 
              and trade dress may not be used in connection with any product or service without the 
              prior written consent of TeamUp India.
            </p>
            
            <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">Limitation of Liability</h3>
            <p className="text-gray-700 mb-4">
              In no event shall TeamUp India, nor its directors, employees, partners, agents, suppliers, 
              or affiliates, be liable for any indirect, incidental, special, consequential or punitive 
              damages, including without limitation, loss of profits, data, use, goodwill, or other 
              intangible losses, resulting from your access to or use of or inability to access or use the Service.
            </p>
            <p className="text-gray-700 mb-6">
              TeamUp India shall not be liable for any damages resulting from: (i) your use of or inability 
              to use the Service; (ii) any unauthorized access to or use of our servers and/or any personal 
              information stored therein; (iii) any interruption or cessation of transmission to or from the Service.
            </p>
            
            <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">Dispute Resolution</h3>
            <p className="text-gray-700 mb-6">
              Any disputes arising out of or related to these Terms or the Service shall be resolved 
              through binding arbitration in accordance with the Arbitration and Conciliation Act, 1996. 
              The seat of arbitration shall be New Delhi, India, and the language of arbitration shall be English.
            </p>
            
            <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">Governing Law</h3>
            <p className="text-gray-700 mb-6">
              These Terms shall be governed and construed in accordance with the laws of India, without 
              regard to its conflict of law provisions. Our failure to enforce any right or provision of 
              these Terms will not be considered a waiver of those rights. If any provision of these Terms 
              is held to be invalid or unenforceable by a court, the remaining provisions of these Terms 
              will remain in effect.
            </p>
            
            <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">Changes to Terms</h3>
            <p className="text-gray-700 mb-6">
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. 
              If a revision is material we will provide at least 30 days' notice prior to any new terms 
              taking effect. What constitutes a material change will be determined at our sole discretion.
            </p>
            
            <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">Contact Us</h3>
            <p className="text-gray-700">
              If you have any questions about these Terms and Conditions, please contact us:
            </p>
            <ul className="list-disc pl-6 mt-4 text-gray-700">
              <li>By email: legal@teamupindia.com</li>
              <li>By visiting this page on our website: teamupindia.com/contact</li>
              <li>By phone number: +91 98765 43210</li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Have Questions About Our Terms?</h2>
          <p className="text-lg text-gray-700 mb-8">
            Our team is here to help you understand our terms and conditions.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/contact" className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300">
              Contact Us
            </Link>
            <Link href="/help" className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 px-6 rounded-lg transition duration-300">
              Visit Help Center
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default TermsPage;