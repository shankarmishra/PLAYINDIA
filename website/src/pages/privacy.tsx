import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

const PrivacyPage = () => {
  return (
    <div>
      <Head>
        <title>Privacy Policy - TeamUp India</title>
        <meta name="description" content="TeamUp India privacy policy and data protection information" />
      </Head>

      {/* Hero Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Privacy Policy</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Your privacy is important to us. Learn how we collect, use, and protect your information.
          </p>
        </div>
      </section>

      {/* Privacy Content */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Effective Date: January 1, 2026</h2>
            
            <p className="text-gray-700 mb-6">
              TeamUp India ("we", "us", or "our") operates the TeamUp India platform (the "Service"). 
              This page informs you of our policies regarding the collection, use, and disclosure of 
              personal data when you use our Service and the choices you have associated with that data.
            </p>
            
            <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">Information We Collect</h3>
            <p className="text-gray-700 mb-4">
              We collect several different types of information for various purposes to provide and 
              improve our Service to you.
            </p>
            
            <h4 className="font-bold text-gray-800 mb-2">Personal Data</h4>
            <p className="text-gray-700 mb-4">
              While using our Service, we may ask you to provide us with certain personally 
              identifiable information that can be used to contact or identify you ("Personal Data"). 
              Personally identifiable information may include, but is not limited to:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>Email address</li>
              <li>First name and last name</li>
              <li>Phone number</li>
              <li>Address, State, Province, ZIP/Postal code, City</li>
              <li>Usage Data</li>
            </ul>
            
            <h4 className="font-bold text-gray-800 mb-2">Usage Data</h4>
            <p className="text-gray-700 mb-6">
              We may also collect information about how the Service is accessed and used ("Usage Data"). 
              This Usage Data may include information such as your computer's Internet Protocol address 
              (e.g. IP address), browser type, browser version, the pages of our Service that you visit, 
              the time and date of your visit, the time spent on those pages, unique device identifiers 
              and other diagnostic data.
            </p>
            
            <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">Use of Data</h3>
            <p className="text-gray-700 mb-4">
              TeamUp India uses the collected data for various purposes:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>To provide and maintain our Service</li>
              <li>To notify you about changes to our Service</li>
              <li>To allow you to participate in interactive features of our Service when you choose to do so</li>
              <li>To provide customer support</li>
              <li>To gather analysis or valuable information so that we can improve our Service</li>
              <li>To monitor the usage of our Service</li>
              <li>To detect, prevent and address technical issues</li>
            </ul>
            
            <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">Security of Data</h3>
            <p className="text-gray-700 mb-4">
              The security of your data is important to us but remember that no method of transmission 
              over the Internet or method of electronic storage is 100% secure. While we strive to use 
              commercially acceptable means to protect your Personal Data, we cannot guarantee its 
              absolute security.
            </p>
            
            <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">Service Providers</h3>
            <p className="text-gray-700 mb-4">
              We may employ third party companies and individuals to facilitate our Service ("Service Providers"), 
              provide the Service on our behalf, perform Service-related services or assist us in analyzing 
              how our Service is used.
            </p>
            <p className="text-gray-700 mb-6">
              These third parties have access to your Personal Data only to perform these tasks on our behalf 
              and are obligated not to disclose or use it for any other purpose.
            </p>
            
            <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">Disclosure of Data</h3>
            <p className="text-gray-700 mb-4">
              We may disclose your Personal Data in the good faith belief that such action is necessary to:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>To comply with a legal obligation</li>
              <li>To protect and defend the rights or property of TeamUp India</li>
              <li>To prevent or investigate possible wrongdoing in connection with the Service</li>
              <li>To protect the personal safety of users of the Service or the public</li>
              <li>To protect against legal liability</li>
            </ul>
            
            <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">Data Retention</h3>
            <p className="text-gray-700 mb-6">
              We will retain your Personal Data only for as long as is necessary for the purposes set 
              out in this Privacy Policy. We will retain and use your Personal Data to the extent 
              necessary to comply with our legal obligations (for example, if we are required to retain 
              your data to comply with applicable laws), resolve disputes, and enforce our legal agreements and policies.
            </p>
            
            <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">Your Data Protection Rights</h3>
            <p className="text-gray-700 mb-4">
              Depending on your location, you may have the following rights regarding your Personal Data:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li><strong>The right to access</strong> - You have the right to request copies of your Personal Data.</li>
              <li><strong>The right to rectification</strong> - You have the right to request that we correct any information you believe is inaccurate or complete information you believe is incomplete.</li>
              <li><strong>The right to erasure</strong> - You have the right to request that we erase your Personal Data, under certain conditions.</li>
              <li><strong>The right to restrict processing</strong> - You have the right to request that we restrict the processing of your Personal Data, under certain conditions.</li>
              <li><strong>The right to object to processing</strong> - You have the right to object to our processing of your Personal Data, under certain conditions.</li>
              <li><strong>The right to data portability</strong> - You have the right to request that we transfer the data that we have collected to another organization, or directly to you, under certain conditions.</li>
            </ul>
            
            <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">Children's Privacy</h3>
            <p className="text-gray-700 mb-6">
              Our Service does not address anyone under the age of 13 ("Children"). We do not knowingly 
              collect personally identifiable information from anyone under the age of 13. If you are a 
              parent or guardian and you are aware that your Child has provided us with Personal Data, 
              please contact us. If we become aware that we have collected Personal Data from children 
              without verification of parental consent, we take steps to remove that information from our servers.
            </p>
            
            <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">Changes to This Privacy Policy</h3>
            <p className="text-gray-700 mb-6">
              We may update our Privacy Policy from time to time. We will notify you of any changes by 
              posting the new Privacy Policy on this page. You are advised to review this Privacy Policy 
              periodically for any changes. Changes to this Privacy Policy are effective when they are 
              posted on this page.
            </p>
            
            <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">Contact Us</h3>
            <p className="text-gray-700">
              If you have any questions about this Privacy Policy, please contact us:
            </p>
            <ul className="list-disc pl-6 mt-4 text-gray-700">
              <li>By email: privacy@teamupindia.com</li>
              <li>By visiting this page on our website: teamupindia.com/contact</li>
              <li>By phone number: +91 98765 43210</li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Have Questions About Your Privacy?</h2>
          <p className="text-lg text-gray-700 mb-8">
            Our team is here to help you understand how we protect your data and respect your privacy.
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
    </div>
  );
};

export default PrivacyPage;