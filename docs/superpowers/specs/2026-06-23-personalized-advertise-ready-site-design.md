# Personalized, Advertise-Ready handsforhearts — Design Spec

**Date:** 2026-06-23
**Status:** Approved (pending written-spec review)
**Site:** https://www.handsforhearts.health (Next.js 16 App Router, Tailwind, deployed on Vercel)

---

## 1. Goal

Transform the static placeholder marketing site into one that:

1. **Feels personal** — honest, locally-relevant, human, with a distinctive brand voice (no fabricated numbers).
2. **Is built to be advertised** — shareable link previews, discoverable in search, a working waitlist that actually captures emails, and analytics that show which campaigns convert.

This is a single, coherent improvement to one marketing site. It does **not** touch the native app, backend, or any PRD Phase 2–4 work.

## 2. Current State (what exists today)

- **Landing (`app/page.tsx`)** — desktop only. Sections: `Navbar` → `Hero` → `StatsBar` → `MissionGridSection` → `AlertDemo` → `VariantCTASection` → `Footer`. `StatsBar` and `MissionGridSection` use decorative **three.js** effects (`ClientParticleField`, `ClientFloatingMedical`, lazy-loaded via `next/dynamic`, `ssr:false`).
- **Mobile (`app/mobile/page.tsx`)** — `middleware.ts` redirects every phone user-agent here. It is a dead-end: "this lives in the app," a fake `href="#"` App Store button, **no waitlist**.
- **Waitlist forms are dead** — three separate `<form>`/button instances (Hero, `VariantCTASection`, Navbar). Buttons are `type="button"`; nothing submits anywhere.
- **Fabricated stats** — in `Hero` ("Network Active: 14,202 Responders"), in `StatsBar` ("240ms Alert Latency", "14.2k Active Responders", "142+ Metro Areas", "4.7min Avg Response Time"), and in `MissionGridSection` ("Join 50k+ Volunteers / +52,000 responders", "240ms Average Alert Latency", "142 metropolitan areas").
- **Brand font not loaded** — components use `font-['Newsreader']` but `layout.tsx` only imports Inter, so the serif look silently falls back to system serif.
- **SEO/share gaps** — no OG image, no `sitemap`/`robots`, no structured data; `metadata` lacks `metadataBase` and Twitter card.
- **Broken nav anchors** — Navbar links `#how-it-works` and `#why-it-matters` point to section IDs that do not exist.
- **Stale footer** — `© 2024`.
- **Dependency conflict** — `react`/`react-dom` are `18.3.1`, but `@react-three/fiber@9` (peer `react >=19 <19.3`) and `@react-three/drei@10` (peer `react ^19`) require **React 19**. The 3D effects run on an unsupported React version. Also: `next.config.js` is empty `{}`; images use raw `<img>` to large external URLs; `skills/three/HeartScene.tsx` is dead code (never imported).

## 3. Decisions (locked)

| Decision | Choice | Notes |
|---|---|---|
| Waitlist storage | **Google Sheet webhook** (Apps Script web app) | Routed through our own `/api/waitlist`; webhook URL stays server-side. |
| Analytics | **Vercel Analytics** + custom `waitlist_signup` event | Zero-config on Vercel; signup event carries UTM/campaign. |
| Personalization source | **Vercel geo headers** (`x-vercel-ip-city`/`-country-region`/`-country`) + UTM query params | Read server-side; graceful "near you" fallback. |
| Stories | **Real cited stats + clearly-labeled example stories** in a content file | Nothing misleading ships; user swaps in real stories later. |
| Mobile | **Remove the redirect; make the landing responsive** with the waitlist on it | Best for ad conversion; one page; crawler-safe. |
| Test runner | **Vitest** (node environment) for pure logic + route handlers | Project has no test setup today; add it. UI verified via build + Vercel preview. |
| 3D effects / React | **Keep three.js; upgrade React 18.3.1 → ^19** (react, react-dom, @types) | Satisfies fiber 9 + drei 10 + Next 16 peers; fixes the conflict while keeping the visual. |
| Images | **Migrate `<img>` → `next/image`** + `next.config` `remotePatterns` | Lazy-load, AVIF/WebP, responsive sizes — LCP/SEO/ad-perf win. |

### 3.1 Tech stack optimization (decided)

