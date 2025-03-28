
import { supabase } from '@/integrations/supabase/client';

export interface LogisticsDocument {
  id: string;
  order_id: string;
  document_type: string;
  file_url: string | null;
  status: string | null;
  metadata: Record<string, any>;
  version: number;
  created_at: string;
}

interface DocumentUploadResult {
  success: boolean;
  error?: string;
}

export const getDocuments = async (orderId: string) => {
  const { data, error } = await supabase
    .from('logistics_documents')
    .select('*')
    .eq('order_id', orderId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as LogisticsDocument[];
};

export const uploadDocument = async (file: File): Promise<DocumentUploadResult> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `logistics-docs/${Date.now()}_${file.name}`;
    
    // Upload the file to storage
    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(fileName, file);

    if (uploadError) {
      console.error('Error uploading file:', uploadError);
      return { success: false, error: uploadError.message };
    }

    // For now, just return success since we don't have the actual database connection
    // In a real app, you would also update the database with document metadata
    return { success: true };
  } catch (error) {
    console.error('Error in document upload:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error during upload' 
    };
  }
};
