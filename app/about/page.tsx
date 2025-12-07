"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/home/Footer";
import {
  Car,
  Shield,
  Users,
  Award,
  Target,
  Heart,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  TrendingUp,
  Star,
} from "lucide-react";

export default function AboutPage() {
  const values = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Terpercaya",
      description:
        "Keamanan dan kepercayaan adalah prioritas utama kami. Setiap transaksi dijamin aman.",
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Berpusat pada Pelanggan",
      description:
        "Kepuasan Anda adalah kesuksesan kami. Kami berkomitmen memberikan layanan terbaik.",
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Kualitas Terjamin",
      description:
        "Setiap mobil melalui inspeksi ketat untuk memastikan kualitas terbaik untuk Anda.",
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Inovasi Berkelanjutan",
      description:
        "Kami terus berinovasi untuk memberikan pengalaman jual beli mobil yang lebih baik.",
    },
  ];

  const stats = [
    { number: "10,000+", label: "Mobil Terjual" },
    { number: "50,000+", label: "Pengguna Aktif" },
    { number: "98%", label: "Kepuasan Pelanggan" },
    { number: "24/7", label: "Customer Support" },
  ];

  const features = [
    "Platform 100% gratis untuk penjual",
    "Inspeksi kendaraan profesional",
    "Garansi komprehensif untuk mobil bekas",
    "Proses transaksi yang aman dan transparan",
    "Bantuan balik nama kendaraan",
    "Customer service responsif 24/7",
    "Database mobil bekas terlengkap",
    "Harga kompetitif dan transparan",
  ];

  const team = [
    {
      name: "Andi Pratama",
      role: "CEO & Founder",
      description: "Visioner dengan 15+ tahun pengalaman di industri otomotif",
    },
    {
      name: "Siti Nurhaliza",
      role: "COO",
      description: "Expert dalam operasional dan customer experience",
    },
    {
      name: "Budi Santoso",
      role: "CTO",
      description:
        "Tech innovator yang passionate tentang digital transformation",
    },
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Hero Section */}
        <div className="relative pt-24 pb-16 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-orange-500/10"></div>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 mb-6">
                <Car className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Tentang <span className="text-amber-400">NeroCars</span>
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Platform jual beli mobil bekas terpercaya di Indonesia yang
                menghubungkan penjual dan pembeli dengan cara yang aman, mudah,
                dan transparan.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="py-12 bg-slate-900/50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="text-center p-6 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg border border-amber-500/30">
                  <div className="text-4xl md:text-5xl font-bold text-amber-400 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-300">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-lg border border-amber-500/30">
                <div className="flex items-center mb-4">
                  <Target className="w-8 h-8 text-amber-400 mr-3" />
                  <h2 className="text-3xl font-bold text-white">Misi Kami</h2>
                </div>
                <p className="text-gray-300 leading-relaxed">
                  Menyediakan platform jual beli mobil bekas yang aman,
                  transparan, dan mudah digunakan untuk semua kalangan.
                  Menghilangkan kerumitan dalam proses jual beli mobil dan
                  memberikan pengalaman terbaik bagi penjual maupun pembeli.
                </p>
              </div>
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-lg border border-amber-500/30">
                <div className="flex items-center mb-4">
                  <Star className="w-8 h-8 text-amber-400 mr-3" />
                  <h2 className="text-3xl font-bold text-white">Visi Kami</h2>
                </div>
                <p className="text-gray-300 leading-relaxed">
                  Menjadi platform jual beli mobil bekas nomor satu di Indonesia
                  yang dipercaya oleh jutaan pengguna, dengan standar kualitas
                  dan pelayanan yang terus meningkat setiap harinya.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Our Values */}
        <div className="py-16 bg-slate-900/50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Nilai-Nilai Kami
              </h2>
              <p className="text-gray-400 text-lg">
                Prinsip yang kami pegang teguh dalam setiap langkah
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-lg border border-amber-500/30 hover:border-amber-400 transition-all">
                  <div className="text-amber-400 mb-4">{value.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {value.title}
                  </h3>
                  <p className="text-gray-300">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Mengapa Memilih NeroCars?
              </h2>
              <p className="text-gray-400 text-lg">
                Keunggulan yang membuat kami berbeda
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 bg-gradient-to-br from-slate-800 to-slate-900 p-4 rounded-lg border border-amber-500/30">
                  <CheckCircle2 className="w-6 h-6 text-amber-400 flex-shrink-0 mt-1" />
                  <span className="text-gray-300">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Our Story */}
        <div className="py-16 bg-slate-900/50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Cerita Kami
              </h2>
            </div>
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-lg border border-amber-500/30">
              <p className="text-gray-300 leading-relaxed mb-4">
                NeroCars lahir dari pengalaman pribadi founder kami yang
                mengalami kesulitan saat menjual mobil bekasnya pada tahun 2018.
                Proses yang rumit, tidak transparan, dan memakan waktu membuat
                kami berpikir: "Pasti ada cara yang lebih baik."
              </p>
              <p className="text-gray-300 leading-relaxed mb-4">
                Berawal dari garasi kecil dengan 3 orang tim, kami membangun
                platform yang kami sendiri ingin gunakan - simpel, aman, dan
                efisien. Dalam 5 tahun terakhir, NeroCars telah berkembang
                menjadi salah satu platform jual beli mobil bekas terpercaya di
                Indonesia.
              </p>
              <p className="text-gray-300 leading-relaxed">
                Hari ini, dengan lebih dari 50,000 pengguna aktif dan 10,000+
                mobil terjual, kami tetap berkomitmen pada misi awal: membuat
                jual beli mobil bekas menjadi mudah untuk semua orang.
              </p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Tim Kami
              </h2>
              <p className="text-gray-400 text-lg">
                Orang-orang di balik NeroCars
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-lg border border-amber-500/30 text-center">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 mx-auto mb-4 flex items-center justify-center">
                    <Users className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">
                    {member.name}
                  </h3>
                  <div className="text-amber-400 font-medium mb-3">
                    {member.role}
                  </div>
                  <p className="text-gray-300 text-sm">{member.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="py-16 bg-slate-900/50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg p-8 md:p-12">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Hubungi Kami
                </h2>
                <p className="text-white/90 text-lg">
                  Kami siap membantu Anda 24/7
                </p>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
                  <Phone className="w-8 h-8 text-white mx-auto mb-3" />
                  <h3 className="font-semibold text-white mb-2">Telepon</h3>
                  <p className="text-white/90">1500-NERO (6376)</p>
                  <p className="text-white/90 text-sm">
                    Senin - Minggu, 24 Jam
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
                  <Mail className="w-8 h-8 text-white mx-auto mb-3" />
                  <h3 className="font-semibold text-white mb-2">Email</h3>
                  <p className="text-white/90">support@nerocars.com</p>
                  <p className="text-white/90 text-sm">Respon dalam 2 jam</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
                  <MapPin className="w-8 h-8 text-white mx-auto mb-3" />
                  <h3 className="font-semibold text-white mb-2">Kantor</h3>
                  <p className="text-white/90">Jl. Sudirman No. 123</p>
                  <p className="text-white/90 text-sm">Jakarta Pusat, 10220</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
