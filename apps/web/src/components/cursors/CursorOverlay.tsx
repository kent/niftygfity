"use client";

import { useEffect, useCallback } from "react";
import { useCursorChannel, CursorPosition } from "@/hooks";

interface CursorOverlayProps {
  holidayId: number;
}

function getInitials(cursor: CursorPosition): string {
  if (cursor.first_name) {
    const first = cursor.first_name[0];
    const last = cursor.last_name?.[0] || "";
    return (first + last).toUpperCase();
  }
  return "?";
}

function getName(cursor: CursorPosition): string {
  if (cursor.first_name || cursor.last_name) {
    return [cursor.first_name, cursor.last_name].filter(Boolean).join(" ");
  }
  return "Anonymous";
}

// Distinct colors for each cursor on the page
const CURSOR_COLORS = [
  "bg-violet-500",
  "bg-emerald-500",
  "bg-orange-500",
  "bg-cyan-500",
  "bg-pink-500",
  "bg-amber-500",
  "bg-teal-500",
  "bg-rose-500",
  "bg-blue-500",
  "bg-fuchsia-500",
];

function getColor(index: number): string {
  return CURSOR_COLORS[index % CURSOR_COLORS.length];
}

function Cursor({ cursor, colorIndex }: { cursor: CursorPosition; colorIndex: number }) {
  const color = getColor(colorIndex);
  const name = getName(cursor);

  return (
    <div
      className="pointer-events-none fixed z-[9999] transition-all duration-75 ease-out"
      style={{ left: cursor.x, top: cursor.y }}
    >
      {/* Cursor arrow */}
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        className="drop-shadow-md"
      >
        <path
          d="M5.65376 12.4563L5.65376 3.05376L14.4563 12.4563H9.65376L9.65376 17.6538L5.65376 12.4563Z"
          fill="currentColor"
          className={color.replace("bg-", "text-")}
        />
        <path
          d="M5.65376 12.4563L5.65376 3.05376L14.4563 12.4563H9.65376L9.65376 17.6538L5.65376 12.4563Z"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* Name tag */}
      <div
        className={`absolute left-4 top-4 flex items-center gap-1.5 rounded-full ${color} px-2 py-1 shadow-lg`}
      >
        {cursor.image_url ? (
          <img
            src={cursor.image_url}
            alt={name}
            className="h-4 w-4 rounded-full object-cover"
          />
        ) : (
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white/20 text-[10px] font-medium text-white">
            {getInitials(cursor)}
          </span>
        )}
        <span className="max-w-24 truncate text-xs font-medium text-white">
          {name}
        </span>
      </div>
    </div>
  );
}

export function CursorOverlay({ holidayId }: CursorOverlayProps) {
  const { cursors, sendCursorPosition } = useCursorChannel(holidayId);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      sendCursorPosition(e.clientX, e.clientY);
    },
    [sendCursorPosition]
  );

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  if (cursors.length === 0) return null;

  return (
    <>
      {cursors.map((cursor, index) => (
        <Cursor key={cursor.clerk_user_id} cursor={cursor} colorIndex={index} />
      ))}
    </>
  );
}
