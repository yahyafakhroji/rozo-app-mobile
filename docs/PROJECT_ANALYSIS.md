# Rozo Mobile App - Project Analysis

> Last Updated: November 29, 2025

## Executive Summary

**Rozo** is a production-grade mobile wallet and Point-of-Sale (POS) application built with Expo and React Native. It combines embedded wallet functionality with merchant payment processing, supporting multi-chain cryptocurrency transactions (primarily USDC on Base and Stellar networks).

| Attribute | Value |
|-----------|-------|
| **Framework** | Expo SDK 54 + React Native 0.81 |
| **Language** | TypeScript (strict mode) |
| **UI Stack** | Gluestack UI + NativeWind (Tailwind) |
| **Platforms** | iOS & Android (portrait only) |
| **Package Manager** | Bun 1.2.23 |
| **Version** | 1.1.1 |

---

## Tech Stack Overview

### Core Framework

| Technology | Version | Purpose |
|------------|---------|---------|
| Expo | 54.0.21 | Managed React Native framework |
| React | 19.1.0 | UI library |
| React Native | 0.81.5 | Mobile runtime |
| TypeScript | 5.9.2 | Type safety |
| Expo Router | 6.0.11 | File-based routing |

### UI & Styling

| Technology | Version | Purpose |
|------------|---------|---------|
| Gluestack UI | 3.0.10 | Headless component library |
| NativeWind | 4.1.23 | Tailwind CSS for React Native |
| Tailwind CSS | 3.4.17 | Utility-first CSS framework |
| Lucide React Native | 0.545.0 | Icon library |
| Legend Motion | 2.4.0 | Animation library |

### Authentication & Wallets

| Technology | Version | Purpose |
|------------|---------|---------|
| Privy | 0.59.3 | Passwordless auth + embedded wallets |
| Viem | 2.38.0 | Ethereum client library |
| Passkeys | 0.4.0 | WebAuthn support |

### State & Data

| Technology | Version | Purpose |
|------------|---------|---------|
| React Query | 5.90.2 | Server state management |
| React Hook Form | 7.64.0 | Form handling |
| Zod | - | Schema validation |
| MMKV | 3.3.3 | Encrypted local storage |
| Axios | 1.12.2 | HTTP client |

### Notifications & Real-time

| Technology | Version | Purpose |
|------------|---------|---------|
| Firebase Messaging | 23.5.0 | Push notifications (FCM) |
| Expo Notifications | 0.32.12 | Cross-platform notifications |
| Pusher | 1.3.1 | Real-time WebSocket updates |

### Internationalization

| Technology | Version | Purpose |
|------------|---------|---------|
| i18next | 25.5.3 | i18n framework |
| react-i18next | 16.0.0 | React bindings |

---

## Project Structure

```
rozo-app-mobile/
├── app/                          # Expo Router routes
│   ├── _layout.tsx              # Root layout with providers
│   ├── login.tsx                # Login screen
│   ├── (main)/                  # Protected tab navigation
│   │   ├── balance.tsx          # Wallet balance (default)
│   │   ├── pos.tsx              # Point-of-sale
│   │   ├── orders.tsx           # Order management
│   │   ├── transactions.tsx     # Transaction history
│   │   └── settings/            # Settings screens
│
├── src/
│   ├── assets/                  # Images, icons, SVGs
│   ├── components/              # Reusable UI components
│   │   ├── ui/                  # Gluestack UI wrappers
│   │   ├── screens/             # Full-screen components
│   │   ├── svg/                 # SVG icon components
│   │   └── toast/               # Toast notifications
│   ├── contexts/                # React context definitions
│   ├── providers/               # Context providers
│   ├── features/                # Feature-specific code
│   │   ├── balance/
│   │   ├── payment/
│   │   ├── orders/
│   │   ├── transactions/
│   │   └── settings/
│   ├── modules/                 # Business logic modules
│   │   ├── api/                 # API client & schemas
│   │   ├── axios/               # HTTP setup
│   │   ├── i18n/                # Internationalization
│   │   ├── notifications/       # FCM integration
│   │   └── pusher/              # Real-time updates
│   ├── libs/                    # Utilities & helpers
│   ├── hooks/                   # Custom React hooks
│   ├── translations/            # i18n JSON files
│   └── types/                   # TypeScript definitions
│
├── plugins/                     # Expo config plugins
├── docs/                        # Documentation
├── ios/                         # Native iOS project
├── android/                     # Native Android project
└── [config files]               # Various configuration
```

