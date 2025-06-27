import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createNote } from '../services/api';
import { motion } from 'framer-motion';

const UploadNote = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'JEE',
    price: '',
    isFeatured: false,
    file: null,
    cover: null,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));
    try {
      await createNote(data);
      navigate(`/profile/me`);
    } catch (err) {
      setError(err.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-6">
      <motion.form
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        onSubmit={handleSubmit}
        className="bg-gray-800 text-white p-8 rounded-2xl shadow-2xl w-full max-w-2xl"
      >
        <h2 className="text-3xl font-bold text-center text-white mb-6">Upload Your Note</h2>
        {error && <p className="text-red-400 text-center mb-4">{error}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-300">Title</label>
            <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} required className="mt-1 w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500" />
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-300">Category</label>
            <select name="category" id="category" value={formData.category} onChange={handleChange} className="mt-1 w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500">
              <option value="JEE">JEE</option>
              <option value="UPSC">UPSC</option>
              <option value="NEET">NEET</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-300">Description</label>
            <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows={3} className="mt-1 w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500" />
          </div>
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-300">Price (₹)</label>
            <input type="number" name="price" id="price" value={formData.price} onChange={handleChange} min="0" className="mt-1 w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500" />
          </div>
          <div className="flex items-center space-x-2 mt-2">
            <input type="checkbox" name="isFeatured" id="isFeatured" checked={formData.isFeatured} onChange={handleChange} className="h-4 w-4 text-purple-600" />
            <label htmlFor="isFeatured" className="text-sm font-medium text-gray-300">Feature on Homepage</label>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="file" className="block text-sm font-medium text-gray-300">Upload PDF File</label>
            <input type="file" name="file" id="file" accept=".pdf" onChange={handleChange} required className="mt-1 w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white" />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="cover" className="block text-sm font-medium text-gray-300">Upload Cover Image</label>
            <input type="file" name="cover" id="cover" accept="image/*" onChange={handleChange} className="mt-1 w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white" />
          </div>
        </div>

        <button type="submit" disabled={loading} className="w-full mt-6 py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition">
          {loading ? 'Uploading...' : 'Upload Note'}
        </button>
      </motion.form>
    </div>
  );
};

export default UploadNote;
