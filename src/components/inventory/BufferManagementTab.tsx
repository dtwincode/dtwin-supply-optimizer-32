import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { BufferVisualizer } from "./BufferVisualizer";
import { BufferLevelManagement } from "./BufferLevelManagement";
import { BufferStatusBadge } from "./BufferStatusBadge";
import { BufferConfigManager } from "./BufferConfigManager";
import { BufferProfileDialog } from "./BufferProfileDialog";
import { BufferProfile } from "@/types/inventory";
import { useBufferProfiles } from "@/hooks/useBufferProfiles";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, RefreshCw } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const BufferManagementTab = () => {
  const [activeTab, setActiveTab] = useState("profiles");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { profiles, loading, refresh } = useBufferProfiles();
  const { toast } = useToast();

  const handleCreateSuccess = () => {
    refresh();
    toast({
      title: "Success",
      description: "Buffer profile created successfully",
    });
    setIsCreateDialogOpen(false);
  };

  const getBadgeStatus = (variability: BufferProfile["variabilityFactor"], leadTime: BufferProfile["leadTimeFactor"]) => {
    // High variability or long lead time means higher risk
    if (variability === "high_variability" || leadTime === "long") {
      return "red";
    }
    
    // Medium variability or medium lead time means medium risk
    if (variability === "medium_variability" || leadTime === "medium") {
      return "yellow";
    }
    
    // Otherwise low risk
    return "green";
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Buffer Management</CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={refresh}
              disabled={loading}
              className="gap-1"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            <Button
              size="sm"
              onClick={() => setIsCreateDialogOpen(true)}
              className="gap-1"
            >
              <PlusCircle className="h-4 w-4" />
              New Profile
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profiles">Buffer Profiles</TabsTrigger>
            <TabsTrigger value="levels">Buffer Levels</TabsTrigger>
            <TabsTrigger value="visualize">Visualization</TabsTrigger>
            <TabsTrigger value="config">Configuration</TabsTrigger>
          </TabsList>

          <TabsContent value="profiles" className="mt-4">
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Lead Time</TableHead>
                    <TableHead>Variability</TableHead>
                    <TableHead>MOQ</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        Loading profiles...
                      </TableCell>
                    </TableRow>
                  ) : profiles.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        No buffer profiles defined
                      </TableCell>
                    </TableRow>
                  ) : (
                    profiles.map((profile) => (
                      <TableRow key={profile.id}>
                        <TableCell className="font-medium">
                          {profile.name}
                        </TableCell>
                        <TableCell>
                          {profile.leadTimeFactor.replace("_", " ")}
                        </TableCell>
                        <TableCell>
                          {profile.variabilityFactor.replace("_", " ")}
                        </TableCell>
                        <TableCell>{profile.moq || "N/A"}</TableCell>
                        <TableCell>
                          <BufferStatusBadge 
                            status={getBadgeStatus(
                              profile.variabilityFactor,
                              profile.leadTimeFactor
                            )} 
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="levels" className="mt-4">
            <BufferLevelManagement />
          </TabsContent>

          <TabsContent value="visualize" className="mt-4">
            <BufferVisualizer />
          </TabsContent>

          <TabsContent value="config" className="mt-4">
            <BufferConfigManager />
          </TabsContent>
        </Tabs>

        <BufferProfileDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          onSuccess={handleCreateSuccess}
        />
      </CardContent>
    </Card>
  );
};
