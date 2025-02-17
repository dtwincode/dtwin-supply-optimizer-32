
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface SavedFilesProps {
  triggerRefresh: number;
  hierarchyType: string;
}

export function SavedFiles({ triggerRefresh, hierarchyType }: SavedFilesProps) {
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('permanent_hierarchy_files')
          .select('*')
          .eq('hierarchy_type', hierarchyType)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setFiles(data || []);
      } catch (error) {
        console.error('Error fetching files:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch saved files"
        });
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchFiles();
    }
  }, [user, triggerRefresh, hierarchyType, toast]);

  if (loading) {
    return (
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold mb-6">Saved Files</h2>
        <p className="text-sm text-muted-foreground">Loading saved files...</p>
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold mb-6">Saved Files</h2>
        <p className="text-sm text-muted-foreground">No saved files found.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-semibold mb-6">Saved Files</h2>
      <div className="space-y-4">
        {files.map((file) => (
          <div
            key={file.id}
            className="rounded-lg bg-gray-50 p-4"
          >
            <h3 className="text-base font-medium text-gray-900">
              {file.original_name}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {new Date(file.created_at).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
