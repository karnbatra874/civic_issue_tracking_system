// ============================================================
// Database Types — mirrors supabase/schema.sql
// ============================================================

export type ReportStatus =
  | "open"
  | "acknowledged"
  | "in_progress"
  | "resolved"
  | "rejected";

export type UserRole = "citizen" | "officer" | "admin";

// ---- Core Tables ----

export interface Ward {
  id: string;
  name: string;
  boundary: unknown | null; // PostGIS GEOGRAPHY
  created_at: string;
}

export interface Profile {
  id: string;
  full_name: string | null;
  phone_number: string | null;
  role: UserRole;
  ward_id: string | null;
  trust_score: number;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string | null;
  base_sla_hours: number;
  created_at: string;
}

export interface Report {
  id: string;
  citizen_id: string | null;
  category_id: string | null;
  ward_id: string | null;
  title: string;
  description: string | null;
  location: unknown; // PostGIS GEOGRAPHY POINT
  address: string | null;
  media_url: string | null;
  status: ReportStatus;
  is_anonymous: boolean;
  consent_given: boolean;
  sla_deadline: string | null;
  created_at: string;
  updated_at: string;
}

export interface AuditLog {
  id: string;
  report_id: string;
  old_status: ReportStatus | null;
  new_status: ReportStatus;
  changed_by: string | null;
  resolution_media_url: string | null;
  notes: string | null;
  created_at: string;
}

// ---- View Types ----

export interface PublicReport {
  id: string;
  title: string;
  description: string | null;
  category_name: string;
  ward_name: string | null;
  latitude: number;
  longitude: number;
  media_url: string | null;
  status: ReportStatus;
  address: string | null;
  created_at: string;
}

// ---- Form / UI Types ----

export interface ReportFormData {
  title: string;
  description: string;
  category_id: string;
  ward_id: string;
  latitude: number;
  longitude: number;
  address: string;
  media_url: string;
  is_anonymous: boolean;
  consent_given: boolean;
}

export interface GpsCoordinates {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

// ---- Mock Auth ----

export interface MockUser {
  id: string;
  full_name: string;
  role: UserRole;
  ward_id: string | null;
}

// ---- Dashboard Metrics ----

export interface WardMetrics {
  ward_name: string;
  total_reports: number;
  open_reports: number;
  resolved_reports: number;
  median_resolution_hours: number | null;
  sla_compliance_rate: number;
}
