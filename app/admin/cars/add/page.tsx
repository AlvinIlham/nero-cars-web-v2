"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, Camera, Check } from "lucide-react";
import Link from "next/link";

export default function AddCar() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
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

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
    // Get admin user
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
      alert("Not authenticated");
      return;
    }

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
          const fileName = `${session.user.id}/${timestamp}_${i}.${fileExt}`;

          const { data: uploadData, error: uploadError } =
            await supabase.storage.from(bucketName).upload(fileName, file, {
              cacheControl: "3600",
              upsert: false,
              contentType: file.type || "image/jpeg",
            });

          if (uploadError) {
            console.error("Upload error:", uploadError);
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
        user_id: session.user.id,
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

      const { error } = await supabase.from("cars").insert(carData);

      if (error) throw error;

      alert(
        isDraft ? "Draft berhasil disimpan!" : "Mobil berhasil dipublikasikan!"
      );
      router.push("/admin/cars");
    } catch (error: any) {
      console.error("Error creating car:", error);
      alert(`Gagal menyimpan data mobil: ${error.message}`);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-slate-800/50 border-b border-amber-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/cars"
              className="text-amber-400 hover:text-amber-300 transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white">Add New Car</h1>
              <p className="text-sm text-gray-400">
                Tambahkan mobil baru ke inventory
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Form Container */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-8 border border-amber-500/30">
          {/* Informasi Mobil Section */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-white mb-6">
              Informasi Mobil
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Merek Mobil */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Merek Mobil <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  placeholder="Toyota, Honda, dll"
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all text-white placeholder-gray-400"
                />
              </div>

              {/* Model/Tipe */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Model/Tipe <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleInputChange}
                  placeholder="Avanza, Jazz, Swift"
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all text-white placeholder-gray-400"
                />
              </div>

              {/* Tahun Pembuatan */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tahun Pembuatan <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  placeholder="2020"
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all text-white placeholder-gray-400"
                />
              </div>

              {/* Transmisi */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Transmisi <span className="text-red-500">*</span>
                </label>
                <select
                  name="transmission"
                  value={formData.transmission}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all text-white">
                  <option value="">Pilih Transmisi</option>
                  <option value="Manual">Manual</option>
                  <option value="Automatic">Automatic</option>
                </select>
              </div>

              {/* Kapasitas Mesin */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Kapasitas Mesin <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="engine_capacity"
                  value={formData.engine_capacity}
                  onChange={handleInputChange}
                  placeholder="1500cc, 2000cc"
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all text-white placeholder-gray-400"
                />
              </div>

              {/* Jenis BBM */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Jenis BBM <span className="text-red-500">*</span>
                </label>
                <select
                  name="fuel_type"
                  value={formData.fuel_type}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all text-white">
                  <option value="">Pilih Jenis BBM</option>
                  <option value="Petrol">Bensin (Petrol)</option>
                  <option value="Diesel">Solar (Diesel)</option>
                  <option value="Electric">Listrik (Electric)</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>

              {/* Kilometer Tempuh */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Kilometer Tempuh <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="mileage"
                  value={formData.mileage}
                  onChange={handleInputChange}
                  placeholder="50000"
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all text-white placeholder-gray-400"
                />
              </div>

              {/* Kondisi Mobil */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Kondisi Mobil <span className="text-red-500">*</span>
                </label>
                <select
                  name="condition"
                  value={formData.condition}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all text-white">
                  <option value="">Pilih Kondisi</option>
                  <option value="Excellent">Excellent (Seperti Baru)</option>
                  <option value="Good">Good (Baik)</option>
                  <option value="Fair">Fair (Cukup Baik)</option>
                  <option value="Poor">Poor (Perlu Perbaikan)</option>
                </select>
              </div>

              {/* Harga */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Harga yang Diinginkan <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="Rp 150000000"
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all text-white placeholder-gray-400"
                />
              </div>

              {/* Lokasi Mobil */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Lokasi Mobil <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Jakarta, Surabaya, dll"
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all text-white placeholder-gray-400"
                />
              </div>

              {/* Deskripsi Tambahan */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Deskripsi Tambahan
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Deskripsi lengkap tentang mobil..."
                  rows={4}
                  maxLength={500}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all resize-none text-white placeholder-gray-400"
                />
                <p className="text-sm text-gray-400 mt-1 text-right">
                  {formData.description.length}/500 karakter
                </p>
              </div>
            </div>
          </div>

          {/* Upload Foto Mobil Section */}
          <div className="mb-8 pb-8 border-b border-amber-500/20">
            <h2 className="text-xl font-bold text-white mb-2">
              Upload Foto Mobil
            </h2>
            <p className="text-sm text-gray-400 mb-6">
              Upload minimal 5 foto mobil dari berbagai sudut
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
                    className="block aspect-square bg-slate-700/50 border-2 border-dashed border-slate-600 rounded-lg cursor-pointer hover:border-amber-500 transition-all overflow-hidden">
                    {imagePreviews[index] ? (
                      <img
                        src={imagePreviews[index]}
                        alt={slot.label}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full p-4">
                        <Camera className="w-8 h-8 text-gray-400 mb-2" />
                        <p className="text-xs text-white text-center font-medium">
                          {slot.label}
                        </p>
                        <p className="text-xs text-gray-400">{slot.sublabel}</p>
                      </div>
                    )}
                  </label>
                </div>
              ))}
            </div>

            {/* Tips Foto */}
            <div className="mt-6 bg-slate-700/30 rounded-lg p-4 border border-slate-600">
              <h3 className="font-semibold text-white mb-3">
                Tips Foto yang Baik:
              </h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>
                    Gunakan pencahayaan yang cukup (outdoor atau indoor terang)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Pastikan mobil dalam keadaan bersih</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Ambil foto dari berbagai sudut yang jelas</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>
                    Format yang didukung: JPG, PNG (maksimal 5MB per foto)
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 justify-between items-center">
            <Link
              href="/admin/cars"
              className="px-8 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition-all">
              Batal
            </Link>

            <div className="flex gap-4">
              <button
                onClick={() => handleSubmit(true)}
                disabled={loading}
                type="button"
                className="px-8 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-amber-500/30">
                Simpan Draft
              </button>
              <button
                onClick={() => handleSubmit(false)}
                disabled={loading}
                type="button"
                className="px-8 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? "Memproses..." : "Tambahkan Mobil"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
