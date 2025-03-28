
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Download, Trash2, CheckSquare, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { FileCard } from "./FileCard";
import type { SavedFile } from "../types";

interface FileListProps {
  files: SavedFile[];
  error: string | null;
  isLoading: boolean;
  onDelete: (fileId: string) => Promise<void>;
  onDownload: (file: SavedFile) => Promise<void>;
}

export function FileList({ files, error, isLoading, onDelete, onDownload }: FileListProps) {
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const allSelected = files.length > 0 && selectedFiles.size === files.length;

  const handleToggleAll = () => {
    if (allSelected) {
      setSelectedFiles(new Set());
    } else {
      setSelectedFiles(new Set(files.map(file => file.id)));
    }
  };

  const handleToggleFile = (fileId: string) => {
    const newSelected = new Set(selectedFiles);
    if (newSelected.has(fileId)) {
      newSelected.delete(fileId);
    } else {
      newSelected.add(fileId);
    }
    setSelectedFiles(newSelected);
  };

  const handleBulkDelete = async () => {
    try {
      // Create an array of promises for each deletion
      const deletePromises = Array.from(selectedFiles).map(fileId => onDelete(fileId));
      
      // Wait for all deletions to complete
      await Promise.all(deletePromises);
      
      // Clear selection after successful deletion
      setSelectedFiles(new Set());
    } catch (error) {
      console.error('Error in bulk delete:', error);
    }
  };

  const handleBulkDownload = async () => {
    for (const fileId of selectedFiles) {
      const file = files.find(f => f.id === fileId);
      if (file) {
        await onDownload(file);
      }
    }
  };

  if (error) {
    return (
      <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {error}
        </AlertDescription>
      </Alert>
    );
  }

  if (files.length === 0) {
    return null;
  }

  return (
    <Card className="p-6 mt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Saved Files</h3>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleAll}
            disabled={isLoading || files.length === 0}
            className="flex items-center gap-2"
          >
            {allSelected ? (
              <CheckSquare className="h-4 w-4" />
            ) : (
              <Square className="h-4 w-4" />
            )}
            Select All
          </Button>
          
          {selectedFiles.size > 0 && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBulkDownload}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download Selected
              </Button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2 text-destructive hover:text-destructive"
                    disabled={isLoading}
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete Selected
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Selected Files</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete {selectedFiles.size} selected files? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleBulkDelete}
                      className="bg-destructive hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
        </div>
      </div>
      
      <div className="space-y-4">
        {files.map((file) => (
          <FileCard
            key={file.id}
            file={file}
            isLoading={isLoading}
            onDelete={onDelete}
            onDownload={onDownload}
            isSelected={selectedFiles.has(file.id)}
            onToggleSelect={() => handleToggleFile(file.id)}
          />
        ))}
      </div>
    </Card>
  );
}
