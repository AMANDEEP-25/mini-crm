const express = require("express");
const router = express.Router();
const Campaign = require("../models/Campaign");
const CommunicationLog = require("../models/CommunicationLog");
const Customer = require("../models/Customer");

router.post("/send", async (req, res) => {
  try {
    const { campaignId } = req.body;
    console.log("Received campaignId:", campaignId);

    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      console.log("Campaign not found");
      return res.status(404).json({ message: "Campaign not found" });
    }
    console.log("Found campaign:", campaign);

    const query = buildAudienceQuery(campaign);
    console.log("Built audience query:", query);

    const customers = await Customer.find(query);
    const audienceSize = customers.length;
    console.log("Audience size:", audienceSize);

    if (audienceSize === 0) {
      return res
        .status(400)
        .json({ message: "No customers match the campaign criteria" });
    }

    const communicationLogs = await Promise.all(
      customers.map(async (customer) => {
        const personalizedMessage = campaign.message.replace(
          "[Name]",
          customer.name
        );
        const log = new CommunicationLog({
          campaignId,
          customerId: customer._id,
          message: personalizedMessage,
          status: "PENDING",
        });
        await log.save();
        return log;
      })
    );

    // Simulate message delivery
    const updatedLogs = await Promise.all(
      communicationLogs.map((log) => simulateMessageDelivery(log._id))
    );

    const sentCount = updatedLogs.filter((log) => log.status === "SENT").length;
    const failedCount = updatedLogs.filter(
      (log) => log.status === "FAILED"
    ).length;

    // Update campaign statistics
    campaign.statistics = {
      audienceSize,
      sentCount,
      failedCount,
    };
    await campaign.save();

    res.status(200).json({
      message: "Messages sent",
      statistics: campaign.statistics,
    });
  } catch (error) {
    console.error("Error sending messages:", error);
    res
      .status(500)
      .json({ message: "Error sending messages", error: error.message });
  }
});

async function simulateMessageDelivery(logId) {
  try {
    const status = Math.random() < 0.9 ? "SENT" : "FAILED";
    const updatedLog = await CommunicationLog.findByIdAndUpdate(
      logId,
      { status, updatedAt: Date.now() },
      { new: true }
    );
    return updatedLog;
  } catch (error) {
    console.error("Error updating message status:", error);
    throw error;
  }
}

function buildAudienceQuery(campaign) {
  const query = {};
  campaign.conditions.forEach((condition) => {
    const value =
      condition.field === "lastVisit"
        ? new Date(condition.value)
        : Number(condition.value);
    query[condition.field] = { [getMongoOperator(condition.operator)]: value };
  });

  return campaign.logic === "AND"
    ? { $and: Object.entries(query).map(([k, v]) => ({ [k]: v })) }
    : { $or: Object.entries(query).map(([k, v]) => ({ [k]: v })) };
}

function getMongoOperator(operator) {
  const operatorMap = {
    ">": "$gt",
    "<": "$lt",
    ">=": "$gte",
    "<=": "$lte",
    "==": "$eq",
  };
  return operatorMap[operator] || "$eq";
}
module.exports = router;
