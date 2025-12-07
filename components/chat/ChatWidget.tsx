"use client";

import { useState, useEffect, useRef } from "react";
import { MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getUserConversations } from "@/lib/database";
import type { RealtimeChannel } from "@supabase/supabase-js";

export default function ChatWidget() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const realtimeChannelRef = useRef<RealtimeChannel | null>(null);
  const fetchIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (user?.id) {
      fetchUnreadCount();
      setupRealtimeSubscription();
      setupPeriodicRefresh();
      setupEventListeners();
    }

    return () => {
      cleanupRealtimeSubscription();
      cleanupPeriodicRefresh();
    };
  }, [user]);

  const setupRealtimeSubscription = () => {
    if (!user?.id) return;

    cleanupRealtimeSubscription();

    const channel = supabase
      .channel(`user-unread-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
        },
        async () => {
          await fetchUnreadCount();
        }
      )
      .subscribe();

    realtimeChannelRef.current = channel;
  };

  const cleanupRealtimeSubscription = () => {
    if (realtimeChannelRef.current) {
      supabase.removeChannel(realtimeChannelRef.current);
      realtimeChannelRef.current = null;
    }
  };

  const setupPeriodicRefresh = () => {
    cleanupPeriodicRefresh();
    fetchIntervalRef.current = setInterval(() => {
      fetchUnreadCount();
    }, 5000); // Refresh every 5 seconds
  };

  const cleanupPeriodicRefresh = () => {
    if (fetchIntervalRef.current) {
      clearInterval(fetchIntervalRef.current);
      fetchIntervalRef.current = null;
    }
  };

  const setupEventListeners = () => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchUnreadCount();
      }
    };

    const handleRefreshUnread = () => {
      console.log("[ChatWidget] Refresh event received");
      setTimeout(() => {
        fetchUnreadCount();
      }, 500); // Increased delay for better database sync
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("refreshUnreadCount", handleRefreshUnread);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("refreshUnreadCount", handleRefreshUnread);
    };
  };

  const fetchUser = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();
        setUser(profile);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const fetchUnreadCount = async () => {
    if (!user?.id) return;

    try {
      const conversations = await getUserConversations(user.id);
      let totalUnread = 0;

      for (const conv of conversations) {
        // Count unread messages
        const { count } = await supabase
          .from("messages")
          .select("*", { count: "exact", head: true })
          .eq("conversation_id", conv.id)
          .eq("is_read", false)
          .neq("sender_id", user.id);

        totalUnread += count || 0;
      }

      console.log(`[ChatWidget] Unread count: ${totalUnread}`);

      if (totalUnread !== unreadCount) {
        console.log(
          `[ChatWidget] Updating badge: ${unreadCount} -> ${totalUnread}`
        );
        setUnreadCount(totalUnread);
      }
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  const handleOpenChat = () => {
    router.push("/messages");
  };

  if (!user) return null;

  return (
    <button
      onClick={handleOpenChat}
      className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white p-4 rounded-full shadow-2xl transition-all hover:scale-110 z-50 group">
      <MessageCircle className="w-6 h-6" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[24px] h-6 px-2 flex items-center justify-center font-bold animate-pulse">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
      <span className="absolute right-16 top-1/2 -translate-y-1/2 bg-slate-900 text-white px-3 py-1 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
        {unreadCount > 0 ? `${unreadCount} Pesan Baru` : "Buka Chat"}
      </span>
    </button>
  );
}
