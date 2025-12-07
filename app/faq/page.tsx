"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/home/Footer";
import { ChevronDown, ChevronUp, Search } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQItem[] = [
  {
    category: "Umum",
    question: "Apakah NeroCars Terpercaya untuk Jual Beli Mobil?",
    answer:
      "Ya, NeroCars adalah platform jual beli mobil bekas terpercaya di Indonesia. Kami memiliki sistem verifikasi seller, inspeksi kendaraan, dan jaminan garansi untuk memastikan transaksi yang aman dan nyaman bagi pembeli maupun penjual.",
  },
  {
    category: "Umum",
    question: "Bagaimana Cara Kerja NeroCars?",
    answer:
      "NeroCars menghubungkan penjual dan pembeli mobil bekas. Penjual dapat mengiklankan mobilnya secara gratis, sementara pembeli dapat mencari mobil impian mereka dengan mudah. Kami menyediakan platform untuk komunikasi langsung antara penjual dan pembeli.",
  },
  {
    category: "Pembelian",
    question: "Bagaimana Cara Membeli Mobil di NeroCars?",
    answer:
      "1. Browse katalog mobil di halaman 'Beli Mobil'\n2. Pilih mobil yang Anda minati\n3. Lihat detail spesifikasi dan foto mobil\n4. Hubungi penjual melalui WhatsApp, telepon, atau email\n5. Jadwalkan test drive dan inspeksi\n6. Negosiasi harga dengan penjual\n7. Lakukan transaksi pembayaran sesuai kesepakatan\n8. Selesaikan proses balik nama kendaraan",
  },
  {
    category: "Pembelian",
    question: "Apakah Saya Bisa Test Drive Mobil Sebelum Membeli?",
    answer:
      "Ya, sangat kami rekomendasikan untuk melakukan test drive sebelum membeli. Hubungi penjual untuk mengatur jadwal test drive. Pastikan Anda membawa SIM yang masih berlaku dan sebaiknya ajak mekanik terpercaya untuk inspeksi kondisi mobil.",
  },
  {
    category: "Pembelian",
    question: "Bagaimana Cara Pembayaran yang Aman?",
    answer:
      "Kami merekomendasikan:\n1. Lakukan pembayaran setelah melihat kondisi fisik mobil\n2. Gunakan transfer bank untuk jejak transaksi yang jelas\n3. Minta kwitansi dan surat perjanjian jual beli yang ditandatangani kedua belah pihak\n4. Pastikan BPKB asli ada dan cocok dengan kondisi mobil\n5. Hindari pembayaran 100% sebelum proses balik nama selesai\n6. Pertimbangkan menggunakan escrow service atau notaris untuk keamanan ekstra",
  },
  {
    category: "Penjualan",
    question: "Bagaimana Cara Menjual Mobil di NeroCars?",
    answer:
      "1. Klik tombol 'Jual Mobil' di navbar\n2. Isi formulir dengan detail mobil Anda (merek, model, tahun, harga, dll)\n3. Upload minimal 5 foto mobil dari berbagai sudut\n4. Isi informasi kontak Anda\n5. Submit iklan\n6. Tim kami akan review dan approve iklan dalam 24 jam\n7. Iklan Anda akan muncul di katalog\n8. Tunggu pembeli menghubungi Anda",
  },
  {
    category: "Penjualan",
    question: "Apakah Ada Biaya untuk Mengiklankan Mobil?",
    answer:
      "Saat ini, NeroCars menyediakan layanan iklan GRATIS untuk semua penjual. Anda dapat mengiklankan mobil Anda tanpa biaya apapun. Kami juga menyediakan paket premium dengan fitur tambahan seperti highlight iklan dan prioritas pencarian (coming soon).",
  },
  {
    category: "Penjualan",
    question: "Berapa Lama Iklan Mobil Saya Akan Aktif?",
    answer:
      "Iklan mobil Anda akan aktif selama 90 hari (3 bulan). Setelah itu, Anda dapat memperpanjang iklan secara gratis melalui dashboard 'Mobil Saya'. Anda juga dapat menghapus atau mengupdate iklan kapan saja.",
  },
  {
    category: "Penjualan",
    question: "Foto Seperti Apa yang Harus Saya Upload?",
    answer:
      "Tips foto yang baik:\n• Gunakan pencahayaan yang cukup (outdoor saat siang hari ideal)\n• Pastikan mobil dalam keadaan bersih\n• Ambil foto dari berbagai sudut: depan, belakang, samping kiri/kanan, interior, dashboard, mesin\n• Gunakan resolusi minimal 1024x768 pixel\n• Format: JPG atau PNG (maksimal 5MB per foto)\n• Minimal 5 foto, maksimal 8 foto\n• Hindari filter atau edit berlebihan",
  },
  {
    category: "Garansi",
    question: "Apakah Ada Garansi untuk Mobil Bekas?",
    answer:
      "Semua mobil bekas di NeroCars dilengkapi dengan garansi komprehensif:\n\n• Garansi Mesin & Transmisi: 6 bulan atau 10,000 km\n• Garansi Kelistrikan: 3 bulan atau 5,000 km\n• Roadside Assistance: 24 jam selama masa garansi\n• Free Service: 1x service gratis dalam 3 bulan pertama\n\nGaransi berlaku untuk kerusakan yang bukan disebabkan oleh kelalaian pengguna atau kecelakaan.",
  },
  {
    category: "Garansi",
    question: "Bagaimana Cara Klaim Garansi?",
    answer:
      "Untuk klaim garansi:\n1. Hubungi Customer Service kami di 1500-NERO (6376)\n2. Siapkan dokumen: surat jual beli, kartu garansi, STNK\n3. Jelaskan masalah yang terjadi\n4. Tim kami akan mengarahkan Anda ke bengkel mitra terdekat\n5. Inspeksi akan dilakukan oleh mekanik kami\n6. Jika termasuk garansi, perbaikan akan dilakukan tanpa biaya\n7. Waktu klaim maksimal 3-5 hari kerja",
  },
  {
    category: "Dokumen",
    question: "Dokumen Apa Saja yang Dibutuhkan untuk Jual Beli Mobil?",
    answer:
      "Untuk PENJUAL:\n• BPKB asli (bukan fotocopy)\n• STNK asli yang masih berlaku\n• KTP pemilik (sesuai BPKB)\n• Faktur pembelian (jika ada)\n• Buku service (jika ada)\n• Kwitansi blanko\n\nUntuk PEMBELI:\n• KTP asli\n• Kartu Keluarga (untuk balik nama)\n• Surat keterangan domisili (jika alamat KTP berbeda)\n• Dana untuk pembayaran dan biaya balik nama",
  },
  {
    category: "Dokumen",
    question: "Berapa Biaya Balik Nama Kendaraan?",
    answer:
      "Biaya balik nama bervariasi tergantung jenis mobil dan wilayah:\n\n• BBN-KB (Bea Balik Nama Kendaraan Bermotor): 10% dari NJKB\n• SWDKLLJ (Dana Kecelakaan): Rp 143,000 (mobil pribadi)\n• Biaya administrasi STNK baru: Rp 200,000\n• Biaya BPKB: Rp 375,000\n• Biaya cek fisik: Rp 50,000 - Rp 100,000\n• Biaya lain-lain: ~Rp 50,000\n\nTotal estimasi: Rp 2,000,000 - Rp 10,000,000 (tergantung NJKB mobil)\n\nNeroCars dapat membantu proses balik nama dengan biaya jasa tambahan.",
  },
  {
    category: "Dokumen",
    question: "Apakah NeroCars Membantu Proses Balik Nama?",
    answer:
      "Ya! NeroCars menyediakan layanan bantuan balik nama kendaraan dengan biaya jasa yang kompetitif. Tim kami akan mengurus semua dokumen dan proses di Samsat sehingga Anda tidak perlu repot. Hubungi Customer Service untuk informasi lebih lanjut.",
  },
  {
    category: "Teknis",
    question: "Bagaimana Cara Mengedit atau Menghapus Iklan Saya?",
    answer:
      "1. Login ke akun Anda\n2. Klik menu 'Mobil Saya' di profile\n3. Pilih mobil yang ingin diedit/hapus\n4. Klik tombol 'Edit' untuk mengubah detail\n5. Atau klik 'Hapus' untuk menghapus iklan\n6. Konfirmasi perubahan\n\nPerubahan akan langsung terlihat di katalog.",
  },
  {
    category: "Teknis",
    question: "Kenapa Iklan Saya Belum Muncul di Katalog?",
    answer:
      "Kemungkinan penyebab:\n• Iklan masih dalam proses review (maksimal 24 jam)\n• Iklan ditolak karena tidak memenuhi kriteria (cek email notifikasi)\n• Foto tidak memenuhi standar kualitas\n• Informasi tidak lengkap\n• Harga tidak realistis atau mencurigakan\n\nCek status iklan di dashboard 'Mobil Saya' atau hubungi Customer Service untuk bantuan.",
  },
  {
    category: "Teknis",
    question: "Bagaimana Cara Menghubungi Penjual?",
    answer:
      "Setiap iklan mobil memiliki informasi kontak penjual:\n• Tombol WhatsApp untuk chat langsung\n• Nomor telepon untuk call/SMS\n• Email untuk komunikasi formal\n\nPilih metode komunikasi sesuai preferensi Anda. Kami sarankan WhatsApp untuk respons yang lebih cepat.",
  },
  {
    category: "Akun",
    question: "Bagaimana Cara Membuat Akun di NeroCars?",
    answer:
      "1. Klik tombol 'Masuk' di navbar\n2. Pilih 'Daftar' atau 'Register'\n3. Isi formulir dengan nama lengkap, email, dan password\n4. Verifikasi email Anda melalui link yang dikirim\n5. Lengkapi profil Anda (foto, nomor HP, alamat)\n6. Mulai jual atau beli mobil!\n\nAtau login menggunakan akun Google untuk proses yang lebih cepat.",
  },
  {
    category: "Akun",
    question: "Apakah Data Pribadi Saya Aman?",
    answer:
      "Keamanan data adalah prioritas kami. NeroCars menggunakan:\n• Enkripsi SSL 256-bit untuk semua transaksi data\n• Database yang terenkripsi dan tersimpan secara aman\n• Autentikasi dua faktor untuk keamanan ekstra\n• Privacy policy yang ketat - data Anda tidak akan dijual ke pihak ketiga\n• Compliance dengan regulasi perlindungan data pribadi Indonesia\n\nBaca Privacy Policy kami untuk detail lengkap.",
  },
  {
    category: "Pembayaran",
    question: "Metode Pembayaran Apa Saja yang Tersedia?",
    answer:
      "Untuk transaksi jual beli mobil, kami merekomendasikan:\n• Transfer Bank (BCA, Mandiri, BNI, BRI, dll)\n• Transfer melalui ATM atau Mobile Banking\n• Cek/Giro untuk transaksi besar\n\nHINDARI:\n• Pembayaran cash dalam jumlah besar (risiko keamanan)\n• Transfer ke rekening atas nama berbeda\n• Pembayaran sebelum melihat kondisi mobil\n• Uang muka terlalu besar tanpa perjanjian tertulis",
  },
  {
    category: "Lainnya",
    question: "Apakah NeroCars Menerima Tukar Tambah (Trade-In)?",
    answer:
      "Saat ini NeroCars fokus pada platform marketplace yang menghubungkan penjual dan pembeli. Untuk tukar tambah, Anda dapat:\n1. Jual mobil lama Anda di NeroCars\n2. Gunakan hasilnya untuk membeli mobil baru\n\nAtau hubungi penjual secara langsung untuk negosiasi tukar tambah. Beberapa dealer mitra kami menerima tukar tambah.",
  },
  {
    category: "Lainnya",
    question: "Bagaimana Cara Melaporkan Iklan yang Mencurigakan?",
    answer:
      "Jika Anda menemukan iklan yang mencurigakan atau melanggar ketentuan:\n1. Klik tombol 'Laporkan' di halaman detail mobil\n2. Pilih alasan pelaporan (harga tidak wajar, foto palsu, penipuan, dll)\n3. Berikan detail tambahan jika ada\n4. Submit laporan\n\nTim kami akan review dalam 24 jam dan mengambil tindakan yang sesuai. Anda juga bisa hubungi Customer Service langsung.",
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");

  const categories = [
    "Semua",
    ...Array.from(new Set(faqs.map((faq) => faq.category))),
  ];

  const filteredFAQs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "Semua" || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-gray-400 text-lg">
              Pertanyaan yang sering ditanyakan seputar NeroCars
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Cari pertanyaan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-800 border border-amber-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="mb-8 flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedCategory === category
                    ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white"
                    : "bg-slate-800 text-gray-300 hover:bg-slate-700"
                }`}>
                {category}
              </button>
            ))}
          </div>

          {/* FAQ List */}
          <div className="space-y-4">
            {filteredFAQs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">
                  Tidak ada pertanyaan yang cocok dengan pencarian Anda.
                </p>
              </div>
            ) : (
              filteredFAQs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg border border-amber-500/30 overflow-hidden">
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-700/50 transition-all">
                    <div className="flex-1">
                      <div className="text-xs text-amber-400 font-medium mb-1">
                        {faq.category}
                      </div>
                      <h3 className="text-lg font-semibold text-white">
                        {faq.question}
                      </h3>
                    </div>
                    {openIndex === index ? (
                      <ChevronUp className="w-6 h-6 text-amber-400 flex-shrink-0 ml-4" />
                    ) : (
                      <ChevronDown className="w-6 h-6 text-amber-400 flex-shrink-0 ml-4" />
                    )}
                  </button>
                  {openIndex === index && (
                    <div className="px-6 py-4 border-t border-amber-500/20 bg-slate-900/50">
                      <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Contact Section */}
          <div className="mt-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-2">
              Masih Ada Pertanyaan?
            </h3>
            <p className="text-white/90 mb-4">
              Tim Customer Service kami siap membantu Anda
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href="mailto:support@nerocars.com"
                className="px-6 py-3 bg-white text-amber-600 rounded-lg font-semibold hover:bg-gray-100 transition-all">
                Email Kami
              </a>
              <a
                href="https://wa.me/6281234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all">
                WhatsApp
              </a>
              <a
                href="tel:1500-6376"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all">
                Telepon: 1500-NERO
              </a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
