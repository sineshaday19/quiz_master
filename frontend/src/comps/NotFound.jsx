import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-6xl font-bold text-orange-600">404</h1>
      <p className="text-2xl mt-4 text-gray-700">Oops! Page not found.</p>
      <p className="text-md mt-2 text-gray-500">The page you are looking for doesn’t exist.</p>
      <Link 
        to="/" 
        className="mt-6 px-6 py-2 text-white bg-orange-600 rounded-full shadow hover:bg-orange-700 transition-all">
        Go Back Home
      </Link>
    </div>
  );
}

export default NotFound;
