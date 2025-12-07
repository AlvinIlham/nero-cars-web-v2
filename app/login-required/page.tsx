"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Lock } from "lucide-react";

export default function LoginRequired() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-amber-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-amber-200/50">
          {/* Icon */}
          <div className="w-24 h-24 bg-gradient-to-br from-amber-100 to-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-12 h-12 text-amber-600" />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-slate-800 mb-3">
            Login Diperlukan
          </h1>

          {/* Description */}
          <p className="text-gray-600 mb-8">
            Anda harus login terlebih dahulu untuk mengakses halaman ini.
            Silakan login atau buat akun baru jika belum memiliki akun.
          </p>

          {/* Actions */}
          <div className="space-y-3">
            <Link
              href="/login"
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white py-3 rounded-lg font-semibold transition-all shadow-lg">
              <User className="w-5 h-5" />
              Masuk Sekarang
            </Link>

            <Link
              href="/register"
              className="w-full flex items-center justify-center gap-2 bg-white border-2 border-amber-500 hover:bg-amber-50 text-amber-700 py-3 rounded-lg font-semibold transition-all">
              Daftar Akun Baru
            </Link>

            <button
              onClick={() => router.back()}
              className="w-full text-gray-600 hover:text-gray-800 py-2 transition-colors">
              ← Kembali
            </button>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-6">
          <Link
            href="/"
            className="text-gray-300 hover:text-amber-400 transition-colors">
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
