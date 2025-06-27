import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getNoteById, viewNote, getPurchasedNotes, getCurrentUser } from '../services/api';
import PurchaseNote from './PurchaseNote.jsx';
import { motion } from 'framer-motion';

const ViewNote = () => {
  const { noteId } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [user, setUser] = useState(null);
  const [isPurchased, setIsPurchased] = useState(false);
  const [fileUrl, setFileUrl] = useState('');
  const [adViewed, setAdViewed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [noteResponse, userResponse, purchasedResponse] = await Promise.all([
          getNoteById(noteId),
          getCurrentUser().catch(() => null),
          getPurchasedNotes().catch(() => []),
        ]);
        setNote(noteResponse.data);
        setUser(userResponse?.data || null);
        setIsPurchased(purchasedResponse.data.some((n) => n._id === noteId));
      } catch (err) {
        setError(err.message || 'Failed to load note');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [noteId]);

  const handleViewNote = async () => {
    if (!user) {
      navigate('/login', { state: { from: `/notes/${noteId}` } });
      return;
    }
    if (note.price > 0 && !isPurchased) {
      setError('Please purchase the note to access it');
      return;
    }

    try {
      setLoading(true);
      setError('');
      if (note.price === 0 && !adViewed) {
        setAdViewed(true);
        await new Promise((resolve) => setTimeout(resolve, 3000)); // Simulated ad
      }
      const response = await viewNote(noteId);
      setFileUrl(response.fileUrl);
      setAdViewed(true);
    } catch (err) {
      setError(err.message || 'Failed to view note');
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Loading...
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-red-500 text-center">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a23] via-[#12122b] to-black text-white p-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-400 mb-6">
          {note?.title || 'Loading...'}
        </h2>

        {note?.coverImageUrl && (
          <img
            src={note.coverImageUrl}
            alt="Note Cover"
            className="w-full max-h-96 object-cover rounded-xl mb-4 border border-gray-600"
          />
        )}

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-[#1f1f2e] p-6 rounded-2xl shadow-lg border border-gray-700"
        >
          <p className="text-gray-300 mb-2">{note.description || 'No description available'}</p>
          <p className="text-gray-400 mb-2">Category: {note?.category || 'JEE'}</p>
          <p className="text-gray-400 mb-2">
            Price: {note.price === 0 ? 'Free' : `₹${note.price}`}
          </p>
          <p className="text-gray-400 mb-4">
            By:{' '}
            <Link
              to={`/profile/${note?.authorUsername || ''}`}
              className="text-pink-400 hover:underline"
            >
              {note?.authorUsername || 'Unknown'}
            </Link>
          </p>

          {user ? (
            <>
              {fileUrl && (isPurchased || (note.price === 0 && adViewed)) ? (
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  Download Note
                </a>
              ) : (
                <div className="mt-4 flex space-x-3">
                  {note.price > 0 && !isPurchased ? (
                    <PurchaseNote noteId={noteId} price={note.price} />
                  ) : (
                    <button
                      onClick={handleViewNote}
                      className="py-2 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition"
                      disabled={loading}
                    >
                      {loading ? 'Processing...' : 'View Ad to Access'}
                    </button>
                  )}
                </div>
              )}
            </>
          ) : (
            <Link
              to="/login"
              state={{ from: `/notes/${noteId}` }}
              className="mt-4 inline-block py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Log in to View Note
            </Link>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ViewNote;
