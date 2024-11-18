import React, { useState, useEffect } from "react";
import axios from "axios";
import CustomerForm from "../components/CustomerForm";

const API_URL = process.env.REACT_APP_API_URL || "/api";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get(`${API_URL}/customers`);
      setCustomers(response.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
      setError("Failed to fetch customers. Please try again.");
    }
  };

  const handleCustomerSubmit = async (customerData) => {
    setError("");
    try {
      const response = await axios.post(`${API_URL}/customers`, customerData);
      setCustomers([...customers, response.data]);
    } catch (error) {
      console.error("Error creating customer:", error);
      setError("Failed to create customer. Please try again.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Customers</h1>
      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
          role="alert"
        >
          {error}
        </div>
      )}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Add Customer</h2>
        <CustomerForm onSubmit={handleCustomerSubmit} />
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-2">Customer List</h2>
        <ul className="space-y-2">
          {customers.map((customer) => (
            <li key={customer._id} className="border p-2 rounded">
              <strong>{customer.name}</strong> - {customer.email}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Customers;
