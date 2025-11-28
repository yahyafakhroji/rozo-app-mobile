import { memo } from "react";
import { Image, View } from "react-native";
import { Text } from "@/components/ui/text";
import { useColorScheme } from "nativewind";

const logoSource = require("@/assets/images/icon.png");

export const BalanceHeader = memo(function BalanceHeader() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <View className="flex-row items-center py-2">
      <Image
        source={logoSource}
        style={{
          width: 36,
          height: 36,
          tintColor: isDark ? "#FFFFFF" : "#0a0a0a",
        }}
        resizeMode="contain"
      />
      <Text
        size="xl"
        className="font-bold text-typography-950 dark:text-typography-50 ml-2"
      >
        Rozo
      </Text>
    </View>
  );
});
