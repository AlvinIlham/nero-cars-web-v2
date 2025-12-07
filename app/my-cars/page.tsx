"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
// import { db } from "@/lib/prisma"; // Prisma removed
import Navbar from "@/components/layout/Navbar";
import Link from "next/link";
import {
  Heart,
  Edit,
  Trash2,
  Eye,
  MapPin,
  Car as CarIcon,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  transmission: string;
  fuel_type: string;
  color: string;
  location: string;
  images: string[];
  is_sold: boolean;
  created_at: string;
}

interface CarStatistics {
  views: number;
  favorites: number;
  messages: number;
}

interface UserProfile {
  full_name: string;
  email: string;
  avatar_url: string | null;
  location?: string;
  rating?: number;
  total_reviews?: number;
  total_sales?: number;
}

export default function MyCarsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [cars, setCars] = useState<Car[]>([]);
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [carStats, setCarStats] = useState<Record<string, CarStatistics>>({});
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<
    "all" | "available" | "sold"
  >("all");
  const [sortBy, setSortBy] = useState<
    "newest" | "oldest" | "price_low" | "price_high"
  >("newest");
  const [currentImageIndex, setCurrentImageIndex] = useState<{
    [key: string]: number;
  }>({});

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [cars, activeFilter, sortBy]);

  const checkUser = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      router.push("/login-required");
      return;
    }

    setUser(session.user);
    await fetchProfile(session.user.id);
    await fetchMyCars(session.user.id);
  };

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;

      // Get total cars count for this user
      const { count: totalCars } = await supabase
        .from("cars")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId);

      setProfile({
        full_name: data.full_name || "User",
        email: data.email || "",
        avatar_url: data.avatar_url || null,
        location:
          data.city && data.province
            ? `${data.city}, ${data.province}`
            : data.city || data.province || "Lokasi tidak diset",
        rating: data.average_rating || 0,
        total_reviews: data.total_reviews || 0,
        total_sales: totalCars || 0,
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const fetchMyCars = async (userId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("cars")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setCars(data || []);

      // Load statistics for each car
      if (data) {
        await loadStatistics(data.map((car) => car.id));
      }
    } catch (error) {
      console.error("Error fetching cars:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadStatistics = async (carIds: string[]) => {
    try {
      const stats: Record<string, CarStatistics> = {};

      // Load statistics for each car from database
      await Promise.all(
        carIds.map(async (carId) => {
          // Get favorites count
          const { count: favCount } = await supabase
            .from("favorites")
            .select("*", { count: "exact", head: true })
            .eq("car_id", carId);

          // Get messages count (conversations related to this car)
          const { count: msgCount } = await supabase
            .from("conversations")
            .select("*", { count: "exact", head: true })
            .eq("car_id", carId);

          // For views, use the views_count column from cars table
          const { data: carData } = await supabase
            .from("cars")
            .select("views_count")
            .eq("id", carId)
            .single();

          stats[carId] = {
            views: carData?.views_count || 0,
            favorites: favCount || 0,
            messages: msgCount || 0,
          };
        })
      );

      setCarStats(stats);
    } catch (error) {
      console.error("Error loading statistics:", error);
      // Set default stats on error
      const defaultStats: Record<string, CarStatistics> = {};
      carIds.forEach((id) => {
        defaultStats[id] = { views: 0, favorites: 0, messages: 0 };
      });
      setCarStats(defaultStats);
    }
  };

  const applyFilters = () => {
    let filtered = [...cars];

    // Apply status filter
    if (activeFilter === "available") {
      filtered = filtered.filter((car) => !car.is_sold);
    } else if (activeFilter === "sold") {
      filtered = filtered.filter((car) => car.is_sold);
    }

    // Apply sorting
    if (sortBy === "newest") {
      filtered.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    } else if (sortBy === "oldest") {
      filtered.sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
    } else if (sortBy === "price_low") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price_high") {
      filtered.sort((a, b) => b.price - a.price);
    }

    setFilteredCars(filtered);
  };

  const handleDelete = async (carId: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus mobil ini?")) return;

    try {
      // Security: Verify car belongs to current user before deleting
      const { data: carData, error: fetchError } = await supabase
        .from("cars")
        .select("user_id")
        .eq("id", carId)
        .single();

      if (fetchError) throw fetchError;

      if (carData.user_id !== user?.id) {
        alert("Anda tidak memiliki izin untuk menghapus mobil ini!");
        return;
      }

      const { error } = await supabase
        .from("cars")
        .delete()
        .eq("id", carId)
        .eq("user_id", user.id); // Double check security

      if (error) throw error;

      setCars(cars.filter((car) => car.id !== carId));
      alert("Mobil berhasil dihapus!");
    } catch (error) {
      console.error("Error deleting car:", error);
      alert("Gagal menghapus mobil. Silakan coba lagi.");
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
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
    const day = date.getDate();
    const month = date.toLocaleString("id-ID", { month: "short" });
    const year = date.getFullYear();
    return `Dipublikasi ${day} ${month} ${year}`;
  };

  const nextImage = (carId: string, totalImages: number) => {
    setCurrentImageIndex((prev) => ({
      ...prev,
      [carId]: ((prev[carId] || 0) + 1) % totalImages,
    }));
  };

  const prevImage = (carId: string, totalImages: number) => {
    setCurrentImageIndex((prev) => ({
      ...prev,
      [carId]: ((prev[carId] || 0) - 1 + totalImages) % totalImages,
    }));
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-24 flex items-center justify-center">
          <div className="text-white text-xl">Loading...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="mb-6 flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors group">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Kembali</span>
          </button>

          {/* Profile Section */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 mb-8 border border-amber-500/30">
            <div className="flex items-center gap-6">
              {/* Avatar */}
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.full_name}
                    loading="lazy"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  getInitials(profile?.full_name || "User")
                )}
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-white mb-2">
                  {profile?.full_name || "User"}
                </h1>
                <div className="flex items-center gap-6 text-gray-300 mb-3">
                  {profile?.rating && profile.rating > 0 ? (
                    <div>
                      <span className="text-amber-400 text-lg font-semibold">
                        {profile.rating.toFixed(1)}/5
                      </span>
                      <span className="text-sm ml-1">
                        ({profile.total_reviews} ulasan)
                      </span>
                    </div>
                  ) : (
                    <div className="text-gray-400 text-sm">
                      Belum ada ulasan
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-amber-400" />
                    <span>{profile?.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-amber-400 font-semibold">
                      {profile?.total_sales}
                    </span>
                    <span>Total Iklan</span>
                  </div>
                </div>
                <p className="text-gray-400 text-sm">{profile?.email}</p>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 mb-8 border border-amber-500/30">
            <div className="flex flex-wrap items-center gap-4 justify-between">
              {/* Jual Mobil Button */}
              <Link
                href="/sell-car"
                className="px-6 py-2 rounded-lg font-medium transition-all bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600">
                + Jual Mobil
              </Link>

              {/* Right side - Sort and Total */}
              <div className="flex items-center gap-4">
                {/* Sort Dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-4 py-2 bg-slate-700/50 text-gray-300 rounded-lg border border-slate-600 focus:border-amber-500 focus:outline-none">
                  <option value="newest">Terbaru</option>
                  <option value="oldest">Terlama</option>
                  <option value="price_high">Harga Tertinggi</option>
                  <option value="price_low">Harga Terendah</option>
                </select>

                {/* Total Count */}
                <div className="text-gray-400 text-sm">
                  Total:{" "}
                  <span className="text-white font-semibold">
                    {filteredCars.length}
                  </span>{" "}
                  mobil aktif
                </div>
              </div>
            </div>
          </div>

          {/* Cars Grid */}
          {filteredCars.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-xl mb-4">
                Belum ada mobil yang dijual
              </p>
              <Link
                href="/sell-car"
                className="inline-block px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all">
                Jual Mobil Baru
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredCars.map((car) => (
                <div
                  key={car.id}
                  className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl overflow-hidden border border-amber-500/30 hover:border-amber-500/50 transition-all group">
                  {/* Car Image */}
                  <div className="relative h-64 overflow-hidden bg-slate-700 group">
                    {car.images && car.images.length > 0 && car.images[0] ? (
                      <>
                        <img
                          src={car.images[currentImageIndex[car.id] || 0]}
                          alt={`${car.brand} ${car.model}`}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-500"
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://via.placeholder.com/800x600/1e293b/94a3b8?text=No+Image";
                          }}
                        />

                        {/* Navigation Arrows - Only show if more than 1 image */}
                        {car.images.length > 1 && (
                          <>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                prevImage(car.id, car.images.length);
                              }}
                              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10">
                              <ChevronLeft className="w-6 h-6" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                nextImage(car.id, car.images.length);
                              }}
                              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10">
                              <ChevronRight className="w-6 h-6" />
                            </button>

                            {/* Image Counter */}
                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                              {(currentImageIndex[car.id] || 0) + 1} /{" "}
                              {car.images.length}
                            </div>
                          </>
                        )}
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-800">
                        <div className="text-center">
                          <CarIcon className="w-20 h-20 text-slate-500 mx-auto mb-2" />
                          <p className="text-slate-400">Tidak ada foto</p>
                        </div>
                      </div>
                    )}
                    {car.is_sold && (
                      <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg font-semibold">
                        TERJUAL
                      </div>
                    )}
                    {!car.is_sold && (
                      <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg font-semibold">
                        AKTIF
                      </div>
                    )}
                  </div>

                  {/* Car Details */}
                  <div className="p-6">
                    {/* Brand and Model */}
                    <div className="mb-3">
                      <p className="text-sm text-gray-400 mb-1">
                        Merek & Model
                      </p>
                      <h3 className="text-2xl font-bold text-white">
                        {car.brand} {car.model}
                      </h3>
                    </div>

                    {/* Year */}
                    <div className="mb-3">
                      <p className="text-sm text-gray-400 mb-1">Tahun</p>
                      <p className="text-lg font-semibold text-white">
                        {car.year}
                      </p>
                    </div>

                    {/* Price */}
                    <div className="mb-4">
                      <p className="text-sm text-gray-400 mb-1">Harga</p>
                      <p className="text-3xl font-bold text-amber-400">
                        {formatPrice(car.price)}
                      </p>
                    </div>

                    {/* Car Specs */}
                    <div className="grid grid-cols-3 gap-4 mb-4 text-sm border-t border-slate-700 pt-4">
                      <div className="text-center">
                        <p className="text-gray-400">Jarak Tempuh</p>
                        <p className="text-white font-semibold">
                          {car.mileage.toLocaleString()} km
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-400">Transmisi</p>
                        <p className="text-white font-semibold">
                          {car.transmission}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-400">Bahan Bakar</p>
                        <p className="text-white font-semibold">
                          {car.fuel_type}
                        </p>
                      </div>
                    </div>

                    {/* Publication Date */}
                    <p className="text-gray-400 text-sm mb-4">
                      {formatDate(car.created_at)}
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-6 py-4 border-t border-b border-slate-700">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-white">
                          {carStats[car.id]?.views || 0}
                        </p>
                        <p className="text-xs text-gray-400">Dilihat</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-white">
                          {carStats[car.id]?.messages || 0}
                        </p>
                        <p className="text-xs text-gray-400">Chatnya</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-white">
                          {carStats[car.id]?.favorites || 0}
                        </p>
                        <p className="text-xs text-gray-400">Disave</p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-3 gap-2">
                      <Link
                        href={`/cars/${car.id}`}
                        className="flex items-center justify-center gap-2 px-3 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-all text-sm font-medium">
                        <Eye className="w-4 h-4" />
                        <span>Detail</span>
                      </Link>
                      <button
                        onClick={() => router.push(`/cars/${car.id}/edit`)}
                        className="flex items-center justify-center gap-2 px-3 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all text-sm font-medium">
                        <Edit className="w-4 h-4" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(car.id)}
                        className="flex items-center justify-center gap-2 px-3 py-3 bg-slate-700 hover:bg-red-600 text-white rounded-lg transition-all text-sm font-medium">
                        <Trash2 className="w-4 h-4" />
                        <span>Hapus</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
