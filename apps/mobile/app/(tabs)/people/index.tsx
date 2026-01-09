import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/lib/theme";

export default function PeopleScreen() {
  const { colors } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: "center", alignItems: "center", padding: 32 }}>
      <View
        style={{
          width: 80,
          height: 80,
          borderRadius: 40,
          backgroundColor: colors.surfaceSecondary,
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <Ionicons name="people-outline" size={36} color={colors.muted} />
      </View>
      <Text style={{ color: colors.textTertiary, fontSize: 18, textAlign: "center", fontWeight: "500" }}>
        People management coming soon
      </Text>
      <Text style={{ color: colors.muted, fontSize: 14, marginTop: 8, textAlign: "center" }}>
        Manage gift recipients and givers here
      </Text>
    </View>
  );
}
