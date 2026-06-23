# Personalized, Advertise-Ready handsforhearts — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the handsforhearts marketing site personal (honest, locally-relevant, distinctive) and advertise-ready (shareable previews, SEO, a working waitlist, analytics), while fixing the React 19 / three.js dependency conflict.

**Architecture:** Next.js 16 App Router on Vercel. A shared `WaitlistForm` posts to a `/api/waitlist` route handler that forwards to a Google Sheet webhook; the landing page is an async Server Component that reads Vercel geo headers + UTM params and passes them to a personalized Hero. Pure logic (email, visitor, store, route) is TDD'd with Vitest; UI/content/config is verified by `npm run build`.

**Tech Stack:** Next.js 16, React 19 (upgraded from 18.3), TypeScript, Tailwind 3.4, three.js (kept, lazy-loaded), framer-motion, Vitest, @vercel/analytics.

**Spec:** `docs/superpowers/specs/2026-06-23-personalized-advertise-ready-site-design.md`

**Conventions:** Palette `#131313` bg, `#e2e2e2` text, `#FFB4AA`/`#FF5545` coral accents, `#e4bebc` secondary, `#53E16F` green. Serif display = `font-display` (Newsreader). Run all commands from the repo root `C:\Users\dmyer\handsforhearts\Y-Hack26`.

---

## File Structure

**New:** `lib/email.ts`, `lib/visitor.ts`, `lib/waitlist-store.ts`, `types/waitlist.ts`, `app/api/waitlist/route.ts`, `components/waitlist/WaitlistForm.tsx`, `components/sections/WhyItMatters.tsx`, `components/sections/Stories.tsx`, `components/sections/FounderNote.tsx`, `content/stats.ts`, `content/stories.ts`, `components/seo/JsonLd.tsx`, `app/opengraph-image.tsx`, `app/sitemap.ts`, `app/robots.ts`, `vitest.config.ts`, `.env.local.example`, plus `*.test.ts` files.

**Modified:** `package.json`, `next.config.js`, `tailwind.config.ts`, `app/layout.tsx`, `app/page.tsx`, `app/cpr-guide/page.tsx`, `components/sections/Hero.tsx`, `components/layout/Navbar.tsx`, `components/layout/Footer.tsx`.

**Deleted:** `middleware.ts`, `app/mobile/page.tsx`, `skills/three/HeartScene.tsx`.

---

## Task 1: Tooling, dependencies & config

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`, `.env.local.example`
- Modify: `next.config.js`

- [ ] **Step 1: Upgrade React to 19 and add deps**

Run:
```bash
npm install react@^19 react-dom@^19 @vercel/analytics
npm install -D @types/react@^19 @types/react-dom@^19 vitest
```
Expected: installs succeed; `npm ls react` shows `react@19.x`. The fiber/drei peer warnings for React 18 are gone.

- [ ] **Step 2: Add the `test` script**

In `package.json`, add to `"scripts"`:
```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 3: Create `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  test: {
    environment: "node",
    include: ["lib/**/*.test.ts", "app/**/*.test.ts"],
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./", import.meta.url)),
    },
  },
});
```

- [ ] **Step 4: Harden `next.config.js`**

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
};

module.exports = nextConfig;
```

- [ ] **Step 5: Create `.env.local.example`**

```bash
# Google Apps Script web-app URL that appends waitlist signups to a Sheet.
# Create via the script in Appendix A, deploy as a Web App ("Anyone"),
# then paste the /exec URL here and in Vercel project env vars.
WAITLIST_SHEET_WEBHOOK_URL=
```

- [ ] **Step 6: Verify the React 19 upgrade builds (3D effects intact)**

Run: `npm run build`
Expected: build succeeds. The page still references `ClientParticleField`/`ClientFloatingMedical`; no React-version errors.

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json vitest.config.ts next.config.js .env.local.example
git commit -m "build: upgrade React 19, add Vitest + analytics, harden next.config"
```

---

## Task 2: Email validation (`lib/email.ts`)

**Files:**
- Create: `lib/email.ts`
- Test: `lib/email.test.ts`

- [ ] **Step 1: Write the failing test**

`lib/email.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { isValidEmail } from "./email";

describe("isValidEmail", () => {
  it("accepts a normal address", () => {
    expect(isValidEmail("alex@example.com")).toBe(true);
  });
  it("trims surrounding whitespace", () => {
    expect(isValidEmail("  alex@example.com  ")).toBe(true);
  });
  it.each(["", "alex", "alex@", "alex@b", "a b@c.com", "@example.com"])(
    "rejects %j",
    (bad) => expect(isValidEmail(bad)).toBe(false),
  );
  it("rejects non-strings", () => {
    expect(isValidEmail(undefined)).toBe(false);
    expect(isValidEmail(42)).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run lib/email.test.ts`
Expected: FAIL — `isValidEmail` is not defined / module not found.

- [ ] **Step 3: Write minimal implementation**

`lib/email.ts`:
```ts
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value: unknown): boolean {
  return typeof value === "string" && EMAIL_RE.test(value.trim());
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run lib/email.test.ts`
Expected: PASS (all cases).

- [ ] **Step 5: Commit**

```bash
git add lib/email.ts lib/email.test.ts
git commit -m "feat: add isValidEmail helper"
```

---

## Task 3: Visitor context (`lib/visitor.ts`)

**Files:**
- Create: `lib/visitor.ts`
- Test: `lib/visitor.test.ts`

- [ ] **Step 1: Write the failing test**

