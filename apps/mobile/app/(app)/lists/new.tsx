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

export default function NewListScreen() {
  const router = useRouter();
  const { holidays } = useServices();

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
      style={{ flex: 1, backgroundColor: "#0f172a" }}
    >
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={{ color: "#94a3b8", fontSize: 14, marginBottom: 24 }}>
          Create a new gift list to organize gifts for an occasion.
        </Text>

        {error ? (
          <View style={{ backgroundColor: "#7f1d1d", padding: 12, borderRadius: 8, marginBottom: 16 }}>
            <Text style={{ color: "#fca5a5" }}>{error}</Text>
          </View>
        ) : null}

        <Text style={{ color: "#94a3b8", fontSize: 14, marginBottom: 8 }}>Name *</Text>
        <TextInput
          placeholder="e.g., Christmas 2025"
          placeholderTextColor="#64748b"
          value={name}
          onChangeText={setName}
          style={{
            backgroundColor: "#1e293b",
            color: "#fff",
            padding: 16,
            borderRadius: 8,
            marginBottom: 16,
            fontSize: 16,
          }}
        />

        <Text style={{ color: "#94a3b8", fontSize: 14, marginBottom: 8 }}>Date (YYYY-MM-DD)</Text>
        <TextInput
          placeholder="e.g., 2025-12-25"
          placeholderTextColor="#64748b"
          value={date}
          onChangeText={setDate}
          style={{
            backgroundColor: "#1e293b",
            color: "#fff",
            padding: 16,
            borderRadius: 8,
            marginBottom: 24,
            fontSize: 16,
          }}
        />

        <TouchableOpacity
          onPress={handleCreate}
          disabled={loading}
          style={{
            backgroundColor: "#8b5cf6",
            padding: 16,
            borderRadius: 8,
            alignItems: "center",
          }}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>Create List</Text>
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
          <Text style={{ color: "#94a3b8", fontSize: 16 }}>Cancel</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
