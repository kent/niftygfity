import { Stack } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function AppLayout() {
  const { signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.replace("/auth/login");
  };

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#0f172a" },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "600" },
        contentStyle: { backgroundColor: "#0f172a" },
        headerRight: () => (
          <TouchableOpacity onPress={handleSignOut}>
            <Text style={{ color: "#8b5cf6", marginRight: 8 }}>Sign Out</Text>
          </TouchableOpacity>
        ),
      }}
    >
      <Stack.Screen
        name="index"
        options={{ title: "Gift Lists" }}
      />
      <Stack.Screen
        name="lists/[id]"
        options={{ title: "Gifts" }}
      />
      <Stack.Screen
        name="lists/new"
        options={{ title: "New List", presentation: "modal" }}
      />
      <Stack.Screen
        name="gifts/new"
        options={{ title: "New Gift", presentation: "modal" }}
      />
    </Stack>
  );
}
