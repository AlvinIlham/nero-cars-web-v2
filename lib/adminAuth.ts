import { supabase } from "./supabase";

// Admin credentials
const ADMIN_EMAIL = "admin@gmail.com";
const ADMIN_PASSWORD = "12345678";

export function isAdmin(email: string): boolean {
  return email === ADMIN_EMAIL;
}

export async function checkAdminAccess(userId: string): Promise<boolean> {
  try {
    const { data: profile } = await supabase
      .from("profiles")
      .select("email")
      .eq("id", userId)
      .single();

    return profile?.email === ADMIN_EMAIL;
  } catch (error) {
    console.error("Error checking admin access:", error);
    return false;
  }
}

export async function loginAdmin(email: string, password: string) {
  if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    return { success: false, error: "Invalid admin credentials" };
  }

  // Login using Supabase auth
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data };
}
