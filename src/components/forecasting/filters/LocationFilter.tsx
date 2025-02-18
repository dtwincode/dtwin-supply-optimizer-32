import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Loader2, FileInput, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogFooter } from "@/components/ui/alert-dialog";

interface HierarchyData {
  [key: string]: string;
}

interface HierarchyState {
  [level: string]: {
    selected: string;
    values: string[];
  };
}

export function LocationFilter() {
  const { toast } = useToast();
  const [hierarchyState, setHierarchyState] = useState<HierarchyState>({});
  const [hierarchyLevels, setHierarchyLevels] = useState<string[]>([]);
  const [hasActiveHierarchy, setHasActiveHierarchy] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<string | null>(null);

  const {
    data: locationsData,
    isLoading,
    refetch
  } = useQuery({
    queryKey: ['locations', 'hierarchy'],
    queryFn: async () => {
      const { data: activeVersionData, error: versionError } = await supabase
        .from('permanent_hierarchy_data')
        .select('data')
        .eq('hierarchy_type', 'location_hierarchy')
        .eq('is_active', true)
        .maybeSingle();

      if (versionError) {
        console.error('Error fetching location hierarchy:', versionError);
        setHasActiveHierarchy(false);
        return null;
      }

      if (!activeVersionData?.data || !Array.isArray(activeVersionData.data)) {
        setHasActiveHierarchy(false);
        return null;
      }

      try {
        const hierarchyData = activeVersionData.data as HierarchyData[];
        if (hierarchyData.length > 0) {
          setHasActiveHierarchy(true);
          const columns = Object.keys(hierarchyData[0]);
          setHierarchyLevels(columns);

          const newHierarchyState: HierarchyState = {};
          columns.forEach(column => {
            const uniqueValues = new Set(hierarchyData.map(row => row[column]).filter(Boolean));
            newHierarchyState[column] = {
              selected: 'all',
              values: Array.from(uniqueValues).sort()
            };
          });
          setHierarchyState(newHierarchyState);
          return hierarchyData;
        }
      } catch (error) {
        console.error('Error processing location hierarchy data:', error);
      }
      
      setHasActiveHierarchy(false);
      return null;
    }
  });

  const {
    data: savedFiles,
    isLoading: isLoadingFiles,
    refetch: refetchFiles
  } = useQuery({
    queryKey: ['saved-location-hierarchies'],
    queryFn: async () => {
      console.log('Fetching saved location hierarchy files...');
      const { data: files, error } = await supabase
        .from('permanent_hierarchy_files')
        .select('*')
        .eq('hierarchy_type', 'location_hierarchy')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching saved hierarchies:', error);
        return [];
      }

      console.log('Retrieved files:', files);
      return files || [];
    }
  });

  const handleLevelChange = (level: string, value: string) => {
    setHierarchyState(prev => {
      const newState = { ...prev };
      newState[level].selected = value;
      return newState;
    });
  };

  const handleImportHierarchy = async (fileId: string) => {
    try {
      const { data: fileData, error: fileError } = await supabase
        .from('permanent_hierarchy_files')
        .select('data')
        .eq('id', fileId)
        .single();

      if (fileError) throw fileError;

      const { data: versionData, error: versionError } = await supabase
        .from('permanent_hierarchy_data')
        .select('version')
        .eq('hierarchy_type', 'location_hierarchy')
        .order('version', { ascending: false })
        .limit(1)
        .single();

      const nextVersion = (versionData?.version || 0) + 1;

      await supabase
        .from('permanent_hierarchy_data')
        .update({ is_active: false })
        .eq('hierarchy_type', 'location_hierarchy');

      const { error: insertError } = await supabase
        .from('permanent_hierarchy_data')
        .insert({
          hierarchy_type: 'location_hierarchy',
          data: fileData.data,
          is_active: true,
          version: nextVersion,
          source_upload_id: fileId
        });

      if (insertError) throw insertError;

      setHierarchyState({});
      setHierarchyLevels([]);
      await refetch();

      toast({
        title: "Success",
        description: "Location hierarchy imported successfully"
      });
    } catch (error) {
      console.error('Error importing hierarchy:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to import location hierarchy"
      });
    }
  };

  const handleDeleteFile = async (fileId: string) => {
    try {
      const { data: activeData } = await supabase
        .from('permanent_hierarchy_data')
        .select('id')
        .eq('source_upload_id', fileId)
        .eq('is_active', true)
        .single();

      const { error: deleteError } = await supabase
        .from('permanent_hierarchy_files')
        .delete()
        .eq('id', fileId);

      if (deleteError) throw deleteError;

      if (activeData) {
        setHierarchyState({});
        setHierarchyLevels([]);
        setHasActiveHierarchy(false);
      }

      await refetchFiles();
      await refetch();

      toast({
        title: "Success",
        description: "File deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting file:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete file"
      });
    } finally {
      setFileToDelete(null);
    }
  };

  if (isLoading || isLoadingFiles) {
    return (
      <div className="w-full">
        <div className="flex items-center justify-center space-x-2">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Location Filters</h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <FileInput className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            {savedFiles && savedFiles.length > 0 ? (
              savedFiles.map(file => (
                <div key={file.id} className="flex items-center justify-between px-2 py-1.5 hover:bg-accent">
                  <button
                    className="flex-1 text-left text-sm"
                    onClick={() => handleImportHierarchy(file.id)}
                  >
                    {file.original_name}
                  </button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 p-1 ml-2 hover:bg-destructive/10"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFileToDelete(file.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-destructive hover:text-destructive" />
                  </Button>
                </div>
              ))
            ) : (
              <DropdownMenuItem disabled>
                No saved files
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {!hasActiveHierarchy ? (
        <div className="flex items-center justify-center p-4">
          <p className="text-sm text-muted-foreground">No active hierarchy. Please select a file to import.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {hierarchyLevels.map(level => (
            <div key={level}>
              <Select
                value={hierarchyState[level]?.selected || 'all'}
                onValueChange={value => handleLevelChange(level, value)}
                disabled={!hierarchyState[level]?.values.length}
              >
                <SelectTrigger>
                  <SelectValue placeholder={level} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {hierarchyState[level]?.values.map(value => (
                    <SelectItem key={value} value={value}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
      )}

      <AlertDialog open={!!fileToDelete} onOpenChange={() => setFileToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete File</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this file? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => fileToDelete && handleDeleteFile(fileToDelete)}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
