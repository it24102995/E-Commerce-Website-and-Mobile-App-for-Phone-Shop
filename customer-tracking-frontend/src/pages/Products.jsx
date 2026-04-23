import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { getProduct } from '../service/productService';
import { placeOrder } from '../service/orderServie';

const Products = ({ onLogout }) => {
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState(1000);
  const [sortBy, setSortBy] = useState('relevant');
  const [showCart, setShowCart] = useState(false);
  const [shippingAddress, setShippingAddress] = useState('');
  const [billingAddress, setBillingAddress] = useState('');

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  React.useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getProduct();
        setProducts(data);
      } catch {
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let filtered = products.filter((product) => {
      return (
        product.model.toLowerCase().includes(searchTerm.toLowerCase()) &&
        product.price <= priceRange
      );
    });

    if (sortBy === 'price-low') filtered.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-high') filtered.sort((a, b) => b.price - a.price);
    else if (sortBy === 'stock') filtered.sort((a, b) => b.stock - a.stock);

    return filtered;
  }, [products, searchTerm, priceRange, sortBy]);

  const handleAddToCart = (product) => {
    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
      if (existingItem.quantity < product.stock) {
        setCart(cart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        ));
        Swal.fire({ icon: 'info', title: 'Updated Cart', text: `${product.model} quantity increased`, confirmButtonColor: '#3b82f6', timer: 1500, showConfirmButton: false });
      } else {
        Swal.fire({ icon: 'warning', title: 'Stock Limit', text: `Only ${product.stock} items available`, confirmButtonColor: '#3b82f6' });
      }
    } else {
      if (product.stock > 0) {
        setCart([...cart, { ...product, quantity: 1, id: product.id }]);
        Swal.fire({ icon: 'success', title: 'Added to Cart', text: `${product.model} added successfully`, confirmButtonColor: '#3b82f6', timer: 1500, showConfirmButton: false });
      } else {
        Swal.fire({ icon: 'error', title: 'Out of Stock', text: `${product.model} is currently unavailable`, confirmButtonColor: '#3b82f6' });
      }
    }
  };

  const handleRemoveFromCart = (productId) => setCart(cart.filter((item) => item.id !== productId));

  const handleUpdateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
    } else {
      setCart(cart.map((item) => item.id === productId ? { ...item, quantity } : item));
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handlePlaceOrder = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      Swal.fire({ icon: 'error', title: 'Not Logged In', text: 'Please log in to place an order.', confirmButtonColor: '#3b82f6' });
      return;
    }
    if (cart.length === 0) {
      Swal.fire({ icon: 'warning', title: 'Cart Empty', text: 'Add products to your cart before checking out.', confirmButtonColor: '#3b82f6' });
      return;
    }
    try {
      const orderData = {
        customerName: user.name,
        customerId: user.id || user._id,
        shippingAddress: shippingAddress || '',
        billingAddress: billingAddress || '',
        productIds: cart.map(item => String(item.id)),
      };
      await placeOrder(orderData);
      Swal.fire({ icon: 'success', title: 'Order Placed!', text: `Total: $${cartTotal.toFixed(2)}. Your order is being processed.`, confirmButtonColor: '#3b82f6' });
      setCart([]);
      setShowCart(false);
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Order Failed', text: error.response?.data?.message || 'Failed to place order. Please try again.', confirmButtonColor: '#3b82f6' });
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full">
              <span className="text-xl font-bold text-white">📱</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">MobileShop</h1>
          </div>

          <div className="flex items-center gap-3 md:gap-4">

            {/* ✅ My Orders Navigation Link */}
            <button
              onClick={() => navigate('/my-orders')}
              className="flex items-center gap-2 px-4 py-2 bg-white bg-opacity-20 text-white font-semibold rounded-lg hover:bg-opacity-30 transition-all duration-200 text-sm border border-white border-opacity-30"
            >
              📋 My Orders
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setShowCart(!showCart)}
              className="relative p-2 bg-white text-blue-600 rounded-full hover:bg-opacity-90 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <span className="text-xl">🛒</span>
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Logout Button */}
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
                  Swal.fire({ icon: 'success', title: 'Logged Out', text: 'See you next time!', confirmButtonColor: '#3b82f6' });
                  onLogout();
                  navigate('/login', { replace: true });
                }
              }}
              className="px-4 py-2 bg-white text-blue-600 font-semibold rounded-lg hover:bg-opacity-90 transition-all duration-200 text-sm md:text-base"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Filters</h2>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Search Products</label>
                <input
                  type="text"
                  placeholder="iPhone, Samsung..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors text-gray-900 placeholder-gray-500"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Max Price: ${priceRange}</label>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  value={priceRange}
                  onChange={(e) => setPriceRange(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors text-gray-900"
                >
                  <option value="relevant">Most Relevant</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="stock">Most Available</option>
                </select>
              </div>
            </div>
          </div>

          {/* Products / Cart Area */}
          <div className="lg:col-span-3">
            {showCart ? (
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Shopping Cart</h2>

                {cart.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg mb-4">Your cart is empty</p>
                    <button
                      onClick={() => setShowCart(false)}
                      className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Continue Shopping
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4 mb-6">
                      {cart.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
                          <img src={item.image} alt={item.model} className="w-20 h-20 object-cover rounded-lg" />
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{item.model}</h3>
                            <p className="text-blue-600 font-bold">${item.price}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors">−</button>
                            <span className="w-8 text-center font-semibold">{item.quantity}</span>
                            <button onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors">+</button>
                          </div>
                          <button onClick={() => handleRemoveFromCart(item.id)} className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors text-sm font-semibold">
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="border-t-2 border-gray-200 pt-6">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-lg font-semibold text-gray-900">Total:</span>
                        <span className="text-2xl font-bold text-blue-600">${cartTotal.toFixed(2)}</span>
                      </div>
                      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Shipping Address</label>
                          <input
                            type="text"
                            value={shippingAddress}
                            onChange={e => setShippingAddress(e.target.value)}
                            placeholder="Enter shipping address"
                            className="w-full px-4 py-2 bg-gray-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors text-gray-900 placeholder-gray-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Billing Address</label>
                          <input
                            type="text"
                            value={billingAddress}
                            onChange={e => setBillingAddress(e.target.value)}
                            placeholder="Enter billing address"
                            className="w-full px-4 py-2 bg-gray-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors text-gray-900 placeholder-gray-500"
                          />
                        </div>
                      </div>
                      <button
                        onClick={handlePlaceOrder}
                        className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                      >
                        Checkout
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-white mb-6">
                  Available Phones ({filteredProducts.length})
                </h2>
                {loading ? (
                  <div className="text-center py-12">
                    <p className="text-white text-lg">Loading products...</p>
                  </div>
                ) : error ? (
                  <div className="text-center py-12">
                    <p className="text-red-200 text-lg">{error}</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.length === 0 ? (
                      <div className="col-span-full text-center py-12">
                        <p className="text-white text-lg">No products found matching your criteria</p>
                      </div>
                    ) : (
                      filteredProducts.map((product) => (
                        <div key={product.id} className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 transform">
                          <div className="relative overflow-hidden h-48 bg-gray-100">
                            <img src={product.image} alt={product.model} className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" />
                            {product.stock > 0 && product.stock <= 10 && (
                              <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                                Only {product.stock} left!
                              </div>
                            )}
                            {product.stock === 0 && (
                              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                <span className="text-white text-lg font-bold">Out of Stock</span>
                              </div>
                            )}
                          </div>

                          <div className="p-5">
                            <h3 className="text-lg font-bold text-gray-900 mb-2">{product.model}</h3>
                            <p className="text-gray-600 text-sm mb-4">{product.description}</p>
                            <div className="flex justify-between items-center mb-4">
                              <span className="text-2xl font-bold text-blue-600">${product.price}</span>
                              <span className="text-sm font-semibold text-gray-500">Stock: {product.stock}</span>
                            </div>
                            <button
                              onClick={() => handleAddToCart(product)}
                              disabled={product.stock === 0}
                              className={`w-full py-2 px-4 rounded-lg font-bold transition-all duration-300 ${
                                product.stock === 0
                                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                  : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-md hover:shadow-lg'
                              }`}
                            >
                              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;