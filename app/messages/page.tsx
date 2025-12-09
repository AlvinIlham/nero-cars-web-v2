"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  MessageCircle,
  Send,
  ArrowLeft,
  Search,
  MoreVertical,
  Image as ImageIcon,
  Paperclip,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import { supabase } from "@/lib/supabase";
import {
  getUserConversations,
  getConversationMessages,
  sendMessage as sendMessageDb,
  markConversationMessagesAsRead,
  getConversationUnreadCount,
} from "@/lib/database";
import type { RealtimeChannel } from "@supabase/supabase-js";

interface Contact {
  id: string;
  name: string;
  lastMessage: string;
  lastMessageType?: string;
  time: string;
  unread: number;
  avatar?: string;
  online?: boolean;
  carInfo?: string;
}

interface Message {
  id: string;
  senderId: string;
  content: string;
  time: string;
  isOwn: boolean;
  isRead?: boolean;
  isDelivered?: boolean;
}

export default function MessagesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<any>(null);
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockedBy, setBlockedBy] = useState<string | null>(null);
  const [otherUserId, setOtherUserId] = useState<string | null>(null);
  const [userPresence, setUserPresence] = useState<Record<string, boolean>>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageZoom, setImageZoom] = useState(1);
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const realtimeChannelRef = useRef<RealtimeChannel | null>(null);
  const blockChannelRef = useRef<RealtimeChannel | null>(null);
  const presenceIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const activeChatRef = useRef<string | null>(null);
  const userRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const shouldAutoScrollRef = useRef(true);

  useEffect(() => {
    fetchUser();
  }, []);

  // Keep refs in sync with state
  useEffect(() => {
    activeChatRef.current = activeChat;
  }, [activeChat]);

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  // Update user presence
  useEffect(() => {
    if (user?.id) {
      updateUserPresence(true);

      // Update presence every 10 seconds for highly responsive online status
      presenceIntervalRef.current = setInterval(() => {
        updateUserPresence(true);
      }, 10000);

      // Set offline on page unload
      const handleBeforeUnload = () => {
        updateUserPresence(false);
      };
      window.addEventListener("beforeunload", handleBeforeUnload);

      // Also update on visibility change
      const handleVisibilityChange = () => {
        if (!document.hidden) {
          updateUserPresence(true);
        }
      };
      document.addEventListener("visibilitychange", handleVisibilityChange);

      return () => {
        if (presenceIntervalRef.current) {
          clearInterval(presenceIntervalRef.current);
        }
        window.removeEventListener("beforeunload", handleBeforeUnload);
        document.removeEventListener(
          "visibilitychange",
          handleVisibilityChange
        );
        updateUserPresence(false);
      };
    }
  }, [user]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (showMenu) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [showMenu]);

  useEffect(() => {
    if (user?.id) {
      loadConversations();
      setupRealtimeSubscription();
      subscribeToPresence();
    }

    return () => {
      cleanupRealtimeSubscription();
    };
  }, [user]);

  useEffect(() => {
    const conversationId = searchParams.get("conversation");
    if (
      conversationId &&
      conversationId !== activeChat &&
      contacts.length > 0
    ) {
      setActiveChat(conversationId);
    }
  }, [searchParams, contacts]);

  useEffect(() => {
    if (activeChat && user?.id) {
      loadMessagesAndMarkAsRead(activeChat);
      checkBlockStatus();

      // Set up interval to keep marking messages as read while chat is open
      const interval = setInterval(() => {
        if (document.visibilityState === "visible") {
          markMessagesAsReadImmediately(activeChat);
        }
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [activeChat, user]);

  useEffect(() => {
    if (shouldAutoScrollRef.current) {
      scrollToBottom();
    }
  }, [messages, activeChat]);

  // Reset auto-scroll ketika pindah chat
  useEffect(() => {
    if (activeChat) {
      shouldAutoScrollRef.current = true;
    }
  }, [activeChat]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && user?.id) {
        loadConversations();
        if (activeChat) {
          loadMessagesAndMarkAsRead(activeChat);
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [user, activeChat]);

  useEffect(() => {
    return () => {
      notifyBadgeRefresh();
      cleanupRealtimeSubscription();
    };
  }, []);

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

  const updateUserPresence = async (isOnline: boolean) => {
    if (!user?.id) return;

    try {
      const { error } = await supabase.from("user_presence").upsert(
        {
          user_id: user.id,
          is_online: isOnline,
          last_seen: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );

      if (error) console.error("Error updating presence:", error);
    } catch (error) {
      console.error("Error updating presence:", error);
    }
  };

  const subscribeToPresence = () => {
    if (!user?.id) return;

    const channel = supabase
      .channel("user-presence-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "user_presence",
        },
        async (payload) => {
          const presence = payload.new as any;
          if (presence) {
            console.log(
              "[WEB] Presence update:",
              presence.user_id,
              presence.is_online ? "ONLINE" : "OFFLINE"
            );
            setUserPresence((prev) => ({
              ...prev,
              [presence.user_id]: presence.is_online,
            }));

            // Update contacts online status
            const conversations = await getUserConversations(user.id);
            setContacts((prev) =>
              prev.map((contact) => {
                const conv = conversations.find(
                  (c: any) => c.id === contact.id
                );
                if (conv) {
                  const isUserBuyer = conv.buyer_id === user.id;
                  const otherUserId = isUserBuyer
                    ? conv.seller_id
                    : conv.buyer_id;
                  if (otherUserId === presence.user_id) {
                    return { ...contact, online: presence.is_online };
                  }
                }
                return contact;
              })
            );
          }
        }
      )
      .subscribe();

    return channel;
  };

  const loadUserPresence = async (userIds: string[]) => {
    if (userIds.length === 0) return;

    try {
      const { data, error } = await supabase
        .from("user_presence")
        .select("user_id, is_online")
        .in("user_id", userIds);

      if (data) {
        const presenceMap: Record<string, boolean> = {};
        data.forEach((p) => {
          presenceMap[p.user_id] = p.is_online;
        });
        setUserPresence(presenceMap);
      }
    } catch (error) {
      console.error("Error loading user presence:", error);
    }
  };

  const checkBlockStatus = useCallback(async (conversationId?: string) => {
    // Use parameter or ref to get current values
    const currentUser = userRef.current;
    const currentActiveChat = conversationId || activeChatRef.current;

    if (!currentUser?.id || !currentActiveChat) {
      console.log(
        "[WEB] Cannot check block status - missing user or activeChat"
      );
      return;
    }

    try {
      console.log(
        "[WEB] Checking block status for conversation:",
        currentActiveChat
      );

      // Get conversation to find other user
      const { data: conversation } = await supabase
        .from("conversations")
        .select("buyer_id, seller_id")
        .eq("id", currentActiveChat)
        .single();

      if (!conversation) {
        console.log("[WEB] No conversation found");
        return;
      }

      const otherId =
        conversation.buyer_id === currentUser.id
          ? conversation.seller_id
          : conversation.buyer_id;

      console.log("[WEB] Other user ID:", otherId);
      setOtherUserId(otherId);

      // Check if blocked (use limit to handle potential duplicates)
      const { data: blockData, error: blockError } = await supabase
        .from("blocked_users")
        .select("id, blocker_id")
        .or(
          `and(blocker_id.eq.${currentUser.id},blocked_id.eq.${otherId}),and(blocker_id.eq.${otherId},blocked_id.eq.${currentUser.id})`
        )
        .limit(1);

      const blockCheck =
        blockData && blockData.length > 0 ? blockData[0] : null;

      console.log("[WEB] Block check result:", blockCheck);
      console.log("[WEB] Block check error:", blockError);

      if (blockCheck) {
        console.log("[WEB] BLOCKED! Blocker ID:", blockCheck.blocker_id);
        setIsBlocked(true);
        setBlockedBy(blockCheck.blocker_id);
      } else {
        console.log("[WEB] NOT BLOCKED");
        setIsBlocked(false);
        setBlockedBy(null);
      }
    } catch (error) {
      // No block found
      console.log("[WEB] Error checking block status:", error);
      setIsBlocked(false);
      setBlockedBy(null);
    }
  }, []);

  const loadConversations = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const conversations = await getUserConversations(user.id);

      // Collect all other user IDs
      const otherUserIds: string[] = [];

      const contactList: Contact[] = await Promise.all(
        conversations.map(async (conv: any) => {
          // Determine who is the other person (buyer or seller)
          const isUserBuyer = conv.buyer_id === user.id;
          const otherPerson = isUserBuyer ? conv.seller : conv.buyer;
          const otherUserId = isUserBuyer ? conv.seller_id : conv.buyer_id;

          if (otherUserId) {
            otherUserIds.push(otherUserId);
          }

          const carInfo = conv.car
            ? `${conv.car.brand} ${conv.car.model} ${conv.car.year}`
            : "";

          // Get unread count for this conversation
          const unreadCount = await getConversationUnreadCount(
            conv.id,
            user.id
          );

          const preview = conv.last_message
            ? getMessagePreview(conv.last_message)
            : { type: "text", text: "Tidak ada pesan" };

          return {
            id: conv.id,
            name: otherPerson?.full_name || "User",
            lastMessage: preview.text,
            lastMessageType: preview.type,
            time: formatTimeForList(conv.last_message_at || conv.created_at),
            unread: unreadCount,
            avatar: otherPerson?.avatar_url,
            online: false,
            carInfo,
          };
        })
      );

      setContacts(contactList);

      // Load presence for all other users
      if (otherUserIds.length > 0) {
        await loadUserPresence(otherUserIds);

        // Update contacts with loaded presence
        setContacts((prev) =>
          prev.map((contact) => {
            const conv = conversations.find((c: any) => c.id === contact.id);
            if (conv) {
              const isUserBuyer = conv.buyer_id === user.id;
              const otherUserId = isUserBuyer ? conv.seller_id : conv.buyer_id;
              return {
                ...contact,
                online: userPresence[otherUserId] || false,
              };
            }
            return contact;
          })
        );
      }
    } catch (error) {
      console.error("Error loading conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscription = useCallback(() => {
    if (!user?.id) return;

    cleanupRealtimeSubscription();

    console.log("[WEB] Setting up realtime subscriptions for user:", user.id);

    const channel = supabase
      .channel(`user-messages-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        async (payload) => {
          const newMessage = payload.new as any;

          const userConversations = await getUserConversations(user.id);
          const isUserInvolved = userConversations.some(
            (conv: any) => conv.id === newMessage.conversation_id
          );

          if (!isUserInvolved) return;

          const formattedMsg: Message = {
            id: newMessage.id,
            senderId: newMessage.sender_id,
            content: newMessage.content,
            time: formatTime(newMessage.created_at),
            isOwn: newMessage.sender_id === user.id,
            isRead: newMessage.is_read,
            isDelivered: newMessage.is_delivered,
          };

          setMessages((prev) => ({
            ...prev,
            [newMessage.conversation_id]: [
              ...(prev[newMessage.conversation_id] || []),
              formattedMsg,
            ],
          }));

          await loadConversations();

          // If this is the active conversation, mark as read immediately
          if (
            activeChat === newMessage.conversation_id &&
            newMessage.sender_id !== user.id
          ) {
            setTimeout(() => {
              markMessagesAsReadImmediately(newMessage.conversation_id);
            }, 200);
          } else {
            notifyBadgeRefresh();
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "messages",
        },
        (payload) => {
          const updatedMessage = payload.new as any;

          setMessages((prev) => {
            const conversationMessages =
              prev[updatedMessage.conversation_id] || [];
            const updatedMessages = conversationMessages.map((msg) =>
              msg.id === updatedMessage.id
                ? {
                    ...msg,
                    isRead: updatedMessage.is_read,
                    isDelivered: updatedMessage.is_delivered,
                  }
                : msg
            );

            return {
              ...prev,
              [updatedMessage.conversation_id]: updatedMessages,
            };
          });
        }
      )
      .subscribe((status) => {
        console.log("[WEB] Messages subscription status:", status);
      });

    realtimeChannelRef.current = channel;

    // Separate subscription for blocked_users changes
    // Use a unique channel name that doesn't depend on activeChat
    const blockChannel = supabase
      .channel(`block-updates-global-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "blocked_users",
        },
        (payload) => {
          console.log("[WEB] ========================================");
          console.log("[WEB] Block event received!");
          console.log("[WEB] Event type:", payload.eventType);
          console.log(
            "[WEB] Event data:",
            JSON.stringify(payload.new || payload.old, null, 2)
          );
          console.log("[WEB] Current user ID:", user.id);
          console.log("[WEB] Active chat:", activeChat);
          console.log("[WEB] ========================================");

          // Always refresh block status when any change happens
          setTimeout(() => {
            console.log("[WEB] Refreshing block status after event...");
            checkBlockStatus();
          }, 100);
        }
      )
      .subscribe((status) => {
        console.log("[WEB] Block subscription status:", status);
        if (status === "SUBSCRIBED") {
          console.log(
            "[WEB] ✅ Block subscription is now ACTIVE and listening!"
          );
        }
      });

    blockChannelRef.current = blockChannel;
  }, [user]);

  const cleanupRealtimeSubscription = () => {
    if (realtimeChannelRef.current) {
      supabase.removeChannel(realtimeChannelRef.current);
      realtimeChannelRef.current = null;
    }
    if (blockChannelRef.current) {
      supabase.removeChannel(blockChannelRef.current);
      blockChannelRef.current = null;
    }
  };

  const markMessagesAsReadImmediately = async (conversationId: string) => {
    if (!user?.id) return;

    try {
      console.log(
        `Marking messages as read for conversation: ${conversationId}`
      );
      const marked = await markConversationMessagesAsRead(
        conversationId,
        user.id
      );
      console.log(`Mark result:`, marked);

      // Update contacts unread count to 0
      setContacts((prev) =>
        prev.map((contact) =>
          contact.id === conversationId ? { ...contact, unread: 0 } : contact
        )
      );

      // Update messages to mark as read and delivered
      setMessages((prev) => {
        const conversationMessages = prev[conversationId] || [];
        const updatedMessages = conversationMessages.map((msg) =>
          !msg.isOwn ? { ...msg, isRead: true, isDelivered: true } : msg
        );

        return {
          ...prev,
          [conversationId]: updatedMessages,
        };
      });

      // Notify ChatWidget to refresh badge
      notifyBadgeRefresh();
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  };

  const notifyBadgeRefresh = () => {
    window.dispatchEvent(new Event("refreshUnreadCount"));
  };

  const loadMessagesAndMarkAsRead = async (conversationId: string) => {
    if (!user?.id) return;

    try {
      console.log(`[Messages] Loading and marking as read: ${conversationId}`);

      // First, mark all messages as read in database
      const markResult = await markConversationMessagesAsRead(
        conversationId,
        user.id
      );
      console.log(`[Messages] Mark as read result:`, markResult);

      // Increased delay to ensure database is fully updated
      await new Promise((resolve) => setTimeout(resolve, 400));

      // Then load messages with updated status
      const msgs = await getConversationMessages(conversationId);
      console.log(`[Messages] Loaded ${msgs.length} messages`);

      const formattedMessages: Message[] = msgs.map((msg: any) => ({
        id: msg.id,
        senderId: msg.sender_id,
        content: msg.content,
        time: formatTime(msg.created_at),
        isOwn: msg.sender_id === user.id,
        isRead: msg.is_read, // This should now be true after marking
        isDelivered: msg.is_delivered,
      }));

      console.log(
        `[Messages] Unread messages after load:`,
        formattedMessages.filter((m) => !m.isOwn && !m.isRead).length
      );

      setMessages((prev) => ({
        ...prev,
        [conversationId]: formattedMessages,
      }));

      // Update contacts unread count to 0
      setContacts((prev) =>
        prev.map((contact) =>
          contact.id === conversationId ? { ...contact, unread: 0 } : contact
        )
      );

      // Notify ChatWidget to refresh badge with delay
      setTimeout(() => {
        console.log("[Messages] Notifying badge refresh");
        notifyBadgeRefresh();
      }, 200);
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  };

  const formatTime = (dateString: string): string => {
    const utcDate = new Date(dateString);
    const wibDate = new Date(utcDate.getTime() + 7 * 60 * 60 * 1000); // +7 jam untuk WIB
    const hours = wibDate.getHours().toString().padStart(2, "0");
    const minutes = wibDate.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const formatTimeForList = (dateString: string): string => {
    const utcDate = new Date(dateString);
    const wibDate = new Date(utcDate.getTime() + 7 * 60 * 60 * 1000); // +7 jam untuk WIB
    const now = new Date();
    const diffInMs = now.getTime() - utcDate.getTime();
    const diffInHours = Math.floor(diffInMs / 3600000);
    const diffInDays = Math.floor(diffInMs / 86400000);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInMs / 60000);
      return `${diffInMinutes} menit lalu`;
    }
    if (diffInHours < 24) {
      const hours = wibDate.getHours().toString().padStart(2, "0");
      const minutes = wibDate.getMinutes().toString().padStart(2, "0");
      return `${hours}:${minutes}`;
    }
    if (diffInDays < 7) {
      return `${diffInDays} hari lalu`;
    }
    const day = wibDate.getDate();
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "Mei",
      "Jun",
      "Jul",
      "Ags",
      "Sep",
      "Okt",
      "Nov",
      "Des",
    ];
    const month = monthNames[wibDate.getMonth()];
    return `${day} ${month}`;
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleScroll = () => {
    if (!messagesContainerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } =
      messagesContainerRef.current;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

    // Jika user scroll dekat bagian bawah (dalam 100px), enable auto-scroll
    // Jika user scroll ke atas, disable auto-scroll
    shouldAutoScrollRef.current = distanceFromBottom < 100;
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !activeChat || !user?.id) return;

    // Check block status before sending
    if (isBlocked) {
      alert(
        blockedBy === user.id
          ? "Anda telah memblokir kontak ini. Buka blokir terlebih dahulu untuk mengirim pesan."
          : "Anda diblokir oleh kontak ini dan tidak dapat mengirim pesan."
      );
      return;
    }

    const messageContent = message; // Save before clearing
    setMessage(""); // Clear input immediately for better UX

    // Enable auto-scroll ketika user mengirim pesan
    shouldAutoScrollRef.current = true;

    try {
      // Save message to database
      const { error } = await sendMessageDb(
        activeChat,
        user.id,
        messageContent
      );

      if (error) {
        throw new Error("Failed to send message");
      }

      // Don't add to local state manually - let realtime handle it
      // This prevents duplication
    } catch (error) {
      console.error("Failed to send message:", error);
      alert("Gagal mengirim pesan. Silakan coba lagi.");
      // Restore message on error
      setMessage(messageContent);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getMessagePreview = (
    content: string
  ): { type: string; text: string } => {
    // Check if message contains image
    if (content.startsWith("[IMAGE]")) {
      return { type: "image", text: "Foto" };
    }

    // Check if message contains file
    if (content.startsWith("[FILE]")) {
      const [fileName] = content.replace("[FILE]", "").split("|");
      return { type: "file", text: fileName };
    }

    // Regular text message
    return { type: "text", text: content };
  };

  const renderMessageContent = (content: string) => {
    // Check if message contains image
    if (content.startsWith("[IMAGE]")) {
      const imageUrl = content.replace("[IMAGE]", "");
      return (
        <div
          onClick={() => {
            setSelectedImage(imageUrl);
            setImageModalOpen(true);
          }}
          className="cursor-pointer">
          <img
            src={imageUrl}
            alt="Shared image"
            className="max-w-full rounded-lg hover:opacity-90 transition-opacity"
            style={{ maxHeight: "300px" }}
          />
        </div>
      );
    }

    // Check if message contains file
    if (content.startsWith("[FILE]")) {
      const [fileName, fileUrl] = content.replace("[FILE]", "").split("|");
      return (
        <div
          onClick={async (e) => {
            e.preventDefault();
            try {
              // Fetch file as blob
              const response = await fetch(fileUrl);
              const blob = await response.blob();

              // Create download link
              const url = window.URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.href = url;
              link.download = fileName;
              document.body.appendChild(link);
              link.click();

              // Cleanup
              document.body.removeChild(link);
              window.URL.revokeObjectURL(url);
            } catch (error) {
              console.error("Error downloading file:", error);
              alert("Gagal mengunduh file. Silakan coba lagi.");
            }
          }}
          className="flex items-center gap-2 p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors cursor-pointer">
          <Paperclip className="w-5 h-5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{fileName}</p>
            <p className="text-xs opacity-70">Klik untuk download</p>
          </div>
        </div>
      );
    }

    // Regular text message
    return <p className="text-sm break-words leading-relaxed">{content}</p>;
  };

  const handleFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "file" | "image"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert("Ukuran file terlalu besar. Maksimal 10MB");
      return;
    }

    // Validate file type for images
    if (type === "image" && !file.type.startsWith("image/")) {
      alert("Hanya file gambar yang diperbolehkan");
      return;
    }

    setSelectedFile(file);
    handleUploadFile(file);
  };

  const handleUploadFile = async (file: File) => {
    if (!activeChat || !user?.id || isBlocked) return;

    // Enable auto-scroll ketika user mengirim file
    shouldAutoScrollRef.current = true;

    setUploadingFile(true);
    try {
      // Upload file to Supabase Storage
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `chat-files/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("attachments")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("attachments")
        .getPublicUrl(filePath);

      // Send message with file URL
      const messageContent = file.type.startsWith("image/")
        ? `[IMAGE]${urlData.publicUrl}`
        : `[FILE]${file.name}|${urlData.publicUrl}`;

      const { error } = await sendMessageDb(
        activeChat,
        user.id,
        messageContent
      );

      if (error) throw error;

      setSelectedFile(null);
    } catch (error) {
      console.error("Failed to upload file:", error);
      alert("Gagal mengupload file. Silakan coba lagi.");
    } finally {
      setUploadingFile(false);
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = "";
      if (imageInputRef.current) imageInputRef.current.value = "";
    }
  };

  const handleDeleteChat = async () => {
    if (!activeChat || !confirm("Apakah Anda yakin ingin menghapus chat ini?"))
      return;

    try {
      // Delete all messages in conversation
      await supabase
        .from("messages")
        .delete()
        .eq("conversation_id", activeChat);

      // Optionally delete conversation
      await supabase.from("conversations").delete().eq("id", activeChat);

      setActiveChat(null);
      setShowMenu(false);
      await loadConversations();
      alert("Chat berhasil dihapus");
    } catch (error) {
      console.error("Error deleting chat:", error);
      alert("Gagal menghapus chat");
    }
  };

  const handleBlockUser = async () => {
    if (!activeContact || !activeChat || !otherUserId || !user?.id) return;

    if (isBlocked) {
      // Unblock user
      if (!confirm(`Buka blokir ${activeContact.name}?`)) return;

      try {
        const { error } = await supabase
          .from("blocked_users")
          .delete()
          .or(
            `and(blocker_id.eq.${user.id},blocked_id.eq.${otherUserId}),and(blocker_id.eq.${otherUserId},blocked_id.eq.${user.id})`
          );

        if (error) throw error;

        setIsBlocked(false);
        setBlockedBy(null);
        setShowMenu(false);
        // Auto refresh block status
        setTimeout(() => checkBlockStatus(), 500);
        alert("User berhasil dibuka blokirnya");
      } catch (error) {
        console.error("Error unblocking user:", error);
        alert("Gagal membuka blokir user");
      }
    } else {
      // Block user
      if (!confirm(`Blokir ${activeContact.name}?`)) return;

      try {
        console.log("[WEB] Blocking user:", {
          blocker_id: user.id,
          blocked_id: otherUserId,
        });

        // Use upsert to handle if block already exists
        const { data, error } = await supabase
          .from("blocked_users")
          .upsert(
            {
              blocker_id: user.id,
              blocked_id: otherUserId,
            },
            {
              onConflict: "blocker_id,blocked_id",
            }
          )
          .select();

        console.log("[WEB] Block upsert result:", data);
        console.log("[WEB] Block upsert error:", error);

        if (error) throw error;

        setIsBlocked(true);
        setBlockedBy(user.id);
        setShowMenu(false);
        // Auto refresh block status
        setTimeout(() => checkBlockStatus(), 500);
        alert("User berhasil diblokir");
      } catch (error) {
        console.error("[WEB] Error blocking user:", error);
        alert("Gagal memblokir user: " + (error as any).message);
      }
    }
  };

  const handleClearChat = async () => {
    if (!activeChat || !confirm("Hapus semua pesan dari chat ini?")) return;

    try {
      await supabase
        .from("messages")
        .delete()
        .eq("conversation_id", activeChat);

      setMessages((prev) => ({
        ...prev,
        [activeChat]: [],
      }));

      setShowMenu(false);
      await loadConversations();
      alert("Pesan berhasil dihapus");
    } catch (error) {
      console.error("Error clearing chat:", error);
      alert("Gagal menghapus pesan");
    }
  };

  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeContact = contacts.find((c) => c.id === activeChat);
  const activeMessages = activeChat ? messages[activeChat] || [] : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-amber-900">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors group">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Kembali</span>
        </button>

        {/* Chat Container */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden shadow-2xl">
          <div className="flex h-[calc(100vh-200px)] relative">
            {/* Sidebar - Contact List */}
            <div
              className={`${
                activeChat ? "hidden md:flex" : "flex"
              } w-full md:w-96 border-r border-white/10 flex-col bg-slate-800/50`}>
              {/* Search Header */}
              <div className="p-4 border-b border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <MessageCircle className="w-6 h-6 text-blue-400" />
                  <h2 className="text-xl font-bold text-white">Pesan</h2>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari kontak..."
                    className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Contact List */}
              <div className="flex-1 overflow-y-auto">
                {loading ? (
                  <div className="p-8 text-center text-gray-400">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-3"></div>
                    <p>Memuat percakapan...</p>
                  </div>
                ) : filteredContacts.length === 0 ? (
                  <div className="p-8 text-center text-gray-400">
                    <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Tidak ada kontak ditemukan</p>
                  </div>
                ) : (
                  filteredContacts.map((contact) => (
                    <button
                      key={contact.id}
                      onClick={() => {
                        setActiveChat(contact.id);
                      }}
                      className={`w-full p-4 hover:bg-slate-700/50 transition-colors border-b border-white/5 text-left ${
                        activeChat === contact.id ? "bg-slate-700/70" : ""
                      } ${contact.unread > 0 ? "bg-slate-700/30" : ""}`}>
                      <div className="flex items-start gap-3">
                        <div className="relative flex-shrink-0">
                          {contact.avatar ? (
                            <img
                              src={contact.avatar}
                              alt={contact.name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                              {contact.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          {contact.online && (
                            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-slate-800 rounded-full animate-pulse"></span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4
                              className={`truncate ${
                                contact.unread > 0
                                  ? "font-bold text-white"
                                  : "font-semibold text-white/80"
                              }`}>
                              {contact.name}
                            </h4>
                            <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                              {contact.time}
                            </span>
                          </div>
                          {contact.carInfo && (
                            <p className="text-xs text-blue-400 mb-1 truncate flex items-center gap-1">
                              🚗 {contact.carInfo}
                            </p>
                          )}
                          <div className="flex items-center justify-between">
                            <div
                              className={`flex items-center gap-1.5 text-sm truncate flex-1 ${
                                contact.unread > 0
                                  ? "font-semibold text-white"
                                  : "text-gray-400"
                              }`}>
                              {contact.lastMessageType === "image" && (
                                <ImageIcon className="w-4 h-4 flex-shrink-0" />
                              )}
                              {contact.lastMessageType === "file" && (
                                <Paperclip className="w-4 h-4 flex-shrink-0" />
                              )}
                              <span className="truncate">
                                {contact.lastMessage}
                              </span>
                            </div>
                            {contact.unread > 0 && (
                              <span className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full min-w-[22px] h-6 px-2 flex items-center justify-center font-bold ml-2 flex-shrink-0 shadow-lg shadow-red-500/50 ring-2 ring-red-400/30">
                                {contact.unread > 9 ? "9+" : contact.unread}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Main Chat Area */}
            <div
              className={`${
                activeChat ? "flex" : "hidden md:flex"
              } flex-1 flex-col bg-slate-900/30`}>
              {activeChat && activeContact ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-white/10 bg-slate-800/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {/* Back button untuk mobile */}
                        <button
                          onClick={() => setActiveChat(null)}
                          className="md:hidden p-2 hover:bg-slate-700 rounded-full transition-colors text-white">
                          <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div className="relative">
                          {activeContact.avatar ? (
                            <img
                              src={activeContact.avatar}
                              alt={activeContact.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                              {activeContact.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          {activeContact.online && (
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-slate-800 rounded-full animate-pulse"></span>
                          )}
                        </div>
                        <div>
                          <h3 className="font-bold text-white">
                            {activeContact.name}
                          </h3>
                          <p
                            className={`text-xs font-medium flex items-center gap-1 ${
                              activeContact.online
                                ? "text-green-400"
                                : "text-gray-400"
                            }`}>
                            {activeContact.online && (
                              <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            )}
                            {activeContact.online ? "Online" : "Offline"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 relative">
                        <button
                          onClick={() => setShowMenu(!showMenu)}
                          className="p-2 hover:bg-slate-700 rounded-full transition-colors text-gray-400">
                          <MoreVertical className="w-5 h-5" />
                        </button>

                        {/* Dropdown Menu */}
                        {showMenu && (
                          <div className="absolute right-0 top-12 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50">
                            <button
                              onClick={handleClearChat}
                              className="w-full px-4 py-3 text-left hover:bg-slate-700 text-gray-300 flex items-center gap-3 transition-colors">
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                              Hapus Pesan
                            </button>
                            <button
                              onClick={handleDeleteChat}
                              className="w-full px-4 py-3 text-left hover:bg-slate-700 text-red-400 flex items-center gap-3 transition-colors">
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                              Hapus Chat
                            </button>
                            {(!isBlocked || blockedBy === user?.id) && (
                              <button
                                onClick={handleBlockUser}
                                className={`w-full px-4 py-3 text-left hover:bg-slate-700 ${
                                  isBlocked ? "text-green-400" : "text-red-400"
                                } flex items-center gap-3 transition-colors rounded-b-lg`}>
                                {isBlocked ? (
                                  <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                  </svg>
                                ) : (
                                  <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                                    />
                                  </svg>
                                )}
                                {isBlocked ? "Buka Blokir" : "Blokir Pengguna"}
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Messages Area */}
                  <div
                    ref={messagesContainerRef}
                    onScroll={handleScroll}
                    className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 md:space-y-4 bg-gradient-to-b from-slate-900/20 to-slate-900/40">
                    {activeMessages.length === 0 ? (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        <div className="text-center p-8">
                          <MessageCircle className="w-16 h-16 mx-auto mb-3 opacity-30" />
                          <p className="text-lg">Belum ada pesan</p>
                          <p className="text-sm mt-1">
                            Mulai percakapan sekarang!
                          </p>
                        </div>
                      </div>
                    ) : (
                      activeMessages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${
                            msg.isOwn ? "justify-end" : "justify-start"
                          } animate-fade-in`}>
                          <div
                            className={`max-w-[85%] md:max-w-[70%] relative ${
                              msg.isOwn
                                ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl rounded-br-md"
                                : msg.isRead
                                ? "bg-slate-700 text-white rounded-2xl rounded-bl-md"
                                : "bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-2xl rounded-bl-md shadow-xl shadow-amber-500/20 animate-pulse"
                            } px-4 py-3 shadow-lg`}>
                            {!msg.isOwn && !msg.isRead && (
                              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg animate-bounce">
                                NEW
                              </div>
                            )}
                            {renderMessageContent(msg.content)}
                            <div className="flex items-center justify-between mt-1 gap-2">
                              <p
                                className={`text-xs ${
                                  msg.isOwn
                                    ? "text-blue-100"
                                    : msg.isRead
                                    ? "text-gray-400"
                                    : "text-amber-100"
                                }`}>
                                {msg.time}
                              </p>
                              {msg.isOwn && (
                                <div className="flex items-center gap-1">
                                  {msg.isRead ? (
                                    <span className="text-[10px] text-blue-100 italic">
                                      Read
                                    </span>
                                  ) : msg.isDelivered ? (
                                    <span className="text-xs text-blue-100">
                                      ✓✓
                                    </span>
                                  ) : (
                                    <span className="text-xs text-blue-100">
                                      ✓
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input Area */}
                  <div className="p-3 md:p-4 border-t border-white/10 bg-slate-800/70 backdrop-blur-sm">
                    <div className="flex items-end gap-2">
                      <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        onChange={(e) => handleFileSelect(e, "file")}
                        disabled={isBlocked || uploadingFile}
                      />
                      <input
                        ref={imageInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileSelect(e, "image")}
                        disabled={isBlocked || uploadingFile}
                      />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isBlocked || uploadingFile}
                        className="p-2 hover:bg-slate-700 rounded-full transition-colors text-gray-400 mb-1 disabled:opacity-50 disabled:cursor-not-allowed">
                        <Paperclip className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => imageInputRef.current?.click()}
                        disabled={isBlocked || uploadingFile}
                        className="p-2 hover:bg-slate-700 rounded-full transition-colors text-gray-400 mb-1 disabled:opacity-50 disabled:cursor-not-allowed">
                        <ImageIcon className="w-5 h-5" />
                      </button>
                      <div className="flex-1">
                        {isBlocked && (
                          <div className="mb-2 px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm flex items-center gap-2">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                              />
                            </svg>
                            {blockedBy === user?.id
                              ? "Anda memblokir kontak ini. Klik menu untuk membuka blokir."
                              : "Anda diblokir kontak ini."}
                          </div>
                        )}
                        <textarea
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder={
                            isBlocked
                              ? "Tidak dapat mengirim pesan"
                              : "Ketik pesan..."
                          }
                          rows={1}
                          disabled={isBlocked}
                          className="w-full px-3 md:px-4 py-2.5 md:py-3 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                      </div>
                      <button
                        onClick={handleSendMessage}
                        disabled={!message.trim() || isBlocked}
                        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white p-2.5 md:p-3 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-blue-500/50 mb-1">
                        <Send className="w-4 h-4 md:w-5 md:h-5" />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <MessageCircle className="w-20 h-20 mx-auto mb-4 opacity-50" />
                    <h3 className="text-xl font-bold mb-2 text-white">
                      Pilih Percakapan
                    </h3>
                    <p>Pilih kontak untuk memulai chat</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Image Lightbox Modal with Zoom */}
        {imageModalOpen && selectedImage && (
          <div
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => {
              setImageModalOpen(false);
              setImageZoom(1);
              setImagePosition({ x: 0, y: 0 });
            }}>
            {/* Close Button */}
            <button
              onClick={() => {
                setImageModalOpen(false);
                setImageZoom(1);
                setImagePosition({ x: 0, y: 0 });
              }}
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Zoom Controls */}
            <div className="absolute top-4 left-4 flex items-center gap-3 bg-black/70 px-4 py-2 rounded-full z-10">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setImageZoom((prev) => Math.max(prev - 0.25, 0.5));
                }}
                className="text-white hover:text-blue-400 transition-colors">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 12H4"
                  />
                </svg>
              </button>
              <span className="text-white font-medium min-w-[60px] text-center">
                {Math.round(imageZoom * 100)}%
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setImageZoom((prev) => Math.min(prev + 0.25, 3));
                }}
                className="text-white hover:text-blue-400 transition-colors">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setImageZoom(1);
                }}
                className="text-white hover:text-blue-400 transition-colors ml-2">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </button>
            </div>

            {/* Image Container with Drag */}
            <div
              className="relative overflow-hidden max-w-full max-h-full cursor-move"
              onClick={(e) => e.stopPropagation()}
              onWheel={(e) => {
                e.preventDefault();
                const delta = e.deltaY > 0 ? -0.1 : 0.1;
                setImageZoom((prev) =>
                  Math.max(0.5, Math.min(prev + delta, 3))
                );
              }}
              onMouseDown={(e) => {
                if (e.button === 2) {
                  // Right click
                  e.preventDefault();
                  setIsDragging(true);
                  setDragStart({
                    x: e.clientX - imagePosition.x,
                    y: e.clientY - imagePosition.y,
                  });
                }
              }}
              onMouseMove={(e) => {
                if (isDragging) {
                  e.preventDefault();
                  setImagePosition({
                    x: e.clientX - dragStart.x,
                    y: e.clientY - dragStart.y,
                  });
                }
              }}
              onMouseUp={() => {
                setIsDragging(false);
              }}
              onMouseLeave={() => {
                setIsDragging(false);
              }}
              onContextMenu={(e) => {
                e.preventDefault(); // Disable right-click menu
              }}>
              <img
                src={selectedImage}
                alt="Full size"
                className="rounded-lg transition-transform select-none"
                draggable={false}
                style={{
                  transform: `scale(${imageZoom}) translate(${imagePosition.x}px, ${imagePosition.y}px)`,
                  maxHeight: "90vh",
                  maxWidth: "90vw",
                  objectFit: "contain",
                  pointerEvents: "none",
                }}
              />
            </div>

            {/* Download Button */}
            <a
              href={selectedImage || ""}
              download
              onClick={(e) => e.stopPropagation()}
              className="absolute bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors z-10">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Download
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
