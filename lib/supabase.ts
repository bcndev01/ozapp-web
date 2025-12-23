import { createClient } from '@supabase/supabase-js';
import { AppData } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found.');
  console.warn('VITE_SUPABASE_URL:', supabaseUrl ? 'Set' : 'Missing');
  console.warn('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Set' : 'Missing');
  console.warn('Please check your .env.local file and restart the dev server.');
}

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export const TABLE_NAME = 'apps';
export const ADMIN_TABLE_NAME = 'admin_settings';

// Helper function to check if Supabase is available
export const isSupabaseAvailable = () => supabase !== null;

