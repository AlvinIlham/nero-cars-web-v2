"use client";

import { useState, useEffect } from "react";
import { Search, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getAllBrands, getAllLocations } from "@/lib/database";
import { Brand, Location } from "@/types";

// Expanded body types with more options
const bodyTypes = [
  "Semua Tipe",
  "Hatchback",
  "MPV",
  "SUV",
  "Sedan",
  "Wagon",
  "Coupe",
  "Van",
  "Truck",
  "Convertible",
  "Crossover",
  "Mini Bus",
  "Pick Up",
  "Sport Car",
];

// Popular Indonesian car brands (will be merged with database brands)
const popularBrands = [
  "Toyota",
  "Honda",
  "Daihatsu",
  "Suzuki",
  "Mitsubishi",
  "Nissan",
  "Mazda",
  "BMW",
  "Mercedes-Benz",
  "Audi",
  "Volkswagen",
  "Hyundai",
  "KIA",
  "Ford",
  "Chevrolet",
  "Wuling",
  "DFSK",
  "MG",
  "Lexus",
  "Isuzu",
  "Subaru",
  "Peugeot",
  "Renault",
  "Porsche",
  "Tesla",
];

// Major Indonesian cities
const indonesianCities = [
  "Jakarta",
  "Surabaya",
  "Bandung",
  "Medan",
  "Semarang",
  "Makassar",
  "Palembang",
  "Tangerang",
  "Depok",
  "Bekasi",
  "Bogor",
  "Batam",
  "Pekanbaru",
  "Bandar Lampung",
  "Padang",
  "Malang",
  "Denpasar",
  "Samarinda",
  "Balikpapan",
  "Pontianak",
  "Manado",
  "Yogyakarta",
  "Solo",
  "Cirebon",
  "Serang",
];

