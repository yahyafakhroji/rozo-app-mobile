import { useCallback } from "react";
import { useMMKVString } from "react-native-mmkv";
import { Appearance } from "react-native";

import { storage } from "@/libs/storage";

const SELECTED_THEME = "_theme";
export type ColorSchemeType = "light" | "dark" | "system";

/**
 * This hook should only be used for selecting/changing the theme.
 * It stores the selected theme in MMKV and updates the system appearance.
 *
 * For styling components based on the current theme, use useColorScheme from @/hooks/use-color-scheme
 */
export const useSelectedTheme = () => {
  const [theme, _setTheme] = useMMKVString(SELECTED_THEME, storage);

  const setSelectedTheme = useCallback(
    (t: ColorSchemeType) => {
      _setTheme(t);
      // Update system appearance for immediate effect
      if (t === "system") {
        Appearance.setColorScheme(null);
      } else {
        Appearance.setColorScheme(t);
      }
    },
    [_setTheme]
  );

  return { selectedTheme: theme, setSelectedTheme } as const;
};

// to be used in the root file to load the selected theme from MMKV
export const loadSelectedTheme = () => {
  const theme = storage.getString(SELECTED_THEME);
  if (theme !== undefined && theme !== "system") {
    Appearance.setColorScheme(theme as "light" | "dark");
  }
};
