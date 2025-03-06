
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { LeadTimeData, LeadTimeAnomaly } from "./types";

interface LeadTimePredictionsProps {
  data: LeadTimeData[];
  anomalies?: LeadTimeAnomaly[];
}

export function LeadTimePredictions({ data, anomalies }: LeadTimePredictionsProps) {
  return (
    <div className="h-[400px] mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="prediction_date" 
            tickFormatter={(value) => new Date(value).toLocaleDateString()}
          />
          <YAxis />
          <Tooltip
            labelFormatter={(value) => new Date(value).toLocaleDateString()}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="predicted_lead_time"
            name="Predicted Lead Time"
            stroke="#8884d8"
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="confidence_score"
            name="Confidence Score"
            stroke="#82ca9d"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
