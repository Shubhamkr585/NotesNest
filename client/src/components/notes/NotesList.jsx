import NoteCard from './NoteCard';

export default function NotesList({ notes }) {
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
        <NoteCard key={note._id} note={note} index={index} />
      ))}
    </div>
  );
};