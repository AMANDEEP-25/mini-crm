import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api";

const CampaignHistory = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/campaigns`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCampaigns(response.data);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      setError("Failed to fetch campaigns. Please try again.");
    }
  };

  return (
    <div>
      <h1>Campaign History & Stats</h1>
      {error && <div>{error}</div>}
      <div>
        <h2>Past Campaigns</h2>
        <ul>
          {campaigns.map((campaign) => (
            <li key={campaign._id}>
              <h3>{campaign.name}</h3>
              <p>Date: {new Date(campaign.date).toLocaleDateString()}</p>
              <p>Audience: {campaign.audienceName}</p>
              <p>Sent: {campaign.sentCount}</p>
              <p>Opened: {campaign.openedCount}</p>
              <p>Clicked: {campaign.clickedCount}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CampaignHistory;
