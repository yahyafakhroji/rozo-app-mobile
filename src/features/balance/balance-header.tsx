import { memo } from "react";
import { Image, View } from "react-native";
import { QrCodeIcon, BellIcon } from "lucide-react-native";

import { Text } from "@/components/ui/text";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { useColorScheme } from "@/hooks/use-color-scheme";

const logoSource = require("@/assets/images/icon.png");

interface BalanceHeaderProps {
  onQRPress?: () => void;
  onNotificationPress?: () => void;
}

export const BalanceHeader = memo(function BalanceHeader({
  onQRPress,
  onNotificationPress,
}: BalanceHeaderProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <View className="flex-row items-center justify-between">
      {/* Logo & App Name */}
      <HStack space="sm" className="items-center">
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
          className="font-bold text-typography-950 dark:text-typography-50"
        >
          Rozo
        </Text>
      </HStack>

      {/* Quick Actions */}
      <HStack space="sm">
        {onQRPress && (
          <Pressable
            onPress={onQRPress}
            className="w-10 h-10 items-center justify-center rounded-full bg-background-100 dark:bg-background-800 active:bg-background-200 dark:active:bg-background-700"
          >
            <Icon
              as={QrCodeIcon}
              size="md"
              className="text-typography-700 dark:text-typography-300"
            />
          </Pressable>
        )}
        {onNotificationPress && (
          <Pressable
            onPress={onNotificationPress}
            className="w-10 h-10 items-center justify-center rounded-full bg-background-100 dark:bg-background-800 active:bg-background-200 dark:active:bg-background-700"
          >
            <Icon
              as={BellIcon}
              size="md"
              className="text-typography-700 dark:text-typography-300"
            />
          </Pressable>
        )}
      </HStack>
    </View>
  );
});
