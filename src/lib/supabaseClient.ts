import { createClient } from '@supabase/supabase-js';

// Replace these with your Supabase credentials
const supabaseUrl = 'https://your-project-id.supabase.co'; // Your Supabase URL
const supabaseKey = 'your-public-anon-key'; // Your public key
const supabase = createClient(supabaseUrl, supabaseKey);

export { supabase };
