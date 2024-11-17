import React from "react";
import { Link } from "react-router-dom";

const Navbar = ({ onLogout }) => {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/customers">Customers</Link>
        </li>
        <li>
          <Link to="/orders">Orders</Link>
        </li>
        <li>
          <Link to="/create-campaign">Create Campaign</Link>
        </li>
        <li>
          <Link to="/campaign-history">Campaign History</Link>
        </li>
        <li>
          <Link to="/past-campaigns">Past Campaigns</Link>
        </li>
        <li>
          <button onClick={onLogout}>Logout</button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