---

## Architecture Patterns

### Provider Hierarchy

```
Root Layout
├── ErrorBoundary
├── GluestackUIProvider
│   └── GestureHandlerRootView
│       └── ThemeProvider
│           └── QueryProvider
│               └── PrivyProvider
│                   └── AppProvider (composite)
│                       ├── ToastProvider
│                       ├── AuthProvider
│                       ├── MerchantProvider
│                       ├── StellarProvider
│                       ├── WalletProvider
│                       └── PreferencesProvider
│                           └── NotificationProvider
│                               └── KeyboardProvider
```

### State Management

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Auth | Privy SDK + Context | User authentication, JWT |
| Merchant | React Context | Profile, settings, tokens |
| Wallet | React Context | Wallets, balances, chain |
| Preferences | Context + MMKV | Theme, language, POS toggle |
| Server State | React Query | API caching, background sync |
| Local Storage | MMKV (encrypted) | Persistent data |

### API Architecture

```
src/modules/api/
├── api/
│   └── merchant/
│       ├── profile.ts          # Merchant profile
│       ├── wallets.ts          # Wallet operations
│       ├── deposits.ts         # Deposit handling
│       ├── orders.ts           # Order management
│       ├── exchange.ts         # Currency exchange
│       └── pin.ts              # PIN operations
└── schema/
    ├── merchant.ts             # Zod schemas
    ├── transaction.ts
    ├── order.ts
    └── deposit.ts
```

---

## Key Features

### 1. Wallet Management
- Multi-chain support (Base + Stellar)
- USDC token support on both chains
- Real-time balance fetching
- Automatic embedded wallet creation via Privy
- Primary wallet selection

### 2. Authentication & Security
- Passwordless email authentication (Privy)
- 4-digit PIN for sensitive operations
- WebAuthn/passkey support
- Apple Sign-In (iOS)
- MMKV encrypted storage
- Route protection middleware

### 3. Point-of-Sale (POS)
- Accept USDC payments
- Order management
- Transaction logging
- Toggle feature per merchant

### 4. Transactions & Orders
- Transaction history with filtering
- Order lifecycle management
- Status tracking (pending/completed/failed)

### 5. Deposits & Withdrawals
- Receive funds into wallet
- Send funds with PIN verification
- Manual confirmation option
- Status tracking

### 6. Settings
- Profile management (name, email, logo)
- Wallet settings
- Security settings (PIN management)
- Notification preferences
- Language selection (10 languages)
- Theme selection (light/dark)

### 7. Notifications
- Firebase Cloud Messaging (FCM)
- Real-time updates via Pusher
- Order updates, payment reminders
- Android notification channels

### 8. Internationalization
- 10 languages: EN, AR, BN, FR, HI, ID, PT, RU, ES, ZH
- Dynamic language switching
- Persistent language preference

---

## Styling System

### Three-Layer Approach

1. **Tailwind CSS** - Utility-first framework with custom semantic colors
2. **NativeWind** - Tailwind-to-React-Native compilation
3. **Gluestack UI** - Headless component library with theme tokens

### Color System

- **Semantic colors**: primary, secondary, tertiary, error, success, warning, info
- **Typography colors**: 950-100 scale with light/dark variants
- **Background colors**: 0-950 scale with semantic variants
- **Dark mode**: Class-based with `dark:` prefix

### Component Pattern

