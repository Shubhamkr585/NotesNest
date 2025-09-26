// import { useEffect, useState } from 'react';
// import { useParams, Link, useLocation } from 'react-router-dom';
// import { getNoteById, viewNote } from '../services/api.js';
// import { useAuth } from '../context/AuthContext.jsx';
// import Spinner from '../components/common/Spinner.jsx';
// import Alert from '../components/common/Alert.jsx';
// import PurchaseButton from '../components/notes/PurchaseButton.jsx';
// import { motion } from 'framer-motion';

// export default function ViewNotePage() {
//     const { noteId } = useParams();
//     const { user, isAuthenticated } = useAuth();
//     const [note, setNote] = useState(null);
//     const [accessUrl, setAccessUrl] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState('');
//     const location = useLocation();

//     useEffect(() => {
//         const fetchNote = async () => {
//             try {
//                 setLoading(true);
//                 const noteResponse = await getNoteById(noteId);
//                 setNote(noteResponse.data);

//                 if (isAuthenticated) {
//                     try {
//                         const viewResponse = await viewNote(noteId);
//                         setAccessUrl(viewResponse.data.fileUrl);
//                     } catch (accessError) {
//                         console.log("Access denied, needs purchase.");
//                     }
//                 }
//             } catch (err) {
//                 setError(err.message || 'Note not found');
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchNote();
//     }, [noteId, isAuthenticated]);

//     if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-900"><Spinner /></div>;
//     if (error) return <div className="min-h-screen flex items-center justify-center bg-gray-900"><Alert message={error} type="error" /></div>;
//     if (!note) return null;

//     const isOwner = user && user._id === note.uploadedBy._id;

//     return (
//         <div className="min-h-screen bg-gray-900 text-white p-8">
//             <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5 }}
//                 className="max-w-4xl mx-auto"
//             >
//                 <h1 className="text-4xl font-bold mb-2">{note.title}</h1>
//                 <p className="text-gray-400 mb-4">
//                     By <Link to={`/profile/${note.authorUsername}`} className="text-purple-400 hover:underline">{note.authorUsername}</Link>
//                 </p>
//                 <p className="text-lg mb-6">{note.description}</p>
                
//                 <div className="bg-gray-800 p-6 rounded-lg">
//                     {accessUrl || isOwner ? (
//                         <div>
//                             <h2 className="text-2xl font-bold mb-4">Note Content</h2>
//                             <a 
//                                 href={accessUrl || note.fileUrl} 
//                                 target="_blank" 
//                                 rel="noopener noreferrer"
//                                 className="inline-block bg-purple-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-purple-700 transition"
//                             >
//                                 Download PDF
//                             </a>
//                         </div>
//                     ) : (
//                         <div>
//                             <h2 className="text-2xl font-bold mb-4">Purchase to View</h2>
//                             <p className="mb-4">You need to purchase this note to access its content.</p>
//                             {isAuthenticated ? (
//                                 <PurchaseButton noteId={note._id} price={note.price} />
//                             ) : (
//                                 <Link to="/login" state={{ from: location }} className="text-purple-400 hover:underline">
//                                     Log in to purchase
//                                 </Link>
//                             )}
//                         </div>
//                     )}
//                 </div>
//             </motion.div>
//         </div>
//     );
// }

import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getNoteById } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import Spinner from '../components/common/Spinner.jsx';
import Alert from '../components/common/Alert.jsx';
import { motion } from 'framer-motion';

export default function ViewNotePage() {
  const { noteId } = useParams();
  const { user } = useAuth();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNote = async () => {
      try {
        setLoading(true);
        const noteResponse = await getNoteById(noteId);
        console.log(noteResponse.data);
        console.log(noteResponse.data.fileUrl);
        setNote(noteResponse.data);
      } catch (err) {
        setError(err.message || 'Note not found');
      } finally {
        setLoading(false);
      }
    };
    fetchNote();
  }, [noteId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <Alert message={error} type="error" />
      </div>
    );
  }

  if (!note) return null;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-4xl font-bold mb-2">{note.title}</h1>
        <p className="text-gray-400 mb-4">
          By{' '}
          <Link
            to={`/profile/${note.authorUsername}`}
            className="text-purple-400 hover:underline"
          >
            {note.authorUsername}
          </Link>
        </p>
        <p className="text-lg mb-6">{note.description}</p>

        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Note Content</h2>

          {/* Inline PDF viewer */}
          <div className="w-full h-[600px] mb-6">
            <iframe
              src={note.fileUrl}
              width="100%"
              height="100%"
              className="rounded-lg border border-gray-700"
              title="PDF Viewer"
            />
          </div>

          {/* Download button */}
          <a
            href={note.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-purple-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-purple-700 transition"
          >
            Download PDF
          </a>
        </div>
      </motion.div>
    </div>
  );
}
