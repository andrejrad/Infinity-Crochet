import Head from 'next/head';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function ShipmentPolicy() {
  return (
    <>
      <Head>
        <title>Shipment Policy - Infinity Crochet</title>
        <meta name="description" content="Shipment Policy for Infinity Crochet" />
      </Head>

      <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <Navbar />

        <main className="flex-1 py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold text-purple-dark mb-8">Shipment Policy</h1>
            
            <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6 text-gray-700">
              <p className="text-sm text-gray-500">
                <strong>Last Updated:</strong> March 31, 2026
              </p>

              <section>
                <h2 className="text-2xl font-semibold text-purple-dark mb-4">Overview</h2>
                <p>
                  Infinity Crochet is committed to getting handmade items to customers safely and efficiently. 
                  This policy outlines shipping procedures, timelines, and what to expect when ordering.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-purple-dark mb-4">Shipping Locations</h2>
                <p className="mb-4">Currently shipping to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>United States (all 50 states)</li>
                  <li>Canada</li>
                  <li>United Kingdom</li>
                  <li>Australia</li>
                  <li>European Union (all 27 member states)</li>
                </ul>
                <p className="mt-4">
                  Don't see your country? Contact Infinity Crochet at <a href="mailto:infinitycrochet1@gmail.com" className="text-purple-600 hover:underline">infinitycrochet1@gmail.com</a> 
                  - international shipping may be arranged.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-purple-dark mb-4">Processing Time</h2>
                <p className="mb-4">
                  <strong>Handmade Processing:</strong> All items are handcrafted to order. Processing times vary by product:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>In-Stock Items:</strong> 1-3 business days</li>
                  <li><strong>Made-to-Order Items:</strong> 5-10 business days</li>
                  <li><strong>Custom Orders:</strong> 2-4 weeks (communicated at time of order)</li>
                </ul>
                <p className="mt-4 text-sm text-gray-600">
                  Note: Processing time does not include shipping time. Orders are processed Monday-Friday, excluding holidays.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-purple-dark mb-4">Shipping Methods & Rates</h2>
                <p className="mb-4">
                  Shipping costs are calculated automatically at checkout based on location, package weight, 
                  and selected shipping method. Shippo is used to provide real-time carrier rates.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-2">Domestic Shipping (US)</h3>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                  <li><strong>USPS First Class:</strong> 3-5 business days</li>
                  <li><strong>USPS Priority Mail:</strong> 2-3 business days</li>
                  <li><strong>USPS Priority Mail Express:</strong> 1-2 business days</li>
                  <li><strong>UPS Ground:</strong> 1-5 business days (depending on distance)</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mb-2">International Shipping</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Canada:</strong> 6-10 business days</li>
                  <li><strong>UK & EU:</strong> 7-14 business days</li>
                  <li><strong>Australia:</strong> 10-20 business days</li>
                </ul>
                <p className="mt-4 text-sm text-gray-600">
                  International shipping times are estimates and may vary due to customs processing.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-purple-dark mb-4">Shipping Insurance</h2>
                <p className="mb-4">
                  Optional shipping insurance is available for <strong>$2.50</strong> per order. Insurance covers:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Lost packages</li>
                  <li>Stolen packages</li>
                  <li>Damaged items during transit</li>
                  <li>Coverage up to the full order value</li>
                </ul>
                <div className="bg-purple-50 border-l-4 border-purple-500 p-4 mt-4">
                  <p className="text-purple-800">
                    <strong>Highly recommended:</strong> Purchase shipping insurance for peace of mind. 
                    Without insurance, protection for lost or stolen packages cannot be guaranteed.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-purple-dark mb-4">Order Tracking</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>A shipping confirmation email with tracking number is sent when orders ship</li>
                  <li>Packages can be tracked directly through the carrier's website</li>
                  <li>Order status can be checked anytime in the account dashboard</li>
                  <li>Email updates are sent automatically when package is out for delivery</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-purple-dark mb-4">International Orders</h2>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Customs & Duties</h3>
                <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-4">
                  <p className="text-amber-700">
                    <strong>Important:</strong> International customers are responsible for any customs fees, duties, 
                    or taxes imposed by their country. These charges are NOT included in our shipping costs.
                  </p>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-2">Customs Declaration</h3>
                <p>
                  All international shipments include accurate customs declarations. Packages are marked as "merchandise" 
                  and the full purchase price is declared.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-purple-dark mb-4">Delivery Issues</h2>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Lost Packages</h3>
                <p className="mb-4">If tracking shows a package as delivered but it hasn't been received:</p>
                <ol className="list-decimal pl-6 space-y-2 mb-4">
                  <li>Check around the delivery location (porch, mailbox, neighbors)</li>
                  <li>Wait 24 hours (sometimes marked delivered before actual delivery)</li>
                  <li>Contact the carrier with the tracking number</li>
                  <li>Email Infinity Crochet if still not resolved after 48 hours</li>
                </ol>

                <h3 className="text-xl font-semibold text-gray-900 mb-2">Damaged Packages</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Take photos of damaged packaging and items immediately</li>
                  <li>Contact Infinity Crochet within 48 hours of delivery</li>
                  <li>A claim will be filed and a replacement or refund will be sent</li>
                  <li>Insured packages are processed faster</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mb-2 mt-4">Delayed Shipments</h3>
                <p>
                  If a package has not arrived within the expected delivery window, please contact Infinity Crochet. 
                  Assistance will be provided to work with the carrier to locate the package and resolve the issue.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-purple-dark mb-4">Address Accuracy</h2>
                <div className="bg-red-50 border-l-4 border-red-500 p-4">
                  <p className="text-red-700">
                    <strong>Please ensure the shipping address is accurate!</strong> Infinity Crochet is not responsible for 
                    packages shipped to incorrect addresses provided at checkout. Address changes cannot be made 
                    once an order has shipped.
                  </p>
                </div>
                <p className="mt-4">
                  If an address needs to be changed, contact Infinity Crochet immediately before the order ships.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-purple-dark mb-4">Package Contents</h2>
                <p className="mb-4">All packages include:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Handmade crochet item(s)</li>
                  <li>Care instructions</li>
                  <li>Thank you note</li>
                  <li>Business card (for future orders)</li>
                  <li>Protective packaging to ensure safe delivery</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-purple-dark mb-4">Holidays & Peak Seasons</h2>
                <p className="mb-4">
                  During holiday seasons and sales events:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Processing times may be extended by 2-3 business days</li>
                  <li>Carrier deliveries may experience delays</li>
                  <li>Orders should be placed early to ensure delivery by specific dates</li>
                  <li>Updates will be posted on the homepage during busy periods</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-purple-dark mb-4">Contact Information</h2>
                <p className="mb-4">
                  For questions about shipping or order tracking:
                </p>
                <p>
                  <strong>Email:</strong> <a href="mailto:infinitycrochet1@gmail.com" className="text-purple-600 hover:underline">infinitycrochet1@gmail.com</a>
                </p>
                <p className="mt-2 text-sm text-gray-600">
                  Please include order number in all shipping inquiries for faster assistance.
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
