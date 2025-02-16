
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LocationHierarchyUpload } from "@/components/settings/location-hierarchy/LocationHierarchyUpload";
import { ProductHierarchyUpload } from "@/components/settings/product-hierarchy/ProductHierarchyUpload";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
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
        .neq('id', ''); // Delete all temporary uploads

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
            <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
            <p className="text-muted-foreground mt-2">
              Manage your hierarchies and system configurations
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
            <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
              <TabsTrigger value="location">Location Hierarchy</TabsTrigger>
              <TabsTrigger value="product">Product Hierarchy</TabsTrigger>
            </TabsList>

            <TabsContent value="location" className="space-y-4">
              <LocationHierarchyUpload />
            </TabsContent>

            <TabsContent value="product" className="space-y-4">
              <ProductHierarchyUpload />
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
