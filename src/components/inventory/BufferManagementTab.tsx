
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useBufferProfiles } from "@/hooks/useBufferProfiles";
import { BufferProfileDialog } from "./BufferProfileDialog";
import { Loader2, RefreshCw, PlusCircle } from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow,
} from "@/components/ui/table";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { BufferProfile } from "@/types/inventory";
import { getActiveBufferConfig } from "@/services/inventoryService";
import { BufferVisualizer } from "./BufferVisualizer";
import { useI18n } from "@/contexts/I18nContext";

export const BufferManagementTab = () => {
  const { profiles, loading, fetchProfiles, createOrUpdateProfile } = useBufferProfiles();
  const { toast } = useToast();
  const { t } = useI18n();
  const [selectedProfile, setSelectedProfile] = useState<BufferProfile | undefined>(undefined);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeConfig, setActiveConfig] = useState<any>(null);
  const [loadingConfig, setLoadingConfig] = useState(false);

  // Fetch active buffer configuration
  useEffect(() => {
    const fetchActiveConfig = async () => {
      setLoadingConfig(true);
      try {
        const config = await getActiveBufferConfig();
        setActiveConfig(config);
      } catch (error) {
        console.error('Error fetching active buffer configuration:', error);
        toast({
          title: t("common.error"),
          description: t("common.inventory.errorLoadingConfig"),
          variant: "destructive",
        });
      } finally {
        setLoadingConfig(false);
      }
    };

    fetchActiveConfig();
  }, [toast, t]);

  const handleEditProfile = (profile: BufferProfile) => {
    setSelectedProfile(profile);
    setDialogOpen(true);
  };

  const handleCreateProfile = () => {
    setSelectedProfile(undefined);
    setDialogOpen(true);
  };

  const handleSuccess = () => {
    fetchProfiles();
    toast({
      title: t("common.success"),
      description: t("common.inventory.bufferProfileSaved"),
    });
  };

  const getVariabilityLabel = (factor: string) => {
    switch (factor) {
      case 'high_variability': return { label: t("common.inventory.high"), color: 'bg-red-500' };
      case 'medium_variability': return { label: t("common.inventory.medium"), color: 'bg-yellow-500' };
      case 'low_variability': return { label: t("common.inventory.low"), color: 'bg-green-500' };
      default: return { label: t("common.inventory.unknown"), color: 'bg-gray-500' };
    }
  };

  const getLeadTimeLabel = (factor: string) => {
    switch (factor) {
      case 'long': return { label: t("common.inventory.long"), color: 'bg-red-500' };
      case 'medium': return { label: t("common.inventory.medium"), color: 'bg-yellow-500' };
      case 'short': return { label: t("common.inventory.short"), color: 'bg-green-500' };
      default: return { label: t("common.inventory.unknown"), color: 'bg-gray-500' };
    }
  };

  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{t("common.inventory.bufferManagement")}</CardTitle>
          <CardDescription>
            {t("common.inventory.bufferManagementDesc")}
          </CardDescription>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => fetchProfiles()}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            {t("common.refresh")}
          </Button>
          <Button 
            size="sm" 
            onClick={handleCreateProfile}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            {t("common.inventory.createBufferProfile")}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="profiles" className="space-y-4">
          <TabsList>
            <TabsTrigger value="profiles">{t("common.inventory.bufferProfiles")}</TabsTrigger>
            <TabsTrigger value="config">{t("common.inventory.bufferConfiguration")}</TabsTrigger>
            <TabsTrigger value="simulation">{t("common.inventory.bufferSimulation")}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profiles" className="space-y-4">
            {loading ? (
              <div className="flex h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">{t("common.inventory.name")}</TableHead>
                    <TableHead>{t("common.inventory.description")}</TableHead>
                    <TableHead>{t("common.inventory.variabilityLevel")}</TableHead>
                    <TableHead>{t("common.inventory.leadTime")}</TableHead>
                    <TableHead>{t("common.inventory.moq")}</TableHead>
                    <TableHead>{t("common.inventory.lotSizeFactor")}</TableHead>
                    <TableHead>{t("common.inventory.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {profiles.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        {t("common.inventory.noBufferProfiles")}
                      </TableCell>
                    </TableRow>
                  ) : (
                    profiles.map((profile) => {
                      const variability = getVariabilityLabel(profile.variabilityFactor);
                      const leadTime = getLeadTimeLabel(profile.leadTimeFactor);
                      
                      return (
                        <TableRow key={profile.id}>
                          <TableCell className="font-medium">{profile.name}</TableCell>
                          <TableCell>{profile.description || "-"}</TableCell>
                          <TableCell>
                            <Badge className={variability.color + " text-white"}>
                              {variability.label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={leadTime.color + " text-white"}>
                              {leadTime.label}
                            </Badge>
                          </TableCell>
                          <TableCell>{profile.moq || "-"}</TableCell>
                          <TableCell>{profile.lotSizeFactor || "-"}</TableCell>
                          <TableCell>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleEditProfile(profile)}
                            >
                              {t("common.edit")}
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            )}
          </TabsContent>
          
          <TabsContent value="config">
            {loadingConfig ? (
              <div className="flex h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">{t("common.inventory.leadTimeFactors")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">{t("common.inventory.short")}</span>
                          <span className="font-medium">{activeConfig?.shortLeadTimeFactor || "-"}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">{t("common.inventory.medium")}</span>
                          <span className="font-medium">{activeConfig?.mediumLeadTimeFactor || "-"}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">{t("common.inventory.long")}</span>
                          <span className="font-medium">{activeConfig?.longLeadTimeFactor || "-"}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">{t("common.inventory.leadTimeThresholds")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">{t("common.inventory.short")}</span>
                          <span className="font-medium">≤ {activeConfig?.shortLeadTimeThreshold || "-"}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">{t("common.inventory.medium")}</span>
                          <span className="font-medium">≤ {activeConfig?.mediumLeadTimeThreshold || "-"}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">{t("common.inventory.long")}</span>
                          <span className="font-medium">&gt; {activeConfig?.mediumLeadTimeThreshold || "-"}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">{t("common.inventory.otherFactors")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">{t("common.inventory.replenishmentTime")}</span>
                          <span className="font-medium">{activeConfig?.replenishmentTimeFactor || "-"}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">{t("common.zones.green")}</span>
                          <span className="font-medium">{activeConfig?.greenZoneFactor || "-"}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">{t("common.inventory.industry")}</span>
                          <span className="font-medium capitalize">{activeConfig?.industry?.replace('_', ' ') || "-"}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="simulation">
            <div className="space-y-6">
              <div className="flex flex-col space-y-1.5">
                <h3 className="text-lg font-semibold">{t("common.inventory.bufferSimulation")}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("common.inventory.bufferSimulationDesc")}
                </p>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">{t("common.inventory.adu")}</label>
                  <Select defaultValue="100">
                    <SelectTrigger>
                      <SelectValue placeholder={t("common.inventory.selectADU")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10 {t("common.inventory.unitsPerDay")}</SelectItem>
                      <SelectItem value="50">50 {t("common.inventory.unitsPerDay")}</SelectItem>
                      <SelectItem value="100">100 {t("common.inventory.unitsPerDay")}</SelectItem>
                      <SelectItem value="500">500 {t("common.inventory.unitsPerDay")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1.5 block">{t("common.inventory.leadTime")}</label>
                  <Select defaultValue="14">
                    <SelectTrigger>
                      <SelectValue placeholder={t("common.inventory.selectLeadTime")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 {t("common.inventory.days")} ({t("common.inventory.short")})</SelectItem>
                      <SelectItem value="14">14 {t("common.inventory.days")} ({t("common.inventory.medium")})</SelectItem>
                      <SelectItem value="30">30 {t("common.inventory.days")} ({t("common.inventory.long")})</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1.5 block">{t("common.inventory.variabilityFactor")}</label>
                  <Select defaultValue="1.0">
                    <SelectTrigger>
                      <SelectValue placeholder={t("common.inventory.selectVariability")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0.7">{t("common.inventory.low")} (0.7)</SelectItem>
                      <SelectItem value="1.0">{t("common.inventory.medium")} (1.0)</SelectItem>
                      <SelectItem value="1.3">{t("common.inventory.high")} (1.3)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Card className="p-6">
                <h4 className="text-sm font-medium mb-4">{t("common.inventory.simulatedBufferVisualization")}</h4>
                <BufferVisualizer 
                  bufferZones={{ red: 1400, yellow: 1400, green: 700 }}
                  netFlowPosition={2100}
                  adu={100}
                />
              </Card>
            </div>
          </TabsContent>
        </Tabs>
        
        <BufferProfileDialog
          existingProfile={selectedProfile}
          onSuccess={handleSuccess}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
        />
      </CardContent>
    </Card>
  );
};