`lib/visitor.test.ts`:
```ts
import { describe, it, expect, vi, beforeEach } from "vitest";

const getMock = vi.fn();
vi.mock("next/headers", () => ({
  headers: () => Promise.resolve({ get: getMock }),
}));

import { getVisitorContext } from "./visitor";

describe("getVisitorContext", () => {
  beforeEach(() => getMock.mockReset());

  it("returns decoded city/region/country from Vercel headers", async () => {
    getMock.mockImplementation(
      (k: string) =>
        ({
          "x-vercel-ip-city": "San%20Francisco",
          "x-vercel-ip-country-region": "CA",
          "x-vercel-ip-country": "US",
        })[k] ?? null,
    );
    expect(await getVisitorContext()).toEqual({
      city: "San Francisco",
      region: "CA",
      country: "US",
    });
  });

  it("returns nulls when headers are absent", async () => {
    getMock.mockReturnValue(null);
    expect(await getVisitorContext()).toEqual({
      city: null,
      region: null,
      country: null,
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run lib/visitor.test.ts`
Expected: FAIL — `getVisitorContext` not defined.

- [ ] **Step 3: Write minimal implementation**

`lib/visitor.ts`:
```ts
import { headers } from "next/headers";

export interface VisitorContext {
  city: string | null;
  region: string | null;
  country: string | null;
}

const EMPTY: VisitorContext = { city: null, region: null, country: null };

export async function getVisitorContext(): Promise<VisitorContext> {
  try {
    const h = await headers();
    const decode = (v: string | null) => (v ? decodeURIComponent(v) : null);
    return {
      city: decode(h.get("x-vercel-ip-city")),
      region: h.get("x-vercel-ip-country-region"),
      country: h.get("x-vercel-ip-country"),
    };
  } catch {
    return EMPTY;
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run lib/visitor.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/visitor.ts lib/visitor.test.ts
git commit -m "feat: add getVisitorContext from Vercel geo headers"
```

---

## Task 4: Waitlist types + store (`types/waitlist.ts`, `lib/waitlist-store.ts`)

**Files:**
- Create: `types/waitlist.ts`, `lib/waitlist-store.ts`
- Test: `lib/waitlist-store.test.ts`

- [ ] **Step 1: Create the shared types**

`types/waitlist.ts`:
```ts
export interface SignupUtm {
  source: string | null;
  medium: string | null;
  campaign: string | null;
  term: string | null;
  content: string | null;
}

export interface SignupPayload {
  email: string;
  utm: SignupUtm;
  referrer: string | null;
  city: string | null;
  country: string | null;
}

export type SignupStatus = "subscribed" | "already";

export interface SignupResult {
  status: SignupStatus;
}
```

- [ ] **Step 2: Write the failing test**

`lib/waitlist-store.test.ts`:
```ts
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { submitSignup, WaitlistStoreError } from "./waitlist-store";
import type { SignupPayload } from "@/types/waitlist";

const payload: SignupPayload = {
  email: "a@b.com",
  utm: { source: null, medium: null, campaign: "spring", term: null, content: null },
  referrer: null,
  city: null,
  country: null,
};

beforeEach(() => {
  process.env.WAITLIST_SHEET_WEBHOOK_URL = "https://example.com/exec";
});
afterEach(() => {
  vi.unstubAllGlobals();
  delete process.env.WAITLIST_SHEET_WEBHOOK_URL;
});

it("returns subscribed on success", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve({ status: "ok" }) }),
  );
  expect(await submitSignup(payload)).toEqual({ status: "subscribed" });
});

it("maps a duplicate response to already", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve({ status: "duplicate" }) }),
  );
  expect(await submitSignup(payload)).toEqual({ status: "already" });
});

it("throws store_unavailable on a non-200", async () => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, json: () => Promise.resolve({}) }));
  await expect(submitSignup(payload)).rejects.toMatchObject({ code: "store_unavailable" });
});

it("throws not_configured when the env var is missing", async () => {
  delete process.env.WAITLIST_SHEET_WEBHOOK_URL;
  await expect(submitSignup(payload)).rejects.toBeInstanceOf(WaitlistStoreError);
  await expect(submitSignup(payload)).rejects.toMatchObject({ code: "not_configured" });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npx vitest run lib/waitlist-store.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 4: Write minimal implementation**

`lib/waitlist-store.ts`:
```ts
import type { SignupPayload, SignupResult } from "@/types/waitlist";

export type WaitlistErrorCode = "not_configured" | "store_unavailable";

export class WaitlistStoreError extends Error {
  constructor(public code: WaitlistErrorCode) {
    super(code);
    this.name = "WaitlistStoreError";
  }
}

export async function submitSignup(payload: SignupPayload): Promise<SignupResult> {
  const url = process.env.WAITLIST_SHEET_WEBHOOK_URL;
  if (!url) throw new WaitlistStoreError("not_configured");

  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
        email: payload.email,
        utm_source: payload.utm.source,
        utm_medium: payload.utm.medium,
        utm_campaign: payload.utm.campaign,
        utm_term: payload.utm.term,
        utm_content: payload.utm.content,
        referrer: payload.referrer,
        city: payload.city,
        country: payload.country,
      }),
    });
  } catch {
    throw new WaitlistStoreError("store_unavailable");
  }

  if (!res.ok) throw new WaitlistStoreError("store_unavailable");

  const data = (await res.json().catch(() => ({}))) as { status?: string };
  return { status: data.status === "duplicate" ? "already" : "subscribed" };
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run lib/waitlist-store.test.ts`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add types/waitlist.ts lib/waitlist-store.ts lib/waitlist-store.test.ts
git commit -m "feat: add waitlist types and Google Sheet store adapter"
```

---

## Task 5: Waitlist API route (`app/api/waitlist/route.ts`)

**Files:**
- Create: `app/api/waitlist/route.ts`
- Test: `app/api/waitlist/route.test.ts`

- [ ] **Step 1: Write the failing test**

