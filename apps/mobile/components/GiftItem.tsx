import { View, Text, Linking, TouchableOpacity } from "react-native";
import type { Gift } from "@niftygifty/types";
import { useTheme } from "@/lib/theme";

interface GiftItemProps {
  item: Gift;
}

export function GiftItem({ item }: GiftItemProps) {
  const { colors, isDark } = useTheme();

  const handleOpenLink = () => {
    if (item.link) {
      Linking.openURL(item.link);
    }
  };

  const formatCost = (cost: string | null) => {
    if (!cost) return null;
    const num = parseFloat(cost);
    if (isNaN(num)) return cost;
    return `$${num.toFixed(2)}`;
  };

  const getStatusColor = (statusName: string) => {
    const name = statusName.toLowerCase();
    if (name.includes("idea") || name.includes("thinking")) {
      return { bg: isDark ? "#1e1b4b" : "#f3e8ff", text: isDark ? "#a78bfa" : "#7c3aed" };
    }
    if (name.includes("bought") || name.includes("purchased")) {
      return { bg: isDark ? "#14532d" : "#dcfce7", text: isDark ? "#86efac" : "#15803d" };
    }
    if (name.includes("wrapped")) {
      return { bg: isDark ? "#164e63" : "#cffafe", text: isDark ? "#67e8f9" : "#0e7490" };
    }
    if (name.includes("given") || name.includes("delivered")) {
      return { bg: isDark ? "#065f46" : "#d1fae5", text: isDark ? "#6ee7b7" : "#059669" };
    }
    return { bg: colors.surfaceSecondary, text: colors.textTertiary };
  };

  const statusColors = getStatusColor(item.gift_status?.name || "");

  return (
    <View
      style={{
        backgroundColor: colors.card,
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: colors.border,
      }}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
        <View style={{ flex: 1 }}>
          <Text style={{ color: colors.text, fontSize: 16, fontWeight: "600", marginBottom: 4 }}>
            {item.name}
          </Text>
          {item.description ? (
            <Text style={{ color: colors.textTertiary, fontSize: 14 }} numberOfLines={2}>
              {item.description}
            </Text>
          ) : null}
        </View>

        {item.cost ? (
          <Text style={{ color: colors.primary, fontSize: 16, fontWeight: "600", marginLeft: 12 }}>
            {formatCost(item.cost)}
          </Text>
        ) : null}
      </View>

      <View style={{ flexDirection: "row", marginTop: 12, gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        {item.gift_status ? (
          <View
            style={{
              backgroundColor: statusColors.bg,
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 4,
            }}
          >
            <Text style={{ color: statusColors.text, fontSize: 12, fontWeight: "500" }}>
              {item.gift_status.name}
            </Text>
          </View>
        ) : null}

        {item.recipients && item.recipients.length > 0 ? (
          <Text style={{ color: colors.muted, fontSize: 13 }}>
            For: {item.recipients.map((r) => r.name).join(", ")}
          </Text>
        ) : null}

        {item.link ? (
          <TouchableOpacity onPress={handleOpenLink}>
            <Text style={{ color: colors.primary, fontSize: 13 }}>View Link</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}
