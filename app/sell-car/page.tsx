"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/layout/Navbar";
import { Camera, Check } from "lucide-react";

interface CarFormData {
  brand: string;
  model: string;
  year: string;
  transmission: string;
  engine_capacity: string;
  fuel_type: string;
  mileage: string;
  condition: string;
  price: string;
  location: string;
  description: string;
}

export default function SellCarPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CarFormData>({
    brand: "",
    model: "",
    year: "",
    transmission: "",
    engine_capacity: "",
    fuel_type: "",
    mileage: "",
    condition: "",
    price: "",
    location: "",
    description: "",
  });

  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [contactInfo, setContactInfo] = useState({
    name: "",
    phone: "",
    email: "",
    preferredContact: "",
  });
  const [agreements, setAgreements] = useState({
    termsAndConditions: false,
    promotionalInfo: false,
  });

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      router.push("/login-required");
      return;
    }

    setUser(session.user);

    // Fetch user profile to pre-fill contact info
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .single();

    if (profile) {
      setContactInfo({
        name: profile.full_name || "",
        phone: profile.phone || "",
        email: profile.email || session.user.email || "",
        preferredContact: "",
      });
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleContactChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setContactInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const newImages = [...images];
    const newPreviews = [...imagePreviews];

    newImages[index] = file;
    newPreviews[index] = URL.createObjectURL(file);

    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  const handleSubmit = async (isDraft: boolean = false) => {
    if (!user) return;

    // Validation only for publishing, not for draft
    if (!isDraft) {
      if (
        !formData.brand ||
        !formData.model ||
        !formData.year ||
        !formData.price ||
        !formData.transmission ||
        !formData.fuel_type
      ) {
        alert("Mohon lengkapi semua field yang wajib diisi");
        return;
      }

      const uploadedImages = images.filter((img) => img).length;
      if (uploadedImages < 5) {
        alert(
          `Mohon upload minimal 5 foto mobil.\nAnda baru upload ${uploadedImages} foto.`
        );
        return;
      }

      if (!agreements.termsAndConditions) {
        alert("Mohon setujui Syarat dan Ketentuan");
        return;
      }
    } else {
      // For draft, at least require basic info
      if (!formData.brand && !formData.model && !formData.year) {
        alert(
          "Mohon isi minimal brand, model, atau tahun untuk menyimpan draft"
        );
        return;
      }
    }

    try {
      setLoading(true);

      // Upload images to Supabase Storage
      const imageUrls: string[] = [];
      const bucketName = "car-image";

      for (let i = 0; i < images.length; i++) {
        if (images[i]) {
          const file = images[i];
          const fileExt = file.name.split(".").pop();
          const timestamp = Date.now();
          const fileName = `${user.id}/${timestamp}_${i}.${fileExt}`;

          const { data: uploadData, error: uploadError } =
            await supabase.storage.from(bucketName).upload(fileName, file, {
              cacheControl: "3600",
              upsert: false,
              contentType: file.type || "image/jpeg",
            });

          if (uploadError) {
            console.error("Upload error:", uploadError);

            // Better error message for common issues
            if (
              uploadError.message.includes("Failed to fetch") ||
              uploadError.message.includes("NetworkError")
            ) {
              alert(
                '❌ Upload gagal!\n\nKemungkinan penyebab:\n1. Bucket "car-image" tidak public\n2. Policy upload belum di-set\n3. Masalah koneksi internet\n\nSolusi: Buka Supabase Dashboard > Storage > car-image > pastikan Public & Policies sudah di-set'
              );
            }

            throw new Error(
              `Gagal upload gambar ${i + 1}: ${uploadError.message}`
            );
          }

          // Get public URL
          const {
            data: { publicUrl },
          } = supabase.storage.from(bucketName).getPublicUrl(fileName);

          imageUrls.push(publicUrl);
        }
      }

      // Insert car data
      const carData = {
        user_id: user.id,
        brand: formData.brand || null,
        model: formData.model || null,
        year: formData.year ? parseInt(formData.year) : null,
        transmission: formData.transmission || "Manual",
        engine_capacity: formData.engine_capacity || null,
        fuel_type: formData.fuel_type || "Petrol",
        mileage: formData.mileage ? parseInt(formData.mileage) : 0,
        condition: formData.condition || "Good",
        color: "Various",
        price: formData.price ? parseInt(formData.price) : 0,
        location: formData.location || null,
        description: formData.description || null,
        images: imageUrls.length > 0 ? imageUrls : [],
        is_sold: false,
        is_draft: isDraft,
      };

      console.log("Inserting car data:", carData);

      const { data, error } = await supabase.from("cars").insert(carData);

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      alert(
        isDraft ? "Draft berhasil disimpan!" : "Mobil berhasil dipublikasikan!"
      );
      router.push("/my-cars");
    } catch (error: any) {
      console.error("Error submitting car:", error);

      // More detailed error message
      const errorMessage = error?.message || "Gagal menyimpan data mobil";
      alert(`Gagal menyimpan data mobil: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const imageSlots = [
    { label: "Foto Depan", sublabel: "Wajib" },
    { label: "Foto Belakang", sublabel: "Wajib" },
    { label: "Interior", sublabel: "Wajib" },
    { label: "Dashboard", sublabel: "Wajib" },
    { label: "Mesin", sublabel: "Wajib" },
    { label: "Foto Tambahan", sublabel: "Opsional" },
    { label: "Foto Tambahan", sublabel: "Opsional" },
    { label: "Foto Tambahan", sublabel: "Opsional" },
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-200 via-slate-100 to-slate-200 pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="bg-white rounded-lg p-8 mb-6 shadow-sm">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">
              Jual Mobil Anda Sekarang
            </h1>
            <p className="text-slate-600">
              Isi form di bawah ini untuk mulai menjual mobil Anda
            </p>
          </div>

          {/* Form Container */}
          <div className="bg-white rounded-lg p-8 shadow-sm">
            {/* Informasi Mobil Section */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-slate-800 mb-6">
                Informasi Mobil
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Merek Mobil */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Merek Mobil <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    placeholder="Pilih Merek Mobil"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-800 focus:border-transparent outline-none transition-all text-slate-800"
                  />
                </div>

                {/* Model/Tipe */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Model/Tipe <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="model"
                    value={formData.model}
                    onChange={handleInputChange}
                    placeholder="Contoh: Avanza, Jazz, Swift"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-800 focus:border-transparent outline-none transition-all text-slate-800"
                  />
                </div>

                {/* Tahun Pembuatan */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Tahun Pembuatan <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    placeholder="Pilih Tahun"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-800 focus:border-transparent outline-none transition-all text-slate-800"
                  />
                </div>

                {/* Transmisi */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Transmisi <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="transmission"
                    value={formData.transmission}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-800 focus:border-transparent outline-none transition-all text-slate-800">
                    <option value="">Pilih Transmisi</option>
                    <option value="Manual">Manual</option>
                    <option value="Automatic">Automatic</option>
                  </select>
                </div>

                {/* Kapasitas Mesin */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Kapasitas Mesin <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="engine_capacity"
                    value={formData.engine_capacity}
                    onChange={handleInputChange}
                    placeholder="Contoh: 1500cc, 2000cc"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-800 focus:border-transparent outline-none transition-all text-slate-800"
                  />
                </div>

                {/* Jenis BBM */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Jenis BBM <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="fuel_type"
                    value={formData.fuel_type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-800 focus:border-transparent outline-none transition-all text-slate-800">
                    <option value="">Pilih Jenis BBM</option>
                    <option value="Petrol">Bensin (Petrol)</option>
                    <option value="Diesel">Solar (Diesel)</option>
                    <option value="Electric">Listrik (Electric)</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>

                {/* Kilometer Tempuh */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Kilometer Tempuh <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="mileage"
                    value={formData.mileage}
                    onChange={handleInputChange}
                    placeholder="0"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-800 focus:border-transparent outline-none transition-all text-slate-800"
                  />
                </div>

                {/* Kondisi Mobil */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Kondisi Mobil <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="condition"
                    value={formData.condition}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-800 focus:border-transparent outline-none transition-all text-slate-800">
                    <option value="">Pilih Kondisi</option>
                    <option value="Excellent">Excellent (Seperti Baru)</option>
                    <option value="Good">Good (Baik)</option>
                    <option value="Fair">Fair (Cukup Baik)</option>
                    <option value="Poor">Poor (Perlu Perbaikan)</option>
                  </select>
                </div>

                {/* Harga yang Diinginkan */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Harga yang Diinginkan{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="Rp 0"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-800 focus:border-transparent outline-none transition-all text-slate-800"
                  />
                </div>

                {/* Lokasi Mobil */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Lokasi Mobil <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Kota, Provinsi"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-800 focus:border-transparent outline-none transition-all text-slate-800"
                  />
                </div>

                {/* Deskripsi Tambahan */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Deskripsi Tambahan
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Ceritakan lebih detail tentang kondisi mobil, sejarah perawatan, modifikasi, dll..."
                    rows={4}
                    maxLength={500}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-800 focus:border-transparent outline-none transition-all resize-none text-slate-800"
                  />
                  <p className="text-sm text-slate-500 mt-1 text-right">
                    {formData.description.length}/500 karakter
                  </p>
                </div>
              </div>
            </div>

            {/* Upload Foto Mobil Section */}
            <div className="mb-8 pb-8 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-800 mb-2">
                Upload Foto Mobil
              </h2>
              <p className="text-sm text-slate-600 mb-6">
                Upload minimal 5 foto mobil dari berbagai sudut untuk
                mendapatkan respons yang lebih baik
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {imageSlots.map((slot, index) => (
                  <div key={index} className="relative">
                    <input
                      type="file"
                      id={`image-${index}`}
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, index)}
                      className="hidden"
                    />
                    <label
                      htmlFor={`image-${index}`}
                      className="block aspect-square bg-slate-100 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-slate-800 transition-all overflow-hidden">
                      {imagePreviews[index] ? (
                        <img
                          src={imagePreviews[index]}
                          alt={slot.label}
                          loading="lazy"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full p-4">
                          <Camera className="w-8 h-8 text-slate-400 mb-2" />
                          <p className="text-xs text-slate-600 text-center font-medium">
                            {slot.label}
                          </p>
                          <p className="text-xs text-slate-400">
                            {slot.sublabel}
                          </p>
                        </div>
                      )}
                    </label>
                  </div>
                ))}
              </div>

              {/* Tips Foto */}
              <div className="mt-6 bg-slate-50 rounded-lg p-4">
                <h3 className="font-semibold text-slate-800 mb-3">
                  Tips Foto yang Baik:
                </h3>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>
                      Gunakan pencahayaan yang cukup (outdoor atau indoor
                      terang)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Pastikan mobil dalam keadaan bersih</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Ambil foto dari berbagai sudut yang jelas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>
                      Format yang didukung: JPG, PNG (maksimal 5MB per foto)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Resolusi minimal 1024x768 pixel</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Informasi Kontak Section */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-slate-800 mb-6">
                Informasi Kontak
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nama Lengkap */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={contactInfo.name}
                    onChange={handleContactChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-800 focus:border-transparent outline-none transition-all text-slate-800"
                  />
                </div>

                {/* Nomor Telepon */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Nomor Telepon <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={contactInfo.phone}
                    onChange={handleContactChange}
                    placeholder="08xxxxxxxxxx"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-800 focus:border-transparent outline-none transition-all text-slate-800"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={contactInfo.email}
                    onChange={handleContactChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-800 focus:border-transparent outline-none transition-all text-slate-800"
                  />
                </div>

                {/* Kontak Preferensi */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Kontak Preferensi
                  </label>
                  <select
                    name="preferredContact"
                    value={contactInfo.preferredContact}
                    onChange={handleContactChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-800 focus:border-transparent outline-none transition-all text-slate-800">
                    <option value="">Pilih Kontak Preferensi</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="phone">Telepon</option>
                    <option value="email">Email</option>
                  </select>
                </div>
              </div>

              {/* Agreements */}
              <div className="mt-6 space-y-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreements.termsAndConditions}
                    onChange={(e) =>
                      setAgreements((prev) => ({
                        ...prev,
                        termsAndConditions: e.target.checked,
                      }))
                    }
                    className="mt-1 w-4 h-4 text-slate-800 border-slate-300 rounded focus:ring-slate-800"
                  />
                  <span className="text-sm text-slate-700">
                    Saya menyetujui{" "}
                    <a
                      href="#"
                      className="text-slate-800 font-medium underline">
                      Syarat dan Ketentuan
                    </a>{" "}
                    serta{" "}
                    <a
                      href="#"
                      className="text-slate-800 font-medium underline">
                      Kebijakan Privasi
                    </a>{" "}
                    NEROCARS
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreements.promotionalInfo}
                    onChange={(e) =>
                      setAgreements((prev) => ({
                        ...prev,
                        promotionalInfo: e.target.checked,
                      }))
                    }
                    className="mt-1 w-4 h-4 text-slate-800 border-slate-300 rounded focus:ring-slate-800"
                  />
                  <span className="text-sm text-slate-700">
                    Saya bersedia menerima informasi penawaran dan promosi dari
                    NEROCARS
                  </span>
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 justify-between items-center">
              <button
                onClick={() => router.back()}
                type="button"
                className="px-8 py-3 bg-white border-2 border-slate-300 text-slate-600 rounded-lg font-semibold hover:bg-slate-50 transition-all">
                Batal
              </button>

              <div className="flex gap-4">
                <button
                  onClick={() => handleSubmit(true)}
                  disabled={loading}
                  type="button"
                  className="px-8 py-3 bg-white border-2 border-slate-800 text-slate-800 rounded-lg font-semibold hover:bg-slate-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                  Simpan Draft
                </button>
                <button
                  onClick={() => handleSubmit(false)}
                  disabled={loading}
                  type="button"
                  className="px-8 py-3 bg-slate-800 text-white rounded-lg font-semibold hover:bg-slate-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                  {loading ? "Memproses..." : "Jual Mobil Sekarang"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
