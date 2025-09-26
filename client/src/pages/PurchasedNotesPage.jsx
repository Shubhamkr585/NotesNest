import { useEffect, useState } from 'react';
import { getPurchasedNotes } from '../services/api';
import NotesList from '../components/notes/NotesList.jsx';
import Spinner from '../components/common/Spinner.jsx';
import Alert from '../components/common/Alert.jsx';
import { motion } from 'framer-motion';

export default function PurchasedNotesPage() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await getPurchasedNotes();
        setNotes(response.data);
      } catch (err) {
        setError(err.message || 'Failed to fetch purchased notes');
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-900"><Spinner /></div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a23] via-[#1a1a2e] to-black text-white p-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        <h2 className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-400 mb-8">
          My Purchased Notes
        </h2>
        {error && <Alert message={error} type="error" />}
        {notes.length === 0 && !loading ? (
          <p className="text-center text-gray-400">You haven't purchased any notes yet.</p>
        ) : (
          <NotesList notes={notes} />
        )}
      </motion.div>
    </div>
  );
};
