import {
  Category,
  PublicReport,
  ReportStatus,
  AuditLog,
  Ward,
  Report,
} from "./types";

// ============================================================
// Mock Data for Prototype — replaces Supabase queries
// ============================================================

export const MOCK_WARDS: Ward[] = [
  { id: "w1", name: "Ward 1 — Connaught Place", boundary: null, created_at: "2024-01-01T00:00:00Z" },
  { id: "w2", name: "Ward 2 — Hauz Khas", boundary: null, created_at: "2024-01-01T00:00:00Z" },
  { id: "w3", name: "Ward 3 — Dwarka", boundary: null, created_at: "2024-01-01T00:00:00Z" },
  { id: "w4", name: "Ward 4 — Rohini", boundary: null, created_at: "2024-01-01T00:00:00Z" },
  { id: "w5", name: "Ward 5 — Saket", boundary: null, created_at: "2024-01-01T00:00:00Z" },
];

export const MOCK_CATEGORIES: Category[] = [
  { id: "c1", name: "Pothole", icon: "🕳️", base_sla_hours: 48, created_at: "2024-01-01T00:00:00Z" },
  { id: "c2", name: "Streetlight Outage", icon: "💡", base_sla_hours: 24, created_at: "2024-01-01T00:00:00Z" },
  { id: "c3", name: "Garbage Dump", icon: "🗑️", base_sla_hours: 24, created_at: "2024-01-01T00:00:00Z" },
  { id: "c4", name: "Water Supply", icon: "💧", base_sla_hours: 12, created_at: "2024-01-01T00:00:00Z" },
  { id: "c5", name: "Sewage Overflow", icon: "🚰", base_sla_hours: 12, created_at: "2024-01-01T00:00:00Z" },
  { id: "c6", name: "Road Damage", icon: "🛣️", base_sla_hours: 72, created_at: "2024-01-01T00:00:00Z" },
  { id: "c7", name: "Illegal Construction", icon: "🏗️", base_sla_hours: 168, created_at: "2024-01-01T00:00:00Z" },
  { id: "c8", name: "Noise Pollution", icon: "🔊", base_sla_hours: 48, created_at: "2024-01-01T00:00:00Z" },
  { id: "c9", name: "Open Manhole", icon: "⚠️", base_sla_hours: 6, created_at: "2024-01-01T00:00:00Z" },
];

// SLA Policy table for the escalation display
export const SLA_POLICY = [
  { category: "Open Manhole", sla: "6 hours", severity: "Critical", escalation: "Immediate to Ward Engineer + Safety Division" },
  { category: "Sewage Overflow", sla: "12 hours", severity: "Critical", escalation: "Ward Officer → Zonal Engineer within 4h" },
  { category: "Water Supply", sla: "12 hours", severity: "High", escalation: "Ward Officer → Water Board within 6h" },
  { category: "Streetlight Outage", sla: "24 hours", severity: "High", escalation: "Ward Officer → Electricity Division within 12h" },
  { category: "Garbage Dump", sla: "24 hours", severity: "High", escalation: "Ward Officer → Sanitation Head within 12h" },
  { category: "Pothole", sla: "48 hours", severity: "Medium", escalation: "Ward Officer → Roads Division within 24h" },
  { category: "Noise Pollution", sla: "48 hours", severity: "Medium", escalation: "Ward Officer → Pollution Board within 24h" },
  { category: "Road Damage", sla: "72 hours", severity: "Medium", escalation: "Ward Officer → PWD within 48h" },
  { category: "Illegal Construction", sla: "7 days", severity: "Low", escalation: "Ward Officer → Building Division within 72h → Commissioner within 5d" },
];

// Escalation tiers
export const ESCALATION_TIERS = [
  {
    level: 1,
    name: "Ward Officer",
    timeframe: "Immediate",
    description: "Auto-assigned based on GPS ward mapping. Officer receives push notification.",
  },
  {
    level: 2,
    name: "Zonal Engineer",
    timeframe: "At 50% SLA elapsed",
    description: "If the ward officer hasn't acknowledged within half the SLA, the issue escalates to the zonal engineer.",
  },
  {
    level: 3,
    name: "Deputy Commissioner",
    timeframe: "At 100% SLA breached",
    description: "SLA breach triggers automatic escalation. Flagged in weekly review dashboard.",
  },
  {
    level: 4,
    name: "Municipal Commissioner",
    timeframe: "At 200% SLA breached",
    description: "Double-breached SLAs are auto-included in the Commissioner's daily brief.",
  },
];

