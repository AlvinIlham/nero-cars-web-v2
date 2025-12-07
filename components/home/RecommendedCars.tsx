"use client";

import Link from "next/link";
import {
  Heart,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Gauge,
  Fuel,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  getOrCreateConversation,
  toggleFavorite,
  isCarFavorited,
} from "@/lib/database";

// Car Card Component with Image Carousel (same as CarsByBrand)
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
      className="block bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all hover:scale-105">
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

export default function RecommendedCars() {
  const [recommendedCars, setRecommendedCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<{ [key: string]: boolean }>({});
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    fetchCars();
  }, [currentUserId]);

  // Re-fetch favorite status when page becomes visible (user returns from detail page)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && currentUserId) {
        loadFavoriteStatusForCars(recommendedCars);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [currentUserId, recommendedCars]);

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

  const loadFavoriteStatusForCars = async (cars: any[]) => {
    if (!currentUserId || cars.length === 0) return;

    try {
      const favoriteStatus: { [key: string]: boolean } = {};
      for (const car of cars) {
        const isFav = await isCarFavorited(currentUserId, car.id);
        favoriteStatus[car.id] = isFav;
      }
      setFavorites(favoriteStatus);
    } catch (error) {
      console.error("Error loading favorite status:", error);
    }
  };

  const fetchCars = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("cars")
        .select("*")
        .eq("is_sold", false)
        .order("created_at", { ascending: false })
        .limit(4);

      if (error) {
        console.error("Error fetching cars:", error);
        setRecommendedCars([]);
      } else {
        setRecommendedCars(data || []);
        // Load favorite status after cars are fetched
        if (currentUserId && data) {
          await loadFavoriteStatusForCars(data);
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setRecommendedCars([]);
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
          <p className="mt-4">Memuat rekomendasi mobil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-amber-900 text-white rounded-t-xl px-6 py-4 mb-0 border-t border-x border-amber-500/30 shadow-lg">
          <h2 className="text-xl font-bold tracking-wide">REKOMENDASI MOBIL</h2>
        </div>

        {/* Car Cards Container */}
        <div className="bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-sm rounded-b-xl p-6 border-b border-x border-amber-500/30 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendedCars.map((car) => (
              <CarCard
                key={car.id}
                car={car}
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
                currentUserId={currentUserId}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
