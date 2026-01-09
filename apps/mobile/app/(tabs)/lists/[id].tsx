import { useEffect, useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  TextInput,
  ScrollView,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useServices } from "@/lib/use-api";
import { useTheme } from "@/lib/theme";
import type { Gift, Holiday, GiftStatus, Person } from "@niftygifty/types";
import { GiftItem } from "@/components/GiftItem";

export default function GiftsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { holidays, gifts, giftStatuses, people: peopleService } = useServices();
  const { colors, isDark } = useTheme();

  const [holiday, setHoliday] = useState<Holiday | null>(null);
  const [allGifts, setAllGifts] = useState<Gift[]>([]);
  const [statuses, setStatuses] = useState<GiftStatus[]>([]);
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState("");
  const [selectedStatusIds, setSelectedStatusIds] = useState<number[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const holidayId = parseInt(id, 10);

  const fetchData = useCallback(async () => {
    if (isNaN(holidayId)) {
      setError("Invalid list ID");
      setLoading(false);
      return;
    }

    try {
      setError(null);
      const [holidayData, giftsData, statusesData, peopleData] = await Promise.all([
        holidays.getById(holidayId),
        gifts.getAll(),
        giftStatuses.getAll(),
        peopleService.getAll(),
      ]);
      setHoliday(holidayData);
      setAllGifts(giftsData);
      setStatuses(statusesData);
      setPeople(peopleData);
    } catch (err) {
      setError("Failed to load gifts");
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [holidayId, holidays, gifts, giftStatuses, peopleService]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, [fetchData]);

  // Filter gifts for this holiday
  const filteredGifts = useMemo(() => {
    return allGifts
      .filter((gift) => gift.holiday_id === holidayId)
      .filter((gift) => {
        // Search filter
        if (search.trim()) {
          const searchLower = search.toLowerCase();
          const matchesSearch =
            gift.name.toLowerCase().includes(searchLower) ||
            gift.description?.toLowerCase().includes(searchLower) ||
            gift.recipients?.some((r) => r.name.toLowerCase().includes(searchLower));
          if (!matchesSearch) return false;
        }

        // Status filter
        if (selectedStatusIds.length > 0) {
          if (!selectedStatusIds.includes(gift.gift_status_id)) return false;
        }

        return true;
      });
  }, [allGifts, holidayId, search, selectedStatusIds]);

  const handleAddGift = () => {
    router.push({
      pathname: "/(tabs)/lists/gifts/new",
      params: { holiday_id: holidayId.toString() },
    });
  };

  const handleGiftPress = (giftId: number) => {
    router.push({
      pathname: "/(tabs)/lists/gifts/[giftId]",
      params: { giftId: giftId.toString(), holiday_id: holidayId.toString() },
    });
  };

  const handleDeleteGift = async (giftId: number) => {
    try {
      await gifts.delete(giftId);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setAllGifts((prev) => prev.filter((g) => g.id !== giftId));
    } catch (err) {
      console.error(err);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const toggleStatusFilter = async (statusId: number) => {
    await Haptics.selectionAsync();
    setSelectedStatusIds((prev) =>
      prev.includes(statusId) ? prev.filter((id) => id !== statusId) : [...prev, statusId]
    );
  };

  const clearFilters = async () => {
    await Haptics.selectionAsync();
    setSelectedStatusIds([]);
    setSearch("");
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

  const hasActiveFilters = selectedStatusIds.length > 0 || search.trim().length > 0;

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.background }}>
      <Stack.Screen options={{ title: holiday?.name || "Gifts" }} />

      {/* Search and Filter Bar */}
      <View style={{ padding: 16, paddingBottom: 8, gap: 12 }}>
        <View style={{ flexDirection: "row", gap: 8 }}>
          <TextInput
            placeholder="Search gifts..."
            placeholderTextColor={colors.placeholder}
            value={search}
            onChangeText={setSearch}
            style={{
              flex: 1,
              backgroundColor: colors.input,
              color: colors.text,
              padding: 12,
              borderRadius: 8,
              fontSize: 16,
              borderWidth: 1,
              borderColor: colors.inputBorder,
            }}
          />
          <TouchableOpacity
            onPress={() => setShowFilters(!showFilters)}
            style={{
              backgroundColor: showFilters || selectedStatusIds.length > 0 ? colors.primary : colors.input,
              paddingHorizontal: 14,
              justifyContent: "center",
              borderRadius: 8,
              borderWidth: 1,
              borderColor: showFilters || selectedStatusIds.length > 0 ? colors.primary : colors.inputBorder,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              <Ionicons
                name="filter"
                size={18}
                color={showFilters || selectedStatusIds.length > 0 ? "#fff" : colors.muted}
              />
              {selectedStatusIds.length > 0 ? (
                <Text style={{ color: "#fff", fontSize: 14, fontWeight: "600" }}>
                  {selectedStatusIds.length}
                </Text>
              ) : null}
            </View>
          </TouchableOpacity>
        </View>

        {/* Status Filters */}
        {showFilters ? (
          <View style={{ gap: 8 }}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <Text style={{ color: colors.textTertiary, fontSize: 13, fontWeight: "500" }}>
                Filter by Status
              </Text>
              {hasActiveFilters ? (
                <TouchableOpacity onPress={clearFilters}>
                  <Text style={{ color: colors.primary, fontSize: 13 }}>Clear All</Text>
                </TouchableOpacity>
              ) : null}
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -16, paddingHorizontal: 16 }}>
              <View style={{ flexDirection: "row", gap: 8 }}>
                {statuses.map((status) => {
                  const isSelected = selectedStatusIds.includes(status.id);
                  const statusColor = getStatusColor(status.name);
                  return (
                    <TouchableOpacity
                      key={status.id}
                      onPress={() => toggleStatusFilter(status.id)}
                      style={{
                        backgroundColor: isSelected ? statusColor.bg : colors.surfaceSecondary,
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        borderRadius: 16,
                        borderWidth: 2,
                        borderColor: isSelected ? statusColor.text : "transparent",
                      }}
                    >
                      <Text
                        style={{
                          color: isSelected ? statusColor.text : colors.muted,
                          fontSize: 13,
                          fontWeight: isSelected ? "600" : "400",
                        }}
                      >
                        {status.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
          </View>
        ) : null}
      </View>

      {error ? (
        <View style={{ padding: 16, backgroundColor: colors.errorLight, marginHorizontal: 16, borderRadius: 8 }}>
          <Text style={{ color: colors.error }}>{error}</Text>
          <TouchableOpacity onPress={fetchData} style={{ marginTop: 8 }}>
            <Text style={{ color: colors.primary }}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      <FlatList
        data={filteredGifts}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 16, paddingTop: 8, gap: 12 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
          />
        }
        renderItem={({ item }) => (
          <GiftItem
            item={item}
            onPress={() => handleGiftPress(item.id)}
            onDelete={() => handleDeleteGift(item.id)}
          />
        )}
        ListEmptyComponent={
          <View style={{ alignItems: "center", paddingVertical: 48 }}>
            <Text style={{ fontSize: 48, marginBottom: 16 }}>🎁</Text>
            <Text style={{ color: colors.text, fontSize: 18, fontWeight: "600", marginBottom: 8 }}>
              {hasActiveFilters ? "No Matches" : "No Gifts Yet"}
            </Text>
            <Text style={{ color: colors.textTertiary, fontSize: 14, marginBottom: 24, textAlign: "center" }}>
              {hasActiveFilters
                ? "Try adjusting your filters"
                : "Add your first gift to this list"}
            </Text>
            {hasActiveFilters ? (
              <TouchableOpacity
                onPress={clearFilters}
                style={{
                  backgroundColor: colors.surfaceSecondary,
                  paddingVertical: 12,
                  paddingHorizontal: 24,
                  borderRadius: 8,
                }}
              >
                <Text style={{ color: colors.text, fontWeight: "600" }}>Clear Filters</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={handleAddGift}
                style={{
                  backgroundColor: colors.primary,
                  paddingVertical: 12,
                  paddingHorizontal: 24,
                  borderRadius: 8,
                }}
              >
                <Text style={{ color: colors.textInverse, fontWeight: "600" }}>Add Your First Gift</Text>
              </TouchableOpacity>
            )}
          </View>
        }
      />

      {/* FAB */}
      {filteredGifts.length > 0 || hasActiveFilters ? (
        <TouchableOpacity
          onPress={handleAddGift}
          style={{
            position: "absolute",
            right: 16,
            bottom: 24,
            backgroundColor: colors.primary,
            width: 56,
            height: 56,
            borderRadius: 28,
            justifyContent: "center",
            alignItems: "center",
            shadowColor: colors.primary,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }}
        >
          <Ionicons name="add" size={28} color={colors.textInverse} />
        </TouchableOpacity>
      ) : null}
    </GestureHandlerRootView>
  );
}
