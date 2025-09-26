import { useState } from 'react';
import { updateAccountDetails, updateAvatar } from '../../services/api';
import Alert from '../common/Alert';

export default function EditProfileForm({ currentUser, onCancel, onSuccess }) {
    const [formData, setFormData] = useState({
        fullName: currentUser.fullName || '',
    });
    const [avatarFile, setAvatarFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleAvatarChange = (e) => setAvatarFile(e.target.files[0]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const detailsResponse = await updateAccountDetails(formData);
            let finalUser = detailsResponse.data;

            if (avatarFile) {
                const avatarData = new FormData();
                avatarData.append('avatar', avatarFile);
                const avatarResponse = await updateAvatar(avatarData);
                finalUser = avatarResponse.data;
            }
            onSuccess(finalUser);
        } catch (err) {
            console.error(err);
            setError(err.message || "Update failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-2xl font-bold text-center mb-4">Edit Profile</h2>
            {error && <Alert message={error} type="error" />}

            {/* Full Name (Editable) */}
            <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-300">Full Name</label>
                <input
                    type="text"
                    name="fullName"
                    id="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="mt-1 w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500"
                    required
                />
            </div>

            {/* Email (Read-Only) */}
            <div>
                <label className="block text-sm font-medium text-gray-300">Email</label>
                <input
                    type="email"
                    value={currentUser.email}
                    disabled
                    className="mt-1 w-full p-3 bg-gray-800 text-gray-400 border border-gray-600 rounded-lg cursor-not-allowed"
                />
            </div>

            {/* Username (Read-Only) */}
            <div>
                <label className="block text-sm font-medium text-gray-300">Username</label>
                <input
                    type="text"
                    value={currentUser.userName}
                    disabled
                    className="mt-1 w-full p-3 bg-gray-800 text-gray-400 border border-gray-600 rounded-lg cursor-not-allowed"
                />
            </div>

            {/* Avatar Upload */}
            <div>
                <label htmlFor="avatar" className="block text-sm font-medium text-gray-300">Update Avatar</label>
                <input
                    type="file"
                    id="avatar"
                    onChange={handleAvatarChange}
                    className="mt-1 w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                    accept="image/*"
                />
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                >
                    {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="w-full py-3 px-4 bg-gray-600 text-white rounded-lg hover:bg-gray-500"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}
