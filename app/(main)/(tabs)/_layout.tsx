import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { rawColors, tabBarConfig } from "@/libs/design-system";
import { spacing } from "@/libs/responsive";
import { cn } from "@/libs/utils";
import { usePOSToggle } from "@/providers/preferences.provider";
import { Tabs } from "expo-router";
import {
  Coins,
  Settings2Icon,
  ShoppingBagIcon,
  ShoppingCartIcon,
} from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

export default function TabsLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { showPOS } = usePOSToggle();

  const colors = isDark ? rawColors.dark : rawColors.light;

  return (
    <SafeAreaProvider>
      <View
        className="flex-1 bg-background-50 dark:bg-background-950"
        style={{ backgroundColor: colors.backgroundSecondary }}
      >
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarStyle: {
              position: "absolute",
              bottom: Math.max(insets.bottom, spacing.lg),
              left: spacing.lg,
              right: spacing.lg,
              height: tabBarConfig.height,
              backgroundColor: colors.tabBar,
              borderRadius: tabBarConfig.borderRadius,
              borderTopWidth: 0,
              elevation: 8,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: isDark ? 0.3 : 0.15,
              shadowRadius: 12,
              paddingBottom: 0,
              paddingTop: 0,
              ...(isDark
                ? {}
                : {
                    borderWidth: 1,
                    borderColor: colors.border,
                  }),
            },
            tabBarItemStyle: {
              paddingVertical: tabBarConfig.topPadding,
            },
            tabBarActiveTintColor: isDark ? "#FFFFFF" : "#0a0a0a",
            tabBarInactiveTintColor: isDark ? "#6B7280" : "#9CA3AF",
            tabBarIconStyle: {
              marginBottom: 2,
            },
            animation: "fade" as const,
            tabBarLabelPosition: "below-icon",
            tabBarLabel: ({
              children,
              color,
              focused,
            }: {
              children: string;
              color: string;
              focused: boolean;
            }) => (
              <Text
                className={cn(
                  "text-center",
                  focused ? "font-semibold" : "font-medium"
                )}
                style={{
                  color,
                  fontSize: tabBarConfig.labelSize,
                  marginTop: -2,
                }}
              >
                {children}
              </Text>
            ),
            sceneStyle: {
              paddingTop: insets.top + spacing.md,
              paddingLeft: insets.left + spacing.lg,
              paddingRight: insets.right + spacing.lg,
              paddingBottom:
                tabBarConfig.height +
                Math.max(insets.bottom, spacing.lg) +
                spacing.lg,
              backgroundColor: colors.backgroundSecondary,
            },
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: t("balance.title"),
              tabBarIcon: ({
                color,
                focused,
              }: {
                color: string;
                focused: boolean;
              }) => (
                <View
                  className={cn(
                    "items-center justify-center rounded-xl",
                    focused && "bg-primary-500/10 dark:bg-primary-400/10"
                  )}
                  style={{
                    width: 40,
                    height: 32,
                  }}
                >
                  <Icon as={Coins} size="md" style={{ color }} />
                </View>
              ),
              tabBarButtonTestID: "balance-tab",
            }}
          />

          <Tabs.Screen
            name="pos"
            options={
              showPOS
                ? {
                    title: t("pos.title"),
                    tabBarIcon: ({
                      color,
                      focused,
                    }: {
                      color: string;
                      focused: boolean;
                    }) => (
                      <View
                        className={cn(
                          "items-center justify-center rounded-xl",
                          focused && "bg-primary-500/10 dark:bg-primary-400/10"
                        )}
                        style={{
                          width: 40,
                          height: 32,
                        }}
                      >
                        <Icon as={ShoppingCartIcon} size="md" style={{ color }} />
                      </View>
                    ),
                    tabBarButtonTestID: "pos-tab",
                  }
                : {
                    href: null,
                  }
            }
          />

          <Tabs.Screen
            name="orders"
            options={{
              title: t("order.title"),
              tabBarIcon: ({
                color,
                focused,
              }: {
                color: string;
                focused: boolean;
              }) => (
                <View
                  className={cn(
                    "items-center justify-center rounded-xl",
                    focused && "bg-primary-500/10 dark:bg-primary-400/10"
                  )}
                  style={{
                    width: 40,
                    height: 32,
                  }}
                >
                  <Icon as={ShoppingBagIcon} size="md" style={{ color }} />
                </View>
              ),
              tabBarButtonTestID: "orders-tab",
            }}
          />

          <Tabs.Screen
            name="transactions"
            options={{
              href: null,
            }}
          />

          <Tabs.Screen
            name="settings"
            options={{
              title: t("settings.title"),
              tabBarIcon: ({
                color,
                focused,
              }: {
                color: string;
                focused: boolean;
              }) => (
                <View
                  className={cn(
                    "items-center justify-center rounded-xl",
                    focused && "bg-primary-500/10 dark:bg-primary-400/10"
                  )}
                  style={{
                    width: 40,
                    height: 32,
                  }}
                >
                  <Icon as={Settings2Icon} size="md" style={{ color }} />
                </View>
              ),
              tabBarButtonTestID: "settings-tab",
            }}
          />
        </Tabs>
      </View>
    </SafeAreaProvider>
  );
}
