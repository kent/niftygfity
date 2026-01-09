import { useState, useEffect, useCallback } from "react";
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
import * as Haptics from "expo-haptics";
import { useServices } from "@/lib/use-api";
import { useTheme } from "@/lib/theme";
import { PersonPicker } from "@/components/PersonPicker";
import type { GiftStatus } from "@niftygifty/types";

export default function NewGiftScreen() {
  const router = useRouter();
  const { holiday_id } = useLocalSearchParams<{ holiday_id: string }>();
  const { gifts, giftStatuses } = useServices();
  const { colors, isDark } = useTheme();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [cost, setCost] = useState("");
  const [statuses, setStatuses] = useState<GiftStatus[]>([]);
  const [selectedStatusId, setSelectedStatusId] = useState<number | null>(null);
  const [recipientIds, setRecipientIds] = useState<number[]>([]);
  const [giverIds, setGiverIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingStatuses, setLoadingStatuses] = useState(true);
  const [error, setError] = useState("");

  const holidayId = holiday_id ? parseInt(holiday_id, 10) : null;

  const fetchStatuses = useCallback(async () => {
    try {
      const data = await giftStatuses.getAll();
      setStatuses(data);
      if (data.length > 0) {
        setSelectedStatusId(data[0].id);
      }
    } catch (err) {
      console.error("Failed to load statuses", err);
    } finally {
      setLoadingStatuses(false);
    }
  }, [giftStatuses]);

  useEffect(() => {
    fetchStatuses();
  }, [fetchStatuses]);

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

  const handleStatusChange = async (statusId: number) => {
    setSelectedStatusId(statusId);
    await Haptics.selectionAsync();
  };

  const handleCreate = async () => {
    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    if (!holidayId) {
      setError("No list selected");
      return;
    }

    if (!selectedStatusId) {
      setError("Please select a status");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await gifts.create({
        name: name.trim(),
        description: description.trim() || undefined,
        link: link.trim() || undefined,
        cost: cost ? parseFloat(cost) : undefined,
        holiday_id: holidayId,
        gift_status_id: selectedStatusId,
        recipient_ids: recipientIds.length > 0 ? recipientIds : undefined,
        giver_ids: giverIds.length > 0 ? giverIds : undefined,
      });
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.back();
    } catch (err) {
      console.error(err);
      setError("Failed to create gift");
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
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
        {error ? (
          <View style={{ backgroundColor: colors.errorLight, padding: 12, borderRadius: 8, marginBottom: 16 }}>
            <Text style={{ color: colors.error }}>{error}</Text>
          </View>
        ) : null}

        <Text style={{ color: colors.textTertiary, fontSize: 14, marginBottom: 8 }}>Name *</Text>
        <TextInput
          placeholder="e.g., Nintendo Switch"
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
          placeholder="Optional notes about the gift"
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

        <Text style={{ color: colors.textTertiary, fontSize: 14, marginBottom: 8 }}>Link</Text>
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

        <Text style={{ color: colors.textTertiary, fontSize: 14, marginBottom: 8 }}>Cost</Text>
        <TextInput
          placeholder="0.00"
          placeholderTextColor={colors.placeholder}
          value={cost}
          onChangeText={setCost}
          keyboardType="decimal-pad"
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

        <Text style={{ color: colors.textTertiary, fontSize: 14, marginBottom: 8 }}>Status *</Text>
        {loadingStatuses ? (
          <ActivityIndicator color={colors.primary} style={{ marginBottom: 16 }} />
        ) : (
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
            {statuses.map((status) => {
              const isSelected = selectedStatusId === status.id;
              const statusColor = getStatusColor(status.name);
              return (
                <TouchableOpacity
                  key={status.id}
                  onPress={() => handleStatusChange(status.id)}
                  style={{
                    backgroundColor: isSelected ? statusColor.bg : colors.input,
                    paddingHorizontal: 16,
                    paddingVertical: 10,
                    borderRadius: 8,
                    borderWidth: 2,
                    borderColor: isSelected ? statusColor.text : colors.inputBorder,
                  }}
                >
                  <Text
                    style={{
                      color: isSelected ? statusColor.text : colors.textTertiary,
                      fontWeight: isSelected ? "600" : "400",
                    }}
                  >
                    {status.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* Recipients */}
        <PersonPicker
          label="For (Recipients)"
          selectedIds={recipientIds}
          onSelectionChange={setRecipientIds}
          placeholder="Who is this gift for?"
        />

        {/* Givers */}
        <PersonPicker
          label="From (Givers)"
          selectedIds={giverIds}
          onSelectionChange={setGiverIds}
          placeholder="Who is giving this gift?"
        />

        <TouchableOpacity
          onPress={handleCreate}
          disabled={loading}
          style={{
            backgroundColor: colors.primary,
            padding: 16,
            borderRadius: 8,
            alignItems: "center",
            marginTop: 8,
          }}
        >
          {loading ? (
            <ActivityIndicator color={colors.textInverse} />
          ) : (
            <Text style={{ color: colors.textInverse, fontSize: 16, fontWeight: "600" }}>Add Gift</Text>
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
