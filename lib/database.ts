import { supabase } from "./supabase";
import { Brand, CarModel, Location, Car, FAQ, Review } from "@/types";

// ==================== BRANDS ====================
export async function getAllBrands(): Promise<Brand[]> {
  const { data, error } = await supabase
    .from("brands")
    .select("*")
    .order("name");

  if (error) {
    console.error("Error fetching brands:", error);
    return [];
  }

  return data || [];
}

export async function getBrandById(id: string): Promise<Brand | null> {
  const { data, error } = await supabase
    .from("brands")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching brand:", error);
    return null;
  }

  return data;
}

// ==================== CAR MODELS ====================
export async function getCarModelsByBrand(
  brandId: string
): Promise<CarModel[]> {
  const { data, error } = await supabase
    .from("car_models")
    .select("*")
    .eq("brand_id", brandId)
    .order("name");

  if (error) {
    console.error("Error fetching car models:", error);
    return [];
  }

  return data || [];
}

export async function getAllCarModels(): Promise<CarModel[]> {
  const { data, error } = await supabase
    .from("car_models")
    .select(
      `
      *,
      brand:brands(*)
    `
    )
    .order("name");

  if (error) {
    console.error("Error fetching car models:", error);
    return [];
  }

  return data || [];
}

export async function getPopularCarModels(
  limit: number = 30
): Promise<CarModel[]> {
  const { data, error } = await supabase
    .from("car_models")
    .select(
      `
      *,
      brand:brands(*)
    `
    )
    .order("name")
    .limit(limit);

  if (error) {
    console.error("Error fetching popular car models:", error);
    return [];
  }

  return data || [];
}

// ==================== LOCATIONS ====================
export async function getAllLocations(): Promise<Location[]> {
  const { data, error } = await supabase
    .from("locations")
    .select("*")
    .order("city");

  if (error) {
    console.error("Error fetching locations:", error);
    return [];
  }

  return data || [];
}

export async function getLocationById(id: string): Promise<Location | null> {
  const { data, error } = await supabase
    .from("locations")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching location:", error);
    return null;
  }

  return data;
}

// ==================== CARS ====================
export interface CarFilters {
  brand_id?: string;
  model_id?: string;
  location_id?: string;
  body_type?: string;
  min_price?: number;
  max_price?: number;
  min_year?: number;
  max_year?: number;
  transmission?: string;
  fuel_type?: string;
  search?: string;
}

