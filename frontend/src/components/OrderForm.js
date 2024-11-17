import React, { useState } from "react";

const OrderForm = ({ customers, onSubmit }) => {
  const [order, setOrder] = useState({ customerId: "", amount: "", date: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...order, amount: parseFloat(order.amount) });
    setOrder({ customerId: "", amount: "", date: "" });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="orderCustomer">Customer:</label>
        <select
          id="orderCustomer"
          value={order.customerId}
          onChange={(e) => setOrder({ ...order, customerId: e.target.value })}
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
        <label htmlFor="orderAmount">Amount:</label>
        <input
          id="orderAmount"
          type="number"
          value={order.amount}
          onChange={(e) => setOrder({ ...order, amount: e.target.value })}
          required
          min="0"
          step="0.01"
        />
      </div>
      <div>
        <label htmlFor="orderDate">Date:</label>
        <input
          id="orderDate"
          type="date"
          value={order.date}
          onChange={(e) => setOrder({ ...order, date: e.target.value })}
          required
        />
      </div>
      <button type="submit">Add Order</button>
    </form>
  );
};

export default OrderForm;
