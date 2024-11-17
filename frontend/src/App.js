import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api";

export default function Component() {
  const [audiences, setAudiences] = useState([]);
  const [newAudience, setNewAudience] = useState({
    name: "",
    conditions: [{ field: "totalSpending", operator: ">", value: 0 }],
    logic: "AND",
  });
  const [customers, setCustomers] = useState([]);
  const [newCustomer, setNewCustomer] = useState({ name: "", email: "" });
  const [orders, setOrders] = useState([]);
  const [newOrder, setNewOrder] = useState({
    customerId: "",
    amount: 0,
    date: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAudiences();
    fetchCustomers();
    fetchOrders();
  }, []);

  const fetchAudiences = async () => {
    try {
      const response = await axios.get(`${API_URL}/audiences`);
      setAudiences(response.data);
    } catch (error) {
      console.error("Error fetching audiences:", error);
      setError("Failed to fetch audiences. Please try again.");
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

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API_URL}/orders`);
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Failed to fetch orders. Please try again.");
    }
  };

  const handleAudienceSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const formattedAudience = {
        ...newAudience,
        conditions: newAudience.conditions.map((condition) => ({
          ...condition,
          value:
            condition.field === "lastVisit"
              ? new Date(condition.value).toISOString()
              : Number(condition.value),
        })),
      };

      const response = await axios.post(
        `${API_URL}/audiences`,
        formattedAudience
      );
      setAudiences([...audiences, response.data]);
      setNewAudience({
        name: "",
        conditions: [{ field: "totalSpending", operator: ">", value: 0 }],
        logic: "AND",
      });
    } catch (error) {
      console.error("Error creating audience:", error);
      setError("Failed to create audience. Please try again.");
    }
  };

  const handleCustomerSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.post(`${API_URL}/customers`, newCustomer);
      setCustomers([...customers, response.data]);
      setNewCustomer({ name: "", email: "" });
    } catch (error) {
      console.error("Error creating customer:", error);
      setError("Failed to create customer. Please try again.");
    }
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.post(`${API_URL}/orders`, newOrder);
      setOrders([...orders, response.data]);
      setNewOrder({ customerId: "", amount: 0, date: "" });
    } catch (error) {
      console.error("Error creating order:", error);
      setError("Failed to create order. Please try again.");
    }
  };

  const addCondition = () => {
    setNewAudience({
      ...newAudience,
      conditions: [
        ...newAudience.conditions,
        { field: "totalSpending", operator: ">", value: 0 },
      ],
    });
  };

  const removeCondition = (index) => {
    const updatedConditions = newAudience.conditions.filter(
      (_, i) => i !== index
    );
    setNewAudience({ ...newAudience, conditions: updatedConditions });
  };

  const updateCondition = (index, field, value) => {
    const updatedConditions = newAudience.conditions.map((condition, i) => {
      if (i === index) {
        return { ...condition, [field]: value };
      }
      return condition;
    });
    setNewAudience({ ...newAudience, conditions: updatedConditions });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        CRM System - Audience Management
      </h1>

      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
          role="alert"
        >
          {error}
        </div>
      )}

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Create Audience</h2>
        <form onSubmit={handleAudienceSubmit} className="space-y-4">
          <div>
            <label htmlFor="audienceName" className="block mb-1">
              Audience Name:
            </label>
            <input
              id="audienceName"
              type="text"
              value={newAudience.name}
              onChange={(e) =>
                setNewAudience({ ...newAudience, name: e.target.value })
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>

          {newAudience.conditions.map((condition, index) => (
            <div key={index} className="flex space-x-2">
              <select
                value={condition.field}
                onChange={(e) =>
                  updateCondition(index, "field", e.target.value)
                }
                className="p-2 border rounded"
              >
                <option value="totalSpending">Total Spending</option>
                <option value="visits">Visits</option>
                <option value="lastVisit">Last Visit</option>
              </select>
              <select
                value={condition.operator}
                onChange={(e) =>
                  updateCondition(index, "operator", e.target.value)
                }
                className="p-2 border rounded"
              >
                <option value=">">{">"}</option>
                <option value="<">{"<"}</option>
                <option value=">=">{"≥"}</option>
                <option value="<=">{"≤"}</option>
                <option value="==">{"="}</option>
              </select>
              <input
                type={condition.field === "lastVisit" ? "date" : "number"}
                value={condition.value}
                onChange={(e) =>
                  updateCondition(index, "value", e.target.value)
                }
                className="w-full p-2 border rounded"
              />
              <button
                type="button"
                onClick={() => removeCondition(index)}
                className="p-2 bg-red-500 text-white rounded"
              >
                Remove
              </button>
            </div>
          ))}

          <div>
            <button
              type="button"
              onClick={addCondition}
              className="p-2 bg-blue-500 text-white rounded"
            >
              Add Condition
            </button>
          </div>

          <div>
            <label htmlFor="logic" className="block mb-1">
              Logic:
            </label>
            <select
              id="logic"
              value={newAudience.logic}
              onChange={(e) =>
                setNewAudience({ ...newAudience, logic: e.target.value })
              }
              className="p-2 border rounded"
            >
              <option value="AND">AND</option>
              <option value="OR">OR</option>
            </select>
          </div>

          <button type="submit" className="p-2 bg-green-500 text-white rounded">
            Create Audience
          </button>
        </form>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Add Customer</h2>
        <form onSubmit={handleCustomerSubmit} className="space-y-4">
          <div>
            <label htmlFor="customerName" className="block mb-1">
              Name:
            </label>
            <input
              id="customerName"
              type="text"
              value={newCustomer.name}
              onChange={(e) =>
                setNewCustomer({ ...newCustomer, name: e.target.value })
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label htmlFor="customerEmail" className="block mb-1">
              Email:
            </label>
            <input
              id="customerEmail"
              type="email"
              value={newCustomer.email}
              onChange={(e) =>
                setNewCustomer({ ...newCustomer, email: e.target.value })
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <button type="submit" className="p-2 bg-green-500 text-white rounded">
            Add Customer
          </button>
        </form>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Add Order</h2>
        <form onSubmit={handleOrderSubmit} className="space-y-4">
          <div>
            <label htmlFor="orderCustomer" className="block mb-1">
              Customer:
            </label>
            <select
              id="orderCustomer"
              value={newOrder.customerId}
              onChange={(e) =>
                setNewOrder({ ...newOrder, customerId: e.target.value })
              }
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select a customer</option>
              {customers.map((customer) => (
                <option key={customer._id} value={customer._id}>
                  {customer.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="orderAmount" className="block mb-1">
              Amount:
            </label>
            <input
              id="orderAmount"
              type="number"
              value={newOrder.amount}
              onChange={(e) =>
                setNewOrder({ ...newOrder, amount: Number(e.target.value) })
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label htmlFor="orderDate" className="block mb-1">
              Date:
            </label>
            <input
              id="orderDate"
              type="date"
              value={newOrder.date}
              onChange={(e) =>
                setNewOrder({ ...newOrder, date: e.target.value })
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <button type="submit" className="p-2 bg-green-500 text-white rounded">
            Add Order
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Existing Audiences</h2>
        <ul className="space-y-2">
          {audiences.map((audience) => (
            <li key={audience._id} className="border p-2 rounded">
              <strong>{audience.name}</strong> (Size: {audience.size})
              <br />
              Conditions:{" "}
              {audience.conditions.map((c, i) => (
                <span key={i}>
                  {c.field} {c.operator} {c.value}
                  {i < audience.conditions.length - 1
                    ? ` ${audience.logic} `
                    : ""}
                </span>
              ))}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-2">Existing Customer</h2>
        <ul className="space-y-2">
          {customers.map((customer) => (
            <li key={customer._id} className="border p-2 rounded">
              <strong>{customer.name}</strong>
              <br />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
