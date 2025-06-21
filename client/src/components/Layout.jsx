// src/components/Layout.jsx
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div>
      <nav className="bg-gray-800 text-white p-4">
        <ul className="flex space-x-4">
          <li><a href="/" className="hover:underline">Home</a></li>
          <li><a href="/dashboard" className="hover:underline">Dashboard</a></li>
          <li><a href="/login" className="hover:underline">Login</a></li>
          <li><a href="/register" className="hover:underline">Register</a></li>
        </ul>
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