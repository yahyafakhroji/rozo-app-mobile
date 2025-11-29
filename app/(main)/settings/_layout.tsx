import { Stack } from "expo-router";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { rawColors } from "@/libs/design-system";

export default function SettingsLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? rawColors.dark : rawColors.light;

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: colors.backgroundSecondary,
        },
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="wallet" />
      <Stack.Screen name="security" />
    </Stack>
  );
}
