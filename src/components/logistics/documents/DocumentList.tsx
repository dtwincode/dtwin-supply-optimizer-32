
import { useEffect, useState } from 'react';
import { LogisticsDocument, getDocuments } from '@/services/logisticsDocumentService';
import { useToast } from '@/hooks/use-toast';
import { ExternalLink, File, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DocumentListProps {
  orderId: string;
}

export const DocumentList = ({ orderId }: DocumentListProps) => {
  const [documents, setDocuments] = useState<LogisticsDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchDocuments = async () => {
    try {
      const docs = await getDocuments(orderId);
      setDocuments(docs);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch documents"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No documents found
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {documents.map((doc) => (
        <div 
          key={doc.id} 
          className="flex items-center justify-between p-4 border rounded-lg"
        >
          <div className="flex items-center space-x-3">
            <File className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">{doc.document_type}</p>
              <p className="text-sm text-muted-foreground">
                Version {doc.version} • {new Date(doc.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
          {doc.file_url && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => window.open(doc.file_url as string, '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View
            </Button>
          )}
        </div>
      ))}
    </div>
  );
};