| Piece | Now | Action |
|---|---|---|
| `react` / `react-dom` / `@types/*` | 18.3.1 / `^18` | **Upgrade to `^19`** to satisfy fiber 9 / drei 10 / Next 16. |
| `three` / `@react-three/fiber` / `@react-three/drei` | 0.184 / 9 / 10 | **Keep** (lazy-loaded decorative effects). Delete dead `skills/three/HeartScene.tsx`. |
| `next` 16.2.1 / `next.config.js` | empty `{}` | Add `images.remotePatterns`, `reactStrictMode: true`, `poweredByHeader: false`. |
| images | raw `<img>` → external URLs | Migrate to `next/image` with explicit `width`/`height`/`sizes` (or `fill`). |
| `framer-motion` 11 / `lucide-react` | fine | Keep as-is (tree-shakeable; React 19-compatible). |
| `tailwindcss` 3.4 | fine | Keep (defer v4 migration — out of scope). |
| testing / analytics | none | Add **Vitest** (node) + **@vercel/analytics** — both lean. |

The React 19 upgrade is the headline fix: it removes the peer-dependency violation rather than papering over it.

## 4. Architecture & File Structure

### New files
| File | Responsibility |
|---|---|
| `lib/email.ts` | `isValidEmail(value): boolean` — single source of email validation. |
| `lib/visitor.ts` | `getVisitorContext()` — reads Vercel geo headers, returns `{ city, region, country }` with null-safe fallbacks. |
| `lib/waitlist-store.ts` | `submitSignup(payload): Promise<SignupResult>` — POSTs to the Google Sheet webhook; the only place that knows about the provider. |
| `types/waitlist.ts` | Shared types: `SignupPayload`, `SignupResult`. |
| `app/api/waitlist/route.ts` | `POST` handler — validates, merges geo, calls `submitSignup`, returns typed JSON. |
| `components/waitlist/WaitlistForm.tsx` | One shared, DRY waitlist form (replaces all three duplicated instances). |
| `components/sections/WhyItMatters.tsx` | Real, cited cardiac stats. `id="why-it-matters"`. |
| `components/sections/Stories.tsx` | Survivor stories rendered from `content/stories.ts`, with an "example" label until real ones are added. |
| `components/sections/FounderNote.tsx` | Short personal "why we built this" note (placeholder text to replace). |
| `content/stories.ts` | Editable story data + `STORIES_ARE_EXAMPLES` flag. |
| `content/stats.ts` | Editable cited statistics with source attribution. |
| `app/opengraph-image.tsx` | Dynamic on-brand OG image via `next/og` `ImageResponse`. |
| `app/sitemap.ts` | Sitemap for `/` and `/cpr-guide`. |
| `app/robots.ts` | robots.txt allowing all + sitemap URL. |
| `components/seo/JsonLd.tsx` | `Organization` + `WebSite` structured data. |
| `vitest.config.ts` + test files | Test runner config and tests colocated under `__tests__/` or `*.test.ts`. |
| `.env.local.example` | Documents `WAITLIST_SHEET_WEBHOOK_URL`. |

### Modified files
| File | Change |
|---|---|
| `middleware.ts` | Remove the mobile redirect. (Delete the file — the redirect is its only function.) |
| `app/mobile/page.tsx` | Delete (no longer redirected; its App Store "coming soon" line moves into the main CTA). |
| `app/layout.tsx` | Load Newsreader via `next/font/google` with `variable: '--font-newsreader'`; add `metadataBase`, Twitter card, keywords; mount `<Analytics/>` and `<JsonLd/>`. |
| `app/page.tsx` | Make a server component that reads visitor context + `searchParams` (UTM); render responsive sections incl. `WhyItMatters`, `Stories`, `FounderNote`; use `WaitlistForm`; add section `id`s. |
| `components/sections/Hero.tsx` | Accept `city`/`campaign` props; honest visitor-aware badge; use `WaitlistForm`; ensure responsive. |
| `components/layout/Navbar.tsx` | "Join Waitlist" scrolls to the waitlist anchor (or opens it); keep responsive. |
| `components/layout/Footer.tsx` | Year via `new Date().getFullYear()`; consistent brand name. |
| `app/cpr-guide/page.tsx` | Add a `metadata` export (title/description/canonical). |
| `tailwind.config.ts` / `app/globals.css` | Add `fontFamily.display` mapped to `var(--font-newsreader)`; replace the (currently non-resolving) `font-['Newsreader']` usages across components with the `font-display` utility. |
| `package.json` | Upgrade `react`/`react-dom` → `^19` and `@types/react`/`@types/react-dom` → `^19`; add `test` script + Vitest dev deps; add `@vercel/analytics`. |
| `next.config.js` | Add `images.remotePatterns` (`lh3.googleusercontent.com`, `www.transparenttextures.com`), `reactStrictMode: true`, `poweredByHeader: false`. |
| `app/page.tsx`, `components/sections/*` (img usage) | Replace raw `<img>` with `next/image` (explicit `width`/`height`/`sizes`; `priority` only on the Hero image). |
| `skills/three/HeartScene.tsx` | Delete — unused dead code. |

