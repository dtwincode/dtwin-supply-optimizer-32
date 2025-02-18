import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Card } from "@/components/ui/card";
import { Loader2, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
interface HierarchyData {
  [key: string]: string;
}
interface HierarchyState {
  [level: string]: {
    selected: string;
    values: string[];
    label: string;
  };
}
export function LocationFilter() {
  const {
    toast
  } = useToast();
  const [hierarchyState, setHierarchyState] = useState<HierarchyState>({});
  const [hierarchyLevels, setHierarchyLevels] = useState<string[]>([]);
  const [hasActiveHierarchy, setHasActiveHierarchy] = useState(false);
  const [deleteFileId, setDeleteFileId] = useState<string | null>(null);
  const {
    data: locationsData,
    isLoading,
    refetch
  } = useQuery({
    queryKey: ['locations', 'hierarchy'],
    queryFn: async () => {
      const {
        data: activeVersionData,
        error: versionError
      } = await supabase.from('permanent_hierarchy_data').select('data, source_upload_id').eq('hierarchy_type', 'location_hierarchy').eq('is_active', true).maybeSingle();
      if (versionError || !activeVersionData?.data || !Array.isArray(activeVersionData.data)) {
        console.error('Error fetching location hierarchy:', versionError);
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
              values: Array.from(uniqueValues).sort(),
              label: column
            };
          });
          if (activeVersionData.source_upload_id) {
            const {
              data: sourceFile
            } = await supabase.from('permanent_hierarchy_files').select('metadata').eq('id', activeVersionData.source_upload_id).maybeSingle();
            if (sourceFile?.metadata && typeof sourceFile.metadata === 'object' && 'labels' in sourceFile.metadata) {
              const labels = sourceFile.metadata.labels as Record<string, string>;
              Object.entries(labels).forEach(([column, label]) => {
                if (newHierarchyState[column]) {
                  newHierarchyState[column].label = label;
                }
              });
            }
          }
          setHierarchyState(newHierarchyState);
          return hierarchyData;
        } else {
          setHasActiveHierarchy(false);
        }
      } catch (error) {
        console.error('Error processing location hierarchy data:', error);
        setHasActiveHierarchy(false);
      }
      return null;
    }
  });
  const {
    data: savedFiles,
    refetch: refetchFiles
  } = useQuery({
    queryKey: ['saved-location-hierarchies'],
    queryFn: async () => {
      const {
        data: files,
        error
      } = await supabase.from('permanent_hierarchy_files').select('*').eq('hierarchy_type', 'location_hierarchy').order('created_at', {
        ascending: false
      });
      if (error) {
        console.error('Error fetching saved hierarchies:', error);
        return [];
      }
      return files || [];
    }
  });
  const handleLevelChange = (level: string, value: string) => {
    setHierarchyState(prev => {
      const newState = {
        ...prev
      };
      newState[level].selected = value;
      const levelIndex = hierarchyLevels.indexOf(level);
      hierarchyLevels.slice(levelIndex + 1).forEach(dependentLevel => {
        if (newState[dependentLevel]) {
          newState[dependentLevel].selected = 'all';
        }
      });
      return newState;
    });
  };
  const handleImportHierarchy = async (fileId: string) => {
    try {
      const {
        data: fileData,
        error: fileError
      } = await supabase.from('permanent_hierarchy_files').select('data, metadata').eq('id', fileId).single();
      if (fileError) throw fileError;
      const {
        data: versionData,
        error: versionError
      } = await supabase.from('permanent_hierarchy_data').select('version').eq('hierarchy_type', 'location_hierarchy').order('version', {
        ascending: false
      }).limit(1).single();
      if (versionError && !versionError.message.includes('No rows returned')) {
        throw versionError;
      }
      const nextVersion = (versionData?.version || 0) + 1;
      const {
        error: insertError
      } = await supabase.from('permanent_hierarchy_data').insert({
        hierarchy_type: 'location_hierarchy',
        data: fileData.data,
        is_active: true,
        version: nextVersion,
        source_upload_id: fileId
      });
      if (insertError) throw insertError;
      const {
        error: updateError
      } = await supabase.from('permanent_hierarchy_data').update({
        is_active: false
      }).neq('version', nextVersion).eq('hierarchy_type', 'location_hierarchy');
      if (updateError) throw updateError;
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
  const handleDeleteHierarchy = async () => {
    if (!deleteFileId) return;
    try {
      const {
        error: deleteError
      } = await supabase.from('permanent_hierarchy_files').delete().eq('id', deleteFileId);
      if (deleteError) throw deleteError;
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
      setDeleteFileId(null);
    }
  };
  if (isLoading) {
    return <Card className="p-6 w-full">
        <div className="flex items-center justify-center space-x-2">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading filters...</p>
        </div>
      </Card>;
  }
  return <Card className="p-6 w-full">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Filters</h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Settings className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              {savedFiles?.map(file => <DropdownMenuItem key={file.id} onSelect={e => {
              e.preventDefault();
              setDeleteFileId(file.id);
            }}>
                  {file.original_name}
                </DropdownMenuItem>)}
              {(!savedFiles || savedFiles.length === 0) && <DropdownMenuItem disabled>
                  No saved hierarchies
                </DropdownMenuItem>}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {!hasActiveHierarchy ? <div className="flex items-center justify-center p-4">
            <p className="text-sm text-muted-foreground">
              Import a hierarchy file to see filters
            </p>
          </div> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {hierarchyLevels.map(level => <div key={level} className="space-y-2">
                <Select value={hierarchyState[level]?.selected || 'all'} onValueChange={value => handleLevelChange(level, value)} disabled={!hierarchyState[level]?.values.length}>
                  <SelectTrigger>
                    <SelectValue placeholder={hierarchyState[level]?.label} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      All {hierarchyState[level]?.label}
                    </SelectItem>
                    {hierarchyState[level]?.values.map(value => <SelectItem key={value} value={value}>
                        {value}
                      </SelectItem>)}
                  </SelectContent>
                </Select>
              </div>)}
          </div>}
      </div>

      <AlertDialog open={!!deleteFileId} onOpenChange={() => setDeleteFileId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the hierarchy file.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteHierarchy}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>;
}