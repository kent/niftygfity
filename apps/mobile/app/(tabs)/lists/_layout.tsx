import { Stack } from "expo-router";
import { useTheme } from "@/lib/theme";

export default function ListsLayout() {
  const { colors } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: "600" },
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen
        name="index"
        options={{ title: "Gift Lists" }}
      />
      <Stack.Screen
        name="[id]"
        options={{ title: "Gifts" }}
      />
      <Stack.Screen
        name="new"
        options={{ title: "New List", presentation: "modal" }}
      />
      <Stack.Screen
        name="gifts/new"
        options={{ title: "New Gift", presentation: "modal" }}
      />
    </Stack>
  );
}
