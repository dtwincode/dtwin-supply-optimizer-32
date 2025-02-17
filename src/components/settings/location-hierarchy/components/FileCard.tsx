
import { Download, Trash2, CheckSquare, Square } from "lucide-react";
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
import type { SavedFile } from "../types";

interface FileCardProps {
  file: SavedFile;
  isLoading: boolean;
  isSelected: boolean;
  onDelete: (fileId: string) => Promise<void>;
  onDownload: (file: SavedFile) => Promise<void>;
  onToggleSelect: () => void;
}

export function FileCard({ 
  file, 
  isLoading, 
  isSelected, 
  onDelete, 
  onDownload, 
  onToggleSelect 
}: FileCardProps) {
  return (
    <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSelect}
          disabled={isLoading}
          className="h-8 w-8"
        >
          {isSelected ? (
            <CheckSquare className="h-4 w-4" />
          ) : (
            <Square className="h-4 w-4" />
          )}
        </Button>
        <div>
          <p className="font-medium">{file.original_name}</p>
          <p className="text-sm text-muted-foreground">
            {new Date(file.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDownload(file)}
          disabled={isLoading}
          className="h-8 w-8 hover:bg-primary/10"
        >
          <Download className="h-4 w-4 text-primary stroke-[1.5]" />
        </Button>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-destructive/10"
              disabled={isLoading}
            >
              <Trash2 className="h-4 w-4 text-destructive stroke-[1.5]" />
            </Button>
          </AlertDialogTrigger>
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
                onClick={() => onDelete(file.id)}
                className="bg-destructive hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
