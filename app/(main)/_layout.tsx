import { LoadingScreen } from "@/components/loading-screen";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { rawColors } from "@/libs/design-system";
import { useAuth, useMerchant, useWallet } from "@/providers";
import { Stack } from "expo-router";
import type React from "react";
import { useEffect } from "react";

export default function MainLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? rawColors.dark : rawColors.light;

  return (
    <WalletHandler>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: colors.backgroundSecondary,
          },
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="settings"
          options={{
            animation: "slide_from_right",
          }}
        />
      </Stack>
    </WalletHandler>
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
