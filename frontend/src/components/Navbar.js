import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-xl font-bold">
          CRM System
        </Link>
        <ul className="flex space-x-4">
          <li>
            <Link to="/" className="text-white hover:text-gray-300">
              Home
            </Link>
          </li>
          <li>
            <Link to="/customers" className="text-white hover:text-gray-300">
              Customers
            </Link>
          </li>
          <li>
            <Link to="/orders" className="text-white hover:text-gray-300">
              Orders
            </Link>
          </li>
          <li>
            <Link to="/audiences" className="text-white hover:text-gray-300">
              Audiences
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
