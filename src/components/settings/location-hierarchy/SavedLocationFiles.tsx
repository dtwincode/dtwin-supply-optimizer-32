
import React, { useState, useEffect } from 'react';
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
import { SavedFile } from './types';

interface SavedLocationFilesProps {
  triggerRefresh?: number;
}

export const SavedLocationFiles = ({ triggerRefresh = 0 }: SavedLocationFilesProps) => {
  const [data, setData] = useState<SavedFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Mock data for testing - in a real app this would be a DB call
        const mockData: SavedFile[] = [
          {
            id: '1',
            file_name: 'location_hierarchy_main.csv',
            original_name: 'location_data.csv',
            created_at: new Date().toISOString(),
            created_by: 'admin',
            data: {},
            hierarchy_type: 'location_hierarchy',
            selected_columns: ['region', 'country', 'city']
          },
          {
            id: '2',
            file_name: 'warehouse_locations.csv',
            original_name: 'warehouses.csv',
            created_at: new Date().toISOString(),
            created_by: 'admin',
            data: {},
            hierarchy_type: 'location_hierarchy',
            selected_columns: ['warehouse_id', 'name', 'address']
          }
        ];
        
        setData(mockData);
        setError(null);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [triggerRefresh]);

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
