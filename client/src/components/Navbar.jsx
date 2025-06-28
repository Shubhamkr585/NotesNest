import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCurrentUser, logout } from '../services/api';
import { motion } from 'framer-motion';
import PublicProfile from './PublicProfile';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getCurrentUser();
        setUser(response.data || response);
      } catch (err) {
        setUser(null);
        console.error('Failed to fetch user:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      navigate('/');
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

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Menu Items */}
        <ul className={`flex-col md:flex-row md:flex space-y-2 md:space-y-0 md:space-x-4 absolute md:static top-16 left-0 w-full md:w-auto bg-gray-800 md:bg-transparent p-4 md:p-0 z-50 transition-all duration-300 ease-in-out ${menuOpen ? 'flex' : 'hidden md:flex'}`}>
          <li>
            <Link to="/" className="hover:underline" onClick={() => setMenuOpen(false)}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/notes" className="hover:underline" onClick={() => setMenuOpen(false)}>
              All Notes
            </Link>
          </li>
          {loading ? null : user ? (
            <>
              {user.role === 'seller' && (
                <li>
                  <Link to="/upload" className="hover:underline" onClick={() => setMenuOpen(false)}>
                    Upload Note
                  </Link>
                </li>
              )}
              <li>
                <Link to={`/profile/${user.userName}`} className="hover:underline" onClick={() => setMenuOpen(false)}>
                  {user.fullName || 'Profile'}
                </Link>
              </li>
              <li>
                <Link to="/purchased-notes" className="hover:underline" onClick={() => setMenuOpen(false)}>
                  My Purchases
                </Link>
              </li>
              <li>
                <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="hover:underline">
                  Log Out
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" className="hover:underline" onClick={() => setMenuOpen(false)}>
                  Log In
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:underline" onClick={() => setMenuOpen(false)}>
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