### Data flow — waitlist

```
WaitlistForm (client)
  reads email + UTM (from URL) + referrer (document.referrer)
  → POST /api/waitlist  { email, utm:{source,medium,campaign,...}, referrer }
      → route validates email (lib/email)         → 400 on invalid
      → merges Vercel geo (lib/visitor)
      → submitSignup() (lib/waitlist-store)
          → POST to WAITLIST_SHEET_WEBHOOK_URL (Apps Script)
              → Apps Script: dedupe by email, append row, return {status}
      ← { ok:true, status:'subscribed' | 'already' }  |  { ok:false, error }
  → success / "already on the list" / error UI
  → on success: track('waitlist_signup', { campaign })   // Vercel Analytics
```

### Data flow — personalization

```
middleware (none — removed)
app/page.tsx (server component, async)
  city   = getVisitorContext() from headers()      // x-vercel-ip-city
  utm    = await searchParams                       // utm_campaign etc.
  → <Hero city={city} campaign={utm.campaign} />    // "first responders in {City}" / "near you"
```

## 5. Section-by-Section Requirements

### Section 1 — Working waitlist (convert)
- `WaitlistForm` props: `variant?: 'stacked' | 'inline'`, `source?: string` (which section, for analytics), `className?`.
- Reads UTM params from `window.location.search` and `document.referrer` at submit time.
- States: idle, submitting (disabled + spinner), success ("You're on the list — we'll be in touch."), already ("You're already on the list."), error ("Something went wrong — try again.").
- Client-side email check before submit using `isValidEmail`; server re-validates.
- On success fires `track('waitlist_signup', { source, campaign })`.
- Replaces the inline forms in Hero and `VariantCTASection`; Navbar button scrolls to `#waitlist`.

### Section 2 — Visitor-aware personalization (personalize)
- `getVisitorContext()` returns `{ city: string|null, region: string|null, country: string|null }`. City is URL-decoded; all fields null when headers absent (local dev).
- Hero badge (replaces the fake "14,202 Responders"): `Be among the first responders in {City}.` → fallback `Be among the first responders near you.` Honest pre-launch framing — **no invented counts**.
- Optional campaign-aware subheadline: a small `CAMPAIGN_HEADLINES` map keyed by `utm_campaign`, with the default copy as fallback. (YAGNI: keep the map tiny; only add entries the user actually runs.)

### Section 3 — Honest content & human stories (personalize)
- **Replace every fabricated number** — across the `Hero` badge, `StatsBar` (240ms / 14.2k / 142+ / 4.7min), and `MissionGridSection` (50k+ / +52,000 / 240ms / 142 metros) — with content from `content/stats.ts` (real, cited):
  - ~356,000 out-of-hospital cardiac arrests in the US each year.
  - Survival falls 7–10% for every minute without CPR/defibrillation.
  - Bystander CPR can double or triple survival.
  - Median EMS response time is 7–12 minutes.
  - Each stat carries a `source` string (American Heart Association) shown as a footnote. **Implementer/user must verify and link the AHA source before launch.**
- `WhyItMatters` section renders these with `id="why-it-matters"` (fixes the broken nav anchor).
- `Stories` section renders `content/stories.ts`. While `STORIES_ARE_EXAMPLES` is `true`, each card shows a small "Illustrative example" label so nothing is mistaken for a real testimonial. Includes a "Share your story" mailto/CTA.
- `FounderNote` — one short paragraph, signed, placeholder text clearly marked `TODO: replace with real founder note`.

### Section 4 — Shareable link previews (advertise)
- `app/opengraph-image.tsx`: 1200×630, near-black (`#131313`) background, coral (`#FFB4AA`) serif headline "Because every heart deserves a second chance.", `handsforhearts` wordmark, tagline. `contentType: 'image/png'`.
- `app/layout.tsx` metadata: `metadataBase: new URL('https://www.handsforhearts.health')`, `twitter: { card: 'summary_large_image', title, description }`, canonical, refined description/keywords. (Next.js auto-wires `opengraph-image.tsx` into OG + Twitter tags.)

### Section 5 — SEO / get found (advertise)
- `app/sitemap.ts` lists `/` and `/cpr-guide` with `lastModified`.
- `app/robots.ts`: allow all; reference sitemap.
- `components/seo/JsonLd.tsx`: `Organization` (name, url, logo, sameAs[]) + `WebSite` JSON-LD, rendered in `layout.tsx`.
- Add section `id`s so Navbar anchors work: `AlertDemo` → `id="how-it-works"`, `WhyItMatters` → `id="why-it-matters"`, plus `id="waitlist"` on the CTA section.
- `app/cpr-guide/page.tsx`: add `metadata` (title, description, canonical).
- Ensure one `<h1>` per page and logical heading order.

