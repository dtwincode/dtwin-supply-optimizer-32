
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { SalesPlan } from "@/types/sales";

interface SalesPlanTableProps {
  salesPlans: SalesPlan[];
}

export const SalesPlanTable = ({ salesPlans }: SalesPlanTableProps) => {
  return (
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
        {salesPlans.map((plan) => (
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
  );
};

