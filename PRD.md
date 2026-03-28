# Product Requirements Document
## Emergency Response Alerts for Cardiac Arrest (ERAC)

**Version:** 1.0
**Date:** 2026-03-28
**Status:** Draft

---

## 1. Problem Statement

Cardiac arrest kills over **356,000 people** outside of hospitals in the United States every year. Survival rates drop by **7–10% for every minute** without CPR. The median EMS response time is 7–12 minutes — far too long. The single greatest predictor of survival is whether a bystander performs CPR before paramedics arrive.

Most bystanders don't act because:
- They don't know cardiac arrest is happening nearby
- They don't know where to go
- They don't know how to help

---

## 2. Solution

ERAC uses Apple Watch's continuous biometric monitoring to detect the physiological signatures of cardiac arrest. When detected, it broadcasts a **Critical Alert** to all nearby opted-in Apple devices via APNs, turning every iPhone in the vicinity into a first-responder notification system — delivering location, live tracking, and step-by-step CPR guidance.

---

## 3. Mission

> **Empower anyone to save a life.**

---

## 4. Goals & Success Metrics

| Goal | Metric |
|------|--------|
| Reduce time-to-CPR | Average bystander response < 90 seconds from alert |
| Maximize alert reach | Alert delivered to all opted-in devices within 100m |
| Enable untrained CPR | CPR guide completion rate > 80% among responders |
| Minimize false positives | False alert rate < 0.1% of detections |

---

## 5. Users

### 5.1 Victim
- Any Apple Watch wearer (Series 4+)
- No action required — system acts automatically
- Opted in at app setup

### 5.2 Bystander Responder
- Any nearby iPhone user with ERAC installed
- No prior medical training assumed
- Must be able to act under stress on a locked screen

### 5.3 Emergency Services
- 911 auto-notified in parallel via CallKit
- Future: RapidSOS integration sends structured GPS + medical data to dispatcher CAD

---

## 6. System Architecture

### 6.1 High-Level Flow

```
┌──────────────────────────────────────────────────────────┐
│                   DETECTION LAYER                         │
│                                                           │
│  Apple Watch (watchOS)                                    │
│  ├── HealthKit: Heart Rate, HRV, SpO2                    │
│  ├── CoreMotion: Accelerometer (collapse / no motion)    │
│  └── On-device ML model                                   │
│       Triggers when ALL of:                               │
│       • HR = 0 or ventricular fibrillation pattern       │
│       • No purposeful motion for 15+ seconds             │
│       • SpO2 dropping below threshold                    │
└────────────────────┬─────────────────────────────────────┘
                     │ WatchConnectivity
                     ▼
┌──────────────────────────────────────────────────────────┐
│                CONFIRMATION + BROADCAST LAYER             │
│                                                           │
│  Victim's iPhone (iOS)                                    │
│  ├── Receives signal from Watch                          │
│  ├── 10-second cancellation window (false positive guard)│
│  ├── Confirms via CoreLocation (GPS coordinates)         │
│  ├── POST /emergency → Backend                           │
│  └── Simultaneously initiates 911 call via CallKit       │
│                                                           │
│  Backend                                                  │
│  ├── Geospatial query: all opted-in users within 100m    │
│  ├── Fires APNs Critical Alert to matched device tokens  │
│  └── Opens live location WebSocket session               │
└────────────────────┬─────────────────────────────────────┘
                     │ APNs Critical Alert (bypasses DND/Silent)
                     ▼
┌──────────────────────────────────────────────────────────┐
│                 BYSTANDER RESPONSE LAYER                  │
│                                                           │
│  Nearby iPhones                                           │
│  ├── Lock screen Critical Alert: name, distance, Respond │
│  ├── Tap → live MapKit view with victim GPS pin          │
│  ├── Shows responder count ("3 people responding")       │
│  ├── Button: "I'm on my way"                             │
│  └── Button: "Open CPR Guide"                            │
└──────────────────────────────────────────────────────────┘
```

### 6.2 Alert Delivery Strategy

| Method | When Used | Requirement |
|--------|-----------|-------------|
| APNs Critical Alert | Primary — always | Internet connection + app installed |
| MultipeerConnectivity | Fallback — no signal | App installed + open/recent on nearby device |
| CallKit → 911 | Parallel to alerts | Cellular connection |

### 6.3 Data Flow

```
Watch sensors
  → on-device ML model
  → WatchConnectivity frame to iPhone
  → 10s cancellation window
  → POST /emergency { lat, lng, victimId, timestamp }
  → Backend geofence query (PostGIS / Redis Geo)
  → APNs payload to matched tokens
  → Bystander app opens WebSocket
  → Victim iPhone streams GPS every 2s
  → Bystander map pin updates in real time
```

