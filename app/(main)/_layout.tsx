import { LoadingScreen } from "@/components/loading-screen";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { cn } from "@/libs/utils";
import { rawColors, tabBarConfig } from "@/libs/design-system";
import { useAuth, useMerchant, useWallet } from "@/providers";
import { usePOSToggle } from "@/providers/preferences.provider";
import { AuthBoundary } from "@privy-io/expo";
import { Redirect, Tabs } from "expo-router";
import {
  Coins,
  Settings2Icon,
  ShoppingBagIcon,
  ShoppingCartIcon,
} from "lucide-react-native";
import { useColorScheme } from "nativewind";
import type React from "react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Platform, View } from "react-native";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { spacing } from "@/libs/responsive";

export default function TabLayout() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { showPOS } = usePOSToggle();

  const colors = isDark ? rawColors.dark : rawColors.light;

  return (
    <AuthBoundary
      loading={<LoadingScreen />}
      unauthenticated={<Redirect href="/login" />}
    >
      <WalletHandler>
        <SafeAreaProvider>
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
                // Border for light mode
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
                // Add bottom padding to account for floating tab bar
                paddingBottom: tabBarConfig.height + Math.max(insets.bottom, spacing.lg) + spacing.lg,
                backgroundColor: colors.backgroundSecondary,
              },
            }}
          >
            {/* Main Screen - Balance (First Tab) */}
            <Tabs.Screen
              name="balance"
              options={{
                title: t("balance.title"),
                tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
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
                    <Icon
                      as={Coins}
                      size="md"
                      style={{ color }}
                    />
                  </View>
                ),
                tabBarButtonTestID: "balance-tab",
              }}
            />

            {/* Conditional POS Tab - Only visible when enabled */}
            <Tabs.Screen
              name="pos"
              options={
                showPOS
                  ? {
                      title: t("pos.title"),
                      tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
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
                          <Icon
                            as={ShoppingCartIcon}
                            size="md"
                            style={{ color }}
                          />
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
                tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
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
                    <Icon
                      as={ShoppingBagIcon}
                      size="md"
                      style={{ color }}
                    />
                  </View>
                ),
                tabBarButtonTestID: "orders-tab",
              }}
            />

            {/* Hidden utility screen - accessible via navigation only */}
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
                tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
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
                    <Icon
                      as={Settings2Icon}
                      size="md"
                      style={{ color }}
                    />
                  </View>
                ),
                tabBarButtonTestID: "settings-tab",
              }}
            />
          </Tabs>
        </SafeAreaProvider>
      </WalletHandler>
    </AuthBoundary>
  );
}

function WalletHandler({ children }: { children: React.ReactNode }) {
  const { createWallet, hasWallet } = useWallet();
  const { user, refreshUser } = useAuth();
  const { merchant, refetchMerchant } = useMerchant();

  useEffect(() => {
    if (user && !hasWallet) {
      createWallet("USDC_BASE");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, hasWallet]);

  useEffect(() => {
    if (!merchant) {
      refetchMerchant({ force: true, showToast: false });
    }

    if (!user) {
      refreshUser();
    }
  }, [merchant, user, refreshUser, refetchMerchant]);

  if (!merchant || !user) {
    return <LoadingScreen />;
  }

  return children;
}
