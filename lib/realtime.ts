/**
 * Realtime Utilities for Supabase
 * Handles real-time subscriptions for messages, notifications, and updates
 */

import { supabase } from './supabase'
import { RealtimeChannel } from '@supabase/supabase-js'

type MessageCallback = (payload: any) => void
type NotificationCallback = (payload: any) => void
type ConversationCallback = (payload: any) => void

/**
 * Subscribe to new messages in a conversation
 */
export const subscribeToMessages = (
  conversationId: string,
  callback: MessageCallback
): RealtimeChannel => {
  const channel = supabase
    .channel(`conversation:${conversationId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`,
      },
      (payload) => {
        callback(payload.new)
      }
    )
    .subscribe()

  return channel
}

/**
 * Subscribe to all conversations for a user (buyer or seller)
 */
export const subscribeToUserConversations = (
  userId: string,
  callback: ConversationCallback
): RealtimeChannel[] => {
  // Subscribe to conversations where user is buyer
  const buyerChannel = supabase
    .channel(`conversations:buyer:${userId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'conversations',
        filter: `buyer_id=eq.${userId}`,
      },
      (payload) => {
        callback(payload)
      }
    )
    .subscribe()

  // Subscribe to conversations where user is seller
  const sellerChannel = supabase
    .channel(`conversations:seller:${userId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'conversations',
        filter: `seller_id=eq.${userId}`,
      },
      (payload) => {
        callback(payload)
      }
    )
    .subscribe()

  return [buyerChannel, sellerChannel]
}

/**
 * Subscribe to notifications for a user
 */
export const subscribeToNotifications = (
  userId: string,
  callback: NotificationCallback
): RealtimeChannel => {
  const channel = supabase
    .channel(`notifications:${userId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        callback(payload.new)
      }
    )
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        callback(payload.new)
      }
    )
    .subscribe()

  return channel
}

/**
 * Subscribe to message read status updates
 */
export const subscribeToMessageUpdates = (
  conversationId: string,
  callback: MessageCallback
): RealtimeChannel => {
  const channel = supabase
    .channel(`messages:updates:${conversationId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`,
      },
      (payload) => {
        callback(payload.new)
      }
    )
    .subscribe()

  return channel
}

/**
 * Subscribe to car statistics updates (for live view counts)
 */
export const subscribeToCarStatistics = (
  carId: string,
  callback: (stats: any) => void
): RealtimeChannel => {
  const channel = supabase
    .channel(`car:stats:${carId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'car_statistics',
        filter: `car_id=eq.${carId}`,
      },
      (payload) => {
        callback(payload.new)
      }
    )
    .subscribe()

  return channel
}

/**
 * Subscribe to car updates (for real-time listing changes)
 */
export const subscribeToCar = (
  carId: string,
  callback: (car: any) => void
): RealtimeChannel => {
  const channel = supabase
    .channel(`car:${carId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'cars',
        filter: `id=eq.${carId}`,
      },
      (payload) => {
        callback(payload.new)
      }
    )
    .subscribe()

  return channel
}

/**
 * Unsubscribe from a channel
 */
export const unsubscribe = async (channel: RealtimeChannel) => {
  await supabase.removeChannel(channel)
}

/**
 * Unsubscribe from multiple channels
 */
export const unsubscribeAll = async (channels: RealtimeChannel[]) => {
  for (const channel of channels) {
    await supabase.removeChannel(channel)
  }
}

/**
 * Presence - for showing online users
 */
export const createPresenceChannel = (roomId: string, userId: string, userInfo: any) => {
  const channel = supabase.channel(`presence:${roomId}`, {
    config: {
      presence: {
        key: userId,
      },
    },
  })

  channel
    .on('presence', { event: 'sync' }, () => {
      const state = channel.presenceState()
      // Handle presence state
    })
    .on('presence', { event: 'join' }, ({ key, newPresences }) => {
      // User joined
    })
    .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
      // User left
    })
    .subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await channel.track(userInfo)
      }
    })

  return channel
}

/**
 * Broadcast - for typing indicators, etc.
 */
export const createBroadcastChannel = (roomId: string) => {
  const channel = supabase.channel(`broadcast:${roomId}`)

  return {
    channel,
    send: (event: string, payload: any) => {
      channel.send({
        type: 'broadcast',
        event,
        payload,
      })
    },
    on: (event: string, callback: (payload: any) => void) => {
      channel.on('broadcast', { event }, ({ payload }) => {
        callback(payload)
      })
    },
    subscribe: () => channel.subscribe(),
  }
}

/**
 * Typing indicator helper
 */
export const createTypingIndicator = (conversationId: string, userId: string) => {
  const broadcast = createBroadcastChannel(`conversation:${conversationId}`)

  return {
    startTyping: () => {
      broadcast.send('typing', { userId, isTyping: true })
    },
    stopTyping: () => {
      broadcast.send('typing', { userId, isTyping: false })
    },
    onTyping: (callback: (data: { userId: string; isTyping: boolean }) => void) => {
      broadcast.on('typing', callback)
    },
    subscribe: () => broadcast.subscribe(),
    unsubscribe: () => unsubscribe(broadcast.channel),
  }
}

/**
 * Helper hook for easier React integration
 */
export const realtimeHelpers = {
  // Subscribe to all user's messages
  subscribeToAllUserMessages: (userId: string, callback: MessageCallback) => {
    // This would need a custom filter or multiple subscriptions
    // For now, subscribe to conversations and then messages
    const channels: RealtimeChannel[] = []
    
    // Get all conversations for user and subscribe to each
    // This is a simplified version - in production, you'd want to batch this
    return {
      unsubscribe: () => unsubscribeAll(channels)
    }
  },

  // Batch subscribe helper
  batchSubscribe: (subscriptions: Array<() => RealtimeChannel>) => {
    const channels = subscriptions.map(fn => fn())
    return {
      channels,
      unsubscribeAll: () => unsubscribeAll(channels)
    }
  }
}

export default {
  subscribeToMessages,
  subscribeToUserConversations,
  subscribeToNotifications,
  subscribeToMessageUpdates,
  subscribeToCarStatistics,
  subscribeToCar,
  unsubscribe,
  unsubscribeAll,
  createPresenceChannel,
  createBroadcastChannel,
  createTypingIndicator,
  realtimeHelpers,
}