---

## 7. Product Scope

### Phase 1 — Marketing Website (Next.js, frontend only)
Public-facing site. No backend, no auth, no real data.

### Phase 2 — Native App MVP
watchOS detection, iOS alert broadcast, bystander response flow, CPR guide.

### Phase 3 — Backend + Live Location
Server, geofence query, APNs dispatch, WebSocket location streaming.

### Phase 4 — Advanced Integrations
RapidSOS 911 data push, AED locator, multilingual CPR guide, Android.

---

## 8. Feature Requirements

---

### 8.1 watchOS App

#### F-01: Continuous Biometric Monitoring
- Runs as a background `HKObserverQuery` on Heart Rate and SpO2
- Wakes app process on new HealthKit samples
- CoreMotion monitors accelerometer at all times via `CMMotionActivityManager`

#### F-02: On-Device Detection Model
- Input: HR, HRV, SpO2, motion activity, time of day
- Output: probability score 0–1 (cardiac arrest likelihood)
- Threshold for alert trigger: > 0.92 confidence
- Model runs fully on-device (Core ML) — no network required for detection
- Must produce result within 5 seconds of sensor input

#### F-03: WatchConnectivity Handoff
- On trigger: sends emergency payload to paired iPhone via `WCSession.sendMessage`
- Payload: `{ trigger: "cardiac_arrest", hr: Float, spo2: Float, motion: String, timestamp: Date }`
- If iPhone unreachable: Watch attempts direct cellular POST (Series 4+ with LTE)

---

### 8.2 iOS App — Victim Side

#### F-04: Cancellation Window
- On receiving Watch trigger: display full-screen countdown (10 seconds)
- Large "I'm OK — Cancel" button
- If not cancelled: proceeds to broadcast
- Rationale: single most important false positive mitigation

#### F-05: Emergency Broadcast
- POST to `/api/v1/emergency` with victim coordinates, device token, user profile
- Simultaneously: `CXCallController.requestTransaction` to initiate 911 call
- On server ACK: show "Help is being notified" confirmation screen

#### F-06: Victim Live Location Streaming
- While emergency is active: publish GPS to WebSocket every 2 seconds
- Continues until: victim cancels, EMS confirms arrival, or 60 minutes elapsed

---

### 8.3 iOS App — Bystander Side

#### F-07: Critical Alert Reception
- APNs payload type: `critical` (requires Apple entitlement)
- Bypasses Do Not Disturb and Silent mode
- Lock screen display: victim first name, distance in meters, "Respond" button
- Sound: distinct emergency tone (not default notification chime)

#### F-08: Responder Map
- Opens to full-screen MapKit view
- Victim pin: animated red pulse marker, updates every 2s via WebSocket
- User's own location: blue dot (CoreLocation)
- Routing: "Get Directions" hands off to Apple Maps with victim as destination
- Responder count overlay: "4 people responding"

#### F-09: Responder Status
- "I'm on my way" marks user as active responder in backend
- Victim's phone shows responder count update
- "I can't help" dismisses without penalizing

---

### 8.4 CPR Guide

#### F-10: Guided CPR Stepper
Follows American Heart Association (AHA) guidelines:

| Step | Instruction |
|------|-------------|
| 1 | Check responsiveness — tap shoulders, shout |
| 2 | Call 911 or confirm someone has |
| 3 | Position: heel of hand on center of chest, fingers interlaced |
| 4 | Compress: 2+ inches deep, allow full recoil |
| 5 | Rate: 100–120 compressions/minute (metronome provided) |
| 6 | Optional rescue breaths: 30:2 ratio |
| 7 | Continue until EMS arrives or clear recovery |

#### F-11: Metronome
- Visual + haptic pulse at 110 BPM
- Apple Watch: Taptic Engine fires at beat
- iPhone: screen flashes + audio beat

#### F-12: Emergency Mode
- Full-screen, high contrast, minimum 24pt font
- No distractions, single large "Next Step" button
- Screen stays on (prevent auto-lock via `UIApplication.shared.isIdleTimerDisabled`)

---

### 8.5 Onboarding & Permissions

#### F-13: Required Permissions
- HealthKit: Heart Rate, SpO2, HRV read access
- Location: Always On (background location required for bystander geofencing)
- Notifications: Critical Alert entitlement
- Microphone: for 911 call passthrough

