import { useState } from 'react';
import { createPaymentOrder, verifyPayment, recordPaymentFailure } from '../utils/api';

/**
 * Custom hook for Razorpay payment integration
 * Handles payment flow: create order -> open checkout -> verify payment
 */
export const useRazorpay = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Initialize and process Razorpay payment
   * @param {Object} options - Payment options
   * @param {String} options.orderId - MongoDB order ID
   * @param {Number} options.amount - Amount in rupees
   * @param {String} options.name - Customer name
   * @param {String} options.email - Customer email
   * @param {String} options.phone - Customer phone
   * @param {String} options.description - Payment description
   * @param {Function} options.onSuccess - Success callback
   * @param {Function} options.onFailure - Failure callback
   */
  const processPayment = async (options) => {
    const {
      orderId,
      amount,
      name,
      email,
      phone,
      description = 'Order Payment',
      onSuccess,
      onFailure
    } = options;

    setLoading(true);
    setError(null);

    try {
      // Step 1: Create Razorpay order
      const orderResponse = await createPaymentOrder(orderId, amount);
      
      if (!orderResponse.success) {
        throw new Error(orderResponse.message || 'Failed to create payment order');
      }

      const { razorpayOrderId, amount: orderAmount, currency, keyId } = orderResponse.data;

      // Validate response data
      if (!razorpayOrderId || !orderAmount || !keyId) {
        console.error('❌ Invalid payment order response:', orderResponse);
        throw new Error('Invalid response from payment server. Missing required fields.');
      }

      // Validate Razorpay order ID format (should start with 'order_')
      if (!razorpayOrderId.startsWith('order_')) {
        console.error('❌ Invalid Razorpay order ID format:', razorpayOrderId);
        throw new Error('Invalid payment order format. Please try again.');
      }

      // Validate amount (should be positive and in paise)
      if (!orderAmount || orderAmount <= 0) {
        console.error('❌ Invalid order amount:', orderAmount);
        throw new Error('Invalid payment amount. Please contact support.');
      }

      console.log('✅ Payment order created:', {
        razorpayOrderId,
        amount: orderAmount,
        currency,
        keyId: keyId.substring(0, 15) + '...'
      });

      // Step 2: Check if Razorpay is loaded
      if (!window.Razorpay) {
        throw new Error('Razorpay SDK not loaded. Please refresh the page.');
      }

      // Step 3: Configure Razorpay checkout options
      const razorpayOptions = {
        key: keyId,
        amount: orderAmount, // Amount in paise
        currency: currency,
        name: 'CraftCurio',
        description: description,
        // Use relative path or remove if logo causes issues
        // For production with HTTPS domain:
        // image: 'https://yourdomain.com/cc_favicon.png',
        // OR keep it commented out to use Razorpay's default logo
        
        // image: '/cc_favicon.png',
        order_id: razorpayOrderId,
        prefill: {
          name: name || '',
          email: email || '',
          contact: phone || ''
        },
        theme: {
          color: '#ec6d13' // Orange theme color
        },
        handler: async function (response) {
          // Step 4: Payment successful - verify signature
          try {
            // Validate response
            if (!response.razorpay_order_id || !response.razorpay_payment_id || !response.razorpay_signature) {
              throw new Error('Invalid payment response from Razorpay');
            }

            const verificationData = {
              orderId: orderId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            };

            console.log('✅ Payment successful, verifying signature...');
            const verificationResponse = await verifyPayment(verificationData);

            if (verificationResponse.success) {
              console.log('✅ Payment verified successfully');
              setLoading(false);
              if (onSuccess) {
                onSuccess(verificationResponse.data.order);
              }
            } else {
              throw new Error(verificationResponse.message || 'Payment verification failed');
            }
          } catch (verifyError) {
            console.error('❌ Payment verification error:', verifyError);
            setError(verifyError.message || 'Payment verification failed');
            setLoading(false);
            
            if (onFailure) {
              onFailure(verifyError);
            }
          }
        },
        modal: {
          ondismiss: async function() {
            // User closed the payment modal
            setLoading(false);
            const dismissError = { description: 'Payment cancelled by user' };
            
            try {
              await recordPaymentFailure(orderId, dismissError);
            } catch (err) {
              console.error('Error recording payment cancellation:', err);
            }

            if (onFailure) {
              onFailure(dismissError);
            }
          }
        }
      };

      // Step 5: Open Razorpay checkout
      console.log('✅ Opening Razorpay checkout with order:', razorpayOrderId);
      
      try {
        const razorpayInstance = new window.Razorpay(razorpayOptions);
        
        // Handle payment failure
        razorpayInstance.on('payment.failed', async function (response) {
          // Payment failed
          const failureError = {
            code: response.error?.code || null,
            description: response.error?.description || 'Payment processing failed due to error at bank or wallet gateway',
            source: response.error?.source || 'NA',
            step: response.error?.step || 'NA',
            reason: response.error?.reason || 'NA'
          };

          console.error('❌ Payment failed:', failureError);
          setError(failureError.description || 'Payment failed');
          setLoading(false);

          try {
            await recordPaymentFailure(orderId, failureError);
          } catch (err) {
            console.error('Error recording payment failure:', err);
          }

          if (onFailure) {
            onFailure(failureError);
          }
        });

        // Handle checkout errors (including 500 errors from validate/account)
        razorpayInstance.on('error', function (error) {
          console.error('❌ Razorpay checkout error:', error);
          
          // Check for 500 error from validate/account endpoint
          let errorDescription = error.description || error.message || 'An error occurred while opening payment gateway';
          
          // Provide specific message for account validation errors
          if (error.code === 500 || error.message?.includes('validate/account') || error.message?.includes('500')) {
            errorDescription = 'Payment gateway account validation failed. Please verify your Razorpay account is activated and API keys are correct.';
            console.error('❌ Razorpay account validation error. This usually means:');
            console.error('   1. Razorpay account is not fully activated');
            console.error('   2. API keys are invalid or expired');
            console.error('   3. Account has restrictions');
            console.error('   Solution: Check Razorpay Dashboard → Settings → API Keys');
          }
          
          const checkoutError = {
            code: error.code || null,
            description: errorDescription,
            source: 'checkout',
            step: 'checkout_initialization',
            reason: error.reason || 'Unknown error'
          };
          
          setError(checkoutError.description);
          setLoading(false);
          
          if (onFailure) {
            onFailure(checkoutError);
          }
        });

        // Open the checkout
        razorpayInstance.open();
      } catch (checkoutError) {
        console.error('❌ Error initializing Razorpay checkout:', checkoutError);
        setError('Failed to initialize payment gateway. Please try again.');
        setLoading(false);
        
        if (onFailure) {
          onFailure({
            description: 'Failed to initialize payment gateway',
            reason: checkoutError.message
          });
        }
      }

    } catch (err) {
      console.error('Payment processing error:', err);
      setError(err.message || 'Failed to process payment');
      setLoading(false);

      if (onFailure) {
        onFailure(err);
      }
    }
  };

  return {
    processPayment,
    loading,
    error
  };
};

export default useRazorpay;
