"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Mail, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"email" | "phone">("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Redirect to home after successful login
      router.push("/");
      router.refresh();
    } catch (error: any) {
      setError(error.message || "Email atau password salah");
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
            <span className="text-white font-medium">Login</span>
            <span className="text-white/60">|</span>
            <Link
              href="/register"
              className="text-white/80 hover:text-white transition-colors">
              Register
            </Link>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl">
          <h2 className="text-white text-2xl font-bold mb-2">Masuk ke Akun</h2>
          <p className="text-white/70 text-sm mb-6">
            Belum punya akun?{" "}
            <Link
              href="/register"
              className="text-blue-400 hover:text-blue-300 font-medium">
              Daftar di sini
            </Link>
          </p>

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          {/* Tab Buttons */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveTab("email")}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                activeTab === "email"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-white/10 text-white/70 hover:bg-white/20"
              }`}>
              Email
            </button>
            <button
              onClick={() => setActiveTab("phone")}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                activeTab === "phone"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-white/10 text-white/70 hover:bg-white/20"
              }`}>
              Nomor HP
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email/Phone Input */}
            <div>
              <label className="block text-white/80 text-sm mb-2">
                {activeTab === "email" ? "Email" : "Nomor HP"} *
              </label>
              <div className="relative">
                <input
                  type={activeTab === "email" ? "email" : "tel"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={
                    activeTab === "email"
                      ? "Masukkan email anda"
                      : "Masukkan nomor HP anda"
                  }
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm pr-10"
                />
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-white/80 text-sm mb-2">
                Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password anda"
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/80 transition-colors">
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? "Memproses..." : "Masuk Sekarang"}
            </button>
          </form>

          {/* Terms */}
          <div className="text-center mt-6">
            <p className="text-white/50 text-xs">
              Saya menyetujui{" "}
              <Link href="/terms" className="text-blue-400 hover:text-blue-300">
                Syarat & Ketentuan
              </Link>{" "}
              dan{" "}
              <Link
                href="/privacy"
                className="text-blue-400 hover:text-blue-300">
                Kebijakan Privasi
              </Link>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-white/80 hover:text-white text-sm transition-colors">
            ← Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