`app/api/waitlist/route.test.ts`:
```ts
import { describe, it, expect, vi, beforeEach } from "vitest";

const submitSignup = vi.fn();
class WaitlistStoreError extends Error {
  constructor(public code: string) {
    super(code);
  }
}
vi.mock("@/lib/waitlist-store", () => ({
  submitSignup: (...args: unknown[]) => submitSignup(...args),
  WaitlistStoreError,
}));

import { POST } from "./route";

function makeRequest(body: unknown, headers: Record<string, string> = {}) {
  return new Request("http://localhost/api/waitlist", {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
}

beforeEach(() => submitSignup.mockReset());

describe("POST /api/waitlist", () => {
  it("400s an invalid email", async () => {
    const res = await POST(makeRequest({ email: "nope" }));
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ ok: false, error: "invalid_email" });
  });

  it("200s subscribed and forwards UTM + geo", async () => {
    submitSignup.mockResolvedValue({ status: "subscribed" });
    const res = await POST(
      makeRequest(
        { email: "a@b.com", utm: { campaign: "spring" }, referrer: "https://x.test" },
        { "x-vercel-ip-city": "Boston", "x-vercel-ip-country": "US" },
      ),
    );
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true, status: "subscribed" });
    expect(submitSignup).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "a@b.com",
        city: "Boston",
        country: "US",
        utm: expect.objectContaining({ campaign: "spring" }),
        referrer: "https://x.test",
      }),
    );
  });

  it("502s when the store is unavailable", async () => {
    submitSignup.mockRejectedValue(new WaitlistStoreError("store_unavailable"));
    const res = await POST(makeRequest({ email: "a@b.com" }));
    expect(res.status).toBe(502);
    expect(await res.json()).toEqual({ ok: false, error: "store_unavailable" });
  });

  it("500s when not configured", async () => {
    submitSignup.mockRejectedValue(new WaitlistStoreError("not_configured"));
    const res = await POST(makeRequest({ email: "a@b.com" }));
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ ok: false, error: "not_configured" });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run app/api/waitlist/route.test.ts`
Expected: FAIL — `./route` not found.

- [ ] **Step 3: Write minimal implementation**

`app/api/waitlist/route.ts`:
```ts
import { NextResponse } from "next/server";
import { isValidEmail } from "@/lib/email";
import { submitSignup, WaitlistStoreError } from "@/lib/waitlist-store";
import type { SignupPayload, SignupUtm } from "@/types/waitlist";

function str(v: unknown): string | null {
  return typeof v === "string" && v.trim() ? v.trim() : null;
}

export async function POST(req: Request) {
  let body: Record<string, unknown> = {};
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    body = {};
  }

  const email = typeof body.email === "string" ? body.email.trim() : "";
  if (!isValidEmail(email)) {
    return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });
  }

  const utmIn = (body.utm ?? {}) as Record<string, unknown>;
  const utm: SignupUtm = {
    source: str(utmIn.source),
    medium: str(utmIn.medium),
    campaign: str(utmIn.campaign),
    term: str(utmIn.term),
    content: str(utmIn.content),
  };

  const rawCity = req.headers.get("x-vercel-ip-city");
  const payload: SignupPayload = {
    email,
    utm,
    referrer: str(body.referrer),
    city: rawCity ? decodeURIComponent(rawCity) : null,
    country: req.headers.get("x-vercel-ip-country"),
  };

  try {
    const result = await submitSignup(payload);
    return NextResponse.json({ ok: true, status: result.status });
  } catch (err) {
    if (err instanceof WaitlistStoreError && err.code === "not_configured") {
      return NextResponse.json({ ok: false, error: "not_configured" }, { status: 500 });
    }
    console.error("waitlist submit failed:", err instanceof Error ? err.message : err);
    return NextResponse.json({ ok: false, error: "store_unavailable" }, { status: 502 });
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run app/api/waitlist/route.test.ts`
Expected: PASS.

- [ ] **Step 5: Run the full suite**

Run: `npm test`
Expected: all suites pass (email, visitor, store, route).

- [ ] **Step 6: Commit**

```bash
git add app/api/waitlist/route.ts app/api/waitlist/route.test.ts
git commit -m "feat: add /api/waitlist route handler"
```

---

## Task 6: Shared waitlist form (`components/waitlist/WaitlistForm.tsx`)

**Files:**
- Create: `components/waitlist/WaitlistForm.tsx`

- [ ] **Step 1: Write the component**

`components/waitlist/WaitlistForm.tsx`:
```tsx
"use client";

import { useState, type FormEvent } from "react";
import { track } from "@vercel/analytics";
import { isValidEmail } from "@/lib/email";

type Status = "idle" | "submitting" | "success" | "already" | "error";

interface Props {
  variant?: "stacked" | "inline";
  source?: string;
  className?: string;
}

function readUtm() {
  if (typeof window === "undefined") return {};
  const p = new URLSearchParams(window.location.search);
  return {
    source: p.get("utm_source"),
    medium: p.get("utm_medium"),
    campaign: p.get("utm_campaign"),
    term: p.get("utm_term"),
    content: p.get("utm_content"),
  };
}

export default function WaitlistForm({
  variant = "stacked",
  source = "unknown",
  className = "",
}: Props) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setStatus("error");
      return;
    }
    setStatus("submitting");
    try {
      const utm = readUtm();
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email,
          utm,
          referrer: typeof document !== "undefined" ? document.referrer : null,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        status?: string;
      };
      if (res.ok && data.ok) {
        setStatus(data.status === "already" ? "already" : "success");
        track("waitlist_signup", { source, campaign: utm.campaign ?? "none" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success" || status === "already") {
    return (
      <div className={`text-center ${className}`} role="status" aria-live="polite">
        <p className="text-[#FFB4AA] font-display italic text-lg">
          {status === "success"
            ? "You're on the list — we'll be in touch."
            : "You're already on the list."}
        </p>
      </div>
    );
  }

  const layout =
    variant === "inline"
      ? "flex flex-col sm:flex-row gap-3"
      : "flex flex-col items-center gap-4";

  return (
    <form onSubmit={onSubmit} className={`w-full max-w-md mx-auto ${className}`} noValidate>
      <div className={layout}>
        <label htmlFor={`waitlist-${source}`} className="sr-only">
          Email address
        </label>
        <input
          id={`waitlist-${source}`}
          name="email"
          type="email"
          required
          inputMode="email"
          autoComplete="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status === "error") setStatus("idle");
          }}
          placeholder="Enter your email address"
          className="flex-1 px-5 py-4 rounded-xl bg-[rgba(53,53,53,0.6)] border border-[#5B403F]/30 text-[#e2e2e2] placeholder:text-[#e4bebc]/50 focus:outline-none focus:ring-2 focus:ring-[#FFB4AA]/40 transition-all"
        />
        <button
          type="submit"
          disabled={status === "submitting"}
          className="px-8 py-4 bg-gradient-to-r from-[#FFB4AA] to-[#FF5545] text-[#690003] rounded-xl font-bold text-lg shadow-[0_20px_40px_rgba(255,85,69,0.25)] hover:shadow-[0_25px_50px_rgba(255,85,69,0.4)] transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {status === "submitting" ? "Joining…" : "Join Waitlist"}
        </button>
      </div>
      {status === "error" && (
        <p className="mt-3 text-sm text-[#FF5545]" role="alert">
          Please enter a valid email and try again.
        </p>
      )}
    </form>
  );
}
```

