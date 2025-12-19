import { View, Text, Linking, TouchableOpacity } from "react-native";
import type { Gift } from "@niftygifty/types";

interface GiftItemProps {
  item: Gift;
}

export function GiftItem({ item }: GiftItemProps) {
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
    if (name.includes("idea") || name.includes("thinking")) return { bg: "#1e1b4b", text: "#a78bfa" };
    if (name.includes("bought") || name.includes("purchased")) return { bg: "#14532d", text: "#86efac" };
    if (name.includes("wrapped")) return { bg: "#164e63", text: "#67e8f9" };
    if (name.includes("given") || name.includes("delivered")) return { bg: "#065f46", text: "#6ee7b7" };
    return { bg: "#374151", text: "#9ca3af" };
  };

  const statusColors = getStatusColor(item.gift_status?.name || "");

  return (
    <View
      style={{
        backgroundColor: "#1e293b",
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: "#334155",
      }}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
        <View style={{ flex: 1 }}>
          <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600", marginBottom: 4 }}>
            {item.name}
          </Text>
          {item.description ? (
            <Text style={{ color: "#94a3b8", fontSize: 14 }} numberOfLines={2}>
              {item.description}
            </Text>
          ) : null}
        </View>

        {item.cost ? (
          <Text style={{ color: "#8b5cf6", fontSize: 16, fontWeight: "600", marginLeft: 12 }}>
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
          <Text style={{ color: "#64748b", fontSize: 13 }}>
            For: {item.recipients.map((r) => r.name).join(", ")}
          </Text>
        ) : null}

        {item.link ? (
          <TouchableOpacity onPress={handleOpenLink}>
            <Text style={{ color: "#8b5cf6", fontSize: 13 }}>View Link</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}
