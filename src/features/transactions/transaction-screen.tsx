import { memo } from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";

import { ScreenHeader } from "@/components/screen-header";
import { TransactionList } from "./transaction-list";

export const TransactionScreen = memo(function TransactionScreen() {
  const { t } = useTranslation();

  return (
    <View className="flex-1">
      <ScreenHeader
        title={t("transaction.recentTransactions")}
        subtitle={t("transaction.recentTransactionsDesc")}
        showBack
      />

      <View className="flex-1 -mx-4">
        <TransactionList />
      </View>
    </View>
  );
});