- [ ] **Step 2: Verify it type-checks/builds**

Run: `npx tsc --noEmit`
Expected: no errors in `components/waitlist/WaitlistForm.tsx`.

- [ ] **Step 3: Commit**

```bash
git add components/waitlist/WaitlistForm.tsx
git commit -m "feat: add shared WaitlistForm with states, UTM + analytics"
```

---

## Task 7: Honest content data (`content/stats.ts`, `content/stories.ts`)

**Files:**
- Create: `content/stats.ts`, `content/stories.ts`

- [ ] **Step 1: Create `content/stats.ts`**

```ts
export interface Stat {
  value: string;
  label: string;
  source: string;
  /** TODO: link the exact AHA source page before launch. */
  sourceUrl?: string;
}

// Real, citable figures (American Heart Association). Verify + link before launch.
export const STATS: Stat[] = [
  {
    value: "356,000",
    label: "out-of-hospital cardiac arrests in the U.S. each year",
    source: "American Heart Association",
  },
  {
    value: "7–10%",
    label: "drop in survival for every minute that passes without CPR",
    source: "American Heart Association",
  },
  {
    value: "2–3×",
    label: "higher survival when a bystander starts CPR before EMS arrives",
    source: "American Heart Association",
  },
  {
    value: "7–12 min",
    label: "typical EMS response time — minutes a bystander can bridge",
    source: "American Heart Association",
  },
];
```

- [ ] **Step 2: Create `content/stories.ts`**

```ts
export const STORIES_ARE_EXAMPLES = true;

export interface Story {
  name: string;
  location: string;
  quote: string;
}

// Illustrative examples until real, consented survivor/responder stories are added.
// Replace these and set STORIES_ARE_EXAMPLES to false before launch.
export const STORIES: Story[] = [
  {
    name: "A neighbor",
    location: "two doors down",
    quote:
      "I had no medical training. The alert told me where to go and counted the compressions with me until the ambulance arrived.",
  },
  {
    name: "A daughter",
    location: "at home",
    quote:
      "My dad collapsed in the kitchen. Knowing help was already on the way changed everything in those first minutes.",
  },
  {
    name: "A responder",
    location: "in the park",
    quote:
      "I was 90 seconds away. Without the notification I never would have known someone needed me.",
  },
];
```

- [ ] **Step 3: Commit**

```bash
git add content/stats.ts content/stories.ts
git commit -m "feat: add honest cited stats and example stories content"
```

---

## Task 8: Content sections (`WhyItMatters`, `Stories`, `FounderNote`)

**Files:**
- Create: `components/sections/WhyItMatters.tsx`, `components/sections/Stories.tsx`, `components/sections/FounderNote.tsx`

- [ ] **Step 1: Create `components/sections/WhyItMatters.tsx`**

```tsx
import { STATS } from "@/content/stats";

export default function WhyItMatters() {
  return (
    <section id="why-it-matters" className="relative py-24 px-8 max-w-7xl mx-auto">
      <div className="max-w-3xl mb-16">
        <span className="text-[#FFB4AA] font-bold tracking-widest uppercase text-xs mb-4 block">
          Why It Matters
        </span>
        <h2 className="text-4xl md:text-5xl text-[#e2e2e2] italic font-display leading-tight">
          Survival is measured in minutes — and bystanders own the first ones.
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl bg-[#1A1A1A] p-8 border border-[#2a2a2a]/50"
          >
            <div className="text-4xl md:text-5xl text-[#e2e2e2] font-display mb-3">
              {stat.value}
            </div>
            <p className="text-[#e4bebc] text-sm leading-relaxed mb-4">{stat.label}</p>
            <p className="text-[#e4bebc]/40 text-xs uppercase tracking-widest">
              Source: {stat.source}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Create `components/sections/Stories.tsx`**

```tsx
import { STORIES, STORIES_ARE_EXAMPLES } from "@/content/stories";

