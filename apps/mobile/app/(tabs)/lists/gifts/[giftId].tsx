import { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Linking,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useServices } from "@/lib/use-api";
import { useTheme } from "@/lib/theme";
import { PersonPicker } from "@/components/PersonPicker";
import type { Gift, GiftStatus } from "@niftygifty/types";

export default function GiftDetailScreen() {
  const { giftId, holiday_id } = useLocalSearchParams<{ giftId: string; holiday_id: string }>();
  const router = useRouter();
  const { gifts, giftStatuses } = useServices();
  const { colors, isDark } = useTheme();

  const [gift, setGift] = useState<Gift | null>(null);
  const [statuses, setStatuses] = useState<GiftStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Edit state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [cost, setCost] = useState("");
  const [selectedStatusId, setSelectedStatusId] = useState<number | null>(null);
  const [recipientIds, setRecipientIds] = useState<number[]>([]);
  const [giverIds, setGiverIds] = useState<number[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  const id = parseInt(giftId, 10);

  const fetchData = useCallback(async () => {
    if (isNaN(id)) {
      setError("Invalid gift ID");
      setLoading(false);
      return;
    }

    try {
      setError(null);
      const [giftData, statusesData] = await Promise.all([
        gifts.getById(id),
        giftStatuses.getAll(),
      ]);
      setGift(giftData);
      setStatuses(statusesData);

      // Initialize form state
      setName(giftData.name);
      setDescription(giftData.description || "");
      setLink(giftData.link || "");
      setCost(giftData.cost || "");
      setSelectedStatusId(giftData.gift_status_id);
      setRecipientIds(giftData.recipients.map((r) => r.id));
      setGiverIds(giftData.givers.map((g) => g.id));
    } catch (err) {
      setError("Failed to load gift");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id, gifts, giftStatuses]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Track changes
  useEffect(() => {
    if (!gift) return;
    const changed =
      name !== gift.name ||
      description !== (gift.description || "") ||
      link !== (gift.link || "") ||
      cost !== (gift.cost || "") ||
      selectedStatusId !== gift.gift_status_id ||
      JSON.stringify(recipientIds.sort()) !== JSON.stringify(gift.recipients.map((r) => r.id).sort()) ||
      JSON.stringify(giverIds.sort()) !== JSON.stringify(gift.givers.map((g) => g.id).sort());
    setHasChanges(changed);
  }, [gift, name, description, link, cost, selectedStatusId, recipientIds, giverIds]);

  const handleSave = async () => {
    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await gifts.update(id, {
        name: name.trim(),
        description: description.trim() || undefined,
        link: link.trim() || undefined,
        cost: cost ? parseFloat(cost) : undefined,
        gift_status_id: selectedStatusId || undefined,
        recipient_ids: recipientIds,
        giver_ids: giverIds,
      });

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.back();
    } catch (err) {
      console.error(err);
      setError("Failed to save changes");
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Gift",
      `Are you sure you want to delete "${gift?.name}"? This cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setDeleting(true);
            try {
              await gifts.delete(id);
              await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              router.back();
            } catch (err) {
              console.error(err);
              setError("Failed to delete gift");
              await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            } finally {
              setDeleting(false);
            }
          },
        },
      ]
    );
  };

  const handleOpenLink = () => {
    if (link) {
      Linking.openURL(link);
    }
  };

  const handleStatusChange = async (statusId: number) => {
    setSelectedStatusId(statusId);
    await Haptics.selectionAsync();
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

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error && !gift) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.background, padding: 32 }}>
        <Ionicons name="alert-circle" size={64} color={colors.error} />
        <Text style={{ color: colors.error, fontSize: 18, fontWeight: "600", marginTop: 16, textAlign: "center" }}>
          {error}
        </Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 24 }}>
          <Text style={{ color: colors.primary, fontSize: 16 }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      <Stack.Screen
        options={{
          title: "Edit Gift",
          headerRight: () => (
            <TouchableOpacity onPress={handleSave} disabled={saving || !hasChanges}>
              {saving ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <Text
                  style={{
                    color: hasChanges ? colors.primary : colors.muted,
                    fontSize: 17,
                    fontWeight: "600",
                  }}
                >
                  Save
                </Text>
              )}
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {error ? (
          <View style={{ backgroundColor: colors.errorLight, padding: 12, borderRadius: 8, marginBottom: 16 }}>
            <Text style={{ color: colors.error }}>{error}</Text>
          </View>
        ) : null}

        {/* Name */}
        <Text style={{ color: colors.textTertiary, fontSize: 14, marginBottom: 8 }}>Name *</Text>
        <TextInput
          placeholder="Gift name"
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

        {/* Description */}
        <Text style={{ color: colors.textTertiary, fontSize: 14, marginBottom: 8 }}>Description</Text>
        <TextInput
          placeholder="Optional notes"
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

        {/* Link */}
        <Text style={{ color: colors.textTertiary, fontSize: 14, marginBottom: 8 }}>Link</Text>
        <View style={{ flexDirection: "row", gap: 8, marginBottom: 16 }}>
          <TextInput
            placeholder="https://..."
            placeholderTextColor={colors.placeholder}
            value={link}
            onChangeText={setLink}
            keyboardType="url"
            autoCapitalize="none"
            style={{
              flex: 1,
              backgroundColor: colors.input,
              color: colors.text,
              padding: 16,
              borderRadius: 8,
              fontSize: 16,
              borderWidth: 1,
              borderColor: colors.inputBorder,
            }}
          />
          {link ? (
            <TouchableOpacity
              onPress={handleOpenLink}
              style={{
                backgroundColor: colors.primary,
                paddingHorizontal: 16,
                justifyContent: "center",
                borderRadius: 8,
              }}
            >
              <Ionicons name="open-outline" size={20} color="#fff" />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Cost */}
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

        {/* Status */}
        <Text style={{ color: colors.textTertiary, fontSize: 14, marginBottom: 8 }}>Status</Text>
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

        {/* Delete Button */}
        <TouchableOpacity
          onPress={handleDelete}
          disabled={deleting}
          style={{
            backgroundColor: isDark ? "#7f1d1d" : "#fee2e2",
            padding: 16,
            borderRadius: 8,
            alignItems: "center",
            marginTop: 24,
            marginBottom: 32,
          }}
        >
          {deleting ? (
            <ActivityIndicator color={isDark ? "#fca5a5" : "#dc2626"} />
          ) : (
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Ionicons name="trash-outline" size={20} color={isDark ? "#fca5a5" : "#dc2626"} />
              <Text style={{ color: isDark ? "#fca5a5" : "#dc2626", fontSize: 16, fontWeight: "600" }}>
                Delete Gift
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
