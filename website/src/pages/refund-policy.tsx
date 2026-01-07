import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/Layout';

const RefundPage = () => {
  return (
    <Layout title="Refund Policy - TeamUp India" description="TeamUp India refund policy for purchases and services">
      <Head>
        <title>Refund Policy - TeamUp India</title>
        <meta name="description" content="TeamUp India refund policy for purchases and services" />
      </Head>

      {/* Hero Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Refund Policy</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Our commitment to fair and transparent refund processes
          </p>
        </div>
      </section>

      {/* Refund Content */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Last updated: January 1, 2026</h2>
            
            <p className="text-gray-700 mb-6">
              Thank you for using TeamUp India. We value our customers and strive to provide excellent 
              service. If you have purchased services through our platform and wish to request a refund, 
              please read our refund policy carefully.
            </p>
            
            <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">General Refund Policy</h3>
            <p className="text-gray-700 mb-4">
              Our refund policy applies to purchases made through our platform, including coaching 
              session bookings, tournament entry fees, and equipment purchases from partner stores.
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>Refunds are processed within 7-10 business days after approval</li>
              <li>Refunds are credited to the original payment method used for purchase</li>
              <li>All refund requests are subject to review and approval</li>
              <li>Fraudulent refund requests will be reported to authorities</li>
            </ul>
            
            <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">Coaching Session Refunds</h3>
            <p className="text-gray-700 mb-4">
              For coaching session bookings:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>Full refund available if canceled at least 24 hours before scheduled session</li>
              <li>50% refund available if canceled between 2-24 hours before scheduled session</li>
              <li>No refund available if canceled less than 2 hours before scheduled session</li>
              <li>No-shows will not be refunded</li>
              <li>Refunds for medical emergencies may be considered with proper documentation</li>
            </ul>
            
            <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">Tournament Entry Fee Refunds</h3>
            <p className="text-gray-700 mb-4">
              For tournament entry fees:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>Full refund available if canceled at least 7 days before tournament date</li>
              <li>50% refund available if canceled between 3-7 days before tournament date</li>
              <li>No refund available if canceled less than 3 days before tournament date</li>
              <li>Refunds for medical emergencies may be considered with proper documentation</li>
              <li>Tournament cancellations by organizers result in full refunds</li>
            </ul>
            
            <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">Equipment Purchase Refunds</h3>
            <p className="text-gray-700 mb-4">
              For equipment purchases from partner stores:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>Refunds available within 7 days of delivery for unused items in original packaging</li>
              <li>Items showing signs of use may not be eligible for refund</li>
              <li>Damaged items during shipping are eligible for replacement or refund</li>
              <li>Customized items are not eligible for refund unless defective</li>
              <li>Return shipping costs may apply depending on store policy</li>
            </ul>
            
            <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">How to Request a Refund</h3>
            <p className="text-gray-700 mb-4">
              To request a refund:
            </p>
            <ol className="list-decimal pl-6 mb-6 text-gray-700 space-y-2">
              <li>Log in to your TeamUp India account</li>
              <li>Navigate to "My Purchases" or "Booking History"</li>
              <li>Select the item or booking you wish to refund</li>
              <li>Click "Request Refund" and provide reason for refund</li>
              <li>Attach any required documentation if applicable</li>
              <li>Submit your refund request</li>
              <li>Our team will review your request and notify you within 2 business days</li>
            </ol>
            
            <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">Non-Refundable Situations</h3>
            <p className="text-gray-700 mb-4">
              Refunds are not available in the following situations:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>Services already rendered or partially completed</li>
              <li>Equipment used or damaged by customer</li>
              <li>Refund requests made after the specified time limits</li>
              <li>Requests that violate our terms of service</li>
              <li>Charges related to fraudulent activities</li>
              <li>Subscription fees (except as required by law)</li>
            </ul>
            
            <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">Refund Processing</h3>
            <p className="text-gray-700 mb-4">
              Once approved, refunds are processed as follows:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>Credit card refunds: 5-10 business days to appear in account</li>
              <li>Debit card refunds: 5-10 business days to appear in account</li>
              <li>Net banking refunds: 3-7 business days to appear in account</li>
              <li>UPI refunds: 1-3 business days to appear in account</li>
              <li>Wallet refunds: Immediate credit to TeamUp India wallet</li>
            </ul>
            
            <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">Special Circumstances</h3>
            <p className="text-gray-700 mb-4">
              In special circumstances such as:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>Service not provided as promised</li>
              <li>Technical issues preventing service access</li>
              <li>Force majeure events affecting service delivery</li>
              <li>System errors in billing</li>
            </ul>
            <p className="text-gray-700 mb-6">
              Customers may be eligible for full refunds even outside normal refund windows. 
              Please contact our support team for evaluation.
            </p>
            
            <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">Contact Us</h3>
            <p className="text-gray-700 mb-4">
              If you have any questions about our refund policy or need to request a refund, please contact us:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>By email: refunds@teamupindia.com</li>
              <li>Through the refund request form in your account</li>
              <li>By phone: +91 98765 43210 (Monday-Friday, 9 AM - 6 PM)</li>
              <li>By visiting our help center: teamupindia.com/help</li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Have Questions About Refunds?</h2>
          <p className="text-lg text-gray-700 mb-8">
            Our team is here to help you understand our refund policy and assist with your requests.
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

export default RefundPage;