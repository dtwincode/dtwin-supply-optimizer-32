
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SavedFile } from '../location-hierarchy/types';

interface SavedFilesProps {
  triggerRefresh?: number;
  hierarchyType: string;
}

export const SavedFiles = ({ triggerRefresh = 0, hierarchyType }: SavedFilesProps) => {
  const [data, setData] = useState<SavedFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Query the hierarchy_file_references table
        const { data: files, error } = await supabase
          .from('hierarchy_file_references')
          .select('*')
          .eq('hierarchy_type', hierarchyType)
          .order('created_at', { ascending: false });

        if (error) {
          console.error("Error fetching data:", error);
          setError("Failed to load data.");
        } else {
          setData(files as any || []);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [triggerRefresh, hierarchyType]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-semibold mb-4">Saved {hierarchyType} Files</h1>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>File Name</TableHead>
              <TableHead>Original Name</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((file) => (
              <TableRow key={file.id}>
                <TableCell>{file.file_name}</TableCell>
                <TableCell>{file.original_name}</TableCell>
                <TableCell>{file.created_at}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onSelect={() => {
                          // Handle download logic here
                          console.log("Download clicked for file:", file.id);
                        }}
                      >
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={() => {
                          // Handle delete logic here
                          console.log("Delete clicked for file:", file.id);
                        }}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
