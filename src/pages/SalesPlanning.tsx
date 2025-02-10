
import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowDown, ArrowUp, Filter } from "lucide-react";
import type { SalesPlan } from "@/types/sales";

// Mock data - replace with actual data from your backend
const mockSalesPlans: SalesPlan[] = [
  {
    id: "1",
    timeframe: {
      startDate: "2024-01-01",
      endDate: "2024-12-31"
    },
    planType: "top-down",
    productHierarchy: {
      category: "Electronics",
      subcategory: "Smartphones",
      sku: "iPhone-15"
    },
    location: {
      region: "North America",
      city: "New York",
      warehouse: "NYC-01"
    },
    planningValues: {
      targetValue: 1000000,
      confidence: 0.8,
      notes: "Based on historical data and market analysis"
    },
    status: "draft",
    lastUpdated: "2024-03-15",
    createdBy: "John Doe"
  }
];

const productCategories = ["Electronics", "Fashion", "Home & Garden"];
const regions = ["North America", "Europe", "Asia Pacific"];

const SalesPlanning = () => {
  const [planType, setPlanType] = useState<"top-down" | "bottom-up">("top-down");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedRegion, setSelectedRegion] = useState<string>("");

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Sales Planning</h1>
          <div className="flex gap-4">
            <Button
              variant={planType === "top-down" ? "default" : "outline"}
              onClick={() => setPlanType("top-down")}
              className="gap-2"
            >
              <ArrowDown className="h-4 w-4" />
              Top-Down
            </Button>
            <Button
              variant={planType === "bottom-up" ? "default" : "outline"}
              onClick={() => setPlanType("bottom-up")}
              className="gap-2"
            >
              <ArrowUp className="h-4 w-4" />
              Bottom-Up
            </Button>
          </div>
        </div>

        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="space-y-2">
              <Label>Time Frame</Label>
              <div className="flex gap-4">
                <Input type="date" className="w-full" />
                <Input type="date" className="w-full" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Product Category</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {productCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Region</Label>
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger>
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  {regions.map((region) => (
                    <SelectItem key={region} value={region}>
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time Frame</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Target Value</TableHead>
                <TableHead>Confidence</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockSalesPlans.map((plan) => (
                <TableRow key={plan.id}>
                  <TableCell>
                    {new Date(plan.timeframe.startDate).toLocaleDateString()} -{" "}
                    {new Date(plan.timeframe.endDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {plan.productHierarchy.category} /{" "}
                    {plan.productHierarchy.subcategory} /{" "}
                    {plan.productHierarchy.sku}
                  </TableCell>
                  <TableCell>
                    {plan.location.region} / {plan.location.city} /{" "}
                    {plan.location.warehouse}
                  </TableCell>
                  <TableCell>
                    ${plan.planningValues.targetValue.toLocaleString()}
                  </TableCell>
                  <TableCell>{(plan.planningValues.confidence * 100).toFixed(0)}%</TableCell>
                  <TableCell>
                    <span className="capitalize px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                      {plan.status}
                    </span>
                  </TableCell>
                  <TableCell>{new Date(plan.lastUpdated).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SalesPlanning;
