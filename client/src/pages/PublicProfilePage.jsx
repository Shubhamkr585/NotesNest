import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserByUsername, getUploadedNotes } from '../services/api';
import { useAuth } from '../context/AuthContext';
import NotesList from '../components/notes/NotesList.jsx';
import Spinner from '../components/common/Spinner.jsx';
import Alert from '../components/common/Alert.jsx';
import ProfileHeader from '../components/profile/ProfileHeader.jsx';
import EditProfileForm from '../components/profile/EditProfileForm.jsx';
import { motion } from 'framer-motion';

export default function PublicProfilePage() {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  const [profileUser, setProfileUser] = useState(null);
  const [notes, setNotes] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const [userResponse, notesResponse] = await Promise.all([
          getUserByUsername(username),
          getUploadedNotes(username),
        ]);
        setProfileUser(userResponse.data);
        setNotes(notesResponse.data);
      } catch (err) {
        setError(err.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [username]);

  const handleUpdateSuccess = (updatedUser) => {
    setProfileUser(updatedUser);
    setEditMode(false);
    if (updatedUser.userName !== username) {
        navigate(`/profile/${updatedUser.userName}`);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-900"><Spinner /></div>;
  if (error) return <div className="min-h-screen flex items-center justify-center bg-gray-900"><Alert message={error} type="error" /></div>;
  if (!profileUser) return <NotFoundPage />;

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
          {isOwnProfile && editMode ? (
            <EditProfileForm 
              currentUser={currentUser} 
              onCancel={() => setEditMode(false)}
              onSuccess={handleUpdateSuccess}
            />
          ) : (
            <ProfileHeader 
              profileUser={profileUser}
              isOwnProfile={isOwnProfile}
              onEditClick={() => setEditMode(true)}
            />
          )}
        </div>

        <div className="mt-10">
          <h3 className="text-2xl font-bold text-center mb-4 text-white">
            {isOwnProfile ? "My Uploaded Notes" : `Notes by ${profileUser.fullName}`}
          </h3>
          <NotesList notes={notes} />
        </div>
      </motion.div>
    </div>
  );
};
