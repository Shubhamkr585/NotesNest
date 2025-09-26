import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createOrder, verifyPayment } from '../../services/api';
import Alert from '../common/Alert';

export default function PurchaseButton({ noteId, price }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handlePurchase = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await createOrder({ noteId });
      const { razorpayOrder } = response.data;
      
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: 'INR',
        name: 'NotesNest',
        description: 'Note Purchase',
        order_id: razorpayOrder.id,
        handler: async (paymentResponse) => {
          try {
            await verifyPayment(paymentResponse);
            navigate('/purchased-notes');
          } catch (err) {
            setError(err.message || 'Payment verification failed');
          }
        },
        theme: {
            color: '#8A2BE2'
        }
      };
      
      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      setError(err.message || 'Failed to initiate payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && <Alert message={error} type="error" />}
      <button
        onClick={handlePurchase}
        disabled={loading}
        className="py-2 px-4 flex-1 text-center rounded-lg bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white font-semibold hover:opacity-90 disabled:opacity-50 transition"
      >
        {loading ? 'Processing...' : `Buy for ₹${price}`}
      </button>
    </div>
  );
};