```tsx
<View
  className={cn(
    "items-center justify-center rounded-xl",
    focused && "bg-primary-500/10 dark:bg-primary-400/10"
  )}
  style={{ width: 40, height: 32 }}
>
  <Icon as={Coins} size="md" style={{ color }} />
</View>
```

---

## Blockchain Networks

### Base (Ethereum L2)

| Property | Value |
|----------|-------|
| Network ID | 0x2105 |
| Token | USDC |
| Contract | 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913 |
| Decimals | 6 |
| Explorer | basescan.org |

### Stellar

| Property | Value |
|----------|-------|
| Network ID | 0x900 |
| Token | USDC |
| Address | GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN |
| Decimals | 7 |
| Explorer | stellar.expert |

---

## Configuration Files

### app.config.js
- App name: Rozo
- Package ID: com.rozoapp
- Deep link scheme: rozo://
- Portrait orientation only
- New Architecture enabled
- React Compiler enabled
- Typed routes enabled

### tailwind.config.js
- Dark mode: class-based
- NativeWind preset
- Custom semantic color system
- Custom font families (Inter, Jakarta, Roboto)
- Custom shadow utilities

### metro.config.js
- NativeWind integration
- Custom module resolution for Web3 packages

---

## Build & Deployment

### EAS Build Profiles

| Profile | Purpose |
|---------|---------|
| development | Dev builds with dev client |
| preview | Staging builds for testing |
| production | Release builds |

### Scripts

```bash
# Development
bun start              # Start dev server
bun start:dev          # Start with dev client
bun ios                # Run on iOS
bun android            # Run on Android

# Building
bun build:dev:all      # Dev builds (iOS + Android)
bun build:preview:all  # Preview builds
bun build:prod:all     # Production builds

# Deployment
bun submit:ios         # Submit to App Store
bun submit:android     # Submit to Play Store
bun update:prod        # OTA update
```

### Version Management

```
Version: 1.1.1
Android versionCode: 11101 (MAJOR*10000 + MINOR*100 + PATCH)
iOS buildNumber: "11101"
```

---

## Development Guidelines

### Import Aliases

```typescript
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers";
import { storage } from "@/libs/storage";
```

### Code Quality

- ESLint with Expo config
- Git hooks via Lefthook
- TypeScript strict mode
- Path aliases (@/...)

### Storage Keys

```typescript
// MMKV Storage Keys
"auth.token"              // JWT token
"merchant.*"              // Merchant data
"preferences.*"           // User preferences
"notification.fcmToken"   // FCM token
"notification.deviceId"   // Device identifier
"invitation.validated"    // Invitation state
```

---

## React Query Configuration

```typescript
staleTime: 5 minutes
gcTime: 10 minutes
retry: 1 attempt
refetchOnReconnect: always
refetchOnMount: true
refetchOnWindowFocus: false
```

---

## Key Architectural Decisions

| Decision | Implementation | Rationale |
|----------|----------------|-----------|
| Authentication | Privy + JWT | Passwordless, embedded wallets |
| Styling | Tailwind + NativeWind + Gluestack | Code reuse, accessibility |
| State | React Context + React Query | Simplicity, async handling |
| Storage | MMKV encrypted | Fast, secure, persistent |
| Notifications | FCM + Pusher | Push + real-time |
| Routing | Expo Router | File-based, convention-based |
| Blockchain | Multi-chain (Base + Stellar) | Flexibility, user choice |
| i18n | i18next | Standard solution, ecosystem |

---

## Related Documentation

- [TOAST_SYSTEM.md](./TOAST_SYSTEM.md) - Toast notification system
- [ROUTE_PROTECTION.md](./ROUTE_PROTECTION.md) - Route protection architecture
- [FLEXIBLE_ROUTE_PROTECTION.md](./FLEXIBLE_ROUTE_PROTECTION.md) - Route protection API
- [ROUTE_PROTECTION_EXAMPLES.md](./ROUTE_PROTECTION_EXAMPLES.md) - Route protection examples
- [BUILD.md](./BUILD.md) - Build instructions
