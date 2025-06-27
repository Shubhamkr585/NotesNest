import { Link } from 'react-router-dom';
import PurchaseNote from './PurchaseNote.jsx';
import { motion } from 'framer-motion';

const NotesList = ({ notes }) => {
  if (!notes || notes.length === 0) {
    return (
      <p className="text-center text-gray-400 text-lg">
        No notes available.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {notes.map((note, index) => (
        <motion.div
          key={note._id}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="bg-[#1f1f2e] text-white p-5 rounded-xl shadow-md border border-gray-700 hover:shadow-lg transition"
        >
          {/* ✅ Cover Image if exists */}
          {note.coverImageUrl && (
            <img
              src={note.coverImageUrl}
              alt="Cover"
              className="w-full h-40 object-cover rounded-lg mb-4"
            />
          )}

          <h3 className="text-lg font-bold text-gradient bg-gradient-to-r from-purple-400 via-pink-500 to-red-400 bg-clip-text text-transparent">
            {note.title}
          </h3>
          <p className="text-gray-400 mt-1 truncate">
            {note.description || 'No description'}
          </p>
          <p className="text-gray-500 mt-1">Category: {note.category}</p>
          <p className="text-gray-500">
            Price: {note.price === 0 ? 'Free' : `₹${note.price}`}
          </p>
          <p className="text-gray-500">
            By:{' '}
            <Link
              to={`/profile/${note.authorUsername}`}
              className="text-pink-400 hover:underline"
            >
              {note.authorUsername}
            </Link>
          </p>

          <div className="flex space-x-3 mt-4">
            <Link
              to={`/notes/${note._id}`}
              className="py-2 px-4 rounded-lg bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white font-semibold hover:opacity-90 transition"
            >
              View Note
            </Link>
            {note.price > 0 && (
              <PurchaseNote noteId={note._id} price={note.price} />
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default NotesList;
