import React from 'react';

const Navbar = () => {
  return (
    <nav className="w-full bg-gray-800 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl">Dashboard Overview</h1>
      <div>
        <span>System Status:</span>
        <span className="ml-2 h-3 w-3 bg-green-500 rounded-full inline-block"></span>
        <span className="ml-1">Online</span>
      </div>
    </nav>
  );
};

export default Navbar;