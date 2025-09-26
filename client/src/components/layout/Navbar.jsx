import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    setMenuOpen(false);
    navigate('/');
  };

  const navLinkClass = ({ isActive }) => 
    `block py-2 px-3 rounded md:p-0 ${isActive ? 'text-white bg-purple-700 md:bg-transparent md:text-purple-400' : 'text-gray-300 hover:bg-gray-700 md:hover:bg-transparent md:hover:text-white'}`;

  return (
    <nav className="bg-gray-800 text-white p-4 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-white">
          NotesNest
        </Link>

        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <motion.div 
          className={`absolute md:static top-16 left-0 w-full md:w-auto bg-gray-800 md:bg-transparent transition-all duration-300 ease-in-out md:flex ${menuOpen ? 'block' : 'hidden'}`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <ul className="flex flex-col p-4 md:p-0 md:flex-row md:space-x-8 font-medium">
            <li><NavLink to="/" className={navLinkClass} onClick={() => setMenuOpen(false)}>Home</NavLink></li>
            <li><NavLink to="/notes" className={navLinkClass} onClick={() => setMenuOpen(false)}>All Notes</NavLink></li>
            {user ? (
              <>
                {user.role === 'seller' && <li><NavLink to="/upload" className={navLinkClass} onClick={() => setMenuOpen(false)}>Upload</NavLink></li>}
                <li><NavLink to="/purchased-notes" className={navLinkClass} onClick={() => setMenuOpen(false)}>My Purchases</NavLink></li>
                <li><NavLink to={`/profile/${user.userName}`} className={navLinkClass} onClick={() => setMenuOpen(false)}>Profile</NavLink></li>
               <li>
  <button 
    onClick={handleLogout} 
    className="py-2 px-3 rounded md:p-0 text-gray-300 hover:bg-gray-700 md:hover:bg-transparent md:hover:text-white"
  >
    Logout
  </button>
</li>

              </>
            ) : (
              <>
                <li><NavLink to="/login" className={navLinkClass} onClick={() => setMenuOpen(false)}>Login</NavLink></li>
                <li><NavLink to="/register" className={navLinkClass} onClick={() => setMenuOpen(false)}>Register</NavLink></li>
              </>
            )}
          </ul>
        </motion.div>
      </div>
    </nav>
  );
};