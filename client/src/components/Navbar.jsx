import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          Notes Platform
        </Link>
        <div className="space-x-4">
          <Link to="/register" className="hover:underline">
            Register
          </Link>
          <Link to="/login" className="hover:underline">
            Log In
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;