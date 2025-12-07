"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { checkAdminAccess } from "@/lib/adminAuth";
import { adminGetAllUsers, adminDeleteUser } from "@/lib/adminDatabase";
import {
  ArrowLeft,
  Search,
  Trash2,
  Edit,
  Mail,
  Calendar,
  Shield,
  User,
} from "lucide-react";
import Link from "next/link";

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  address: string | null;
  created_at: string;
}

export default function ManageUsers() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<Profile[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<Profile[]>([]);

  useEffect(() => {
    checkAdmin();
    fetchUsers();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredUsers(users);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredUsers(
        users.filter(
          (user) =>
            user.email?.toLowerCase().includes(query) ||
            user.full_name?.toLowerCase().includes(query) ||
            user.phone?.includes(query)
        )
      );
    }
  }, [searchQuery, users]);

  const checkAdmin = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        router.push("/admin/login");
        return;
      }

      const adminStatus = await checkAdminAccess(session.user.id);
      if (!adminStatus) {
        router.push("/");
        return;
      }
    } catch (error) {
      console.error("Error checking admin:", error);
      router.push("/admin/login");
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await adminGetAllUsers();
      setUsers(data || []);
      setFilteredUsers(data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      alert("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string, userEmail: string) => {
    if (userEmail === "admin@gmail.com") {
      alert("Cannot delete admin account!");
      return;
    }

    if (!confirm(`Are you sure you want to delete user: ${userEmail}?`)) {
      return;
    }

    try {
      await adminDeleteUser(userId, userEmail);
      alert("User deleted successfully!");
      await fetchUsers(); // Refresh the list
    } catch (error: any) {
      console.error("Error deleting user:", error);
      alert(`Failed to delete user: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-slate-800/50 border-b border-amber-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/admin"
                className="text-amber-400 hover:text-amber-300 transition-colors">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-white">Manage Users</h1>
                <p className="text-sm text-gray-400">
                  View and manage user accounts
                </p>
              </div>
            </div>
            <Link
              href="/admin/users/add"
              className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-all font-semibold">
              <User className="w-4 h-4" />
              Add User
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, or phone..."
              className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="mb-6 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-4 border border-amber-500/30">
          <div className="flex items-center justify-between">
            <div className="text-gray-400">
              Total Users:{" "}
              <span className="text-white font-semibold text-xl ml-2">
                {filteredUsers.length}
              </span>
              {filteredUsers.length !== users.length && (
                <span className="text-sm text-amber-400 ml-2">
                  (filtered from {users.length})
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-amber-500/30 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-700/50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-amber-400">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-amber-400">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-amber-400">
                    Joined
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-amber-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-slate-700/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-amber-500/20 p-2 rounded-full">
                          <User className="w-5 h-5 text-amber-400" />
                        </div>
                        <div>
                          <div className="font-medium text-white">
                            {user.full_name || "No name"}
                            {user.email === "admin@gmail.com" && (
                              <Shield className="inline w-4 h-4 ml-2 text-amber-400" />
                            )}
                          </div>
                          <div className="text-sm text-gray-400">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-300">
                        {user.phone || "No phone"}
                      </div>
                      <div className="text-xs text-gray-400">
                        {user.address || "No address"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {new Date(user.created_at).toLocaleDateString("id-ID")}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            router.push(`/admin/users/${user.id}/edit`)
                          }
                          className="p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-all">
                          <Edit className="w-4 h-4" />
                        </button>
                        {user.email !== "admin@gmail.com" && (
                          <button
                            onClick={() =>
                              handleDeleteUser(user.id, user.email)
                            }
                            className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <User className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No users found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
