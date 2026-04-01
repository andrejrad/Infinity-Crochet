import Head from 'next/head';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function PrivacyPolicy() {
  return (
    <>
      <Head>
        <title>Privacy Policy - Infinity Crochet</title>
        <meta name="description" content="Privacy Policy for Infinity Crochet" />
      </Head>

      <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <Navbar />

        <main className="flex-1 py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold text-purple-dark mb-8">Privacy Policy</h1>
            
            <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6 text-gray-700">
              <p className="text-sm text-gray-500">
                <strong>Last Updated:</strong> March 31, 2026
              </p>

              <section>
                <h2 className="text-2xl font-semibold text-purple-dark mb-4">Introduction</h2>
                <p>
                  At Infinity Crochet, we are committed to protecting your privacy and ensuring the security of your personal information. 
                  This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website 
                  infinity-crochet.com and make purchases from our online store.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-purple-dark mb-4">Information We Collect</h2>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Personal Information</h3>
                <p className="mb-4">When you place an order or create an account, we collect:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Name and contact information (email address, phone number)</li>
                  <li>Shipping and billing addresses</li>
                  <li>Payment information (processed securely through Stripe)</li>
                  <li>Order history and preferences</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mb-2 mt-4">Automatically Collected Information</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Browser type and version</li>
                  <li>Device information</li>
                  <li>IP address</li>
                  <li>Pages visited and time spent on our site</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-purple-dark mb-4">How We Use Your Information</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Process and fulfill your orders</li>
                  <li>Send order confirmations and shipping updates</li>
                  <li>Respond to customer service requests</li>
                  <li>Improve our website and products</li>
                  <li>Send promotional emails (with your consent)</li>
                  <li>Prevent fraudulent transactions</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-purple-dark mb-4">Information Sharing</h2>
                <p className="mb-4">We do not sell or rent your personal information. We may share your information with:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Service Providers:</strong> Stripe (payment processing), Shippo (shipping), Firebase (data storage)</li>
                  <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                  <li><strong>Business Transfers:</strong> In the event of a merger or acquisition</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-purple-dark mb-4">Data Security</h2>
                <p>
                  We implement industry-standard security measures to protect your personal information. All payment transactions 
                  are processed through Stripe's secure payment gateway. However, no method of transmission over the internet is 100% secure.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-purple-dark mb-4">Your Rights</h2>
                <p className="mb-4">You have the right to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Access your personal information</li>
                  <li>Correct inaccurate information</li>
                  <li>Request deletion of your information</li>
                  <li>Opt-out of marketing communications</li>
                  <li>Request a copy of your data</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-purple-dark mb-4">Cookies</h2>
                <p>
                  We use cookies to enhance your browsing experience, remember your preferences, and analyze website traffic. 
                  You can control cookie settings through your browser preferences.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-purple-dark mb-4">Children's Privacy</h2>
                <p>
                  Our website is not intended for children under 13 years of age. We do not knowingly collect personal information 
                  from children under 13.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-purple-dark mb-4">Changes to This Policy</h2>
                <p>
                  We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated 
                  revision date.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-purple-dark mb-4">Contact Us</h2>
                <p>
                  If you have questions about this Privacy Policy or would like to exercise your rights, please contact us at:
                </p>
                <p className="mt-2">
                  <strong>Email:</strong> <a href="mailto:infinitycrochet1@gmail.com" className="text-purple-600 hover:underline">infinitycrochet1@gmail.com</a>
                </p>
              </section>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
