import { memo, useMemo } from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { CopyIcon } from "lucide-react-native";
import * as Clipboard from "expo-clipboard";

import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import { Pressable } from "@/components/ui/pressable";
import { Icon } from "@/components/ui/icon";
import { getShortId } from "@/libs/utils";
import { useWallet } from "@/providers";
import { useApp } from "@/providers/app.provider";
import { useToast } from "@/hooks/use-toast";

interface BalanceInfoProps {
  isLoading: boolean;
}

export const BalanceInfo = memo(function BalanceInfo({
  isLoading,
}: BalanceInfoProps) {
  const { t } = useTranslation();
  const { primaryWallet } = useApp();
  const { balances } = useWallet();
  const { success } = useToast();

  const usdcBalance = useMemo(() => {
    return (balances || []).find(
      (item) => (item.asset || "").toUpperCase() === "USDC"
    );
  }, [balances]);

  const shortAddress = useMemo(() => {
    return getShortId(primaryWallet?.address ?? "", 6, 4);
  }, [primaryWallet?.address]);

  const handleCopyAddress = async () => {
    if (primaryWallet?.address) {
      await Clipboard.setStringAsync(primaryWallet.address);
      success(t("general.copied"));
    }
  };

  return (
    <View className="items-center py-4">
      {/* Balance Display */}
      <Text size="sm" className="text-typography-500 dark:text-typography-400 mb-1">
        {t("general.walletBalance")}
      </Text>

      {isLoading ? (
        <View className="h-16 items-center justify-center">
          <Spinner size="small" />
        </View>
      ) : (
        <HStack space="sm" className="items-baseline">
          <Heading size="4xl" className="font-bold text-typography-950 dark:text-typography-50">
            {Number(usdcBalance?.display_values?.usdc || 0).toFixed(2)}
          </Heading>
          <Text size="lg" className="text-typography-500 dark:text-typography-400">
            {(usdcBalance?.asset ?? "USDC").toUpperCase()}
          </Text>
        </HStack>
      )}

      {/* Wallet Address Chip */}
      {primaryWallet && (
        <Pressable
          onPress={handleCopyAddress}
          className="flex-row items-center mt-3 px-3 py-1.5 rounded-full bg-background-100 dark:bg-background-800 active:bg-background-200 dark:active:bg-background-700"
        >
          <Text size="sm" className="text-typography-600 dark:text-typography-400 mr-1.5">
            {shortAddress}
          </Text>
          <Icon
            as={CopyIcon}
            size="xs"
            className="text-typography-500 dark:text-typography-400"
          />
        </Pressable>
      )}
    </View>
  );
});