export default function Stories() {
  return (
    <section id="stories" className="relative py-24 px-8 max-w-7xl mx-auto">
      <div className="max-w-3xl mb-16">
        <span className="text-[#FFB4AA] font-bold tracking-widest uppercase text-xs mb-4 block">
          Real Moments
        </span>
        <h2 className="text-4xl md:text-5xl text-[#e2e2e2] italic font-display leading-tight">
          Every second someone steps in, a story gets to continue.
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {STORIES.map((story, i) => (
          <figure
            key={i}
            className="rounded-2xl bg-[#1A1A1A] p-8 border border-[#2a2a2a]/50 flex flex-col"
          >
            {STORIES_ARE_EXAMPLES && (
              <span className="self-start mb-4 text-[10px] uppercase tracking-widest text-[#e4bebc]/40 border border-[#2a2a2a] rounded-full px-3 py-1">
                Illustrative example
              </span>
            )}
            <blockquote className="text-[#e2e2e2] italic font-display text-lg leading-relaxed flex-1">
              “{story.quote}”
            </blockquote>
            <figcaption className="mt-6 text-[#e4bebc] text-sm">
              — {story.name}, {story.location}
            </figcaption>
          </figure>
        ))}
      </div>
      <div className="mt-12 text-center">
        <a
          href="mailto:hello@handsforhearts.health?subject=My%20story"
          className="text-[#FFB4AA] font-bold text-sm uppercase tracking-widest hover:underline"
        >
          Share your story →
        </a>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Create `components/sections/FounderNote.tsx`**

```tsx
export default function FounderNote() {
  return (
    <section className="relative py-24 px-8 max-w-3xl mx-auto text-center">
      <span className="text-[#FFB4AA] font-bold tracking-widest uppercase text-xs mb-6 block">
        Why We Built This
      </span>
      {/* TODO: replace with the real founder note before launch. */}
      <p className="text-2xl md:text-3xl text-[#e2e2e2] italic font-display leading-relaxed">
        We started handsforhearts because the difference between life and death
        is often the person standing closest — and they almost never know it in
        time. We want to change that, one alert at a time.
      </p>
      <p className="mt-8 text-[#e4bebc] text-sm">— The handsforhearts team</p>
    </section>
  );
}
```

- [ ] **Step 4: Verify build**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add components/sections/WhyItMatters.tsx components/sections/Stories.tsx components/sections/FounderNote.tsx
git commit -m "feat: add WhyItMatters, Stories, and FounderNote sections"
```

---

## Task 9: Load the Newsreader brand font

**Files:**
- Modify: `app/layout.tsx` (font import only), `tailwind.config.ts`, and all `font-['Newsreader']` usages

- [ ] **Step 1: Load Newsreader in `app/layout.tsx`**

At the top of `app/layout.tsx`, alongside the existing Inter import, add:
```ts
import { Inter, Newsreader } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  style: ["italic", "normal"],
  display: "swap",
});
```
Then update the `<html>` className to include the variable:
```tsx
<html lang="en" className={`${inter.variable} ${newsreader.variable} scroll-smooth`}>
```

- [ ] **Step 2: Register `font-display` in `tailwind.config.ts`**

Inside `theme.extend`, add:
```ts
fontFamily: {
  display: ["var(--font-newsreader)", "Newsreader", "serif"],
},
```

- [ ] **Step 3: Replace all `font-['Newsreader']` usages with `font-display`**

Run:
```bash
grep -rl "font-\['Newsreader'\]" app components | xargs sed -i "s/font-\['Newsreader'\]/font-display/g"
```
Expected: every occurrence in `app/` and `components/` becomes `font-display`. Verify none remain:
```bash
grep -rn "font-\['Newsreader'\]" app components || echo "none remaining"
```

- [ ] **Step 4: Verify build**

Run: `npm run build`
Expected: build succeeds; Newsreader is now actually loaded.

- [ ] **Step 5: Commit**

```bash
git add app/layout.tsx tailwind.config.ts app components
git commit -m "feat: load Newsreader font and wire font-display utility"
```

---

## Task 10: Personalize the Hero (props, WaitlistForm, next/image)

**Files:**
- Modify: `components/sections/Hero.tsx`

- [ ] **Step 1: Rewrite `components/sections/Hero.tsx`**

```tsx
"use client";

import Image from "next/image";
import { ChevronDown } from "lucide-react";
import WaitlistForm from "@/components/waitlist/WaitlistForm";

interface HeroProps {
  city?: string | null;
  campaign?: string | null;
}

