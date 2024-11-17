import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Customers from "./pages/Customers";
import Orders from "./pages/Orders";
import Audiences from "./pages/Audiences";

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/audiences" element={<Audiences />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
