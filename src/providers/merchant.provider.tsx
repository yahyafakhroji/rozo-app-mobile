import { useMerchantStatusErrorHandler } from "@/hooks/use-merchant-status-error-handler";
import { useSelectedLanguage } from "@/hooks/use-selected-language";
import { useToast } from "@/hooks/use-toast";
import { MERCHANT_KEY, TOKEN_KEY } from "@/libs/constants";
import { currencies, type CurrencyConfig } from "@/libs/currencies";
import type { AppError } from "@/libs/error/error";
import {
  MerchantStatusError,
  isMerchantStatusError,
  logMerchantStatusError,
} from "@/libs/error/merchant-status-error";
import { privyClient } from "@/libs/privy-client";
import { getItem, removeItem, setItem, storage } from "@/libs/storage";
import { defaultToken, tokens, type Token } from "@/libs/tokens";
import {
  useCreateProfile,
  useGetProfile,
  useUpdateProfile,
} from "@/modules/api/api";
import type {
  MerchantDefaultTokenID,
  MerchantProfile,
} from "@/modules/api/schema/merchant";
import { usePrivy } from "@privy-io/expo";
import type React from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useAuth } from "./auth.provider";

interface MerchantContextProps {
  merchant: MerchantProfile | undefined;
  defaultCurrency: CurrencyConfig | undefined;
  defaultTokenId: MerchantDefaultTokenID | undefined;
  merchantToken: Token | undefined;
  isMerchantLoading: boolean;
  setMerchant: (merchant: MerchantProfile | undefined) => void;
  refetchMerchant: (options?: {
    force?: boolean;
    showToast?: boolean;
  }) => Promise<void>;
}

const MerchantContext = createContext<MerchantContextProps>({
  merchant: undefined,
  defaultCurrency: undefined,
  defaultTokenId: undefined,
  merchantToken: undefined,
  isMerchantLoading: false,
  setMerchant: () => {},
  refetchMerchant: async () => {},
});

interface MerchantProviderProps {
  children: React.ReactNode;
}

