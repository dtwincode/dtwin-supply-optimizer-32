
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LocationHierarchyUpload } from "@/components/settings/location-hierarchy/LocationHierarchyUpload";
import { ProductHierarchyUpload } from "@/components/settings/product-hierarchy/ProductHierarchyUpload";
import { HistoricalSalesUpload } from "@/components/settings/historical-sales/HistoricalSalesUpload";
import { LeadTimeUpload } from "@/components/settings/lead-time/LeadTimeUpload";
import { ReplenishmentUpload } from "@/components/settings/replenishment/ReplenishmentUpload";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Trash2, Clock, Timer } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Settings = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth');
    }
  }, [user, isLoading, navigate]);

  const handleDeleteTempUploads = async () => {
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('temp_hierarchy_uploads')
        .delete()
        .is('id', null)
        .neq('id', null);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['hierarchyData'] });
      toast({
        title: "Success",
        description: "All temporary uploads deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting temporary uploads:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete temporary uploads",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-[1200px] mx-auto">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Data Management & Configuration</h2>
            <p className="text-muted-foreground mt-2">
              Configure system settings and manage data hierarchies across your organization
            </p>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                size="sm"
                className="h-9 px-4"
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete All Temporary Uploads
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete All Temporary Uploads</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete all temporary uploads? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteTempUploads}
                  className="bg-destructive hover:bg-destructive/90"
                >
                  Delete All
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <Separator className="my-6" />
        
        <Card className="p-6">
          <Tabs defaultValue="location" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 lg:w-[800px]">
              <TabsTrigger value="location">Location Hierarchy</TabsTrigger>
              <TabsTrigger value="product">Product Hierarchy</TabsTrigger>
              <TabsTrigger value="historical-sales">Historical Sales</TabsTrigger>
              <TabsTrigger value="lead-time" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Lead Time
              </TabsTrigger>
              <TabsTrigger value="replenishment-time" className="flex items-center gap-2">
                <Timer className="h-4 w-4" />
                Replenishment
              </TabsTrigger>
            </TabsList>

            <TabsContent value="location" className="space-y-4">
              <LocationHierarchyUpload />
            </TabsContent>

            <TabsContent value="product" className="space-y-4">
              <ProductHierarchyUpload />
            </TabsContent>

            <TabsContent value="historical-sales" className="space-y-4">
              <HistoricalSalesUpload />
            </TabsContent>

            <TabsContent value="lead-time" className="space-y-4">
              <LeadTimeUpload />
            </TabsContent>

            <TabsContent value="replenishment-time" className="space-y-4">
              <ReplenishmentUpload />
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