export async function getCars(
  filters?: CarFilters,
  limit: number = 20
): Promise<Car[]> {
  let query = supabase
    .from("cars")
    .select("*")
    .eq("is_sold", false)
    .eq("is_draft", false);

  // Apply filters
  if (filters?.brand_id) {
    query = query.eq("brand_id", filters.brand_id);
  }
  if (filters?.model_id) {
    query = query.eq("model_id", filters.model_id);
  }
  if (filters?.location_id) {
    query = query.eq("location_id", filters.location_id);
  }
  if (filters?.body_type) {
    query = query.eq("body_type", filters.body_type);
  }
  if (filters?.min_price) {
    query = query.gte("price", filters.min_price);
  }
  if (filters?.max_price) {
    query = query.lte("price", filters.max_price);
  }
  if (filters?.min_year) {
    query = query.gte("year", filters.min_year);
  }
  if (filters?.max_year) {
    query = query.lte("year", filters.max_year);
  }
  if (filters?.transmission) {
    query = query.eq("transmission", filters.transmission);
  }
  if (filters?.fuel_type) {
    query = query.eq("fuel_type", filters.fuel_type);
  }
  if (filters?.search) {
    query = query.or(
      `brand.ilike.%${filters.search}%,model.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
    );
  }

  query = query.order("created_at", { ascending: false }).limit(limit);

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching cars:", error);
    return [];
  }

  return data || [];
}

export async function getCarsByBrand(
  brandName: string,
  limit: number = 6
): Promise<Car[]> {
  // First get the brand
  const { data: brandData, error: brandError } = await supabase
    .from("brands")
    .select("id")
    .ilike("name", brandName)
    .single();

  if (brandError || !brandData) {
    console.error("Error fetching brand:", brandError);
    return [];
  }

  return getCars({ brand_id: brandData.id }, limit);
}

export async function getFeaturedCars(limit: number = 4): Promise<Car[]> {
  const { data, error } = await supabase
    .from("cars")
    .select("*")
    .eq("is_sold", false)
    .eq("is_draft", false)
    .eq("is_featured", true)
    .order("views_count", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching featured cars:", error);
    return [];
  }

  return data || [];
}

export async function getCarById(id: string): Promise<Car | null> {
  const { data, error } = await supabase
    .from("cars")
    .select(
      `
      *,
      brand:brands(*),
      model:car_models(*),
      location:locations(*),
      seller:profiles(*)
    `
    )
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching car:", error);
    return null;
  }

  // Increment view count
  await supabase.rpc("increment_car_views", { car_id: id });

  return data;
}

// ==================== FAQs ====================
export async function getAllFAQs(): Promise<FAQ[]> {
  const { data, error } = await supabase
    .from("faqs")
    .select("*")
    .eq("is_active", true)
    .order("order_index");

  if (error) {
    console.error("Error fetching FAQs:", error);
    return [];
  }

  return data || [];
}

// ==================== REVIEWS ====================
export async function getCarReviews(carId: string): Promise<Review[]> {
  const { data, error } = await supabase
    .from("reviews")
    .select(
      `
      *,
      reviewer:profiles(*)
    `
    )
    .eq("car_id", carId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }

  return data || [];
}

export async function getSellerReviews(sellerId: string): Promise<Review[]> {
  const { data, error } = await supabase
    .from("reviews")
    .select(
      `
      *,
      reviewer:profiles(*),
      car:cars(*)
    `
    )
    .eq("seller_id", sellerId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching seller reviews:", error);
    return [];
  }

  return data || [];
}

// ==================== FEEDBACK ====================
export async function submitFeedback(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
  user_id?: string;
  type?: string; // Add feedback type
}): Promise<boolean> {
  const { error } = await supabase.from("feedback").insert([
    {
      user_id: data.user_id || null,
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message,
      type: data.type || "other", // Include feedback type
      status: "pending",
    },
  ]);

  if (error) {
    console.error("Error submitting feedback:", error);
    return false;
  }

  return true;
}

export async function getAllFeedback() {
  const { data, error } = await supabase
    .from("feedback")
    .select(
      `
      *,
      user:profiles(*)
    `
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching feedback:", error);
    return [];
  }

  return data || [];
}

// ==================== FAVORITES ====================
export async function toggleFavorite(
  userId: string,
  carId: string
): Promise<boolean> {
  try {
    // Check if already favorited
    const { data: existing, error: checkError } = await supabase
      .from("favorites")
      .select("id")
      .eq("user_id", userId)
      .eq("car_id", carId)
      .maybeSingle();

    if (checkError) {
      console.error("Error checking favorite:", checkError);
      return false;
    }

    if (existing) {
      // Remove favorite
      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("id", existing.id);

      if (error) {
        console.error("Error removing favorite:", error);
        return false;
      }
      return true;
    } else {
      // Add favorite
      const { error } = await supabase.from("favorites").insert([
        {
          user_id: userId,
          car_id: carId,
        },
      ]);

      if (error) {
        console.error("Error adding favorite:", error);
        return false;
      }

      // Get car details to send notification to owner
      const { data: car } = await supabase
        .from("cars")
        .select("user_id, brand, model, year")
        .eq("id", carId)
        .single();

      // Get user details for notification message
      const { data: favUser } = await supabase
        .from("profiles")
        .select("full_name, email")
        .eq("id", userId)
        .single();

      // Send notification to car owner (if not favoriting own car)
      // This is optional - favorite still works even if notification fails
      if (car && car.user_id !== userId) {
        const userName =
          favUser?.full_name || favUser?.email?.split("@")[0] || "Seseorang";

        try {
          console.log(
            "💝 Sending favorite notification to car owner:",
            car.user_id
          );
          const notifResult = await createNotification(
            car.user_id,
            "favorite",
            "Mobil Difavoritkan",
            `${userName} menyukai ${car.brand} ${car.model} ${car.year} Anda`,
            `/cars/${carId}`
          );
          console.log("Notification result:", notifResult);
        } catch (notifError) {
          console.warn(
            "⚠️ Failed to send notification (non-critical):",
            notifError
          );
        }
      } else {
        console.log("⚠️ Not sending notification:", {
          carExists: !!car,
          carUserId: car?.user_id,
          currentUserId: userId,
          isOwnCar: car?.user_id === userId,
        });
      }

      return true;
    }
  } catch (error) {
    console.error("Error in toggleFavorite:", error);
    return false;
  }
}

export async function getUserFavorites(userId: string): Promise<Car[]> {
  const { data, error } = await supabase
    .from("favorites")
    .select(
      `
      car_id,
      cars (*)
    `
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching favorites:", error);
    return [];
  }

  return data?.map((item: any) => item.cars).filter(Boolean) || [];
}

export async function isCarFavorited(
  userId: string,
  carId: string
): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from("favorites")
      .select("id")
      .eq("user_id", userId)
      .eq("car_id", carId)
      .maybeSingle();

    if (error) {
      console.error("Error checking favorite status:", error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error("Error in isCarFavorited:", error);
    return false;
  }
}

// ==================== NOTIFICATIONS ====================
export async function getNotificationsByUser(userId: string) {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }

  return data || [];
}

export async function getUnreadNotificationCount(
  userId: string
): Promise<number> {
  const { count, error } = await supabase
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("is_read", false);

  if (error) {
    console.error("Error fetching unread count:", error);
    return 0;
  }

  return count || 0;
}

export async function markNotificationAsRead(
  notificationId: string
): Promise<boolean> {
  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", notificationId);

  if (error) {
    console.error("Error marking notification as read:", error);
    return false;
  }

  return true;
}

export async function markAllNotificationsAsRead(
  userId: string
): Promise<boolean> {
  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("user_id", userId)
    .eq("is_read", false);

  if (error) {
    console.error("Error marking all notifications as read:", error);
    return false;
  }

  return true;
}

export async function deleteNotification(
  notificationId: string
): Promise<boolean> {
  const { error } = await supabase
    .from("notifications")
    .delete()
    .eq("id", notificationId);

  if (error) {
    console.error("Error deleting notification:", error);
    return false;
  }

  return true;
}

export async function createNotification(
  userId: string,
  type: "chat" | "favorite" | "car_update" | "system" | "review",
  title: string,
  message: string,
  link?: string,
  metadata?: Record<string, any>
): Promise<boolean> {
  console.log("🔔 Creating notification:", {
    userId,
    type,
    title,
    message,
    link,
  });

  const { data, error } = await supabase
    .from("notifications")
    .insert([
      {
        user_id: userId,
        type,
        title,
        message,
        link,
        // metadata, // REMOVED: field doesn't exist in table
        is_read: false,
      },
    ])
    .select();

  if (error) {
    console.error("❌ Error creating notification:", error);
    return false;
  }

  console.log("✅ Notification created successfully:", data);
  return true;
}

// ==================== CONVERSATIONS & MESSAGES ====================
export async function getOrCreateConversation(
  buyerId: string,
  sellerId: string,
  carId: string
) {
  try {
    // Check if conversation already exists
    const { data: existing, error: searchError } = await supabase
      .from("conversations")
      .select("*")
      .eq("car_id", carId)
      .eq("buyer_id", buyerId)
      .eq("seller_id", sellerId)
      .single();

    if (existing) {
      return { data: existing, error: null };
    }

    // Create new conversation
    const { data: newConversation, error: createError } = await supabase
      .from("conversations")
      .insert([
        {
          car_id: carId,
          buyer_id: buyerId,
          seller_id: sellerId,
          last_message_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (createError) {
      console.error("Error creating conversation:", createError);
      return { data: null, error: createError };
    }

    return { data: newConversation, error: null };
  } catch (error) {
    console.error("Error in getOrCreateConversation:", error);
    return { data: null, error };
  }
}

export async function getUserConversations(userId: string) {
  try {
    const { data, error } = await supabase
      .from("conversations")
      .select(
        `
        *,
        car:cars(*),
        buyer:profiles!conversations_buyer_id_fkey(*),
        seller:profiles!conversations_seller_id_fkey(*)
      `
      )
      .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
      .order("last_message_at", { ascending: false });

    if (error) {
      console.error("Error fetching conversations:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}

export async function getConversationMessages(conversationId: string) {
  try {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching messages:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}

export async function sendMessage(
  conversationId: string,
  senderId: string,
  content: string
) {
  try {
    // Get conversation details to know who to notify
    const { data: conversation, error: convError } = await supabase
      .from("conversations")
      .select(
        `
        *,
        buyer:profiles!conversations_buyer_id_fkey(id, full_name),
        seller:profiles!conversations_seller_id_fkey(id, full_name),
        car:cars(brand, model, year)
      `
      )
      .eq("id", conversationId)
      .single();

    if (convError) {
      console.error("Error fetching conversation:", convError);
    }

    // Determine receiver_id based on conversation participants
    const receiverId = conversation
      ? conversation.buyer_id === senderId
        ? conversation.seller_id
        : conversation.buyer_id
      : null;

    // Insert message with receiver_id
    const { data: message, error: messageError } = await supabase
      .from("messages")
      .insert([
        {
          conversation_id: conversationId,
          sender_id: senderId,
          receiver_id: receiverId,
          content,
          is_read: false,
          is_delivered: true, // Will be updated based on receiver online status
        },
      ])
      .select()
      .single();

    if (messageError) {
      console.error("Error sending message:", messageError);
      return { data: null, error: messageError };
    }

    // Update conversation's last_message and last_message_at
    await supabase
      .from("conversations")
      .update({
        last_message: content,
        last_message_at: new Date().toISOString(),
      })
      .eq("id", conversationId);

    // Create notification for receiver
    if (conversation && receiverId) {
      const senderName =
        conversation.buyer_id === senderId
          ? conversation.buyer?.full_name || "User"
          : conversation.seller?.full_name || "User";

      const carInfo = conversation.car
        ? `${conversation.car.brand} ${conversation.car.model} ${conversation.car.year}`
        : "mobil";

      // Create notification
      await createNotification(
        receiverId,
        "chat",
        "Pesan Baru",
        `Pesan baru dari ${senderName} tentang ${carInfo}`,
        `/messages?conversation=${conversationId}`,
        {
          conversationId,
          senderId,
          messagePreview: content.substring(0, 50),
        }
      );
    }

    return { data: message, error: null };
  } catch (error) {
    console.error("Error in sendMessage:", error);
    return { data: null, error };
  }
}

// Mark all messages as read for a user
export async function markAllUserMessagesAsRead(userId: string) {
  try {
    // Get all conversations where user is participant
    const { data: conversations } = await supabase
      .from("conversations")
      .select("id")
      .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`);

    if (!conversations || conversations.length === 0) return;

    const conversationIds = conversations.map((c) => c.id);

    // Mark all messages in these conversations as read (except those sent by user)
    const { error } = await supabase
      .from("messages")
      .update({ is_read: true })
      .in("conversation_id", conversationIds)
      .neq("sender_id", userId)
      .eq("is_read", false);

    if (error) {
      console.error("Error marking messages as read:", error);
    }
  } catch (error) {
    console.error("Error in markAllUserMessagesAsRead:", error);
  }
}

// Mark messages in a specific conversation as read
export async function markConversationMessagesAsRead(
  conversationId: string,
  userId: string
) {
  try {
    // Update all unread messages from other person
    const { error } = await supabase
      .from("messages")
      .update({ is_read: true, is_delivered: true })
      .eq("conversation_id", conversationId)
      .neq("sender_id", userId)
      .eq("is_read", false);

    if (error) {
      console.error("Error marking conversation messages as read:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in markConversationMessagesAsRead:", error);
    return false;
  }
}

// Get unread count for a specific conversation
export async function getConversationUnreadCount(
  conversationId: string,
  userId: string
): Promise<number> {
  try {
    // Count unread messages from other person
    const { count, error } = await supabase
      .from("messages")
      .select("*", { count: "exact", head: true })
      .eq("conversation_id", conversationId)
      .eq("is_read", false)
      .neq("sender_id", userId);

    if (error) {
      console.error("Error getting unread count:", error);
      return 0;
    }

    return count || 0;
  } catch (error) {
    console.error("Error in getConversationUnreadCount:", error);
    return 0;
  }
}
