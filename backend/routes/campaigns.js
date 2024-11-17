const express = require("express");
const router = express.Router();
const Campaign = require("../models/Campaign");
const Customer = require("../models/Customer");

router.post("/", async (req, res) => {
  try {
    const { name, conditions, logic, message } = req.body;
    const formattedConditions = conditions.map((condition) => ({
      ...condition,
      value:
        condition.field === "lastVisit"
          ? new Date(condition.value)
          : Number(condition.value),
    }));

    const campaign = new Campaign({
      name,
      conditions: formattedConditions,
      logic,
      message,
    });
    await campaign.save();
    res.status(201).json(campaign);
  } catch (error) {
    console.error("Error creating campaign:", error);
    res.status(500).json({ message: "Error creating campaign" });
  }
});

router.get("/", async (req, res) => {
  try {
    const campaigns = await Campaign.find().sort({ createdAt: -1 });
    res.json(campaigns);
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    res.status(500).json({ message: "Error fetching campaigns" });
  }
});
router.get("/:id", async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }
    res.json(campaign);
  } catch (error) {
    console.error("Error fetching campaign:", error);
    res.status(500).json({ message: "Error fetching campaign" });
  }
});

module.exports = router;
