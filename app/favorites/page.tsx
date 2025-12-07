"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Heart,
  Trash2,
  MessageCircle,
  MapPin,
  Gauge,
  Fuel,
  Calendar,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import ChatWidget from "@/components/chat/ChatWidget";
import { supabase } from "@/lib/supabase";
import { getUserFavorites, toggleFavorite } from "@/lib/database";
import Link from "next/link";
import Image from "next/image";

interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage?: number;
  transmission?: string;
  fuel_type?: string;
  color?: string;
  location: string;
  images: string[];
  is_sold?: boolean;
  created_at?: string;
}

// Mock data untuk fallback jika tidak ada data dari Supabase
const mockCarsData: { [key: string]: Car } = {
  "1": {
    id: "1",
    brand: "Honda",
    model: "HR-V TURBO PRESTIGE 1.5",
    year: 2019,
    price: 309000000,
    mileage: 10000,
    transmission: "Automatic",
    fuel_type: "Petrol",
    location: "Jakarta Selatan",
    images: ["/assets/img/car1.jpeg"],
  },
  "2": {
    id: "2",
    brand: "Honda",
    model: "HR-V TYPE 1.5",
    year: 2019,
    price: 235000000,
    mileage: 15000,
    transmission: "Manual",
    fuel_type: "Petrol",
    location: "Jakarta Pusat",
    images: ["/assets/img/car2.jpeg"],
  },
  "3": {
    id: "3",
    brand: "Honda",
    model: "CR-V TURBO PRESTIGE 1.5",
    year: 2019,
    price: 395000000,
    mileage: 8000,
    transmission: "Automatic",
    fuel_type: "Petrol",
    location: "Jakarta Barat",
    images: ["/assets/img/car1.jpeg"],
  },
  "4": {
    id: "4",
    brand: "Toyota",
    model: "Allnew 2.5 G CVT",
    year: 2020,
    price: 295000000,
    mileage: 12000,
    transmission: "Automatic",
    fuel_type: "Petrol",
    location: "Tangerang",
    images: ["/assets/img/car2.jpeg"],
  },
  "5": {
    id: "5",
    brand: "Toyota",
    model: "Agya TRD Sportivo",
    year: 2020,
    price: 150000000,
    mileage: 20000,
    transmission: "Manual",
    fuel_type: "Petrol",
    location: "Bekasi",
    images: ["/assets/img/car1.jpeg"],
  },
  "6": {
    id: "6",
    brand: "Toyota",
    model: "Fortuner 2.4 VRZ",
    year: 2021,
    price: 465000000,
    mileage: 5000,
    transmission: "Automatic",
    fuel_type: "Diesel",
    location: "Jakarta Selatan",
    images: ["/assets/img/car2.jpeg"],
  },
  "7": {
    id: "7",
    brand: "Hyundai",
    model: "Palisade 2.2 AT",
    year: 2022,
    price: 745000000,
    mileage: 3000,
    transmission: "Automatic",
    fuel_type: "Diesel",
    location: "Jakarta Pusat",
    images: ["/assets/img/car1.jpeg"],
  },
};