export const MerchantProvider: React.FC<MerchantProviderProps> = ({
  children,
}) => {
  const { user, isAuthenticated, token } = useAuth();
  const { language } = useSelectedLanguage();
  const { logout: logoutPrivy } = usePrivy();
  const { success, error: showError } = useToast();

  const [merchant, setMerchant] = useState<MerchantProfile | undefined>(
    undefined
  );
  const [isMerchantLoading, setIsMerchantLoading] = useState(false);

  // Track initialization to prevent multiple runs
  const hasInitialized = useRef(false);

  // API hooks
  const profileQuery = useGetProfile();
  const { refetch: fetchProfile } = profileQuery;
  const { mutateAsync: createProfile } = useCreateProfile();
  const { mutateAsync: updateProfile } = useUpdateProfile();

  // Merchant status error handler
  const { handleMerchantStatusError } = useMerchantStatusErrorHandler();

  // Computed values
  const merchantToken = useMemo(() => {
    if (merchant?.default_token_id) {
      return tokens.find((token) => token.key === merchant?.default_token_id);
    }
    return defaultToken;
  }, [merchant]);

  const defaultCurrency = useMemo(() => {
    const currency = merchant?.default_currency ?? "USD";
    return currencies[currency];
  }, [merchant]);

  // Centralized refetch merchant function
  const refetchMerchant = useCallback(
    async (options: { force?: boolean; showToast?: boolean } = {}) => {
      const { force = true, showToast = false } = options;

      try {
        setIsMerchantLoading(true);

        // Clear AsyncStorage cache to force fresh fetch
        if (force) {
          removeItem(MERCHANT_KEY);
        }

        // Refetch profile (will fetch fresh data since cache is cleared)
        const result = await fetchProfile();

        if (result.data) {
          setMerchant(result.data);
          setItem(MERCHANT_KEY, result.data);

          if (showToast) {
            success("Profile updated successfully");
          }
        } else if (result.error) {
          console.error(
            "[MerchantProvider] Error refetching profile:",
            result.error
          );

          // Check if it's a merchant status error
          if (isMerchantStatusError(result.error)) {
            const statusError = result.error as MerchantStatusError;
            console.error(
              "[MerchantProvider] Merchant status error during refetch:",
              statusError.statusErrorType
            );

            // Handle the status error with toast and logout
            await handleMerchantStatusError(statusError, async () => {
              await logoutPrivy();
              storage.clearAll();
              hasInitialized.current = false;
              setMerchant(undefined);
            });
          } else if (showToast) {
            showError("Failed to update profile");
          }
        }
      } catch (error) {
        console.error(
          "[MerchantProvider] Exception during refetchMerchant:",
          error
        );

        if (isMerchantStatusError(error)) {
          const statusError = error as MerchantStatusError;
          await handleMerchantStatusError(statusError, async () => {
            await logoutPrivy();
            storage.clearAll();
            hasInitialized.current = false;
            setMerchant(undefined);
          });
        } else if (showToast) {
          showError("Failed to update profile");
        }
      } finally {
        setIsMerchantLoading(false);
      }
    },
    []
  );

  // Main merchant initialization effect
  useEffect(() => {
    let isMounted = true;

    const initializeMerchant = async () => {
      // Skip if not authenticated or already initialized
      if (!isAuthenticated || !user || !token || !isMounted) {
        return;
      }

      // Check if we've already initialized for this user
      if (hasInitialized.current) {
        return;
      }

      hasInitialized.current = true;

      try {
        setIsMerchantLoading(true);

        // Check for cached merchant data
        const cachedMerchant = getItem<MerchantProfile>(MERCHANT_KEY);
        if (cachedMerchant && isMounted) {
          setMerchant(cachedMerchant);
          setIsMerchantLoading(false);
        }

        // Fetch profile
        const profileResult = await fetchProfile();

        if (profileResult.data && isMounted) {
          if (!profileResult.data.email) {
            const privyUser = await privyClient.user.get();
            const email = privyUser.user.linked_accounts.find(
              (account) => account.type === "email"
            )?.address;

            if (email) {
              profileResult.data.email = email;
              const newProfile = await updateProfile({
                email: email,
                display_name: profileResult.data.display_name,
                logo: profileResult.data.logo_url,
              });
              setMerchant(newProfile);
              setItem(MERCHANT_KEY, newProfile);
            } else {
              setMerchant(profileResult.data);
              setItem(MERCHANT_KEY, profileResult.data);
              setIsMerchantLoading(false);
            }

            success("Profile created successfully! Welcome to Rozo POS");
            setIsMerchantLoading(false);
            return;
          }

          setMerchant(profileResult.data);
          setItem(MERCHANT_KEY, profileResult.data);
          setIsMerchantLoading(false);
        } else if (profileResult.error && isMounted) {
          const error = profileResult.error as unknown as AppError;
          if (error.statusCode === 404) {
            // Create profile
            const logoUrl = (user as any)?.image || "";
            const privyUser = await privyClient.user.get();
            let email = privyUser.user.id;
            const userEmail = privyUser.user.linked_accounts.find(
              (account) => account.type === "email"
            )?.address;

            if (userEmail) {
              email = userEmail;
            }

            const profilePayload = {
              email: email,
              display_name: email === privyUser.user.id ? null : email,
              description: "",
              logo_url: logoUrl,
              default_currency: "USD",
              default_language: (language ?? "EN").toUpperCase(),
              default_token_id: defaultToken?.key,
            };

            const newProfile = await createProfile(profilePayload);
            if (newProfile && isMounted) {
              setMerchant(newProfile);
              setItem(MERCHANT_KEY, newProfile);
              success("Profile created successfully! Welcome to Rozo POS");
            }
          } else {
            // Check if it's a merchant status error first
            if (isMerchantStatusError(error)) {
              const statusError = error as MerchantStatusError;
              // Log the error for analytics
              logMerchantStatusError(statusError, "profile_fetch");

              // Handle the status error with toast and logout
              await handleMerchantStatusError(statusError, async () => {
                // Logout Privy
                await logoutPrivy();

                // Clear storage
                removeItem(TOKEN_KEY);
                removeItem(MERCHANT_KEY);

                // Reset initialization
                hasInitialized.current = false;
                setMerchant(undefined);
              });

              setIsMerchantLoading(false);
              return; // Exit early for status errors
            }

            const appError = error as unknown as AppError;

            // Don't show error toast for authentication issues if we have cached data
            if (appError.statusCode !== 401 && appError.statusCode !== 403) {
              showError("Failed to load merchant profile");
            }
          }
          setIsMerchantLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          // Check if it's a merchant status error
          if (isMerchantStatusError(error)) {
            const statusError = error as MerchantStatusError;
            // Log the error for analytics
            logMerchantStatusError(statusError, "merchant_initialization");

            // Handle the status error with toast and logout
            await handleMerchantStatusError(statusError, async () => {
              // Logout Privy
              await logoutPrivy();

              // Clear storage
              removeItem(TOKEN_KEY);
              removeItem(MERCHANT_KEY);

              // Reset initialization
              hasInitialized.current = false;
              setMerchant(undefined);
            });

            return; // Exit early for status errors
          }

          // Handle other errors
          const appError = error as unknown as AppError;

          // Don't show error toast for authentication issues
          if (appError.statusCode !== 401 && appError.statusCode !== 403) {
            showError("Failed to initialize merchant profile");
          }
          hasInitialized.current = false; // Reset on error

          // Logout Privy
          await logoutPrivy();

          // Clear storage
          removeItem(TOKEN_KEY);
          removeItem(MERCHANT_KEY);
        }
      } finally {
        if (isMounted) {
          setIsMerchantLoading(false);
        }
      }
    };

    initializeMerchant();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, user, token, language]);

  // Reset initialization when user changes
  useEffect(() => {
    if (!user) {
      hasInitialized.current = false;
      setMerchant(undefined);
    }
  }, [user]);

  // Update merchant state when profile query data changes
  useEffect(() => {
    if (profileQuery.data && profileQuery.data !== merchant) {
      setMerchant(profileQuery.data);
      setItem(MERCHANT_KEY, profileQuery.data);
    }
  }, [profileQuery.data, merchant]);

  const contextValue = useMemo(
    () => ({
      merchant,
      defaultCurrency,
      defaultTokenId: merchant?.default_token_id,
      merchantToken,
      isMerchantLoading,
      setMerchant,
      refetchMerchant,
    }),
    [
      merchant,
      defaultCurrency,
      merchantToken,
      isMerchantLoading,
      setMerchant,
      refetchMerchant,
    ]
  );

  return (
    <MerchantContext.Provider value={contextValue}>
      {children}
    </MerchantContext.Provider>
  );
};

export const useMerchant = () => useContext(MerchantContext);
