import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getNoteById, viewNote, getPurchasedNotes, getCurrentUser } from '../services/api';
import PurchaseNote from './PurchaseNote.jsx';

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
      // Simulate ad viewing for free notes
      if (note.price === 0 && !adViewed) {
       setAdViewed(true)
        // Mock ad viewing logic
        // In a real application, you would integrate with an ad service here;
        // Replace with AdSense SDK in production
        await new Promise((resolve, reject) => setTimeout(resolve, 3000)); // 3-second mock ad
      }
      const response = await viewNote(noteId); 
      setFileUrl(response.fileUrl);
      setAdViewed(true);
    } catch (err) {
      setError(err.message || 'Failed to view note');
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500 text-center">{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-purple-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6">{note?.title || 'Loading...'}</h2>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <p className="text-gray-600 mb-2">{note.description || 'No description available'}</p>
          <p className="text-gray-600 mb-2">Category: {note?.category || 'JEE'  }</p>
          <p className="text-gray-600 mb-2">Price: {note.price === 0 ? 'Free' : `₹${note.price}`}</p>
         <p className="text-gray-600 mb-2">
  <Link to={`/profile/${note?.authorUsername || ''}`} className="text-blue-600 hover:underline">
    By: {note?.authorUsername || 'Unknown'}
  </Link>
</p>
          {user ? (
            <>
              {fileUrl && (isPurchased || (note.price === 0 && adViewed)) ? (
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Download Note
                </a>
              ) : (
                <div className="mt-4 flex space-x-2">
                  {note.price > 0 && !isPurchased ? (
                    <PurchaseNote noteId={noteId} price={note.price} />
                  ) : (
                    <button
                      onClick={handleViewNote}
                      className="py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      disabled={loading}
                    >
                      {loading ? 'Processing...' : 'View ad Note to view ad'}
                    </button>
                  )}
                </div>
              )}
            </>
          ) : (
            <Link
              to="/login"
              state={{ from: `/notes/${noteId}` }}
              className="mt-4 inline-block py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Log in to View Note
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewNote;