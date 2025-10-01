-- Create permanent_hierarchy_files table
CREATE TABLE IF NOT EXISTS public.permanent_hierarchy_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hierarchy_type TEXT NOT NULL,
  file_name TEXT NOT NULL,
  original_name TEXT NOT NULL,
  data JSONB NOT NULL DEFAULT '[]'::jsonb,
  storage_path TEXT,
  file_type TEXT,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create permanent_hierarchy_data table
CREATE TABLE IF NOT EXISTS public.permanent_hierarchy_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hierarchy_type TEXT NOT NULL,
  data JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT false,
  version INTEGER NOT NULL DEFAULT 1,
  source_upload_id UUID REFERENCES public.permanent_hierarchy_files(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_perm_hierarchy_files_type 
  ON public.permanent_hierarchy_files(hierarchy_type);

CREATE INDEX IF NOT EXISTS idx_perm_hierarchy_files_created 
  ON public.permanent_hierarchy_files(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_perm_hierarchy_data_type_active 
  ON public.permanent_hierarchy_data(hierarchy_type, is_active);

CREATE INDEX IF NOT EXISTS idx_perm_hierarchy_data_version 
  ON public.permanent_hierarchy_data(hierarchy_type, version DESC);

-- Enable Row Level Security
ALTER TABLE public.permanent_hierarchy_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permanent_hierarchy_data ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for permanent_hierarchy_files
CREATE POLICY "Allow authenticated users to read hierarchy files"
  ON public.permanent_hierarchy_files
  FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert hierarchy files"
  ON public.permanent_hierarchy_files
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete hierarchy files"
  ON public.permanent_hierarchy_files
  FOR DELETE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update hierarchy files"
  ON public.permanent_hierarchy_files
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Create RLS policies for permanent_hierarchy_data
CREATE POLICY "Allow authenticated users to read hierarchy data"
  ON public.permanent_hierarchy_data
  FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert hierarchy data"
  ON public.permanent_hierarchy_data
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete hierarchy data"
  ON public.permanent_hierarchy_data
  FOR DELETE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update hierarchy data"
  ON public.permanent_hierarchy_data
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Add trigger for updated_at
CREATE OR REPLACE FUNCTION update_permanent_hierarchy_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_permanent_hierarchy_files_updated_at
  BEFORE UPDATE ON public.permanent_hierarchy_files
  FOR EACH ROW
  EXECUTE FUNCTION update_permanent_hierarchy_updated_at();

CREATE TRIGGER update_permanent_hierarchy_data_updated_at
  BEFORE UPDATE ON public.permanent_hierarchy_data
  FOR EACH ROW
  EXECUTE FUNCTION update_permanent_hierarchy_updated_at();