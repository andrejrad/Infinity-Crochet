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
                  Infinity Crochet is committed to protecting customer privacy and ensuring the security of personal information. 
                  This Privacy Policy explains how information is collected, used, disclosed, and safeguarded when customers visit 
                  infinity-crochet.com and make purchases from the online store.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-purple-dark mb-4">Information We Collect</h2>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Personal Information</h3>
                <p className="mb-4">When placing an order or creating an account, the following information is collected:</p>
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
                  <li>Pages visited and time spent on the site</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-purple-dark mb-4">How Information Is Used</h2>
                <p className="mb-4">Customer information is used to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Process and fulfill orders</li>
                  <li>Send order confirmations and shipping updates</li>
                  <li>Respond to customer service requests</li>
                  <li>Improve the website and products</li>
                  <li>Send promotional emails (with consent)</li>
                  <li>Prevent fraudulent transactions</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-purple-dark mb-4">Information Sharing</h2>
                <p className="mb-4">Personal information is not sold or rented. Information may be shared with:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Service Providers:</strong> Stripe (payment processing), Shippo (shipping), Firebase (data storage)</li>
                  <li><strong>Legal Requirements:</strong> When required by law or to protect legal rights</li>
                  <li><strong>Business Transfers:</strong> In the event of a merger or acquisition</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-purple-dark mb-4">Data Security</h2>
                <p>
                  Industry-standard security measures are implemented to protect personal information. All payment transactions 
                  are processed through Stripe's secure payment gateway. However, no method of transmission over the internet is 100% secure.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-purple-dark mb-4">Customer Rights</h2>
                <p className="mb-4">Customers have the right to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Access personal information</li>
                  <li>Correct inaccurate information</li>
                  <li>Request deletion of information</li>
                  <li>Opt-out of marketing communications</li>
                  <li>Request a copy of data</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-purple-dark mb-4">Cookies</h2>
                <p>
                  Cookies are used to enhance the browsing experience, remember preferences, and analyze website traffic. 
                  Cookie settings can be controlled through browser preferences.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-purple-dark mb-4">Children's Privacy</h2>
                <p>
                  This website is not intended for children under 13 years of age. Personal information 
                  from children under 13 is not knowingly collected.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-purple-dark mb-4">Changes to This Policy</h2>
                <p>
                  This Privacy Policy may be updated from time to time. Any changes will be posted on this page with an updated 
                  revision date.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-purple-dark mb-4">Contact Information</h2>
                <p className="mb-4">
                  For questions about this Privacy Policy or to exercise customer rights, contact Infinity Crochet at:
                </p>
                <p>
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