export default function Hero({ city = null }: HeroProps) {
  const place = city ?? "near you";

  return (
    <section className="relative min-h-[100svh] flex items-center justify-center px-6 overflow-hidden pt-20">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,85,69,0.15)_0%,rgba(19,19,19,0)_70%)]" />
        <Image
          alt=""
          aria-hidden
          fill
          priority
          sizes="100vw"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBWKV-uJbla56_Tx6wCdtjqRKy8t45AiMPnlgHBbpjF1j4-WnUCL9lp8GE8xMraztaHTpKLlPqdrVsV0xg2KfGethznfOCWo0z5Hx8-4R3Mbq800uRha3zhkubz5zAvGHGih5dcOBjcEDvwFADrjqW84n8vJAj4hOrW766iAo5WkBT7S3OLfsB4QCQ3HEtIyheUZXmbU7c2jqLBDYkIbAOob5QdvauYQFCONFeLObG6Pp4ivyThC4QLsjubx7U0Rowpc01yaLQCy5wH"
          className="object-cover opacity-20 grayscale mix-blend-luminosity"
        />
      </div>

      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2A2A2A] border border-[#5B403F]/30 mb-8">
          <span className="w-2 h-2 rounded-full bg-[#00A741] animate-pulse" />
          <span className="text-xs font-bold tracking-widest uppercase text-[#53E16F]">
            Be among the first responders {place === "near you" ? "near you" : `in ${place}`}
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl text-[#e2e2e2] italic mb-6 leading-tight tracking-tight font-display">
          Because every heart deserves a{" "}
          <span className="text-[#FFB4AA] not-italic">second chance.</span>
        </h1>

        <p className="text-lg md:text-xl text-[#e4bebc]/80 max-w-2xl mx-auto mb-12">
          The responder network for moments that matter most. We connect
          life-saving skills with critical needs in real time.
        </p>

        <WaitlistForm variant="inline" source="hero" />
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#e4bebc]/40">
        <span className="text-[10px] uppercase tracking-widest font-bold">Scroll to Explore</span>
        <ChevronDown className="w-4 h-4 animate-bounce" />
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: succeeds; `next/image` accepts the lh3 host (remotePatterns from Task 1).

- [ ] **Step 3: Commit**

```bash
git add components/sections/Hero.tsx
git commit -m "feat: personalize Hero with city badge, WaitlistForm, next/image"
```

---

## Task 11: Rebuild the landing page (server component, honest stats, wiring)

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Replace `app/page.tsx` with the personalized, honest version**

```tsx
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import AlertDemo from "@/components/sections/AlertDemo";
import WhyItMatters from "@/components/sections/WhyItMatters";
import Stories from "@/components/sections/Stories";
import FounderNote from "@/components/sections/FounderNote";
import WaitlistForm from "@/components/waitlist/WaitlistForm";
import ClientParticleField from "@/components/three/ClientParticleField";
import ClientFloatingMedical from "@/components/three/ClientFloatingMedical";
import { getVisitorContext } from "@/lib/visitor";

function MissionGridSection() {
  return (
    <section className="relative py-24 px-8 max-w-7xl mx-auto">
      <ClientFloatingMedical />
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-8 group relative h-[500px] rounded-2xl overflow-hidden bg-[#1F1F1F] border border-[#2a2a2a]/50">
          <Image
            alt="A responder performing CPR"
            fill
            sizes="(max-width: 768px) 100vw, 66vw"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC5sm0LmiF_vkqNs2s18MByFJbtJLNre82GY9KMmL8DS9HOK6qPgkaKUwUahzTD5iC7fwQtwGVWN_iVxVqiHwk3OH_nwlzl6z8dOcwpgHUkZ7_UPoSAwWoNbT4gl2Q0NTCNUM_Da8bID0pRjenmoYkWhN_eFz12rBBL3KXy1ly2a2U0B-jiT-i_Bf-A1sPUUyLaf3SNL1FET_eXiIsXX8lUUNKnXvo5QzZ7CFsOAk8yua0ROCK8RRvLpsjet-1wxdECsVkOu3159Z-4"
            className="object-cover opacity-40 group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E0E] via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 p-10">
            <span className="text-[#FFB4AA] font-bold tracking-widest uppercase text-xs mb-4 block">
              The Core Mission
            </span>
            <h3 className="text-4xl text-[#e2e2e2] mb-4 italic font-display">
              Minutes save lives. We save minutes.
            </h3>
            <p className="text-[#e4bebc] max-w-md">
              When every second counts, the nearest trained hands are often
              closer than an ambulance. We help them get there in time.
            </p>
          </div>
        </div>

        <div className="md:col-span-4 rounded-2xl bg-[#1A1A1A] p-8 flex flex-col justify-between border border-[#2a2a2a]/50">
          <div className="w-12 h-12 rounded-xl bg-[#E8192C]/10 flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E8192C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
          </div>
          <div>
            <h4 className="text-4xl text-[#e2e2e2] mb-2 font-display">
              Instant<span className="text-2xl text-[#FF5545]"> alerts</span>
            </h4>
            <p className="text-[#e4bebc] text-sm uppercase tracking-widest">
              The moment it matters
            </p>
          </div>
          <p className="text-[#e4bebc] text-sm mt-6 italic font-display">
            Built for high-stress moments where every second counts toward a
            second chance.
          </p>
        </div>

        <div className="md:col-span-8 relative h-[300px] rounded-2xl overflow-hidden bg-[rgba(26,26,26,0.8)] border border-[#2a2a2a]/50">
          <div className="absolute inset-0 opacity-30">
            <ClientParticleField nodeCount={30} />
          </div>
          <div className="relative h-full flex items-center px-10 z-10">
            <div className="max-w-lg">
              <h3 className="text-3xl text-[#e2e2e2] mb-4 italic font-display">
                Be the safety net for your community
              </h3>
              <p className="text-[#e4bebc] mb-6">
                Doctors, nurses, and CPR-trained neighbors — your presence turns
                a neighborhood into a network. Join the waitlist to be there
                when it counts.
              </p>
            </div>
          </div>
        </div>

        <div className="md:col-span-4 rounded-2xl bg-[#1A1A1A] p-8 flex flex-col justify-center border border-[#2a2a2a]/50">
          <h4 className="text-2xl text-[#e2e2e2] mb-2 italic font-display">
            Coming soon to iPhone
          </h4>
          <p className="text-[#e4bebc] text-sm">
            A native app that turns the phone in your pocket into a first
            responder. App Store launch is on the way.
          </p>
        </div>
      </div>
    </section>
  );
}

function WaitlistCTA() {
  return (
    <section id="waitlist" className="relative py-32">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-[#FFB4AA]/50 to-transparent" />
      <div className="max-w-4xl mx-auto text-center px-6">
        <h2 className="text-4xl md:text-5xl text-[#e2e2e2] mb-8 italic font-display">
          Ready to be the guardian someone needs?
        </h2>
        <div className="p-[1px] rounded-2xl bg-gradient-to-r from-[#FFB4AA]/20 via-[#FF5545]/20 to-[#FFB4AA]/20">
          <div className="bg-[#131313] rounded-2xl p-12">
            <WaitlistForm variant="stacked" source="cta" />
            <p className="mt-8 text-[#e4bebc]/60 text-sm italic font-display">
              No spam. We&apos;ll only email you about the launch.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { city } = await getVisitorContext();
  const sp = await searchParams;
  const campaign = typeof sp.utm_campaign === "string" ? sp.utm_campaign : null;

  return (
    <main className="min-h-screen bg-[#131313] text-[#e2e2e2] overflow-x-hidden">
      <Navbar />
      <Hero city={city} campaign={campaign} />
      <WhyItMatters />
      <MissionGridSection />
      <AlertDemo />
      <Stories />
      <FounderNote />
      <WaitlistCTA />
      <Footer />
    </main>
  );
}
```

> Note: this removes the old `StatsBar` (fake 240ms/14.2k/142+/4.7min) and the fabricated "50k+/+52,000" community card; `WhyItMatters` now carries the real, cited numbers.

- [ ] **Step 2: Add `id="how-it-works"` to AlertDemo**

In `components/sections/AlertDemo.tsx`, add `id="how-it-works"` to the top-level `<section>` element so the Navbar anchor resolves.

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: succeeds; page renders as a dynamic Server Component (uses `headers()`/`searchParams`).

- [ ] **Step 4: Commit**

```bash
git add app/page.tsx components/sections/AlertDemo.tsx
git commit -m "feat: server-rendered landing with honest stats, sections, anchors"
```

---

## Task 12: Navbar + Footer polish

**Files:**
- Modify: `components/layout/Navbar.tsx`, `components/layout/Footer.tsx`

- [ ] **Step 1: Point the Navbar CTA at the waitlist**

In `components/layout/Navbar.tsx`, replace the `<button>…Join Waitlist…</button>` with an anchor to the waitlist section:
```tsx
<a
  href="#waitlist"
  className="bg-[#FF5545] text-[#410001] px-6 py-2.5 rounded-lg font-bold hover:scale-95 transition-all duration-300 shadow-[0_0_20px_rgba(255,85,69,0.3)]"
>
  Join Waitlist
</a>
```

- [ ] **Step 2: Make the Footer year dynamic + consistent brand**

In `components/layout/Footer.tsx`, replace the hardcoded `© 2024 handsforhearts. The Vigilant Guardian Network.` line with:
```tsx
<div className="text-[#E1E1E1]/50 text-xs text-center md:text-right">
  © {new Date().getFullYear()} handsforhearts. The Vigilant Guardian Network.
</div>
```

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: succeeds.

- [ ] **Step 4: Commit**

```bash
git add components/layout/Navbar.tsx components/layout/Footer.tsx
git commit -m "fix: wire navbar CTA to #waitlist and use dynamic footer year"
```

---

## Task 13: Remove the mobile redirect and dead code

**Files:**
- Delete: `middleware.ts`, `app/mobile/page.tsx`, `skills/three/HeartScene.tsx`

- [ ] **Step 1: Delete the files**

Run:
```bash
git rm middleware.ts app/mobile/page.tsx skills/three/HeartScene.tsx
```
(If `skills/three/HeartScene.tsx` is untracked, use `rm skills/three/HeartScene.tsx` instead.)

- [ ] **Step 2: Confirm nothing imports them**

Run:
```bash
grep -rn "mobile\|HeartScene" app components | grep -i import || echo "no imports — safe"
```
Expected: no import references.

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: succeeds; phones now receive `/` (the responsive landing page).

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "refactor: drop mobile redirect + dead 3D scene; phones get full landing"
```

---

## Task 14: Layout metadata, Analytics, and structured data

**Files:**
- Create: `components/seo/JsonLd.tsx`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Create `components/seo/JsonLd.tsx`**

```tsx
export default function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: "handsforhearts",
        url: "https://www.handsforhearts.health",
        logo: "https://www.handsforhearts.health/opengraph-image",
        description:
          "A responder network that alerts nearby people to cardiac emergencies so a bystander can start CPR before EMS arrives.",
      },
      {
        "@type": "WebSite",
        name: "handsforhearts",
        url: "https://www.handsforhearts.health",
      },
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
```

- [ ] **Step 2: Update metadata + mount Analytics + JsonLd in `app/layout.tsx`**

Replace the `metadata` export with:
```ts
export const metadata: Metadata = {
  metadataBase: new URL("https://www.handsforhearts.health"),
  title: "handsforhearts — Emergency Response Alerts for Cardiac Arrest",
  description:
    "When a heart stops, the nearest person matters most. handsforhearts alerts trained bystanders to cardiac emergencies near them so CPR starts before EMS arrives.",
  keywords: ["cardiac arrest", "CPR", "Apple Watch", "emergency response", "first responder", "AED"],
  alternates: { canonical: "/" },
  openGraph: {
    title: "handsforhearts — Be the first responder near you",
    description: "The person next to you might need your help right now.",
    url: "https://www.handsforhearts.health",
    siteName: "handsforhearts",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "handsforhearts — Be the first responder near you",
    description: "The person next to you might need your help right now.",
  },
};
```
Add the imports and render them in `<body>`:
```tsx
import { Analytics } from "@vercel/analytics/react";
import JsonLd from "@/components/seo/JsonLd";
```
```tsx
<body className="bg-[#080808] text-white antialiased">
  {children}
  <Analytics />
  <JsonLd />
</body>
```

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: succeeds.

- [ ] **Step 4: Commit**

```bash
git add app/layout.tsx components/seo/JsonLd.tsx
git commit -m "feat: complete metadata, Twitter card, Analytics, and JSON-LD"
```

---

## Task 15: Dynamic OG image (`app/opengraph-image.tsx`)

**Files:**
- Create: `app/opengraph-image.tsx`

- [ ] **Step 1: Create the OG image route**

```tsx
import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "handsforhearts — Because every heart deserves a second chance";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#131313",
          color: "#e2e2e2",
        }}
      >
        <div
          style={{
            fontSize: 30,
            letterSpacing: 8,
            textTransform: "uppercase",
            color: "#FFB4AA",
            fontWeight: 700,
          }}
        >
          handsforhearts
        </div>
        <div style={{ fontSize: 76, lineHeight: 1.1, marginTop: 24, maxWidth: 980 }}>
          Because every heart deserves a{" "}
          <span style={{ color: "#FFB4AA" }}>second chance.</span>
        </div>
        <div style={{ fontSize: 30, color: "#e4bebc", marginTop: 32 }}>
          The person next to you might need your help right now.
        </div>
      </div>
    ),
    { ...size },
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: succeeds; `/opengraph-image` is generated and auto-wired into OG + Twitter tags.

