import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createNote } from '../services/api';

const UploadNote = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'JEE',
    price: '',
    isFeatured: false,
    file: null,
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
      navigate(`/profile/${formData.userName || 'me'}`);
    } catch (err) {
      setError(err.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-purple-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6">Upload Note</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              name="title"
              id="title"
              value={formData.title}
              onChange={handleChange}
              className="mt-1 w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              id="description"
              value={formData.description}
              onChange={handleChange}
              className="mt-1 w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
            <select
              name="category"
              id="category"
              value={formData.category}
              onChange={handleChange}
              className="mt-1 w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="JEE">JEE</option>
              <option value="UPSC">UPSC</option>
            </select>
          </div>
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
            <input
              type="number"
              name="price"
              id="price"
              value={formData.price}
              onChange={handleChange}
              className="mt-1 w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              min="0"
            />
          </div>
          <div>
            <label htmlFor="isFeatured" className="flex items-center text-sm font-medium text-gray-700">
              <input
                type="checkbox"
                name="isFeatured"
                id="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
                className="mr-2"
              />
              Feature on Homepage
            </label>
          </div>
          <div>
            <label htmlFor="file" className="block text-sm font-medium text-gray-700">Note File</label>
            <input
              type="file"
              name="file"
              id="file"
              onChange={handleChange}
              className="mt-1 w-full p-3 border rounded-lg"
              accept=".pdf"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? 'Uploading...' : 'Upload Note'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadNote;