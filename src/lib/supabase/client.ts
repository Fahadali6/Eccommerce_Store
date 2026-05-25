import { createClient as createSupabaseClient } from "@supabase/supabase-js";

const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Browser client (used in Client Components)
export const supabase = createSupabaseClient(supabaseUrl, supabaseAnon);

// Storage bucket name
export const STORAGE_BUCKET = "product-images";
