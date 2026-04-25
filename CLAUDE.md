# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**handsforhearts** — Phase 1 marketing website for a cardiac arrest emergency response app (formerly ERAC). The system uses Apple Watch biometric detection to broadcast CPR alerts to nearby bystanders.

This repo contains two separate apps:

| Directory | Stack | Purpose |
|-----------|-------|---------|
| `/` (root) | Next.js 14, Tailwind, Framer Motion | Web marketing site (desktop-only) |
| `frontendforios/` | React Native, Expo, react-native-maps | iOS responder map prototype |

## Commands

### Web (Next.js — run from repo root)
```bash
npm run dev      # start dev server
npm run build    # production build
npm run lint     # ESLint
```

### Mobile (Expo — run from frontendforios/)
```bash
cd frontendforios
npx expo start   # start Expo dev server
npx expo start --ios   # iOS simulator
```

## Web App Architecture

### Routing (`app/`)
- `/` — single-scroll landing page: Hero → HowItWorks → AlertDemo → WhyItMatters → CTABanner
- `/cpr-guide` — full-screen interactive CPR stepper (`components/cpr/CPRGuide`)
- `/mobile` — redirect target for mobile UA detection; tells users to download the app

### Mobile UA Redirect
`middleware.ts` detects mobile user agents and redirects all non-`/mobile` routes to `/mobile`. This is intentional — the web experience is desktop-only.

### Design Tokens (Tailwind)
Custom colors defined in `tailwind.config.ts`:
- `emergency` → `#E8192C` (primary red)
- `pulse` → `#FF6B35` (orange accent)
- `surface` / `surface-2` → dark card backgrounds
- `success` → `#30D158`

Custom animations: `heartbeat`, `pulse-ring`, `ecg-scroll`, `beat`

### Component Structure
```
components/
  layout/    Navbar, Footer
  sections/  Hero, HowItWorks, AlertDemo, WhyItMatters, CTABanner
  cpr/       CPRGuide (interactive stepper with metronome)
```

## Mobile App Architecture (`frontendforios/`)

Single-screen prototype — `AlertResponseScreen` is the only screen rendered by `App.tsx`.

### Screen Layout (3 zones)
1. **Map zone** — `react-native-maps` MapView showing victim pin, AED markers, user location
2. **Alert info card** — victim name/distance from `components/map/AlertInfoCard`
3. **Nearby devices list** — `components/nearby/DeviceList`

### Custom Markers
- `components/map/VictimMarker` — animated red pulse for cardiac arrest victim location
- `components/map/AEDMarker` — AED defibrillator locations

### Mock Data (`data/`)
All data is static mock data for prototype purposes:
- `victimEvent.ts` — `MOCK_VICTIM` and `MOCK_USER_LOCATION`
- `mockDevices.ts` — `MOCK_DEVICES` (nearby responder list)
- `aedData.ts` — `AED_LOCATIONS`

## Scope Notes

This is Phase 1 (marketing/prototype only). There is no backend, no real HealthKit, no APNs, no authentication, and no live data. The PRD (`PRD.md`) documents the full multi-phase vision.
