"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { toggleFavorite as toggleFav, isCarFavorited } from "@/lib/database";
import Navbar from "@/components/layout/Navbar";
import Link from "next/link";
import {
  MapPin,
  Gauge,
  Fuel,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Car as CarIcon,
  Heart,
  X,
  Search,
  Filter,
} from "lucide-react";

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
  body_type?: string;
}

export default function CarsListPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [cars, setCars] = useState<Car[]>([]);
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState<{
    [key: string]: number;
  }>({});
  const [favorites, setFavorites] = useState<{ [key: string]: boolean }>({});
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetchUser();
    fetchAllCars();
  }, []);

  useEffect(() => {
    if (user?.id && cars.length > 0) {
      loadFavoritesStatus();
    }
  }, [user, cars]);

  useEffect(() => {
    applyFilters();
  }, [cars, searchParams]);

  const fetchUser = async () => {
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

        setUser(profile || session.user);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const loadFavoritesStatus = async () => {
    if (!user?.id) return;

    try {
      const favoritesMap: { [key: string]: boolean } = {};

      // Check favorite status for each car
      await Promise.all(
        cars.map(async (car) => {
          const isFav = await isCarFavorited(user.id, car.id);
          favoritesMap[car.id] = isFav;
        })
      );

      setFavorites(favoritesMap);
    } catch (error) {
      console.error("Error loading favorites status:", error);
    }
  };

  const fetchAllCars = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("cars")
        .select("*")
        .eq("is_sold", false)
        .eq("is_draft", false)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCars(data || []);
    } catch (error) {
      console.error("Error fetching cars:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...cars];

    // Get filter parameters from URL
    const search = searchParams.get("search");
    const brand = searchParams.get("brand");
    const type = searchParams.get("type");
    const location = searchParams.get("location");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");

    // Apply search filter
    if (search) {
      const query = search.toLowerCase();
      result = result.filter(
        (car) =>
          car.brand.toLowerCase().includes(query) ||
          car.model.toLowerCase().includes(query) ||
          car.location.toLowerCase().includes(query) ||
          (car.body_type && car.body_type.toLowerCase().includes(query))
      );
    }

    // Apply brand filter
    if (brand) {
      result = result.filter(
        (car) => car.brand.toLowerCase() === brand.toLowerCase()
      );
    }

    // Apply body type filter
    if (type) {
      result = result.filter(
        (car) =>
          car.body_type && car.body_type.toLowerCase() === type.toLowerCase()
      );
    }

    // Apply location filter
    if (location) {
      result = result.filter(
        (car) => car.location.toLowerCase() === location.toLowerCase()
      );
    }

    // Apply price filters
    if (minPrice) {
      const min = parseFloat(minPrice.replace(/[^\d]/g, ""));
      if (!isNaN(min)) {
        result = result.filter((car) => car.price >= min);
      }
    }

    if (maxPrice) {
      const max = parseFloat(maxPrice.replace(/[^\d]/g, ""));
      if (!isNaN(max)) {
        result = result.filter((car) => car.price <= max);
      }
    }

    setFilteredCars(result);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getActiveFilters = () => {
    const filters = [];
    const search = searchParams.get("search");
    const brand = searchParams.get("brand");
    const type = searchParams.get("type");
    const location = searchParams.get("location");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");

    if (search)
      filters.push({
        key: "search",
        label: `Pencarian: "${search}"`,
        value: search,
      });
    if (brand)
      filters.push({ key: "brand", label: `Merek: ${brand}`, value: brand });
    if (type)
      filters.push({ key: "type", label: `Tipe: ${type}`, value: type });
    if (location)
      filters.push({
        key: "location",
        label: `Lokasi: ${location}`,
        value: location,
      });
    if (minPrice)
      filters.push({
        key: "minPrice",
        label: `Min: Rp ${parseInt(minPrice).toLocaleString()}`,
        value: minPrice,
      });
    if (maxPrice)
      filters.push({
        key: "maxPrice",
        label: `Max: Rp ${parseInt(maxPrice).toLocaleString()}`,
        value: maxPrice,
      });

    return filters;
  };

  const removeFilter = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);

    const newUrl = params.toString() ? `/cars?${params.toString()}` : "/cars";
    router.push(newUrl);
  };

  const clearAllFilters = () => {
    router.push("/cars");
  };

  const activeFilters = getActiveFilters();
  const hasActiveFilters = activeFilters.length > 0;

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

  const toggleFavorite = async (carId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user?.id) {
      alert("Silakan login terlebih dahulu untuk menambahkan favorit");
      return;
    }

    try {
      // Toggle favorite in database
      const success = await toggleFav(user.id, carId);

      if (success) {
        // Update local state
        const newStatus = !favorites[carId];
        setFavorites((prev) => ({
          ...prev,
          [carId]: newStatus,
        }));

        if (newStatus) {
          console.log(`✅ Mobil ID ${carId} ditambahkan ke favorit`);
        } else {
          console.log(`❌ Mobil ID ${carId} dihapus dari favorit`);
        }
      } else {
        console.error("Failed to toggle favorite");
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      alert("Terjadi kesalahan saat menambahkan favorit");
    }
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
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              Semua Mobil Tersedia
            </h1>
            <p className="text-gray-400">
              Temukan mobil impian Anda dari koleksi kami
            </p>
          </div>

          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="mb-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl p-4 border border-amber-500/20">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-amber-400" />
                  <h3 className="text-white font-semibold">Filter Aktif</h3>
                </div>
                <button
                  onClick={clearAllFilters}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all font-medium text-sm border border-red-500/30">
                  <X className="w-4 h-4" />
                  Hapus Semua Filter
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {activeFilters.map((filter) => (
                  <div
                    key={filter.key}
                    className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-100">
                    {filter.key === "search" && (
                      <Search className="w-4 h-4 text-amber-400" />
                    )}
                    <span className="text-sm font-medium">{filter.label}</span>
                    <button
                      onClick={() => removeFilter(filter.key)}
                      className="ml-1 hover:bg-amber-500/20 rounded-full p-1 transition-colors">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 mb-8 border border-amber-500/30">
            <div className="flex items-center justify-between">
              <div className="text-gray-400">
                Total Mobil Tersedia:{" "}
                <span className="text-white font-semibold text-xl ml-2">
                  {filteredCars.length}
                </span>
                {filteredCars.length !== cars.length && (
                  <span className="text-sm text-amber-400 ml-2">
                    (dari {cars.length} mobil)
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Cars Grid */}
          {filteredCars.length === 0 ? (
            <div className="text-center py-20">
              <CarIcon className="w-20 h-20 text-slate-500 mx-auto mb-4" />
              <p className="text-gray-400 text-xl mb-4">
                {cars.length === 0
                  ? "Belum ada mobil tersedia saat ini"
                  : "Tidak ada mobil yang sesuai dengan filter Anda"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCars.map((car) => (
                <Link
                  key={car.id}
                  href={`/cars/${car.id}`}
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

                        {/* Favorite Button */}
                        <button
                          onClick={(e) => toggleFavorite(car.id, e)}
                          className={`absolute top-3 right-3 p-2 rounded-full shadow-lg transition-all duration-300 z-20 ${
                            favorites[car.id]
                              ? "bg-red-500 hover:bg-red-600 scale-110"
                              : "bg-white/90 hover:bg-white"
                          }`}>
                          <Heart
                            className={`w-5 h-5 transition-all duration-300 ${
                              favorites[car.id]
                                ? "text-white fill-white"
                                : "text-slate-600 hover:text-red-500"
                            }`}
                          />
                        </button>

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
                  </div>

                  {/* Car Details */}
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {car.brand} {car.model} {car.year}
                    </h3>
                    <p className="text-3xl font-bold text-amber-400 mb-4">
                      {formatPrice(car.price)}
                    </p>

                    {/* Car Specs */}
                    <div className="space-y-2 mb-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-300">
                        <Calendar className="w-4 h-4 text-amber-400" />
                        <span>{car.year}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-300">
                        <Gauge className="w-4 h-4 text-amber-400" />
                        <span>{car.mileage.toLocaleString()} km</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-300">
                        <Fuel className="w-4 h-4 text-amber-400" />
                        <span>
                          {car.transmission} • {car.fuel_type}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-300">
                        <MapPin className="w-4 h-4 text-amber-400" />
                        <span>{car.location}</span>
                      </div>
                    </div>

                    {/* View Details Button */}
                    <button className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-semibold hover:from-amber-600 hover:to-orange-600 transition-all">
                      Lihat Detail
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
