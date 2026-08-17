import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import api from '../configs/axios';

/**
 * Standard Razorpay Checkout Button Component
 * Uses /api/create-order and /api/verify-payment endpoints
 */
export default function RazorpayCheckoutButton({
    amountInPaise = 50000, // Default ₹500 (50,000 paise)
    buttonText = 'Pay with Razorpay',
    className = 'bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-2 shadow-sm',
    onSuccess,
    onFailure,
}) {
    const [loading, setLoading] = useState(false);

    const handleCheckout = async () => {
        try {
            setLoading(true);
            toast.loading('Creating order...');

            // Step 1: Call backend endpoint to create order
            const { data } = await api.post('/api/create-order', {
                amount: amountInPaise,
                currency: 'INR',
                receipt: `rcpt_${Date.now()}`,
            });

            toast.dismissAll();

            if (!data.success || !data.order_id) {
                throw new Error(data.message || 'Failed to create order');
            }

            // Ensure Razorpay SDK is loaded
            if (!window.Razorpay) {
                await new Promise((resolve) => {
                    const script = document.createElement('script');
                    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
                    script.onload = () => resolve(true);
                    script.onerror = () => resolve(false);
                    document.body.appendChild(script);
                });
            }

            // Step 2: Open Razorpay modal with order_id
            const options = {
                key: data.key_id || import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: data.amount,
                currency: data.currency || 'INR',
                name: 'Razorpay Checkout',
                description: `Payment of ₹${(data.amount / 100).toFixed(2)}`,
                order_id: data.order_id,
                prefill: {
                    name: 'Customer Name',
                    email: 'customer@example.com',
                    contact: '9999999999',
                },
                theme: {
                    color: '#6366f1',
                },
                handler: async function (response) {
                    try {
                        toast.loading('Verifying payment signature...');

                        // Step 3: Call backend endpoint to verify signature
                        const verifyRes = await api.post('/api/verify-payment', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        });

                        toast.dismissAll();

                        if (verifyRes.data?.success) {
                            toast.success('Payment verified successfully!');
                            if (onSuccess) onSuccess(verifyRes.data);
                        } else {
                            toast.error(verifyRes.data?.message || 'Payment verification failed');
                            if (onFailure) onFailure(verifyRes.data);
                        }
                    } catch (verifyErr) {
                        toast.dismissAll();
                        const msg = verifyErr?.response?.data?.message || 'Verification failed';
                        toast.error(msg);
                        if (onFailure) onFailure(verifyErr);
                    } finally {
                        setLoading(false);
                    }
                },
                modal: {
                    ondismiss: function () {
                        toast.dismissAll();
                        toast('Payment modal closed by user', { icon: 'ℹ️' });
                        setLoading(false);
                    },
                },
            };

            const rzp = new window.Razorpay(options);

            // Handle payment.failed event
            rzp.on('payment.failed', function (response) {
                toast.dismissAll();
                const failMsg = response?.error?.description || 'Payment process failed';
                toast.error(failMsg);
                if (onFailure) onFailure(response.error);
                setLoading(false);
            });

            rzp.open();
        } catch (err) {
            toast.dismissAll();
            setLoading(false);
            const errMsg = err?.response?.data?.message || err.message || 'Error initializing payment';
            toast.error(errMsg);
            console.error('Checkout error:', err);
            if (onFailure) onFailure(err);
        }
    };

    return (
        <button
            onClick={handleCheckout}
            disabled={loading}
            className={`${className} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            {loading ? 'Processing...' : buttonText}
        </button>
    );
}
