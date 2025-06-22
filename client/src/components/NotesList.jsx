import { Link } from 'react-router-dom';
import PurchaseNote from './PurchaseNote.jsx';
const NotesList = ({ notes }) => {
  if (!notes || notes.length === 0) {
    return <p className="text-center text-gray-600">No notes available.</p>;
  }

  return (
   
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {notes.map((note) => (
        <div key={note._id} className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold">{note.title}</h3>
          <p className="text-gray-600 truncate">{note.description || 'No description'}</p>
          <p className="text-gray-600">Category: {note.category}</p>
          <p className="text-gray-600">Price: {note.price === 0 ? 'Free' : `₹${note.price}`}</p>
          <p className="text-gray-600">
            By: <Link to={`/profile/${note.authorUsername}`} className="text-blue-600 hover:underline">{note.authorUsername}</Link>
          </p>
          <div className="flex space-x-2 mt-2">
            <Link
              to={`/notes/${note._id}`}
              className="py-1 px-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              View Note
            </Link>
            {note.price > 0 && <PurchaseNote noteId={note._id} price={note.price} />}
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotesList;