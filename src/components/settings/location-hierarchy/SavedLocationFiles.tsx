import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
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

interface SavedFile {
  id: string;
  file_name: string;
  original_name: string;
  created_at: string;
  hierarchy_type: string;
  created_by: string;
  storage_path: string;
  updated_at: string;
}

export const SavedLocationFiles = () => {
  const [data, setData] = useState<SavedFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: files, error } = await supabase
          .from('location_hierarchy_files')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error("Error fetching data:", error);
          setError("Failed to load data.");
        } else {
          setData(files ? files.map(item => ({ 
            id: item.id, 
            file_name: item.file_name, 
            original_name: item.original_name, 
            created_at: item.created_at,
            hierarchy_type: item.hierarchy_type,
            created_by: item.created_by,
            storage_path: item.storage_path,
            updated_at: item.updated_at,
          })) : []);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-semibold mb-4">Saved Location Hierarchy Files</h1>
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
                          // Handle download logic here, e.g., trigger a download
                          console.log("Download clicked for file:", file.id);
                        }}
                      >
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={() => {
                          // Handle delete logic here, e.g., show a confirmation dialog
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
