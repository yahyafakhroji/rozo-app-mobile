import { useToast } from "@/hooks/use-toast";
import { StellarConfig } from "@/libs/stellar/config";
import { isAccountNotFound } from "@/libs/stellar/errors";
import {
  formatStellarBalancesAsWalletInfo,
  StellarBalance,
} from "@/libs/stellar/utils";
import axios from "axios";
import type { ReactNode } from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { WalletBalanceInfo } from "./wallet.provider";

type StellarContextProvider = { children: ReactNode; stellarRpcUrl?: string };

type StellarAccountResponse = {
  id: string;
  account_id: string;
  balances: StellarBalance[];
  [key: string]: any;
};

type StellarContextProviderValue = {
  publicKey: string | undefined;
  setPublicKey: (publicKey: string) => void;
  hasUsdcTrustline: boolean;
  account: StellarAccountResponse | undefined | null;
  balances: WalletBalanceInfo[];
  isConnected: boolean;
  disconnect: () => void;
  refreshAccount: () => Promise<WalletBalanceInfo[]>;
};

const initialContext = {
  publicKey: undefined,
  setPublicKey: () => {},
  hasUsdcTrustline: false,
  account: undefined,
  balances: [],
  isConnected: false,
  disconnect: () => {},
  refreshAccount: () => Promise.resolve([] as WalletBalanceInfo[]),
};

export const StellarContext =
  createContext<StellarContextProviderValue>(initialContext);

export const StellarProvider = ({
  children,
  stellarRpcUrl,
}: StellarContextProvider) => {
  const horizonUrl = stellarRpcUrl ?? StellarConfig.NETWORK.rpcUrl;

  const horizonClient = useMemo(
    () =>
      axios.create({
        baseURL: horizonUrl,
        timeout: 20 * 1000,
      }),
    [horizonUrl]
  );

  // Auto-initialize Stellar wallet for authenticated users
  const { error: toastError } = useToast();

  const [publicKey, setPublicKey] = useState<string | undefined>(undefined);
  const [accountInfo, setAccountInfo] = useState<
    StellarAccountResponse | undefined
  >(undefined);

  const formattedBalances = useMemo(() => {
    if (!accountInfo || !accountInfo.balances) return [];
    return formatStellarBalancesAsWalletInfo(
      accountInfo.balances as StellarBalance[]
    );
  }, [accountInfo]);

  const hasUsdcTrustline = useMemo(() => {
    if (!accountInfo || !accountInfo.balances) return false;
    return accountInfo.balances.some(
      (balance: any) =>
        balance.asset_code === StellarConfig.USDC_ASSET.code &&
        balance.asset_issuer === StellarConfig.USDC_ASSET.issuer
    );
  }, [accountInfo]);

  const fetchAccountData = useCallback(
    async (accountPublicKey: string) => {
      try {
        const response = await horizonClient.get(
          `/accounts/${accountPublicKey}`
        );
        const data = response.data as StellarAccountResponse;
        setAccountInfo(data);
        return data;
      } catch (error: any) {
        if (isAccountNotFound(error)) {
          setAccountInfo(undefined);
          return null;
        }
        toastError(error.message || "Failed to get account info");
        throw error;
      }
    },
    [horizonClient, toastError]
  );

  const refreshAccount = useCallback(async () => {
    if (!publicKey) return [] as WalletBalanceInfo[];

    try {
      const data = await fetchAccountData(publicKey);
      if (!data) return [] as WalletBalanceInfo[];

      const latest = formatStellarBalancesAsWalletInfo(
        (data.balances as StellarBalance[]) ?? []
      );
      return latest;
    } catch {
      return [] as WalletBalanceInfo[];
    }
  }, [publicKey, fetchAccountData]);

  const disconnect = useCallback(() => {
    setPublicKey(undefined);
    setAccountInfo(undefined);
  }, []);

  useEffect(() => {
    if (publicKey && !accountInfo) {
      fetchAccountData(publicKey);
    }
  }, [publicKey, accountInfo, fetchAccountData]);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      publicKey,
      setPublicKey,
      hasUsdcTrustline,
      account: accountInfo,
      balances: formattedBalances,
      isConnected: !!publicKey,
      disconnect,
      refreshAccount,
    }),
    [
      publicKey,
      hasUsdcTrustline,
      accountInfo,
      formattedBalances,
      disconnect,
      refreshAccount,
    ]
  );

  return (
    <StellarContext.Provider value={contextValue}>
      {children}
    </StellarContext.Provider>
  );
};

export const useStellar = () => useContext(StellarContext);
