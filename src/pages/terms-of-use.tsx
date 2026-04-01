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
                  By accessing and using infinity-crochet.com ("Website"), visitors accept and agree to be bound by these Terms of Use. 
                  If these terms are not acceptable, please do not use the Website or purchase products.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-purple-dark mb-4">Use of Website</h2>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Permitted Use</h3>
                <p className="mb-4">The Website may be used to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Browse and purchase handmade crochet products</li>
                  <li>Create and manage accounts</li>
                  <li>Access information about products and services</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mb-2 mt-4">Prohibited Use</h3>
                <p className="mb-4">Users may NOT:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Use the Website for any illegal purpose</li>
                  <li>Attempt to gain unauthorized access to systems</li>
                  <li>Copy, reproduce, or distribute content without permission</li>
                  <li>Use automated systems to access the Website</li>
                  <li>Interfere with the proper functioning of the Website</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-purple-dark mb-4">Product Information</h2>
                <p className="mb-4">
                  All products sold on the Website are handmade crochet items. While accuracy is maintained in product descriptions 
                  and images:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Colors may vary slightly due to monitor settings and handmade nature</li>
                  <li>Small variations in size and appearance are natural characteristics of handmade items</li>
                  <li>Product descriptions and availability are subject to modification</li>
                  <li>Prices are subject to change without notice</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-purple-dark mb-4">Orders and Payments</h2>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Order Acceptance</h3>
                <p className="mb-4">
                  All orders are subject to acceptance and availability. Infinity Crochet reserves the right to refuse or cancel any order for any reason, 
                  including but not limited to product availability, errors in pricing, or suspected fraud.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-2">Payment</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>All payments are processed securely through Stripe</li>
                  <li>Prices are in USD unless stated otherwise</li>
                  <li>Accurate payment information must be provided</li>
                  <li>Payment is due at the time of order placement</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-purple-dark mb-4">Shipping and Delivery</h2>
                <p>
                  Shipping is available to addresses in the United States, Canada, United Kingdom, Australia, and the European Union. 
                  Shipping times vary based on location and carrier. See the Shipment Policy for detailed information.
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
                <p className="mb-4">Account holders are responsible for:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Maintaining the confidentiality of passwords</li>
                  <li>All activities under their account</li>
                  <li>Providing accurate and current information</li>
                  <li>Accounts that violate these terms may be suspended or terminated</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-purple-dark mb-4">Disclaimers</h2>
                <p className="mb-4">
                  <strong>AS-IS BASIS:</strong> The Website and products are provided "as is" without warranties of any kind, 
                  either express or implied.
                </p>
                <p>
                  <strong>HANDMADE NATURE:</strong> Due to the handmade nature of products, slight variations are expected 
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
                  Users agree to indemnify and hold Infinity Crochet harmless from any claims, damages, losses, liabilities, 
                  and expenses arising from use of the Website or violation of these Terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-purple-dark mb-4">Changes to Terms</h2>
                <p>
                  Infinity Crochet reserves the right to modify these Terms of Use at any time. Changes will be effective immediately upon 
                  posting to the Website. Continued use of the Website constitutes acceptance of the modified terms.
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
                <p className="mb-4">
                  For questions about these Terms of Use, contact Infinity Crochet at:
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
