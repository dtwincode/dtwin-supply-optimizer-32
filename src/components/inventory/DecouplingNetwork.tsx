
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useDecouplingPoints } from "@/hooks/useDecouplingPoints";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/translations";
import { DecouplingNetworkBoard } from "./DecouplingNetworkBoard";

export const DecouplingNetwork = () => {
  const { decouplingNetwork, isNetworkLoading, refreshDecouplingNetwork } = useDecouplingPoints();
  const [error, setError] = useState<Error | null>(null);
  const { language } = useLanguage();

  useEffect(() => {
    try {
      refreshDecouplingNetwork();
    } catch (err) {
      console.error("Error initializing network:", err);
      setError(err instanceof Error ? err : new Error("Failed to initialize network"));
    }
  }, [refreshDecouplingNetwork]);

  const handleRefresh = () => {
    try {
      refreshDecouplingNetwork();
      setError(null);
    } catch (err) {
      console.error("Error refreshing network:", err);
      setError(err instanceof Error ? err : new Error("Failed to refresh network"));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">{getTranslation("common.inventory.networkVisualization", language)}</h2>
        <Button size="sm" variant="outline" onClick={handleRefresh}>
          <RefreshCw className="h-4 w-4 mr-2" />
          {getTranslation("common.inventory.refresh", language)}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>{getTranslation("common.inventory.nodes", language)}</CardTitle>
            <CardDescription>
              {getTranslation("common.inventory.nodesDescription", language)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              {getTranslation("common.inventory.totalItems", language)}: {decouplingNetwork.nodes.length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{getTranslation("common.inventory.links", language)}</CardTitle>
            <CardDescription>
              {getTranslation("common.inventory.linksDescription", language)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              {getTranslation("common.inventory.totalItems", language)}: {decouplingNetwork.links.length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{getTranslation("common.inventory.decouplingPoints", language)}</CardTitle>
            <CardDescription>
              {getTranslation("common.inventory.configureDecouplingPoints", language)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              {getTranslation("common.inventory.totalItems", language)}: {
                decouplingNetwork.nodes.filter(node => node.type === 'decoupling').length
              }
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="overflow-hidden h-[600px]">
        <CardHeader>
          <CardTitle>{getTranslation("common.inventory.decouplingNetwork", language)}</CardTitle>
          <CardDescription>
            {getTranslation("common.inventory.networkHelp", language)}
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[500px] p-0">
          {error ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-red-500">
                {error.message}
              </p>
            </div>
          ) : isNetworkLoading ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">
                {getTranslation("common.loading", language)}...
              </p>
            </div>
          ) : (
            <DecouplingNetworkBoard network={decouplingNetwork} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};
