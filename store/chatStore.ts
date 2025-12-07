import { create } from "zustand";
import { RealtimeChannel } from "@supabase/supabase-js";
import {
  subscribeToMessages,
  subscribeToUserConversations,
  subscribeToMessageUpdates,
  unsubscribeAll,
} from "@/lib/realtime";
// import { db } from "@/lib/prisma"; // Prisma removed

interface ChatContact {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  avatar?: string;
  online?: boolean;
}

interface ChatMessage {
  id: string;
  senderId: string;
  content: string;
  time: string;
  isOwn: boolean;
  isRead?: boolean;
}

interface ChatStore {
  contacts: ChatContact[];
  messages: Record<string, ChatMessage[]>;
  activeChat: string | null;
  isOpen: boolean;
  realtimeChannels: RealtimeChannel[];
  currentUserId: string | null;

  // Actions
  setActiveChat: (chatId: string | null) => void;
  setIsOpen: (isOpen: boolean) => void;
  addMessage: (chatId: string, message: ChatMessage) => void;
  sendMessage: (
    conversationId: string,
    content: string,
    senderId: string
  ) => Promise<void>;
  markAsRead: (chatId: string) => void;
  updateLastMessage: (
    chatId: string,
    lastMessage: string,
    time: string
  ) => void;

  // Realtime actions
  initializeRealtime: (userId: string) => void;
  cleanupRealtime: () => void;
  subscribeToConversation: (
    conversationId: string,
    currentUserId: string
  ) => void;

  // Data loading
  setContacts: (contacts: ChatContact[]) => void;
  setMessages: (chatId: string, messages: ChatMessage[]) => void;
  loadConversations: (userId: string) => Promise<void>;
  loadMessages: (conversationId: string) => Promise<void>;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  contacts: [],
  messages: {},
  activeChat: null,
  isOpen: false,
  realtimeChannels: [],
  currentUserId: null,

  setActiveChat: (chatId) => {
    set({ activeChat: chatId });

    // Subscribe to this conversation if not already subscribed
    if (chatId && get().currentUserId) {
      get().subscribeToConversation(chatId, get().currentUserId!);
    }
  },

  setIsOpen: (isOpen) => set({ isOpen }),

  addMessage: (chatId, message) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [chatId]: [...(state.messages[chatId] || []), message],
      },
    })),

  sendMessage: async (conversationId, content, senderId) => {
    try {
      // TODO: Implement without Prisma - use Supabase directly
      console.warn("sendMessage disabled - Prisma removed");
      /*
      // Save message to database
      const message = await db.message.create({
        conversationId,
        senderId,
        content,
      });

      // Add to local state for immediate UI update
      const chatMessage: ChatMessage = {
        id: message.id,
        senderId: message.senderId,
        content: message.content,
        time: new Date(message.createdAt).toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isOwn: message.senderId === senderId,
        isRead: false,
      };

      get().addMessage(conversationId, chatMessage);
      get().updateLastMessage(conversationId, content, chatMessage.time);

      // Increment message count in car statistics
      const conversation = await db.conversation.findById(conversationId);
      if (conversation) {
        await db.carStatistics.increment(conversation.carId, 'messages');
      }
      */
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  },

  loadMessages: async (conversationId) => {
    try {
      // TODO: Implement without Prisma - use Supabase directly
      console.warn("loadMessages disabled - Prisma removed");
      return;
      /*
      const messages = await db.message.findByConversation(conversationId);
      const currentUserId = get().currentUserId;
      
      const chatMessages: ChatMessage[] = messages.map((msg: any) => ({
        id: msg.id,
        senderId: msg.senderId,
        content: msg.content,
        time: new Date(msg.createdAt).toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isOwn: msg.senderId === currentUserId,
        isRead: msg.isRead,
      }));

      get().setMessages(conversationId, chatMessages);
      */
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  },

  markAsRead: (chatId) =>
    set((state) => ({
      contacts: state.contacts.map((contact) =>
        contact.id === chatId ? { ...contact, unread: 0 } : contact
      ),
    })),

  updateLastMessage: (chatId, lastMessage, time) =>
    set((state) => ({
      contacts: state.contacts.map((contact) =>
        contact.id === chatId ? { ...contact, lastMessage, time } : contact
      ),
    })),

  setContacts: (contacts) => set({ contacts }),

  setMessages: (chatId, messages) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [chatId]: messages,
      },
    })),

  initializeRealtime: (userId) => {
    set({ currentUserId: userId });

    // Subscribe to all user conversations
    const conversationChannels = subscribeToUserConversations(
      userId,
      (payload) => {
        // Handle conversation updates
        console.log("Conversation updated:", payload);
        // Reload conversations
        get().loadConversations(userId);
      }
    );

    set((state) => ({
      realtimeChannels: [...state.realtimeChannels, ...conversationChannels],
    }));
  },

  subscribeToConversation: (conversationId, currentUserId) => {
    const state = get();

    // Check if already subscribed
    const alreadySubscribed = state.realtimeChannels.some(
      (ch) => ch.topic === `conversation:${conversationId}`
    );

    if (alreadySubscribed) return;

    // Subscribe to new messages
    const messageChannel = subscribeToMessages(conversationId, (newMessage) => {
      const isOwnMessage = newMessage.sender_id === currentUserId;

      const message: ChatMessage = {
        id: newMessage.id,
        senderId: newMessage.sender_id,
        content: newMessage.content,
        time: new Date(newMessage.created_at).toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isOwn: isOwnMessage,
        isRead: newMessage.is_read,
      };

      // Add message to store
      get().addMessage(conversationId, message);

      // Update last message in contacts
      get().updateLastMessage(conversationId, newMessage.content, message.time);

      // If not own message, increment unread
      if (!isOwnMessage) {
        set((state) => ({
          contacts: state.contacts.map((contact) =>
            contact.id === conversationId
              ? { ...contact, unread: contact.unread + 1 }
              : contact
          ),
        }));
      }
    });

    // Subscribe to message updates (read status)
    const updateChannel = subscribeToMessageUpdates(
      conversationId,
      (updatedMessage) => {
        set((state) => ({
          messages: {
            ...state.messages,
            [conversationId]: state.messages[conversationId]?.map((msg) =>
              msg.id === updatedMessage.id
                ? { ...msg, isRead: updatedMessage.is_read }
                : msg
            ),
          },
        }));
      }
    );

    set((state) => ({
      realtimeChannels: [
        ...state.realtimeChannels,
        messageChannel,
        updateChannel,
      ],
    }));
  },

  cleanupRealtime: async () => {
    const { realtimeChannels } = get();
    await unsubscribeAll(realtimeChannels);
    set({ realtimeChannels: [], currentUserId: null });
  },

  loadConversations: async (userId) => {
    try {
      // This would be replaced with actual Prisma query
      // For now, keeping mock data structure
      // In production, fetch from: db.conversation.findByUser(userId)
      console.log("Loading conversations for user:", userId);

      // TODO: Replace with actual Prisma query
      // const conversations = await db.conversation.findByUser(userId);
      // const contacts = conversations.map(conv => ({
      //   id: conv.id,
      //   name: conv.buyer.fullName,
      //   lastMessage: conv.messages[0]?.content || '',
      //   time: formatTime(conv.messages[0]?.createdAt),
      //   unread: countUnread(conv.messages, userId),
      //   avatar: conv.buyer.avatarUrl,
      // }));
      // set({ contacts });
    } catch (error) {
      console.error("Failed to load conversations:", error);
    }
  },
}));
