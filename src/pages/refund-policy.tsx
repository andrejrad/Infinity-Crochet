import Head from 'next/head';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function RefundPolicy() {
  return (
    <>
      <Head>
        <title>Refund & Cancelation Policy - Infinity Crochet</title>
        <meta name="description" content="Refund and Cancelation Policy for Infinity Crochet" />
      </Head>

      <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <Navbar />

        <main className="flex-1 py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold text-purple-dark mb-8">Refund & Cancelation Policy</h1>
            
            <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6 text-gray-700">
              <p className="text-sm text-gray-500">
                <strong>Last Updated:</strong> March 31, 2026
              </p>

              <section>
                <h2 className="text-2xl font-semibold text-purple-dark mb-4">Overview</h2>
                <p>
                  This policy outlines the refund and cancelation procedures for Infinity Crochet. Please read carefully before placing an order.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-purple-dark mb-4">Order Cancelation</h2>
                
                <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
                  <h3 className="text-lg font-semibold text-green-800 mb-2">✓ Cancelation Window</h3>
                  <p className="text-green-700">
                    Orders can be canceled for a <strong>full refund within 1 hour</strong> of placing the order.
                  </p>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-2">How to Cancel</h3>
                <p className="mb-4">To cancel an order:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Contact Infinity Crochet immediately at <a href="mailto:infinitycrochet1@gmail.com" className="text-purple-600 hover:underline">infinitycrochet1@gmail.com</a></li>
                  <li>Include the order number in the subject line</li>
                  <li>Cancelation requests will be processed within 24 hours</li>
                </ul>

                <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mt-4">
                  <h3 className="text-lg font-semibold text-amber-800 mb-2">⚠️ After 1 Hour</h3>
                  <p className="text-amber-700">
                    Once an order is older than 1 hour, it cannot be canceled. Please refer to the return policy below.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-purple-dark mb-4">Returns</h2>
                
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">📦 Return Window</h3>
                  <p className="text-blue-700">
                    Returns are accepted <strong>within 7 days of delivery</strong> for a refund excluding shipping costs.
                  </p>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-2">Return Process</h3>
                <ol className="list-decimal pl-6 space-y-2 mb-4">
                  <li>Contact Infinity Crochet at <a href="mailto:infinitycrochet1@gmail.com" className="text-purple-600 hover:underline">infinitycrochet1@gmail.com</a> within 7 days of delivery</li>
                  <li>Include order number and reason for return</li>
                  <li>Ship the product back to Infinity Crochet (customer is responsible for return shipping costs)</li>
                  <li>Refund will be issued upon receipt and inspection of the returned item</li>
                </ol>

                <h3 className="text-xl font-semibold text-gray-900 mb-2">Return Requirements</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Item must be in original condition</li>
                  <li>Item must be unused and with all tags attached</li>
                  <li>Original packaging should be included when possible</li>
                  <li>Customer is responsible for return shipping costs</li>
                  <li>Customer is responsible for the item until Infinity Crochet receives it</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-purple-dark mb-4">Refund Eligibility</h2>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Full Refunds Available For:</h3>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                  <li><strong>Order Cancelation:</strong> Within 1 hour of placing order (includes all costs)</li>
                  <li><strong>Returns:</strong> Within 7 days of delivery (excludes original shipping costs)</li>
                  <li><strong>Defective Items:</strong> Products with manufacturing defects</li>
                  <li><strong>Incorrect Items:</strong> Wrong product received</li>
                  <li><strong>Damaged During Shipping:</strong> Items damaged in transit (with photo evidence)</li>
                  <li><strong>Non-Delivery:</strong> Order never received (after carrier investigation)</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mb-2">Refunds NOT Available For:</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Custom Orders:</strong> Custom-made items are not eligible for refund or return</li>
                  <li>Orders older than 1 hour (must use return process instead)</li>
                  <li>Returns requested after 7 days of delivery</li>
                  <li>Minor color variations due to handmade nature or screen settings</li>
                  <li>Small size variations inherent to handmade items</li>
                  <li>Items damaged due to improper care or use</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-purple-dark mb-4">Refund Processing</h2>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Cancelations (Within 1 Hour):</h3>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                  <li>Full purchase price of the item(s)</li>
                  <li>Original shipping costs</li>
                  <li>Taxes paid</li>
                  <li>Insurance costs (if purchased)</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mb-2">Returns (Within 7 Days):</h3>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                  <li>Purchase price of the item(s)</li>
                  <li>Taxes paid on items</li>
                  <li><strong>Excludes:</strong> Original shipping costs and return shipping costs</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mb-2">Refund Timeline:</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Cancelations:</strong> Processed immediately, funds returned within 5-10 business days</li>
                  <li><strong>Returns:</strong> Processed within 2 business days of receiving and inspecting returned item</li>
                  <li><strong>Bank Processing:</strong> Additional 5-10 business days for funds to appear in account</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mb-2 mt-4">Refund Method:</h3>
                <p>
                  All refunds are issued to the original payment method used for the purchase. Refunds cannot be issued 
                  to different payment methods or as store credit unless mutually agreed upon.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-purple-dark mb-4">Custom Orders</h2>
                
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                  <h3 className="text-lg font-semibold text-red-800 mb-2">⚠️ No Refunds on Custom Orders</h3>
                  <p className="text-red-700">
                    Custom-made items are <strong>not eligible for refund or return</strong> under any circumstances. 
                    This includes items made to specific measurements, colors, or design specifications requested by the customer.
                  </p>
                </div>
                
                <p>
                  Please review custom order details carefully before placing the order. Infinity Crochet invests 
                  significant time and materials into creating custom pieces specifically for each customer.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-purple-dark mb-4">Damaged During Shipping</h2>
                
                <div className="bg-purple-50 border-l-4 border-purple-500 p-4 mb-4">
                  <h3 className="text-lg font-semibold text-purple-800 mb-2">📸 Important: Document Damage</h3>
                  <p className="text-purple-700">
                    If an item arrives damaged, take photos immediately and contact Infinity Crochet within 48 hours.
                  </p>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-2">Steps for Damaged Items:</h3>
                <ol className="list-decimal pl-6 space-y-2">
                  <li>Take photos of the damaged item and packaging immediately</li>
                  <li>Contact Infinity Crochet at <a href="mailto:infinitycrochet1@gmail.com" className="text-purple-600 hover:underline">infinitycrochet1@gmail.com</a> within 48 hours of delivery</li>
                  <li>Do not discard the packaging</li>
                  <li>A claim will be filed with the carrier and a full refund or replacement will be issued</li>
                </ol>
                <p className="mt-4 text-sm text-gray-600">
                  Note: If shipping insurance was purchased through checkout, claims are processed faster.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-purple-dark mb-4">Questions or Concerns</h2>
                <p className="mb-4">
                  For questions about the Refund & Cancelation Policy or assistance with an order, contact Infinity Crochet:
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
