import * as Speech from "expo-speech";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { useGetOrder } from "@/modules/api/api/merchant/orders";
import type { PaymentCompletedEvent } from "@/modules/pusher/pusher";
import {
  subscribeToChannel,
  unsubscribeFromChannel,
} from "@/modules/pusher/pusher";

type PaymentStatus = "pending" | "completed" | "failed";

/**
 * Hook to subscribe to payment status updates via Pusher
 */
export function usePaymentStatus(merchantId?: string, orderId?: string) {
  const [status, setStatus] = useState<PaymentStatus>("pending");
  const { t } = useTranslation();

  // Track if component is mounted to prevent state updates after unmount
  const isMountedRef = useRef(true);

  const { refetch, data, isLoading } = useGetOrder({
    variables: { id: orderId ?? "" },
    enabled: false,
  });

  // Function to manually check payment status
  const checkPaymentStatus = useCallback(() => {
    if (orderId) {
      refetch();
    }
  }, [orderId, refetch]);

  const unsubscribe = useCallback(async () => {
    if (!merchantId) return;
    try {
      await unsubscribeFromChannel(merchantId);
    } catch {
      // Silently handle cleanup errors
    }
  }, [merchantId]);

  const speakPaymentStatus = useCallback(
    ({
      amount,
      currency,
      language,
      onEnd,
    }: {
      amount: number;
      currency: string;
      language: string;
      onEnd?: () => void;
    }) => {
      const thingToSay = t("payment.voiceSuccess", {
        amount: amount,
        currency: currency,
      });
      Speech.speak(thingToSay, {
        language: language,
        pitch: 0.8,
        rate: 0.8,
        onDone: onEnd,
      });
    },
    [t]
  );

  useEffect(() => {
    isMountedRef.current = true;

    // Only subscribe if we have a merchantId and orderId
    if (!merchantId || !orderId) return;

    const channelName = merchantId;

    // Setup Pusher channel and event binding
    const setupPusher = async () => {
      try {
        await subscribeToChannel(
          channelName,
          "payment_completed",
          (data: PaymentCompletedEvent) => {
            if (data.order_id === orderId && isMountedRef.current) {
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
  }, [merchantId, orderId]);

  useEffect(() => {
    if (data && data.status === "COMPLETED") {
      setStatus("completed");
    }
  }, [data]);

  return useMemo(
    () => ({
      status,
      isLoading,
      checkPaymentStatus,
      speakPaymentStatus,
      unsubscribe,
      isPending: status === "pending",
      isCompleted: status === "completed",
      isFailed: status === "failed",
    }),
    [status, isLoading, checkPaymentStatus, speakPaymentStatus, unsubscribe]
  );
}
