import { FocusAwareStatusBar } from "@/components/focus-aware-status-bar";
import { TransactionScreen } from "@/features/transactions/transaction-screen";

export default function TransactionsPage() {
  return (
    <>
      <FocusAwareStatusBar />
      <TransactionScreen />
    </>
  );
}
