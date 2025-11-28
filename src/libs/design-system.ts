/**
 * Design System Constants
 * Centralized values for colors, timing, and other design tokens
 */

/**
 * Animation timing constants (in milliseconds)
 */
export const timing = {
  /** Keyboard animation duration */
  keyboard: 300,
  /** Focus delay for inputs */
  focusDelay: 300,
  /** Clear delay for PIN inputs */
  pinClearDelay: 500,
  /** Confirm action delay */
  confirmDelay: 150,
  /** Toast duration */
  toastDuration: 3000,
  /** Fade animation duration */
  fade: 200,
  /** Slide animation duration */
  slide: 300,
} as const;

/**
 * Semantic colors that map to Tailwind classes
 * Use these instead of hardcoded hex values
 */
export const semanticColors = {
  // Status colors - use Tailwind classes: text-error-500, bg-error-500, etc.
  error: {
    light: "error-500", // #EF4444
    dark: "error-400",
  },
  warning: {
    light: "warning-500", // #F59E0B
    dark: "warning-400",
  },
  success: {
    light: "success-500", // #10B981
    dark: "success-400",
  },
  info: {
    light: "info-500", // #3B82F6
    dark: "info-400",
  },

  // Text colors
  text: {
    primary: {
      light: "typography-950",
      dark: "typography-50",
    },
    secondary: {
      light: "typography-600", // #6B7280
      dark: "typography-400",
    },
    muted: {
      light: "typography-500",
      dark: "typography-500",
    },
  },

  // Background colors
  background: {
    primary: {
      light: "background-0", // #FFFFFF
      dark: "background-950", // #0a0a0a
    },
    secondary: {
      light: "background-50",
      dark: "background-900",
    },
    card: {
      light: "background-0",
      dark: "background-900",
    },
  },

  // Border colors
  border: {
    default: {
      light: "background-300",
      dark: "background-700",
    },
    focus: {
      light: "primary-500",
      dark: "primary-400",
    },
  },
} as const;

/**
 * Raw color values for cases where Tailwind classes can't be used
 * (e.g., third-party components, dynamic styles)
 */
export const rawColors = {
  // Light theme
  light: {
    background: "#FFFFFF",
    backgroundSecondary: "#F8F8FF",
    card: "#FFFFFF",
    text: "#0a0a0a",
    textSecondary: "#6B7280",
    border: "#E5E7EB",
    borderFocus: "#3B82F6",
    tabBar: "#FFFFFF",
    tabBarBorder: "#E5E7EB",
    error: "#EF4444",
    warning: "#F59E0B",
    success: "#10B981",
    info: "#3B82F6",
  },
  // Dark theme
  dark: {
    background: "#0a0a0a",
    backgroundSecondary: "#141419",
    card: "#1a1a1f",
    text: "#FFFFFF",
    textSecondary: "#9CA3AF",
    border: "#374151",
    borderFocus: "#60A5FA",
    tabBar: "#1a1a1f",
    tabBarBorder: "#2b2b2b",
    error: "#F87171",
    warning: "#FBBF24",
    success: "#34D399",
    info: "#60A5FA",
  },
} as const;

/**
 * Get theme-aware color
 */
export function getThemedColor(
  colorKey: keyof typeof rawColors.light,
  isDark: boolean
): string {
  return isDark ? rawColors.dark[colorKey] : rawColors.light[colorKey];
}

/**
 * Tab bar configuration
 */
export const tabBarConfig = {
  height: 64,
  iconSize: 24,
  labelSize: 11,
  bottomPadding: 8,
  topPadding: 8,
  borderRadius: 24,
  floatingMargin: 16,
  floatingBottom: 24,
} as const;

/**
 * Header configuration
 */
export const headerConfig = {
  titleSize: 24,
  subtitleSize: 14,
  spacing: 4,
} as const;

/**
 * Card configuration
 */
export const cardConfig = {
  borderRadius: 12,
  padding: 16,
  gap: 12,
} as const;

/**
 * Input configuration
 */
export const inputConfig = {
  height: 48,
  borderRadius: 8,
  paddingHorizontal: 16,
  fontSize: 16,
} as const;

/**
 * Wallet-specific color configurations
 * For transaction types and wallet actions
 */
export const walletColors = {
  receive: {
    bg: "bg-success-100 dark:bg-success-900/30",
    icon: "text-success-600 dark:text-success-400",
    text: "text-success-600 dark:text-success-400",
    button: "bg-success-500 active:bg-success-600",
  },
  send: {
    bg: "bg-error-100 dark:bg-error-900/30",
    icon: "text-error-600 dark:text-error-400",
    text: "text-error-600 dark:text-error-400",
    button: "bg-primary-500 active:bg-primary-600",
  },
  swap: {
    bg: "bg-info-100 dark:bg-info-900/30",
    icon: "text-info-600 dark:text-info-400",
    text: "text-info-600 dark:text-info-400",
    button: "bg-info-500 active:bg-info-600",
  },
  pending: {
    bg: "bg-warning-100 dark:bg-warning-900/30",
    icon: "text-warning-600 dark:text-warning-400",
    text: "text-warning-600 dark:text-warning-400",
  },
} as const;

/**
 * Balance display configuration
 */
export const balanceConfig = {
  /** Hero balance text size */
  heroSize: "5xl" as const,
  /** Asset symbol text size */
  assetSize: "xl" as const,
  /** Secondary balance text size */
  secondarySize: "sm" as const,
  /** Address chip border radius */
  addressChipRadius: 9999,
  /** Action button height */
  actionButtonHeight: 56,
  /** Action button border radius */
  actionButtonRadius: 16,
} as const;

/**
 * Transaction card configuration
 */
export const transactionConfig = {
  /** Icon container size */
  iconSize: 40,
  /** Icon border radius */
  iconRadius: 20,
  /** Card padding */
  padding: 16,
  /** Card border radius */
  borderRadius: 16,
} as const;
