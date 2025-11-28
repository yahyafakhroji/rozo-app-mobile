import { memo } from "react";
import { ScrollView, View } from "react-native";
import { useTranslation } from "react-i18next";
import { ShieldCheckIcon, KeyIcon, FingerprintIcon } from "lucide-react-native";
import { ScreenHeader } from "@/components/screen-header";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { SettingGroup } from "./setting-group";
import { PINSettings } from "./pin";

export const SecuritySettingsScreen = memo(function SecuritySettingsScreen() {
  const { t } = useTranslation();

  return (
    <ScrollView
      className="flex-1"
      contentContainerClassName="pb-8"
      showsVerticalScrollIndicator={false}
    >
      <ScreenHeader
        title={t("settings.groups.security", "Security")}
        subtitle={t("settings.securityDescription", "Protect your account and transactions")}
        showBack
      />

      <View className="gap-4">
        {/* PIN Settings */}
        <SettingGroup title={t("settings.pinCode", "PIN Code")}>
          <PINSettings />
        </SettingGroup>

        {/* Security Info */}
        <Card className="rounded-xl border border-background-300 bg-background-50 dark:bg-background-900 p-4">
          <View className="flex-row items-start gap-3">
            <ShieldCheckIcon
              size={20}
              className="text-success-500 dark:text-success-400 mt-0.5"
            />
            <View className="flex-1">
              <Text size="sm" className="font-semibold text-typography-900 dark:text-typography-100 mb-1">
                {t("settings.securityTip", "Security Tip")}
              </Text>
              <Text size="sm" className="text-typography-500 dark:text-typography-400">
                {t(
                  "settings.securityInfo",
                  "Enable PIN protection to secure withdrawals and sensitive operations. Your PIN is stored securely on your device."
                )}
              </Text>
            </View>
          </View>
        </Card>
      </View>
    </ScrollView>
  );
});
