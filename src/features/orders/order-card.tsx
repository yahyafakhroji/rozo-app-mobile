import { format } from "date-fns";
import { ClockIcon } from "lucide-react-native";
import React, { memo, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

import { Badge, BadgeText } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { getShortId, getStatusActionType } from "@/libs/utils";
import { type MerchantOrder } from "@/modules/api/schema/order";

interface OrderCardProps {
  order: MerchantOrder;
  onPress?: (order: MerchantOrder) => void;
}

export const OrderCard = memo(function OrderCard({
  order,
  onPress,
}: OrderCardProps) {
  const { t } = useTranslation();

  const formattedDate = useMemo(() => {
    if (!order.created_at) return null;
    return format(new Date(order.created_at), "MMM dd yyyy, HH:mm");
  }, [order.created_at]);

  return (
    <Pressable
      onPress={() => onPress?.(order)}
      className="active:opacity-80"
    >
      <Card className="rounded-xl border border-background-300 dark:border-background-700 bg-background-0 dark:bg-background-900 p-3">
        <VStack space="sm">
          {/* Header Row - Order ID & Status */}
          <HStack className="items-center justify-between">
            <Text
              size="sm"
              className="font-medium text-typography-500 dark:text-typography-400"
            >
              #{order.number ?? getShortId(order.order_id, 6)}
            </Text>
            <Badge
              size="md"
              variant="solid"
              action={getStatusActionType(order.status)}
            >
              <BadgeText>
                {t(`order.status.${order.status.toLowerCase()}`)}
              </BadgeText>
            </Badge>
          </HStack>

          {/* Amount */}
          <Text
            size="2xl"
            className="font-bold text-typography-900 dark:text-typography-100"
          >
            {order.display_amount} {order.display_currency}
          </Text>

          {/* Timestamp */}
          {formattedDate && (
            <HStack space="xs" className="items-center">
              <Icon
                as={ClockIcon}
                size="xs"
                className="text-typography-400 dark:text-typography-500"
              />
              <Text
                size="xs"
                className="text-typography-400 dark:text-typography-500"
              >
                {formattedDate}
              </Text>
            </HStack>
          )}
        </VStack>
      </Card>
    </Pressable>
  );
});
