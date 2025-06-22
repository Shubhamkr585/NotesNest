import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserByUsername, getUploadedNotes, getCurrentUser, updateAccountDetails, updateAvatar } from '../services/api';
import NotesList from './NotesList.jsx';
import PurchasedNotes from './PurchasedNotes.jsx';

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
        setNotes(notesResponse.data.map(note => ({ ...note, authorUsername: userResponse.data.userName })));
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

  const handleEditChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    setAvatar(e.target.files[0]);
  };

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

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;

  const isOwnProfile = currentUser && currentUser.userName === profileUser.userName;

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-purple-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6">
          {profileUser.fullName} (@{profileUser.userName})
        </h2>
        <div className="bg-white p-6 rounded-xl shadow-md mb-8">
          {isOwnProfile && editMode ? (
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  id="fullName"
                  value={formData.fullName}
                  onChange={handleEditChange}
                  className="mt-1 w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleEditChange}
                  className="mt-1 w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="userName" className="block text-sm font-medium text-gray-700">Username</label>
                <input
                  type="text"
                  name="userName"
                  id="userName"
                  value={formData.userName}
                  onChange={handleEditChange}
                  className="mt-1 w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="avatar" className="block text-sm font-medium text-gray-700">Update Avatar</label>
                <input
                  type="file"
                  name="avatar"
                  id="avatar"
                  onChange={handleAvatarChange}
                  className="mt-1 w-full p-3 border rounded-lg"
                  accept="image/*"
                />
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
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
                  alt={`${profileUser.fullName}'s avatar`}
                  className="w-24 h-24 rounded-full mx-auto object-cover mb-4"
                />
              )}
              <h3 className="text-xl font-bold">{profileUser.fullName}</h3>
              <p className="text-gray-600">Username: {profileUser.userName}</p>
              <p className="text-gray-600">Role: {profileUser.role}</p>
              {isOwnProfile && (
                <button
                  onClick={() => setEditMode(true)}
                  className="py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Edit Profile
                </button>
              )}
            </div>
          )}
        </div>
        <h3 className="text-2xl font-bold text-center text-gray-800 mb-4">Uploaded Notes</h3>
        <NotesList notes={notes} />
        {isOwnProfile && (
          <>
            <h3 className="text-2xl font-bold text-center text-gray-800 mb-4 mt-8">Your Purchased Notes</h3>
            <PurchasedNotes />
          </>
        )}
      </div>
    </div>
  );
};

export default PublicProfile;