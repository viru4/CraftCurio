import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingCart, Home } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart();
  const { isAuthenticated, loading } = useAuth();

  // Redirect to sign-in if not authenticated (but wait for loading to finish)
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      alert('Please sign in to view your cart');
      navigate('/sign-in');
    }
  }, [isAuthenticated, loading, navigate]);

  const shippingCost = cartItems.length > 0 ? 5.00 : 0;

  // Calculate subtotal
  const subtotal = getCartTotal();
  const total = subtotal + shippingCost;

  // Update quantity
  const handleUpdateQuantity = (id, change) => {
    const item = cartItems.find(item => item.id === id);
    if (item) {
      const newQuantity = Math.max(1, item.quantity + change);
      updateQuantity(id, newQuantity);
    }
  };

  // Handle quantity input change
  const handleQuantityChange = (id, value) => {
    const quantity = parseInt(value) || 1;
    updateQuantity(id, Math.max(1, quantity));
  };

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f7f6] dark:bg-[#221810]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f7f6] dark:bg-[#221810]">
      <Navbar />
      
      <main className="flex-grow px-4 py-8 sm:px-10 lg:px-20 mt-20">
        <div className="mx-auto max-w-7xl">
          {/* Breadcrumbs */}
          <div className="flex flex-wrap gap-2 pb-6">
            <Link 
              to="/" 
              className="text-[#9a6c4c] dark:text-gray-400 text-sm font-medium leading-normal hover:text-primary dark:hover:text-primary transition-colors"
            >
              Home
            </Link>
            <span className="text-[#9a6c4c] dark:text-gray-500 text-sm font-medium leading-normal">/</span>
            <span className="text-[#1b130d] dark:text-white text-sm font-medium leading-normal">Cart</span>
          </div>

          {/* Page Heading */}
          <div className="flex flex-wrap justify-between gap-4 pb-8">
            <div className="flex flex-col gap-2">
              <h1 className="text-[#1b130d] dark:text-white text-3xl sm:text-4xl font-black leading-tight tracking-[-0.033em]">
                My Shopping Cart
              </h1>
              <p className="text-[#9a6c4c] dark:text-gray-400 text-base font-normal leading-normal">
                You have {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
              </p>
            </div>
          </div>

          {cartItems.length === 0 ? (
            // Empty Cart State
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <ShoppingCart className="w-24 h-24 text-[#9a6c4c] dark:text-gray-500 mb-6" />
              <h2 className="text-2xl font-bold text-[#1b130d] dark:text-white mb-2">Your cart is empty</h2>
              <p className="text-[#9a6c4c] dark:text-gray-400 mb-6">Add some beautiful handcrafted items to your cart</p>
              <Link 
                to="/" 
                className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            // Main Content Grid
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-12">
              {/* Cart Items Column */}
              <div className="lg:col-span-2">
                <div className="flex flex-col">
                  {/* Cart Table Header - Hidden on mobile */}
                  <div className="hidden border-b border-[#f3ece7] dark:border-[#2a221b] pb-3 text-sm font-medium uppercase text-[#9a6c4c] dark:text-gray-400 sm:grid sm:grid-cols-6 sm:gap-4">
                    <div className="col-span-3">Product</div>
                    <div className="text-center">Quantity</div>
                    <div className="text-right">Total Price</div>
                    <div></div>
                  </div>

                  {/* Cart Items List */}
                  <div className="divide-y divide-[#f3ece7] dark:divide-[#2a221b]">
                    {cartItems.map((item) => (
                      <div key={item.id} className="grid grid-cols-1 items-center gap-4 py-6 sm:grid-cols-6">
                        {/* Product Info */}
                        <div className="flex items-start gap-4 col-span-3">
                          <div 
                            className="bg-center bg-no-repeat aspect-square bg-cover rounded-lg size-[70px] sm:size-[90px] flex-shrink-0"
                            style={{ backgroundImage: `url(${item.image || item.images?.[0] || 'https://via.placeholder.com/400'})` }}
                            aria-label={item.name}
                          />
                          <div className="flex flex-1 flex-col justify-center">
                            <p className="text-[#1b130d] dark:text-white text-base font-medium leading-normal">
                              {item.name}
                            </p>
                            <p className="text-[#9a6c4c] dark:text-gray-400 text-sm font-normal leading-normal">
                              by {item.artisan || item.artisanName || 'Artisan'}
                            </p>
                            <p className="sm:hidden text-sm font-medium text-[#1b130d] dark:text-white mt-1">
                              ${item.price.toFixed(2)}
                            </p>
                          </div>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex justify-start sm:justify-center">
                          <div className="flex items-center gap-2 text-[#1b130d] dark:text-white">
                            <button
                              onClick={() => handleUpdateQuantity(item.id, -1)}
                              className="text-base font-medium leading-normal flex h-8 w-8 items-center justify-center rounded-full bg-[#f3ece7] dark:bg-[#2a221b] cursor-pointer hover:bg-primary/20 dark:hover:bg-primary/30 transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                              className="text-base font-medium leading-normal w-12 p-0 text-center bg-transparent focus:outline-0 focus:ring-0 focus:border-none border-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                              min="1"
                            />
                            <button
                              onClick={() => handleUpdateQuantity(item.id, 1)}
                              className="text-base font-medium leading-normal flex h-8 w-8 items-center justify-center rounded-full bg-[#f3ece7] dark:bg-[#2a221b] cursor-pointer hover:bg-primary/20 dark:hover:bg-primary/30 transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Total Price */}
                        <p className="text-left sm:text-right font-medium text-[#1b130d] dark:text-white">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>

                        {/* Delete Button */}
                        <div className="flex justify-start sm:justify-end">
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-[#9a6c4c] dark:text-gray-400 hover:text-red-600 dark:hover:text-red-500 transition-colors"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Continue Shopping Button - Mobile */}
                  <div className="mt-6 lg:hidden">
                    <Link
                      to="/"
                      className="flex items-center justify-center gap-2 w-full py-3 px-4 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary hover:text-white transition-all"
                    >
                      <Home className="w-5 h-5" />
                      Continue Shopping
                    </Link>
                  </div>
                </div>
              </div>

              {/* Order Summary Column */}
              <div className="lg:col-span-1">
                <div className="sticky top-28 rounded-xl border border-[#f3ece7] dark:border-[#2a221b] bg-white dark:bg-[#2a221b] p-6 shadow-sm">
                  <h2 className="text-xl font-bold text-[#1b130d] dark:text-white mb-6">
                    Order Summary
                  </h2>
                  
                  <div className="space-y-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[#9a6c4c] dark:text-gray-400">Subtotal</span>
                      <span className="font-medium text-[#1b130d] dark:text-white">
                        ${subtotal.toFixed(2)}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-[#9a6c4c] dark:text-gray-400">Shipping</span>
                      <span className="font-medium text-[#1b130d] dark:text-white">
                        ${shippingCost.toFixed(2)}
                      </span>
                    </div>
                    
                    <div className="flex justify-between border-t border-[#f3ece7] dark:border-gray-700 pt-4 text-base font-bold">
                      <span className="text-[#1b130d] dark:text-white">Total</span>
                      <span className="text-[#1b130d] dark:text-white">
                        ${total.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <button 
                    onClick={() => navigate('/checkout')}
                    className="mt-8 flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 bg-primary text-white gap-2 text-base font-bold leading-normal tracking-[0.015em] hover:opacity-90 transition-opacity"
                  >
                    Proceed to Checkout
                  </button>

                  <p className="mt-4 text-xs text-center text-[#9a6c4c] dark:text-gray-500">
                    Shipping costs will be calculated at checkout.
                  </p>

                  {/* Continue Shopping - Desktop */}
                  <Link
                    to="/"
                    className="hidden lg:flex items-center justify-center gap-2 w-full mt-4 py-3 px-4 border-2 border-[#f3ece7] dark:border-[#2a221b] text-[#1b130d] dark:text-white rounded-lg font-semibold hover:border-primary hover:text-primary dark:hover:text-primary transition-all"
                  >
                    <Home className="w-5 h-5" />
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Cart;
