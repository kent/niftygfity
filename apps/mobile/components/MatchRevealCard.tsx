import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/lib/theme";

interface MatchRevealCardProps {
  matchName: string;
  exchangeDate?: string | null;
  budgetMin?: string | null;
  budgetMax?: string | null;
}

export function MatchRevealCard({ matchName, exchangeDate, budgetMin, budgetMax }: MatchRevealCardProps) {
  const { colors } = useTheme();

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString(undefined, {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formattedDate = formatDate(exchangeDate);
  const hasBudget = budgetMin || budgetMax;

  return (
    <View
      style={{
        backgroundColor: colors.card,
        borderRadius: 16,
        padding: 24,
        borderWidth: 2,
        borderColor: colors.primary,
        alignItems: "center",
      }}
    >
      <Text style={{ color: colors.textTertiary, fontSize: 14, marginBottom: 8 }}>
        You're getting a gift for...
      </Text>

      <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 16 }}>
        <Text style={{ fontSize: 32 }}>🎁</Text>
        <Text style={{ color: colors.text, fontSize: 28, fontWeight: "700" }}>
          {matchName}
        </Text>
        <Text style={{ fontSize: 32 }}>🎁</Text>
      </View>

      {formattedDate ? (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 8 }}>
          <Ionicons name="calendar-outline" size={16} color={colors.textTertiary} />
          <Text style={{ color: colors.textTertiary, fontSize: 14 }}>{formattedDate}</Text>
        </View>
      ) : null}

      {hasBudget ? (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Ionicons name="cash-outline" size={16} color={colors.success} />
          <Text style={{ color: colors.success, fontSize: 14 }}>
            Budget: ${budgetMin || "0"} - ${budgetMax || "No limit"}
          </Text>
        </View>
      ) : null}

      <View
        style={{
          marginTop: 20,
          paddingTop: 16,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          alignItems: "center",
        }}
      >
        <Text style={{ color: colors.muted, fontSize: 12, textAlign: "center" }}>
          Check out their wishlist below for gift ideas!
        </Text>
      </View>
    </View>
  );
}
