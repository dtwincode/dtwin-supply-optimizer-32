import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Create a single supabase client for interacting with your database
const supabaseUrl = import.meta.env.NEXT_PUBLIC_SUPABASE_URL || "https://mttzjxktvbsixjaqiuxq.supabase.co";
const supabaseKey = import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10dHpqeGt0dmJzaXhqYXFpdXhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkxNjk4NDEsImV4cCI6MjA1NDc0NTg0MX0.-6wiezDQfeFz3ecyuHP4A6QkcRRxBG4j8pxyAp7hkx8";

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);
