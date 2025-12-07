"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Bell,
  MessageCircle,
  Heart,
  CheckCircle,
  Trash2,
  Check,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import ChatWidget from "@/components/chat/ChatWidget";
import { supabase } from "@/lib/supabase";
import {
  getNotificationsByUser,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from "@/lib/database";
import type { Notification } from "@/types";
import { useNotificationStore } from "@/store/notificationStore";

export default function NotificationsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  // Use notification store with realtime
  const { initializeRealtime, cleanupRealtime } = useNotificationStore();

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    // Load notifications when user is available
    if (user?.id) {
      loadNotifications();
      // Initialize realtime updates
      initializeRealtime(user.id);
    }

    return () => {
      cleanupRealtime();
    };
  }, [user]);

  const loadNotifications = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const dbNotifications = await getNotificationsByUser(user.id);
      setNotifications(dbNotifications);
    } catch (error) {
      console.error("Error loading notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const getIconForType = (type: string): string => {
    switch (type) {
      case "chat":
        return "💬";
      case "favorite":
        return "❤️";
      case "car_update":
        return "✅";
      case "review":
        return "⭐";
      case "system":
        return "🔔";
      default:
        return "🔔";
    }
  };

  const formatTime = (date: string): string => {
    const d = new Date(date);
    const now = new Date();
    const diffInMs = now.getTime() - d.getTime();
    const diffInMinutes = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMs / 3600000);
    const diffInDays = Math.floor(diffInMs / 86400000);

    if (diffInMinutes < 1) return "Baru saja";
    if (diffInMinutes < 60) return `${diffInMinutes} menit yang lalu`;
    if (diffInHours < 24) return `${diffInHours} jam yang lalu`;
    return `${diffInDays} hari yang lalu`;
  };

  const fetchUser = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        router.push("/login");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      setUser(profile || session.user);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      const success = await markNotificationAsRead(id);

      if (success) {
        // Update local state
        setNotifications(
          notifications.map((notif) =>
            notif.id === id ? { ...notif, is_read: true } : notif
          )
        );
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!user?.id) return;

    try {
      const success = await markAllNotificationsAsRead(user.id);

      if (success) {
        // Update local state
        setNotifications(
          notifications.map((notif) => ({ ...notif, is_read: true }))
        );
      }
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const handleDeleteNotification = async (id: string) => {
    try {
      const success = await deleteNotification(id);

      if (success) {
        // Update local state
        setNotifications(notifications.filter((notif) => notif.id !== id));
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    handleMarkAsRead(notification.id);
    if (notification.link) {
      router.push(notification.link);
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const getIconComponent = (type: string) => {
    switch (type) {
      case "chat":
        return <MessageCircle className="w-5 h-5 text-blue-400" />;
      case "favorite":
        return <Heart className="w-5 h-5 text-red-400 fill-red-400" />;
      case "car_update":
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case "review":
        return <CheckCircle className="w-5 h-5 text-amber-400" />;
      default:
        return <Bell className="w-5 h-5 text-amber-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-amber-900">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors group">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Kembali</span>
        </button>

        {/* Header */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 mb-6 border border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-8 h-8 text-amber-400" />
              <div>
                <h1 className="text-2xl font-bold text-white">Notifikasi</h1>
                <p className="text-white/70">
                  {unreadCount > 0
                    ? `${unreadCount} notifikasi belum dibaca`
                    : "Semua notifikasi telah dibaca"}
                </p>
              </div>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-all">
                <Check className="w-4 h-4" />
                Tandai Semua Dibaca
              </button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {loading ? (
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-12 border border-white/10 text-center">
              <Bell className="w-16 h-16 mx-auto mb-4 text-gray-400 animate-pulse" />
              <h3 className="text-xl font-bold text-white mb-2">
                Memuat notifikasi...
              </h3>
            </div>
          ) : notifications.length === 0 ? (
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-12 border border-white/10 text-center">
              <Bell className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-bold text-white mb-2">
                Tidak Ada Notifikasi
              </h3>
              <p className="text-white/70">
                Anda tidak memiliki notifikasi saat ini
              </p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden hover:border-blue-500/50 transition-all group ${
                  !notification.is_read ? "bg-blue-500/10" : ""
                }`}>
                <div className="p-4 flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        notification.type === "chat"
                          ? "bg-blue-500/20"
                          : notification.type === "favorite"
                          ? "bg-red-500/20"
                          : notification.type === "car_update"
                          ? "bg-green-500/20"
                          : "bg-amber-500/20"
                      }`}>
                      {getIconComponent(notification.type)}
                    </div>
                  </div>
                  <div
                    className="flex-1 cursor-pointer"
                    onClick={() => handleNotificationClick(notification)}>
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-semibold text-white">
                        {notification.title}
                      </h3>
                      {!notification.is_read && (
                        <span className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full ml-2 mt-2"></span>
                      )}
                    </div>
                    <p className="text-white/70 text-sm mb-2">
                      {notification.message}
                    </p>
                    <p className="text-white/50 text-xs">
                      {formatTime(notification.created_at)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {!notification.is_read && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkAsRead(notification.id);
                        }}
                        className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-blue-400"
                        title="Tandai dibaca">
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteNotification(notification.id);
                      }}
                      className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-red-400"
                      title="Hapus notifikasi">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <ChatWidget />
    </div>
  );
}
