import { useEffect, useState } from 'react';
import { getNotes } from '../services/api';
import NotesList from './NotesList';
import { motion } from 'framer-motion';

const AllNotes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await getNotes(); // No filters to get all notes
        setNotes(response.data); // ✅ Extract data from response
      } catch (err) {
        setError(err.message || 'Failed to load notes');
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading all notes...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-black p-6">
      <motion.h1
        className="text-4xl font-extrabold text-center text-white mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        All Notes
      </motion.h1>
      <NotesList notes={notes} />
    </div>
  );
};

export default AllNotes;
