import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCurrentUser, logout } from '../services/api';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      navigate('/login');
    } catch {
      alert('Logout failed');
    }
  };

  return (
    <nav className="bg-gray-800 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          Notes Platform
        </Link>
        <div className="space-x-4">
          {loading ? null : user ? (
            <>
              <Link to="/dashboard" className="hover:underline">
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="hover:underline"
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link to="/register" className="hover:underline">
                Register
              </Link>
              <Link to="/login" className="hover:underline">
                Log In
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;