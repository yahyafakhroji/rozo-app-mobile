import React from "react";
import { FocusAwareStatusBar } from "@/components/focus-aware-status-bar";
import { SecuritySettingsScreen } from "@/features/settings/security-settings-screen";

export default function SecuritySettingsPage() {
  return (
    <>
      <FocusAwareStatusBar />
      <SecuritySettingsScreen />
    </>
  );
}
