-- Create audit log table for inventory_config changes
CREATE TABLE IF NOT EXISTS public.inventory_config_audit (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  config_id uuid NOT NULL REFERENCES public.inventory_config(id) ON DELETE CASCADE,
  config_key text NOT NULL,
  old_value numeric NOT NULL,
  new_value numeric NOT NULL,
  changed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  changed_at timestamp with time zone NOT NULL DEFAULT now(),
  change_reason text
);

-- Enable RLS on audit table
ALTER TABLE public.inventory_config_audit ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read audit logs
CREATE POLICY "Allow authenticated users to read audit logs"
ON public.inventory_config_audit
FOR SELECT
TO authenticated
USING (true);

-- Allow authenticated users to insert audit logs
CREATE POLICY "Allow authenticated users to insert audit logs"
ON public.inventory_config_audit
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Add last_updated_by column to inventory_config if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'inventory_config' 
    AND column_name = 'last_updated_by'
  ) THEN
    ALTER TABLE public.inventory_config 
    ADD COLUMN last_updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Create trigger function to log changes
CREATE OR REPLACE FUNCTION public.log_inventory_config_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Only log if config_value actually changed
  IF OLD.config_value IS DISTINCT FROM NEW.config_value THEN
    INSERT INTO public.inventory_config_audit (
      config_id,
      config_key,
      old_value,
      new_value,
      changed_by,
      changed_at
    ) VALUES (
      NEW.id,
      NEW.config_key,
      OLD.config_value,
      NEW.config_value,
      NEW.last_updated_by,
      NEW.updated_at
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger on inventory_config table
DROP TRIGGER IF EXISTS inventory_config_change_trigger ON public.inventory_config;
CREATE TRIGGER inventory_config_change_trigger
AFTER UPDATE ON public.inventory_config
FOR EACH ROW
EXECUTE FUNCTION public.log_inventory_config_change();

-- Create index for faster audit log queries
CREATE INDEX IF NOT EXISTS idx_inventory_config_audit_config_id 
ON public.inventory_config_audit(config_id);

CREATE INDEX IF NOT EXISTS idx_inventory_config_audit_changed_at 
ON public.inventory_config_audit(changed_at DESC);