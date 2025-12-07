"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { checkAdminAccess } from "@/lib/adminAuth";
import { ArrowLeft, Mail, Calendar, Trash2, Download } from "lucide-react";
import Link from "next/link";

interface Newsletter {
  id: string;
  email: string;
  created_at: string;
  is_active: boolean;
}

export default function ManageNewsletters() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);

  useEffect(() => {
    checkAdmin();
    fetchNewsletters();
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
        router.push("/");
        return;
      }
    } catch (error) {
      router.push("/admin/login");
    }
  };

  const fetchNewsletters = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("newsletters")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setNewsletters(data || []);
    } catch (error) {
      console.error("Error fetching newsletters:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this subscriber?")) return;

    try {
      const { error } = await supabase
        .from("newsletters")
        .delete()
        .eq("id", id);

      if (error) throw error;

      alert("Subscriber deleted!");
      fetchNewsletters();
    } catch (error: any) {
      alert(`Failed: ${error.message}`);
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("newsletters")
        .update({ is_active: !currentStatus })
        .eq("id", id);

      if (error) throw error;

      fetchNewsletters();
    } catch (error: any) {
      alert(`Failed: ${error.message}`);
    }
  };

  const exportEmails = () => {
    const emails = newsletters.map((n) => n.email).join("\n");
    const blob = new Blob([emails], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "newsletter-subscribers.txt";
    a.click();
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
                <h1 className="text-2xl font-bold text-white">
                  Newsletter Subscribers
                </h1>
                <p className="text-sm text-gray-400">
                  Manage email subscribers
                </p>
              </div>
            </div>
            <button
              onClick={exportEmails}
              className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-all font-semibold">
              <Download className="w-4 h-4" />
              Export Emails
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-4 border border-amber-500/30">
          <div className="text-gray-400">
            Total Subscribers:{" "}
            <span className="text-white font-semibold text-xl ml-2">
              {newsletters.length}
            </span>
            <span className="text-sm text-green-400 ml-4">
              Active: {newsletters.filter((n) => n.is_active).length}
            </span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-amber-500/30 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-700/50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-amber-400">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-amber-400">
                    Subscribed Date
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-amber-400">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-amber-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {newsletters.map((newsletter) => (
                  <tr
                    key={newsletter.id}
                    className="hover:bg-slate-700/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-amber-400" />
                        <span className="text-white">{newsletter.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {new Date(newsletter.created_at).toLocaleDateString(
                          "id-ID"
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() =>
                          handleToggleActive(
                            newsletter.id,
                            newsletter.is_active
                          )
                        }
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          newsletter.is_active
                            ? "bg-green-500/20 text-green-400"
                            : "bg-gray-500/20 text-gray-400"
                        }`}>
                        {newsletter.is_active ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDelete(newsletter.id)}
                        className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {newsletters.length === 0 && (
            <div className="text-center py-12">
              <Mail className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No subscribers yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
