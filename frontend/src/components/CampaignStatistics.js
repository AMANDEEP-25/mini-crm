import React from "react";

export default function CampaignStatistics({
  audienceSize,
  sentCount,
  failedCount,
}) {
  return (
    <div>
      <div>
        <h3>Audience Size</h3>
        <p>{audienceSize}</p>
      </div>
      <div>
        <h3>Messages Sent</h3>
        <p>{sentCount}</p>
      </div>
      <div>
        <h3>Messages Failed</h3>
        <p>{failedCount}</p>
      </div>
    </div>
  );
}
