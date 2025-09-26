import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getNotes } from '../services/api';
import NotesList from '../components/notes/NotesList';
import Spinner from '../components/common/Spinner';
import Alert from '../components/common/Alert';

export default function AllNotesPage() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await getNotes();
        setNotes(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load notes');
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center mb-8">
          Explore All Notes
        </h1>
        {error && <Alert message={error} type="error" />}
        <NotesList notes={notes} />
      </motion.div>
    </div>
  );
};
