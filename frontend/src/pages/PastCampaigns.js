import React, { useState, useEffect } from "react";
import axios from "axios";
import CampaignStatistics from "../components/CampaignStatistics";

const API_URL = "http://localhost:5000/api";

function PastCampaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [error, setError] = useState("");
  const [sendingStatus, setSendingStatus] = useState({});

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const response = await axios.get(`${API_URL}/campaigns`);
      setCampaigns(response.data);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      setError("Failed to fetch campaigns. Please try again.");
    }
  };

  const handleSendMessage = async (campaignId) => {
    setSendingStatus((prevStatus) => ({
      ...prevStatus,
      [campaignId]: "Sending...",
    }));
    try {
      const response = await axios.post(`${API_URL}/messages/send`, {
        campaignId,
      });
      setSendingStatus((prevStatus) => ({
        ...prevStatus,
        [campaignId]: `Success: ${response.data.message}`,
      }));

      // Update the campaign statistics in the local state
      setCampaigns((prevCampaigns) =>
        prevCampaigns.map((campaign) =>
          campaign._id === campaignId
            ? { ...campaign, statistics: response.data.statistics }
            : campaign
        )
      );
    } catch (error) {
      console.error("Error sending messages:", error);
      setSendingStatus((prevStatus) => ({
        ...prevStatus,
        [campaignId]: `Failed to send messages: ${
          error.response?.data?.message || error.message
        }`,
      }));
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Past Campaigns</h1>
      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
          role="alert"
        >
          {error}
        </div>
      )}
      <ul className="space-y-4">
        {campaigns.map((campaign) => (
          <li key={campaign._id} className="border p-4 rounded">
            <h2 className="text-xl font-semibold mb-2">{campaign.name}</h2>
            <p className="mb-2">
              Created on: {new Date(campaign.createdAt).toLocaleString()}
            </p>
            <p className="mb-2">Message: {campaign.message}</p>
            <h3 className="text-lg font-semibold mb-2">Audience Conditions:</h3>
            <ul className="list-disc list-inside mb-2">
              {campaign.conditions.map((condition, index) => (
                <li key={index}>
                  {condition.field} {condition.operator} {condition.value}
                  {index < campaign.conditions.length - 1
                    ? ` ${campaign.logic} `
                    : ""}
                </li>
              ))}
            </ul>
            <CampaignStatistics
              audienceSize={campaign.statistics.audienceSize}
              sentCount={campaign.statistics.sentCount}
              failedCount={campaign.statistics.failedCount}
            />
            <button
              onClick={() => handleSendMessage(campaign._id)}
              className="mt-2 p-2 bg-blue-500 text-white rounded"
            >
              Send Message
            </button>
            {sendingStatus[campaign._id] && (
              <p className="mt-2 text-sm text-gray-600">
                {sendingStatus[campaign._id]}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PastCampaigns;
