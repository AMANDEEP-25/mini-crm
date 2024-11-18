import React, { useState, useEffect } from "react";
import axios from "axios";
import OrderForm from "../components/OrderForm";

const API_URL = process.env.REACT_APP_API_URL || "/api";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrders();
    fetchCustomers();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API_URL}/orders`);
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Failed to fetch orders. Please try again.");
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await axios.get(`${API_URL}/customers`);
      setCustomers(response.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
      setError("Failed to fetch customers. Please try again.");
    }
  };

  const handleOrderSubmit = async (orderData) => {
    setError("");
    try {
      const response = await axios.post(`${API_URL}/orders`, orderData);
      setOrders([...orders, response.data]);
    } catch (error) {
      console.error("Error creating order:", error);
      setError("Failed to create order. Please try again.");
    }
  };

  return (
    <div>
      <h1>Orders</h1>
      {error && <div>{error}</div>}
      <div>
        <h2>Add Order</h2>
        <OrderForm customers={customers} onSubmit={handleOrderSubmit} />
      </div>
      <div>
        <h2>Order List</h2>
        <ul>
          {orders.map((order) => (
            <li key={order._id}>
              <strong>Customer ID: {order.customerId}</strong> - Amount: $
              {order.amount !== undefined ? order.amount.toFixed(2) : "N/A"} -
              Date:{" "}
              {order.date ? new Date(order.date).toLocaleDateString() : "N/A"}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Orders;
