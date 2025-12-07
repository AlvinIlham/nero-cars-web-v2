// ============================================
// USER & PROFILE TYPES
// ============================================

export interface User {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  avatar_url?: string;
  birth_date?: string;
  gender?: "Laki-laki" | "Perempuan";
  address?: string;
  city?: string;
  province?: string;
  bio?: string;
  total_reviews?: number;
  average_rating?: number;
  created_at: string;
  updated_at?: string;
}

// ============================================
// MASTER DATA TYPES
// ============================================

export interface Brand {
  id: string;
  name: string;
  logo_url?: string;
  category?: string; // 'Top Brands', 'Luxury', 'Economy', 'Electric'
  is_active: boolean;
  display_order: number;
  created_at: string;
}

export interface CarModel {
  id: string;
  brand_id?: string;
  name: string;
  full_name?: string;
  body_type?:
    | "Hatchback"
    | "MPV"
    | "SUV"
    | "Sedan"
    | "Wagon"
    | "Coupe"
    | "Van"
    | "Truck";
  is_active: boolean;
  created_at: string;
}

export interface Location {
  id: string;
  city: string;
  province?: string;
  region?: string; // 'Jabodetabek', 'Jawa', 'Sumatera', etc.
  is_active: boolean;
  display_order: number;
  created_at: string;
}

// ============================================
// CAR TYPES
// ============================================

export interface Car {
  id: string;
  user_id: string;
  brand_id?: string;
  car_model_id?: string;
  location_id?: string;

  // Car Details
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;

  // Specifications
  transmission: "Manual" | "Automatic" | "CVT" | "DCT";
  engine_capacity?: string;
  fuel_type: "Petrol" | "Diesel" | "Electric" | "Hybrid";
  condition?: "Excellent" | "Good" | "Fair" | "Poor";
  color: string;

  // Additional Info
  description?: string;
  location: string;

  // Media
  images: string[];
  video_url?: string;

  // Status
  is_sold: boolean;
  is_draft?: boolean;
  is_featured?: boolean;

  // Metrics
  views_count?: number;
  favorites_count?: number;

  created_at: string;
  updated_at: string;
}

export interface Favorite {
  id: string;
  user_id: string;
  car_id: string;
  created_at: string;
}

// ============================================
// CHAT/MESSAGING TYPES
// ============================================

export interface Conversation {
  id: string;
  car_id: string;
  buyer_id: string;
  seller_id: string;
  last_message?: string;
  last_message_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

// ============================================
// NOTIFICATION TYPES
// ============================================

export interface Notification {
  id: string;
  user_id: string;
  type: "chat" | "favorite" | "car_update" | "system" | "review";
  title: string;
  message: string;
  link?: string;
  metadata?: Record<string, any>;
  is_read: boolean;
  created_at: string;
}

// ============================================
// REVIEW & FEEDBACK TYPES
// ============================================

export interface Review {
  id: string;
  car_id: string;
  seller_id: string;
  reviewer_id: string;
  rating: number; // 1-5
  comment?: string;
  is_verified_purchase?: boolean;
  created_at: string;
  updated_at: string;
}

export interface Feedback {
  id: string;
  user_id?: string;
  type: "bug" | "feature" | "improvement" | "complaint" | "other";
  subject: string;
  message: string;
  email?: string;
  status?: "pending" | "in_progress" | "resolved" | "closed";
  priority?: "low" | "medium" | "high" | "urgent";
  admin_response?: string;
  created_at: string;
  updated_at?: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category?: string;
  display_order: number;
  is_active: boolean;
  views_count?: number;
  created_at: string;
  updated_at?: string;
}

// ============================================
// FEATURED LISTING TYPES
// ============================================

export interface FeaturedListing {
  id: string;
  car_id: string;
  position?: "hero" | "recommended" | "trending";
  display_order: number;
  starts_at: string;
  ends_at?: string;
  is_active: boolean;
  created_at: string;
}

// ============================================
// UTILITY TYPES
// ============================================

export type TransmissionType = "Manual" | "Automatic" | "CVT" | "DCT";
export type FuelType = "Petrol" | "Diesel" | "Electric" | "Hybrid";
export type BodyType =
  | "Hatchback"
  | "MPV"
  | "SUV"
  | "Sedan"
  | "Wagon"
  | "Coupe"
  | "Van"
  | "Truck";
export type ConditionType = "Excellent" | "Good" | "Fair" | "Poor";
export type FeedbackType =
  | "bug"
  | "feature"
  | "improvement"
  | "complaint"
  | "other";
export type FeedbackStatus = "pending" | "in_progress" | "resolved" | "closed";
export type NotificationType =
  | "chat"
  | "favorite"
  | "car_update"
  | "system"
  | "review";
