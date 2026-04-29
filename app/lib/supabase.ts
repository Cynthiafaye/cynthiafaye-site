import { createClient } from '@supabase/supabase-js';

function sanitizeKey(key: string | undefined): string | undefined {
  if (!key) return undefined;
  return key.replace(/[\s\r\n\t"']+/g, '').trim();
}

const supabaseUrl = sanitizeKey(process.env.SUPABASE_URL);
const supabaseServiceKey = sanitizeKey(process.env.SUPABASE_SERVICE_ROLE_KEY);

export const supabase = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;