function hoursAgo(hours: number): string {
  return new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
}

function hoursFromNow(hours: number): string {
  return new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();
}

export const MOCK_REPORTS: (PublicReport & { ward_id: string; citizen_id: string; is_anonymous: boolean; sla_deadline: string })[] = [
  {
    id: "r1",
    title: "Large pothole near metro station",
    description: "A 3-foot pothole on the main road near Rajiv Chowk metro exit 4. Multiple vehicles damaged.",
    category_name: "Pothole",
    ward_name: "Ward 1 — Connaught Place",
    ward_id: "w1",
    citizen_id: "00000000-0000-0000-0000-000000000001",
    latitude: 28.6328,
    longitude: 77.2197,
    media_url: null,
    status: "open" as ReportStatus,
    address: "Rajiv Chowk, Connaught Place, New Delhi",
    created_at: hoursAgo(4),
    is_anonymous: false,
    sla_deadline: hoursFromNow(44),
  },
  {
    id: "r2",
    title: "Streetlights not working on Ring Road",
    description: "Entire stretch of 500m near IIT flyover is completely dark at night. Accident-prone zone.",
    category_name: "Streetlight Outage",
    ward_name: "Ward 2 — Hauz Khas",
    ward_id: "w2",
    citizen_id: "00000000-0000-0000-0000-000000000001",
    latitude: 28.5494,
    longitude: 77.2001,
    media_url: null,
    status: "acknowledged" as ReportStatus,
    address: "Ring Road, near IIT Delhi, Hauz Khas",
    created_at: hoursAgo(18),
    is_anonymous: false,
    sla_deadline: hoursFromNow(6),
  },
  {
    id: "r3",
    title: "Garbage dumped on residential street",
    description: "Construction waste and household garbage piled up for 3 days. Stray dogs spreading it across the road.",
    category_name: "Garbage Dump",
    ward_name: "Ward 3 — Dwarka",
    ward_id: "w3",
    citizen_id: "00000000-0000-0000-0000-000000000001",
    latitude: 28.5921,
    longitude: 77.0460,
    media_url: null,
    status: "in_progress" as ReportStatus,
    address: "Sector 12, Dwarka, New Delhi",
    created_at: hoursAgo(36),
    is_anonymous: true,
    sla_deadline: hoursFromNow(-12),
  },
  {
    id: "r4",
    title: "Open manhole on footpath",
    description: "Manhole cover missing near the school entrance. Extremely dangerous for children.",
    category_name: "Open Manhole",
    ward_name: "Ward 4 — Rohini",
    ward_id: "w4",
    citizen_id: "00000000-0000-0000-0000-000000000001",
    latitude: 28.7325,
    longitude: 77.1197,
    media_url: null,
    status: "open" as ReportStatus,
    address: "Sector 15, Rohini, New Delhi",
    created_at: hoursAgo(2),
    is_anonymous: false,
    sla_deadline: hoursFromNow(4),
  },
  {
    id: "r5",
    title: "Sewage overflowing into street",
    description: "Sewage line broken for 2 days. Foul smell and stagnant water causing mosquito breeding.",
    category_name: "Sewage Overflow",
    ward_name: "Ward 5 — Saket",
    ward_id: "w5",
    citizen_id: "00000000-0000-0000-0000-000000000001",
    latitude: 28.5244,
    longitude: 77.2090,
    media_url: null,
    status: "resolved" as ReportStatus,
    address: "Saket Metro Station Road, New Delhi",
    created_at: hoursAgo(72),
    is_anonymous: false,
    sla_deadline: hoursAgo(60),
  },
  {
    id: "r6",
    title: "Road caved in after heavy rain",
    description: "Section of road has caved in near the park. Barricades needed urgently.",
    category_name: "Road Damage",
    ward_name: "Ward 1 — Connaught Place",
    ward_id: "w1",
    citizen_id: "00000000-0000-0000-0000-000000000001",
    latitude: 28.6315,
    longitude: 77.2167,
    media_url: null,
    status: "in_progress" as ReportStatus,
    address: "Janpath Road, Connaught Place, New Delhi",
    created_at: hoursAgo(48),
    is_anonymous: true,
    sla_deadline: hoursFromNow(24),
  },
  {
    id: "r7",
    title: "Water supply cut off for 3 days",
    description: "No municipal water since Monday. Tankers also not arriving. 200+ families affected.",
    category_name: "Water Supply",
    ward_name: "Ward 3 — Dwarka",
    ward_id: "w3",
    citizen_id: "00000000-0000-0000-0000-000000000001",
    latitude: 28.5850,
    longitude: 77.0520,
    media_url: null,
    status: "acknowledged" as ReportStatus,
    address: "Sector 7, Dwarka, New Delhi",
    created_at: hoursAgo(24),
    is_anonymous: false,
    sla_deadline: hoursFromNow(-12),
  },
  {
    id: "r8",
    title: "Illegal construction blocking drainage",
    description: "A new unauthorized structure is blocking the main drainage canal. Flooding risk during monsoon.",
    category_name: "Illegal Construction",
    ward_name: "Ward 2 — Hauz Khas",
    ward_id: "w2",
    citizen_id: "00000000-0000-0000-0000-000000000001",
    latitude: 28.5530,
    longitude: 77.1940,
    media_url: null,
    status: "open" as ReportStatus,
    address: "Hauz Khas Village, New Delhi",
    created_at: hoursAgo(12),
    is_anonymous: true,
    sla_deadline: hoursFromNow(156),
  },
  {
    id: "r9",
    title: "Noise from construction site at night",
    description: "Construction work continues past 10 PM daily. Violating noise pollution norms.",
    category_name: "Noise Pollution",
    ward_name: "Ward 4 — Rohini",
    ward_id: "w4",
    citizen_id: "00000000-0000-0000-0000-000000000001",
    latitude: 28.7280,
    longitude: 77.1150,
    media_url: null,
    status: "rejected" as ReportStatus,
    address: "Sector 9, Rohini, New Delhi",
    created_at: hoursAgo(96),
    is_anonymous: false,
    sla_deadline: hoursAgo(48),
  },
  {
    id: "r10",
    title: "Pothole cluster on service road",
    description: "Multiple potholes on the service road causing traffic jams during peak hours.",
    category_name: "Pothole",
    ward_name: "Ward 5 — Saket",
    ward_id: "w5",
    citizen_id: "00000000-0000-0000-0000-000000000001",
    latitude: 28.5210,
    longitude: 77.2130,
    media_url: null,
    status: "resolved" as ReportStatus,
    address: "Press Enclave Road, Saket, New Delhi",
    created_at: hoursAgo(120),
    is_anonymous: false,
    sla_deadline: hoursAgo(72),
  },
];

