import { View, Text, TouchableOpacity } from "react-native";
import type { Holiday } from "@niftygifty/types";
import { useTheme } from "@/lib/theme";

interface GiftListCardProps {
  item: Holiday;
  onPress: () => void;
}

export function GiftListCard({ item, onPress }: GiftListCardProps) {
  const { colors, isDark } = useTheme();

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return null;
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: colors.card,
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: colors.border,
      }}
      activeOpacity={0.7}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
        <View style={{ flex: 1 }}>
          <Text style={{ color: colors.text, fontSize: 18, fontWeight: "600", marginBottom: 4 }}>
            {item.name}
          </Text>
          {item.date ? (
            <Text style={{ color: colors.textTertiary, fontSize: 14 }}>
              {formatDate(item.date)}
            </Text>
          ) : null}
        </View>

        {item.completed ? (
          <View
            style={{
              backgroundColor: isDark ? "#065f46" : "#dcfce7",
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 4,
            }}
          >
            <Text style={{ color: isDark ? "#6ee7b7" : "#15803d", fontSize: 12, fontWeight: "500" }}>Done</Text>
          </View>
        ) : null}
      </View>

      <View style={{ flexDirection: "row", marginTop: 12, gap: 16 }}>
        {item.collaborator_count > 0 ? (
          <Text style={{ color: colors.muted, fontSize: 13 }}>
            {item.collaborator_count} collaborator{item.collaborator_count > 1 ? "s" : ""}
          </Text>
        ) : null}

        {!item.is_owner ? (
          <View
            style={{
              backgroundColor: isDark ? "#1e1b4b" : "#f3e8ff",
              paddingHorizontal: 6,
              paddingVertical: 2,
              borderRadius: 4,
            }}
          >
            <Text style={{ color: isDark ? "#a78bfa" : "#7c3aed", fontSize: 12 }}>Shared</Text>
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}
