import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  memo,
} from "react";
import { useTranslation } from "react-i18next";
import { Linking, View } from "react-native";
import { InboxIcon, ChevronRightIcon } from "lucide-react-native";

import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { useBaseUSDCTransactions } from "@/modules/api/api/base-transaction";
import { useStellarUSDCTransactions } from "@/modules/api/api/stellar-transaction";
import { useApp } from "@/providers/app.provider";
import { useWallet } from "@/providers";

import { TransactionCard } from "../transactions/transaction-card";

interface BalanceTransactionsProps {
  onViewAll?: () => void;
}

// Skeleton loader for transactions
const TransactionSkeleton = memo(function TransactionSkeleton() {
  return (
    <View className="px-4 py-3">
      <HStack space="md" className="items-center">
        <View className="w-10 h-10 rounded-full bg-background-200 dark:bg-background-700 animate-pulse" />
        <VStack space="xs" className="flex-1">
          <HStack className="items-center justify-between">
            <View className="h-4 w-20 bg-background-200 dark:bg-background-700 rounded animate-pulse" />
            <View className="h-4 w-16 bg-background-200 dark:bg-background-700 rounded animate-pulse" />
          </HStack>
          <HStack className="items-center justify-between">
            <View className="h-3 w-24 bg-background-200 dark:bg-background-700 rounded animate-pulse" />
            <View className="h-3 w-12 bg-background-200 dark:bg-background-700 rounded animate-pulse" />
          </HStack>
        </VStack>
      </HStack>
    </View>
  );
});

// Empty state component
const EmptyState = memo(function EmptyState() {
  const { t } = useTranslation();

  return (
    <VStack space="sm" className="items-center py-8">
      <View className="w-16 h-16 rounded-full bg-background-100 dark:bg-background-800 items-center justify-center mb-2">
        <Icon
          as={InboxIcon}
          size="xl"
          className="text-typography-300 dark:text-typography-600"
        />
      </View>
      <Text
        size="md"
        className="font-medium text-typography-500 dark:text-typography-400"
      >
        {t("transactions.noTransactions")}
      </Text>
      <Text
        size="sm"
        className="text-typography-400 dark:text-typography-500 text-center px-8"
      >
        {t("transactions.noTransactionsDescription")}
      </Text>
    </VStack>
  );
});

export const BalanceTransactions = memo(
  forwardRef<{ refresh: () => void }, BalanceTransactionsProps>(
    function BalanceTransactions({ onViewAll }, ref) {
      const { t } = useTranslation();
      const { primaryWallet } = useApp();
      const { preferredPrimaryChain } = useWallet();

      const isETH = useMemo(() => {
        return preferredPrimaryChain === "USDC_BASE";
      }, [preferredPrimaryChain]);

      const {
        data: baseData,
        isLoading: isBaseLoading,
        refetch: refetchBase,
      } = useBaseUSDCTransactions({
        variables: { address: primaryWallet?.address || "", force: true },
        enabled: isETH,
      });

      const {
        data: stellarData,
        isLoading: isStellarLoading,
        refetch: refetchStellar,
      } = useStellarUSDCTransactions({
        variables: { address: primaryWallet?.address || "", force: true },
        enabled: !isETH,
      });

      const transactionData = useMemo(() => {
        return isETH ? baseData : stellarData;
      }, [baseData, stellarData, isETH]);

      const transactions = transactionData?.pages.flat() ?? [];

      const isTransactionLoading = useMemo(() => {
        return isETH ? isBaseLoading : isStellarLoading;
      }, [isBaseLoading, isStellarLoading, isETH]);

      const handleRefresh = useCallback(() => {
        if (isETH) {
          refetchBase();
        } else {
          refetchStellar();
        }
      }, [isETH, refetchBase, refetchStellar]);

      useImperativeHandle(ref, () => ({
        refresh: handleRefresh,
      }));

      const handleTransactionPress = (url: string) => {
        Linking.openURL(url);
      };

      return (
        <Card className="rounded-2xl border border-background-200 dark:border-background-800 bg-background-0 dark:bg-background-900 overflow-hidden">
          {/* Header */}
          <Pressable
            onPress={onViewAll}
            disabled={!onViewAll}
            className="px-4 py-3 bg-background-50 dark:bg-background-800/50 border-b border-background-200 dark:border-background-700"
          >
            <HStack className="items-center justify-between">
              <Text
                size="sm"
                className="font-semibold uppercase tracking-wide text-typography-500 dark:text-typography-400"
              >
                {t("transactions.recentActivity")}
              </Text>
              {onViewAll && transactions.length > 0 && (
                <HStack space="xs" className="items-center">
                  <Text
                    size="xs"
                    className="text-primary-500 dark:text-primary-400"
                  >
                    {t("general.viewAll")}
                  </Text>
                  <Icon
                    as={ChevronRightIcon}
                    size="xs"
                    className="text-primary-500 dark:text-primary-400"
                  />
                </HStack>
              )}
              {!onViewAll && transactions.length > 0 && (
                <Text
                  size="xs"
                  className="text-typography-400 dark:text-typography-500"
                >
                  {t("transactions.5Latest")}
                </Text>
              )}
            </HStack>
          </Pressable>

          {/* Content */}
          {isTransactionLoading ? (
            // Loading skeleton
            <VStack className="divide-y divide-background-100 dark:divide-background-800">
              <TransactionSkeleton />
              <TransactionSkeleton />
              <TransactionSkeleton />
            </VStack>
          ) : transactions.length === 0 ? (
            // Empty state
            <EmptyState />
          ) : (
            // Transaction list
            <VStack className="divide-y divide-background-100 dark:divide-background-800">
              {transactions.slice(0, 5).map((transaction, index) => (
                <TransactionCard
                  key={transaction.hash || index}
                  transaction={transaction}
                  onPress={() => handleTransactionPress(transaction.url)}
                />
              ))}
            </VStack>
          )}
        </Card>
      );
    }
  )
);

BalanceTransactions.displayName = "BalanceTransactions";
