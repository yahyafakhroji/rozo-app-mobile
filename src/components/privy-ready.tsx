import { usePrivy } from "@privy-io/expo";

/**
 * Wrapper component that waits for Privy to be ready before rendering children.
 * Auth routing is handled by AuthRouter in the root layout.
 */
export function PrivyReady({ children }: { children: React.ReactNode }) {
  const { isReady } = usePrivy();

  if (!isReady) {
    return null;
  }

  return children;
}
