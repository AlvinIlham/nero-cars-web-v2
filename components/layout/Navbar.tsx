"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Bell,
  User,
  Heart,
  Car,
  LogOut,
  MessageCircle,
  Menu,
  X,
  Shield,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import {
  getNotificationsByUser,
  markAllNotificationsAsRead,
} from "@/lib/database";
import { isAdmin } from "@/lib/adminAuth";
import type { Notification } from "@/types";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [isUserAdmin, setIsUserAdmin] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    checkUser();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setUser(null);
        setNotifications([]);
        setNotificationCount(0);
        setIsUserAdmin(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    // Fetch notifications when user is available
    if (user?.id) {
      fetchNotifications();

      // Set up interval to refresh notifications periodically
      const interval = setInterval(fetchNotifications, 30000); // Every 30 seconds

      return () => clearInterval(interval);
    }
  }, [user]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      // Close profile menu if clicked outside
      if (showProfileMenu && !target.closest(".profile-menu-container")) {
        setShowProfileMenu(false);
      }

      // Close notifications if clicked outside
      if (showNotifications && !target.closest(".notifications-container")) {
        setShowNotifications(false);
      }

      // Close mobile menu if clicked outside
      if (
        showMobileMenu &&
        !target.closest(".mobile-menu-container") &&
        !target.closest(".mobile-menu-button")
      ) {
        setShowMobileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showProfileMenu, showNotifications, showMobileMenu]);

  const fetchNotifications = async () => {
    if (!user?.id) return;

    try {
      const data = await getNotificationsByUser(user.id);

      // Get only unread notifications
      const unreadNotifications = data.filter((n: Notification) => !n.is_read);

      // Get top 3 most recent unread notifications for dropdown
      const recentNotifications = unreadNotifications.slice(0, 3);

      setNotifications(recentNotifications);
      setNotificationCount(unreadNotifications.length);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const checkUser = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        await fetchUserProfile(session.user.id);
      }
    } catch (error) {
      console.error("Error checking user:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;
      setUser(data);

      // Check if user is admin
      if (data?.email) {
        setIsUserAdmin(isAdmin(data.email));
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      // If profile doesn't exist, use basic auth data
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();
      if (authUser) {
        setUser({
          id: authUser.id,
          email: authUser.email,
          full_name: authUser.user_metadata?.full_name || "User",
        });

        // Check if user is admin
        if (authUser.email) {
          setIsUserAdmin(isAdmin(authUser.email));
        }
      }
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setNotifications([]);
      setNotificationCount(0);
      setIsUserAdmin(false);
      setShowProfileMenu(false);
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const formatTime = (date: string): string => {
    const d = new Date(date);
    const now = new Date();
    const diffInMs = now.getTime() - d.getTime();
    const diffInMinutes = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMs / 3600000);

    if (diffInMinutes < 1) return "Baru saja";
    if (diffInMinutes < 60) return `${diffInMinutes} menit yang lalu`;
    if (diffInHours < 24) return `${diffInHours} jam yang lalu`;
    return "Lebih dari 1 hari yang lalu";
  };

  const getNotificationIcon = (type: string): string => {
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

  const isActive = (path: string) => {
    return pathname === path;
  };

  const NavLink = ({
    href,
    children,
  }: {
    href: string;
    children: React.ReactNode;
  }) => {
    const active = isActive(href);
    return (
      <Link
        href={href}
        className={`${
          active
            ? "text-amber-400 font-semibold border-b-2 border-amber-400"
            : "text-gray-300 hover:text-amber-400"
        } font-medium transition-colors pb-1 cursor-pointer relative z-10`}>
        {children}
      </Link>
    );
  };

  return (
    <nav className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 shadow-2xl sticky top-0 z-[100] border-b-2 border-amber-500/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Mobile Menu Button (Left side on mobile) */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden p-2 hover:bg-slate-700 rounded-lg transition-colors mobile-menu-button">
            {showMobileMenu ? (
              <X className="w-6 h-6 text-amber-400" />
            ) : (
              <Menu className="w-6 h-6 text-amber-400" />
            )}
          </button>

          {/* Logo (Hidden on mobile, visible on md and above) */}
          <Link href="/" className="hidden md:flex items-center space-x-3">
            <div className="relative w-12 h-12 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-xl shadow-lg overflow-hidden flex items-center justify-center ring-2 ring-amber-500/50">
              <Image
                src="/assets/img/logo.png"
                alt="Nero Cars Logo"
                width={56}
                height={56}
                className="object-cover scale-125"
                unoptimized
              />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
              NEROCARS
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8 relative z-10">
            <NavLink href="/">HOME</NavLink>
            <NavLink href="/cars">BELI MOBIL</NavLink>
            <NavLink href="/sell-car">JUAL MOBIL</NavLink>
            <NavLink href="/faq">FAQ</NavLink>
            <NavLink href="/about">ABOUT US</NavLink>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* Notifications */}
                <div className="relative notifications-container">
                  <button
                    onClick={async () => {
                      if (!showNotifications && notificationCount > 0) {
                        // Mark all notifications as read when opening dropdown
                        await markAllNotificationsAsRead(user.id);
                        setNotificationCount(0);
                        setNotifications(
                          notifications.map((n) => ({ ...n, is_read: true }))
                        );
                      }
                      setShowNotifications(!showNotifications);
                    }}
                    className="relative p-2 hover:bg-slate-700 rounded-full transition-colors">
                    <Bell className="w-5 h-5 text-amber-400" />
                    {notificationCount > 0 && (
                      <span className="absolute top-0 right-0 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg">
                        {notificationCount}
                      </span>
                    )}
                  </button>

                  {/* Notification Dropdown */}
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg shadow-2xl border border-amber-500/30 py-2 z-[110]">
                      <div className="px-4 py-2 border-b border-amber-500/20">
                        <h3 className="font-semibold text-amber-400">
                          Notifikasi
                        </h3>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length > 0 ? (
                          notifications.map((notification) => (
                            <NotificationItem
                              key={notification.id}
                              icon={getNotificationIcon(notification.type)}
                              title={notification.title}
                              message={notification.message}
                              time={formatTime(notification.created_at)}
                              link={notification.link}
                            />
                          ))
                        ) : (
                          <div className="px-4 py-8 text-center">
                            <p className="text-gray-400 text-sm">
                              Tidak ada notifikasi baru
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="px-4 py-2 border-t border-amber-500/20">
                        <Link
                          href="/notifications"
                          onClick={() => setShowNotifications(false)}
                          className="text-sm text-amber-400 hover:text-amber-300 transition-colors">
                          Lihat Semua Notifikasi
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile Menu */}
                <div className="relative profile-menu-container">
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center space-x-2 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white px-4 py-2 rounded-lg transition-all shadow-lg ring-2 ring-amber-500/50">
                    <User className="w-5 h-5" />
                    <span className="hidden md:block font-medium">
                      {user.full_name?.split(" ")[0] || "Profile"}
                    </span>
                  </button>

                  {/* Profile Dropdown */}
                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-64 bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-lg shadow-2xl py-2 border border-amber-500/30 z-[110]">
                      <div className="px-4 py-3 border-b border-amber-500/20">
                        <p className="font-semibold text-amber-400">
                          {user.full_name || "User"}
                        </p>
                        <p className="text-sm text-gray-300">{user.email}</p>
                      </div>
                      {isUserAdmin && (
                        <Link
                          href="/admin"
                          className="flex items-center px-4 py-2 hover:bg-slate-700 transition-colors border-b border-amber-500/20"
                          onClick={() => setShowProfileMenu(false)}>
                          <Shield className="w-4 h-4 mr-3 text-amber-400" />
                          <span className="font-semibold text-amber-400">
                            Panel Admin
                          </span>
                        </Link>
                      )}
                      <Link
                        href="/profile/edit"
                        className="flex items-center px-4 py-2 hover:bg-slate-700 transition-colors"
                        onClick={() => setShowProfileMenu(false)}>
                        <User className="w-4 h-4 mr-3 text-amber-400" />
                        <span>Edit profil</span>
                      </Link>
                      <Link
                        href="/messages"
                        className="flex items-center px-4 py-2 hover:bg-slate-700 transition-colors"
                        onClick={() => setShowProfileMenu(false)}>
                        <MessageCircle className="w-4 h-4 mr-3 text-amber-400" />
                        <span>Chat</span>
                      </Link>
                      <Link
                        href="/notifications"
                        className="flex items-center px-4 py-2 hover:bg-slate-700 transition-colors"
                        onClick={() => setShowProfileMenu(false)}>
                        <Bell className="w-4 h-4 mr-3 text-amber-400" />
                        <span>Notifikasi</span>
                      </Link>
                      <Link
                        href="/favorites"
                        className="flex items-center px-4 py-2 hover:bg-slate-700 transition-colors"
                        onClick={() => setShowProfileMenu(false)}>
                        <Heart className="w-4 h-4 mr-3 text-amber-400" />
                        <span>Favorite</span>
                      </Link>
                      <Link
                        href="/my-cars"
                        className="flex items-center px-4 py-2 hover:bg-slate-700 transition-colors"
                        onClick={() => setShowProfileMenu(false)}>
                        <Car className="w-4 h-4 mr-3 text-amber-400" />
                        <span>Mobil Saya</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 hover:bg-slate-700 border-t border-amber-500/20 mt-2 transition-colors">
                        <LogOut className="w-4 h-4 mr-3 text-red-400" />
                        <span>Keluar</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link
                href="/login"
                className="bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white px-6 py-2 rounded-lg font-medium shadow-lg ring-2 ring-amber-500/50 transition-all">
                Masuk
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden border-t border-amber-500/30 py-4 mobile-menu-container">
            <div className="flex flex-col space-y-4">
              <Link
                href="/"
                onClick={() => setShowMobileMenu(false)}
                className={`${
                  isActive("/")
                    ? "text-amber-400 font-semibold"
                    : "text-gray-300"
                } hover:text-amber-400 transition-colors px-4 py-2`}>
                HOME
              </Link>
              <Link
                href="/cars"
                onClick={() => setShowMobileMenu(false)}
                className={`${
                  isActive("/cars")
                    ? "text-amber-400 font-semibold"
                    : "text-gray-300"
                } hover:text-amber-400 transition-colors px-4 py-2`}>
                BELI MOBIL
              </Link>
              <Link
                href="/sell-car"
                onClick={() => setShowMobileMenu(false)}
                className={`${
                  isActive("/sell-car")
                    ? "text-amber-400 font-semibold"
                    : "text-gray-300"
                } hover:text-amber-400 transition-colors px-4 py-2`}>
                JUAL MOBIL
              </Link>
              <Link
                href="/faq"
                onClick={() => setShowMobileMenu(false)}
                className={`${
                  isActive("/faq")
                    ? "text-amber-400 font-semibold"
                    : "text-gray-300"
                } hover:text-amber-400 transition-colors px-4 py-2`}>
                FAQ
              </Link>
              <Link
                href="/about"
                onClick={() => setShowMobileMenu(false)}
                className={`${
                  isActive("/about")
                    ? "text-amber-400 font-semibold"
                    : "text-gray-300"
                } hover:text-amber-400 transition-colors px-4 py-2`}>
                ABOUT US
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

function NotificationItem({
  icon,
  title,
  message,
  time,
  link,
}: {
  icon: string;
  title: string;
  message: string;
  time: string;
  link?: string;
}) {
  if (link) {
    return (
      <Link
        href={link}
        className="px-4 py-3 hover:bg-slate-700 cursor-pointer border-b border-amber-500/10 transition-colors block">
        <div className="flex items-start space-x-3">
          <span className="text-2xl">{icon}</span>
          <div className="flex-1">
            <p className="font-semibold text-amber-400 text-sm">{title}</p>
            <p className="text-sm text-gray-300 line-clamp-2">{message}</p>
            <p className="text-xs text-gray-400 mt-1">{time}</p>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <div className="px-4 py-3 hover:bg-slate-700 cursor-pointer border-b border-amber-500/10 transition-colors block">
      <div className="flex items-start space-x-3">
        <span className="text-2xl">{icon}</span>
        <div className="flex-1">
          <p className="font-semibold text-amber-400 text-sm">{title}</p>
          <p className="text-sm text-gray-300 line-clamp-2">{message}</p>
          <p className="text-xs text-gray-400 mt-1">{time}</p>
        </div>
      </div>
    </div>
  );
}
