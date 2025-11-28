import { memo, useRef } from "react";
import { ScrollView, View } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import * as Application from "expo-application";
import {
  WalletIcon,
  ShieldIcon,
  ChevronRightIcon,
  LogOutIcon,
  InfoIcon,
} from "lucide-react-native";

import { ScreenHeader } from "@/components/screen-header";
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button, ButtonText, ButtonIcon } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { useApp } from "@/providers/app.provider";
import { useSelectedLanguage } from "@/hooks/use-selected-language";
import {
  ProfileSheet,
  type ProfileSheetRefType,
} from "@/features/settings/profile-sheet";
import { POSToggleSetting } from "./pos-toggle-setting";
import { ActionSheetCurrencySwitcher } from "./select-currency";
import { ActionSheetLanguageSwitcher } from "./select-language";
import { ActionSheetThemeSwitcher } from "./theme-switcher";
import { SettingItem } from "./setting-item";

export const SettingScreen = memo(function SettingScreen() {
  const { logout, merchant } = useApp();
  const { t } = useTranslation();
  const { language } = useSelectedLanguage();
  const router = useRouter();
  const profileSheetRef = useRef<ProfileSheetRefType>(null);

  return (
    <ScrollView
      className="flex-1"
      contentContainerClassName="pb-8"
      showsVerticalScrollIndicator={false}
    >
      <ScreenHeader
        title={t("settings.title")}
        subtitle={t("settings.description")}
      />

      <View className="gap-4">
        {/* Profile Card - Larger and More Prominent */}
        <Pressable onPress={() => profileSheetRef.current?.open()}>
          <Card className="rounded-2xl border border-background-300 bg-background-0 p-4">
            <View className="flex-row items-center">
              <Avatar size="lg" className="mr-4">
                <AvatarFallbackText>
                  {merchant?.display_name?.slice(0, 2) || "-"}
                </AvatarFallbackText>
                <AvatarImage
                  source={{
                    uri: merchant?.logo_url || undefined,
                  }}
                  alt="Profile"
                />
              </Avatar>
              <View className="flex-1">
                <Text
                  size="lg"
                  className="font-semibold text-typography-900 dark:text-typography-100"
                >
                  {merchant?.display_name ?? "-"}
                </Text>
                {merchant?.display_name !== merchant?.email && merchant?.email && (
                  <Text
                    size="sm"
                    className="text-typography-500 dark:text-typography-400 mt-0.5"
                  >
                    {merchant.email}
                  </Text>
                )}
                <Text
                  size="xs"
                  className="text-primary-500 dark:text-primary-400 mt-1"
                >
                  {t("settings.editProfile", "Edit Profile")}
                </Text>
              </View>
              <Icon
                as={ChevronRightIcon}
                size="lg"
                className="text-typography-400"
              />
            </View>
          </Card>
        </Pressable>

        {/* Quick Navigation Cards */}
        <View className="flex-row gap-3">
          {/* Wallet Card */}
          <Pressable
            className="flex-1"
            onPress={() => router.push("/(main)/settings/wallet")}
          >
            <Card className="rounded-xl border border-background-300 bg-background-0 p-4 items-center">
              <View className="w-12 h-12 rounded-full bg-primary-500/10 dark:bg-primary-400/10 items-center justify-center mb-2">
                <Icon
                  as={WalletIcon}
                  size="xl"
                  className="text-primary-500 dark:text-primary-400"
                />
              </View>
              <Text
                size="sm"
                className="font-medium text-typography-900 dark:text-typography-100 text-center"
              >
                {t("settings.groups.wallet", "Wallet")}
              </Text>
              <Text
                size="xs"
                className="text-typography-500 dark:text-typography-400 text-center mt-0.5"
              >
                {t("settings.walletSubtitle", "Manage")}
              </Text>
            </Card>
          </Pressable>

          {/* Security Card */}
          <Pressable
            className="flex-1"
            onPress={() => router.push("/(main)/settings/security")}
          >
            <Card className="rounded-xl border border-background-300 bg-background-0 p-4 items-center">
              <View className="w-12 h-12 rounded-full bg-success-500/10 dark:bg-success-400/10 items-center justify-center mb-2">
                <Icon
                  as={ShieldIcon}
                  size="xl"
                  className="text-success-500 dark:text-success-400"
                />
              </View>
              <Text
                size="sm"
                className="font-medium text-typography-900 dark:text-typography-100 text-center"
              >
                {t("settings.groups.security", "Security")}
              </Text>
              <Text
                size="xs"
                className="text-typography-500 dark:text-typography-400 text-center mt-0.5"
              >
                {t("settings.securitySubtitle", "PIN & Auth")}
              </Text>
            </Card>
          </Pressable>
        </View>

        {/* Preferences Section */}
        <Card className="rounded-xl border border-background-300 bg-background-0 p-0 overflow-hidden">
          <View className="px-4 py-3 bg-background-50 dark:bg-background-900">
            <Text
              size="xs"
              className="font-semibold uppercase tracking-wide text-typography-500 dark:text-typography-400"
            >
              {t("settings.groups.preferences", "Preferences")}
            </Text>
          </View>
          <View className="divide-y divide-background-200 dark:divide-background-800">
            <POSToggleSetting />
            <ActionSheetCurrencySwitcher />
            <ActionSheetLanguageSwitcher initialLanguage={language} />
            <ActionSheetThemeSwitcher />
          </View>
        </Card>

        {/* About Section */}
        <Card className="rounded-xl border border-background-300 bg-background-0 p-0 overflow-hidden">
          <View className="px-4 py-3 bg-background-50 dark:bg-background-900">
            <Text
              size="xs"
              className="font-semibold uppercase tracking-wide text-typography-500 dark:text-typography-400"
            >
              {t("settings.about", "About")}
            </Text>
          </View>
          <View className="divide-y divide-background-200 dark:divide-background-800">
            <SettingItem
              icon={InfoIcon}
              title={t("settings.version", "Version")}
              value={Application.nativeApplicationVersion || "-"}
              iconColor="#6B7280"
            />
          </View>
        </Card>

        {/* Logout Button */}
        <Button
          variant="outline"
          size="lg"
          action="negative"
          onPress={logout}
          className="rounded-xl border-error-300 dark:border-error-700"
        >
          <ButtonIcon as={LogOutIcon} className="mr-2" />
          <ButtonText>{t("settings.logout")}</ButtonText>
        </Button>
      </View>

      {/* Profile Sheet */}
      <ProfileSheet ref={profileSheetRef} />
    </ScrollView>
  );
});
