"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Mail, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      setSuccess(true);
    } catch (error: any) {
      setError(error.message || "Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-8 relative"
      style={{
        backgroundImage: "url(/assets/img/car2.jpeg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}>
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-white text-2xl font-semibold mb-2">Nero Cars</h1>
          <div className="flex items-center justify-center space-x-4 text-sm">
            <Link
              href="/"
              className="text-white/80 hover:text-white transition-colors">
              Beranda
            </Link>
            <span className="text-white/60">|</span>
            <Link
              href="/login"
              className="text-white/80 hover:text-white transition-colors">
              Login
            </Link>
            <span className="text-white/60">|</span>
            <span className="text-white font-medium">Lupa Password</span>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl">
          <h2 className="text-white text-2xl font-bold mb-2">Lupa Password</h2>
          <p className="text-white/70 text-sm mb-6">
            Masukkan email Anda dan kami akan mengirimkan link untuk reset
            password
          </p>

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-500/20 border border-green-500/50 text-green-200 px-4 py-3 rounded-lg mb-4 text-sm">
              Link reset password telah dikirim ke email Anda. Silakan cek inbox
              atau folder spam.
            </div>
          )}

          {!success ? (
            <form onSubmit={handleResetPassword} className="space-y-4">
              {/* Email Input */}
              <div>
                <label className="block text-white/80 text-sm mb-2">
                  Email *
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Masukkan email anda"
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm pr-10"
                  />
                  <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? "Mengirim..." : "Kirim Link Reset"}
              </button>
            </form>
          ) : (
            <div className="text-center">
              <Link
                href="/login"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-all shadow-lg">
                Kembali ke Login
              </Link>
            </div>
          )}

          {/* Back to Login */}
          <div className="text-center mt-6">
            <Link
              href="/login"
              className="text-white/80 hover:text-white text-sm transition-colors inline-flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
