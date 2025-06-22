import { useEffect, useState } from 'react';
import { getCurrentUser, getNotes } from '../services/api';
import NotesList from './NotesList.jsx';

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

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-purple-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-6">
          {user ? `Welcome, ${user.fullName}!` : 'Explore JEE & UPSC Notes'}
        </h1>
        <p className="text-center text-gray-600 mb-8">
          {user ? 'Browse featured notes or upload your own.' : 'Sign up to access full notes and start learning.'}
        </p>
        <NotesList notes={notes} />
      </div>
    </div>
  );
};

export default Home;