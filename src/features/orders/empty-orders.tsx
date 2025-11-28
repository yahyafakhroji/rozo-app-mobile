import { ShoppingBagIcon } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

export default function EmptyOrdersState() {
  const { t } = useTranslation();

  return (
    <VStack space="sm" className="items-center py-12 px-8">
      <View className="w-20 h-20 rounded-full bg-background-100 dark:bg-background-800 items-center justify-center mb-2">
        <Icon
          as={ShoppingBagIcon}
          size="xl"
          className="text-typography-300 dark:text-typography-600"
        />
      </View>
      <Text
        size="lg"
        className="font-semibold text-typography-900 dark:text-typography-100 text-center"
      >
        {t("order.noOrdersYet")}
      </Text>
      <Text
        size="sm"
        className="text-typography-500 dark:text-typography-400 text-center leading-6"
      >
        {t("order.noOrdersYetDesc")}
      </Text>
    </VStack>
  );
}
