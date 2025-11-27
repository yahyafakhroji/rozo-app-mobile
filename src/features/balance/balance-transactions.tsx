import { forwardRef, useCallback, useImperativeHandle, useMemo, memo } from "react";
import { useTranslation } from "react-i18next";
import { Linking, View } from "react-native";

import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { useBaseUSDCTransactions } from "@/modules/api/api/base-transaction";
import { useStellarUSDCTransactions } from "@/modules/api/api/stellar-transaction";
import { useApp } from "@/providers/app.provider";
import { useWallet } from "@/providers";

import EmptyTransactionsState from "../transactions/empty-transactions";
import { TransactionCard } from "../transactions/transaction-card";

interface BalanceTransactionsProps {
  onRefresh?: () => void;
}

export const BalanceTransactions = memo(
  forwardRef<{ refresh: () => void }, BalanceTransactionsProps>(
    function BalanceTransactions({ onRefresh }, ref) {
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

      // Loading State
      if (isTransactionLoading) {
        return (
          <Card className="rounded-xl border border-background-300 dark:border-background-700 bg-background-0 dark:bg-background-900 overflow-hidden">
            {/* Header */}
            <View className="px-4 py-3 bg-background-50 dark:bg-background-800 border-b border-background-200 dark:border-background-700">
              <Text size="sm" className="font-semibold uppercase tracking-wide text-typography-500 dark:text-typography-400">
                {t("transactions.title")}
              </Text>
            </View>
            {/* Loading */}
            <View className="py-8 items-center justify-center">
              <Spinner size="small" />
            </View>
          </Card>
        );
      }

      // Empty State
      if (transactions.length === 0) {
        return (
          <Card className="rounded-xl border border-background-300 dark:border-background-700 bg-background-0 dark:bg-background-900 overflow-hidden">
            {/* Header */}
            <View className="px-4 py-3 bg-background-50 dark:bg-background-800 border-b border-background-200 dark:border-background-700">
              <Text size="sm" className="font-semibold uppercase tracking-wide text-typography-500 dark:text-typography-400">
                {t("transactions.title")}
              </Text>
            </View>
            {/* Empty */}
            <View className="py-4">
              <EmptyTransactionsState />
            </View>
          </Card>
        );
      }

      // Transactions List
      return (
        <Card className="rounded-xl border border-background-300 dark:border-background-700 bg-background-0 dark:bg-background-900 overflow-hidden">
          {/* Header */}
          <View className="px-4 py-3 bg-background-50 dark:bg-background-800 border-b border-background-200 dark:border-background-700">
            <HStack className="items-center justify-between">
              <Text size="sm" className="font-semibold uppercase tracking-wide text-typography-500 dark:text-typography-400">
                {t("transactions.title")}
              </Text>
              <Text size="xs" className="text-typography-400 dark:text-typography-500">
                {t("transactions.5Latest")}
              </Text>
            </HStack>
          </View>

          {/* Transaction Items */}
          <VStack className="divide-y divide-background-200 dark:divide-background-700">
            {transactions.slice(0, 5).map((transaction, index) => (
              <TransactionCard
                key={transaction.hash || index}
                transaction={transaction}
                onPress={() => handleTransactionPress(transaction.url)}
              />
            ))}
          </VStack>
        </Card>
      );
    }
  )
);

BalanceTransactions.displayName = "BalanceTransactions";
