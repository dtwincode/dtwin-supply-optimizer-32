import DashboardLayout from "@/components/DashboardLayout";

export default function DataManagement() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Data Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage data sources, quality, and integration processes.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="font-semibold mb-2">Data Sources</h3>
            <p className="text-sm text-muted-foreground">
              Connect and manage various data sources and feeds.
            </p>
          </div>
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="font-semibold mb-2">Data Quality</h3>
            <p className="text-sm text-muted-foreground">
              Monitor and maintain data quality and integrity.
            </p>
          </div>
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="font-semibold mb-2">Data Integration</h3>
            <p className="text-sm text-muted-foreground">
              Manage ETL processes and data transformation pipelines.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}