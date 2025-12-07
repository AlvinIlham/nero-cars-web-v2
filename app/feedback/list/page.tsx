"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  MessageSquare,
  Trash2,
  Calendar,
  Mail,
  Tag,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";

interface Feedback {
  id: number;
  type: string;
  subject: string;
  message: string;
  email: string;
  createdAt: string;
}

export default function FeedbackListPage() {
  const router = useRouter();
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    loadFeedbacks();
  }, []);

  const loadFeedbacks = () => {
    const saved = localStorage.getItem("nerocars_feedbacks");
    if (saved) {
      const data = JSON.parse(saved);
      setFeedbacks(data.reverse()); // Latest first
    }
  };

  const deleteFeedback = (id: number) => {
    const updated = feedbacks.filter((f) => f.id !== id);
    setFeedbacks(updated);
    localStorage.setItem(
      "nerocars_feedbacks",
      JSON.stringify(updated.reverse())
    );
  };

  const getTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      bug: "🐛 Bug",
      feature: "💡 Fitur",
      improvement: "⭐ Perbaikan",
      complaint: "😞 Keluhan",
      other: "💬 Lainnya",
    };
    return labels[type] || type;
  };

  const getTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      bug: "bg-red-500/20 text-red-300 border-red-500/30",
      feature: "bg-blue-500/20 text-blue-300 border-blue-500/30",
      improvement: "bg-green-500/20 text-green-300 border-green-500/30",
      complaint: "bg-orange-500/20 text-orange-300 border-orange-500/30",
      other: "bg-gray-500/20 text-gray-300 border-gray-500/30",
    };
    return colors[type] || colors.other;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const filteredFeedbacks =
    filter === "all" ? feedbacks : feedbacks.filter((f) => f.type === filter);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-amber-900">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors group">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Kembali</span>
        </button>

        {/* Header */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 mb-6 border border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-8 h-8 text-amber-400" />
              <div>
                <h1 className="text-3xl font-bold text-white">
                  Daftar Masukan
                </h1>
                <p className="text-white/70">
                  {feedbacks.length} masukan tersimpan
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 mb-6 border border-white/10">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === "all"
                  ? "bg-amber-500 text-white"
                  : "bg-white/5 text-white/70 hover:bg-white/10"
              }`}>
              Semua ({feedbacks.length})
            </button>
            {["bug", "feature", "improvement", "complaint", "other"].map(
              (type) => (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    filter === type
                      ? "bg-amber-500 text-white"
                      : "bg-white/5 text-white/70 hover:bg-white/10"
                  }`}>
                  {getTypeLabel(type)} (
                  {feedbacks.filter((f) => f.type === type).length})
                </button>
              )
            )}
          </div>
        </div>

        {/* Feedback List */}
        {filteredFeedbacks.length === 0 ? (
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-12 border border-white/10 text-center">
            <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-bold text-white mb-2">
              Belum Ada Masukan
            </h3>
            <p className="text-white/70 mb-6">
              {filter === "all"
                ? "Belum ada masukan yang dikirimkan"
                : `Belum ada masukan dengan tipe ${getTypeLabel(filter)}`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFeedbacks.map((feedback) => (
              <div
                key={feedback.id}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-amber-500/30 transition-all">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium border ${getTypeColor(
                          feedback.type
                        )}`}>
                        {getTypeLabel(feedback.type)}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      {feedback.subject}
                    </h3>
                    <p className="text-white/70 whitespace-pre-wrap">
                      {feedback.message}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteFeedback(feedback.id)}
                    className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-all">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-white/10 text-sm">
                  <div className="flex items-center gap-2 text-white/60">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(feedback.createdAt)}</span>
                  </div>
                  {feedback.email !== "anonymous" && (
                    <div className="flex items-center gap-2 text-white/60">
                      <Mail className="w-4 h-4" />
                      <span>{feedback.email}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
