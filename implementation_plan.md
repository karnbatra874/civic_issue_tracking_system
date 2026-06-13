# CivicTrack — Implementation Plan

> A transparent, citizen-first civic issue reporting PWA focused on the **accountability loop**. Designed as a municipality-ready open-source tool — particularly valuable for Tier-2/3 cities.

---

## 1. Architecture & Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend & Routing | Next.js 16 (App Router), React, TypeScript | SSR + client interactivity |
| Styling | Tailwind CSS v4 + Shadcn/UI (base-nova) | Premium dark-mode UI components |
| Backend & Auth | Supabase (PostgreSQL + PostGIS + RLS) | Spatial queries, row-level privacy |
| Media Pipeline | Cloudinary | Image upload, auto face/plate blur |
| Maps | Mapbox GL JS | Public map clustering, ward visualization |
| Deployment Target | Vercel | Serverless edge deployment |

---

## 2. Three Views — Functional Prototype

### 2.1 Citizen View (`/report`)
A 4-step guided wizard:

| Step | Feature | Details |
|---|---|---|
| **1. Capture** | Photo upload | Camera/gallery input. EXIF GPS extraction simulated. Face/plate blurring via Cloudinary (planned). |
| **2. Category** | Issue categorization | Grid of 9 categories with emoji icons and SLA hours displayed per category. |
| **3. Details** | Context & location | Title, description, ward selection, address field, anonymous toggle, mock map with GPS pin. |
| **4. Consent** | DPDP Act compliance | Explicit non-pre-checked consent toggle. Full privacy notice covering data collected, purpose, visibility, retention, and right to withdraw. |
| **5. Success** | Ticket confirmation | Generated ticket ID (e.g., `R-2026-0847`). Links to track on dashboard or submit another. |

### 2.2 Public Transparency Dashboard (`/dashboard`)
Tabs: **Interactive Map** | **List View** | **Ward Performance** | **Policies & Safeguards**

| Component | Details |
|---|---|
| **Metrics Strip** | Total Reports, Open, In Progress, Resolved, Median Resolution Time, SLA Compliance Rate |
| **Filter Bar** | Search by title/address. Filter by category, status, ward. All filters operate in real-time. |
| **Mock Map** | Color-coded dots: red (open/pulsing), amber (in-progress), green (resolved). Hover tooltips. Click to see details. |
| **List View** | Card grid of all reports with status badges, timestamps, addresses. Click for detail dialog. |
| **Ward Performance** | Table: ward name, total reports, open, resolved, resolution rate with progress bars. |
| **SLA & Escalation Table** | Full SLA policy matrix with severity badges and escalation chain descriptions. |
| **Safeguards Section** | 6 anti-harassment and data protection safeguard cards. |

### 2.3 Ward Officer Admin Dashboard (`/admin`)
Tabs: **Assigned Issues** | **Escalation Policy** | **DPDP Compliance**

| Component | Details |
|---|---|
| **Stats Row** | Total Assigned, Open & Overdue (with overdue count highlighted red), In Progress, Resolved |
| **Issue List** | Color-coded left border by SLA urgency (blue=safe, amber=warning, red=overdue with pulse). Sortable, searchable. |
| **Issue Detail Dialog** | Full description, citizen ID (masked if anonymous), audit trail timeline, status change form. |
| **Status Update Form** | Dropdown: Open → Acknowledged → In Progress → Resolved / Rejected. Notes textarea (audit log). **Mandatory proof photo upload for "Resolved" status.** |
| **Escalation Timeline** | Visual 4-tier escalation timeline (Ward Officer → Zonal Engineer → Dy. Commissioner → Commissioner). |
| **DPDP Compliance Tab** | Cards for Consent, PII Isolation, Anonymous Reporting, Right to Withdrawal, Data Retention, Audit Trail. |

---

## 3. Escalation Policy

A **4-tier automatic escalation** system ensures no issue falls through the cracks:

