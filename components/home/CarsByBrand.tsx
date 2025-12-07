"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  MapPin,
  Gauge,
  Fuel,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  getOrCreateConversation,
  toggleFavorite,
  isCarFavorited,
} from "@/lib/database";

const BRANDS = [
  "ALL",
  "HONDA",
  "TOYOTA",
  "DAIHATSU",
  "SUZUKI",
  "MITSUBISHI",
  "NISSAN",
  "MAZDA",
  "HYUNDAI",
];

// Car Card Component with Image Carousel
function CarCard({ car, favorites, onToggleFavorite, currentUserId }: any) {
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const displayTitle = `${car.brand} ${car.model} ${car.year}`;
  const displayLocation = car.location || "Unknown";
  const images =
    car.images && car.images.length > 0
      ? car.images
      : ["/assets/img/car1.jpeg"];

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const formatPrice = (price: number) => {
    return `Rp ${price.toLocaleString("id-ID")}`;
  };

  const handleContactSeller = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!currentUserId) {
      router.push("/login");
      return;
    }

    if (currentUserId === car.user_id) {
      alert("Anda tidak bisa menghubungi diri sendiri");
      return;
    }

    try {
      const { data: conversation, error } = await getOrCreateConversation(
        currentUserId,
        car.user_id,
        car.id
      );

      if (error || !conversation) {
        alert("Gagal membuat percakapan. Silakan coba lagi.");
        return;
      }

      router.push(`/messages?conversation=${conversation.id}`);
    } catch (error) {
      console.error("Error:", error);
      alert("Terjadi kesalahan. Silakan coba lagi.");
    }
  };

  return (
    <Link
      href={`/cars/${car.id}`}
      className="flex-shrink-0 w-72 sm:w-80 bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all hover:scale-105 block">
      {/* Image Carousel */}
      <div className="relative h-44 sm:h-48 group">
        <img
          src={images[currentImageIndex]}
          alt={`${displayTitle} - ${currentImageIndex + 1}`}
          loading="lazy"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = "/assets/img/car1.jpeg";
          }}
        />

        {/* Image Navigation Arrows - Show only if multiple images */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300">
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Image Indicators */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {images.map((_: any, index: number) => (
                <div
                  key={index}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    index === currentImageIndex ? "bg-white w-4" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Favorite Button */}
        <button
          onClick={(e) => onToggleFavorite(car.id, e)}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-300 shadow-lg ${
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
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Model */}
        <h3 className="font-bold text-slate-900 mb-3 line-clamp-2 min-h-[3rem]">
          {displayTitle}
        </h3>

        {/* Details */}
        <div className="space-y-2 mb-4 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{displayLocation}</span>
          </div>
          <div className="flex items-center gap-2">
            <Gauge className="w-4 h-4 flex-shrink-0" />
            <span>{car.mileage?.toLocaleString() || 0} Km</span>
          </div>
          <div className="flex items-center gap-2">
            <Fuel className="w-4 h-4 flex-shrink-0" />
            <span>{car.transmission || "Unknown"}</span>
          </div>
        </div>

        {/* Price */}
        <div className="mb-4">
          <p className="text-xl font-bold text-slate-900">
            {formatPrice(car.price || 0)}
          </p>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button className="bg-slate-100 hover:bg-slate-200 text-slate-900 py-2 rounded-lg text-sm font-medium transition-all">
            Lihat Detail
          </button>
          <button
            onClick={handleContactSeller}
            className="bg-slate-800 hover:bg-slate-900 text-white py-2 rounded-lg text-sm font-medium transition-all">
            Hubungi Penjual
          </button>
        </div>
      </div>
    </Link>
  );
}

export default function CarsByBrand() {
  const [selectedBrand, setSelectedBrand] = useState("ALL");
  const [currentCars, setCurrentCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<{ [key: string]: boolean }>({});
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    fetchCars();
  }, [selectedBrand, currentUserId]);

  // Re-fetch favorite status when page becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && currentUserId && currentCars.length > 0) {
        const carIds = currentCars.map((car) => car.id);
        loadFavoriteStatus(currentUserId, carIds);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [currentUserId, currentCars]);

  const fetchCurrentUser = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        setCurrentUserId(session.user.id);
      }
    } catch (error) {
      console.error("Error fetching current user:", error);
    }
  };

  const loadFavoriteStatus = async (userId: string, carIds: string[]) => {
    try {
      const favoriteStatus: { [key: string]: boolean } = {};
      for (const carId of carIds) {
        const isFav = await isCarFavorited(userId, carId);
        favoriteStatus[carId] = isFav;
      }
      setFavorites(favoriteStatus);
    } catch (error) {
      console.error("Error loading favorite status:", error);
    }
  };

  const fetchCars = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from("cars")
        .select("*")
        .eq("is_sold", false)
        .order("created_at", { ascending: false })
        .limit(12);

      // Filter by brand if not "ALL"
      if (selectedBrand !== "ALL") {
        query = query.ilike("brand", selectedBrand);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching cars:", error);
        setCurrentCars([]);
      } else {
        setCurrentCars(data || []);
        // Load favorite status if user is logged in
        if (currentUserId && data) {
          const carIds = data.map((car) => car.id);
          await loadFavoriteStatus(currentUserId, carIds);
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setCurrentCars([]);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return `Rp ${price.toLocaleString("id-ID")}`;
  };

  const scroll = (direction: "left" | "right") => {
    const container = document.getElementById("cars-container");
    if (container) {
      const scrollAmount = direction === "left" ? -400 : 400;
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const handleToggleFavorite = async (carId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!currentUserId) {
      alert("Silakan login terlebih dahulu untuk menambahkan favorit");
      return;
    }

    try {
      await toggleFavorite(currentUserId, carId);
      setFavorites((prev) => ({
        ...prev,
        [carId]: !prev[carId],
      }));
    } catch (error) {
      console.error("Error toggling favorite:", error);
      alert("Gagal mengubah status favorit. Silakan coba lagi.");
    }
  };

  return (
    <section className="py-8 sm:py-12 md:py-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <button className="bg-white/10 backdrop-blur-sm text-white px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-medium border border-white/20">
            BELI MOBIL DINEROCARS SEKARANG
          </button>
        </div>

        {/* Brand Tabs */}
        <div className="flex justify-center gap-3 sm:gap-4 mb-8 sm:mb-12 flex-wrap px-4">
          {BRANDS.map((brand) => (
            <button
              key={brand}
              onClick={() => setSelectedBrand(brand)}
              className={`px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-semibold transition-all text-sm sm:text-base ${
                selectedBrand === brand
                  ? "bg-white text-slate-900"
                  : "bg-slate-700/50 text-white hover:bg-slate-700"
              }`}>
              {brand}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center text-white py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
            <p className="mt-4">Memuat mobil {selectedBrand}...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && currentCars.length === 0 && (
          <div className="text-center text-white py-12">
            <p className="text-lg">
              {selectedBrand === "ALL"
                ? "Belum ada mobil yang tersedia."
                : `Belum ada mobil ${selectedBrand} yang tersedia.`}
            </p>
          </div>
        )}

        {/* Cars Grid with Scroll */}
        {!loading && currentCars.length > 0 && (
          <div className="relative flex items-center">
            {/* Left Arrow */}
            <button
              onClick={() => scroll("left")}
              className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-slate-900 p-3 rounded-full shadow-lg transition-all items-center justify-center">
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Cars Container */}
            <div
              id="cars-container"
              className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-hide scroll-smooth px-4 md:px-16 w-full"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
              {currentCars.map((car: any) => (
                <CarCard
                  key={car.id}
                  car={car}
                  favorites={favorites}
                  onToggleFavorite={handleToggleFavorite}
                  currentUserId={currentUserId}
                />
              ))}
            </div>

            {/* Right Arrow */}
            <button
              onClick={() => scroll("right")}
              className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-slate-900 p-3 rounded-full shadow-lg transition-all items-center justify-center">
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
