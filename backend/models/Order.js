const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

orderSchema.post("save", async function (doc) {
  const Customer = mongoose.model("Customer");
  await Customer.findByIdAndUpdate(
    doc.customerId,
    {
      $inc: { totalSpending: doc.amount, visits: 1 },
      $set: { lastVisit: doc.date },
    },
    { new: true }
  );
});

module.exports = mongoose.model("Order", orderSchema);
