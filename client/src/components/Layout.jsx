import { useEffect, useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { getCurrentUser, logout } from '../services/api';

const Layout = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getCurrentUser();
        setUser(response.user);
      } catch (err) {
        setUser(null);
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
    }
  };

  return (
    <div>
      <nav className="bg-gray-800 text-white p-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <Link to="/" className="text-xl font-bold">Notes Seller</Link>
          <ul className="flex space-x-4">
            <li><Link to="/" className="hover:underline">Home</Link></li>
            <li><Link to="/notes" className="hover:underline">All Notes</Link></li>
            {user ? (
              <>
                {user.role === 'seller' && (
                  <li><Link to="/upload" className="hover:underline">Upload Note</Link></li>
                )}
                <li><Link to={`/profile/${user.userName}`} className="hover:underline">{user.fullName}</Link></li>
                <li><Link to="/purchased-notes" className="hover:underline">My Purchases</Link></li>
                <li>
                  <button onClick={handleLogout} className="hover:underline">Log Out</button>
                </li>
              </>
            ) : (
              <>
                <li><Link to="/login" className="hover:underline">Log In</Link></li>
                <li><Link to="/register" className="hover:underline">Register</Link></li>
              </>
            )}
          </ul>
        </div>
      </nav>
      <main className="p-4">
        <Outlet />
      </main>
      <footer className="bg-gray-800 text-white p-4 text-center">
        © 2025 Notes Selling Platform
      </footer>
    </div>
  );
};

export default Layout;