
import { useEffect, useState } from "react";
import { InventoryItem } from "@/types/inventory";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useI18n } from "@/contexts/I18nContext";
import { Map, Process, Network } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { DecouplingPointDialog } from "./DecouplingPointDialog";
import { useInventory } from "@/hooks/useInventory";
import { Separator } from "@/components/ui/separator";

export function DecouplingNetworkBoard() {
  const { t } = useI18n();
  const { toast } = useToast();
  const [selectedView, setSelectedView] = useState<"map" | "network" | "process">("network");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [decouplingPoints, setDecouplingPoints] = useState<InventoryItem[]>([]);
  
  const { items, loading, error, refreshData } = useInventory(1, 100, "", "", true);

  useEffect(() => {
    if (items && items.length > 0) {
      // Filter items that are decoupling points
      const dPoints = items.filter(item => item.decouplingPointId || item.decoupling_point === true);
      setDecouplingPoints(dPoints);
    }
  }, [items]);

  const handleCreateDecouplingPoint = () => {
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const handleSuccess = () => {
    toast({
      title: "Success",
      description: "Decoupling point has been created successfully",
    });
    refreshData();
  };

  const renderContent = () => {
    if (loading) {
      return <div className="flex justify-center py-8">Loading decoupling points...</div>;
    }

    if (error) {
      return <div className="text-red-500 py-8">Error loading decoupling points</div>;
    }

    if (decouplingPoints.length === 0) {
      return (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">No decoupling points defined yet</h3>
          <p className="text-muted-foreground mb-4">
            Define strategic decoupling points in your supply chain to optimize buffer placement
          </p>
          <Button onClick={handleCreateDecouplingPoint}>Create Decoupling Point</Button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {decouplingPoints.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <div className="bg-primary/10 p-4">
              <h3 className="font-medium">{item.name}</h3>
              <p className="text-sm text-muted-foreground">{item.sku}</p>
            </div>
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Location:</div>
                <div className="font-medium">{item.location}</div>
                
                <div>Current Stock:</div>
                <div className="font-medium">{item.onHand}</div>
                
                <div>Buffer Profile:</div>
                <div className="font-medium">{item.bufferProfileId || "Standard"}</div>
                
                <div>Type:</div>
                <div className="font-medium">Strategic</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Decoupling Points</h2>
          <p className="text-muted-foreground">
            Strategic inventory positions that determine your supply chain's responsiveness
          </p>
        </div>

        <div className="flex space-x-2">
          <Button
            variant={selectedView === "network" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedView("network")}
          >
            <Network className="h-4 w-4 mr-1" />
            Network
          </Button>
          <Button
            variant={selectedView === "map" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedView("map")}
          >
            <Map className="h-4 w-4 mr-1" />
            Map
          </Button>
          <Button
            variant={selectedView === "process" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedView("process")}
          >
            <Process className="h-4 w-4 mr-1" />
            Process
          </Button>
        </div>
      </div>

      <Separator />

      <div className="flex justify-between items-center pb-4">
        <div>
          <p className="text-sm text-muted-foreground">
            {decouplingPoints.length} decoupling points defined
          </p>
        </div>
        <Button onClick={handleCreateDecouplingPoint}>Create Decoupling Point</Button>
      </div>

      {renderContent()}

      <DecouplingPointDialog
        open={isDialogOpen}
        onClose={handleDialogClose}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
