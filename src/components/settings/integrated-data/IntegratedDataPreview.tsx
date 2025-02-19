
import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Database, RefreshCw } from "lucide-react";
import { IntegratedDataTable } from "./IntegratedDataTable";
import { useIntegratedData } from "./useIntegratedData";

export function IntegratedDataPreview() {
  const { data, isLoading, isIntegrating, fetchData, handleIntegration } = useIntegratedData();

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold">Integrated Dataset Preview</h3>
              <p className="text-lg text-muted-foreground">
                View and manage the combined forecast data from all sources
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleIntegration}
                disabled={isIntegrating}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 text-lg"
                size="lg"
              >
                <Database className="h-5 w-5" />
                {isIntegrating ? "Integrating..." : "Integrate Data"}
              </Button>
              <Button
                variant="outline"
                onClick={() => fetchData()}
                disabled={isLoading}
                className="flex items-center gap-2 text-lg"
                size="lg"
              >
                <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <p>Loading integrated data...</p>
            </div>
          ) : (
            <IntegratedDataTable data={data} />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
