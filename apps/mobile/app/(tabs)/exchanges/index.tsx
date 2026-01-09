import { useEffect, useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  SectionList,
} from "react-native";
import { useRouter } from "expo-router";
import { useServices } from "@/lib/use-api";
import { useTheme } from "@/lib/theme";
import type { GiftExchange } from "@niftygifty/types";
import { ExchangeCard } from "@/components/ExchangeCard";

export default function ExchangesScreen() {
  const router = useRouter();
  const { giftExchanges } = useServices();
  const { colors } = useTheme();

  const [exchanges, setExchanges] = useState<GiftExchange[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchExchanges = useCallback(async () => {
    try {
      setError(null);
      const data = await giftExchanges.getAll();
      setExchanges(data);
    } catch (err) {
      setError("Failed to load exchanges");
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [giftExchanges]);

  useEffect(() => {
    fetchExchanges();
  }, [fetchExchanges]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchExchanges();
  }, [fetchExchanges]);

  const handlePressExchange = (exchange: GiftExchange) => {
    router.push(`/(tabs)/exchanges/${exchange.id}`);
  };

  // Split exchanges into owned and participating
  const sections = useMemo(() => {
    const owned = exchanges.filter((e) => e.is_owner);
    const participating = exchanges.filter((e) => !e.is_owner);

    const result = [];
    if (owned.length > 0) {
      result.push({ title: "My Exchanges", data: owned });
    }
    if (participating.length > 0) {
      result.push({ title: "Participating In", data: participating });
    }
    return result;
  }, [exchanges]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {error ? (
        <View style={{ padding: 16, backgroundColor: colors.errorLight, margin: 16, borderRadius: 8 }}>
          <Text style={{ color: colors.error }}>{error}</Text>
        </View>
      ) : null}

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        stickySectionHeadersEnabled={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
          />
        }
        renderSectionHeader={({ section: { title } }) => (
          <Text
            style={{
              color: colors.textTertiary,
              fontSize: 14,
              fontWeight: "600",
              marginBottom: 12,
              marginTop: sections.indexOf(sections.find((s) => s.title === title)!) > 0 ? 24 : 0,
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            {title}
          </Text>
        )}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 12 }}>
            <ExchangeCard exchange={item} onPress={() => handlePressExchange(item)} />
          </View>
        )}
        ListEmptyComponent={
          <View style={{ alignItems: "center", paddingVertical: 48 }}>
            <Text style={{ fontSize: 48, marginBottom: 16 }}>🎁</Text>
            <Text style={{ color: colors.text, fontSize: 18, fontWeight: "600", marginBottom: 8 }}>
              No Exchanges Yet
            </Text>
            <Text style={{ color: colors.textTertiary, fontSize: 14, textAlign: "center", paddingHorizontal: 32 }}>
              You'll see exchanges here when someone invites you to participate in a gift exchange.
            </Text>
          </View>
        }
      />
    </View>
  );
}
