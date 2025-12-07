"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { checkAdminAccess } from "@/lib/adminAuth";
import {
  ArrowLeft,
  Search,
  Trash2,
  Edit,
  Plus,
  Car as CarIcon,
  DollarSign,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";

interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  location: string;
  body_type: string;
  transmission: string;
  fuel_type: string;
  mileage: number;
  color: string;
  description: string;
  images: string[];
  is_sold: boolean;
  is_draft: boolean;
  created_at: string;
  user_id: string;
}

export default function ManageCars() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [cars, setCars] = useState<Car[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);

  useEffect(() => {
    checkAdmin();
    fetchCars();

    // Set up auto-refresh every time the page becomes visible
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchCars();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredCars(cars);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredCars(
        cars.filter(
          (car) =>
            car.brand?.toLowerCase().includes(query) ||
            car.model?.toLowerCase().includes(query) ||
            car.location?.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, cars]);

  const checkAdmin = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        router.push("/admin/login");
        return;
      }

      const adminStatus = await checkAdminAccess(session.user.id);
      if (!adminStatus) {
        router.push("/");
        return;
      }
    } catch (error) {
      console.error("Error checking admin:", error);
      router.push("/admin/login");
    }
  };

  const fetchCars = async () => {
    try {
      setLoading(true);

      // Force fresh data by using a timestamp to bust cache
      const { data, error } = await supabase
        .from("cars")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      console.log("Fetched cars:", data?.length); // Debug log
      setCars(data || []);
      setFilteredCars(data || []);
    } catch (error) {
      console.error("Error fetching cars:", error);
      alert("Failed to load cars");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCar = async (carId: string, carName: string) => {
    if (!confirm(`Delete ${carName}?`)) return;

    try {
      const { error } = await supabase.from("cars").delete().eq("id", carId);

      if (error) throw error;

      alert("Car deleted successfully!");
      fetchCars();
    } catch (error: any) {
      console.error("Error deleting car:", error);
      alert(`Failed to delete car: ${error.message}`);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="bg-slate-800/50 border-b border-amber-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/admin"
                className="text-amber-400 hover:text-amber-300 transition-colors">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-white">Manage Cars</h1>
                <p className="text-sm text-gray-400">
                  CRUD operations for vehicles
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => fetchCars()}
                className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all font-semibold">
                <RefreshCw className="w-5 h-5" />
                Refresh
              </button>
              <Link
                href="/admin/cars/add"
                className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-all font-semibold">
                <Plus className="w-5 h-5" />
                Add New Car
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by brand, model, or location..."
              className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        <div className="mb-6 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-4 border border-amber-500/30">
          <div className="text-gray-400">
            Total Cars:{" "}
            <span className="text-white font-semibold text-xl ml-2">
              {filteredCars.length}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCars.map((car) => (
            <div
              key={car.id}
              className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-amber-500/30 overflow-hidden hover:border-amber-500/50 transition-all">
              {/* Car Image */}
              <div className="relative h-48 bg-slate-700/50">
                {car.images && car.images.length > 0 ? (
                  <img
                    src={car.images[0]}
                    alt={`${car.brand} ${car.model}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <CarIcon className="w-16 h-16 text-gray-600" />
                  </div>
                )}
                {/* Status Badges */}
                <div className="absolute top-2 right-2 flex gap-2">
                  {car.is_sold && (
                    <span className="px-2 py-1 bg-red-500 text-white text-xs font-semibold rounded shadow-lg">
                      SOLD
                    </span>
                  )}
                  {car.is_draft && (
                    <span className="px-2 py-1 bg-yellow-500 text-slate-900 text-xs font-semibold rounded shadow-lg">
                      DRAFT
                    </span>
                  )}
                </div>
              </div>

              {/* Car Info */}
              <div className="p-4">
                <div className="mb-3">
                  <h3 className="text-lg font-bold text-white">
                    {car.brand} {car.model}
                  </h3>
                  <p className="text-gray-400 text-sm">{car.year}</p>
                </div>

                {/* Price */}
                <div className="mb-3">
                  <div className="flex items-center gap-2 text-amber-400">
                    <DollarSign className="w-4 h-4" />
                    <span className="font-bold text-lg">
                      {formatPrice(car.price)}
                    </span>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                  <div className="text-gray-400">
                    <span className="block text-gray-500">Location</span>
                    <span className="text-white">{car.location}</span>
                  </div>
                  <div className="text-gray-400">
                    <span className="block text-gray-500">Body Type</span>
                    <span className="text-white">{car.body_type || "-"}</span>
                  </div>
                  <div className="text-gray-400">
                    <span className="block text-gray-500">Transmission</span>
                    <span className="text-white">
                      {car.transmission || "-"}
                    </span>
                  </div>
                  <div className="text-gray-400">
                    <span className="block text-gray-500">Fuel</span>
                    <span className="text-white">{car.fuel_type || "-"}</span>
                  </div>
                  <div className="text-gray-400">
                    <span className="block text-gray-500">Mileage</span>
                    <span className="text-white">
                      {car.mileage ? `${car.mileage.toLocaleString()} km` : "-"}
                    </span>
                  </div>
                  <div className="text-gray-400">
                    <span className="block text-gray-500">Color</span>
                    <span className="text-white">{car.color || "-"}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Link
                    href={`/admin/cars/${car.id}/edit`}
                    className="flex-1 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-all text-center font-medium flex items-center justify-center gap-1">
                    <Edit className="w-4 h-4" />
                    Edit
                  </Link>
                  <button
                    onClick={() =>
                      handleDeleteCar(car.id, `${car.brand} ${car.model}`)
                    }
                    className="flex-1 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all font-medium flex items-center justify-center gap-1">
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCars.length === 0 && (
          <div className="text-center py-20">
            <CarIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No cars found</p>
          </div>
        )}
      </div>
    </div>
  );
}
