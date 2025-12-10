"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { createConsumer, Consumer } from "@rails/actioncable";

const getWsUrl = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
  return apiUrl.replace(/^http/, "ws") + "/cable";
};

export function useCable() {
  const { getToken, isSignedIn } = useAuth();
  const consumerRef = useRef<Consumer | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!isSignedIn) return;

    let mounted = true;

    async function connect() {
      const token = await getToken();
      if (!token || !mounted) return;

      const wsUrl = `${getWsUrl()}?token=${encodeURIComponent(token)}`;
      consumerRef.current = createConsumer(wsUrl);
      setIsConnected(true);
    }

    connect();

    return () => {
      mounted = false;
      if (consumerRef.current) {
        consumerRef.current.disconnect();
        consumerRef.current = null;
        setIsConnected(false);
      }
    };
  }, [isSignedIn, getToken]);

  return { consumer: consumerRef.current, isConnected };
}
