import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { useServices } from "@/lib/use-api";
import { useTheme } from "@/lib/theme";

export default function NewListScreen() {
  const router = useRouter();
  const { holidays } = useServices();
  const { colors } = useTheme();

  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async () => {
    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await holidays.create({
        name: name.trim(),
        date: date.trim() || new Date().toISOString().split("T")[0],
      });
      router.back();
    } catch (err) {
      console.error(err);
      setError("Failed to create list");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={{ color: colors.textTertiary, fontSize: 14, marginBottom: 24 }}>
          Create a new gift list to organize gifts for an occasion.
        </Text>

        {error ? (
          <View style={{ backgroundColor: colors.errorLight, padding: 12, borderRadius: 8, marginBottom: 16 }}>
            <Text style={{ color: colors.error }}>{error}</Text>
          </View>
        ) : null}

        <Text style={{ color: colors.textTertiary, fontSize: 14, marginBottom: 8 }}>Name *</Text>
        <TextInput
          placeholder="e.g., Christmas 2025"
          placeholderTextColor={colors.placeholder}
          value={name}
          onChangeText={setName}
          style={{
            backgroundColor: colors.input,
            color: colors.text,
            padding: 16,
            borderRadius: 8,
            marginBottom: 16,
            fontSize: 16,
            borderWidth: 1,
            borderColor: colors.inputBorder,
          }}
        />

        <Text style={{ color: colors.textTertiary, fontSize: 14, marginBottom: 8 }}>Date (YYYY-MM-DD)</Text>
        <TextInput
          placeholder="e.g., 2025-12-25"
          placeholderTextColor={colors.placeholder}
          value={date}
          onChangeText={setDate}
          style={{
            backgroundColor: colors.input,
            color: colors.text,
            padding: 16,
            borderRadius: 8,
            marginBottom: 24,
            fontSize: 16,
            borderWidth: 1,
            borderColor: colors.inputBorder,
          }}
        />

        <TouchableOpacity
          onPress={handleCreate}
          disabled={loading}
          style={{
            backgroundColor: colors.primary,
            padding: 16,
            borderRadius: 8,
            alignItems: "center",
          }}
        >
          {loading ? (
            <ActivityIndicator color={colors.textInverse} />
          ) : (
            <Text style={{ color: colors.textInverse, fontSize: 16, fontWeight: "600" }}>Create List</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            padding: 16,
            alignItems: "center",
            marginTop: 8,
          }}
        >
          <Text style={{ color: colors.textTertiary, fontSize: 16 }}>Cancel</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
