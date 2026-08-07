import { supabase } from "../lib/supabase";

export async function signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
            redirectTo: window.location.origin,
        },
    });

    if (error) {
        throw error;
    }

    return data;
}

export async function signOut() {
    const { error } = await supabase.auth.signOut();

    if (error) {
        throw error;
    }
}

export async function getSession() {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    throw error;
  }

  return data.session;
}

export function onAuthStateChange(callback) {
  return supabase.auth.onAuthStateChange(callback);
}