/**
 * Supabase Database Types
 * This file provides a clean import path for database types
 */

// Import all types and re-export to create a clean namespace
import type { Database as DB, Json as JsonType } from '@/integrations/supabase/types';

export type Database = DB;
export type Json = JsonType;
export type Tables<T extends keyof DB['public']['Tables']> = DB['public']['Tables'][T];
export type Enums = DB['public']['Enums'];
