import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPurchasedNotes } from '../services/api';
import NotesList from './NotesList.jsx';

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

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div>
      {notes.length === 0 ? (
        <p className="text-center text-gray-600">No purchased notes.</p>
      ) : (
        <NotesList notes={notes} />
      )}
    </div>
  );
};

export default PurchasedNotes;