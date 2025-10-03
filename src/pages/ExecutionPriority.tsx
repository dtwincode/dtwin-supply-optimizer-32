import DashboardLayout from "@/components/DashboardLayout";
import { ExecutionPriorityDashboard } from "@/components/inventory/execution/ExecutionPriorityDashboard";

export default function ExecutionPriority() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Execution Priority</h1>
          <p className="text-muted-foreground mt-2">
            Buffer penetration-based execution dashboard (replaces due-date scheduling)
          </p>
        </div>
        <ExecutionPriorityDashboard />
      </div>
    </DashboardLayout>
  );
}
