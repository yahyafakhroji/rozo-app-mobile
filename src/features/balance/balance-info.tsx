import { memo, useMemo } from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { CopyIcon, CheckIcon, RefreshCwIcon } from "lucide-react-native";
import * as Clipboard from "expo-clipboard";
import { useState, useCallback } from "react";

import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { Pressable } from "@/components/ui/pressable";
import { Icon } from "@/components/ui/icon";
import { getShortId } from "@/libs/utils";
import { useWallet } from "@/providers";
import { useApp } from "@/providers/app.provider";
import { useToast } from "@/hooks/use-toast";
import { timing } from "@/libs/design-system";

interface BalanceInfoProps {
  isLoading: boolean;
  onRefresh?: () => void;
}

export const BalanceInfo = memo(function BalanceInfo({
  isLoading,
  onRefresh,
}: BalanceInfoProps) {
  const { t } = useTranslation();
  const { primaryWallet } = useApp();
  const { balances, preferredPrimaryChain } = useWallet();
  const { success } = useToast();
  const [copied, setCopied] = useState(false);

  const usdcBalance = useMemo(() => {
    return (balances || []).find(
      (item) => (item.asset || "").toUpperCase() === "USDC"
    );
  }, [balances]);

  const shortAddress = useMemo(() => {
    return getShortId(primaryWallet?.address ?? "", 6, 4);
  }, [primaryWallet?.address]);

  const networkName = useMemo(() => {
    return preferredPrimaryChain === "USDC_BASE" ? "Base" : "Stellar";
  }, [preferredPrimaryChain]);

  const handleCopyAddress = useCallback(async () => {
    if (primaryWallet?.address) {
      await Clipboard.setStringAsync(primaryWallet.address);
      setCopied(true);
      success(t("general.copied"));
      setTimeout(() => setCopied(false), 2000);
    }
  }, [primaryWallet?.address, success, t]);

  const formattedBalance = useMemo(() => {
    const balance = Number(usdcBalance?.display_values?.usdc || 0);
    return balance.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }, [usdcBalance]);

  return (
    <VStack space="md" className="items-center py-6">
      {/* Hero Balance Display */}
      <VStack space="xs" className="items-center">
        <Text
          size="sm"
          className="text-typography-500 dark:text-typography-400 uppercase tracking-wide"
        >
          {t("general.walletBalance")}
        </Text>

        {isLoading ? (
          <View className="items-center">
            {/* Skeleton loader */}
            <View className="h-14 w-48 bg-background-200 dark:bg-background-700 rounded-xl animate-pulse" />
            <View className="h-5 w-20 bg-background-200 dark:bg-background-700 rounded-lg mt-2 animate-pulse" />
          </View>
        ) : (
          <HStack space="sm" className="items-baseline">
            <Heading
              size="4xl"
              className="font-bold text-typography-950 dark:text-typography-50"
            >
              {formattedBalance}
            </Heading>
            <Text
              size="xl"
              className="font-semibold text-typography-500 dark:text-typography-400"
            >
              {(usdcBalance?.asset ?? "USDC").toUpperCase()}
            </Text>
          </HStack>
        )}
      </VStack>

      {/* Network Badge & Address */}
      {primaryWallet && (
        <VStack space="sm" className="items-center">
          {/* Network Indicator */}
          <HStack space="xs" className="items-center">
            <View className="w-2 h-2 rounded-full bg-success-500" />
            <Text
              size="xs"
              className="text-typography-500 dark:text-typography-400"
            >
              {networkName} Network
            </Text>
            {onRefresh && (
              <Pressable
                onPress={onRefresh}
                disabled={isLoading}
                className="ml-1 p-1 rounded-full active:bg-background-100 dark:active:bg-background-800"
              >
                <Icon
                  as={RefreshCwIcon}
                  size="xs"
                  className={`text-typography-400 ${isLoading ? "animate-spin" : ""}`}
                />
              </Pressable>
            )}
          </HStack>

          {/* Wallet Address Chip */}
          <Pressable
            onPress={handleCopyAddress}
            className="flex-row items-center px-4 py-2 rounded-full bg-background-100 dark:bg-background-800 active:bg-background-200 dark:active:bg-background-700"
          >
            <Text
              size="sm"
              className="font-medium text-typography-600 dark:text-typography-400 mr-2"
            >
              {shortAddress}
            </Text>
            <Icon
              as={copied ? CheckIcon : CopyIcon}
              size="sm"
              className={
                copied
                  ? "text-success-500"
                  : "text-typography-500 dark:text-typography-400"
              }
            />
          </Pressable>
        </VStack>
      )}
    </VStack>
  );
});
