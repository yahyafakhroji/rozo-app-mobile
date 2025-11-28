import { memo, useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { RefreshControl, ScrollView, View } from "react-native";

import { Card } from "@/components/ui/card";
import { VStack } from "@/components/ui/vstack";
import { useToast } from "@/hooks/use-toast";
import { useWalletBalance } from "@/hooks/use-wallet-balance";

import { DepositDialogRef, TopupSheet } from "../settings/deposit-sheet";
import { WithdrawDialogRef, WithdrawSheet } from "../settings/withdraw-sheet";
import { BalanceActions } from "./balance-actions";
import { BalanceHeader } from "./balance-header";
import { BalanceInfo } from "./balance-info";
import { BalanceTransactions } from "./balance-transactions";

export const BalanceScreen = memo(function BalanceScreen() {
  const { t } = useTranslation();
  const { refetch, isLoading } = useWalletBalance();
  const { success } = useToast();

  const depositDialogRef = useRef<DepositDialogRef>(null);
  const withdrawDialogRef = useRef<WithdrawDialogRef>(null);
  const transactionsRef = useRef<{ refresh: () => void }>(null);

  const [refreshing, setRefreshing] = useState(false);

  const handleReceivePress = useCallback(() => {
    depositDialogRef.current?.open();
  }, []);

  const handleWithdrawPress = useCallback(() => {
    withdrawDialogRef.current?.open();
  }, []);

  const handleTopUpConfirm = useCallback(
    (amount: string) => {
      success(t("deposit.topUpInitiated", { amount }));
    },
    [success, t]
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refetch();
    transactionsRef.current?.refresh();

    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, [refetch]);

  const handleBalanceRefresh = useCallback(() => {
    refetch();
    transactionsRef.current?.refresh();
  }, [refetch]);

  return (
    <>
      <ScrollView
        className="flex-1"
        contentContainerClassName="pb-6"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        <VStack space="lg">
          {/* Logo Header */}
          <BalanceHeader />

          {/* Balance Card with Actions */}
          <Card className="rounded-xl border border-background-300 dark:border-background-700 bg-background-0 dark:bg-background-900 overflow-hidden">
            {/* Balance Info */}
            <BalanceInfo isLoading={isLoading} />

            {/* Divider */}
            <View className="h-px bg-background-200 dark:bg-background-700 mx-4" />

            {/* Action Buttons */}
            <View className="p-4">
              <BalanceActions
                onReceivePress={handleReceivePress}
                onWithdrawPress={handleWithdrawPress}
              />
            </View>
          </Card>

          {/* Transaction List */}
          <BalanceTransactions ref={transactionsRef} />
        </VStack>
      </ScrollView>

      {/* Receive Sheet */}
      <TopupSheet
        ref={depositDialogRef}
        onConfirm={handleTopUpConfirm}
        onComplete={() => refetch()}
      />

      {/* Withdraw Sheet */}
      <WithdrawSheet ref={withdrawDialogRef} onSuccess={() => refetch()} />
    </>
  );
});
