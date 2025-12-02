"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

interface TextCellProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  isLink?: boolean;
}

export function TextCell({
  value,
  onChange,
  placeholder = "",
  className,
  isLink = false,
}: TextCellProps) {
  const [editing, setEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const commit = useCallback(() => {
    setEditing(false);
    if (localValue !== value) {
      onChange(localValue);
    }
  }, [localValue, value, onChange]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      commit();
    } else if (e.key === "Escape") {
      setLocalValue(value);
      setEditing(false);
    }
  };

  if (editing) {
    return (
      <input
        ref={inputRef}
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onBlur={commit}
        onKeyDown={handleKeyDown}
        className={cn(
          "w-full bg-transparent border-none outline-none px-2 py-1 text-sm",
          "focus:ring-2 focus:ring-violet-500 focus:ring-offset-1 rounded",
          className
        )}
        placeholder={placeholder}
      />
    );
  }

  const displayValue = localValue || placeholder;
  const isEmpty = !localValue;

  if (isLink && localValue) {
    return (
      <div
        className={cn(
          "px-2 py-1 cursor-pointer min-h-[28px] hover:bg-muted/50 rounded text-sm",
          className
        )}
        onClick={() => setEditing(true)}
      >
        <a
          href={localValue}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          {localValue}
        </a>
      </div>
    );
  }

  return (
    <div
      onClick={() => setEditing(true)}
      className={cn(
        "px-2 py-1 cursor-pointer min-h-[28px] hover:bg-muted/50 rounded text-sm",
        isEmpty && "text-muted-foreground",
        className
      )}
    >
      {displayValue}
    </div>
  );
}

