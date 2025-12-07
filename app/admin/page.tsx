"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { checkAdminAccess } from "@/lib/adminAuth";
import { Users, Car, MessageSquare, LogOut, Shield, Home } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCars: 0,
    totalFeedback: 0,
  });

  useEffect(() => {
    checkAdmin();
    fetchStats();
  }, []);

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
        alert("Akses ditolak. Hanya admin yang dapat mengakses halaman ini.");
        router.push("/");
        return;
      }

      setIsAdmin(true);
    } catch (error) {
      console.error("Error checking admin:", error);
      router.push("/admin/login");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      // Get total users
      const { count: usersCount } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

      // Get total cars
      const { count: carsCount } = await supabase
        .from("cars")
        .select("*", { count: "exact", head: true });

      // Get total feedback
      const { count: feedbackCount } = await supabase
        .from("feedback")
        .select("*", { count: "exact", head: true });

      setStats({
        totalUsers: usersCount || 0,
        totalCars: carsCount || 0,
        totalFeedback: feedbackCount || 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-slate-800/50 border-b border-amber-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-amber-400" />
              <div>
                <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
                <p className="text-sm text-gray-400">
                  NeroCars Management System
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 hover:text-amber-300 rounded-lg transition-all border border-amber-500/30">
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Back to Website</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all">
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/30 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <Users className="w-8 h-8 text-blue-400" />
              <span className="text-3xl font-bold text-white">
                {stats.totalUsers}
              </span>
            </div>
            <h3 className="text-blue-400 font-semibold">Total Users</h3>
            <p className="text-gray-400 text-sm">Registered accounts</p>
          </div>

          <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/10 border border-amber-500/30 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <Car className="w-8 h-8 text-amber-400" />
              <span className="text-3xl font-bold text-white">
                {stats.totalCars}
              </span>
            </div>
            <h3 className="text-amber-400 font-semibold">Total Cars</h3>
            <p className="text-gray-400 text-sm">Listed vehicles</p>
          </div>

          <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/30 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <MessageSquare className="w-8 h-8 text-green-400" />
              <span className="text-3xl font-bold text-white">
                {stats.totalFeedback}
              </span>
            </div>
            <h3 className="text-green-400 font-semibold">Feedback</h3>
            <p className="text-gray-400 text-sm">User submissions</p>
          </div>
        </div>

        {/* Management Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            href="/admin/users"
            className="bg-gradient-to-br from-slate-800 to-slate-900 border border-amber-500/30 rounded-xl p-6 hover:border-amber-500/50 transition-all group">
            <Users className="w-12 h-12 text-amber-400 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-bold text-white mb-2">Manage Users</h3>
            <p className="text-gray-400">
              View, edit, and delete user accounts
            </p>
          </Link>

          <Link
            href="/admin/cars"
            className="bg-gradient-to-br from-slate-800 to-slate-900 border border-amber-500/30 rounded-xl p-6 hover:border-amber-500/50 transition-all group">
            <Car className="w-12 h-12 text-amber-400 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-bold text-white mb-2">Manage Cars</h3>
            <p className="text-gray-400">CRUD operations for car listings</p>
          </Link>

          <Link
            href="/admin/feedback"
            className="bg-gradient-to-br from-slate-800 to-slate-900 border border-amber-500/30 rounded-xl p-6 hover:border-amber-500/50 transition-all group">
            <MessageSquare className="w-12 h-12 text-amber-400 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-bold text-white mb-2">View Feedback</h3>
            <p className="text-gray-400">Customer feedback and suggestions</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
