import React, { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";

const CustomerForm = ({ onSubmit }) => {
  const [customer, setCustomer] = useState({ name: "", email: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(customer);
    setCustomer({ name: "", email: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="customerName">Name</label>
        <input
          id="customerName"
          type="text"
          value={customer.name}
          onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
          required
        />
      </div>
      <div>
        <label htmlFor="customerEmail">Email</label>
        <input
          id="customerEmail"
          type="email"
          value={customer.email}
          onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
          required
        />
      </div>
      <button type="submit">Add Customer</button>
    </form>
  );
};

export default CustomerForm;
