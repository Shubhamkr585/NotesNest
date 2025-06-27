import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPurchasedNotes } from '../services/api';
import NotesList from './NotesList.jsx';
import { motion } from 'framer-motion';

const PurchasedNotes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await getPurchasedNotes();
        setNotes(response.data.map(note => ({ ...note, authorUsername: null })));
      } catch (err) {
        setError(err.message || 'Failed to fetch purchased notes');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, [navigate]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Loading purchased notes...
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-red-500 text-center">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a23] via-[#1a1a2e] to-black text-white p-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        <h2 className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-400 mb-8">
          Purchased Notes
        </h2>
        {notes.length === 0 ? (
          <p className="text-center text-gray-400">You haven't purchased any notes yet.</p>
        ) : (
          <NotesList notes={notes} />
        )}
      </motion.div>
    </div>
  );
};

export default PurchasedNotes;
