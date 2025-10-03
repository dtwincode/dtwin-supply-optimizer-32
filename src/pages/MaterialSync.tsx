import DashboardLayout from "@/components/DashboardLayout";
import { MaterialSyncAlerts } from "@/components/inventory/alerts/MaterialSyncAlerts";

export default function MaterialSync() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Material Synchronization</h1>
          <p className="text-muted-foreground mt-2">
            BOM component synchronization alerts and multi-level material coordination
          </p>
        </div>
        <MaterialSyncAlerts />
      </div>
    </DashboardLayout>
  );
}
