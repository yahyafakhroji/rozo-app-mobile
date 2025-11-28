import { Stack, useRouter } from "expo-router";
import React from "react";
import { Alert } from "react-native";

import { FocusAwareStatusBar } from "@/components/focus-aware-status-bar";
import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";
import { VStack } from "@/components/ui/vstack";

type ErrorScreenProps = {
  message?: string;
};

/**
 * Error screen component displayed when application encounters an error
 */
export default function ErrorScreen({
  message = "Something went wrong",
}: ErrorScreenProps) {
  const router = useRouter();

  /**
   * Handle app reload attempt
   */
  function handleReload() {
    try {
      // Clear tokens but keep state
      router.replace("/login");
    } catch {
      Alert.alert(
        "Reload Failed",
        "Could not reload the application. Please try again."
      );
    }
  }

  return (
    <>
      <FocusAwareStatusBar />
      <Stack.Screen options={{ title: "Error", headerShown: false }} />
      <View className="flex-1 items-center justify-center bg-background-0 dark:bg-background-950 p-6">
        <VStack space="md" className="items-center w-full">
          <Heading
            size="2xl"
            className="text-typography-900 dark:text-typography-100 text-center"
          >
            Oops!
          </Heading>
          <Text
            size="md"
            className="text-typography-500 dark:text-typography-400 text-center mb-6"
          >
            {message}
          </Text>
          <Button
            onPress={handleReload}
            variant="solid"
            size="lg"
            action="primary"
            className="w-full rounded-xl"
          >
            <ButtonText>Reload Application</ButtonText>
          </Button>
        </VStack>
      </View>
    </>
  );
}
