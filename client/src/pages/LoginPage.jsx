import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { login } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import Alert from '../components/common/Alert';

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { refetchUser } = useAuth();
  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(formData);
      await refetchUser();
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0a23] via-[#1a1a2e] to-black text-white px-4">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-[#1f1f2e] p-8 rounded-xl shadow-2xl w-full max-w-md"
      >
        <h2 className="text-3xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-400 mb-6">
          Log In
        </h2>
        {error && <Alert message={error} type="error" />}
        <div className="space-y-4 mt-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 w-full p-3 bg-[#2b2b3c] border border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 w-full p-3 bg-[#2b2b3c] border border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 transition"
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </div>

        <p className="mt-3 text-center text-sm text-gray-400">
          <Link to="/forgot-password" className="text-pink-400 hover:underline">
            Forgot your password?
          </Link>
        </p>

        <p className="mt-4 text-center text-gray-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-pink-400 hover:underline">Register</Link>
        </p>
      </motion.form>
    </div>
  );
};
