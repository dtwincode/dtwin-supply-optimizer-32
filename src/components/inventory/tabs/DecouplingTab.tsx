
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useDecouplingPoints } from "@/hooks/useDecouplingPoints";
import { DecouplingPointDialog } from "../decoupling/DecouplingPointDialog";
import { DecouplingNetworkBoard } from "../decoupling/DecouplingNetworkBoard";
import { 
  Loader2, 
  PlusCircle, 
  RefreshCw, 
  Network, 
  List, 
  Settings,
  Map
} from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { DecouplingPoint } from "@/types/inventory/decouplingTypes";
import { NetworkDecouplingMap } from "../decoupling/NetworkDecouplingMap";

export const DecouplingTab = () => {
  const { 
    decouplingPoints, 
    decouplingNetwork, 
    isLoading, 
    refreshDecouplingPoints, 
    deleteDecouplingPoint 
  } = useDecouplingPoints();
  
  const { toast } = useToast();
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [selectedPoint, setSelectedPoint] = useState<DecouplingPoint | undefined>(undefined);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeView, setActiveView] = useState<"network" | "map" | "list" | "settings">("network");

  const handleCreateDecouplingPoint = (locationId: string) => {
    setSelectedLocation(locationId);
    setSelectedPoint(undefined);
    setDialogOpen(true);
  };

  const handleEditDecouplingPoint = (point: DecouplingPoint) => {
    setSelectedPoint(point);
    setSelectedLocation(point.locationId);
    setDialogOpen(true);
  };

  const handleDeleteDecouplingPoint = async (point: DecouplingPoint) => {
    const confirmed = window.confirm("Are you sure you want to delete this decoupling point?");
    if (!confirmed) return;

    const result = await deleteDecouplingPoint(point.id);
    if (result.success) {
      toast({
        title: "Success",
        description: "Decoupling point has been deleted",
      });
    }
  };

  const handleSuccess = () => {
    refreshDecouplingPoints();
    toast({
      title: "Success",
      description: "Decoupling point has been saved",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Decoupling Points</h2>
          <p className="text-sm text-muted-foreground">
            Configure and manage decoupling points in your supply chain network
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => refreshDecouplingPoints()}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button 
            size="sm" 
            onClick={() => handleCreateDecouplingPoint("loc-main-warehouse")}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Decoupling Point
          </Button>
        </div>
      </div>
      
      <Card className="overflow-hidden">
        <CardHeader className="pb-0 border-b">
          <div className="flex justify-between">
            <CardTitle>Supply Chain Network</CardTitle>
            <div className="flex gap-1 mb-2">
              <Button 
                variant={activeView === "network" ? "default" : "ghost"} 
                size="sm" 
                onClick={() => setActiveView("network")}
              >
                <Network className="h-4 w-4 mr-1" />
                Network
              </Button>
              <Button 
                variant={activeView === "map" ? "default" : "ghost"} 
                size="sm" 
                onClick={() => setActiveView("map")}
              >
                <Map className="h-4 w-4 mr-1" />
                Map
              </Button>
              <Button 
                variant={activeView === "list" ? "default" : "ghost"} 
                size="sm" 
                onClick={() => setActiveView("list")}
              >
                <List className="h-4 w-4 mr-1" />
                List
              </Button>
              <Button 
                variant={activeView === "settings" ? "default" : "ghost"} 
                size="sm" 
                onClick={() => setActiveView("settings")}
              >
                <Settings className="h-4 w-4 mr-1" />
                Settings
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {activeView === "network" && (
            <div className="p-4">
              {isLoading ? (
                <div className="flex h-[400px] items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <DecouplingNetworkBoard network={decouplingNetwork} />
              )}
            </div>
          )}
          
          {activeView === "map" && (
            <div className="p-0">
              <NetworkDecouplingMap />
            </div>
          )}
          
          {activeView === "list" && (
            <div className="overflow-hidden">
              {isLoading ? (
                <div className="flex h-[400px] items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Location ID</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Lead Time</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {decouplingPoints.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          No decoupling points configured yet
                        </TableCell>
                      </TableRow>
                    ) : (
                      decouplingPoints.map((point) => (
                        <TableRow key={point.id}>
                          <TableCell className="font-medium">{point.locationId}</TableCell>
                          <TableCell className="capitalize">
                            {point.type.replace('_', ' ')}
                          </TableCell>
                          <TableCell>{point.description || "-"}</TableCell>
                          <TableCell>{point.leadTimeAdjustment || "-"}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleEditDecouplingPoint(point)}
                              >
                                Edit
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="sm" 
                                onClick={() => handleDeleteDecouplingPoint(point)}
                              >
                                Delete
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </div>
          )}
          
          {activeView === "settings" && (
            <div className="p-6">
              <Card>
                <CardHeader>
                  <CardTitle>Decoupling Point Settings</CardTitle>
                  <CardDescription>
                    Configure global settings for decoupling points
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Buffer Profile Assignment</h3>
                      <p className="text-sm text-muted-foreground">
                        Configure which buffer profiles are used for different decoupling point types
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2">Default Parameters</h3>
                      <p className="text-sm text-muted-foreground">
                        Set default parameters for lead time adjustments and variability factors
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2">Replenishment Strategies</h3>
                      <p className="text-sm text-muted-foreground">
                        Configure default replenishment strategies for different decoupling point types
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
      
      <DecouplingPointDialog
        locationId={selectedLocation}
        existingPoint={selectedPoint}
        onSuccess={handleSuccess}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
};
