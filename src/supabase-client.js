console.log("Supabase client script loading...");
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://edwoulmhdopmbwrnerle.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkd291bG1oZG9wbWJ3cm5lcmxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2NTQ2OTYsImV4cCI6MjA4OTIzMDY5Nn0.GeQhc2Aka0CzYo6V40IXbK3Bgr6xE8inFRvkDEDvsec';

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

