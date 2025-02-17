
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
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
      <h3 className="text-lg font-semibold mb-4">Saved Files</h3>
      <div className="space-y-4">
        {files.map((file) => (
          <FileCard
            key={file.id}
            file={file}
            isLoading={isLoading}
            onDelete={onDelete}
            onDownload={onDownload}
          />
        ))}
      </div>
    </Card>
  );
}
