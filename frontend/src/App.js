import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api";

function App() {
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [newOrder, setNewOrder] = useState({
    customer: "",
    product: "",
    quantity: 0,
    totalPrice: 0,
  });

  useEffect(() => {
    fetchCustomers();
    fetchOrders();
  }, []);

  const fetchCustomers = async () => {
    const response = await axios.get(`${API_URL}/customers`);
    setCustomers(response.data);
  };

  const fetchOrders = async () => {
    const response = await axios.get(`${API_URL}/orders`);
    setOrders(response.data);
  };

  const handleCustomerSubmit = async (e) => {
    e.preventDefault();
    await axios.post(`${API_URL}/customers`, newCustomer);
    setNewCustomer({ name: "", email: "", phone: "" });
    fetchCustomers();
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    await axios.post(`${API_URL}/orders`, newOrder);
    setNewOrder({ customer: "", product: "", quantity: 0, totalPrice: 0 });
    fetchOrders();
  };

  return (
    <div className="App">
      <h1>CRM System</h1>

      <div>
        <h2>Add Customer</h2>
        <form onSubmit={handleCustomerSubmit}>
          <input
            type="text"
            placeholder="Name"
            value={newCustomer.name}
            onChange={(e) =>
              setNewCustomer({ ...newCustomer, name: e.target.value })
            }
          />
          <input
            type="email"
            placeholder="Email"
            value={newCustomer.email}
            onChange={(e) =>
              setNewCustomer({ ...newCustomer, email: e.target.value })
            }
          />
          <input
            type="tel"
            placeholder="Phone"
            value={newCustomer.phone}
            onChange={(e) =>
              setNewCustomer({ ...newCustomer, phone: e.target.value })
            }
          />
          <button type="submit">Add Customer</button>
        </form>
      </div>

      <div>
        <h2>Add Order</h2>
        <form onSubmit={handleOrderSubmit}>
          <select
            value={newOrder.customer}
            onChange={(e) =>
              setNewOrder({ ...newOrder, customer: e.target.value })
            }
          >
            <option value="">Select Customer</option>
            {customers.map((customer) => (
              <option key={customer._id} value={customer._id}>
                {customer.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Product"
            value={newOrder.product}
            onChange={(e) =>
              setNewOrder({ ...newOrder, product: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Quantity"
            value={newOrder.quantity}
            onChange={(e) =>
              setNewOrder({ ...newOrder, quantity: parseInt(e.target.value) })
            }
          />
          <input
            type="number"
            placeholder="Total Price"
            value={newOrder.totalPrice}
            onChange={(e) =>
              setNewOrder({
                ...newOrder,
                totalPrice: parseFloat(e.target.value),
              })
            }
          />
          <button type="submit">Add Order</button>
        </form>
      </div>

      <div>
        <h2>Customers</h2>
        <ul>
          {customers.map((customer) => (
            <li key={customer._id}>
              {customer.name} - {customer.email} - {customer.phone}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2>Orders</h2>
        <ul>
          {orders.map((order) => (
            <li key={order._id}>
              {order.customer.name} - {order.product} - Quantity:{" "}
              {order.quantity} - Total: ${order.totalPrice}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
