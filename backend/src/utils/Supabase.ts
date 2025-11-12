import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Database } from "./DatabaseSchema";

if (!process.env.SUPABASE_URL) throw new Error("SUPABASE_URL is not defined");
if (!process.env.SUPABASE_KEY) throw new Error("SUPABASE_KEY is not defined");

const SUPABASE_URL: string = process.env.SUPABASE_URL;
const SUPABASE_KEY: string = process.env.SUPABASE_KEY;

export const supabase: SupabaseClient = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_KEY
);
