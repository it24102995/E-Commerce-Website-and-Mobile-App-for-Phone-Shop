import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllOrders } from "../service/orderServie";


import { acceptOrder } from "../service/deliverService";

import Swal from 'sweetalert2';

export default function DeliverDashboard({ onLogout }) {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [acceptedOrders, setAcceptedOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getAllOrders();
      setOrders(data || []);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptOrder = async (orderId) => {
    try {
      console.log("Order accepted successfully:", orderId);
      await acceptOrder(orderId);
      setAcceptedOrders([...acceptedOrders, orderId]);
      fetchOrders();
    } catch {
      alert("Failed to accept order");
    }
  };

  const isOrderAccepted = (orderId) => acceptedOrders.includes(orderId);

  if (loading) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-blue-700 font-semibold tracking-wide text-sm">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Header */}
      <header className="bg-blue-700 shadow-lg sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500 p-2 rounded-xl">
              <span className="text-2xl">📦</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white leading-tight">Delivery Dashboard</h1>
              <p className="text-blue-300 text-xs">Manage & accept incoming orders</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={fetchOrders}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg border border-blue-500 transition-all duration-150"
            >
              🔄 Refresh
            </button>
            <button
              onClick={async () => {
                const result = await Swal.fire({
                  title: 'Are you sure?',
                  text: 'Do you really want to logout?',
                  icon: 'warning',
                  showCancelButton: true,
                  confirmButtonColor: '#3b82f6',
                  cancelButtonColor: '#d1d5db',
                  confirmButtonText: 'Yes, logout',
                  cancelButtonText: 'Cancel',
                  reverseButtons: true,
                });
                if (result.isConfirmed) {
                  onLogout();
                  navigate('/login', { replace: true });
                }
              }}
              className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-blue-50 text-blue-700 text-sm font-semibold rounded-lg border border-blue-200 transition-all duration-150"
            >
              ⬅ Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white border border-blue-100 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
            <div className="bg-blue-100 p-3 rounded-xl">
              <span className="text-2xl">🗂️</span>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-blue-800">{orders.length}</div>
              <p className="text-blue-600 text-xs font-medium uppercase tracking-wider">Total Orders</p>
            </div>
          </div>
          <div className="bg-white border border-blue-100 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
            <div className="bg-blue-100 p-3 rounded-xl">
              <span className="text-2xl">✅</span>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-blue-600">{acceptedOrders.length}</div>
              <p className="text-blue-500 text-xs font-medium uppercase tracking-wider">Accepted</p>
            </div>
          </div>
          <div className="bg-white border border-green-100 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
            <div className="bg-yellow-50 p-3 rounded-xl">
              <span className="text-2xl">⏳</span>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-yellow-600">{orders.length - acceptedOrders.length}</div>
              <p className="text-yellow-600 text-xs font-medium uppercase tracking-wider">Pending</p>
            </div>
          </div>
        </div>

        {/* Order List */}
        <div className="space-y-5">
          {orders.length === 0 ? (
            <div className="bg-white rounded-2xl border border-blue-100 p-12 text-center shadow-sm">
              <span className="text-5xl">📭</span>
              <p className="text-blue-700 font-semibold mt-3">No orders available right now</p>
              <p className="text-blue-400 text-sm mt-1">Check back soon or hit Refresh</p>
            </div>
          ) : (
            orders.map((order, index) => {
              const accepted = isOrderAccepted(order.orderId);
              return (
                <div
                  key={index}
                  className={`bg-white rounded-2xl shadow-sm border transition-all duration-200 hover:shadow-md overflow-hidden
                    ${accepted
                      ? "border-blue-400 ring-2 ring-blue-200"
                      : "border-blue-100 hover:border-blue-300"
                    }`}
                >
                  {/* Card Top Bar */}
                  <div className={`h-1.5 w-full ${accepted ? "bg-blue-500" : "bg-yellow-400"}`} />

                  <div className="p-5">
                    {/* Customer Row */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-base uppercase">
                          {order.customerName?.[0] ?? "?"}
                        </div>
                        <div>
                          <p className="text-blue-900 font-semibold text-base leading-tight">{order.customerName}</p>
                          <p className="text-blue-400 text-xs font-mono">ID: {order.customerId}</p>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide
                          ${accepted
                            ? "bg-blue-100 text-blue-700 border border-blue-300"
                            : "bg-yellow-50 text-yellow-700 border border-yellow-300"
                          }`}
                      >
                        {accepted ? "✓ Accepted" : "⏳ Pending"}
                      </span>
                    </div>

                    {/* Addresses */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                      <div className="flex items-start gap-2 bg-blue-50 rounded-xl px-4 py-3">
                        <span className="text-blue-500 mt-0.5">📍</span>
                        <div>
                          <p className="text-blue-600 text-xs font-semibold uppercase tracking-wider mb-0.5">Shipping</p>
                          <p className="text-blue-900 text-sm">
                            {order.shippingAddress ?? <span className="italic text-blue-300">Not provided</span>}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 bg-blue-50 rounded-xl px-4 py-3">
                        <span className="text-blue-500 mt-0.5">🏠</span>
                        <div>
                          <p className="text-blue-600 text-xs font-semibold uppercase tracking-wider mb-0.5">Billing</p>
                          <p className="text-blue-900 text-sm">
                            {order.billingAddress ?? <span className="italic text-blue-300">Not provided</span>}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Products */}
                    <div className="mb-4">
                      <p className="text-blue-700 text-xs font-semibold uppercase tracking-wider mb-2">Products</p>
                      <div className="flex gap-3 overflow-x-auto pb-1">
                        {order.productList.map((product, idx) => (
                          <div
                            key={idx}
                            className="min-w-[160px] bg-blue-50 border border-blue-100 rounded-xl p-3 flex flex-col items-center hover:border-blue-300 transition-all"
                          >
                            <img
                              src={product.image}
                              alt={product.model}
                              className="w-20 h-20 object-cover rounded-lg mb-2 shadow-sm border border-blue-100"
                            />
                            <p className="font-semibold text-blue-900 text-sm text-center truncate w-full">{product.model}</p>
                            <p className="text-blue-600 font-bold text-sm mt-1">${product.price}</p>
                            <div className="flex gap-3 mt-1">
                              <span className="text-blue-400 text-xs">Stock: {product.stock}</span>
                              <span className="text-blue-400 text-xs">Qty: {product.quantity}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Button */}
                    {!accepted ? (
                      <button
                        onClick={() => handleAcceptOrder(order.orderId)}
                        className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-xl font-semibold text-sm tracking-wide transition-all duration-150 shadow-sm shadow-blue-200"
                      >
                        ✓ Accept Order
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          disabled
                          className="flex-1 py-2.5 bg-blue-100 text-blue-600 rounded-xl font-semibold text-sm tracking-wide cursor-not-allowed border border-blue-200"
                        >
                          ✓ Order Accepted
                        </button>
                        <button
                          onClick={() => navigate(`/rider-view/${order.orderId}`)}
                          className="flex-1 py-2.5 bg-green-500 hover:bg-green-600 active:scale-95 text-white rounded-xl font-semibold text-sm tracking-wide transition-all duration-150 shadow-sm shadow-green-200"
                        >
                          📍 Share Location
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}
