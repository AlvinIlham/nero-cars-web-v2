"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Heart,
  Phone,
  MessageCircle,
  Share2,
  Check,
  ArrowLeft,
  MapPin,
  Gauge,
  Fuel,
  Settings,
  Calendar,
  Palette,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import { supabase } from "@/lib/supabase";
import {
  getOrCreateConversation,
  toggleFavorite,
  isCarFavorited,
} from "@/lib/database";

export default function CarDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [carDetails, setCarDetails] = useState<any>(null);
  const [sellerProfile, setSellerProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    fetchCurrentUser();
    fetchCarDetails();
  }, [params.id]);

  const fetchCurrentUser = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        setCurrentUser(profile || session.user);

        // Check if car is favorited by this user
        if (params.id) {
          const favorited = await isCarFavorited(
            session.user.id,
            params.id as string
          );
          setIsFavorite(favorited);
        }
      }
    } catch (error) {
      console.error("Error fetching current user:", error);
    }
  };

  const fetchCarDetails = async () => {
    try {
      setLoading(true);
      const carId = params.id as string;

      // Fetch car data from Supabase
      const { data: carData, error: carError } = await supabase
        .from("cars")
        .select("*")
        .eq("id", carId)
        .single();

      if (carError) {
        console.error("Error fetching car:", carError);
        setCarDetails(null);
        setLoading(false);
        return;
      }

      if (!carData) {
        setCarDetails(null);
        setLoading(false);
        return;
      }

      // Fetch seller profile
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", carData.user_id)
        .single();

      if (profileError) {
        console.error("Error fetching profile:", profileError);
      }

      setCarDetails(carData);
      setSellerProfile(profileData);

      // Update view count
      await incrementViewCount(carId);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const incrementViewCount = async (carId: string) => {
    try {
      const { data, error } = await supabase
        .from("cars")
        .select("views_count")
        .eq("id", carId)
        .single();

      if (!error && data) {
        await supabase
          .from("cars")
          .update({ views_count: (data.views_count || 0) + 1 })
          .eq("id", carId);
      }
    } catch (error) {
      console.error("Error incrementing view count:", error);
    }
  };

  const handleContactSeller = async () => {
    if (!currentUser) {
      router.push("/login");
      return;
    }

    if (!carDetails || !sellerProfile) {
      alert("Data mobil atau penjual tidak tersedia");
      return;
    }

    // Check if user is trying to contact themselves
    if (currentUser.id === sellerProfile.id) {
      alert("Anda tidak bisa menghubungi diri sendiri");
      return;
    }

    try {
      // Create or get existing conversation
      const { data: conversation, error } = await getOrCreateConversation(
        currentUser.id,
        sellerProfile.id,
        carDetails.id
      );

      if (error || !conversation) {
        console.error("Error creating conversation:", error);
        alert("Gagal membuat percakapan. Silakan coba lagi.");
        return;
      }

      // Redirect to messages page with the conversation
      router.push(`/messages?conversation=${conversation.id}`);
    } catch (error) {
      console.error("Error:", error);
      alert("Terjadi kesalahan. Silakan coba lagi.");
    }
  };

  const handleToggleFavorite = async () => {
    if (!currentUser) {
      alert("Silakan login terlebih dahulu untuk menambahkan favorit");
      router.push("/login");
      return;
    }

    if (!carDetails?.id) return;

    try {
      await toggleFavorite(currentUser.id, carDetails.id);
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("Error toggling favorite:", error);
      alert("Gagal mengubah status favorit. Silakan coba lagi.");
    }
  };

  const handleShareCar = async () => {
    if (!carDetails) return;

    const shareUrl = window.location.href;
    const shareTitle = `${carDetails.brand} ${carDetails.model} ${carDetails.year}`;
    const shareText = `Lihat mobil ${shareTitle} - ${formatPrice(
      carDetails.price
    )}`;

    // Check if Web Share API is supported
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
      } catch (error) {
        // User cancelled or error occurred
        if ((error as Error).name !== "AbortError") {
          console.error("Error sharing:", error);
        }
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(shareUrl);
        alert("Link mobil telah disalin ke clipboard!");
      } catch (error) {
        console.error("Error copying to clipboard:", error);
        alert("Gagal menyalin link. Silakan salin manual: " + shareUrl);
      }
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-xl text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  if (!carDetails) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Mobil Tidak Ditemukan
          </h1>
          <p className="text-gray-600 mb-8">
            Mobil yang Anda cari tidak ada atau telah dihapus.
          </p>
          <button
            onClick={() => router.push("/cars")}
            className="px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors">
            Lihat Mobil Lainnya
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors group">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Kembali</span>
        </button>

        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Title Section */}
            <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {carDetails.brand} {carDetails.model}
              </h1>
              <p className="text-lg text-gray-600 mb-3">
                Tahun {carDetails.year}
              </p>
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Gauge className="w-4 h-4" />
                  {carDetails.mileage?.toLocaleString()} km
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Settings className="w-4 h-4" />
                  {carDetails.transmission}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Fuel className="w-4 h-4" />
                  {carDetails.fuel_type}
                </span>
              </div>
              {!carDetails.is_sold && (
                <div className="mt-3">
                  <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                    <Check className="w-4 h-4" />
                    Tersedia
                  </span>
                </div>
              )}
              {carDetails.is_sold && (
                <div className="mt-3">
                  <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                    Terjual
                  </span>
                </div>
              )}
            </div>

            {/* Image Gallery */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              {carDetails.images && carDetails.images.length > 0 ? (
                <>
                  {/* Main Image */}
                  <div className="mb-4 relative">
                    <img
                      src={carDetails.images[selectedImage]}
                      alt={`${carDetails.brand} ${carDetails.model}`}
                      className="w-full h-64 sm:h-80 md:h-96 object-cover rounded-lg"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://via.placeholder.com/800x600/1e293b/94a3b8?text=No+Image";
                      }}
                    />
                  </div>

                  {/* Thumbnails */}
                  {carDetails.images.length > 1 && (
                    <div className="grid grid-cols-4 gap-2">
                      {carDetails.images.map((image: string, index: number) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImage(index)}
                          className={`relative h-16 sm:h-20 md:h-24 rounded-lg overflow-hidden border-2 transition-all ${
                            selectedImage === index
                              ? "border-amber-500 ring-2 ring-amber-200"
                              : "border-gray-200 hover:border-amber-300"
                          }`}>
                          <img
                            src={image}
                            alt={`Thumbnail ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src =
                                "https://via.placeholder.com/200/1e293b/94a3b8?text=No+Image";
                            }}
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-64 sm:h-80 md:h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                  <p className="text-gray-400">Tidak ada foto</p>
                </div>
              )}
            </div>

            {/* Specifications */}
            <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5 text-amber-500" />
                Spesifikasi Lengkap
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-500 mb-1">Merek</p>
                  <p className="font-semibold text-gray-900">
                    {carDetails.brand}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-500 mb-1">Model</p>
                  <p className="font-semibold text-gray-900">
                    {carDetails.model}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-500 mb-1">Tahun</p>
                  <p className="font-semibold text-gray-900">
                    {carDetails.year}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-500 mb-1">Transmisi</p>
                  <p className="font-semibold text-gray-900">
                    {carDetails.transmission}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-500 mb-1">Bahan Bakar</p>
                  <p className="font-semibold text-gray-900">
                    {carDetails.fuel_type}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-500 mb-1">Jarak Tempuh</p>
                  <p className="font-semibold text-gray-900">
                    {carDetails.mileage?.toLocaleString()} km
                  </p>
                </div>
                {carDetails.engine_capacity && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-500 mb-1">
                      Kapasitas Mesin
                    </p>
                    <p className="font-semibold text-gray-900">
                      {carDetails.engine_capacity}
                    </p>
                  </div>
                )}
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-500 mb-1">Warna</p>
                  <p className="font-semibold text-gray-900 flex items-center gap-2">
                    <Palette className="w-4 h-4" />
                    {carDetails.color}
                  </p>
                </div>
                {carDetails.condition && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-500 mb-1">Kondisi</p>
                    <p className="font-semibold text-gray-900">
                      {carDetails.condition}
                    </p>
                  </div>
                )}
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-500 mb-1">Lokasi</p>
                  <p className="font-semibold text-gray-900 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {carDetails.location}
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            {carDetails.description && (
              <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
                  📝 Deskripsi Lengkap
                </h2>
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {carDetails.description}
                  </p>
                </div>
              </div>
            )}

            {/* Seller Info */}
            {sellerProfile && (
              <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
                  👤 Informasi Penjual
                </h2>
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                    {sellerProfile.avatar_url ? (
                      <img
                        src={sellerProfile.avatar_url}
                        alt={sellerProfile.full_name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      sellerProfile.full_name?.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900">
                      {sellerProfile.full_name}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {sellerProfile.email}
                    </p>
                    {(sellerProfile.city || sellerProfile.province) && (
                      <p className="text-gray-600 text-sm flex items-center gap-1 mt-1">
                        <MapPin className="w-4 h-4" />
                        {sellerProfile.city}
                        {sellerProfile.city && sellerProfile.province && ", "}
                        {sellerProfile.province}
                      </p>
                    )}
                    {sellerProfile.phone && (
                      <p className="text-gray-600 text-sm flex items-center gap-1 mt-1">
                        <Phone className="w-4 h-4" />
                        {sellerProfile.phone}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Price & Actions */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm sticky top-4">
              <div className="mb-6">
                <p className="text-sm text-gray-500 mb-1">Harga</p>
                <p className="text-3xl font-bold text-amber-500">
                  {formatPrice(carDetails.price)}
                </p>
              </div>

              <div className="space-y-3 mb-6">
                {sellerProfile?.phone && (
                  <a
                    href={`tel:${sellerProfile.phone}`}
                    className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                    <Phone className="w-5 h-5" />
                    Hubungi Penjual
                  </a>
                )}
                <button
                  onClick={handleContactSeller}
                  className="w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Chat Penjual
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleToggleFavorite}
                    className={`py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                      isFavorite
                        ? "bg-red-100 text-red-600 hover:bg-red-200"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}>
                    <Heart
                      className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`}
                    />
                    Simpan
                  </button>
                  <button
                    onClick={handleShareCar}
                    className="py-3 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                    <Share2 className="w-5 h-5" />
                    Bagikan
                  </button>
                </div>
              </div>

              <div className="border-t pt-4 space-y-2">
                <p className="text-xs text-gray-500 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Dipublikasi: {formatDate(carDetails.created_at)}
                </p>
                <p className="text-xs text-gray-500">
                  👁️ Dilihat: {carDetails.views_count || 0} kali
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
