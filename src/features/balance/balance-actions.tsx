import { memo } from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react-native";

import { Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { HStack } from "@/components/ui/hstack";
import { balanceConfig } from "@/libs/design-system";

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
      {/* Receive Action - Green CTA */}
      <Pressable
        onPress={onReceivePress}
        className="flex-1 flex-row items-center justify-center bg-success-500 active:bg-success-600 rounded-2xl"
        style={{ height: balanceConfig.actionButtonHeight }}
      >
        <View className="w-8 h-8 rounded-full bg-white/20 items-center justify-center mr-2">
          <Icon as={ArrowDownIcon} size="md" className="text-white" />
        </View>
        <Text size="md" className="font-semibold text-white">
          {t("general.receive")}
        </Text>
      </Pressable>

      {/* Send/Withdraw Action - Primary CTA */}
      <Pressable
        onPress={onWithdrawPress}
        className="flex-1 flex-row items-center justify-center bg-primary-500 active:bg-primary-600 rounded-2xl"
        style={{ height: balanceConfig.actionButtonHeight }}
      >
        <View className="w-8 h-8 rounded-full bg-white/20 items-center justify-center mr-2">
          <Icon as={ArrowUpIcon} size="md" className="text-white" />
        </View>
        <Text size="md" className="font-semibold text-white">
          {t("general.send")}
        </Text>
      </Pressable>
    </HStack>
  );
});
