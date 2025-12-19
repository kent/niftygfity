"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { useCable } from "./use-cable";
import type { Subscription } from "@rails/actioncable";

export interface CursorPosition {
  user_id: number;
  clerk_user_id: string;
  first_name: string | null;
  last_name: string | null;
  image_url: string | null;
  x: number;
  y: number;
  timestamp: number;
}

const THROTTLE_MS = 50;
const CURSOR_TIMEOUT_MS = 5000;

export function useCursorChannel(holidayId: number | null) {
  const { getConsumer, isConnected } = useCable();
  const { user } = useUser();
  const subscriptionRef = useRef<Subscription | null>(null);
  const [cursors, setCursors] = useState<Map<string, CursorPosition>>(new Map());
  const lastSentRef = useRef(0);

  // Clean up stale cursors
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setCursors((prev) => {
        const next = new Map(prev);
        let changed = false;
        for (const [id, cursor] of next) {
          if (now - cursor.timestamp > CURSOR_TIMEOUT_MS) {
            next.delete(id);
            changed = true;
          }
        }
        return changed ? next : prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Subscribe to channel
  useEffect(() => {
    const consumer = getConsumer();
    if (!consumer || !holidayId || !isConnected) return;

    subscriptionRef.current = consumer.subscriptions.create(
      { channel: "CursorChannel", holiday_id: holidayId },
      {
        received(raw: unknown) {
          const data = raw as Omit<CursorPosition, "timestamp">;
          // Ignore own cursor
          if (data.clerk_user_id === user?.id) return;

          setCursors((prev) => {
            const next = new Map(prev);
            next.set(data.clerk_user_id, { ...data, timestamp: Date.now() });
            return next;
          });
        },
      }
    );

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }
      setCursors(new Map());
    };
  }, [getConsumer, holidayId, isConnected, user?.id]);

  const sendCursorPosition = useCallback(
    (x: number, y: number) => {
      const now = Date.now();
      if (now - lastSentRef.current < THROTTLE_MS) return;
      if (!subscriptionRef.current) return;

      lastSentRef.current = now;
      subscriptionRef.current.perform("move", { x, y });
    },
    []
  );

  return { cursors: Array.from(cursors.values()), sendCursorPosition };
}
