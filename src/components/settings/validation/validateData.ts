
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/types/database";
import { ValidationError, ValidationRules, DataTemplate } from "./types";

export const validateData = async (
  headers: string[],
  rows: string[][],
  module: Database["public"]["Enums"]["module_type"]
): Promise<ValidationError[]> => {
  const errors: ValidationError[] = [];
  
  try {
    const { data: settings } = await supabase
      .from('module_settings')
      .select('validation_rules, data_template')
      .eq('module', module)
      .single();

    if (!settings) throw new Error('Module settings not found');

    const rules = settings.validation_rules as unknown as ValidationRules;
    const template = settings.data_template as unknown as DataTemplate;

    // Check required columns
    const missingColumns = template.required_columns.filter(col => !headers.includes(col));
    if (missingColumns.length > 0) {
      errors.push({
        row: 0,
        column: missingColumns.join(', '),
        message: `Missing required columns: ${missingColumns.join(', ')}`
      });
    }

    // Validate each row
    rows.forEach((row, index) => {
      const rowNumber = index + 1;
      headers.forEach((header, colIndex) => {
        const value = row[colIndex];
        const dataType = rules.data_types?.[header];

        if (dataType) {
          switch (dataType) {
            case 'numeric':
              if (value && isNaN(Number(value))) {
                errors.push({
                  row: rowNumber,
                  column: header,
                  message: `Invalid numeric value: ${value}`
                });
              }
              break;
            case 'date':
              if (value && isNaN(Date.parse(value))) {
                errors.push({
                  row: rowNumber,
                  column: header,
                  message: `Invalid date format: ${value}`
                });
              }
              break;
            case 'integer':
              if (value && (!Number.isInteger(Number(value)) || isNaN(Number(value)))) {
                errors.push({
                  row: rowNumber,
                  column: header,
                  message: `Invalid integer value: ${value}`
                });
              }
              break;
          }
        }
      });
    });

  } catch (error) {
    console.error('Validation error:', error);
    errors.push({
      row: 0,
      column: 'general',
      message: 'Failed to validate data'
    });
  }

  return errors;
};
