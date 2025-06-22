import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createOrder, verifyPayment } from '../services/api';

const PurchaseNote = ({ noteId, price }) => {
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
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Your Razorpay key
        amount: razorpayOrder.amount,
        currency: 'INR',
        order_id: razorpayOrder.id,
        handler: async (response) => {
          try {
            await verifyPayment(response);
            navigate('/purchased-notes');
          } catch (err) {
            setError(err.message || 'Payment verification failed');
          }
        },
        theme: { color: '#1F6EF0' },
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
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        onClick={handlePurchase}
        disabled={loading}
        className="py-1 px-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
      >
        {loading ? 'Processing...' : `Buy for ₹${price}`}
      </button>
    </div>
  );
};

export default PurchaseNote;