```
┌───────────────────────────────────────────────────────────────┐
│  L1: Ward Officer        → Immediate (auto-assigned via GPS)  │
│  L2: Zonal Engineer      → At 50% SLA elapsed                │
│  L3: Deputy Commissioner → At 100% SLA breached              │
│  L4: Commissioner        → At 200% SLA breached              │
└───────────────────────────────────────────────────────────────┘
```

| Category | SLA | Severity | Escalation Chain |
|---|---|---|---|
| Open Manhole | 6 hours | 🔴 Critical | Immediate → Ward Engineer + Safety Division |
| Sewage Overflow | 12 hours | 🔴 Critical | Ward Officer → Zonal Engineer within 4h |
| Water Supply | 12 hours | 🟠 High | Ward Officer → Water Board within 6h |
| Streetlight Outage | 24 hours | 🟠 High | Ward Officer → Electricity Division within 12h |
| Garbage Dump | 24 hours | 🟠 High | Ward Officer → Sanitation Head within 12h |
| Pothole | 48 hours | 🔵 Medium | Ward Officer → Roads Division within 24h |
| Noise Pollution | 48 hours | 🔵 Medium | Ward Officer → Pollution Board within 24h |
| Road Damage | 72 hours | 🔵 Medium | Ward Officer → PWD within 48h |
| Illegal Construction | 7 days | ⚪ Low | Ward Officer → Building Division within 72h → Commissioner within 5d |

---

## 4. Data Privacy — DPDP Act 2023 Compliance

### 4.1 Consent Framework
- **Explicit, informed consent** is mandatory before submission (Step 4 of the wizard).
- Consent toggle is **never pre-checked** (DPDP Section 6 compliance).
- The privacy notice clearly states:
  - **What data**: Photo, GPS location, issue description
  - **Purpose**: Civic issue resolution by assigned ward officers
  - **Who sees it**: Ward officers see full report; public dashboard is anonymized
  - **Retention**: 2 years post-resolution; PII purged after 6 months
  - **Right to withdraw**: Citizens can request data deletion at any time

### 4.2 PII Isolation (Row Level Security)
- Citizen `phone_number` and `full_name` live in the `profiles` table.
- Public-facing views (`public_reports`) **never join** to the profiles table.
- RLS policies enforce that:
  - Citizens can only read their own profile.
  - Officers can only see profiles for non-anonymous reports in their ward.
  - Public/anonymous users see only the anonymized `public_reports` view.

### 4.3 Anonymization
- Reports submitted with `is_anonymous = true` hide the `citizen_id` from all officer-facing views.
- The public dashboard **never** shows citizen identity regardless of anonymity setting.
- Cloudinary auto-blurs faces and license plates in uploaded photos (planned integration).

### 4.4 Data Retention
- Reports are retained for audit purposes (immutable audit log).
- PII fields (`full_name`, `phone_number`) are purged 6 months post-resolution.
- Right to erasure: Citizens can request deletion; reports are anonymized (not deleted) to preserve civic records.

---

## 5. Handling False & Duplicate Reports

| Safeguard | Mechanism |
|---|---|
| **Trust Score** | Citizens start at 50. Verified reports → +5. Rejected/false reports → -10. Below 20 → manual moderation queue. |
| **Duplicate Detection** | PostGIS query: same category within 100m radius within 48h → show existing reports and suggest upvoting. |
| **EXIF Verification** | Photo timestamp + GPS are cross-validated against submission time and reported location. Mismatches → flagged. |
| **Rate Limiting** | Max 5 reports per citizen per 24 hours. Burst submissions trigger cooldown + review queue. |
| **Rejection Workflow** | Officers can reject with reason (e.g., "Duplicate of #R-2024-0087"). Rejection logged in audit trail. |

---

## 6. Anti-Harassment Safeguards

> *How does the system avoid becoming a tool for harassment of vendors / minorities?*

