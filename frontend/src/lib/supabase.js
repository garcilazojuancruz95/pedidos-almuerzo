import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      detectSessionInUrl: true,
      flowType: "implicit",
    },
    // Envoy protects /auth/v1/user too, so keep the public API key on every
    // request even after the Authorization header changes to a user session.
    global: {
      headers: {
        apikey: supabaseAnonKey,
      },
    },
  }
);
