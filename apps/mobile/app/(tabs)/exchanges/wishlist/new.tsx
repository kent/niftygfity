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
import { useRouter, useLocalSearchParams } from "expo-router";
import { useServices } from "@/lib/use-api";
import { useTheme } from "@/lib/theme";

export default function NewWishlistItemScreen() {
  const router = useRouter();
  const { exchange_id, participant_id } = useLocalSearchParams<{
    exchange_id: string;
    participant_id: string;
  }>();
  const { wishlistItems } = useServices();
  const { colors } = useTheme();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const exchangeId = exchange_id ? parseInt(exchange_id, 10) : null;
  const participantId = participant_id ? parseInt(participant_id, 10) : null;

  const handleCreate = async () => {
    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    if (!exchangeId || !participantId) {
      setError("Missing exchange or participant information");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await wishlistItems.create(exchangeId, participantId, {
        name: name.trim(),
        description: description.trim() || undefined,
        link: link.trim() || undefined,
        price: price ? parseFloat(price) : undefined,
      });
      router.back();
    } catch (err) {
      console.error(err);
      setError("Failed to add item");
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
          Add an item to your wishlist to help your Secret Santa find the perfect gift!
        </Text>

        {error ? (
          <View style={{ backgroundColor: colors.errorLight, padding: 12, borderRadius: 8, marginBottom: 16 }}>
            <Text style={{ color: colors.error }}>{error}</Text>
          </View>
        ) : null}

        <Text style={{ color: colors.textTertiary, fontSize: 14, marginBottom: 8 }}>Item Name *</Text>
        <TextInput
          placeholder="e.g., Cozy wool sweater"
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

        <Text style={{ color: colors.textTertiary, fontSize: 14, marginBottom: 8 }}>Description</Text>
        <TextInput
          placeholder="Size, color, or other details..."
          placeholderTextColor={colors.placeholder}
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
          style={{
            backgroundColor: colors.input,
            color: colors.text,
            padding: 16,
            borderRadius: 8,
            marginBottom: 16,
            fontSize: 16,
            textAlignVertical: "top",
            minHeight: 80,
            borderWidth: 1,
            borderColor: colors.inputBorder,
          }}
        />

        <Text style={{ color: colors.textTertiary, fontSize: 14, marginBottom: 8 }}>Link (optional)</Text>
        <TextInput
          placeholder="https://..."
          placeholderTextColor={colors.placeholder}
          value={link}
          onChangeText={setLink}
          keyboardType="url"
          autoCapitalize="none"
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

        <Text style={{ color: colors.textTertiary, fontSize: 14, marginBottom: 8 }}>Approximate Price</Text>
        <TextInput
          placeholder="e.g., 25.00"
          placeholderTextColor={colors.placeholder}
          value={price}
          onChangeText={setPrice}
          keyboardType="decimal-pad"
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
            <Text style={{ color: colors.textInverse, fontSize: 16, fontWeight: "600" }}>Add to Wishlist</Text>
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