| Safeguard | How It Works |
|---|---|
| **Infrastructure Focus** | Categories are strictly infrastructure-based (potholes, lights, garbage). No "encroachment" or "nuisance" categories that could target specific communities. |
| **Anti-Targeting NLP** | Reports mentioning specific individuals, businesses, caste, or community names are automatically flagged for moderator review before public visibility. |
| **Anonymous-by-Default Public Data** | The public dashboard only shows *what* and *where*, never *who reported*. This prevents retaliatory identification. |
| **Location-Only Metadata** | Reports are tied to GPS coordinates of the *issue*, not of the *reporter*. No home address or personal location is collected. |
| **Moderator Review Queue** | Flagged reports enter a review queue visible only to admin-role users, not ward officers, preventing biased handling. |

---

## 7. Success Metrics

| Metric | Target | How Measured |
|---|---|---|
| End-to-end flow | ✅ Demonstrable | Complete report-to-resolution flow working in prototype |
| Usability rating | ≥ 8/10 | Planned: 10 test users from diverse age groups |
| DPDP compliance | ✅ Clear walkthrough | Consent flow, RLS policies, anonymization — all documented and visible in UI |
| Resolution rate | > 70% | Dashboard metrics (currently 80% in mock data) |
| SLA compliance | > 90% | Tracked per ward in the dashboard |

---

## 8. Expected Deliverables

### ✅ Deliverable 1: Functional Prototype with All 3 Views
| View | Route | Status |
|---|---|---|
| Landing Page | `/` | ✅ Complete — hero, stats, features, escalation, SLA, privacy |
| Citizen Report Wizard | `/report` | ✅ Complete — 4-step wizard with DPDP consent |
| Public Dashboard | `/dashboard` | ✅ Complete — map, metrics, filters, policies |
| Admin Dashboard | `/admin` | ✅ Complete — issue management, status updates, proof upload |

### ✅ Deliverable 2: Admin Dashboard Mockup
- Full admin panel at `/admin` with sortable issue list, SLA urgency indicators, audit trail timeline, and mandatory resolution proof upload.
- Status updates persist in local state and reflect immediately in the UI.

### ✅ Deliverable 3: Data Privacy + Escalation Policy Document
- DPDP Act 2023 compliance walkthrough visible in:
  - Report wizard Step 4 (consent)
  - Admin dashboard "DPDP Compliance" tab
  - Public dashboard "Policies & Safeguards" tab
  - This implementation plan (Section 4)
- Escalation policy visible in:
  - Landing page escalation section
  - Admin dashboard "Escalation Policy" tab
  - Public dashboard "Policies & Safeguards" tab
  - This implementation plan (Section 3)

---

## 9. File Structure

```
civic-issue-tracker/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Landing page with all sections
│   │   ├── layout.tsx            # Root layout with Navbar + Toaster
│   │   ├── globals.css           # Tailwind v4 + Shadcn theme
│   │   ├── report/page.tsx       # Citizen 4-step wizard
│   │   ├── dashboard/page.tsx    # Public transparency dashboard
│   │   └── admin/page.tsx        # Ward officer admin panel
│   ├── components/
│   │   ├── layout/Navbar.tsx     # Responsive nav + role switcher
│   │   └── ui/                   # 12 Shadcn components
│   └── lib/
│       ├── mock-data.ts          # All mock data, SLA policy, safeguards
│       ├── mock-auth.ts          # Prototype role switching
│       ├── types.ts              # TypeScript interfaces
│       ├── utils.ts              # Formatting, status colors, SLA urgency
│       └── supabase/             # Client + server utilities
├── supabase/schema.sql           # PostGIS + RLS + seed data
├── next.config.ts
├── package.json
└── .env.local
```

---

## 10. How to Run

```bash
cd C:\Users\karan\OneDrive\Desktop\civic-issue-tracker
cmd /c "npm run dev"
```

Open **http://localhost:3000** in your browser.
