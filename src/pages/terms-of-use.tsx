import Head from 'next/head';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function TermsOfUse() {
  return (
    <>
      <Head>
        <title>Terms of Use - Infinity Crochet</title>
        <meta name="description" content="Terms of Use for Infinity Crochet" />
      </Head>

      <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <Navbar />

        <main className="flex-1 py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold text-purple-dark mb-8">Terms of Use</h1>
            
            <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6 text-gray-700">
              <p className="text-sm text-gray-500">
                <strong>Last Updated:</strong> March 31, 2026
              </p>

              <section>
                <h2 className="text-2xl font-semibold text-purple-dark mb-4">Acceptance of Terms</h2>
                <p>
                  By accessing and using infinity-crochet.com ("Website"), you accept and agree to be bound by these Terms of Use. 
                  If you do not agree to these terms, please do not use our Website or purchase our products.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-purple-dark mb-4">Use of Website</h2>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Permitted Use</h3>
                <p className="mb-4">You may use our Website to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Browse and purchase handmade crochet products</li>
                  <li>Create and manage your account</li>
                  <li>Access information about our products and services</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mb-2 mt-4">Prohibited Use</h3>
                <p className="mb-4">You may NOT:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Use the Website for any illegal purpose</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Copy, reproduce, or distribute our content without permission</li>
                  <li>Use automated systems to access the Website</li>
                  <li>Interfere with the proper functioning of our Website</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-purple-dark mb-4">Product Information</h2>
                <p className="mb-4">
                  All products sold on our Website are handmade crochet items. While we strive for accuracy in product descriptions 
                  and images:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Colors may vary slightly due to monitor settings and handmade nature</li>
                  <li>Small variations in size and appearance are natural characteristics of handmade items</li>
                  <li>We reserve the right to modify product descriptions and availability</li>
                  <li>Prices are subject to change without notice</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-purple-dark mb-4">Orders and Payments</h2>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Order Acceptance</h3>
                <p className="mb-4">
                  All orders are subject to acceptance and availability. We reserve the right to refuse or cancel any order for any reason, 
                  including but not limited to product availability, errors in pricing, or suspected fraud.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-2">Payment</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>All payments are processed securely through Stripe</li>
                  <li>Prices are in USD unless stated otherwise</li>
                  <li>You must provide accurate payment information</li>
                  <li>Payment is due at the time of order placement</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-purple-dark mb-4">Shipping and Delivery</h2>
                <p className="mb-4">
                  We ship to addresses in the United States, Canada, United Kingdom, Australia, and the European Union. 
                  Shipping times vary based on location and carrier. See our Shipment Policy for detailed information.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-purple-dark mb-4">Intellectual Property</h2>
                <p className="mb-4">
                  All content on this Website, including but not limited to text, images, graphics, logos, and designs, 
                  is the property of Infinity Crochet and is protected by copyright and trademark laws.
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>You may not use our content without written permission</li>
                  <li>Product images and designs are protected intellectual property</li>
                  <li>The Infinity Crochet name and logo are trademarks</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-purple-dark mb-4">User Accounts</h2>
                <p className="mb-4">If you create an account:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>You are responsible for maintaining the confidentiality of your password</li>
                  <li>You are responsible for all activities under your account</li>
                  <li>You must provide accurate and current information</li>
                  <li>We may suspend or terminate accounts that violate these terms</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-purple-dark mb-4">Disclaimers</h2>
                <p className="mb-4">
                  <strong>AS-IS BASIS:</strong> Our Website and products are provided "as is" without warranties of any kind, 
                  either express or implied.
                </p>
                <p>
                  <strong>HANDMADE NATURE:</strong> Due to the handmade nature of our products, slight variations are expected 
                  and are not considered defects.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-purple-dark mb-4">Limitation of Liability</h2>
                <p>
                  To the fullest extent permitted by law, Infinity Crochet shall not be liable for any indirect, incidental, 
                  special, consequential, or punitive damages resulting from your use of our Website or products.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-purple-dark mb-4">Indemnification</h2>
                <p>
                  You agree to indemnify and hold Infinity Crochet harmless from any claims, damages, losses, liabilities, 
                  and expenses arising from your use of our Website or violation of these Terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-purple-dark mb-4">Changes to Terms</h2>
                <p>
                  We reserve the right to modify these Terms of Use at any time. Changes will be effective immediately upon 
                  posting to the Website. Your continued use of the Website constitutes acceptance of the modified terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-purple-dark mb-4">Governing Law</h2>
                <p>
                  These Terms shall be governed by and construed in accordance with the laws of the United States, 
                  without regard to its conflict of law provisions.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-purple-dark mb-4">Contact Information</h2>
                <p>
                  For questions about these Terms of Use, please contact us at:
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
