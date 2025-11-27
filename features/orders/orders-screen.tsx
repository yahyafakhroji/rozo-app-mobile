import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, RefreshControl, View } from "react-native";

import { Spinner } from "@/components/ui/spinner";
import { VStack } from "@/components/ui/vstack";
import { useGetOrders } from "@/modules/api/api/merchant/orders";
import {
  type MerchantOrder,
  type MerchantOrderStatus,
} from "@/modules/api/schema/order";

import { ThemedText } from "@/components/themed-text";
import EmptyOrdersState from "./empty-orders";
import { FilterOrderActionSheet } from "./filter-order";
import { OrderCard } from "./order-card";
import {
  OrderDetailActionSheet,
  type OrderDetailActionSheetRef,
} from "./order-detail";

export function OrdersScreen() {
  const { t } = useTranslation();

  const [orders, setOrders] = useState<MerchantOrder[]>([]);
  const [status, setStatus] = useState<MerchantOrderStatus>("COMPLETED");
  const [refreshing, setRefreshing] = useState(false);
  const [forceRefresh, setForceRefresh] = useState(false);

  const { data, isFetching, refetch } = useGetOrders({
    variables: { status, force: forceRefresh },
  });

  useEffect(() => {
    setOrders(data ?? []);
    setRefreshing(false);
  }, [data]);

  const handleStatusChange = useCallback((newStatus: MerchantOrderStatus) => {
    setStatus(newStatus);
  }, []);

  const orderDetailRef = useRef<OrderDetailActionSheetRef>(null);

  // Memoize callback to prevent re-renders
  const handleOrderPress = useCallback((orderId: string) => {
    orderDetailRef.current?.openOrder(orderId);
  }, []);

  const onRefresh = useCallback(() => {
    setForceRefresh(true);
    setRefreshing(true);
    refetch();

    setTimeout(() => {
      setForceRefresh(false);
    }, 500);
  }, [refetch]);

  // Memoize renderItem to prevent recreation
  const renderOrderItem = useCallback(
    ({ item }: { item: MerchantOrder }) => (
      <OrderCard
        order={item}
        onPress={(order) => handleOrderPress(order.order_id)}
      />
    ),
    [handleOrderPress]
  );

  // Memoize header component
  const ListHeaderComponent = useMemo(
    () => (
      <VStack className="flex flex-row items-start justify-between py-6">
        <View className="mb-6">
          <ThemedText style={{ fontSize: 24, fontWeight: "bold" }}>
            {t("order.recentOrders")}
          </ThemedText>
          <ThemedText style={{ fontSize: 14, color: "#6B7280" }} type="default">
            {t("order.recentOrdersDesc")}
          </ThemedText>
        </View>
        <FilterOrderActionSheet onStatusChange={handleStatusChange} />
      </VStack>
    ),
    [t, handleStatusChange]
  );

  // Memoize empty component
  const ListEmptyComponent = useMemo(
    () => (isFetching ? <Spinner size="small" /> : <EmptyOrdersState />),
    [isFetching]
  );

  return (
    <View className="flex-1">
      <FlatList
        data={orders}
        keyExtractor={(item) => item.order_id}
        renderItem={renderOrderItem}
        ListHeaderComponent={ListHeaderComponent}
        ListEmptyComponent={ListEmptyComponent}
        contentContainerClassName="gap-4 px-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        // Performance optimizations
        windowSize={10}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        removeClippedSubviews={true}
        showsVerticalScrollIndicator={false}
      />
      <OrderDetailActionSheet ref={orderDetailRef} />
    </View>
  );
}
