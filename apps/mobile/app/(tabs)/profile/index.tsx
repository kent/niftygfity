import { View, Text, TouchableOpacity } from "react-native";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/lib/theme";

export default function ProfileScreen() {
  const { signOut } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const { colors, colorScheme, setColorScheme, isDark } = useTheme();

  const handleSignOut = async () => {
    await signOut();
    router.replace("/auth/login");
  };

  const themeOptions: Array<{ value: "system" | "light" | "dark"; label: string; icon: keyof typeof Ionicons.glyphMap }> = [
    { value: "system", label: "System", icon: "phone-portrait-outline" },
    { value: "light", label: "Light", icon: "sunny-outline" },
    { value: "dark", label: "Dark", icon: "moon-outline" },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, padding: 16 }}>
      {/* User Info */}
      <View style={{ backgroundColor: colors.card, borderRadius: 12, padding: 16, marginBottom: 24, borderWidth: 1, borderColor: colors.border }}>
        <Text style={{ color: colors.text, fontSize: 20, fontWeight: "600", marginBottom: 4 }}>
          {user?.firstName || "User"} {user?.lastName || ""}
        </Text>
        <Text style={{ color: colors.textTertiary, fontSize: 14 }}>
          {user?.primaryEmailAddress?.emailAddress || ""}
        </Text>
      </View>

      {/* Theme Selector */}
      <View style={{ backgroundColor: colors.card, borderRadius: 12, marginBottom: 24, borderWidth: 1, borderColor: colors.border }}>
        <View style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: colors.border }}>
          <Text style={{ color: colors.text, fontSize: 16, fontWeight: "600", marginBottom: 4 }}>Appearance</Text>
          <Text style={{ color: colors.textTertiary, fontSize: 13 }}>Choose your preferred theme</Text>
        </View>
        <View style={{ flexDirection: "row", padding: 12, gap: 8 }}>
          {themeOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              onPress={() => setColorScheme(option.value)}
              style={{
                flex: 1,
                backgroundColor: colorScheme === option.value ? colors.primary : colors.surfaceSecondary,
                padding: 12,
                borderRadius: 8,
                alignItems: "center",
                gap: 4,
              }}
            >
              <Ionicons
                name={option.icon}
                size={20}
                color={colorScheme === option.value ? "#fff" : colors.muted}
              />
              <Text
                style={{
                  color: colorScheme === option.value ? "#fff" : colors.muted,
                  fontSize: 12,
                  fontWeight: "500",
                }}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Settings placeholder */}
      <View style={{ backgroundColor: colors.card, borderRadius: 12, marginBottom: 24, borderWidth: 1, borderColor: colors.border }}>
        <View style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: colors.border }}>
          <Text style={{ color: colors.textTertiary, fontSize: 14 }}>More settings coming soon</Text>
        </View>
      </View>

      {/* Sign Out Button */}
      <TouchableOpacity
        onPress={handleSignOut}
        style={{
          backgroundColor: isDark ? "#7f1d1d" : "#fee2e2",
          padding: 16,
          borderRadius: 8,
          alignItems: "center",
        }}
      >
        <Text style={{ color: isDark ? "#fca5a5" : "#dc2626", fontSize: 16, fontWeight: "600" }}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}
