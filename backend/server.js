const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

// Customer Schema
const customerSchema = new mongoose.Schema({
  name: String,
  email: String,
});

const Customer = mongoose.model("Customer", customerSchema);

// Order Schema
const orderSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
  amount: Number,
  date: Date,
});

const Order = mongoose.model("Order", orderSchema);

// Audience Schema
const audienceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  conditions: [
    {
      field: { type: String, required: true },
      operator: { type: String, required: true },
      value: { type: mongoose.Schema.Types.Mixed, required: true },
    },
  ],
  logic: { type: String, required: true, enum: ["AND", "OR"] },
  size: { type: Number, required: true },
});

const Audience = mongoose.model("Audience", audienceSchema);

// Helper function to convert operator to MongoDB query operator
function getMongoOperator(operator) {
  switch (operator) {
    case ">":
      return "$gt";
    case "<":
      return "$lt";
    case ">=":
      return "$gte";
    case "<=":
      return "$lte";
    case "==":
      return "$eq";
    default:
      throw new Error(`Unsupported operator: ${operator}`);
  }
}

// API to create a new audience
app.post("/api/audiences", async (req, res) => {
  try {
    const { name, conditions, logic } = req.body;

    if (!name || !conditions || !logic) {
      return res
        .status(400)
        .json({ message: "Name, conditions, and logic are required fields." });
    }

    if (!Array.isArray(conditions) || conditions.length === 0) {
      return res
        .status(400)
        .json({ message: "Conditions must be a non-empty array." });
    }

    // Validate each condition
    for (let condition of conditions) {
      if (
        !condition.field ||
        !condition.operator ||
        condition.value === undefined
      ) {
        return res.status(400).json({
          message: "Each condition must have a field, operator, and value.",
        });
      }
    }

    // Build the MongoDB aggregation pipeline
    const pipeline = [];

    // Group orders by customer
    pipeline.push({
      $group: {
        _id: "$customerId",
        totalSpending: { $sum: "$amount" },
        visits: { $sum: 1 },
        lastVisit: { $max: "$date" },
      },
    });

    // Join with customers collection
    pipeline.push({
      $lookup: {
        from: "customers",
        localField: "_id",
        foreignField: "_id",
        as: "customerInfo",
      },
    });

    pipeline.push({ $unwind: "$customerInfo" });

    // Apply conditions
    const matchConditions = conditions.map((condition) => {
      const mongoOperator = getMongoOperator(condition.operator);
      return {
        [condition.field]: { [mongoOperator]: Number(condition.value) },
      };
    });

    if (logic === "AND") {
      pipeline.push({ $match: { $and: matchConditions } });
    } else if (logic === "OR") {
      pipeline.push({ $match: { $or: matchConditions } });
    } else {
      return res
        .status(400)
        .json({ message: 'Logic must be either "AND" or "OR".' });
    }

    // Count the matching documents
    pipeline.push({ $count: "size" });

    // Execute the aggregation
    const result = await Order.aggregate(pipeline);

    // Get the size from the result
    const size = result.length > 0 ? result[0].size : 0;

    const newAudience = new Audience({
      name,
      conditions,
      logic,
      size,
    });

    await newAudience.save();
    res.status(201).json(newAudience);
  } catch (error) {
    console.error("Error creating audience:", error);
    res.status(400).json({ message: error.message });
  }
});

// API to get all audiences
app.get("/api/audiences", async (req, res) => {
  try {
    const audiences = await Audience.find();
    res.json(audiences);
  } catch (error) {
    console.error("Error fetching audiences:", error);
    res.status(500).json({ message: error.message });
  }
});

// API to add a new customer
app.post("/api/customers", async (req, res) => {
  try {
    const newCustomer = new Customer(req.body);
    await newCustomer.save();
    res.status(201).json(newCustomer);
  } catch (error) {
    console.error("Error creating customer:", error);
    res.status(400).json({ message: error.message });
  }
});

// API to add a new order
app.post("/api/orders", async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(400).json({ message: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

console.log("Server setup complete. API endpoints:");
console.log("POST /api/audiences - Create a new audience");
console.log("GET /api/audiences - Retrieve all audiences");
console.log("POST /api/customers - Add a new customer");
console.log("POST /api/orders - Add a new order");