#### F-14: User Profile Setup
- First name (shown to responders — no last name for privacy)
- Emergency contact (notified in parallel with responders)
- Medical notes (optional, e.g., "has pacemaker") — shown to responders
- Opt-out toggle: "Act as bystander responder for others"

---

## 9. Backend Requirements

### 9.1 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/emergency` | POST | Create emergency event, trigger geofence query |
| `/api/v1/emergency/:id/cancel` | POST | Victim cancels false alarm |
| `/api/v1/emergency/:id/location` | WS | Victim streams live GPS |
| `/api/v1/devices/register` | POST | Register APNs device token + last GPS |
| `/api/v1/devices/location` | PATCH | Background location heartbeat (every 5 min) |

### 9.2 Geofence Query
- Storage: PostGIS (PostgreSQL with geographic extensions) or Redis with GEO commands
- Query: all device tokens where `ST_DWithin(device_location, victim_location, 100)` (100 meters)
- Target latency: < 200ms from POST to APNs dispatch

### 9.3 Infrastructure
| Component | Technology |
|-----------|------------|
| API server | Node.js + Fastify |
| Database | PostgreSQL + PostGIS |
| Real-time | WebSocket (ws library or Socket.io) |
| Push | APNs HTTP/2 via `node-apn` |
| Hosting | AWS / Fly.io |

---

## 10. Phase 1 Website (Next.js)

### 10.1 Routes
```
/              → Landing (all sections, single scroll)
/cpr-guide     → Full-screen interactive CPR stepper
/alert-demo    → Tap-through mock of alert → map → CPR flow
/about         → Mission, stats, team
```

### 10.2 Sections on Landing
1. **Hero** — headline, sub-headline, animated heartbeat, CTA
2. **How It Works** — 3-step animated diagram (Detect → Alert → Respond)
3. **Alert Demo** — iPhone/Watch device mockups, tap-through interaction
4. **Why It Matters** — cardiac arrest statistics, survival rate data
5. **CPR Preview** — abbreviated guide with link to full `/cpr-guide`
6. **CTA Banner** — App Store badge (coming soon), newsletter

### 10.3 Tech Stack
| Layer | Choice |
|-------|--------|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| Icons | Lucide React |
| Device mockups | Custom CSS frames |
| Fonts | Inter via `next/font` |
| Deployment | Vercel |

### 10.4 Design Tokens
| Token | Value |
|-------|-------|
| Background | `#0A0A0A` |
| Surface | `#111111` |
| Emergency Red | `#E8192C` |
| Pulse Orange | `#FF6B35` |
| Text Primary | `#FFFFFF` |
| Text Secondary | `#A0A0A0` |
| Success Green | `#30D158` |

---

## 11. Critical Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| HealthKit entitlement denied | No ECG/SpO2 access | Use HR + motion as primary signals; apply for medical entitlement |
| watchOS background kill | Missed cardiac event | Use `HKObserverQuery` (Apple's recommended always-on pattern) + extended background task |
| False positive alert | Erodes user trust | 10-second cancellation window + multi-signal consensus threshold |
| APNs delivery failure (no signal) | Alert never arrives | MultipeerConnectivity fallback for app-installed nearby devices |
| DND/Silent blocks alert | Bystander doesn't see it | Critical Alert entitlement bypasses both |
| Location permission denied | Can't find bystanders | Hard gate at onboarding: app explains why always-on location is required |
| Legal liability for CPR guidance | Lawsuit if bystander injures victim | AHA-approved language, Good Samaritan law notice, medical disclaimer |

---

## 12. Apple Entitlements Required

| Entitlement | Purpose | Approval Difficulty |
|-------------|---------|-------------------|
| `com.apple.developer.healthkit` | HealthKit access | Standard |
| `com.apple.developer.healthkit.background-delivery` | Background HR/SpO2 | Standard |
| Critical Alerts | Bypass DND/Silent | Requires Apple review — medical/safety justification |
| Always-On Location | Background geofencing | User permission + App Store review justification |

---

## 13. Out of Scope (Phase 1 Website)

- Real HealthKit integration
- Real APNs or live alerts
- Backend, database, accounts
- 911 / RapidSOS integration
- Native iOS or watchOS app

---

## 14. Future Phases

| Phase | Feature |
|-------|---------|
| 3 | RapidSOS integration — push structured data to 911 CAD |
| 3 | AED locator overlay on responder map |
| 4 | Android / Wear OS parity |
| 4 | Community responder opt-in network with training badges |
| 4 | Multilingual CPR guide |
| 5 | Hospital handoff — responder data transferred to ER on arrival |

---

*End of PRD v1.0*
