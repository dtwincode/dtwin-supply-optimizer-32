
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

export const getDocuments = async (orderId: string) => {
  const { data, error } = await supabase
    .from('logistics_documents')
    .select('*')
    .eq('order_id', orderId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as LogisticsDocument[];
};

export const uploadDocument = async (
  orderId: string,
  documentType: string,
  file: File
) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${orderId}/${documentType}_${Date.now()}.${fileExt}`;
  
  // First, ensure the bucket exists
  const { data: bucketData, error: bucketError } = await supabase
    .storage
    .createBucket('logistics-documents', { public: true });

  if (bucketError && !bucketError.message.includes('already exists')) {
    throw bucketError;
  }

  const { error: uploadError } = await supabase.storage
    .from('logistics-documents')
    .upload(fileName, file);

  if (uploadError) throw uploadError;

  const { data: urlData } = supabase.storage
    .from('logistics-documents')
    .getPublicUrl(fileName);

  const { error: dbError } = await supabase
    .from('logistics_documents')
    .insert({
      order_id: orderId,
      document_type: documentType,
      file_url: urlData.publicUrl,
      status: 'active',
      metadata: { original_name: file.name }
    });

  if (dbError) throw dbError;
};
