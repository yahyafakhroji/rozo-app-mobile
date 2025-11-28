import { memo, useMemo } from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react-native";

import { Text } from "@/components/ui/text";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { getShortId } from "@/libs/utils";
import { transactionConfig, walletColors } from "@/libs/design-system";
import { type Transaction } from "@/modules/api/schema/transaction";

interface TransactionCardProps {
  transaction: Transaction;
  onPress?: (transaction: Transaction) => void;
}

export const TransactionCard = memo(function TransactionCard({
  transaction,
  onPress,
}: TransactionCardProps) {
  const { t } = useTranslation();

  const isIncoming = transaction.direction === "IN";

  const iconConfig = useMemo(() => {
    return isIncoming
      ? {
          icon: ArrowDownIcon,
          bgClass: walletColors.receive.bg,
          iconClass: walletColors.receive.icon,
        }
      : {
          icon: ArrowUpIcon,
          bgClass: walletColors.send.bg,
          iconClass: walletColors.send.icon,
        };
  }, [isIncoming]);

  const formattedValue = useMemo(() => {
    const prefix = isIncoming ? "+" : "-";
    return `${prefix}${transaction.value}`;
  }, [isIncoming, transaction.value]);

  const formattedHash = useMemo(() => {
    return transaction.hash ? getShortId(transaction.hash, 6, 4) : null;
  }, [transaction.hash]);

  const formattedTimestamp = useMemo(() => {
    if (!transaction.timestamp) return null;
    try {
      // If timestamp is already a formatted string, use it directly
      if (typeof transaction.timestamp === "string") {
        return transaction.timestamp;
      }
      return transaction.timestamp;
    } catch {
      return null;
    }
  }, [transaction.timestamp]);

  return (
    <Pressable
      onPress={() => onPress?.(transaction)}
      className="active:bg-background-50 dark:active:bg-background-800"
    >
      <HStack
        space="md"
        className="items-center px-4 py-3"
      >
        {/* Transaction Icon */}
        <View
          className={`items-center justify-center rounded-full ${iconConfig.bgClass}`}
          style={{
            width: transactionConfig.iconSize,
            height: transactionConfig.iconSize,
          }}
        >
          <Icon
            as={iconConfig.icon}
            size="md"
            className={iconConfig.iconClass}
          />
        </View>

        {/* Transaction Details */}
        <VStack space="xs" className="flex-1">
          <HStack className="items-center justify-between">
            <Text
              size="md"
              className="font-semibold text-typography-900 dark:text-typography-100"
            >
              {t(`transaction.direction.${transaction.direction}`)}
            </Text>
            <Text
              size="md"
              className={`font-bold ${
                isIncoming
                  ? "text-success-600 dark:text-success-400"
                  : "text-typography-900 dark:text-typography-100"
              }`}
            >
              {formattedValue}
            </Text>
          </HStack>

          <HStack className="items-center justify-between">
            <Text
              size="sm"
              className="text-typography-500 dark:text-typography-400"
            >
              {formattedHash || t("general.unknown")}
            </Text>
            <Text
              size="sm"
              className="text-typography-500 dark:text-typography-400"
            >
              {transaction.tokenSymbol}
            </Text>
          </HStack>

          {formattedTimestamp && (
            <Text
              size="xs"
              className="text-typography-400 dark:text-typography-500"
            >
              {formattedTimestamp}
            </Text>
          )}
        </VStack>
      </HStack>
    </Pressable>
  );
});
