import { motion } from 'framer-motion';
import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thanks for reaching out! 🚀'); // Replace with actual form logic
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-bl from-black via-[#12121a] to-gray-900 px-6 py-12">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-[#1a1a2e] p-8 rounded-2xl shadow-xl max-w-xl w-full space-y-6 text-white"
      >
        <h2 className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-400">
          Get in Touch 💌
        </h2>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Your Name"
          required
          className="w-full p-3 bg-[#2b2b3c] rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Your Email"
          required
          className="w-full p-3 bg-[#2b2b3c] rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Your Message"
          rows="5"
          required
          className="w-full p-3 bg-[#2b2b3c] rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        ></textarea>
        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-lg font-bold hover:opacity-90 transition duration-300"
        >
          Send Message
        </button>
      </motion.form>
    </div>
  );
}