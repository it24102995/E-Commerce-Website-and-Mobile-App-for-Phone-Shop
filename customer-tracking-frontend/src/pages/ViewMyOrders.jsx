import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOrdersByUserId } from '../service/orderServie';

const ViewMyOrder = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) {
        navigate('/login');
        return;
      }
      try {
        const userId = user.id || user._id;
        const data = await getOrdersByUserId(userId);
        setOrders(data);
      } catch (err) {
        setError('Failed to load orders. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [navigate]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':  return 'bg-green-100 text-green-700 border-green-200';
      case 'pending':    return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'cancelled':  return 'bg-red-100 text-red-700 border-red-200';
      default:           return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':  return '✅';
      case 'pending':    return '⏳';
      case 'cancelled':  return '❌';
      default:           return '📦';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-white bg-opacity-10 backdrop-blur-md border-b border-white border-opacity-20 sticky top-0 shadow-lg">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full">
              <span className="text-lg font-bold text-white">📱</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-white">MobileShop</h1>
          </div>
          <button
            onClick={() => navigate('/products')}
            className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 font-semibold rounded-lg hover:bg-opacity-90 transition-all duration-200 text-sm shadow"
          >
            ← Back to Products
          </button>
        </div>
      </header>

      {/* Page Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h2 className="text-3xl font-bold text-white mb-8">My Orders</h2>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            <p className="text-white text-lg">Loading your orders...</p>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-300 text-red-700 rounded-2xl p-8 text-center">
            <p className="text-lg font-semibold">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-16 text-center">
            <p className="text-5xl mb-4">📭</p>
            <p className="text-xl font-semibold text-gray-700 mb-2">No orders yet</p>
            <p className="text-gray-500 mb-6">You haven't placed any orders. Start shopping!</p>
            <button
              onClick={() => navigate('/products')}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all"
            >
              Shop Now
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.orderId || order.id || order._id}
                className="bg-white rounded-2xl shadow-xl overflow-hidden"
              >
                {/* Order Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 bg-gray-50 border-b border-gray-100">
                  <div>
                    <p className="text-xs text-gray-400 font-mono">Order ID</p>
                    <p className="text-sm font-semibold text-gray-700">#{order.orderId || order.id || order._id}</p>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(order.status)}`}
                  >
                    {getStatusIcon(order.status)} {order.status}
                  </span>
                </div>

                {/* Order Body */}
                <div className="px-6 py-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Addresses */}
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Shipping Address</p>
                      <p className="text-sm text-gray-700 mt-0.5">{order.shippingAddress || '—'}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Billing Address</p>
                      <p className="text-sm text-gray-700 mt-0.5">{order.billingAddress || '—'}</p>
                    </div>
                  </div>

                  {/* Products in Order */}
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                      Products ({order.productList?.length ?? 0})
                    </p>
                    <div className="space-y-1">
                      {order.productList?.map((product) => (
                        <div
                          key={product.id}
                          className="flex items-center gap-3 text-sm text-gray-700"
                        >
                          {product.image && (
                            <img
                              src={product.image}
                              alt={product.model}
                              className="w-8 h-8 object-cover rounded"
                            />
                          )}
                          <span className="flex-1">{product.model}</span>
                          <span className="font-semibold text-blue-600">${product.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Order Footer */}
                <div className="flex justify-end items-center px-6 py-4 bg-gray-50 border-t border-gray-100 gap-4">
                  <button
                    onClick={() => {
                      const id = order.orderId || order.id || order._id;
                      if (id) navigate(`/track-order/${id}`);
                      else console.error("Order ID is missing", order);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 font-semibold rounded-lg hover:from-blue-200 hover:to-blue-300 transition-all duration-200 shadow-sm border border-blue-300 mr-auto"
                  >
                    📍 Where is my order?
                  </button>
                  <span className="text-gray-500 text-sm mr-2">Total Amount:</span>
                  <span className="text-xl font-bold text-blue-600">
                    ${order.totalAmount?.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewMyOrder;