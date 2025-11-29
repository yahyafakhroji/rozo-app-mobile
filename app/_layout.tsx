import { base, PrivyProvider } from "@privy-io/expo";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { ErrorBoundary } from "react-error-boundary";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  useRouteProtection,
  type RouteProtectionRule,
} from "@/hooks/use-route-protection";
import { privyClient } from "@/libs/privy-client";

import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import "../src/styles/global.css";

import { LoadingScreen } from "@/components/loading-screen";
import { PrivyReady } from "@/components/privy-ready";
import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";
import { VStack } from "@/components/ui/vstack";
import { NotificationProvider } from "@/modules/notifications";
import { AppProvider } from "@/providers/app.provider";
import { usePOSToggle } from "@/providers/preferences.provider";
import { QueryProvider } from "@/providers/query.provider";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from "@expo-google-fonts/inter";
import { usePrivy } from "@privy-io/expo";
import { PrivyElements } from "@privy-io/expo/ui";
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import type { ReactNode } from "react";
import { useCallback, useEffect } from "react";
import { StyleSheet } from "react-native";

export const unstable_settings = {
  initialRouteName: "(auth)",
};

// Set the animation options. This is optional.
SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  const onLayoutRootView = useCallback(async () => {
    // We hide the splash screen only when the app is ready AND fonts are loaded
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  if (
    !process.env.EXPO_PUBLIC_PRIVY_APP_ID ||
    !process.env.EXPO_PUBLIC_PRIVY_MOBILE_CLIENT_ID
  ) {
    return <Text>Missing Privy credentials</Text>;
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <GluestackUIProvider mode="system">
        <GestureHandlerRootView
          style={styles.container}
          onLayout={onLayoutRootView}
        >
          <ThemeProvider
            value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
          >
            <QueryProvider>
              <PrivyProvider
                appId={process.env.EXPO_PUBLIC_PRIVY_APP_ID}
                clientId={process.env.EXPO_PUBLIC_PRIVY_MOBILE_CLIENT_ID}
                supportedChains={[base]}
                client={privyClient}
                config={{
                  embedded: {
                    ethereum: {
                      createOnLogin: "off",
                    },
                  },
                }}
              >
                <PrivyReady>
                  <AppProvider>
                    <NotificationProvider>
                      <KeyboardProvider>
                        <RouteProtectionWrapper>
                          <AuthRouter />
                        </RouteProtectionWrapper>
                      </KeyboardProvider>
                    </NotificationProvider>
                  </AppProvider>

                  <StatusBar style="auto" />
                  <PrivyElements
                    config={{
                      appearance: {
                        accentColor: "#0a0a0a",
                      },
                    }}
                  />
                </PrivyReady>
              </PrivyProvider>
            </QueryProvider>
          </ThemeProvider>
        </GestureHandlerRootView>
      </GluestackUIProvider>
    </ErrorBoundary>
  );
}

function ErrorFallback({ error }: { error: Error }) {
  return (
    <View className="flex-1 items-center justify-center p-5 bg-background-0 dark:bg-background-950">
      <VStack space="md" className="items-center">
        <Text
          size="lg"
          className="font-bold text-typography-900 dark:text-typography-100"
        >
          Something went wrong:
        </Text>
        <Text
          size="sm"
          className="text-error-500 text-center"
        >
          {error.message}
        </Text>
      </VStack>
    </View>
  );
}

/**
 * Wrapper component that enables route protection
 * Must be inside AppProvider to access preferences context
 */
function RouteProtectionWrapper({ children }: { children: ReactNode }) {
  const { showPOS } = usePOSToggle();

  // Define protection rules
  const protectionRules: RouteProtectionRule[] = [
    {
      paths: ["/(main)/(tabs)/pos"],
      condition: () => showPOS,
      redirectTo: "/(main)/(tabs)",
      reason: "POS feature is disabled",
      onProtected: (pathname) => {
        console.log(`[Analytics] User attempted to access POS from: ${pathname}`);
      },
    },
  ];

  useRouteProtection(protectionRules);

  return <>{children}</>;
}

/**
 * Auth router component that handles navigation based on auth state
 */
function AuthRouter() {
  const { isReady, user } = usePrivy();
  const segments = useSegments();
  const router = useRouter();

  const inAuthGroup = segments[0] === "(auth)";
  const inMainGroup = segments[0] === "(main)";
  const isAuthenticated = !!user;

  useEffect(() => {
    if (!isReady) return;

    // Only redirect if we're in a defined group and auth state doesn't match
    if (isAuthenticated && inAuthGroup) {
      router.replace("/(main)/(tabs)");
    } else if (!isAuthenticated && inMainGroup) {
      router.replace("/(auth)/login");
    }
  }, [isReady, isAuthenticated, inAuthGroup, inMainGroup, router]);

  if (!isReady) {
    return <LoadingScreen />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(main)" />
    </Stack>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
