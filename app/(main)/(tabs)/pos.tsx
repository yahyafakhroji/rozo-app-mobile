import { FocusAwareStatusBar } from "@/components/focus-aware-status-bar";
import { PaymentScreen } from "@/features/payment";
import { usePOSToggle } from "@/providers/preferences.provider";
import { Redirect } from "expo-router";

export default function PosPage() {
  const { showPOS } = usePOSToggle();

  if (!showPOS) {
    return <Redirect href="/(main)/(tabs)" />;
  }

  return (
    <>
      <FocusAwareStatusBar />
      <PaymentScreen />
    </>
  );
}
