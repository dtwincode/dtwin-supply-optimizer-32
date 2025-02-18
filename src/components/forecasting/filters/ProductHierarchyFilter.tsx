
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Loader2, FileInput, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogFooter } from "@/components/ui/alert-dialog";
import { useLocalStorage } from "@/hooks/use-local-storage";

interface HierarchyData {
  [key: string]: string;
}

interface HierarchyState {
  [level: string]: {
    selected: string;
    values: string[];
  };
}

export function ProductHierarchyFilter() {
  const { toast } = useToast();
  const [fileToDelete, setFileToDelete] = useState<string | null>(null);
  const [isLoadingHierarchy, setIsLoadingHierarchy] = useState(false);
  
  // Use localStorage for hierarchy state with product-specific keys
  const [hierarchyState, setHierarchyState] = useLocalStorage<HierarchyState>("productHierarchyState", {});
  const [hierarchyLevels, setHierarchyLevels] = useLocalStorage<string[]>("productHierarchyLevels", []);
  const [hasActiveHierarchy, setHasActiveHierarchy] = useLocalStorage<boolean>("productHasActiveHierarchy", false);

  const clearHierarchyState = () => {
    setHasActiveHierarchy(false);
    setHierarchyLevels([]);
    setHierarchyState({});
  };

  const {
    data: savedFiles,
    isLoading: isLoadingFiles,
    refetch: refetchFiles
  } = useQuery({
    queryKey: ['saved-product-hierarchies'],
    queryFn: async () => {
      const { data: files, error } = await supabase
        .from('permanent_hierarchy_files')
        .select('*')
        .eq('hierarchy_type', 'product_hierarchy')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching saved hierarchies:', error);
        return [];
      }

      return files || [];
    }
  });

  const fetchActiveHierarchy = async () => {
    setIsLoadingHierarchy(true);
    try {
      const { data: activeVersionData, error: versionError } = await supabase
        .from('permanent_hierarchy_data')
        .select('data')
        .eq('hierarchy_type', 'product_hierarchy')
        .eq('is_active', true)
        .maybeSingle();

      if (versionError || !activeVersionData?.data || !Array.isArray(activeVersionData.data)) {
        clearHierarchyState();
        return;
      }

      const hierarchyData = activeVersionData.data as HierarchyData[];
      if (hierarchyData.length === 0) {
        clearHierarchyState();
        return;
      }

      const columns = Object.keys(hierarchyData[0]);
      const newHierarchyState: HierarchyState = {};
      
      columns.forEach(column => {
        const uniqueValues = new Set(hierarchyData.map(row => row[column]).filter(Boolean));
        newHierarchyState[column] = {
          selected: column,
          values: Array.from(uniqueValues).sort()
        };
      });

      setHierarchyLevels(columns);
      setHierarchyState(newHierarchyState);
      setHasActiveHierarchy(true);
    } catch (error) {
      console.error('Error fetching hierarchy:', error);
      clearHierarchyState();
    } finally {
      setIsLoadingHierarchy(false);
    }
  };

  const handleLevelChange = (level: string, value: string) => {
    setHierarchyState(prev => ({
      ...prev,
      [level]: {
        ...prev[level],
        selected: value
      }
    }));
  };

  const handleImportHierarchy = async (fileId: string) => {
    setIsLoadingHierarchy(true);
    try {
      const { data: fileData, error: fileError } = await supabase
        .from('permanent_hierarchy_files')
        .select('data')
        .eq('id', fileId)
        .single();

      if (fileError) throw fileError;

      const { data: versionData } = await supabase
        .from('permanent_hierarchy_data')
        .select('version')
        .eq('hierarchy_type', 'product_hierarchy')
        .order('version', { ascending: false })
        .limit(1)
        .single();

      const nextVersion = (versionData?.version || 0) + 1;

      await supabase
        .from('permanent_hierarchy_data')
        .update({ is_active: false })
        .eq('hierarchy_type', 'product_hierarchy');

      const { error: insertError } = await supabase
        .from('permanent_hierarchy_data')
        .insert({
          hierarchy_type: 'product_hierarchy',
          data: fileData.data,
          is_active: true,
          version: nextVersion,
          source_upload_id: fileId
        });

      if (insertError) throw insertError;

      await fetchActiveHierarchy();

      toast({
        title: "Success",
        description: "Product hierarchy imported successfully"
      });
    } catch (error) {
      console.error('Error importing hierarchy:', error);
      clearHierarchyState();
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to import product hierarchy"
      });
    } finally {
      setIsLoadingHierarchy(false);
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
        clearHierarchyState();
      }

      await refetchFiles();

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

  if (isLoadingFiles || isLoadingHierarchy) {
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
        <h3 className="text-lg font-medium">Product Filters</h3>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <FileInput className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              {savedFiles && savedFiles.length > 0 ? (
                savedFiles.map(file => (
                  <DropdownMenuItem 
                    key={file.id}
                    onSelect={() => handleImportHierarchy(file.id)}
                  >
                    {file.original_name}
                  </DropdownMenuItem>
                ))
              ) : (
                <DropdownMenuItem disabled>
                  No saved files
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              {savedFiles && savedFiles.length > 0 ? (
                savedFiles.map(file => (
                  <DropdownMenuItem 
                    key={file.id}
                    className="flex items-center justify-between"
                    onSelect={(e) => {
                      e.preventDefault();
                      setFileToDelete(file.id);
                    }}
                  >
                    <span>{file.original_name}</span>
                    <Trash2 className="h-4 w-4 text-destructive ml-2" />
                  </DropdownMenuItem>
                ))
              ) : (
                <DropdownMenuItem disabled>
                  No saved files
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {!hasActiveHierarchy ? (
        <div className="flex items-center justify-center p-4">
          <p className="text-sm text-muted-foreground">No active hierarchy. Please select a file to import.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {hierarchyLevels.map(level => (
            <div key={level} className="space-y-2">
              <label htmlFor={level} className="text-sm font-medium text-muted-foreground">
                {level}
              </label>
              <Select
                value={hierarchyState[level]?.selected || level}
                onValueChange={value => handleLevelChange(level, value)}
                disabled={!hierarchyState[level]?.values.length}
              >
                <SelectTrigger id={level}>
                  <SelectValue placeholder={level} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={level}>{level}</SelectItem>
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
