# Listy Gifty Mobile App

## Overview
Listy Gifty is the React Native/Expo mobile companion to NiftyGifty. It shares types and services with the monorepo but **builds independently**.

## ⚠️ CRITICAL: This App Builds Independently

This app is **intentionally decoupled** from the monorepo's npm workspaces:

1. **NOT in root workspaces** - The root `package.json` only includes `apps/web`
2. **Own `node_modules`** - Has its own dependencies, not hoisted
3. **Own `package-lock.json`** - Separate lockfile
4. **`file:` references** - Links to shared packages via relative paths

### Why?
- React Native 0.81.5 requires React 19.1.0
- Web app uses React 19.2.0  
- npm workspace hoisting causes version conflicts
- Expo has specific peer dependency requirements

## Tech Stack
- **Expo SDK 54** with Expo Router
- **React Native 0.81.5** with New Architecture enabled
- **React 19.1.0** (pinned for RN compatibility)
- **Clerk** for authentication (`@clerk/clerk-expo`)
- **TypeScript** with strict mode

## Shared Packages

The app imports from monorepo packages via `file:` references:

```json
"@niftygifty/types": "file:../../packages/types",
"@niftygifty/api-client": "file:../../packages/api-client",
"@niftygifty/services": "file:../../packages/services"
```

These are symlinked, so changes in packages are reflected immediately.

### Before Running Mobile
Always ensure shared packages are built:
```bash
cd /path/to/niftygifty
npm run build  # Builds types, api-client, services
```

## Commands

### Install Dependencies
```bash
# ALWAYS use --legacy-peer-deps due to Clerk peer dep conflicts
npm install --legacy-peer-deps
```

### Development
```bash
npx expo start           # Start Expo dev server
npx expo start --ios     # Open iOS simulator
npx expo start --android # Open Android emulator
npx expo start --web     # Open in browser (limited support)
```

### Testing
```bash
npm test                 # Run all tests
npm run test:watch       # Watch mode
npm run test:coverage    # With coverage report
```

### Building
```bash
# Development builds
npx expo run:ios
npx expo run:android

# Production builds (requires EAS)
eas build --platform ios
eas build --platform android
```

## Project Structure

```
apps/mobile/
├── app/                    # Expo Router pages
│   ├── _layout.tsx         # Root layout with Clerk provider
│   ├── index.tsx           # Entry redirect
│   ├── (app)/              # Authenticated routes
│   │   ├── _layout.tsx
│   │   ├── index.tsx       # Home/dashboard
│   │   ├── gifts/
│   │   └── lists/
│   └── auth/               # Unauthenticated routes
│       ├── _layout.tsx
│       ├── login.tsx
│       └── signup.tsx
├── assets/                 # Images, icons, splash
├── components/             # Reusable components
├── lib/                    # Utilities
│   ├── api.ts              # API client + services setup
│   ├── token-cache.ts      # Clerk token storage
│   └── use-api.ts          # React Query hooks (if used)
├── __tests__/              # Jest tests
├── app.json                # Expo config
├── babel.config.js
├── jest.config.js
├── metro.config.js
├── package.json
└── tsconfig.json
```

## Authentication

Uses Clerk with Expo:

```typescript
import { useAuth, useUser } from "@clerk/clerk-expo";

// Check auth state
const { isSignedIn, getToken } = useAuth();

// Get user info
const { user } = useUser();

// Sign out
await signOut();
```

### Token Storage
Tokens are stored in `expo-secure-store` via `lib/token-cache.ts`.

### OAuth (Google)
Uses `useSSO` hook from `@clerk/clerk-expo`:

```typescript
import { useSSO } from "@clerk/clerk-expo";

const { startSSOFlow } = useSSO();
await startSSOFlow({ strategy: "oauth_google" });
```

## API Integration

The app uses shared services from `@niftygifty/services`:

```typescript
// lib/api.ts
import { ApiClient } from "@niftygifty/api-client";
import { createHolidaysService } from "@niftygifty/services";

export const apiClient = new ApiClient({ baseUrl: API_URL });
export const holidaysService = createHolidaysService(apiClient);
```

Usage in components:
```typescript
import { holidaysService } from "@/lib/api";

const holidays = await holidaysService.getAll();
```

## Environment Variables

Create `.env` file (gitignored):

```bash
# API URL
EXPO_PUBLIC_API_URL=http://localhost:3001

# Clerk (same keys as web app)
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
```

For physical device testing, use your machine's IP:
```bash
EXPO_PUBLIC_API_URL=http://192.168.1.100:3001
```

## Styling Conventions

- Dark theme by default (#0f172a background)
- Violet accent color (#8b5cf6)
- Use React Native StyleSheet, not Tailwind
- Consistent with web app color palette

```typescript
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",  // slate-900
  },
  button: {
    backgroundColor: "#8b5cf6",  // violet-500
    padding: 16,
    borderRadius: 8,
  },
  text: {
    color: "#fff",
  },
  mutedText: {
    color: "#94a3b8",  // slate-400
  },
});
```

## Testing

Uses Jest with jest-expo preset:

```bash
npm test                    # Run all tests
npm run test:watch          # Watch mode  
npm run test:coverage       # Coverage report
```

Test files go in `__tests__/` directory:
- `__tests__/components/` - Component tests
- `__tests__/lib/` - Utility tests

## Troubleshooting

### Metro bundler issues
```bash
npx expo start --clear
```

### Dependency conflicts
```bash
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### Shared package changes not reflecting
```bash
# Rebuild packages from repo root
cd ../.. && npm run build
# Then restart Metro
cd apps/mobile && npx expo start --clear
```

### React version mismatch errors
Ensure `package.json` has:
```json
"react": "19.1.0",
"react-test-renderer": "19.1.0"
```
