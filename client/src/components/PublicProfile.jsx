import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getUserByUsername,
  getUploadedNotes,
  getCurrentUser,
  updateAccountDetails,
  updateAvatar,
} from '../services/api';
import NotesList from './NotesList.jsx';
import PurchasedNotes from './PurchasedNotes.jsx';
import { motion } from 'framer-motion';

const PublicProfile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [profileUser, setProfileUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [notes, setNotes] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ fullName: '', email: '', userName: '' });
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userResponse, notesResponse, currentUserResponse] = await Promise.all([
          getUserByUsername(username),
          getUploadedNotes(username),
          getCurrentUser().catch(() => null),
        ]);
        setProfileUser(userResponse.data);
        setNotes(
          notesResponse.data.map((note) => ({
            ...note,
            authorUsername: userResponse.data.userName,
          }))
        );
        setCurrentUser(currentUserResponse?.data || null);
        if (currentUserResponse?.data?.userName === username) {
          setFormData({
            fullName: userResponse.data.fullName,
            email: currentUserResponse.data.email,
            userName: userResponse.data.userName,
          });
        }
      } catch (err) {
        setError(err.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [username]);

  const handleEditChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAvatarChange = (e) => setAvatar(e.target.files[0]);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await updateAccountDetails(formData);
      if (avatar) {
        const avatarData = new FormData();
        avatarData.append('avatar', avatar);
        await updateAvatar(avatarData);
      }
      const updatedUser = await getUserByUsername(formData.userName);
      setProfileUser(updatedUser.data);
      setEditMode(false);
      navigate(`/profile/${formData.userName}`);
    } catch (err) {
      setError(err.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 text-center">
        {error}
      </div>
    );

  const isOwnProfile = currentUser && currentUser.userName === profileUser.userName;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto"
      >
        <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
          <h2 className="text-3xl font-bold text-center text-white mb-6">
            {profileUser.fullName} (@{profileUser.userName})
          </h2>

          {isOwnProfile && editMode ? (
            <form onSubmit={handleEditSubmit} className="space-y-4">
              {['fullName', 'email', 'userName'].map((field) => (
                <div key={field}>
                  <label htmlFor={field} className="block text-sm font-medium text-gray-300 capitalize">
                    {field.replace('userName', 'Username')}
                  </label>
                  <input
                    type={field === 'email' ? 'email' : 'text'}
                    name={field}
                    id={field}
                    value={formData[field]}
                    onChange={handleEditChange}
                    className="mt-1 w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
              ))}
              <div>
                <label htmlFor="avatar" className="block text-sm font-medium text-gray-300">
                  Update Avatar
                </label>
                <input
                  type="file"
                  id="avatar"
                  onChange={handleAvatarChange}
                  className="mt-1 w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg"
                  accept="image/*"
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => setEditMode(false)}
                  className="w-full py-3 px-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center space-y-4">
              {profileUser.avatar && (
                <img
                  src={profileUser.avatar}
                  alt="avatar"
                  className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-purple-600 shadow-lg"
                />
              )}
              <h3 className="text-xl font-bold">{profileUser.fullName}</h3>
              <p className="text-purple-400">Username: {profileUser.userName}</p>
              <p className="text-purple-400">Role: {profileUser.role}</p>
              {isOwnProfile && (
                <button
                  onClick={() => setEditMode(true)}
                  className="mt-2 py-2 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Edit Profile
                </button>
              )}
            </div>
          )}
        </div>

        <div className="mt-10">
          <h3 className="text-2xl font-bold text-center mb-4 text-white">Uploaded Notes</h3>
          <NotesList notes={notes} />
        </div>

        {isOwnProfile && (
          <div className="mt-10">
            <h3 className="text-2xl font-bold text-center mb-4 text-white">Your Purchased Notes</h3>
            <PurchasedNotes />
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default PublicProfile;
