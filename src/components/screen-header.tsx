import { memo } from "react";
import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { ChevronLeftIcon } from "lucide-react-native";
import { useRouter } from "expo-router";
import { cn } from "@/libs/utils";

interface ScreenHeaderProps {
  /** Main title of the screen */
  title: string;
  /** Optional subtitle/description */
  subtitle?: string;
  /** Show back button */
  showBack?: boolean;
  /** Custom back handler (defaults to router.back) */
  onBack?: () => void;
  /** Right side action element */
  rightElement?: React.ReactNode;
  /** Additional className for container */
  className?: string;
  /** Size variant */
  size?: "sm" | "md" | "lg";
}

export const ScreenHeader = memo(function ScreenHeader({
  title,
  subtitle,
  showBack = false,
  onBack,
  rightElement,
  className,
  size = "md",
}: ScreenHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  const titleSizes = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl",
  };

  return (
    <View className={cn("mb-6", className)}>
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          {showBack && (
            <Pressable
              onPress={handleBack}
              className="mr-3 p-1 -ml-1 rounded-full active:bg-background-100 dark:active:bg-background-800"
            >
              <Icon
                as={ChevronLeftIcon}
                size="xl"
                className="text-typography-900 dark:text-typography-100"
              />
            </Pressable>
          )}
          <View className="flex-1">
            <Heading
              size={size === "sm" ? "md" : size === "lg" ? "2xl" : "xl"}
              className="text-typography-950 dark:text-typography-50"
            >
              {title}
            </Heading>
            {subtitle && (
              <Text
                size="sm"
                className="text-typography-500 dark:text-typography-400 mt-1"
              >
                {subtitle}
              </Text>
            )}
          </View>
        </View>
        {rightElement && <View className="ml-4">{rightElement}</View>}
      </View>
    </View>
  );
});