export default function Hero() {
  const router = useRouter();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedBrand, setSelectedBrand] = useState("Semua Merek");
  const [selectedType, setSelectedType] = useState("Semua Tipe");
  const [selectedLocation, setSelectedLocation] = useState("Semua Kota");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const [brandsData, locationsData] = await Promise.all([
          getAllBrands(),
          getAllLocations(),
        ]);

        // Merge database brands with popular brands (remove duplicates)
        const dbBrandNames = brandsData.map((b) => b.name);
        const additionalBrands = popularBrands
          .filter((name) => !dbBrandNames.includes(name))
          .map((name, index) => ({
            id: `popular-${index}`,
            name,
            created_at: new Date().toISOString(),
            is_active: true,
            display_order: brandsData.length + index,
          }));

        const allBrands = [...brandsData, ...additionalBrands];

        // If no brands from database, just use popular brands
        if (brandsData.length === 0) {
          setBrands(
            popularBrands
              .map((name, index) => ({
                id: `brand-${index}`,
                name,
                created_at: new Date().toISOString(),
                is_active: true,
                display_order: index,
              }))
              .sort((a, b) => a.name.localeCompare(b.name))
          );
        } else {
          setBrands(allBrands.sort((a, b) => a.name.localeCompare(b.name)));
        }

        // Merge database locations with Indonesian cities
        const dbCityNames = locationsData.map((l) => l.city);
        const additionalCities = indonesianCities
          .filter((city) => !dbCityNames.includes(city))
          .map((city, index) => ({
            id: `city-${index}`,
            city,
            province: "",
            created_at: new Date().toISOString(),
            is_active: true,
            display_order: locationsData.length + index,
          }));

        const allLocations = [...locationsData, ...additionalCities];

        // If no locations from database, just use Indonesian cities
        if (locationsData.length === 0) {
          setLocations(
            indonesianCities
              .map((city, index) => ({
                id: `loc-${index}`,
                city,
                province: "",
                created_at: new Date().toISOString(),
                is_active: true,
                display_order: index,
              }))
              .sort((a, b) => a.city.localeCompare(b.city))
          );
        } else {
          setLocations(
            allLocations.sort((a, b) => a.city.localeCompare(b.city))
          );
        }
      } catch (error) {
        console.warn(
          "Error fetching data from database, using fallback data:",
          error
        );

        // Fallback to hardcoded data if database tables don't exist
        setBrands(
          popularBrands
            .map((name, index) => ({
              id: `brand-${index}`,
              name,
              created_at: new Date().toISOString(),
              is_active: true,
              display_order: index,
            }))
            .sort((a, b) => a.name.localeCompare(b.name))
        );

        setLocations(
          indonesianCities
            .map((city, index) => ({
              id: `loc-${index}`,
              city,
              province: "",
              created_at: new Date().toISOString(),
              is_active: true,
              display_order: index,
            }))
            .sort((a, b) => a.city.localeCompare(b.city))
        );
      }
    }
    fetchData();
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (searchQuery.trim()) {
      params.append("search", searchQuery.trim());
    }

    if (selectedBrand !== "Semua Merek") {
      params.append("brand", selectedBrand);
    }

    if (selectedType !== "Semua Tipe") {
      params.append("type", selectedType);
    }

    if (selectedLocation !== "Semua Kota") {
      params.append("location", selectedLocation);
    }

    if (minPrice) {
      params.append("minPrice", minPrice);
    }

    if (maxPrice) {
      params.append("maxPrice", maxPrice);
    }

    router.push(`/cars?${params.toString()}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="py-6 border-b border-amber-600/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Search Bar */}
        <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-xl p-4 mb-4 border border-amber-200/50">
          {/* Search Input - Full Width */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Cari mobil menurut Merek, Model, atau Kota Kunci"
                className="w-full pl-12 pr-4 py-3 border-2 border-amber-300/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-dark-900 bg-white/90 placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Filter Dropdowns */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {/* Brand Filter */}
            <div className="relative">
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none cursor-pointer bg-white text-dark-700 font-medium">
                <option value="Semua Merek">Semua Merek</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.name}>
                    {brand.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>

            {/* Body Type Filter */}
            <div className="relative">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none cursor-pointer bg-white text-dark-700 font-medium">
                {bodyTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>

            {/* Location Filter */}
            <div className="relative">
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none cursor-pointer bg-white text-dark-700 font-medium">
                <option value="Semua Kota">Semua Kota</option>
                {locations.map((location) => (
                  <option key={location.id} value={location.city}>
                    {location.city}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>

            {/* Min Price */}
            <div>
              <input
                type="text"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="Harga Min (Rp)"
                className="w-full px-4 py-3 border-2 border-amber-300/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-dark-700 font-medium bg-white/90 hover:border-amber-400 transition-colors"
              />
            </div>

            {/* Max Price */}
            <div>
              <input
                type="text"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="Harga Max (Rp)"
                className="w-full px-4 py-3 border-2 border-amber-300/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-dark-700 font-medium bg-white/90 hover:border-amber-400 transition-colors"
              />
            </div>
          </div>

          {/* Search Button */}
          <div className="mt-4">
            <button
              onClick={handleSearch}
              className="w-full md:w-auto bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white px-8 py-3 rounded-lg font-semibold transition-all shadow-lg ring-2 ring-amber-500/50">
              <Search className="w-5 h-5 inline mr-2" />
              Cari Mobil
            </button>
          </div>
        </div>

        {/* Feedback Banner */}
        <div className="bg-gradient-to-r from-amber-100 via-yellow-50 to-amber-100 rounded-lg p-4 flex flex-col md:flex-row items-center justify-between border-2 border-amber-300/50 shadow-lg gap-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🎉</span>
            <p className="text-dark-900 font-medium">
              merasa ada masukan atau web kami? segera laporkan
            </p>
          </div>
          <Link
            href="/feedback"
            className="bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-dark-900 px-6 py-2 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg">
            Kirim
          </Link>
        </div>
      </div>
    </div>
  );
}
