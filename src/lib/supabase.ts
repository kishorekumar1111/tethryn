import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ocqcohqxzrqirchlmesu.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jcWNvaHF4enJxaXJjaGxtZXN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4MDE3NjksImV4cCI6MjA5MzM3Nzc2OX0.alEbGshJf6mhZWnoUSavAjPRmhlPA9LFNqy8vEqwhZU';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase credentials missing. Supabase features will be disabled until VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in environment variables.");
}

export const isSupabaseConfigured = !!(import.meta.env.VITE_SUPABASE_URL || 'https://ocqcohqxzrqirchlmesu.supabase.co');

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder'
);
