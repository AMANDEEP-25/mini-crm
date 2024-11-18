import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL || "/api";

function CreateCampaign() {
  const navigate = useNavigate();
  const [newCampaign, setNewCampaign] = useState({
    name: "",
    conditions: [{ field: "totalSpending", operator: ">", value: 0 }],
    logic: "AND",
    message: "",
  });
  const [error, setError] = useState("");

  const handleCampaignSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const formattedCampaign = {
        ...newCampaign,
        conditions: newCampaign.conditions.map((condition) => ({
          ...condition,
          value:
            condition.field === "lastVisit"
              ? new Date(condition.value).toISOString()
              : Number(condition.value),
        })),
      };

      const response = await axios.post(
        `${API_URL}/campaigns`,
        formattedCampaign
      );
      console.log("Created campaign:", response.data);
      navigate("/past-campaigns");
    } catch (error) {
      console.error("Error creating campaign:", error);
      setError("Failed to create campaign. Please try again.");
    }
  };

  const addCondition = () => {
    setNewCampaign((prevCampaign) => ({
      ...prevCampaign,
      conditions: [
        ...prevCampaign.conditions,
        { field: "totalSpending", operator: ">", value: 0 },
      ],
    }));
  };

  const removeCondition = (index) => {
    setNewCampaign((prevCampaign) => ({
      ...prevCampaign,
      conditions: prevCampaign.conditions.filter((_, i) => i !== index),
    }));
  };

  const updateCondition = (index, field, value) => {
    setNewCampaign((prevCampaign) => ({
      ...prevCampaign,
      conditions: prevCampaign.conditions.map((condition, i) =>
        i === index ? { ...condition, [field]: value } : condition
      ),
    }));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create New Campaign</h1>
      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
          role="alert"
        >
          {error}
        </div>
      )}
      <form onSubmit={handleCampaignSubmit} className="space-y-4">
        <div>
          <label htmlFor="campaignName" className="block mb-1">
            Campaign Name:
          </label>
          <input
            id="campaignName"
            type="text"
            value={newCampaign.name}
            onChange={(e) =>
              setNewCampaign((prevCampaign) => ({
                ...prevCampaign,
                name: e.target.value,
              }))
            }
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Audience Conditions</h2>
          {newCampaign.conditions.map((condition, index) => (
            <div key={index} className="flex space-x-2 mb-2">
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
            value={newCampaign.logic}
            onChange={(e) =>
              setNewCampaign((prevCampaign) => ({
                ...prevCampaign,
                logic: e.target.value,
              }))
            }
            className="p-2 border rounded"
          >
            <option value="AND">AND</option>
            <option value="OR">OR</option>
          </select>
        </div>

        <div>
          <label htmlFor="message" className="block mb-1">
            Message:
          </label>
          <textarea
            id="message"
            value={newCampaign.message}
            onChange={(e) =>
              setNewCampaign((prevCampaign) => ({
                ...prevCampaign,
                message: e.target.value,
              }))
            }
            placeholder="Enter your message here. Use [Name] for personalization."
            className="w-full p-2 border rounded"
            rows="4"
            required
          ></textarea>
        </div>

        <button type="submit" className="p-2 bg-green-500 text-white rounded">
          Create Campaign
        </button>
      </form>
    </div>
  );
}

export default CreateCampaign;
