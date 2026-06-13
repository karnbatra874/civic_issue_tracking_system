# CivicTrack — Walkthrough

## What Was Built

### 🏠 Landing Page ([page.tsx](file:///c:/Users/karan/OneDrive/Desktop/civic-issue-tracker/src/app/page.tsx))
- Hero section with gradient background and grid pattern
- Three **clickable** CTA buttons: **Report an Issue**, **Public Dashboard**, **Admin Panel**
- Stats strip: 1,248 reported → 892 resolved → 48h median → 94% SLA compliance
- "How It Works" 3-step cards
- **Three Views** section — each card is a clickable link to the corresponding view
- **Escalation Policy** — 4-tier visual timeline
- **SLA Table** — 9 categories with severity badges
- **Data Privacy & Safeguards** — 6 cards covering DPDP compliance
- CTA section + Footer with navigation links

---

### 📸 Citizen Report Wizard ([report/page.tsx](file:///c:/Users/karan/OneDrive/Desktop/civic-issue-tracker/src/app/report/page.tsx))
4-step wizard with animated transitions:
1. **Capture** — File upload with mock EXIF GPS extraction
2. **Category** — Grid of 9 categories with SLA hours shown
3. **Details** — Title, description, ward selection, anonymous toggle, mock map
4. **Consent** — DPDP Act 2023 privacy notice with explicit non-pre-checked consent toggle
5. **Success** — Ticket ID generated, links to dashboard

---

### 🗺️ Public Dashboard ([dashboard/page.tsx](file:///c:/Users/karan/OneDrive/Desktop/civic-issue-tracker/src/app/dashboard/page.tsx))
Tabs: Interactive Map | List View | Ward Performance | Policies & Safeguards
- Real-time metrics strip (Total, Open, In Progress, Resolved, Median Resolution, SLA%)
- Working filter bar (category, status, search)
- Mock map with color-coded pulsing dots
- Card grid with clickable detail dialogs
- Ward performance table with progress bars
- SLA policy table + anti-harassment safeguard cards

---

### 🛡️ Admin Dashboard ([admin/page.tsx](file:///c:/Users/karan/OneDrive/Desktop/civic-issue-tracker/src/app/admin/page.tsx))
Tabs: Assigned Issues | Escalation Policy | DPDP Compliance
- Stats row with overdue count highlighted
- Issue list with SLA urgency color-coding (blue/amber/red/pulsing)
- Detail dialog with audit trail timeline
- **Status update form** with mandatory proof photo for "Resolved"
- Escalation timeline (4 tiers)
- DPDP compliance cards + anti-harassment safeguards

---

### 🔧 Shared Components
- [Navbar.tsx](file:///c:/Users/karan/OneDrive/Desktop/civic-issue-tracker/src/components/layout/Navbar.tsx) — Responsive nav with role switcher (Citizen/Officer/Admin)
- [mock-data.ts](file:///c:/Users/karan/OneDrive/Desktop/civic-issue-tracker/src/lib/mock-data.ts) — 10 sample reports, 9 categories, 5 wards, audit logs, SLA policy, escalation tiers, safeguards
- [mock-auth.ts](file:///c:/Users/karan/OneDrive/Desktop/civic-issue-tracker/src/lib/mock-auth.ts) — Role switching via localStorage
- [types.ts](file:///c:/Users/karan/OneDrive/Desktop/civic-issue-tracker/src/lib/types.ts) — All TypeScript interfaces
- [utils.ts](file:///c:/Users/karan/OneDrive/Desktop/civic-issue-tracker/src/lib/utils.ts) — Date formatting, status colors, SLA urgency

---

## Expected Deliverables — Status

| # | Deliverable | Status |
|---|---|---|
| 1 | Functional prototype with all 3 views (Citizen, Admin, Public Dashboard) | ✅ Complete |
| 2 | Admin dashboard mockup with status management | ✅ Complete |
| 3 | Data-privacy + escalation policy document | ✅ Complete |

---

## What Was Tested

| Test | Result |
|---|---|
| `npm run build` | ✅ 0 errors, 0 warnings. All 5 routes compiled. |
| TypeScript type checking | ✅ Passed (fixed 3 nullable Select handler issues) |
| JSX syntax validation | ✅ Passed (fixed broken `</Button>` tag in Navbar) |
| Route generation | ✅ `/`, `/report`, `/dashboard`, `/admin`, `/_not-found` |

---

## How to Run

Open **Command Prompt** (not PowerShell) and run:
```cmd
cd C:\Users\karan\OneDrive\Desktop\civic-issue-tracker
npm run dev
```
Then open **http://localhost:3000** in your browser.
