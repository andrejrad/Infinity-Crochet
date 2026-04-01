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
                  At Infinity Crochet, we're committed to getting your handmade items to you safely and efficiently. 
                  This policy outlines our shipping procedures, timelines, and what you can expect when ordering from us.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-purple-dark mb-4">Shipping Locations</h2>
                <p className="mb-4">We currently ship to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>United States (all 50 states)</li>
                  <li>Canada</li>
                  <li>United Kingdom</li>
                  <li>Australia</li>
                  <li>European Union (all 27 member states)</li>
                </ul>
                <p className="mt-4">
                  Don't see your country? Contact us at <a href="mailto:infinitycrochet1@gmail.com" className="text-purple-600 hover:underline">infinitycrochet1@gmail.com</a> 
                  - we may be able to arrange international shipping.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-purple-dark mb-4">Processing Time</h2>
                <p className="mb-4">
                  <strong>Handmade Processing:</strong> All our items are handcrafted to order. Processing times vary by product:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>In-Stock Items:</strong> 1-3 business days</li>
                  <li><strong>Made-to-Order Items:</strong> 5-10 business days</li>
                  <li><strong>Custom Orders:</strong> 2-4 weeks (communicated at time of order)</li>
                </ul>
                <p className="mt-4 text-sm italic">
                  Note: Processing time does not include shipping time. Orders are processed Monday-Friday, excluding holidays.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-purple-dark mb-4">Shipping Methods & Rates</h2>
                <p className="mb-4">
                  Shipping costs are calculated automatically at checkout based on your location, package weight, 
                  and selected shipping method. We use Shippo to provide real-time carrier rates.
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
                <p className="mt-4 text-sm italic">
                  International shipping times are estimates and may vary due to customs processing.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-purple-dark mb-4">Shipping Insurance</h2>
                <p className="mb-4">
                  We offer optional shipping insurance for <strong>$2.50</strong> per order. Insurance covers:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Lost packages</li>
                  <li>Stolen packages</li>
                  <li>Damaged items during transit</li>
                  <li>Coverage up to the full order value</li>
                </ul>
                <div className="bg-purple-50 border-l-4 border-purple-500 p-4 mt-4">
                  <p className="text-purple-800">
                    <strong>We highly recommend</strong> purchasing shipping insurance for peace of mind. 
                    Without insurance, we cannot guarantee protection for lost or stolen packages.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-purple-dark mb-4">Order Tracking</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>You'll receive a shipping confirmation email with tracking number when your order ships</li>
                  <li>Track your package directly through the carrier's website</li>
                  <li>Check your order status anytime in your account dashboard</li>
                  <li>Email updates sent automatically when package is out for delivery</li>
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
                  All international shipments include accurate customs declarations. We mark packages as "merchandise" 
                  and declare the full purchase price.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-purple-dark mb-4">Delivery Issues</h2>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Lost Packages</h3>
                <p className="mb-4">If tracking shows your package as delivered but you haven't received it:</p>
                <ol className="list-decimal pl-6 space-y-2 mb-4">
                  <li>Check around your delivery location (porch, mailbox, neighbors)</li>
                  <li>Wait 24 hours (sometimes marked delivered before actual delivery)</li>
                  <li>Contact the carrier with your tracking number</li>
                  <li>Email us if still not resolved after 48 hours</li>
                </ol>

                <h3 className="text-xl font-semibold text-gray-900 mb-2">Damaged Packages</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Take photos of damaged packaging and items immediately</li>
                  <li>Contact us within 48 hours of delivery</li>
                  <li>We'll file a claim and send replacement or refund</li>
                  <li>Insured packages are processed faster</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mb-2 mt-4">Delayed Shipments</h3>
                <p>
                  If your package has not arrived within the expected delivery window, please contact us. 
                  We'll work with the carrier to locate your package and resolve the issue.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-purple-dark mb-4">Address Accuracy</h2>
                <div className="bg-red-50 border-l-4 border-red-500 p-4">
                  <p className="text-red-700">
                    <strong>Please ensure your shipping address is accurate!</strong> We are not responsible for 
                    packages shipped to incorrect addresses provided at checkout. Address changes cannot be made 
                    once an order has shipped.
                  </p>
                </div>
                <p className="mt-4">
                  If you need to change your address, contact us immediately before your order ships.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-purple-dark mb-4">Package Contents</h2>
                <p className="mb-4">All packages include:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Your handmade crochet item(s)</li>
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
                  <li>Place orders early to ensure delivery by specific dates</li>
                  <li>We'll post updates on our homepage during busy periods</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-purple-dark mb-4">Contact Us</h2>
                <p>
                  Have questions about shipping or need to track your order? We're here to help!
                </p>
                <p className="mt-2">
                  <strong>Email:</strong> <a href="mailto:infinitycrochet1@gmail.com" className="text-purple-600 hover:underline">infinitycrochet1@gmail.com</a>
                </p>
                <p className="mt-2">
                  Please include your order number in all shipping inquiries for faster assistance.
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