export const MOCK_AUDIT_LOGS: AuditLog[] = [
  { id: "a1", report_id: "r2", old_status: "open", new_status: "acknowledged", changed_by: "00000000-0000-0000-0000-000000000002", resolution_media_url: null, notes: "Verified. Forwarded to electrical division.", created_at: hoursAgo(12) },
  { id: "a2", report_id: "r3", old_status: "open", new_status: "acknowledged", changed_by: "00000000-0000-0000-0000-000000000002", resolution_media_url: null, notes: "Acknowledged. Sanitation team notified.", created_at: hoursAgo(30) },
  { id: "a3", report_id: "r3", old_status: "acknowledged", new_status: "in_progress", changed_by: "00000000-0000-0000-0000-000000000002", resolution_media_url: null, notes: "Cleanup crew dispatched.", created_at: hoursAgo(24) },
  { id: "a4", report_id: "r5", old_status: "open", new_status: "acknowledged", changed_by: "00000000-0000-0000-0000-000000000002", resolution_media_url: null, notes: "Urgent. Water board team assigned.", created_at: hoursAgo(70) },
  { id: "a5", report_id: "r5", old_status: "acknowledged", new_status: "in_progress", changed_by: "00000000-0000-0000-0000-000000000002", resolution_media_url: null, notes: "Repair work started.", created_at: hoursAgo(66) },
  { id: "a6", report_id: "r5", old_status: "in_progress", new_status: "resolved", changed_by: "00000000-0000-0000-0000-000000000002", resolution_media_url: "https://res.cloudinary.com/demo/image/upload/sample.jpg", notes: "Sewage line repaired and road cleaned.", created_at: hoursAgo(60) },
  { id: "a7", report_id: "r6", old_status: "open", new_status: "in_progress", changed_by: "00000000-0000-0000-0000-000000000002", resolution_media_url: null, notes: "PWD team on site. Barricades placed.", created_at: hoursAgo(36) },
  { id: "a8", report_id: "r9", old_status: "open", new_status: "rejected", changed_by: "00000000-0000-0000-0000-000000000002", resolution_media_url: null, notes: "Duplicate report. Already addressed under report #R-2024-0087.", created_at: hoursAgo(90) },
  { id: "a9", report_id: "r7", old_status: "open", new_status: "acknowledged", changed_by: "00000000-0000-0000-0000-000000000002", resolution_media_url: null, notes: "Escalated to Delhi Jal Board.", created_at: hoursAgo(20) },
  { id: "a10", report_id: "r10", old_status: "open", new_status: "resolved", changed_by: "00000000-0000-0000-0000-000000000002", resolution_media_url: "https://res.cloudinary.com/demo/image/upload/sample.jpg", notes: "All potholes filled with bituminous mix. Road resurfaced.", created_at: hoursAgo(72) },
];

