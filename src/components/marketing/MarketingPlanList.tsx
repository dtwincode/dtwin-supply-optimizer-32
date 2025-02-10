
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

// This is a placeholder component that will later be connected to actual data
export const MarketingPlanList = () => {
  const plans = [
    {
      id: "1",
      name: "Black Friday Sale 2024",
      promotionType: "black-friday",
      startDate: "2024-11-29",
      endDate: "2024-11-30",
      status: "draft",
    },
    {
      id: "2",
      name: "Summer Clearance",
      promotionType: "summer-sale",
      startDate: "2024-07-01",
      endDate: "2024-07-31",
      status: "draft",
    },
  ];

  return (
    <div className="space-y-4">
      {plans.map((plan) => (
        <Card key={plan.id}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg font-medium">{plan.name}</CardTitle>
              <Badge variant={plan.status === "active" ? "default" : "secondary"}>
                {plan.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              {format(new Date(plan.startDate), "MMM d, yyyy")} -{" "}
              {format(new Date(plan.endDate), "MMM d, yyyy")}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
