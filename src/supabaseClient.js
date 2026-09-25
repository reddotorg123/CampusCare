import { createClient } from '@supabase/supabase-js';

// Read from localStorage (user configured in app) or Vite env variables
const getStoredUrl = () => {
  return localStorage.getItem('campuscare_supabase_url') || import.meta.env.VITE_SUPABASE_URL || '';
};

const getStoredKey = () => {
  return localStorage.getItem('campuscare_supabase_key') || import.meta.env.VITE_SUPABASE_ANON_KEY || '';
};

let supabaseInstance = null;

export const getSupabaseClient = () => {
  const url = getStoredUrl().trim();
  const key = getStoredKey().trim();

  if (!url || !key || !url.startsWith('http')) {
    return null;
  }

  if (!supabaseInstance || supabaseInstance.supabaseUrl !== url) {
    try {
      supabaseInstance = createClient(url, key, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        }
      });
    } catch (e) {
      console.warn('Failed to initialize Supabase client:', e);
      return null;
    }
  }

  return supabaseInstance;
};

export const isSupabaseConfigured = () => {
  const client = getSupabaseClient();
  return client !== null;
};

export const getSupabaseCredentials = () => {
  return {
    url: getStoredUrl(),
    key: getStoredKey()
  };
};

export const saveSupabaseCredentials = (url, key) => {
  if (url) {
    localStorage.setItem('campuscare_supabase_url', url.trim());
  } else {
    localStorage.removeItem('campuscare_supabase_url');
  }

  if (key) {
    localStorage.setItem('campuscare_supabase_key', key.trim());
  } else {
    localStorage.removeItem('campuscare_supabase_key');
  }

  // Force recreate client
  supabaseInstance = null;
  return getSupabaseClient();
};

export const testSupabaseConnection = async (testUrl, testKey) => {
  try {
    const url = (testUrl || getStoredUrl()).trim();
    const key = (testKey || getStoredKey()).trim();

    if (!url || !key) {
      return { success: false, error: 'Please enter both Supabase URL and Anon Key.' };
    }

    if (!url.startsWith('https://') && !url.startsWith('http://')) {
      return { success: false, error: 'Supabase URL must start with https://' };
    }

    const tempClient = createClient(url, key);
    // Simple ping query to check if server is reachable and key is authorized
    const { error } = await tempClient.from('tickets').select('id').limit(1);

    if (error && error.code !== 'PGRST116') {
      // Check if it's an auth error vs table not created
      if (error.code === '42P01') {
        return { 
          success: true, 
          warning: 'Connected to Supabase! (Note: tables not yet created. Run supabase/schema.sql in the SQL Editor).' 
        };
      }
      return { success: false, error: error.message || 'Failed to authenticate with Supabase.' };
    }

    return { success: true, message: 'Successfully connected to live Supabase backend!' };
  } catch (err) {
    return { success: false, error: err.message || 'Connection failed. Check your network or URL.' };
  }
};

/**
 * Mail ID / Email Authentication APIs
 */
export const signInWithEmailPassword = async (email, password) => {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { success: false, error: 'Database backend not configured.' };
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password: password
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, user: data.user, session: data.session };
  } catch (err) {
    return { success: false, error: err.message || 'Email authentication failed.' };
  }
};

export const signUpWithEmailPassword = async (email, password, userMetadata = {}) => {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { success: false, error: 'Database backend not configured.' };
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password: password,
      options: {
        data: userMetadata
      }
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { 
      success: true, 
      user: data.user, 
      session: data.session,
      requiresEmailVerification: !data.session && !!data.user
    };
  } catch (err) {
    return { success: false, error: err.message || 'Email registration failed.' };
  }
};

export const sendEmailOtp = async (email) => {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { success: false, error: 'Database backend not configured.' };
  }

  try {
    const { data, error } = await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: {
        shouldCreateUser: true
      }
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message || 'Failed to send OTP code.' };
  }
};

export const verifyEmailOtp = async (email, token) => {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { success: false, error: 'Database backend not configured.' };
  }

  try {
    const { data, error } = await supabase.auth.verifyOtp({
      email: email.trim().toLowerCase(),
      token: token.trim(),
      type: 'email'
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, user: data.user, session: data.session };
  } catch (err) {
    return { success: false, error: err.message || 'Failed to verify OTP code.' };
  }
};

export const signOutUser = async () => {
  const supabase = getSupabaseClient();
  if (!supabase) return { success: true };

  try {
    await supabase.auth.signOut();
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

export const getCurrentAuthUser = async () => {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  try {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch {
    return null;
  }
};

