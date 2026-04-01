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
                  At Infinity Crochet, we want you to be completely satisfied with your purchase. This policy outlines our 
                  refund and cancelation procedures. Please read carefully before placing your order.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-purple-dark mb-4">Order Cancelation</h2>
                
                <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
                  <h3 className="text-lg font-semibold text-green-800 mb-2">✓ Cancelation Window</h3>
                  <p className="text-green-700">
                    You can cancel your order and receive a <strong>full refund</strong> at any time 
                    <strong> before the item has been shipped</strong>.
                  </p>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-2">How to Cancel</h3>
                <p className="mb-4">To cancel your order:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Contact us immediately at <a href="mailto:infinitycrochet1@gmail.com" className="text-purple-600 hover:underline">infinitycrochet1@gmail.com</a></li>
                  <li>Include your order number in the subject line</li>
                  <li>We will process your cancelation request within 24 hours</li>
                </ul>

                <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mt-4">
                  <h3 className="text-lg font-semibold text-amber-800 mb-2">⚠️ After Shipping</h3>
                  <p className="text-amber-700">
                    Once an order has been shipped, it cannot be canceled. Please refer to our return policy below.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-purple-dark mb-4">Refund Eligibility</h2>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Full Refunds Available For:</h3>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                  <li><strong>Order Cancelation:</strong> Items canceled before shipping</li>
                  <li><strong>Defective Items:</strong> Products with manufacturing defects</li>
                  <li><strong>Incorrect Items:</strong> Wrong product received</li>
                  <li><strong>Damaged During Shipping:</strong> Items damaged in transit (with photo evidence)</li>
                  <li><strong>Non-Delivery:</strong> Order never received (after carrier investigation)</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mb-2">Refunds NOT Available For:</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Change of mind after item has shipped</li>
                  <li>Minor color variations due to handmade nature or screen settings</li>
                  <li>Small size variations inherent to handmade items</li>
                  <li>Custom orders (unless defective)</li>
                  <li>Items damaged due to improper care or use</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-purple-dark mb-4">Return Process</h2>
                <p className="mb-4">
                  If you received a defective or incorrect item, please contact us within <strong>7 days</strong> of delivery:
                </p>
                <ol className="list-decimal pl-6 space-y-2">
                  <li>Email us at <a href="mailto:infinitycrochet1@gmail.com" className="text-purple-600 hover:underline">infinitycrochet1@gmail.com</a></li>
                  <li>Include your order number and clear photos of the issue</li>
                  <li>Describe the problem in detail</li>
                  <li>Wait for our return authorization before shipping items back</li>
                </ol>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-purple-dark mb-4">Refund Processing</h2>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-2">What's Included in Refunds:</h3>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                  <li>Full purchase price of the item(s)</li>
                  <li>Original shipping costs</li>
                  <li>Taxes paid</li>
                  <li>Insurance costs (if purchased)</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mb-2">Refund Timeline:</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Cancelations:</strong> Processed immediately, funds returned within 5-10 business days</li>
                  <li><strong>Returns:</strong> Processed within 2 business days of receiving returned item</li>
                  <li><strong>Bank Processing:</strong> Additional 5-10 business days for funds to appear in your account</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mb-2 mt-4">Refund Method:</h3>
                <p>
                  All refunds are issued to the original payment method used for the purchase. We cannot issue refunds 
                  to different payment methods or as store credit unless mutually agreed upon.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-purple-dark mb-4">Return Shipping</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Defective/Incorrect Items:</strong> We provide a prepaid return shipping label</li>
                  <li><strong>Change of Mind (if accepted):</strong> Customer responsible for return shipping costs</li>
                  <li>Items must be returned in original condition with tags attached</li>
                  <li>Customer is responsible for item until we receive it</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-purple-dark mb-4">Exchanges</h2>
                <p>
                  We do not offer direct exchanges. If you need a different size, color, or product:
                </p>
                <ol className="list-decimal pl-6 space-y-2 mt-2">
                  <li>Cancel your original order (before shipping) or request a return</li>
                  <li>Receive your refund</li>
                  <li>Place a new order for the desired item</li>
                </ol>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-purple-dark mb-4">Custom Orders</h2>
                <p>
                  Custom-made items cannot be canceled once production has begun. However, if a custom item arrives 
                  defective or does not match the agreed-upon specifications, we will offer a full refund or remake 
                  the item at no additional cost.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-purple-dark mb-4">Damaged During Shipping</h2>
                <p className="mb-4">
                  If your item arrives damaged:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Take photos of the damaged item and packaging immediately</li>
                  <li>Contact us within 48 hours of delivery</li>
                  <li>Do not discard the packaging</li>
                  <li>We will file a claim with the carrier and issue a full refund or replacement</li>
                </ul>
                <p className="mt-4 text-sm italic">
                  Note: If you purchased shipping insurance through our checkout, claims are processed faster.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-purple-dark mb-4">Questions or Concerns</h2>
                <p>
                  If you have any questions about our Refund & Cancelation Policy or need assistance with an order, 
                  please don't hesitate to contact us:
                </p>
                <p className="mt-2">
                  <strong>Email:</strong> <a href="mailto:infinitycrochet1@gmail.com" className="text-purple-600 hover:underline">infinitycrochet1@gmail.com</a>
                </p>
                <p className="mt-4 text-sm text-gray-600">
                  We're here to ensure you have a positive experience with Infinity Crochet!
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
