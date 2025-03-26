
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
  const { points, network, loading, fetchDecouplingPoints, deletePoint } = useDecouplingPoints();
  const { toast } = useToast();
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [selectedPoint, setSelectedPoint] = useState<DecouplingPoint | undefined>(undefined);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { language } = useLanguage();
  
  const t = (key: string) => getTranslation(`common.inventory.${key}`, language);

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
    const confirmed = window.confirm(t('confirmDelete'));
    if (!confirmed) return;

    const result = await deletePoint(point.id);
    if (result.success) {
      toast({
        title: t('success'),
        description: t('decouplingPointDeleted'),
      });
    }
  };

  const handleSuccess = () => {
    fetchDecouplingPoints();
    toast({
      title: t('success'),
      description: t('decouplingPointSaved'),
    });
  };

  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{t('decouplingPoints')}</CardTitle>
          <CardDescription>
            {t('configureDecouplingPoints')}
          </CardDescription>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => fetchDecouplingPoints()}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            {t('refresh')}
          </Button>
          <Button 
            size="sm" 
            onClick={() => handleCreateDecouplingPoint("loc-main-warehouse")}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            {t('addDecouplingPoint')}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="network" className="space-y-4">
          <TabsList>
            <TabsTrigger value="network">{t('decouplingNetwork')}</TabsTrigger>
            <TabsTrigger value="list">{t('listView')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="network" className="space-y-4">
            {loading ? (
              <div className="flex h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <DecouplingNetworkBoard network={network} />
            )}
          </TabsContent>
          
          <TabsContent value="list">
            {loading ? (
              <div className="flex h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('name')}</TableHead>
                    <TableHead>{t('locationId')}</TableHead>
                    <TableHead>{t('type')}</TableHead>
                    <TableHead>{t('description')}</TableHead>
                    <TableHead>{t('actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {points.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        {t('noDecouplingPoints')}
                      </TableCell>
                    </TableRow>
                  ) : (
                    points.map((point) => (
                      <TableRow key={point.id}>
                        <TableCell className="font-medium">{point.name}</TableCell>
                        <TableCell>{point.locationId}</TableCell>
                        <TableCell className="capitalize">
                          {t(`${point.type}DecouplingPoint`)}
                        </TableCell>
                        <TableCell>{point.description || "-"}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleEditDecouplingPoint(point)}
                            >
                              {t('edit')}
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm" 
                              onClick={() => handleDeleteDecouplingPoint(point)}
                            >
                              {t('delete')}
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
