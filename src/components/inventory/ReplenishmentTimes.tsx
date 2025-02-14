
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ReplenishmentData } from "./types";

interface ReplenishmentTimesProps {
  data: ReplenishmentData[];
}

export function ReplenishmentTimes({ data }: ReplenishmentTimesProps) {
  return (
    <div className="grid gap-4">
      {data.map((item) => (
        <Card key={item.sku} className="p-4">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-start">
              <h4 className="font-medium">{item.sku}</h4>
              <Badge variant="outline">
                Total Cycle: {item.totalCycleTime} days
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div>
                <p className="text-sm font-medium">Internal Transfer Time</p>
                <p className="text-2xl font-bold">{item.internalTransferTime} days</p>
                <p className="text-sm text-muted-foreground">
                  From: {item.locationFrom}<br />
                  To: {item.locationTo}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Replenishment Lead Time</p>
                <p className="text-2xl font-bold">{item.replenishmentLeadTime} days</p>
                <p className="text-sm text-muted-foreground">
                  Last updated: {new Date(item.lastUpdated).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
