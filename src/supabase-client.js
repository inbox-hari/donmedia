import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error(
    'Supabase credentials missing. Check your .env file or environment variables.'
  );
}

/**
 * Supabase Client Singleton
 */
let instance = null;

export const getSupabase = () => {
  if (!instance) {
    instance = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false
      },
      global: {
        // Default fetch options
        headers: { 'x-application-name': 'donmedia' },
      },
    });
  }
  return instance;
};

// Export the default singleton instance
export const supabase = getSupabase();

/**
 * Standardized Error Handling & Retry Wrapper
 * Use this to wrap your supabase queries:
 * const { data, error } = await safeQuery(() => supabase.from('table').select('*'));
 */
export async function safeQuery(queryFn, retries = 3, delay = 1000) {
  let lastError = null;

  for (let i = 0; i < retries; i++) {
    try {
      const { data, error } = await queryFn();
      if (!error) return { data, error: null };
      
      lastError = error;
      // Diagnostic logging
      console.error(`[Supabase Query Error] Attempt ${i + 1}/${retries}:`, {
        message: error.message,
        hint: error.hint,
        details: error.details,
        code: error.code
      });

      // Don't retry if it's a fixed error (Relation not found, or bad syntax)
      if (['42P01', 'PGRST116', 'PGRST204'].includes(error.code)) break;

      if (i < retries - 1) {
        await new Promise(res => setTimeout(res, delay * (i + 1)));
      }
    } catch (err) {
      lastError = err;
      console.error(`[Supabase Crash] Attempt ${i + 1}/${retries}:`, err);
      if (i < retries - 1) {
        await new Promise(res => setTimeout(res, delay * (i + 1)));
      }
    }
  }

  return { data: null, error: lastError };
}

// Global exposure for legacy support and debugging
if (typeof window !== 'undefined') {
  window.supabase = supabase;
  window._supabase = supabase;
  window.safeQuery = safeQuery;
}

// GlobalThis for module-insensitive access
globalThis.supabase = supabase;
globalThis._supabase = supabase;
globalThis.safeQuery = safeQuery;
