import { supabase } from "./supabase";

/**
 * Admin database operations that bypass RLS
 * These functions should only be called after verifying admin access
 */

// Admin: Get all users
export async function adminGetAllUsers() {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}

// Admin: Update user profile
export async function adminUpdateUser(
  userId: string,
  updates: {
    full_name?: string | null;
    phone?: string | null;
    address?: string | null;
  }
) {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
}

// Admin: Delete user profile and auth account
export async function adminDeleteUser(userId: string, userEmail: string) {
  if (userEmail === "admin@gmail.com") {
    throw new Error("Cannot delete admin account!");
  }

  try {
    // Try to use database function first (if it exists)
    const { error: funcError } = await supabase.rpc("delete_user_completely", {
      user_id: userId,
    });

    if (!funcError) {
      return { success: true };
    }

    // If function doesn't exist, fallback to manual delete
    console.log("Database function not found, using fallback method");

    // Delete from profiles table
    const { error: profileError } = await supabase
      .from("profiles")
      .delete()
      .eq("id", userId);

    if (profileError) throw profileError;

    // Note: Auth user deletion requires service_role or database function
    // The auth user will remain but profile is deleted
    console.warn(
      "Auth user not deleted. Run create-delete-user-function.sql to enable full deletion"
    );

    return { success: true };
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
}

// Admin: Create new user
export async function adminCreateUser(userData: {
  email: string;
  password: string;
  full_name?: string;
  phone?: string;
  address?: string;
}) {
  try {
    // Get current admin session to restore later
    const {
      data: { session: adminSession },
    } = await supabase.auth.getSession();

    // Create auth user (this will auto-login as the new user)
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          full_name: userData.full_name,
        },
      },
    });

    if (authError) throw authError;

    if (!authData.user) {
      throw new Error("Failed to create user");
    }

    // Update profile with additional data
    const { error: profileError } = await supabase.from("profiles").upsert({
      id: authData.user.id,
      email: userData.email,
      full_name: userData.full_name || null,
      phone: userData.phone || null,
      address: userData.address || null,
    });

    if (profileError) throw profileError;

    // IMPORTANT: Sign out the newly created user and restore admin session
    await supabase.auth.signOut();

    // Restore admin session if it exists
    if (adminSession) {
      await supabase.auth.setSession({
        access_token: adminSession.access_token,
        refresh_token: adminSession.refresh_token,
      });
    }

    return authData.user;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}
