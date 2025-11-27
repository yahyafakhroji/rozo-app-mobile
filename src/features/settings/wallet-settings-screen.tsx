import { memo } from "react";
import { ScrollView, View } from "react-native";
import { useTranslation } from "react-i18next";
import { InfoIcon } from "lucide-react-native";
import { ScreenHeader } from "@/components/screen-header";
import { Alert, AlertIcon, AlertText } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { useWallet } from "@/providers";
import { WalletAddressCard } from "./wallet-address-card";
import { StellarWalletStatusInformation } from "./stellar-wallet-status-information";
import { SwitchPrimaryWallet } from "./switch-primary-wallet";
import { SettingGroup } from "./setting-group";

export const WalletSettingsScreen = memo(function WalletSettingsScreen() {
  const { t } = useTranslation();
  const { preferredPrimaryChain } = useWallet();

  return (
    <ScrollView
      className="flex-1"
      contentContainerClassName="pb-8"
      showsVerticalScrollIndicator={false}
    >
      <ScreenHeader
        title={t("settings.groups.wallet", "Wallet")}
        subtitle={t("settings.walletDescription", "Manage your wallet and payment settings")}
        showBack
      />

      <View className="gap-4">
        {/* Wallet Address */}
        <SettingGroup title={t("settings.walletAddress", "Your Wallet")}>
          <WalletAddressCard />
        </SettingGroup>

        {/* Network Info */}
        {preferredPrimaryChain === "USDC_BASE" ? (
          <Alert action="info" variant="solid" className="rounded-xl">
            <AlertIcon as={InfoIcon} />
            <AlertText className="text-xs flex-1">
              {t("settings.gaslessInfo")}
            </AlertText>
          </Alert>
        ) : (
          <Card className="rounded-xl border border-background-300 bg-background-0 p-0 overflow-hidden">
            <StellarWalletStatusInformation />
          </Card>
        )}

        {/* Switch Wallet */}
        <SettingGroup title={t("settings.network", "Network")}>
          <SwitchPrimaryWallet />
        </SettingGroup>

        {/* Info Section */}
        <Card className="rounded-xl border border-background-300 bg-background-50 dark:bg-background-900 p-4">
          <Text size="sm" className="text-typography-500 dark:text-typography-400">
            {t(
              "settings.walletInfo",
              "Your wallet is secured by Privy. You can switch between networks at any time. Each network has its own address."
            )}
          </Text>
        </Card>
      </View>
    </ScrollView>
  );
});