- [ ] **Step 3: Commit**

```bash
git add app/opengraph-image.tsx
git commit -m "feat: add dynamic on-brand Open Graph image"
```

---

## Task 16: SEO routes + per-page metadata

**Files:**
- Create: `app/sitemap.ts`, `app/robots.ts`
- Modify: `app/cpr-guide/page.tsx`

- [ ] **Step 1: Create `app/sitemap.ts`**

```ts
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.handsforhearts.health";
  const now = new Date();
  return [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/cpr-guide`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
  ];
}
```

- [ ] **Step 2: Create `app/robots.ts`**

```ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://www.handsforhearts.health/sitemap.xml",
  };
}
```

- [ ] **Step 3: Add metadata to `app/cpr-guide/page.tsx`**

If the page is a client component, create a `layout.tsx` in `app/cpr-guide/` exporting metadata instead. Otherwise add at the top of `app/cpr-guide/page.tsx`:
```ts
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hands-Only CPR Guide — handsforhearts",
  description:
    "A simple, step-by-step hands-only CPR guide: check, call, push hard and fast in the center of the chest at 100–120 beats per minute.",
  alternates: { canonical: "/cpr-guide" },
};
```
(If `app/cpr-guide/page.tsx` begins with `"use client"`, instead create `app/cpr-guide/layout.tsx`:)
```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hands-Only CPR Guide — handsforhearts",
  description:
    "A simple, step-by-step hands-only CPR guide: check, call, push hard and fast in the center of the chest at 100–120 beats per minute.",
  alternates: { canonical: "/cpr-guide" },
};

