import { create } from "zustand";
import { supabase } from "@/lib/supabase";
import { subscribeToNotifications, unsubscribe } from "@/lib/realtime";
import { RealtimeChannel } from "@supabase/supabase-js";
import type { Notification } from "@/types";

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  realtimeChannel: RealtimeChannel | null;
  
  // Actions
  fetchNotifications: (userId: string) => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: (userId: string) => Promise<void>;
  
  // Realtime actions
  initializeRealtime: (userId: string) => void;
  cleanupRealtime: () => void;
  addNotification: (notification: Notification) => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  realtimeChannel: null,

  fetchNotifications: async (userId: string) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) throw error;

      const unreadCount = data?.filter((n) => !n.is_read).length || 0;

      set({
        notifications: data || [],
        unreadCount,
      });
    } finally {
      set({ isLoading: false });
    }
  },

  markAsRead: async (id: string) => {
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", id);

    if (error) throw error;

    const notifications = get().notifications.map((n) =>
      n.id === id ? { ...n, is_read: true } : n
    );
    const unreadCount = notifications.filter((n) => !n.is_read).length;

    set({ notifications, unreadCount });
  },

  markAllAsRead: async (userId: string) => {
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", userId)
      .eq("is_read", false);

    if (error) throw error;

    const notifications = get().notifications.map((n) => ({
      ...n,
      is_read: true,
    }));

    set({ notifications, unreadCount: 0 });
  },

  initializeRealtime: (userId: string) => {
    // Clean up existing subscription
    const { realtimeChannel } = get();
    if (realtimeChannel) {
      unsubscribe(realtimeChannel);
    }

    // Subscribe to new notifications
    const channel = subscribeToNotifications(userId, (newNotification) => {
      get().addNotification(newNotification);
      
      // Show browser notification if permission granted
      if (Notification.permission === 'granted') {
        new Notification(newNotification.title, {
          body: newNotification.message,
          icon: '/logo.png',
          tag: newNotification.id,
        });
      }
    });

    set({ realtimeChannel: channel });
  },

  cleanupRealtime: async () => {
    const { realtimeChannel } = get();
    if (realtimeChannel) {
      await unsubscribe(realtimeChannel);
      set({ realtimeChannel: null });
    }
  },

  addNotification: (notification: Notification) => {
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }));
  },
}));
