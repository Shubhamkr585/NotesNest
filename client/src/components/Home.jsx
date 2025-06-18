import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 to-purple-200 flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-5xl font-extrabold text-gray-800 mb-6 sm:text-6xl">
        Welcome to Notes Selling Platform
      </h1>
      <p className="text-lg text-gray-600 mb-8 max-w-2xl">
        Discover and share high-quality JEE and UPSC notes. Buy, sell, or view notes for free with our ad-supported model.
      </p>
      <div className="space-x-4">
        <Link
          to="/register"
          className="inline-block py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition duration-300"
        >
          Get Started
        </Link>
        <Link
          to="/login"
          className="inline-block py-3 px-6 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:ring-4 focus:ring-gray-300 transition duration-300"
        >
          Log In
        </Link>
      </div>
    </div>
  );
};

export default Home;