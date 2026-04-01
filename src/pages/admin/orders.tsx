import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { collection, query, orderBy, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import ProtectedRoute from '../../components/ProtectedRoute';
import type { Order } from '../../types/user';

export default function AdminOrders() {
  const router = useRouter();
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [creatingLabel, setCreatingLabel] = useState<string | null>(null);
  const [refundingOrderId, setRefundingOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const ordersRef = collection(db, 'orders');
      const q = query(ordersRef, orderBy('createdAt', 'desc'));
      
      const querySnapshot = await getDocs(q);
      const ordersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Order[];
      
      setOrders(ordersData);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setUpdatingOrderId(orderId);
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        status: newStatus,
        updatedAt: new Date().toISOString(),
      });

      // Update local state
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus as any } : order
      ));
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleCreateLabel = async (order: Order) => {
    if (!order.shippingRateId) {
      alert('Shipping rate not found. Please contact support for manual label creation.');
      return;
    }

    setCreatingLabel(order.id!);
    try {
      const response = await fetch('/api/create-shipping-label', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.id,
          rateId: order.shippingRateId, // Use the correct Shippo rate ID
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert(`Label created! Tracking: ${data.trackingNumber}`);
        
        // Update local state
        setOrders(orders.map(o => 
          o.id === order.id 
            ? { ...o, trackingNumber: data.trackingNumber, trackingUrl: data.trackingUrl, shippingLabelUrl: data.labelUrl, carrier: data.carrier }
            : o
        ));

        // Open label in new tab
        if (data.labelUrl) {
          window.open(data.labelUrl, '_blank');
        }
      } else {
        console.error('Label creation failed:', data);
        alert('Failed to create label: ' + (data.error || 'Unknown error. Check console for details.'));
      }
    } catch (error: any) {
      console.error('Error creating label:', error);
      alert('Error creating label: ' + error.message);
    } finally {
      setCreatingLabel(null);
    }
  };

  const handleRefundOrder = async (order: Order) => {
    const confirmRefund = window.confirm(
      `Are you sure you want to refund this order?\n\n` +
      `Order: ${order.orderNumber}\n` +
      `Amount: $${order.total.toFixed(2)}\n\n` +
      `This will process a FULL refund including tax and shipping. This action cannot be undone.`
    );

    if (!confirmRefund) return;

    const reason = window.prompt(
      'Refund reason (optional):',
      'requested_by_customer'
    );

    setRefundingOrderId(order.id!);
    try {
      const response = await fetch('/api/refund-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.id,
          reason: reason || 'requested_by_customer',
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert(`✅ ${data.message}\n\nRefund ID: ${data.refundId}`);
        
        // Update local state
        setOrders(orders.map(o => 
          o.id === order.id 
            ? { 
                ...o, 
                status: 'refunded' as any,
                refundId: data.refundId,
                refundAmount: data.amount,
                refundedAt: new Date().toISOString(),
              }
            : o
        ));
      } else {
        console.error('Refund failed:', data);
        alert('Failed to process refund: ' + (data.error || 'Unknown error'));
      }
    } catch (error: any) {
      console.error('Error processing refund:', error);
      alert('Error processing refund: ' + error.message);
    } finally {
      setRefundingOrderId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.status === filter);

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    revenue: orders.reduce((sum, order) => sum + order.subtotal, 0),
  };

  return (
    <ProtectedRoute requireAdmin>
      <Head>
        <title>Order Management - Infinity Crochet Admin</title>
      </Head>

      {loading ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading orders...</p>
          </div>
        </div>
      ) : (
        <div className="min-h-screen pt-24 pb-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Order Management</h1>
                <p className="text-gray-600">Manage and track all customer orders</p>
              </div>
              <Link
                href="/admin"
                className="text-purple-600 hover:text-purple-700 font-medium"
              >
                ← Back to Dashboard
              </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
              <div className="bg-white rounded-xl shadow p-6">
                <p className="text-sm text-gray-500 mb-1">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="bg-white rounded-xl shadow p-6">
                <p className="text-sm text-gray-500 mb-1">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              </div>
              <div className="bg-white rounded-xl shadow p-6">
                <p className="text-sm text-gray-500 mb-1">Processing</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.processing}</p>
              </div>
              <div className="bg-white rounded-xl shadow p-6">
                <p className="text-sm text-gray-500 mb-1">Shipped</p>
                <p className="text-2xl font-bold text-blue-600">{stats.shipped}</p>
              </div>
              <div className="bg-white rounded-xl shadow p-6">
                <p className="text-sm text-gray-500 mb-1">Delivered</p>
                <p className="text-2xl font-bold text-green-600">{stats.delivered}</p>
              </div>
              <div className="bg-white rounded-xl shadow p-6">
                <p className="text-sm text-gray-500 mb-1">Revenue</p>
                <p className="text-2xl font-bold text-purple-600">${stats.revenue.toFixed(0)}</p>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="bg-white rounded-xl shadow mb-6 p-2 flex flex-wrap gap-2">
              {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    filter === status
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>

            {/* Orders Table */}
            {filteredOrders.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <p className="text-gray-600">No orders found</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Order ID
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Customer
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Items
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tracking
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredOrders.map((order) => (
                        <>
                          <tr 
                            key={order.id} 
                            className="hover:bg-gray-50 cursor-pointer"
                            onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id!)}
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <button
                                  className="text-gray-400 hover:text-gray-600"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setExpandedOrderId(expandedOrderId === order.id ? null : order.id!);
                                  }}
                                >
                                  {expandedOrderId === order.id ? '▼' : '▶'}
                                </button>
                                <span className="font-mono text-sm text-gray-900">
                                  {order.orderNumber || `${order.id?.substring(0, 8)}...`}
                                </span>
                              </div>
                            </td>
                          <td className="px-6 py-4">
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {order.customerName}
                              </p>
                              <p className="text-sm text-gray-500">{order.userEmail}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatDate(order.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {order.products.length} {order.products.length === 1 ? 'item' : 'items'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            ${order.total.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {order.trackingNumber ? (
                              <div>
                                <a 
                                  href={order.trackingUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800 font-mono text-xs"
                                >
                                  {order.trackingNumber}
                                </a>
                                {order.shippingLabelUrl && (
                                  <a
                                    href={order.shippingLabelUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="ml-2 text-purple-600 hover:text-purple-800 text-xs"
                                  >
                                    📄 Label
                                  </a>
                                )}
                              </div>
                            ) : (
                              <span className="text-gray-400 text-xs">No tracking</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="flex flex-col gap-2" onClick={(e) => e.stopPropagation()}>
                              <select
                                value={order.status}
                                onChange={(e) => updateOrderStatus(order.id!, e.target.value)}
                                disabled={updatingOrderId === order.id || order.status === 'refunded'}
                                className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50"
                              >
                                <option value="pending">Pending</option>
                                <option value="processing">Processing</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                                <option value="refunded">Refunded</option>
                              </select>
                              {!order.trackingNumber && order.status !== 'cancelled' && order.status !== 'refunded' && (
                                <button
                                  onClick={() => handleCreateLabel(order)}
                                  disabled={creatingLabel === order.id}
                                  className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 text-xs font-medium disabled:opacity-50"
                                >
                                  {creatingLabel === order.id ? 'Creating...' : '📦 Create Label'}
                                </button>
                              )}
                              {!order.refundId && order.status !== 'refunded' && (
                                <button
                                  onClick={() => handleRefundOrder(order)}
                                  disabled={refundingOrderId === order.id}
                                  className="px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-xs font-medium disabled:opacity-50"
                                >
                                  {refundingOrderId === order.id ? 'Processing...' : '💳 Refund Order'}
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                        
                        {/* Expanded Order Details */}
                        {expandedOrderId === order.id && (
                          <tr>
                            <td colSpan={8} className="px-6 py-6 bg-gray-50">
                              <div className="space-y-6">
                                {/* Order Information */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                  <div>
                                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Customer Information</h4>
                                    <div className="space-y-1 text-sm">
                                      <p><span className="text-gray-500">Name:</span> <span className="font-medium">{order.customerName}</span></p>
                                      <p><span className="text-gray-500">Email:</span> <span className="font-medium">{order.email}</span></p>
                                      <p><span className="text-gray-500">Phone:</span> <span className="font-medium">{order.phone || 'N/A'}</span></p>
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Shipping Address</h4>
                                    <div className="text-sm">
                                      <p>{order.shippingAddress.line1}</p>
                                      {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
                                      <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                                      <p>{order.shippingAddress.country}</p>
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Shipping Details</h4>
                                    <div className="space-y-1 text-sm">
                                      <p><span className="text-gray-500">Carrier:</span> <span className="font-medium">{order.shippingCarrier || 'N/A'}</span></p>
                                      <p><span className="text-gray-500">Service:</span> <span className="font-medium">{order.shippingService || 'N/A'}</span></p>
                                      <p><span className="text-gray-500">Cost:</span> <span className="font-medium">${order.shippingCost?.toFixed(2) || order.shipping.toFixed(2)}</span></p>
                                      {order.insuranceEnabled && (
                                        <p>
                                          <span className="text-gray-500">Insurance:</span>{' '}
                                          <span className="font-medium text-green-600">✓ Insured</span>{' '}
                                          <span className="text-xs text-gray-500">
                                            (${order.insuranceCoverage?.toFixed(2) || '0.00'} coverage, +${order.insuranceCost?.toFixed(2) || '0.00'})
                                          </span>
                                        </p>
                                      )}
                                      {order.trackingNumber && (
                                        <p><span className="text-gray-500">Tracking:</span> <a href={order.trackingUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-mono text-xs">{order.trackingNumber}</a></p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                
                                {/* Customer Notes */}
                                {order.notes && (
                                  <div className="mt-4">
                                    <h4 className="text-sm font-semibold text-gray-700 mb-3">📝 Customer Notes</h4>
                                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{order.notes}</p>
                                    </div>
                                  </div>
                                )}
                                
                                {/* Order Items */}
                                <div>
                                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Order Items</h4>
                                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                    <table className="min-w-full">
                                      <thead className="bg-gray-100">
                                        <tr>
                                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Item</th>
                                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Colors</th>
                                          <th className="px-4 py-2 text-center text-xs font-medium text-gray-500">Qty</th>
                                          <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Price</th>
                                          <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Total</th>
                                        </tr>
                                      </thead>
                                      <tbody className="divide-y divide-gray-200">
                                        {order.products.map((item: any, idx: number) => {
                                          // Get colors object (either from colors or selectedColors field)
                                          const colorsObj = item.colors || item.selectedColors || {};
                                          
                                          // Build color display with labels
                                          const colorDisplay: string[] = [];
                                          if (colorsObj.option1) {
                                            const label = item.colorOptions?.option1?.label || 'Color 1';
                                            colorDisplay.push(`${label}: ${colorsObj.option1}`);
                                          }
                                          if (colorsObj.option2) {
                                            const label = item.colorOptions?.option2?.label || 'Color 2';
                                            colorDisplay.push(`${label}: ${colorsObj.option2}`);
                                          }
                                          if (colorsObj.option3) {
                                            const label = item.colorOptions?.option3?.label || 'Color 3';
                                            colorDisplay.push(`${label}: ${colorsObj.option3}`);
                                          }
                                          
                                          return (
                                            <tr key={idx}>
                                              <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.name}</td>
                                              <td className="px-4 py-3 text-sm text-gray-600">
                                                {colorDisplay.length > 0 ? (
                                                  <div className="space-y-1">
                                                    {colorDisplay.map((color, i) => (
                                                      <div key={i}>{color}</div>
                                                    ))}
                                                  </div>
                                                ) : '-'}
                                              </td>
                                              <td className="px-4 py-3 text-sm text-gray-900 text-center">{item.quantity}</td>
                                              <td className="px-4 py-3 text-sm text-gray-900 text-right">${item.price.toFixed(2)}</td>
                                              <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right">
                                                ${(item.price * item.quantity).toFixed(2)}
                                              </td>
                                            </tr>
                                          );
                                        })}
                                      </tbody>
                                      <tfoot className="bg-gray-50">
                                        <tr>
                                          <td colSpan={4} className="px-4 py-2 text-sm text-right text-gray-600">Subtotal:</td>
                                          <td className="px-4 py-2 text-sm text-right font-medium">${order.subtotal.toFixed(2)}</td>
                                        </tr>
                                        <tr>
                                          <td colSpan={4} className="px-4 py-2 text-sm text-right text-gray-600">Shipping:</td>
                                          <td className="px-4 py-2 text-sm text-right font-medium">${order.shipping.toFixed(2)}</td>
                                        </tr>
                                        {order.insuranceEnabled && (
                                          <tr>
                                            <td colSpan={4} className="px-4 py-2 text-sm text-right text-gray-600">
                                              Insurance:
                                              <span className="ml-1 text-xs text-gray-500">(${order.insuranceCoverage?.toFixed(2) || '0.00'} coverage)</span>
                                            </td>
                                            <td className="px-4 py-2 text-sm text-right font-medium">${order.insuranceCost?.toFixed(2) || '0.00'}</td>
                                          </tr>
                                        )}
                                        {order.tax > 0 && (
                                          <tr>
                                            <td colSpan={4} className="px-4 py-2 text-sm text-right text-gray-600">Tax:</td>
                                            <td className="px-4 py-2 text-sm text-right font-medium">${order.tax.toFixed(2)}</td>
                                          </tr>
                                        )}
                                        <tr className="border-t-2 border-gray-300">
                                          <td colSpan={4} className="px-4 py-3 text-sm text-right font-semibold text-gray-900">Total:</td>
                                          <td className="px-4 py-3 text-sm text-right font-bold text-purple-600">${order.total.toFixed(2)}</td>
                                        </tr>
                                        {order.refundId && (
                                          <tr className="bg-red-50 border-t-2 border-red-200">
                                            <td colSpan={4} className="px-4 py-3 text-sm text-right font-semibold text-red-700">
                                              💳 Refunded:
                                            </td>
                                            <td className="px-4 py-3 text-sm text-right font-bold text-red-700">
                                              -${order.refundAmount?.toFixed(2) || order.total.toFixed(2)}
                                            </td>
                                          </tr>
                                        )}
                                      </tfoot>
                                    </table>
                                  </div>
                                </div>
                                
                                {/* Payment Information */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div>
                                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Payment Information</h4>
                                    <div className="space-y-1 text-sm">
                                      <p><span className="text-gray-500">Payment Status:</span> <span className="font-medium capitalize">{order.paymentStatus}</span></p>
                                      <p><span className="text-gray-500">Payment Intent:</span> <span className="font-mono text-xs">{order.paymentIntent}</span></p>
                                      {order.stripeSessionId && (
                                        <p><span className="text-gray-500">Session ID:</span> <span className="font-mono text-xs">{order.stripeSessionId}</span></p>
                                      )}
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Order Dates</h4>
                                    <div className="space-y-1 text-sm">
                                      <p><span className="text-gray-500">Created:</span> <span className="font-medium">{formatDate(order.createdAt)}</span></p>
                                      <p><span className="text-gray-500">Updated:</span> <span className="font-medium">{formatDate(order.updatedAt)}</span></p>
                                    </div>
                                  </div>
                                </div>
                                
                                {/* Refund Information */}
                                {order.refundId && (
                                  <div className="mt-6">
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                      <h4 className="text-sm font-semibold text-red-800 mb-3">💳 Refund Information</h4>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                        <div className="space-y-1">
                                          <p><span className="text-red-600">Refund ID:</span> <span className="font-mono text-xs text-red-900">{order.refundId}</span></p>
                                          <p><span className="text-red-600">Amount:</span> <span className="font-bold text-red-900">${order.refundAmount?.toFixed(2) || order.total.toFixed(2)}</span></p>
                                        </div>
                                        <div className="space-y-1">
                                          <p><span className="text-red-600">Refunded At:</span> <span className="font-medium text-red-900">{order.refundedAt ? formatDate(order.refundedAt) : 'N/A'}</span></p>
                                          {order.refundReason && (
                                            <p><span className="text-red-600">Reason:</span> <span className="font-medium text-red-900 capitalize">{order.refundReason.replace(/_/g, ' ')}</span></p>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                        </>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
}
