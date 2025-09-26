import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PurchaseButton from './PurchaseButton';

export default function NoteCard({ note, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-[#1f1f2e] text-white p-5 rounded-xl shadow-lg border border-gray-700 hover:border-purple-500 transition-all flex flex-col"
    >
      {note.coverImageUrl && (
        <img
          src={note.coverImageUrl}
          alt={`${note.title} cover`}
          className="w-full h-40 object-cover rounded-lg mb-4"
          onError={(e) => { e.target.style.display = 'none'; }}
        />
      )}
      <div className="flex-grow">
        <h3 className="text-xl font-bold text-white mb-1 truncate">{note.title}</h3>
        <p className="text-gray-400 mb-2 h-12 overflow-hidden">{note.description || 'No description'}</p>
        <p className="text-sm text-gray-500">Category: {note.category}</p>
        <p className="text-lg font-semibold text-purple-400 my-2">
          {note.price === 0 ? 'Free' : `₹${note.price}`}
        </p>
        {note.authorUsername && (
            <p className="text-sm text-gray-500">
                By: <Link to={`/profile/${note.authorUsername}`} className="text-pink-400 hover:underline">{note.authorUsername}</Link>
            </p>
        )}
      </div>
      <div className="flex space-x-3 mt-4">
        <Link
          to={`/notes/${note._id}`}
          className="py-2 px-4 flex-1 text-center rounded-lg bg-gray-600 text-white font-semibold hover:bg-gray-500 transition"
        >
          View Details
        </Link>
        {note.price > 0 && (
          <PurchaseButton noteId={note._id} price={note.price} />
        )}
      </div>
    </motion.div>
  );
}
