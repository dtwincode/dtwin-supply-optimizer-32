

import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { ValidationError, ValidationRules, DataTemplate } from "./types";

export const validateData = async (
  headers: string[],
  rows: string[][],
  module: Database["public"]["Enums"]["module_type"]
): Promise<ValidationError[]> => {
  const errors: ValidationError[] = [];
  
  // Module settings table removed - basic validation only
  console.warn('Module settings table removed. Using basic validation.');
  
  // Basic validation - check for empty headers
  if (headers.length === 0) {
    errors.push({
      row: 0,
      column: 'general',
      message: 'No headers found in the data'
    });
  }

  return errors;
};
