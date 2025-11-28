import React, { useCallback, useMemo, useState } from "react";
import { FlatList, Linking, RefreshControl, StyleSheet, Text } from "react-native";

import { Spinner } from "@/components/ui/spinner";
import { useBaseUSDCTransactions } from "@/modules/api/api/base-transaction";
import { useApp } from "@/providers/app.provider";
import { type Transaction } from "@/modules/api/schema/transaction";

import EmptyTransactionsState from "./empty-transactions";
import { TransactionCard } from "./transaction-card";

// Move styles outside component to prevent recreation
const styles = StyleSheet.create({
  contentContainer: {
    gap: 12,
    paddingBottom: 20,
  },
  loadingText: {
    padding: 10,
    textAlign: "center",
  },
});

export function TransactionList() {
  const { primaryWallet } = useApp();

  const [refreshing, setRefreshing] = useState(false);
  const [forceRefresh, setForceRefresh] = useState(false);

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useBaseUSDCTransactions({
    variables: { address: primaryWallet?.address || "", force: forceRefresh },
  });

  const txs = useMemo(() => data?.pages.flat() ?? [], [data?.pages]);

  const onRefresh = useCallback(() => {
    setForceRefresh(true);
    setRefreshing(true);
    refetch();

    setTimeout(() => {
      setForceRefresh(false);
    }, 500);
  }, [refetch]);

  // Memoize handlers
  const handleEndReached = useCallback(() => {
    if (hasNextPage) fetchNextPage();
  }, [hasNextPage, fetchNextPage]);

  const handleTransactionPress = useCallback((url: string) => {
    Linking.openURL(url);
  }, []);

  // Memoize renderItem
  const renderItem = useCallback(
    ({ item }: { item: Transaction }) => (
      <TransactionCard
        transaction={item}
        onPress={() => handleTransactionPress(item.url)}
      />
    ),
    [handleTransactionPress]
  );

  // Memoize footer
  const ListFooterComponent = useMemo(
    () =>
      isFetchingNextPage ? (
        <Text style={styles.loadingText}>Loading more…</Text>
      ) : null,
    [isFetchingNextPage]
  );

  if (isLoading) return <Spinner size="small" />;

  if (!isLoading && txs.length === 0) return <EmptyTransactionsState />;

  return (
    <FlatList
      data={txs}
      keyExtractor={(item) => item.hash}
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.5}
      renderItem={renderItem}
      ListFooterComponent={ListFooterComponent}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      // Performance optimizations
      windowSize={21}
      maxToRenderPerBatch={10}
      updateCellsBatchingPeriod={50}
      removeClippedSubviews={true}
      showsVerticalScrollIndicator={false}
    />
  );
}
