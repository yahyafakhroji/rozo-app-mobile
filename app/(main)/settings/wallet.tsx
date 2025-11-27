import React from "react";
import { FocusAwareStatusBar } from "@/components/focus-aware-status-bar";
import { WalletSettingsScreen } from "@/features/settings/wallet-settings-screen";

export default function WalletSettingsPage() {
  return (
    <>
      <FocusAwareStatusBar />
      <WalletSettingsScreen />
    </>
  );
}
