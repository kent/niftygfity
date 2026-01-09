import { View, Text } from "react-native";
import { useTheme } from "@/lib/theme";

type ExchangeStatus = "draft" | "inviting" | "active" | "completed";
type ParticipantStatus = "invited" | "accepted" | "declined";

interface StatusBadgeProps {
  status: ExchangeStatus | ParticipantStatus;
  size?: "sm" | "md";
}

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const { colors, isDark } = useTheme();

  const getStatusColors = (s: ExchangeStatus | ParticipantStatus) => {
    // Exchange statuses
    if (s === "draft") {
      return { bg: isDark ? "#374151" : "#e5e7eb", text: isDark ? "#9ca3af" : "#4b5563" };
    }
    if (s === "inviting" || s === "invited") {
      return { bg: isDark ? "#78350f" : "#fef3c7", text: isDark ? "#fbbf24" : "#b45309" };
    }
    if (s === "active" || s === "accepted") {
      return { bg: isDark ? "#14532d" : "#dcfce7", text: isDark ? "#22c55e" : "#15803d" };
    }
    if (s === "completed") {
      return { bg: isDark ? "#4c1d95" : "#f3e8ff", text: isDark ? "#a78bfa" : "#7c3aed" };
    }
    if (s === "declined") {
      return { bg: isDark ? "#7f1d1d" : "#fee2e2", text: isDark ? "#f87171" : "#dc2626" };
    }
    return { bg: colors.surfaceSecondary, text: colors.textTertiary };
  };

  const statusColors = getStatusColors(status);
  const padding = size === "sm" ? { paddingHorizontal: 6, paddingVertical: 2 } : { paddingHorizontal: 8, paddingVertical: 4 };
  const fontSize = size === "sm" ? 10 : 12;

  return (
    <View
      style={{
        backgroundColor: statusColors.bg,
        borderRadius: 4,
        ...padding,
      }}
    >
      <Text
        style={{
          color: statusColors.text,
          fontSize,
          fontWeight: "600",
          textTransform: "capitalize",
        }}
      >
        {status}
      </Text>
    </View>
  );
}
