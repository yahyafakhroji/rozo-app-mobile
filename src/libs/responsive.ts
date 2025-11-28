import { Dimensions, PixelRatio, Platform } from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// Base dimensions (based on standard iPhone 14 Pro)
const BASE_WIDTH = 393;
const BASE_HEIGHT = 852;

/**
 * Scale a value based on screen width
 * Use for horizontal dimensions (width, marginHorizontal, paddingHorizontal)
 */
export function scaleWidth(size: number): number {
  return (SCREEN_WIDTH / BASE_WIDTH) * size;
}

/**
 * Scale a value based on screen height
 * Use for vertical dimensions (height, marginVertical, paddingVertical)
 */
export function scaleHeight(size: number): number {
  return (SCREEN_HEIGHT / BASE_HEIGHT) * size;
}

/**
 * Moderate scale - less aggressive scaling for fonts and spacing
 * @param size - base size
 * @param factor - scaling factor (0 = no scaling, 1 = full scaling)
 */
export function moderateScale(size: number, factor: number = 0.5): number {
  return size + (scaleWidth(size) - size) * factor;
}

/**
 * Scale font size with consideration for accessibility
 * Respects user's font scaling preferences
 */
export function scaleFontSize(size: number): number {
  const scale = SCREEN_WIDTH / BASE_WIDTH;
  const newSize = size * scale;

  if (Platform.OS === "ios") {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  }
  return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
}

/**
 * Check if device is a small screen (iPhone SE, older Android)
 */
export function isSmallScreen(): boolean {
  return SCREEN_WIDTH < 375;
}

/**
 * Check if device is a large screen (tablets, large phones)
 */
export function isLargeScreen(): boolean {
  return SCREEN_WIDTH >= 428;
}

/**
 * Check if device is a tablet
 */
export function isTablet(): boolean {
  const aspectRatio = SCREEN_HEIGHT / SCREEN_WIDTH;
  return SCREEN_WIDTH >= 600 || aspectRatio < 1.6;
}

/**
 * Get responsive value based on screen size
 * @param small - value for small screens
 * @param medium - value for medium screens (default)
 * @param large - value for large screens/tablets
 */
export function responsive<T>(small: T, medium: T, large?: T): T {
  if (isSmallScreen()) return small;
  if (isLargeScreen() || isTablet()) return large ?? medium;
  return medium;
}

/**
 * Standard spacing scale (4px base)
 * Matches Tailwind's spacing scale
 */
export const spacing = {
  xs: moderateScale(4),
  sm: moderateScale(8),
  md: moderateScale(12),
  lg: moderateScale(16),
  xl: moderateScale(20),
  "2xl": moderateScale(24),
  "3xl": moderateScale(32),
  "4xl": moderateScale(40),
  "5xl": moderateScale(48),
} as const;

/**
 * Standard border radius scale
 */
export const radius = {
  none: 0,
  sm: moderateScale(4),
  md: moderateScale(8),
  lg: moderateScale(12),
  xl: moderateScale(16),
  "2xl": moderateScale(24),
  full: 9999,
} as const;

/**
 * Standard font sizes
 */
export const fontSize = {
  xs: scaleFontSize(12),
  sm: scaleFontSize(14),
  md: scaleFontSize(16),
  lg: scaleFontSize(18),
  xl: scaleFontSize(20),
  "2xl": scaleFontSize(24),
  "3xl": scaleFontSize(30),
  "4xl": scaleFontSize(36),
} as const;

/**
 * Screen dimensions
 */
export const screen = {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
  isSmall: isSmallScreen(),
  isLarge: isLargeScreen(),
  isTablet: isTablet(),
} as const;

/**
 * Calculate responsive QR code size
 * Returns a size that works well across all screen sizes
 */
export function getQRCodeSize(): number {
  const baseSize = Math.min(SCREEN_WIDTH, SCREEN_HEIGHT) * 0.55;
  return Math.min(Math.max(baseSize, 180), 300); // Min 180, Max 300
}

/**
 * Calculate responsive header height
 */
export function getHeaderHeight(): number {
  return responsive(200, 250, 300);
}

/**
 * Calculate responsive numpad button size
 */
export function getNumpadSize(): {
  buttonSize: number;
  fontSize: number;
  gap: number;
} {
  const buttonSize = SCREEN_WIDTH * 0.22;
  return {
    buttonSize,
    fontSize: buttonSize * 0.4,
    gap: moderateScale(8),
  };
}

/**
 * Calculate responsive PIN input size
 */
export function getPinInputSize(): {
  width: number;
  height: number;
  fontSize: number;
  borderRadius: number;
} {
  const baseSize = responsive(40, 48, 56);
  return {
    width: baseSize,
    height: baseSize,
    fontSize: scaleFontSize(18),
    borderRadius: moderateScale(8),
  };
}
