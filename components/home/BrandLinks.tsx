"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getPopularCarModels } from "@/lib/database";
import { CarModel } from "@/types";

export default function BrandLinks() {
  const [carModels, setCarModels] = useState<CarModel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const models = await getPopularCarModels(30);
        setCarModels(models);
      } catch (error) {
        console.warn("Error fetching car models, using empty list:", error);
        setCarModels([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Group models by brand
  const groupedModels = carModels.reduce(
    (acc: Record<string, CarModel[]>, model: any) => {
      const brandName = model.brand?.name || "Other";
      if (!acc[brandName]) {
        acc[brandName] = [];
      }
      acc[brandName].push(model);
      return acc;
    },
    {}
  );

  // Get top 3 brands with most models
  const topBrands = Object.entries(groupedModels)
    .sort(([, a], [, b]) => b.length - a.length)
    .slice(0, 3);

  if (loading) {
    return (
      <section className="py-16 px-4 md:px-8 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-500">Loading popular models...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 md:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
            Merek Mobil Bekas Dijual
          </h2>
        </div>

        {/* Brands Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {topBrands.map(([brandName, models]) => (
            <div key={brandName}>
              <h3 className="font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-200">
                {brandName}
              </h3>
              <ul className="space-y-2">
                {models.slice(0, 10).map((model: any) => (
                  <li key={model.id}>
                    <Link
                      href={`/cars?brand=${model.brand?.name}&model=${model.name}`}
                      className="text-blue-600 hover:text-blue-800 hover:underline text-sm transition-colors">
                      {model.brand?.name} {model.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
