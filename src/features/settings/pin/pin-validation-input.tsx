import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
} from "@/components/ui/actionsheet";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";
import { VStack } from "@/components/ui/vstack";
import { useToast } from "@/hooks/use-toast";
import { useApp } from "@/providers/app.provider";
import { getPinInputSize, spacing } from "@/libs/responsive";
import { rawColors, timing } from "@/libs/design-system";
import React, { useEffect, useRef, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Keyboard } from "react-native";
import { OtpInput } from "react-native-otp-entry";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColorScheme } from "@/hooks/use-color-scheme";

export enum ValidationState {
  IDLE = "IDLE",
  VALIDATING = "VALIDATING",
  SUCCESS = "SUCCESS",
  ERROR = "ERROR",
  BLOCKED = "BLOCKED",
}

interface PINValidationInputProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  onValidate: (pin: string) => Promise<void>;
  validationState: ValidationState;
  errorMessage?: string;
  attemptsRemaining?: number;
  isBlocked?: boolean;
}

export const PINValidationInput: React.FC<PINValidationInputProps> = ({
  isOpen,
  onClose,
  title,
  description,
  onValidate,
  validationState,
  errorMessage,
  attemptsRemaining,
  isBlocked = false,
}) => {
  const { t } = useTranslation();
  const { error: showError } = useToast();
  const { logout } = useApp();
  const insets = useSafeAreaInsets();
  const otpInputRef = useRef<any>(null);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? rawColors.dark : rawColors.light;

  // Responsive PIN input sizing
  const pinSize = useMemo(() => getPinInputSize(), []);

  // Auto-focus OTP input when sheet opens
  useEffect(() => {
    if (isOpen && otpInputRef.current) {
      setTimeout(() => {
        otpInputRef.current?.focus();
      }, timing.focusDelay);
    }
  }, [isOpen]);

  // Clear PIN on error
  useEffect(() => {
    if (validationState === ValidationState.ERROR && otpInputRef.current) {
      setTimeout(() => {
        otpInputRef.current?.clear();
      }, timing.pinClearDelay);
    }
  }, [validationState]);

  // Handle blocked state - show error toast and trigger logout
  useEffect(() => {
    if (isBlocked && validationState === ValidationState.BLOCKED) {
      showError(t("pin.validation.blocked"), { duration: 5000 });

      // Close the modal and trigger logout after a short delay
      onClose();
      setTimeout(() => {
        logout();
      }, 1000);
    }
  }, [isBlocked, validationState, showError, onClose, logout, t]);

  const handlePinFilled = async (text: string) => {
    await onValidate(text);
  };

  const handleClose = () => {
    Keyboard.dismiss();
    onClose();
  };

  const isValidating = validationState === ValidationState.VALIDATING;
  const isError = validationState === ValidationState.ERROR;

  // Theme-aware OTP styles
  const otpTheme = useMemo(
    () => ({
      containerStyle: {
        marginVertical: spacing.xl,
      },
      pinCodeContainerStyle: {
        width: pinSize.width,
        height: pinSize.height,
        borderRadius: pinSize.borderRadius,
        borderWidth: 2,
        borderColor: isError ? colors.error : colors.border,
        backgroundColor: isValidating
          ? colors.backgroundSecondary
          : colors.background,
      },
      pinCodeTextStyle: {
        fontSize: pinSize.fontSize,
        fontWeight: "600" as const,
        color: colors.text,
      },
      focusStickStyle: {
        width: 2,
        height: pinSize.height * 0.6,
        backgroundColor: colors.info,
      },
      focusedPinCodeContainerStyle: {
        borderColor: colors.info,
        backgroundColor: colors.backgroundSecondary,
      },
    }),
    [pinSize, isError, isValidating, colors]
  );

  return (
    <Actionsheet isOpen={isOpen} onClose={handleClose}>
      <ActionsheetBackdrop />
      <ActionsheetContent style={{ paddingBottom: insets.bottom + spacing.sm }}>
        <ActionsheetDragIndicatorWrapper>
          <ActionsheetDragIndicator />
        </ActionsheetDragIndicatorWrapper>
        <VStack space="lg" className="w-full">
          <Box className="items-center">
            <Heading size="lg" className="text-typography-950 dark:text-typography-50">
              {title}
            </Heading>
          </Box>

          <View className="w-full items-center space-y-4">
            {description && (
              <Text className="text-sm text-typography-600 dark:text-typography-400 text-center">
                {description}
              </Text>
            )}

            {isBlocked ? (
              <View className="w-full items-center space-y-4 py-8">
                <Text className="text-sm text-error-500 dark:text-error-400 text-center font-semibold">
                  {t("pin.validation.blocked")}
                </Text>
                <Text className="text-xs text-typography-500 text-center">
                  {t("pin.validation.blockedDescription")}
                </Text>
              </View>
            ) : (
              <>
                <OtpInput
                  ref={otpInputRef}
                  numberOfDigits={6}
                  onFilled={handlePinFilled}
                  focusColor={colors.info}
                  focusStickBlinkingDuration={500}
                  disabled={isValidating || isBlocked}
                  textInputProps={{
                    accessibilityLabel: "PIN Verification",
                  }}
                  theme={otpTheme}
                />

                {isError && errorMessage && (
                  <View className="w-full items-center space-y-1">
                    <Text className="text-sm text-error-500 dark:text-error-400 text-center font-medium">
                      {errorMessage}
                    </Text>
                    {attemptsRemaining !== undefined &&
                      attemptsRemaining > 0 && (
                        <Text className="text-xs text-typography-500 text-center">
                          {t("pin.validation.attemptsRemaining", {
                            count: attemptsRemaining,
                          })}
                        </Text>
                      )}
                  </View>
                )}

                {isValidating && (
                  <Text className="text-sm text-typography-600 dark:text-typography-400 text-center">
                    {t("pin.validation.validating")}
                  </Text>
                )}
              </>
            )}
          </View>

          <View className="mt-4">
            <Button
              size="lg"
              onPress={handleClose}
              className="w-full rounded-xl"
              variant="outline"
            >
              <ButtonText>{t("general.cancel")}</ButtonText>
            </Button>
          </View>
        </VStack>
      </ActionsheetContent>
    </Actionsheet>
  );
};
