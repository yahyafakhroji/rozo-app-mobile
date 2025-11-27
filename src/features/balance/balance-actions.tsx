import { memo } from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react-native";

import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { HStack } from "@/components/ui/hstack";

interface BalanceActionsProps {
  onReceivePress: () => void;
  onWithdrawPress: () => void;
}

export const BalanceActions = memo(function BalanceActions({
  onReceivePress,
  onWithdrawPress,
}: BalanceActionsProps) {
  const { t } = useTranslation();

  return (
    <HStack space="md" className="w-full">
      {/* Receive Action */}
      <Pressable
        onPress={onReceivePress}
        className="flex-1 active:opacity-80"
      >
        <Card className="rounded-xl border border-background-300 dark:border-background-700 bg-background-0 dark:bg-background-900 p-4 items-center">
          <View className="w-12 h-12 rounded-full bg-success-100 dark:bg-success-900/30 items-center justify-center mb-2">
            <Icon
              as={ArrowDownIcon}
              size="lg"
              className="text-success-600 dark:text-success-400"
            />
          </View>
          <Text size="sm" className="font-semibold text-typography-900 dark:text-typography-100">
            {t("general.receive")}
          </Text>
        </Card>
      </Pressable>

      {/* Withdraw Action */}
      <Pressable
        onPress={onWithdrawPress}
        className="flex-1 active:opacity-80"
      >
        <Card className="rounded-xl border border-background-300 dark:border-background-700 bg-background-0 dark:bg-background-900 p-4 items-center">
          <View className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 items-center justify-center mb-2">
            <Icon
              as={ArrowUpIcon}
              size="lg"
              className="text-primary-600 dark:text-primary-400"
            />
          </View>
          <Text size="sm" className="font-semibold text-typography-900 dark:text-typography-100">
            {t("general.withdraw")}
          </Text>
        </Card>
      </Pressable>
    </HStack>
  );
});
