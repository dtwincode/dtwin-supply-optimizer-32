
// LeadTimePredictions placeholder - this file would be created as part of the organization
import React from "react";
import { LeadTimeData } from "./types";

interface LeadTimePredictionsProps {
  data: LeadTimeData[];
}

export const LeadTimePredictions: React.FC<LeadTimePredictionsProps> = ({ data }) => {
  return (
    <div className="space-y-4">
      {data.length === 0 ? (
        <p className="text-muted-foreground">No lead time predictions available.</p>
      ) : (
        data.map((item) => (
          <div key={item.id} className="border rounded-md p-3">
            <div className="flex justify-between">
              <span className="font-medium">{item.sku}</span>
              <span className="text-sm text-muted-foreground">
                {new Date(item.prediction_date).toLocaleDateString()}
              </span>
            </div>
            <div className="mt-2 flex justify-between">
              <span>Predicted: {item.predicted_lead_time} days</span>
              <span className="text-sm">Confidence: {item.confidence_score}%</span>
            </div>
          </div>
        ))
      )}
    </div>
  );
};
