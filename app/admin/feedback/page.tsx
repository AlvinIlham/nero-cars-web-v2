"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { checkAdminAccess } from "@/lib/adminAuth";
import { ArrowLeft, MessageSquare, Mail, Calendar, Trash2 } from "lucide-react";
import Link from "next/link";

interface Feedback {
  id: string;
  name: string;
  email: string;
  type: string; // Changed from feedback_type to type
  subject: string;
  message: string;
  created_at: string;
}

export default function ManageFeedback() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(
    null
  );

  useEffect(() => {
    checkAdmin();
    fetchFeedbacks();
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

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);

      // Use RPC function to bypass RLS for admin
      const { data, error } = await supabase.rpc("get_all_feedback");

      if (error) throw error;
      setFeedbacks(data || []);
    } catch (error) {
      console.error("Error fetching feedback:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFeedback = async (id: string) => {
    if (!confirm("Delete this feedback?")) return;

    try {
      const { error } = await supabase.from("feedback").delete().eq("id", id);

      if (error) throw error;

      alert("Feedback deleted!");
      fetchFeedbacks();
      setSelectedFeedback(null);
    } catch (error: any) {
      alert(`Failed: ${error.message}`);
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
      <div className="bg-slate-800/50 border-b border-amber-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/admin"
                className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 hover:text-amber-300 rounded-lg transition-all border border-amber-500/30">
                <ArrowLeft className="w-5 h-5" />
                <span className="font-semibold">Back to Dashboard</span>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Customer Feedback
                </h1>
                <p className="text-sm text-gray-400">View all user feedback</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-4 border border-amber-500/30">
          <div className="text-gray-400">
            Total Feedback:{" "}
            <span className="text-white font-semibold text-xl ml-2">
              {feedbacks.length}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Feedback List */}
          <div className="space-y-4">
            {feedbacks.map((feedback) => (
              <div
                key={feedback.id}
                onClick={() => setSelectedFeedback(feedback)}
                className={`bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border cursor-pointer transition-all ${
                  selectedFeedback?.id === feedback.id
                    ? "border-amber-500"
                    : "border-amber-500/30 hover:border-amber-500/50"
                }`}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-white font-semibold">
                      {feedback.name}
                    </h3>
                    <p className="text-sm text-gray-400">{feedback.email}</p>
                  </div>
                  <span className="px-3 py-1 bg-amber-500/20 text-amber-400 text-xs font-semibold rounded">
                    {feedback.type}
                  </span>
                </div>
                <p className="text-white font-medium mb-2">
                  {feedback.subject}
                </p>
                <p className="text-gray-400 text-sm line-clamp-2">
                  {feedback.message}
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-3">
                  <Calendar className="w-3 h-3" />
                  {new Date(feedback.created_at).toLocaleDateString("id-ID")}
                </div>
              </div>
            ))}
          </div>

          {/* Detail View */}
          <div className="lg:sticky lg:top-4 h-fit">
            {selectedFeedback ? (
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-amber-500/30">
                <div className="flex items-start justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">
                    Feedback Detail
                  </h2>
                  <button
                    onClick={() => handleDeleteFeedback(selectedFeedback.id)}
                    className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-400">Name</label>
                    <p className="text-white font-medium">
                      {selectedFeedback.name}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm text-gray-400">Email</label>
                    <p className="text-white">{selectedFeedback.email}</p>
                  </div>

                  <div>
                    <label className="text-sm text-gray-400">Type</label>
                    <p className="text-amber-400 font-medium">
                      {selectedFeedback.type}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm text-gray-400">Subject</label>
                    <p className="text-white font-medium">
                      {selectedFeedback.subject}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm text-gray-400">Message</label>
                    <p className="text-white whitespace-pre-wrap">
                      {selectedFeedback.message}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm text-gray-400">Date</label>
                    <p className="text-white">
                      {new Date(selectedFeedback.created_at).toLocaleString(
                        "id-ID"
                      )}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-12 border border-amber-500/30 text-center">
                <MessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">
                  Select a feedback to view details
                </p>
              </div>
            )}
          </div>
        </div>

        {feedbacks.length === 0 && (
          <div className="text-center py-20">
            <MessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No feedback yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