export default function CprGuideLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
```

- [ ] **Step 4: Verify build**

Run: `npm run build`
Expected: succeeds; `/sitemap.xml` and `/robots.txt` are generated.

- [ ] **Step 5: Commit**

```bash
git add app/sitemap.ts app/robots.ts app/cpr-guide
git commit -m "feat: add sitemap, robots, and CPR guide metadata"
```

---

## Task 17: Final verification

**Files:** none (verification only)

- [ ] **Step 1: Run the full test suite**

Run: `npm test`
Expected: all suites pass (email, visitor, store, route).

- [ ] **Step 2: Lint + build**

Run: `npm run lint && npm run build`
Expected: both pass with no errors.

- [ ] **Step 3: Manual smoke check (local)**

Run: `npm run dev`, then verify in a browser:
- `/` renders on a narrow (mobile) viewport with the Hero, sections, and a working-looking waitlist (no redirect to `/mobile`).
- `/?utm_campaign=test` loads; submitting the form with `WAITLIST_SHEET_WEBHOOK_URL` set appends a row to the Sheet; without it set, the form shows the friendly error.
- Navbar "How It Works" / "Why It Matters" / "Join Waitlist" scroll to the right sections.
- `view-source` shows the OG/Twitter tags and JSON-LD; `/sitemap.xml` and `/robots.txt` resolve.

- [ ] **Step 4: Complete the manual setup (see Appendix A & B)**

Create the Apps Script webhook, set `WAITLIST_SHEET_WEBHOOK_URL` in `.env.local` and Vercel, then redeploy.

- [ ] **Step 5: Open a PR**

```bash
git push -u origin feat/personalized-advertise-ready-site
gh pr create --fill
```

---

## Appendix A: Google Apps Script webhook

Create a Google Sheet with a header row: `timestamp | email | utm_source | utm_medium | utm_campaign | utm_term | utm_content | referrer | city | country`. Then **Extensions → Apps Script**, paste:

```javascript
function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

    // Dedupe by email (column 2).
    const emails = sheet
      .getRange(2, 2, Math.max(sheet.getLastRow() - 1, 0) || 1, 1)
      .getValues()
      .flat()
      .map(String);
    if (emails.indexOf(String(data.email)) !== -1) {
      return ContentService.createTextOutput(
        JSON.stringify({ status: "duplicate" }),
      ).setMimeType(ContentService.MimeType.JSON);
    }

    sheet.appendRow([
      data.timestamp || new Date().toISOString(),
      data.email,
      data.utm_source || "",
      data.utm_medium || "",
      data.utm_campaign || "",
      data.utm_term || "",
      data.utm_content || "",
      data.referrer || "",
      data.city || "",
      data.country || "",
    ]);
    return ContentService.createTextOutput(
      JSON.stringify({ status: "ok" }),
    ).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
```

Deploy → **New deployment → Web app**, execute as **Me**, access **Anyone**. Copy the `/exec` URL.

## Appendix B: Environment variable

```bash
# .env.local (and Vercel → Project → Settings → Environment Variables, Prod + Preview)
WAITLIST_SHEET_WEBHOOK_URL=https://script.google.com/macros/s/XXXX/exec
```

---

## Self-Review Notes
- **Spec coverage:** waitlist (T4–6,11), visitor-aware (T3,10,11), honest content + stories (T7,8,11), OG (T15), SEO (T14,16), analytics (T6,14), polish/fonts/mobile (T9,12,13), tech-stack optimization — React 19, next/image, next.config, dead code (T1,10,11,13). All spec sections map to a task.
- **Types:** `SignupPayload`/`SignupResult`/`SignupUtm` defined in T4 and used consistently in T4–6; `isValidEmail` (T2) used in T5/T6; `getVisitorContext` (T3) used in T11.
- **Ordering:** React 19 + remotePatterns (T1) precede `next/image` usage (T10–11); the font utility (T9) precedes pages that already use `font-display` after the global replace.
