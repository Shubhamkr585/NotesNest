import { useEffect, useState } from 'react';
import { getCurrentUser, getNotes } from '../services/api';
import NotesList from './NotesList.jsx';
import { motion } from 'framer-motion';

const Home = () => {
  const [user, setUser] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userResponse, notesResponse] = await Promise.all([
          getCurrentUser().catch(() => null),
          getNotes({ isFeatured: true }),
        ]);
        setUser(userResponse?.data || null);
        setNotes(notesResponse.data);
      } catch (err) {
        setError(err.message || 'Failed to load notes');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-[#0f0f1f] to-black text-white">
        Loading...
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-[#0f0f1f] to-black text-red-500">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a23] via-[#12122b] to-black text-white px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="max-w-4xl mx-auto text-center"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-400 mb-6">
          {user ? `Welcome, ${user.fullName}!` : 'Explore JEE & UPSC Notes'}
        </h1>
        <p className="text-lg md:text-xl text-gray-300 mb-10">
          {user
            ? 'Browse featured notes or upload your own.'
            : 'Sign up to access full notes and start learning.'}
        </p>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <NotesList notes={notes} />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Home;
