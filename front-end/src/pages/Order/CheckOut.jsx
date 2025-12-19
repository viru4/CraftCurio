import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRazorpay } from '@/hooks/useRazorpay';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Lock, ArrowRight, CreditCard } from 'lucide-react';

const CheckOut = () => {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { isAuthenticated, loading, user } = useAuth();
  const { processPayment, loading: paymentLoading } = useRazorpay();
  
  const [currentStep, setCurrentStep] = useState(1); // 1: Shipping, 2: Payment, 3: Review
  const [sameAsBilling, setSameAsBilling] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);
  const [paymentInfo, setPaymentInfo] = useState({
    paymentMethod: 'razorpay',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });

  // Redirect to sign-in if not authenticated (but wait for loading to finish)
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      alert('Please sign in to proceed with checkout');
      navigate('/sign-in');
    }
  }, [isAuthenticated, loading, navigate]);
  
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });

  const subtotal = getCartTotal();
  const shipping = cartItems.length > 0 ? 5.00 : 0;
  const taxes = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + taxes;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleContinueToPayment = (e) => {
    e.preventDefault();
    
    // Validate shipping info
    const requiredFields = ['fullName', 'address', 'city', 'state', 'zipCode', 'country'];
    const isValid = requiredFields.every(field => shippingInfo[field].trim() !== '');
    
    if (!isValid) {
      alert('Please fill in all shipping information fields');
      return;
    }

    // Move to payment step
    setCurrentStep(2);
  };

  const handleContinueToReview = (e) => {
    e.preventDefault();
    
    // Validate payment info based on payment method
    if (paymentInfo.paymentMethod === 'card') {
      if (!paymentInfo.cardNumber || !paymentInfo.cardName || !paymentInfo.expiryDate || !paymentInfo.cvv) {
        alert('Please fill in all payment information fields');
        return;
      }
    }

    // Move to review step
    setCurrentStep(3);
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    
    setIsSubmitting(true);

    try {
      // Prepare order data
      const orderData = {
        items: cartItems.map(item => ({
          productId: item.id,
          productType: item.type || item.productType || 'artisan-product',
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          artisan: item.artisan,
          category: item.category
        })),
        shippingAddress: shippingInfo,
        billingAddress: sameAsBilling ? shippingInfo : null,
        subtotal: subtotal,
        shipping: shipping,
        tax: taxes,
        total: total,
        paymentMethod: paymentInfo.paymentMethod,
        notes: ''
      };

      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        alert('Please login to continue');
        navigate('/sign-in');
        return;
      }

      // Send order to backend
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create order');
      }

      // Store created order
      setCreatedOrder(data.order);

      // If payment method is Razorpay, initiate payment
      if (paymentInfo.paymentMethod === 'razorpay') {
        await processPayment({
          orderId: data.order._id,
          amount: total,
          name: user?.name || shippingInfo.fullName,
          email: user?.email || '',
          phone: user?.phone || '',
          description: `Order #${data.order.orderNumber}`,
          onSuccess: (updatedOrder) => {
            console.log('Payment successful:', updatedOrder);
            // Clear cart after successful payment
            clearCart();
            // Navigate to order confirmation page
            navigate(`/order-confirmation/${data.order._id}`, {
              state: { order: updatedOrder }
            });
          },
          onFailure: (error) => {
            console.error('Payment failed:', error);

            let userMessage = 'Payment failed. Please try again or use a different payment method.';
            if (error && error.description) {
              userMessage = `Payment failed: ${error.description}. Please try again or use a different payment method.`;
            } else if (error && error.reason) {
              // Fallback to reason if description is missing
              userMessage = `Payment failed: ${error.reason}. Please try again or use a different payment method.`;
            }

            // Display user-friendly error message
            // TODO: Replace alert with a modal or toast notification for better UX
            alert(userMessage);

            // TODO: Log this error to your backend for monitoring and debugging
            // Example: sendErrorToBackend('/api/log-payment-failure', error);

            // Navigate to orders page even if payment fails
            navigate('/profile?section=orders');
          }
        });
      } else {
        // For other payment methods (COD, etc.)
        clearCart();
        navigate(`/order-confirmation/${data.order._id}`, {
          state: { order: data.order }
        });
      }

    } catch (error) {
      console.error('Order creation error:', error);
      alert(error.message || 'Failed to create order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToShipping = () => {
    setCurrentStep(1);
  };

  const handleBackToPayment = () => {
    setCurrentStep(2);
  };

  const handlePaymentInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const progressPercentage = (currentStep / 3) * 100;

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary-color)]"></div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen pt-24 pb-12 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-stone-900 mb-4">Your cart is empty</h2>
            <p className="text-stone-600 mb-8">Add some items to your cart before checking out.</p>
            <button
              onClick={() => navigate('/')}
              className="bg-[var(--primary-color)] text-white px-8 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#f8f7f6] pt-20">
        <div className="flex flex-1 justify-center py-8 sm:py-12 md:py-16">
          <div className="max-w-7xl w-full px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <header className="mb-8 md:mb-12">
              <div className="flex flex-wrap justify-between items-center gap-4 p-4">
                <h1 className="text-[#1b130d] text-3xl sm:text-4xl font-black leading-tight tracking-tight">
                  Checkout
                </h1>
              </div>

              {/* Progress Steps */}
              <div className="flex flex-col gap-3 p-4 mt-4">
                <div className="flex gap-4 sm:gap-6 justify-between text-sm sm:text-base">
                  <p className={`font-medium leading-normal ${currentStep >= 1 ? 'text-[var(--primary-color)]' : 'text-[#9a6c4c]'}`}>
                    Shipping
                  </p>
                  <p className={`font-medium leading-normal ${currentStep >= 2 ? 'text-[var(--primary-color)]' : 'text-[#9a6c4c]'}`}>
                    Payment
                  </p>
                  <p className={`font-medium leading-normal ${currentStep >= 3 ? 'text-[var(--primary-color)]' : 'text-[#9a6c4c]'}`}>
                    Review
                  </p>
                </div>
                <div className="rounded-full bg-[#e7d9cf] h-2">
                  <div 
                    className="h-2 rounded-full bg-[var(--primary-color)] transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>
            </header>

            {/* Main Content */}
            <main className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
              {/* Step Content */}
              <div className="lg:col-span-2">
                {/* Shipping Step */}
                {currentStep === 1 && (
                  <section>
                    <h2 className="text-[#1b130d] text-2xl sm:text-[32px] font-bold leading-tight px-4 text-left pb-3 pt-6">
                      Shipping Address
                    </h2>
                    
                    <form onSubmit={handleContinueToPayment} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 p-4">
                    {/* Full Name */}
                    <div className="md:col-span-2">
                      <label className="flex flex-col w-full">
                        <p className="text-[#1b130d] text-base font-medium leading-normal pb-2">
                          Full Name <span className="text-red-500">*</span>
                        </p>
                        <input
                          type="text"
                          name="fullName"
                          value={shippingInfo.fullName}
                          onChange={handleInputChange}
                          required
                          className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#1b130d] focus:outline-0 focus:ring-2 focus:ring-[var(--primary-color)]/50 border border-[#e7d9cf] bg-white focus:border-[var(--primary-color)] h-14 placeholder:text-[#9a6c4c] p-[15px] text-base font-normal leading-normal"
                          placeholder="John Doe"
                        />
                      </label>
                    </div>

                    {/* Address */}
                    <div className="md:col-span-2">
                      <label className="flex flex-col w-full">
                        <p className="text-[#1b130d] text-base font-medium leading-normal pb-2">
                          Address <span className="text-red-500">*</span>
                        </p>
                        <input
                          type="text"
                          name="address"
                          value={shippingInfo.address}
                          onChange={handleInputChange}
                          required
                          className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#1b130d] focus:outline-0 focus:ring-2 focus:ring-[var(--primary-color)]/50 border border-[#e7d9cf] bg-white focus:border-[var(--primary-color)] h-14 placeholder:text-[#9a6c4c] p-[15px] text-base font-normal leading-normal"
                          placeholder="123 Artisan Way"
                        />
                      </label>
                    </div>

                    {/* City */}
                    <div>
                      <label className="flex flex-col w-full">
                        <p className="text-[#1b130d] text-base font-medium leading-normal pb-2">
                          City <span className="text-red-500">*</span>
                        </p>
                        <input
                          type="text"
                          name="city"
                          value={shippingInfo.city}
                          onChange={handleInputChange}
                          required
                          className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#1b130d] focus:outline-0 focus:ring-2 focus:ring-[var(--primary-color)]/50 border border-[#e7d9cf] bg-white focus:border-[var(--primary-color)] h-14 placeholder:text-[#9a6c4c] p-[15px] text-base font-normal leading-normal"
                          placeholder="Crafton"
                        />
                      </label>
                    </div>

                    {/* State */}
                    <div>
                      <label className="flex flex-col w-full">
                        <p className="text-[#1b130d] text-base font-medium leading-normal pb-2">
                          State / Province <span className="text-red-500">*</span>
                        </p>
                        <input
                          type="text"
                          name="state"
                          value={shippingInfo.state}
                          onChange={handleInputChange}
                          required
                          className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#1b130d] focus:outline-0 focus:ring-2 focus:ring-[var(--primary-color)]/50 border border-[#e7d9cf] bg-white focus:border-[var(--primary-color)] h-14 placeholder:text-[#9a6c4c] p-[15px] text-base font-normal leading-normal"
                          placeholder="California"
                        />
                      </label>
                    </div>

                    {/* ZIP Code */}
                    <div>
                      <label className="flex flex-col w-full">
                        <p className="text-[#1b130d] text-base font-medium leading-normal pb-2">
                          ZIP / Postal Code <span className="text-red-500">*</span>
                        </p>
                        <input
                          type="text"
                          name="zipCode"
                          value={shippingInfo.zipCode}
                          onChange={handleInputChange}
                          required
                          className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#1b130d] focus:outline-0 focus:ring-2 focus:ring-[var(--primary-color)]/50 border border-[#e7d9cf] bg-white focus:border-[var(--primary-color)] h-14 placeholder:text-[#9a6c4c] p-[15px] text-base font-normal leading-normal"
                          placeholder="90210"
                        />
                      </label>
                    </div>

                    {/* Country */}
                    <div>
                      <label className="flex flex-col w-full">
                        <p className="text-[#1b130d] text-base font-medium leading-normal pb-2">
                          Country <span className="text-red-500">*</span>
                        </p>
                        <input
                          type="text"
                          name="country"
                          value={shippingInfo.country}
                          onChange={handleInputChange}
                          required
                          className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#1b130d] focus:outline-0 focus:ring-2 focus:ring-[var(--primary-color)]/50 border border-[#e7d9cf] bg-white focus:border-[var(--primary-color)] h-14 placeholder:text-[#9a6c4c] p-[15px] text-base font-normal leading-normal"
                          placeholder="United States"
                        />
                      </label>
                    </div>

                    {/* Same as Billing Checkbox */}
                    <div className="md:col-span-2 mt-4">
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={sameAsBilling}
                          onChange={(e) => setSameAsBilling(e.target.checked)}
                          className="h-5 w-5 rounded text-[var(--primary-color)] bg-white border-[#e7d9cf] focus:ring-[var(--primary-color)] focus:ring-offset-0"
                        />
                        <span className="text-base text-[#1b130d]">
                          Billing address is the same as shipping
                        </span>
                      </label>
                    </div>

                      {/* Submit Button */}
                      <div className="md:col-span-2 mt-8 flex justify-end">
                        <button
                          type="submit"
                          className="flex items-center justify-center gap-2 w-full sm:w-auto rounded-lg bg-[var(--primary-color)] px-8 py-4 text-center text-base font-bold text-white shadow-sm transition-all hover:bg-[var(--primary-color)]/90 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]/50 focus:ring-offset-2"
                        >
                          Continue to Payment
                          <ArrowRight className="h-5 w-5" />
                        </button>
                      </div>
                    </form>
                  </section>
                )}

                {/* Payment Step */}
                {currentStep === 2 && (
                  <section>
                    <h2 className="text-[#1b130d] text-2xl sm:text-[32px] font-bold leading-tight px-4 text-left pb-3 pt-6">
                      Payment Information
                    </h2>
                    
                    <form onSubmit={handleContinueToReview} className="p-4">
                      {/* Payment Method Selection */}
                      <div className="mb-6">
                        <label className="text-[#1b130d] text-base font-medium leading-normal pb-2 block">
                          Payment Method <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
                          <label className={`flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            paymentInfo.paymentMethod === 'razorpay' 
                              ? 'border-[var(--primary-color)] bg-[var(--primary-color)]/10' 
                              : 'border-[#e7d9cf] hover:border-[var(--primary-color)]/50'
                          }`}>
                            <input
                              type="radio"
                              name="paymentMethod"
                              value="razorpay"
                              checked={paymentInfo.paymentMethod === 'razorpay'}
                              onChange={handlePaymentInputChange}
                              className="sr-only"
                            />
                            <div className="text-center">
                              <CreditCard className="h-6 w-6 mx-auto mb-2" />
                              <span className="text-sm font-medium">Razorpay</span>
                              <p className="text-xs text-gray-500 mt-1">Card/UPI/Wallet</p>
                            </div>
                          </label>

                          <label className={`flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            paymentInfo.paymentMethod === 'card' 
                              ? 'border-[var(--primary-color)] bg-[var(--primary-color)]/10' 
                              : 'border-[#e7d9cf] hover:border-[var(--primary-color)]/50'
                          }`}>
                            <input
                              type="radio"
                              name="paymentMethod"
                              value="card"
                              checked={paymentInfo.paymentMethod === 'card'}
                              onChange={handlePaymentInputChange}
                              className="sr-only"
                            />
                            <div className="text-center">
                              <CreditCard className="h-6 w-6 mx-auto mb-2" />
                              <span className="text-sm font-medium">Card</span>
                            </div>
                          </label>
                          <label className={`flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            paymentInfo.paymentMethod === 'paypal' 
                              ? 'border-[var(--primary-color)] bg-[var(--primary-color)]/10' 
                              : 'border-[#e7d9cf] hover:border-[var(--primary-color)]/50'
                          }`}>
                            <input
                              type="radio"
                              name="paymentMethod"
                              value="paypal"
                              checked={paymentInfo.paymentMethod === 'paypal'}
                              onChange={handlePaymentInputChange}
                              className="sr-only"
                            />
                            <div className="text-center">
                              <span className="text-sm font-medium">PayPal</span>
                            </div>
                          </label>
                          <label className={`flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            paymentInfo.paymentMethod === 'cod' 
                              ? 'border-[var(--primary-color)] bg-[var(--primary-color)]/10' 
                              : 'border-[#e7d9cf] hover:border-[var(--primary-color)]/50'
                          }`}>
                            <input
                              type="radio"
                              name="paymentMethod"
                              value="cod"
                              checked={paymentInfo.paymentMethod === 'cod'}
                              onChange={handlePaymentInputChange}
                              className="sr-only"
                            />
                            <div className="text-center">
                              <span className="text-sm font-medium">Cash on Delivery</span>
                            </div>
                          </label>
                        </div>
                      </div>

                      {/* Card Payment Form */}
                      {paymentInfo.paymentMethod === 'card' && (
                        <div className="space-y-4">
                          <div>
                            <label className="flex flex-col w-full">
                              <p className="text-[#1b130d] text-base font-medium leading-normal pb-2">
                                Cardholder Name <span className="text-red-500">*</span>
                              </p>
                              <input
                                type="text"
                                name="cardName"
                                value={paymentInfo.cardName}
                                onChange={handlePaymentInputChange}
                                required
                                className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#1b130d] focus:outline-0 focus:ring-2 focus:ring-[var(--primary-color)]/50 border border-[#e7d9cf] bg-white focus:border-[var(--primary-color)] h-14 placeholder:text-[#9a6c4c] p-[15px] text-base font-normal leading-normal"
                                placeholder="John Doe"
                              />
                            </label>
                          </div>

                          <div>
                            <label className="flex flex-col w-full">
                              <p className="text-[#1b130d] text-base font-medium leading-normal pb-2">
                                Card Number <span className="text-red-500">*</span>
                              </p>
                              <input
                                type="text"
                                name="cardNumber"
                                value={paymentInfo.cardNumber}
                                onChange={handlePaymentInputChange}
                                required
                                maxLength={19}
                                placeholder="1234 5678 9012 3456"
                                className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#1b130d] focus:outline-0 focus:ring-2 focus:ring-[var(--primary-color)]/50 border border-[#e7d9cf] bg-white focus:border-[var(--primary-color)] h-14 placeholder:text-[#9a6c4c] p-[15px] text-base font-normal leading-normal"
                              />
                            </label>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="flex flex-col w-full">
                                <p className="text-[#1b130d] text-base font-medium leading-normal pb-2">
                                  Expiry Date <span className="text-red-500">*</span>
                                </p>
                                <input
                                  type="text"
                                  name="expiryDate"
                                  value={paymentInfo.expiryDate}
                                  onChange={handlePaymentInputChange}
                                  required
                                  placeholder="MM/YY"
                                  maxLength={5}
                                  className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#1b130d] focus:outline-0 focus:ring-2 focus:ring-[var(--primary-color)]/50 border border-[#e7d9cf] bg-white focus:border-[var(--primary-color)] h-14 placeholder:text-[#9a6c4c] p-[15px] text-base font-normal leading-normal"
                                />
                              </label>
                            </div>

                            <div>
                              <label className="flex flex-col w-full">
                                <p className="text-[#1b130d] text-base font-medium leading-normal pb-2">
                                  CVV <span className="text-red-500">*</span>
                                </p>
                                <input
                                  type="text"
                                  name="cvv"
                                  value={paymentInfo.cvv}
                                  onChange={handlePaymentInputChange}
                                  required
                                  maxLength={4}
                                  placeholder="123"
                                  className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#1b130d] focus:outline-0 focus:ring-2 focus:ring-[var(--primary-color)]/50 border border-[#e7d9cf] bg-white focus:border-[var(--primary-color)] h-14 placeholder:text-[#9a6c4c] p-[15px] text-base font-normal leading-normal"
                                />
                              </label>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* PayPal or COD Message */}
                      {(paymentInfo.paymentMethod === 'paypal' || paymentInfo.paymentMethod === 'cod') && (
                        <div className="bg-[#f8f7f6] border border-[#e7d9cf] rounded-lg p-4 mb-4">
                          <p className="text-[#9a6c4c] text-sm">
                            {paymentInfo.paymentMethod === 'paypal' 
                              ? 'You will be redirected to PayPal to complete your payment.'
                              : 'You will pay when the order is delivered.'}
                          </p>
                        </div>
                      )}

                      {/* Navigation Buttons */}
                      <div className="mt-8 flex gap-4">
                        <button
                          type="button"
                          onClick={handleBackToShipping}
                          className="flex items-center justify-center gap-2 w-full sm:w-auto rounded-lg border-2 border-[#e7d9cf] px-8 py-4 text-center text-base font-bold text-[#1b130d] shadow-sm transition-all hover:bg-[#f8f7f6] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]/50 focus:ring-offset-2"
                        >
                          Back
                        </button>
                        <button
                          type="submit"
                          className="flex items-center justify-center gap-2 w-full sm:w-auto rounded-lg bg-[var(--primary-color)] px-8 py-4 text-center text-base font-bold text-white shadow-sm transition-all hover:bg-[var(--primary-color)]/90 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]/50 focus:ring-offset-2"
                        >
                          Continue to Review
                          <ArrowRight className="h-5 w-5" />
                        </button>
                      </div>
                    </form>
                  </section>
                )}

                {/* Review Step */}
                {currentStep === 3 && (
                  <section>
                    <h2 className="text-[#1b130d] text-2xl sm:text-[32px] font-bold leading-tight px-4 text-left pb-3 pt-6">
                      Review Your Order
                    </h2>
                    
                    <div className="p-4 space-y-6">
                      {/* Shipping Address Review */}
                      <div className="bg-white border border-[#e7d9cf] rounded-lg p-6">
                        <h3 className="text-lg font-bold text-[#1b130d] mb-4">Shipping Address</h3>
                        <div className="text-sm text-[#9a6c4c] space-y-1">
                          <p className="font-semibold text-[#1b130d]">{shippingInfo.fullName}</p>
                          <p>{shippingInfo.address}</p>
                          <p>{shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}</p>
                          <p>{shippingInfo.country}</p>
                        </div>
                        <button
                          type="button"
                          onClick={handleBackToShipping}
                          className="mt-4 text-sm text-[var(--primary-color)] hover:underline"
                        >
                          Edit
                        </button>
                      </div>

                      {/* Payment Method Review */}
                      <div className="bg-white border border-[#e7d9cf] rounded-lg p-6">
                        <h3 className="text-lg font-bold text-[#1b130d] mb-4">Payment Method</h3>
                        <div className="text-sm text-[#9a6c4c]">
                          <p className="font-semibold text-[#1b130d] capitalize">
                            {paymentInfo.paymentMethod === 'razorpay' ? 'Razorpay (Card/UPI/Wallet)' : paymentInfo.paymentMethod}
                          </p>
                          {paymentInfo.paymentMethod === 'razorpay' && (
                            <p className="mt-2 text-xs text-gray-500">Payment will be processed securely via Razorpay</p>
                          )}
                          {paymentInfo.paymentMethod === 'card' && paymentInfo.cardNumber && (
                            <p className="mt-2">**** **** **** {paymentInfo.cardNumber.slice(-4)}</p>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={handleBackToPayment}
                          className="mt-4 text-sm text-[var(--primary-color)] hover:underline"
                        >
                          Edit
                        </button>
                      </div>

                      {/* Order Items Review */}
                      <div className="bg-white border border-[#e7d9cf] rounded-lg p-6">
                        <h3 className="text-lg font-bold text-[#1b130d] mb-4">Order Items</h3>
                        <div className="space-y-4">
                          {cartItems.map((item) => (
                            <div key={item.id} className="flex items-center gap-4 py-3 border-b border-[#e7d9cf] last:border-0">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="h-16 w-16 rounded-lg object-cover flex-shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-[#1b130d] truncate">{item.name}</p>
                                <p className="text-sm text-[#9a6c4c]">Qty: {item.quantity}</p>
                              </div>
                              <p className="font-semibold text-[#1b130d] flex-shrink-0">
                                ₹{(item.price * item.quantity).toFixed(2)}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Navigation Buttons */}
                      <div className="flex gap-4">
                        <button
                          type="button"
                          onClick={handleBackToPayment}
                          className="flex items-center justify-center gap-2 w-full sm:w-auto rounded-lg border-2 border-[#e7d9cf] px-8 py-4 text-center text-base font-bold text-[#1b130d] shadow-sm transition-all hover:bg-[#f8f7f6] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]/50 focus:ring-offset-2"
                        >
                          Back
                        </button>
                        <button
                          type="button"
                          onClick={handlePlaceOrder}
                          disabled={isSubmitting || paymentLoading}
                          className="flex items-center justify-center gap-2 w-full sm:w-auto rounded-lg bg-[var(--primary-color)] px-8 py-4 text-center text-base font-bold text-white shadow-sm transition-all hover:bg-[var(--primary-color)]/90 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]/50 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {(isSubmitting || paymentLoading) ? (
                            <>
                              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Processing...
                            </>
                          ) : (
                            <>
                              Place Order
                              <Lock className="h-5 w-5" />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </section>
                )}
              </div>

              {/* Order Summary Sidebar */}
              <aside className="lg:col-span-1">
                <div className="sticky top-24 bg-[#fcfaf8] border border-[#e7d9cf] rounded-xl p-6">
                  <h2 className="text-2xl font-bold text-[#1b130d] mb-6">Order Summary</h2>
                  
                  {/* Cart Items */}
                  <div className="space-y-4 max-h-[300px] overflow-y-auto">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-20 w-20 rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-[#1b130d] truncate">{item.name}</p>
                          <p className="text-sm text-[#9a6c4c]">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-semibold text-[#1b130d] flex-shrink-0">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-[#e7d9cf] my-6"></div>

                  {/* Price Breakdown */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <p className="text-[#9a6c4c]">Subtotal</p>
                      <p className="font-medium text-[#1b130d]">₹{subtotal.toFixed(2)}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-[#9a6c4c]">Shipping</p>
                      <p className="font-medium text-[#1b130d]">₹{shipping.toFixed(2)}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-[#9a6c4c]">Taxes (8%)</p>
                      <p className="font-medium text-[#1b130d]">₹{taxes.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="border-t border-[#e7d9cf] my-6"></div>

                  {/* Total */}
                  <div className="flex justify-between items-center">
                    <p className="text-lg font-bold text-[#1b130d]">Total</p>
                    <p className="text-xl font-black text-[#1b130d]">₹{total.toFixed(2)}</p>
                  </div>

                  {/* Security Badge */}
                  <div className="mt-6 flex items-center justify-center gap-2 text-sm text-[#9a6c4c]">
                    <Lock className="h-4 w-4" />
                    <span>Secure SSL Checkout</span>
                  </div>
                </div>
              </aside>
            </main>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CheckOut;
