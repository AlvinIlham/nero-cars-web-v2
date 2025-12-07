"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Camera, X } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import ChatWidget from "@/components/chat/ChatWidget";
import { supabase } from "@/lib/supabase";

export default function EditProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [totalCars, setTotalCars] = useState<number>(0);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    birthDate: "",
    gender: "Laki-laki",
    address: "",
    city: "",
    province: "",
    avatar_url: "",
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        router.push("/login");
        return;
      }

      setUser(session.user);

      // Fetch profile data
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      // Fetch total cars count
      const { count } = await supabase
        .from("cars")
        .select("*", { count: "exact", head: true })
        .eq("user_id", session.user.id);

      setTotalCars(count || 0);

      if (error) {
        const [firstName, ...lastNameParts] = (profile.full_name || "").split(
          " "
        );
        setFormData({
          firstName: firstName || "",
          lastName: lastNameParts.join(" ") || "",
          email: profile.email || session.user.email || "",
          phone: profile.phone || "",
          birthDate: profile.birth_date || "",
          gender: profile.gender || "Laki-laki",
          address: profile.address || "",
          city: profile.city || "",
          province: profile.province || "",
          avatar_url: profile.avatar_url || "",
        });

        // Set avatar preview if exists
        if (profile.avatar_url) {
          setAvatarPreview(profile.avatar_url);
        }
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      let avatarUrl = formData.avatar_url;

      // Upload avatar if file selected
      if (avatarFile) {
        const fileExt = avatarFile.name.split(".").pop();
        const fileName = `${user.id}/avatar_${Date.now()}.${fileExt}`;

        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("car-image") // Using same bucket as car images
          .upload(fileName, avatarFile);

        if (uploadError) throw uploadError;

        // Get public URL
        const {
          data: { publicUrl },
        } = supabase.storage.from("car-image").getPublicUrl(fileName);

        avatarUrl = publicUrl;
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName,
          phone: formData.phone,
          birth_date: formData.birthDate,
          gender: formData.gender,
          address: formData.address,
          city: formData.city,
          province: formData.province,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;

      alert("Profil berhasil diperbarui!");
      router.push("/");
    } catch (error: any) {
      console.error("Error updating profile:", error);
      alert(error.message || "Gagal memperbarui profil");
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Ukuran file maksimal 5MB");
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("File harus berupa gambar");
        return;
      }

      setAvatarFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview("");
    setFormData({ ...formData, avatar_url: "" });
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-amber-900">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors group">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Kembali</span>
        </button>

        {/* Header */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 mb-6 border border-white/10">
          <h1 className="text-2xl font-bold text-white mb-2">
            Settings Profil
          </h1>
          <p className="text-white/70">
            Kelola informasi pribadi dan preferensi akun Anda
          </p>
        </div>

        {/* Profile Info Card */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 mb-6 border border-white/10">
          <div className="flex items-center gap-4">
            {/* Avatar Preview */}
            <div className="relative">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Avatar"
                  className="w-20 h-20 rounded-full object-cover border-2 border-white/20"
                />
              ) : (
                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {formData.firstName.charAt(0).toUpperCase() || "U"}
                  {formData.lastName.charAt(0).toUpperCase() || ""}
                </div>
              )}

              {/* Upload Button */}
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full cursor-pointer transition-all shadow-lg">
                <Camera className="w-4 h-4" />
                <input
                  type="file"
                  id="avatar-upload"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </label>

              {/* Remove Button */}
              {avatarPreview && (
                <button
                  onClick={removeAvatar}
                  className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full transition-all shadow-lg">
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            <div>
              <h2 className="text-xl font-bold text-white">
                {formData.firstName} {formData.lastName}
              </h2>
              <p className="text-white/70">{formData.email}</p>
              <p className="text-xs text-white/50 mt-1">
                {avatarFile
                  ? `File baru: ${avatarFile.name}`
                  : "Klik ikon kamera untuk upload foto"}
              </p>
              <div className="flex gap-4 mt-2 text-sm">
                <div>
                  <span className="text-white font-bold">{totalCars}</span>
                  <span className="text-white/70 ml-1">Mobil Dijual</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informasi Personal */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h3 className="text-lg font-bold text-white mb-4">
              Informasi Personal
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Nama Depan */}
              <div>
                <label className="block text-white/80 text-sm mb-2">
                  Nama Depan
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Nama Belakang */}
              <div>
                <label className="block text-white/80 text-sm mb-2">
                  Nama Belakang{" "}
                  <span className="text-white/50 text-xs">(Opsional)</span>
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-white/80 text-sm mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white/50 cursor-not-allowed"
                />
              </div>

              {/* Nomor Telepon */}
              <div>
                <label className="block text-white/80 text-sm mb-2">
                  Nomor Telepon
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="08123456789"
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Tanggal Lahir */}
              <div>
                <label className="block text-white/80 text-sm mb-2">
                  Tanggal Lahir
                </label>
                <input
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) =>
                    setFormData({ ...formData, birthDate: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Jenis Kelamin */}
              <div>
                <label className="block text-white/80 text-sm mb-2">
                  Jenis Kelamin
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) =>
                    setFormData({ ...formData, gender: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>
            </div>
          </div>

          {/* Alamat */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h3 className="text-lg font-bold text-white mb-4">Alamat</h3>

            <div className="space-y-4">
              {/* Alamat Lengkap */}
              <div>
                <label className="block text-white/80 text-sm mb-2">
                  Alamat Lengkap
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  placeholder="Jl. Sudirman No. 45, RT 003/RW 007, Kebayoran Baru"
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Kota */}
                <div>
                  <label className="block text-white/80 text-sm mb-2">
                    Kota
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    placeholder="Jakarta"
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Provinsi */}
                <div>
                  <label className="block text-white/80 text-sm mb-2">
                    Provinsi
                  </label>
                  <input
                    type="text"
                    value={formData.province}
                    onChange={(e) =>
                      setFormData({ ...formData, province: e.target.value })
                    }
                    placeholder="DKI Jakarta"
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-end">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold transition-all border border-white/20">
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      </div>

      {/* Chat Widget */}
      <ChatWidget />
    </div>
  );
}
