
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LocationHierarchyUpload } from "@/components/settings/location-hierarchy/LocationHierarchyUpload";
import { ProductHierarchyUpload } from "@/components/settings/product-hierarchy/ProductHierarchyUpload";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useState } from "react";
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

  // Query to check if there are any temporary uploads
  const { data: tempUploadsCount, isLoading: isCheckingUploads } = useQuery({
    queryKey: ['tempUploadsCount'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('temp_hierarchy_uploads')
        .select('*', { count: 'exact', head: true });
      
      if (error) throw error;
      return data?.length || 0;
    }
  });

  const handleDeleteTempUploads = async () => {
    setIsDeleting(true);
    try {
      // Get all temporary uploads first
      const { data: uploads, error: fetchError } = await supabase
        .from('temp_hierarchy_uploads')
        .select('id');

      if (fetchError) throw fetchError;

      if (!uploads || uploads.length === 0) {
        toast({
          title: "Info",
          description: "No temporary uploads to delete",
        });
        return;
      }

      // Delete the temporary uploads
      const { error: deleteError } = await supabase
        .from('temp_hierarchy_uploads')
        .delete()
        .in('id', uploads.map(u => u.id));

      if (deleteError) throw deleteError;

      queryClient.invalidateQueries({ queryKey: ['hierarchyData'] });
      queryClient.invalidateQueries({ queryKey: ['tempUploadsCount'] });
      
      toast({
        title: "Success",
        description: `Successfully deleted ${uploads.length} temporary upload${uploads.length === 1 ? '' : 's'}`,
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
          {!isCheckingUploads && tempUploadsCount > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  size="sm"
                  className="h-9 px-4"
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4 mr-2" />
                  )}
                  Delete All Temporary Uploads
                  {tempUploadsCount > 0 && ` (${tempUploadsCount})`}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete All Temporary Uploads</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete {tempUploadsCount} temporary upload{tempUploadsCount === 1 ? '' : 's'}? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteTempUploads}
                    className="bg-destructive hover:bg-destructive/90"
                  >
                    {isDeleting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      'Delete All'
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
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
