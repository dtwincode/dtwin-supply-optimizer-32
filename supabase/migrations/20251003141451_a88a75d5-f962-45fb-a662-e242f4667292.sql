-- Fix Security Definer View vulnerability by adding search_path to log_inventory_config_change
-- This prevents SQL injection attacks while maintaining necessary SECURITY DEFINER for audit logging

CREATE OR REPLACE FUNCTION public.log_inventory_config_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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