### Section 6 — Analytics / measure (advertise)
- Add `@vercel/analytics`; mount `<Analytics/>` in `layout.tsx`.
- `waitlist_signup` custom event (from Section 1) carries `source` + `campaign`.
- UTM params captured with each signup row in the Sheet (Section 1 data flow), giving per-campaign attribution.

### Section 7 — Polish & consistency
- Footer year dynamic; brand name consistently "handsforhearts".
- Load Newsreader properly; verify the serif look renders.
- Remove `middleware.ts` redirect + delete `/mobile`; confirm phones get the full responsive page.
- `npm run build` and `npm run lint` pass; spot-check responsive layout at mobile width.

### Section 8 — Tech stack & performance (optimize)
- Upgrade `react`/`react-dom` and their `@types` to `^19`; run `npm install`; verify the 3D effects (`ParticleField`, `FloatingMedical`) still render and `npm run build` passes.
- Add `next.config.js`: `images.remotePatterns` for `lh3.googleusercontent.com` + `www.transparenttextures.com`, `reactStrictMode: true`, `poweredByHeader: false`.
- Replace raw `<img>` tags with `next/image` (explicit `width`/`height` or `fill` + `sizes`); `priority` only on the above-the-fold Hero image.
- Delete unused `skills/three/HeartScene.tsx`.
- Keep three.js lazy-loaded (`next/dynamic`, `ssr:false`) so it never blocks first paint.

## 6. Error Handling
- `/api/waitlist`: invalid/missing email → `400 { ok:false, error:'invalid_email' }`. Webhook unreachable/non-200 → `502 { ok:false, error:'store_unavailable' }` (logged server-side; never leak the webhook URL). Missing `WAITLIST_SHEET_WEBHOOK_URL` → `500 { ok:false, error:'not_configured' }`.
- `WaitlistForm`: shows a friendly error for any non-`ok` response; the email stays in the field so the user can retry.
- `getVisitorContext()`: never throws; missing headers → all-null context → "near you" copy.
- OG/SEO routes must not depend on geo or env so crawlers always succeed.

## 7. Testing Strategy (Vitest, node env)
- `lib/email.test.ts` — valid/invalid emails (empty, no `@`, no domain, spaces, valid).
- `lib/visitor.test.ts` — header parsing: city present (URL-encoded → decoded), region/country, all absent → nulls.
- `lib/waitlist-store.test.ts` — mocked `fetch`: success → `subscribed`; webhook `{status:'duplicate'}` → `already`; non-200 → throws/`store_unavailable`.
- `app/api/waitlist/route.test.ts` — invalid email → 400; valid + mocked store → 200 `subscribed`; store error → 502.
- UI (`WaitlistForm`, responsive layout) verified via `npm run build` + Vercel preview deploy (no RTL setup in scope).

## 8. Manual Setup Steps (user performs)
1. **Create the Google Sheet + Apps Script webhook** (exact `doPost` code provided in the implementation plan), deploy as a Web App with "Anyone" access, copy the `/exec` URL.
2. **Set env var** `WAITLIST_SHEET_WEBHOOK_URL` in Vercel (Production + Preview) and in local `.env.local`.
3. **Replace placeholder content**: founder note, example stories (then flip `STORIES_ARE_EXAMPLES` to `false`).
4. **Verify stat sources**: confirm/link the American Heart Association citations before launch.

## 9. Out of Scope
- Native iOS/watchOS app, backend, geofencing, real alerts (PRD Phases 2–4).
- Real survivor stories content (structure ships; user fills).
- Running actual ad campaigns; A/B testing; internationalization.
- Component-level UI test harness (RTL/jsdom).

## 10. Success Criteria
- A visitor on any device (incl. phones) can submit the waitlist and the email lands in the Google Sheet with UTM + city columns.
- Sharing the URL on social/iMessage shows a branded preview image and title.
- `sitemap.xml`, `robots.txt`, and JSON-LD are present and valid; nav anchors scroll correctly.
- No fabricated statistics remain; all displayed stats are cited.
- Hero greets visitors with their city when available, "near you" otherwise.
- Vercel Analytics records `waitlist_signup` events with campaign attribution.
- `npm run build` and `npm run lint` pass.
- `react`/`react-dom` are on `^19`; the fiber/drei peer-dependency conflict is gone; 3D effects render unchanged.
- Images are served through `next/image` (responsive, lazy); `next.config.js` allows the external image hosts.
