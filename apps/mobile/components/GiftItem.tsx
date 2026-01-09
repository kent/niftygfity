import { useRef } from "react";
import {
  View,
  Text,
  Linking,
  TouchableOpacity,
  Animated,
  Alert,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import type { Gift } from "@niftygifty/types";
import { useTheme } from "@/lib/theme";

interface GiftItemProps {
  item: Gift;
  onPress?: () => void;
  onDelete?: () => void;
  onStatusChange?: (statusId: number) => void;
}

export function GiftItem({ item, onPress, onDelete, onStatusChange }: GiftItemProps) {
  const { colors, isDark } = useTheme();
  const swipeableRef = useRef<Swipeable>(null);

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

  const handleDelete = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      "Delete Gift",
      `Are you sure you want to delete "${item.name}"?`,
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => swipeableRef.current?.close(),
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            swipeableRef.current?.close();
            onDelete?.();
          },
        },
      ]
    );
  };

  const renderRightActions = (
    progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>
  ) => {
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0.5],
      extrapolate: "clamp",
    });

    return (
      <TouchableOpacity
        onPress={handleDelete}
        style={{
          backgroundColor: colors.error,
          justifyContent: "center",
          alignItems: "center",
          width: 80,
          borderTopRightRadius: 12,
          borderBottomRightRadius: 12,
        }}
      >
        <Animated.View style={{ transform: [{ scale }] }}>
          <Ionicons name="trash-outline" size={24} color="#fff" />
          <Text style={{ color: "#fff", fontSize: 12, marginTop: 4 }}>Delete</Text>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  const content = (
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
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <Ionicons name="person-outline" size={14} color={colors.muted} />
            <Text style={{ color: colors.muted, fontSize: 13 }}>
              {item.recipients.map((r) => r.name).join(", ")}
            </Text>
          </View>
        ) : null}

        {item.link ? (
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation?.();
              handleOpenLink();
            }}
            style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
          >
            <Ionicons name="link-outline" size={14} color={colors.primary} />
            <Text style={{ color: colors.primary, fontSize: 13 }}>Link</Text>
          </TouchableOpacity>
        ) : null}

        {/* Edit indicator when tappable */}
        {onPress ? (
          <View style={{ marginLeft: "auto" }}>
            <Ionicons name="chevron-forward" size={18} color={colors.muted} />
          </View>
        ) : null}
      </View>
    </View>
  );

  // If we have delete capability, wrap in Swipeable
  if (onDelete) {
    return (
      <Swipeable
        ref={swipeableRef}
        renderRightActions={renderRightActions}
        rightThreshold={40}
        overshootRight={false}
        friction={2}
        onSwipeableWillOpen={() => Haptics.selectionAsync()}
      >
        {onPress ? (
          <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
            {content}
          </TouchableOpacity>
        ) : (
          content
        )}
      </Swipeable>
    );
  }

  // Just tappable
  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}
