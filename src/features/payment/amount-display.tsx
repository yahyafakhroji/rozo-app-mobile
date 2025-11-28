import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { CurrencyConverter } from "@/components/currency-converter";
import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useApp } from "@/providers/app.provider";
import type { DynamicStyles } from "./types";

type AmountDisplayProps = {
  amount: string;
  dynamicStyles: DynamicStyles;
};

export function AmountDisplay({ amount, dynamicStyles }: AmountDisplayProps) {
  const { defaultCurrency } = useApp();
  const { t } = useTranslation();

  // Format amount with appropriate decimal and thousand separators
  const formattedAmount = useMemo(() => {
    if (!amount) return "0";

    // Handle decimal separator
    const decimalSeparator = defaultCurrency?.decimalSeparator || ".";
    // Check if the amount ends with a decimal separator
    const endsWithSeparator = amount.endsWith(decimalSeparator);
    // Split by decimal separator
    const parts = amount.split(decimalSeparator);
    const integerPart = parts[0] || "0"; // Default to '0' if empty
    const decimalPart = parts.length > 1 ? parts[1] : "";

    // Format integer part with thousand separators
    const thousandSeparator = defaultCurrency?.thousandSeparator || ",";
    const formattedInteger =
      integerPart === "0"
        ? "0"
        : integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator);

    // Return formatted amount with decimal part if it exists or if amount ends with separator
    if (decimalPart) {
      return `${formattedInteger}${decimalSeparator}${decimalPart}`;
    } else if (endsWithSeparator) {
      return `${formattedInteger}${decimalSeparator}`;
    } else {
      return formattedInteger;
    }
  }, [amount, defaultCurrency]);

  return (
    <Card
      className={`rounded-xl border border-background-300 dark:border-background-700 bg-background-0 dark:bg-background-900 ${dynamicStyles.spacing.cardPadding}`}
    >
      <VStack space="sm" className="items-center">
        <Text
          size="sm"
          className="text-typography-500 dark:text-typography-400 text-center"
        >
          {t("general.amount")}
        </Text>
        <Text
          size="3xl"
          className={`font-bold text-typography-900 dark:text-typography-100 text-center ${dynamicStyles.fontSize.amount}`}
        >
          {`${formattedAmount} ${defaultCurrency?.code}`}
        </Text>
        {/* USD Conversion */}
        {defaultCurrency?.code !== "USD" && (
          <Box className="rounded-lg p-2">
            <CurrencyConverter
              amount={Number(amount)}
              className="text-center"
            />
          </Box>
        )}
        <Text
          size="sm"
          className="text-typography-400 dark:text-typography-500 text-center italic mt-2"
        >
          {t("payment.enterPaymentAmount")}
        </Text>
      </VStack>
    </Card>
  );
}
