const express = require("express");
const router = express.Router();
const Audience = require("../models/Audience");
const Customer = require("../models/Customer");
const Order = require("../models/Order");

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

router.get("/", async (req, res) => {
  try {
    const audiences = await Audience.find();
    res.json(audiences);
  } catch (error) {
    console.error("Error fetching audiences:", error);
    res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
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

module.exports = router;
