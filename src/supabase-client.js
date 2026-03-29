console.log("Supabase client script loading...");
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false
  }
});

// For legacy support where other scripts might expect window._supabase
window.supabase = supabase;
window._supabase = supabase;

// Set global _supabase to avoid ReferenceError if some scripts are still not modules
globalThis._supabase = supabase;
globalThis.supabase = supabase;

