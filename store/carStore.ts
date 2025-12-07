import { create } from "zustand";
import { supabase } from "@/lib/supabase";
import type { Car } from "@/types";

interface CarState {
  cars: Car[];
  isLoading: boolean;
  fetchCars: (filters?: any) => Promise<void>;
  fetchCarById: (id: string) => Promise<Car | null>;
  createCar: (car: Partial<Car>) => Promise<void>;
  updateCar: (id: string, car: Partial<Car>) => Promise<void>;
  deleteCar: (id: string) => Promise<void>;
}

export const useCarStore = create<CarState>((set, get) => ({
  cars: [],
  isLoading: false,

  fetchCars: async (filters = {}) => {
    set({ isLoading: true });
    try {
      let query = supabase
        .from("cars")
        .select("*")
        .eq("is_sold", false)
        .order("created_at", { ascending: false });

      // Apply filters
      if (filters.brand) {
        query = query.eq("brand", filters.brand);
      }
      if (filters.minPrice) {
        query = query.gte("price", filters.minPrice);
      }
      if (filters.maxPrice) {
        query = query.lte("price", filters.maxPrice);
      }
      if (filters.transmission) {
        query = query.eq("transmission", filters.transmission);
      }
      if (filters.fuelType) {
        query = query.eq("fuel_type", filters.fuelType);
      }

      const { data, error } = await query;

      if (error) throw error;
      set({ cars: data || [] });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchCarById: async (id: string) => {
    const { data, error } = await supabase
      .from("cars")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },

  createCar: async (car: Partial<Car>) => {
    const { error } = await supabase.from("cars").insert([car]);
    if (error) throw error;
    get().fetchCars();
  },

  updateCar: async (id: string, car: Partial<Car>) => {
    const { error } = await supabase.from("cars").update(car).eq("id", id);
    if (error) throw error;
    get().fetchCars();
  },

  deleteCar: async (id: string) => {
    const { error } = await supabase.from("cars").delete().eq("id", id);
    if (error) throw error;
    get().fetchCars();
  },
}));
