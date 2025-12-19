import { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useServices } from "@/lib/use-api";
import type { Holiday } from "@niftygifty/types";
import { GiftListCard } from "@/components/GiftListCard";

export default function GiftListsScreen() {
  const router = useRouter();
  const { holidays } = useServices();

  const [lists, setLists] = useState<Holiday[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLists = useCallback(async () => {
    try {
      setError(null);
      const data = await holidays.getAll();
      setLists(data);
    } catch (err) {
      setError("Failed to load gift lists");
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [holidays]);

  useEffect(() => {
    fetchLists();
  }, [fetchLists]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchLists();
  }, [fetchLists]);

  const handlePressItem = (item: Holiday) => {
    router.push(`/(app)/lists/${item.id}`);
  };

  const handleAddList = () => {
    router.push("/(app)/lists/new");
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
      {error ? (
        <View style={{ padding: 16, backgroundColor: "#7f1d1d", margin: 16, borderRadius: 8 }}>
          <Text style={{ color: "#fca5a5" }}>{error}</Text>
          <TouchableOpacity onPress={fetchLists} style={{ marginTop: 8 }}>
            <Text style={{ color: "#8b5cf6" }}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      <FlatList
        data={lists}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#8b5cf6"
          />
        }
        renderItem={({ item }) => (
          <GiftListCard item={item} onPress={() => handlePressItem(item)} />
        )}
        ListEmptyComponent={
          <View style={{ alignItems: "center", paddingVertical: 48 }}>
            <Text style={{ color: "#94a3b8", fontSize: 16, marginBottom: 16 }}>
              No gift lists yet
            </Text>
            <TouchableOpacity
              onPress={handleAddList}
              style={{
                backgroundColor: "#8b5cf6",
                paddingVertical: 12,
                paddingHorizontal: 24,
                borderRadius: 8,
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "600" }}>Create Your First List</Text>
            </TouchableOpacity>
          </View>
        }
      />

      {lists.length > 0 ? (
        <TouchableOpacity
          onPress={handleAddList}
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
