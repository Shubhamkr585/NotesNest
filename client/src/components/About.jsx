import { motion } from 'framer-motion';

export default function About() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-[#0f0f1f] to-black px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-3xl text-center text-white space-y-6"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-400">
          Welcome to NotesNest 🪶
        </h1>
        <p className="text-lg md:text-xl leading-relaxed text-gray-300">
          NotesNest is your intelligent companion for organizing and securing your thoughts.
          Whether you're jotting down ideas or creating long-term plans, our intuitive interface
          ensures a seamless and delightful note-taking experience.
        </p>
        <p className="text-lg md:text-xl leading-relaxed text-gray-300">
          With support for avatars, token-based authentication, and smooth UI transitions,
          NotesNest redefines how modern note apps should feel — fast, reliable, and elegant.
        </p>
      </motion.div>
    </div>
  );
}
