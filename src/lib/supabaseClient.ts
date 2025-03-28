import { createClient } from '@supabase/supabase-js';

// Replace these with your actual Supabase credentials
const supabaseUrl = 'https://mttzjxktvbsixjaqiuxq.supabase.co'; // Your Supabase URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10dHpqeGt0dmJzaXhqYXFpdXhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkxNjk4NDEsImV4cCI6MjA1NDc0NTg0MX0.-6wiezDQfeFz3ecyuHP4A6QkcRRxBG4j8pxyAp7hkx8'; // Your public key
const supabase = createClient(supabaseUrl, supabaseKey);

export { supabase };
