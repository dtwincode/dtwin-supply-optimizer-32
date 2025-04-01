
import DashboardLayout from "@/components/DashboardLayout";
import { InventoryPlanningDashboard } from "@/components/inventory-planning/InventoryPlanningDashboard";

export default function InventoryPlanning() {
  return (
    <DashboardLayout>
      <InventoryPlanningDashboard />
    </DashboardLayout>
  );
}
