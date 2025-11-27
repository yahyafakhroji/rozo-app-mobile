import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useGetDeposit } from "@/modules/api/api/merchant/deposits";
import type { PaymentCompletedEvent } from "@/modules/pusher/pusher";
import {
  subscribeToChannel,
  unsubscribeFromChannel,
} from "@/modules/pusher/pusher";

type PaymentStatus = "pending" | "completed" | "failed";

/**
 * Hook to subscribe to deposit status updates via Pusher
 */
export function useDepositStatus(merchantId?: string, depositId?: string) {
  const [status, setStatus] = useState<PaymentStatus>("pending");

  // Track if component is mounted to prevent state updates after unmount
  const isMountedRef = useRef(true);

  const {
    refetch: refetchDeposit,
    data: dataDeposit,
    isLoading: isDepositLoading,
  } = useGetDeposit({
    variables: { id: depositId ?? "" },
    enabled: false,
  });

  // Function to manually check payment status
  const checkPaymentStatus = useCallback(() => {
    if (depositId) {
      refetchDeposit();
    }
  }, [depositId, refetchDeposit]);

  useEffect(() => {
    isMountedRef.current = true;

    // Only subscribe if we have a merchantId and depositId
    if (!merchantId || !depositId) return;

    const channelName = merchantId;

    // Setup Pusher channel and event binding
    const setupPusher = async () => {
      try {
        await subscribeToChannel(
          channelName,
          "payment_completed",
          (data: PaymentCompletedEvent) => {
            if (data.order_id === depositId && isMountedRef.current) {
              setStatus("completed");
            }
          }
        );
      } catch {
        // Silently handle subscription errors
      }
    };

    void setupPusher();

    // Cleanup function
    return () => {
      isMountedRef.current = false;
      setStatus("pending");

      // Use void to explicitly mark fire-and-forget async cleanup
      void (async () => {
        try {
          await unsubscribeFromChannel(channelName);
        } catch {
          // Silently handle cleanup errors
        }
      })();
    };
  }, [merchantId, depositId]);

  useEffect(() => {
    if (dataDeposit && dataDeposit.status === "COMPLETED") {
      setStatus("completed");
    }
  }, [dataDeposit]);

  return useMemo(
    () => ({
      status,
      isLoading: isDepositLoading,
      checkPaymentStatus,
      isPending: status === "pending",
      isCompleted: status === "completed",
      isFailed: status === "failed",
    }),
    [status, isDepositLoading, checkPaymentStatus]
  );
}
