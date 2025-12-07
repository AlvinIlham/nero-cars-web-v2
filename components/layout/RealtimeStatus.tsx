"use client";

import { useEffect, useState } from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function RealtimeStatus() {
  const [isConnected, setIsConnected] = useState(false);
  const [showStatus, setShowStatus] = useState(false);

  useEffect(() => {
    // Check realtime connection status
    const checkConnection = () => {
      const channels = supabase.getChannels();
      const hasActiveChannels = channels.some(ch => ch.state === 'joined');
      setIsConnected(hasActiveChannels);
    };

    // Check immediately
    checkConnection();

    // Check every 5 seconds
    const interval = setInterval(checkConnection, 5000);

    // Show status for 3 seconds when component mounts
    setShowStatus(true);
    const timer = setTimeout(() => setShowStatus(false), 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  // Show status on connection change
  useEffect(() => {
    setShowStatus(true);
    const timer = setTimeout(() => setShowStatus(false), 2000);
    return () => clearTimeout(timer);
  }, [isConnected]);

  if (!showStatus) return null;

  return (
    <div
      className={`fixed top-20 right-6 z-50 px-4 py-2 rounded-lg shadow-lg transition-all duration-300 animate-slide-down ${
        isConnected
          ? 'bg-green-500 text-white'
          : 'bg-red-500 text-white'
      }`}
    >
      <div className="flex items-center gap-2">
        {isConnected ? (
          <>
            <Wifi className="w-4 h-4 animate-pulse" />
            <span className="text-sm font-medium">Realtime Connected</span>
          </>
        ) : (
          <>
            <WifiOff className="w-4 h-4" />
            <span className="text-sm font-medium">Realtime Disconnected</span>
          </>
        )}
      </div>
    </div>
  );
}
