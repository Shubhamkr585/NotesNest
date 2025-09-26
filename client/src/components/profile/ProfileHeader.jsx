export default function ProfileHeader({ profileUser, isOwnProfile, onEditClick }) {
    return (
        <div className="text-center space-y-4">
            {profileUser.avatar && (
                <img
                    src={profileUser.avatar}
                    alt="avatar"
                    className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-purple-600 shadow-lg"
                />
            )}
            <h2 className="text-3xl font-bold text-white">{profileUser.fullName}</h2>
            <p className="text-purple-400">@{profileUser.userName}</p>
            <p className="text-gray-400 capitalize">Role: {profileUser.role}</p>
            {isOwnProfile && (
                <button
                    onClick={onEditClick}
                    className="mt-2 py-2 px-6 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                    Edit Profile
                </button>
            )}
        </div>
    );
}