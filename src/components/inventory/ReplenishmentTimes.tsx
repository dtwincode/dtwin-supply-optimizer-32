
// ReplenishmentTimes placeholder - this file would be created as part of the organization
import React from "react";
import { ReplenishmentData } from "./types";

interface ReplenishmentTimesProps {
  data: ReplenishmentData[];
}

export const ReplenishmentTimes: React.FC<ReplenishmentTimesProps> = ({ data }) => {
  return (
    <div className="space-y-4">
      {data.length === 0 ? (
        <p className="text-muted-foreground">No replenishment data available.</p>
      ) : (
        data.map((item) => (
          <div key={item.sku} className="border rounded-md p-3">
            <div className="flex justify-between">
              <span className="font-medium">{item.sku}</span>
              <span className="text-sm text-muted-foreground">
                {new Date(item.lastUpdated).toLocaleDateString()}
              </span>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="block text-muted-foreground">From</span>
                <span>{item.locationFrom}</span>
              </div>
              <div>
                <span className="block text-muted-foreground">To</span>
                <span>{item.locationTo}</span>
              </div>
              <div>
                <span className="block text-muted-foreground">Internal Transfer</span>
                <span>{item.internalTransferTime} days</span>
              </div>
              <div>
                <span className="block text-muted-foreground">Lead Time</span>
                <span>{item.replenishmentLeadTime} days</span>
              </div>
              <div className="col-span-2">
                <span className="block text-muted-foreground">Total Cycle Time</span>
                <span className="font-medium">{item.totalCycleTime} days</span>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};