export default function FavoritesPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [favorites, setFavorites] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (user?.id) {
      loadFavorites();
    }

    // Listen for storage changes (when favorites are updated in other tabs/windows)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "nerocars_favorites") {
        loadFavorites();
      }
    };

    // Listen for custom event when favorites change in the same tab
    const handleFavoritesChange = () => {
      loadFavorites();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("favoritesChanged", handleFavoritesChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("favoritesChanged", handleFavoritesChange);
    };
  }, [user]);

  const fetchUser = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        // User tidak login, tetap bisa lihat favorites dari localStorage
        console.log("User not logged in, showing favorites from localStorage");
      } else {
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

  const loadFavorites = async () => {
    try {
      setLoading(true);

      if (!user?.id) {
        // If user is not logged in, show empty favorites
        setFavorites([]);
        setLoading(false);
        return;
      }

      // Fetch favorites from database
      const favoriteCars = await getUserFavorites(user.id);
      setFavorites(favoriteCars);
    } catch (error) {
      console.error("Error loading favorites:", error);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  const loadFromMockData = (favoriteIds: string[]) => {
    const favoriteCars = favoriteIds
      .map((id) => mockCarsData[id])
      .filter((car) => car !== undefined);
    setFavorites(favoriteCars);
  };

  const handleRemoveFavorite = async (id: string) => {
    if (!user?.id) {
      alert("Silakan login terlebih dahulu");
      return;
    }

    try {
      await toggleFavorite(user.id, id);
      setFavorites(favorites.filter((fav) => fav.id !== id));
      console.log(`❌ Mobil ID ${id} dihapus dari favorit`);
    } catch (error) {
      console.error("Error removing favorite:", error);
      alert("Gagal menghapus favorit. Silakan coba lagi.");
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-amber-900">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors group">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Kembali</span>
        </button>

        {/* Header */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 mb-6 border border-white/10">
          <div className="flex items-center gap-3">
            <Heart className="w-8 h-8 text-red-400 fill-red-400" />
            <div>
              <h1 className="text-2xl font-bold text-white">Mobil Favorit</h1>
              <p className="text-white/70">
                {loading
                  ? "Memuat..."
                  : `${favorites.length} mobil yang Anda sukai`}
              </p>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-12 border border-white/10 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white/70">Memuat mobil favorit...</p>
          </div>
        ) : favorites.length === 0 ? (
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-12 border border-white/10 text-center">
            <Heart className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-bold text-white mb-2">
              Belum Ada Favorit
            </h3>
            <p className="text-white/70 mb-6">
              Anda belum menambahkan mobil ke daftar favorit. Klik icon ❤️ pada
              mobil yang Anda suka!
            </p>
            <Link
              href="/cars"
              className="inline-block bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg font-semibold transition-all">
              Cari Mobil
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((car) => (
              <div
                key={car.id}
                className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden hover:border-blue-500/50 transition-all group">
                <div className="relative h-48 bg-slate-700 overflow-hidden">
                  <Image
                    src={
                      car.images && car.images.length > 0
                        ? car.images[0]
                        : "/assets/img/car1.jpeg"
                    }
                    alt={`${car.brand} ${car.model}`}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                    unoptimized
                  />
                  <button
                    onClick={() => handleRemoveFavorite(car.id)}
                    className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-all z-10">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-white text-lg mb-1">
                    {car.brand} {car.model}
                  </h3>
                  <p className="text-white/70 text-sm mb-3">{car.year}</p>

                  {/* Car Details */}
                  <div className="space-y-2 mb-3 text-xs">
                    {car.mileage && (
                      <div className="flex items-center gap-2 text-white/60">
                        <Gauge className="w-4 h-4 text-blue-400" />
                        <span>{car.mileage.toLocaleString()} km</span>
                      </div>
                    )}
                    {car.transmission && car.fuel_type && (
                      <div className="flex items-center gap-2 text-white/60">
                        <Fuel className="w-4 h-4 text-blue-400" />
                        <span>
                          {car.transmission} • {car.fuel_type}
                        </span>
                      </div>
                    )}
                    {car.location && (
                      <div className="flex items-center gap-2 text-white/60">
                        <MapPin className="w-4 h-4 text-blue-400" />
                        <span>{car.location}</span>
                      </div>
                    )}
                  </div>

                  <div className="mb-4">
                    <span className="text-blue-400 font-bold text-lg">
                      {formatPrice(car.price)}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href={`/cars/${car.id}`}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-lg font-semibold transition-all text-center">
                      Lihat Detail
                    </Link>
                    <button className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-lg transition-all">
                      <MessageCircle className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ChatWidget />
    </div>
  );
}
