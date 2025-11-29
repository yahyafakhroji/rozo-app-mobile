import React from 'react';
import { config } from './config';
import { View, ViewProps } from 'react-native';
import { OverlayProvider } from '@gluestack-ui/core/overlay/creator';
import { ToastProvider } from '@gluestack-ui/core/toast/creator';
import { useColorScheme } from '@/hooks/use-color-scheme';

export type ModeType = 'light' | 'dark' | 'system';

// Fallback background colors when CSS variables are not yet loaded
const fallbackBackgrounds = {
  light: '#FFFFFF',
  dark: '#121212',
};

export function GluestackUIProvider({
  mode = 'light',
  ...props
}: {
  mode?: ModeType;
  children?: React.ReactNode;
  style?: ViewProps['style'];
}) {
  const colorScheme = useColorScheme();

  // Determine the effective color scheme
  // When mode is 'system', use the device colorScheme; otherwise use the specified mode
  const effectiveColorScheme = mode === 'system' ? (colorScheme ?? 'light') : mode;

  return (
    <View
      style={[
        config[effectiveColorScheme],
        {
          flex: 1,
          height: '100%',
          width: '100%',
          backgroundColor: fallbackBackgrounds[effectiveColorScheme],
        },
        props.style,
      ]}
      className={effectiveColorScheme}
    >
      <OverlayProvider>
        <ToastProvider>{props.children}</ToastProvider>
      </OverlayProvider>
    </View>
  );
}
