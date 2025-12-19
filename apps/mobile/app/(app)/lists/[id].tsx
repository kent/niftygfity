import { useEffect, useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { useServices } from "@/lib/use-api";
import type { Gift, Holiday } from "@niftygifty/types";
import { GiftItem } from "@/components/GiftItem";

export default function GiftsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { holidays, gifts } = useServices();

  const [holiday, setHoliday] = useState<Holiday | null>(null);
  const [allGifts, setAllGifts] = useState<Gift[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("");

  const holidayId = parseInt(id, 10);

  const fetchData = useCallback(async () => {
    if (isNaN(holidayId)) {
      setError("Invalid list ID");
      setLoading(false);
      return;
    }

    try {
      setError(null);
      const [holidayData, giftsData] = await Promise.all([
        holidays.getById(holidayId),
        gifts.getAll(),
      ]);
      setHoliday(holidayData);
      setAllGifts(giftsData);
    } catch (err) {
      setError("Failed to load gifts");
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [holidayId, holidays, gifts]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, [fetchData]);

  // Filter gifts for this holiday and by search term
  const filteredGifts = useMemo(() => {
    return allGifts
      .filter((gift) => gift.holiday_id === holidayId)
      .filter((gift) => {
        if (!filter.trim()) return true;
        const searchLower = filter.toLowerCase();
        return (
          gift.name.toLowerCase().includes(searchLower) ||
          gift.description?.toLowerCase().includes(searchLower)
        );
      });
  }, [allGifts, holidayId, filter]);

  const handleAddGift = () => {
    router.push({
      pathname: "/(app)/gifts/new",
      params: { holiday_id: holidayId.toString() },
    });
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#0f172a" }}>
        <ActivityIndicator size="large" color="#8b5cf6" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#0f172a" }}>
      <Stack.Screen options={{ title: holiday?.name || "Gifts" }} />

      {/* Search/Filter Bar */}
      <View style={{ padding: 16, paddingBottom: 8 }}>
        <TextInput
          placeholder="Search gifts..."
          placeholderTextColor="#64748b"
          value={filter}
          onChangeText={setFilter}
          style={{
            backgroundColor: "#1e293b",
            color: "#fff",
            padding: 12,
            borderRadius: 8,
            fontSize: 16,
          }}
        />
      </View>

      {error ? (
        <View style={{ padding: 16, backgroundColor: "#7f1d1d", marginHorizontal: 16, borderRadius: 8 }}>
          <Text style={{ color: "#fca5a5" }}>{error}</Text>
          <TouchableOpacity onPress={fetchData} style={{ marginTop: 8 }}>
            <Text style={{ color: "#8b5cf6" }}>Retry</Text>
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
            tintColor="#8b5cf6"
          />
        }
        renderItem={({ item }) => <GiftItem item={item} />}
        ListEmptyComponent={
          <View style={{ alignItems: "center", paddingVertical: 48 }}>
            <Text style={{ color: "#94a3b8", fontSize: 16, marginBottom: 16 }}>
              {filter ? "No gifts match your search" : "No gifts in this list yet"}
            </Text>
            {!filter ? (
              <TouchableOpacity
                onPress={handleAddGift}
                style={{
                  backgroundColor: "#8b5cf6",
                  paddingVertical: 12,
                  paddingHorizontal: 24,
                  borderRadius: 8,
                }}
              >
                <Text style={{ color: "#fff", fontWeight: "600" }}>Add Your First Gift</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        }
      />

      {filteredGifts.length > 0 || filter ? (
        <TouchableOpacity
          onPress={handleAddGift}
          style={{
            position: "absolute",
            right: 16,
            bottom: 24,
            backgroundColor: "#8b5cf6",
            width: 56,
            height: 56,
            borderRadius: 28,
            justifyContent: "center",
            alignItems: "center",
            shadowColor: "#8b5cf6",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }}
        >
          <Text style={{ color: "#fff", fontSize: 28, lineHeight: 32 }}>+</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}
