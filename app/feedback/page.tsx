"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Send,
  MessageSquare,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import { submitFeedback } from "@/lib/database";
import { supabase } from "@/lib/supabase";
import emailjs from "@emailjs/browser";
import {
  EMAILJS_CONFIG,
  ADMIN_EMAIL,
  isEmailJsConfigured,
} from "@/lib/emailConfig";

type FeedbackType = "bug" | "feature" | "improvement" | "complaint" | "other";

export default function FeedbackPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState("");
  const [feedbackType, setFeedbackType] = useState<FeedbackType>("improvement");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function getUserData() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        setEmail(user.email || "");
        // Fetch user profile for name
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", user.id)
          .single();
        if (profile) {
          setUserName(profile.full_name || "");
        }
      }
    }
    getUserData();
  }, []);

  const feedbackTypes = [
    {
      value: "bug",
      label: "🐛 Laporkan Bug",
      description: "Ada yang tidak berfungsi dengan baik",
    },
    {
      value: "feature",
      label: "💡 Saran Fitur",
      description: "Ide fitur baru yang berguna",
    },
    {
      value: "improvement",
      label: "⭐ Perbaikan",
      description: "Saran untuk meningkatkan website",
    },
    {
      value: "complaint",
      label: "😞 Keluhan",
      description: "Masalah atau ketidakpuasan",
    },
    {
      value: "other",
      label: "💬 Lainnya",
      description: "Masukan umum lainnya",
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validasi
    if (!subject.trim() || !message.trim()) {
      setError("Mohon isi judul dan pesan feedback");
      return;
    }

    if (email && !isValidEmail(email)) {
      setError("Format email tidak valid");
      return;
    }

    if (message.length < 10) {
      setError("Pesan minimal 10 karakter");
      return;
    }

    setIsSubmitting(true);

    try {
      // Get feedback type label
      const typeLabel =
        feedbackTypes.find((t) => t.value === feedbackType)?.label ||
        feedbackType;

      // Prepare email template parameters
      const templateParams = {
        feedback_type: typeLabel,
        subject: subject,
        message: message,
        user_email: email || "Anonymous",
        sent_time: new Date().toLocaleString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        to_email: ADMIN_EMAIL,
      };

      // Send email using EmailJS
      if (isEmailJsConfigured()) {
        // Only send if EmailJS is configured
        const response = await emailjs.send(
          EMAILJS_CONFIG.SERVICE_ID,
          EMAILJS_CONFIG.TEMPLATE_ID,
          templateParams,
          EMAILJS_CONFIG.PUBLIC_KEY
        );

        console.log(
          "✅ Email sent successfully:",
          response.status,
          response.text
        );
      } else {
        console.warn(
          "⚠️ EmailJS not configured. Email not sent. Please check .env.local file."
        );
        // Simulasi delay untuk demo
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }

      // Simpan ke database
      const success = await submitFeedback({
        user_id: userId || undefined,
        name: userName || "Anonymous",
        email: email || "anonymous@nerocars.com",
        subject: `${typeLabel}: ${subject}`,
        message: message,
        type: feedbackType, // Add feedback type
      });

      if (!success) {
        throw new Error("Failed to submit feedback to database");
      }

      console.log("✅ Feedback saved to database:", {
        feedbackType,
        subject,
        message,
        email,
      });

      setShowSuccess(true);

      // Reset form
      setTimeout(() => {
        setSubject("");
        setMessage("");
        setEmail("");
        setFeedbackType("improvement");
        setShowSuccess(false);
        router.push("/");
      }, 2000);
    } catch (err: any) {
      console.error("Error submitting feedback:", err);

      // Check if it's EmailJS error
      if (err.text) {
        setError(`Gagal mengirim email: ${err.text}`);
      } else if (err.message) {
        setError(`Terjadi kesalahan: ${err.message}`);
      } else {
        setError("Terjadi kesalahan. Silakan coba lagi.");
      }

      // Still save to localStorage even if email fails
      const feedbacks = JSON.parse(
        localStorage.getItem("nerocars_feedbacks") || "[]"
      );
      feedbacks.push({
        id: Date.now(),
        type: feedbackType,
        subject,
        message,
        email: email || "anonymous",
        createdAt: new Date().toISOString(),
        emailSent: false,
        error: err.text || err.message || "Unknown error",
      });
      localStorage.setItem("nerocars_feedbacks", JSON.stringify(feedbacks));
    } finally {
      setIsSubmitting(false);
    }
  };

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Check if form is valid
  const isFormValid = () => {
    return (
      subject.trim().length > 0 &&
      message.trim().length >= 5 &&
      (!email || isValidEmail(email))
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-amber-900">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors group">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Kembali</span>
        </button>

        {/* Header */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 mb-6 border border-white/10">
          <div className="flex items-center gap-3 mb-2">
            <MessageSquare className="w-8 h-8 text-amber-400" />
            <h1 className="text-3xl font-bold text-white">Kirim Masukan</h1>
          </div>
          <p className="text-white/70">
            Kami sangat menghargai masukan Anda untuk meningkatkan layanan
            NeroCars
          </p>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="bg-green-500/10 border border-green-500/50 rounded-xl p-4 mb-6 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-400" />
              <div>
                <h3 className="text-green-400 font-semibold">
                  Terima kasih atas masukan Anda!
                </h3>
                <p className="text-green-300/80 text-sm">
                  Feedback Anda telah berhasil dikirim.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-red-400" />
              <p className="text-red-400">{error}</p>
            </div>
          </div>
        )}

        {/* Feedback Form */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Feedback Type */}
            <div>
              <label className="block text-white font-semibold mb-3">
                Jenis Masukan <span className="text-red-400">*</span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {feedbackTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setFeedbackType(type.value as FeedbackType)}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      feedbackType === type.value
                        ? "border-amber-500 bg-amber-500/10"
                        : "border-white/10 bg-white/5 hover:border-white/20"
                    }`}>
                    <div className="font-semibold text-white mb-1">
                      {type.label}
                    </div>
                    <div className="text-sm text-white/60">
                      {type.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Subject */}
            <div>
              <label
                htmlFor="subject"
                className="block text-white font-semibold mb-2">
                Judul <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                id="subject"
                value={subject}
                onChange={(e) => {
                  setSubject(e.target.value);
                  setError(""); // Clear error when typing
                }}
                placeholder="Jelaskan masukan Anda dalam satu kalimat"
                className={`w-full px-4 py-3 bg-white/5 border-2 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 transition-all ${
                  subject.trim().length === 0 && error
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                    : "border-white/10 focus:border-amber-500 focus:ring-amber-500/20"
                }`}
                required
              />
              {subject.trim().length === 0 && error && (
                <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  Judul wajib diisi
                </p>
              )}
            </div>

            {/* Message */}
            <div>
              <label
                htmlFor="message"
                className="block text-white font-semibold mb-2">
                Pesan <span className="text-red-400">*</span>
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  setError(""); // Clear error when typing
                }}
                placeholder="Jelaskan masukan Anda secara detail..."
                rows={6}
                className={`w-full px-4 py-3 bg-white/5 border-2 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 transition-all resize-none ${
                  message.trim().length < 10 && message.length > 0
                    ? "border-yellow-500 focus:border-yellow-500 focus:ring-yellow-500/20"
                    : message.trim().length === 0 && error
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                    : "border-white/10 focus:border-amber-500 focus:ring-amber-500/20"
                }`}
                required
              />
              <div className="mt-1 flex items-center justify-between">
                <div
                  className={`text-sm ${
                    message.length < 10 ? "text-yellow-400" : "text-green-400"
                  }`}>
                  {message.length < 10 ? (
                    <span className="flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      Minimal 10 karakter ({message.length}/10)
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      Pesan valid ({message.length} karakter)
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Email (Optional) */}
            <div>
              <label
                htmlFor="email"
                className="block text-white font-semibold mb-2">
                Email (Opsional)
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(""); // Clear error when typing
                }}
                placeholder="email@example.com"
                className={`w-full px-4 py-3 bg-white/5 border-2 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 transition-all ${
                  email && !isValidEmail(email)
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                    : "border-white/10 focus:border-amber-500 focus:ring-amber-500/20"
                }`}
              />
              <div className="mt-1 text-sm text-white/50">
                {email && !isValidEmail(email) ? (
                  <span className="text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    Format email tidak valid
                  </span>
                ) : (
                  "Isi email jika Anda ingin mendapatkan update terkait masukan ini"
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg font-semibold transition-all border border-white/10">
                Batal
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !isFormValid()}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:from-gray-500 disabled:to-gray-600 shadow-lg">
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Mengirim...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Kirim Masukan</span>
                  </>
                )}
              </button>
            </div>

            {/* Helper Text */}
            {!isFormValid() && !isSubmitting && (
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                <div className="text-yellow-300 text-sm flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>Tombol "Kirim Masukan" akan aktif jika:</strong>
                    <ul className="mt-2 space-y-1 ml-4 list-disc">
                      <li className={subject.trim() ? "text-green-400" : ""}>
                        Judul sudah diisi {subject.trim() && "✓"}
                      </li>
                      <li
                        className={
                          message.length >= 10 ? "text-green-400" : ""
                        }>
                        Pesan minimal 10 karakter {message.length >= 10 && "✓"}
                      </li>
                      <li
                        className={
                          !email || isValidEmail(email) ? "text-green-400" : ""
                        }>
                        Email valid (jika diisi){" "}
                        {(!email || isValidEmail(email)) && "✓"}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
          <div className="flex gap-3">
            <MessageSquare className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-300">
              <p className="font-semibold mb-1">Catatan:</p>
              <div className="space-y-1 text-blue-300/80">
                <div className="flex items-start gap-2">
                  <span className="mt-1">•</span>
                  <span>
                    Masukan Anda akan direview oleh tim kami dalam 1-2 hari
                    kerja
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-1">•</span>
                  <span>
                    Untuk masalah urgent, hubungi Customer Service kami
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-1">•</span>
                  <span>
                    Semua feedback bersifat anonim kecuali Anda memberikan email
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