// Anti-harassment & false report safeguards
export const SAFEGUARDS = [
  {
    title: "Trust Score System",
    description: "Every citizen starts with a trust score of 50. Verified reports increase it; rejected/false reports decrease it. Users below 20 require manual review before their reports go live.",
    icon: "🛡️",
  },
  {
    title: "AI Duplicate Detection",
    description: "Reports within 100m radius of the same category within 48 hours are flagged as potential duplicates. Citizens are shown existing reports and asked to upvote instead.",
    icon: "🔍",
  },
  {
    title: "Anti-Targeting Filters",
    description: "Reports mentioning specific individuals, businesses, or communities by name are flagged for moderator review. Location-only metadata is used to prevent vendor targeting.",
    icon: "🚫",
  },
  {
    title: "Anonymous Reporting",
    description: "Citizens can submit fully anonymous reports. Their identity is never exposed to ward officers or the public. Only aggregate location data is used.",
    icon: "👤",
  },
  {
    title: "Rate Limiting",
    description: "Citizens are limited to 5 reports per 24 hours. Burst submissions from a single user trigger a cooldown period and review queue.",
    icon: "⏱️",
  },
  {
    title: "Photo Verification",
    description: "EXIF data (timestamp + GPS) is cross-validated with submission time and reported location. Mismatches are flagged for manual review.",
    icon: "📷",
  },
];

// Compute dashboard metrics from mock data
export function computeMetrics() {
  const total = MOCK_REPORTS.length;
  const open = MOCK_REPORTS.filter((r) => r.status === "open").length;
  const acknowledged = MOCK_REPORTS.filter((r) => r.status === "acknowledged").length;
  const inProgress = MOCK_REPORTS.filter((r) => r.status === "in_progress").length;
  const resolved = MOCK_REPORTS.filter((r) => r.status === "resolved").length;
  const rejected = MOCK_REPORTS.filter((r) => r.status === "rejected").length;

  const resolvedReports = MOCK_REPORTS.filter((r) => r.status === "resolved");
  const resolutionTimes = resolvedReports.map((r) => {
    const created = new Date(r.created_at).getTime();
    const deadline = new Date(r.sla_deadline).getTime();
    return (deadline - created) / (1000 * 60 * 60);
  });
  const medianResolution = resolutionTimes.length > 0
    ? resolutionTimes.sort((a, b) => a - b)[Math.floor(resolutionTimes.length / 2)]
    : 0;

  const slaCompliant = MOCK_REPORTS.filter((r) => {
    if (r.status !== "resolved") return false;
    return new Date(r.sla_deadline) >= new Date(r.created_at);
  }).length;

  const wardBreakdown = MOCK_WARDS.map((ward) => {
    const wardReports = MOCK_REPORTS.filter((r) => r.ward_id === ward.id);
    return {
      ward_name: ward.name,
      total: wardReports.length,
      open: wardReports.filter((r) => r.status === "open").length,
      resolved: wardReports.filter((r) => r.status === "resolved").length,
    };
  });

  return {
    total,
    open,
    acknowledged,
    inProgress,
    resolved,
    rejected,
    medianResolution: Math.round(medianResolution),
    slaComplianceRate: total > 0 ? Math.round((slaCompliant / resolvedReports.length) * 100) : 0,
    wardBreakdown,
  };
}
