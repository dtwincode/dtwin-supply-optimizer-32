
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useDecouplingPoints } from "@/hooks/useDecouplingPoints";
import { DecouplingPointDialog } from "./DecouplingPointDialog";
import { DecouplingNetworkBoard } from "./DecouplingNetworkBoard";
import { Loader2, Plus, PlusCircle, RefreshCw } from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { DecouplingPoint } from "@/types/inventory/decouplingTypes";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/translations";

export const DecouplingTab = () => {
  const { decouplingPoints, decouplingNetwork, isLoading, refreshDecouplingPoints, deleteDecouplingPoint } = useDecouplingPoints();
  const { toast } = useToast();
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [selectedPoint, setSelectedPoint] = useState<DecouplingPoint | undefined>(undefined);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { language } = useLanguage();

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
    const confirmed = window.confirm(getTranslation('inventory.confirmDelete', language));
    if (!confirmed) return;

    const result = await deleteDecouplingPoint(point.id);
    if (result.success) {
      toast({
        title: getTranslation('inventory.success', language),
        description: getTranslation('inventory.decouplingPointDeleted', language),
      });
    }
  };

  const handleSuccess = () => {
    refreshDecouplingPoints();
    toast({
      title: getTranslation('inventory.success', language),
      description: getTranslation('inventory.decouplingPointSaved', language),
    });
  };

  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{getTranslation('inventory.decouplingPoints', language)}</CardTitle>
          <CardDescription>
            {getTranslation('inventory.configureDecouplingPoints', language)}
          </CardDescription>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => refreshDecouplingPoints()}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            {getTranslation('inventory.refresh', language)}
          </Button>
          <Button 
            size="sm" 
            onClick={() => handleCreateDecouplingPoint("loc-main-warehouse")}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            {getTranslation('inventory.addDecouplingPoint', language)}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="network" className="space-y-4">
          <TabsList>
            <TabsTrigger value="network">{getTranslation('inventory.decouplingNetwork', language)}</TabsTrigger>
            <TabsTrigger value="list">{getTranslation('inventory.listView', language)}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="network" className="space-y-4">
            {isLoading ? (
              <div className="flex h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <DecouplingNetworkBoard network={decouplingNetwork} />
            )}
          </TabsContent>
          
          <TabsContent value="list">
            {isLoading ? (
              <div className="flex h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{getTranslation('inventory.locationId', language)}</TableHead>
                    <TableHead>{getTranslation('inventory.type', language)}</TableHead>
                    <TableHead>{getTranslation('inventory.description', language)}</TableHead>
                    <TableHead>{getTranslation('inventory.actions', language)}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {decouplingPoints.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                        {getTranslation('inventory.noDecouplingPoints', language)}
                      </TableCell>
                    </TableRow>
                  ) : (
                    decouplingPoints.map((point) => (
                      <TableRow key={point.id}>
                        <TableCell>{point.locationId}</TableCell>
                        <TableCell className="capitalize">
                          {point.type.replace('_', ' ')}
                        </TableCell>
                        <TableCell>{point.description || "-"}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleEditDecouplingPoint(point)}
                            >
                              {getTranslation('inventory.edit', language)}
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm" 
                              onClick={() => handleDeleteDecouplingPoint(point)}
                            >
                              {getTranslation('inventory.delete', language)}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </TabsContent>
        </Tabs>
        
        <DecouplingPointDialog
          locationId={selectedLocation}
          existingPoint={selectedPoint}
          onSuccess={handleSuccess}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
        />
      </CardContent>
    </Card>
  );
};
