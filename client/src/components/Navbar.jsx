import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCurrentUser, logout } from '../services/api';
import { motion } from 'framer-motion';
import PublicProfile from './PublicProfile';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getCurrentUser();
        setUser(response.data || response); // Handle response based on your API structure
      } catch (err) {
        setUser(null);
        console.error('Failed to fetch user:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []); // Removed navigate from dependencies to avoid unnecessary re-renders

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      navigate('/'); // Redirect to home page after logout
    } catch (err) {
      console.error('Logout failed:', err.message);
      alert('Logout failed');
    }
  };

  return (
    <nav className="bg-gray-800 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          NotesNest
        </Link>
        <ul className="flex space-x-4">
          <li>
            <Link to="/" className="hover:underline">
              Home
            </Link>
          </li>
          <li>
            <Link to="/notes" className="hover:underline">
              All Notes
            </Link>
          </li>
          {loading ? null : user ? (
            <>
              {user.role === 'seller' && (
                <li>
                  <Link to="/upload" className="hover:underline">
                    Upload Note
                  </Link>
                </li>
              )}
              <li>
                <Link to={`/profile/${user.userName}`} className="hover:underline">
                  {user.fullName || 'Profile'}
                </Link>
              </li>
              <li>
                <Link to="/purchased-notes" className="hover:underline">
                  My Purchases
                </Link>
              </li>
              <li>
                <button onClick={handleLogout} className="hover:underline">
                  Log Out
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" className="hover:underline">
                  Log In
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:underline">
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;