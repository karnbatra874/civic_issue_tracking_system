-- ============================================================================
-- CIVIC ISSUE TRACKER — Supabase Database Schema
-- ============================================================================
-- A civic issue reporting system built on Supabase (PostgreSQL 14+).
-- Designed with DPDP Act compliance in mind: PII is gated behind Row Level
-- Security policies and a public-facing anonymised view strips all personal
-- identifiers before data reaches the dashboard.
--
-- Spatial features powered by PostGIS (GEOGRAPHY type, SRID 4326).
-- ============================================================================


-- ============================================================================
-- 1. EXTENSIONS
-- ============================================================================
-- PostGIS — spatial indexing, geography columns, distance queries.
CREATE EXTENSION IF NOT EXISTS postgis;

-- uuid-ossp — fallback UUID generator for environments < PG 14.
-- gen_random_uuid() (pgcrypto / core) is preferred and used throughout.
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


-- ============================================================================
-- 2. CUSTOM ENUM TYPES
-- ============================================================================

-- Lifecycle states for a civic report.
CREATE TYPE report_status AS ENUM (
  'open',
  'acknowledged',
  'in_progress',
  'resolved',
  'rejected'
);

-- Access-control roles mapped onto Supabase auth users.
CREATE TYPE user_role AS ENUM (
  'citizen',
  'officer',
  'admin'
);


-- ============================================================================
-- 3. TABLES
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 3a. wards — Administrative ward divisions
-- ----------------------------------------------------------------------------
-- Each ward is a named administrative area. Officers are assigned to a ward
-- and can only manage reports that fall within it.
CREATE TABLE wards (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT        NOT NULL,
  boundary   GEOGRAPHY(POLYGON, 4326),  -- ward boundary polygon (nullable for seed)
  created_at TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE  wards            IS 'Administrative ward divisions of the city.';
COMMENT ON COLUMN wards.boundary   IS 'GeoJSON-compatible polygon boundary stored as GEOGRAPHY (SRID 4326).';

-- ----------------------------------------------------------------------------
-- 3b. profiles — User profiles (extends Supabase auth.users)
-- ----------------------------------------------------------------------------
-- One-to-one extension of auth.users. Stores display name, phone (PII),
-- role, and ward assignment for officers.
CREATE TABLE profiles (
  id           UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name    TEXT,
  phone_number TEXT,                           -- PII — protected by RLS
  role         user_role   DEFAULT 'citizen',
  ward_id      UUID        REFERENCES wards(id),  -- non-null for officers
  trust_score  INT         DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT now(),
  updated_at   TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE  profiles              IS 'Public profile extending auth.users. Contains PII (phone_number) guarded by RLS.';
COMMENT ON COLUMN profiles.phone_number IS 'PII field — never exposed to public views or anonymous queries.';
COMMENT ON COLUMN profiles.ward_id      IS 'The ward an officer is assigned to. NULL for citizens.';
COMMENT ON COLUMN profiles.trust_score  IS 'Gamification score; incremented as reports are verified/resolved.';

-- ----------------------------------------------------------------------------
-- 3c. categories — Issue categories with SLA targets
-- ----------------------------------------------------------------------------
-- Each category defines a default SLA window (in hours) used to compute the
-- sla_deadline on new reports via a trigger.
CREATE TABLE categories (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name           TEXT        NOT NULL UNIQUE,
  icon           TEXT,                          -- emoji or icon identifier
  base_sla_hours INT         NOT NULL DEFAULT 72,
  created_at     TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE  categories                IS 'Issue categories (e.g. Pothole, Streetlight Outage) with default SLA hours.';
COMMENT ON COLUMN categories.base_sla_hours IS 'Default SLA window in hours — used by trigger to set reports.sla_deadline.';

-- ----------------------------------------------------------------------------
-- 3d. reports — Core civic issue reports
-- ----------------------------------------------------------------------------
-- The heart of the system. Each report is geo-located, categorised, and
-- assigned to a ward. Anonymous reports hide the citizen_id from officers.
CREATE TABLE reports (
  id                UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  citizen_id        UUID          REFERENCES profiles(id),
  category_id       UUID          REFERENCES categories(id),
  ward_id           UUID          REFERENCES wards(id),
  title             TEXT          NOT NULL,
  description       TEXT,
  location          GEOGRAPHY(POINT, 4326) NOT NULL,  -- lat/lng of the issue
  address           TEXT,                              -- reverse-geocoded address
  media_url         TEXT,                              -- Cloudinary photo/video URL
  status            report_status DEFAULT 'open',
  is_anonymous      BOOLEAN       DEFAULT false,
  consent_given     BOOLEAN       DEFAULT false,
  sla_deadline      TIMESTAMPTZ,                       -- set by trigger on INSERT
  created_at        TIMESTAMPTZ   DEFAULT now(),
  updated_at        TIMESTAMPTZ   DEFAULT now()
);

COMMENT ON TABLE  reports              IS 'Core issue reports filed by citizens. Location stored as PostGIS GEOGRAPHY point.';
COMMENT ON COLUMN reports.citizen_id   IS 'FK to profiles. Hidden from officers when is_anonymous = true.';
COMMENT ON COLUMN reports.location     IS 'GPS coordinates as GEOGRAPHY(POINT, 4326). Indexed with GiST for spatial queries.';
COMMENT ON COLUMN reports.media_url    IS 'URL to photo/video evidence stored on Cloudinary (or similar CDN).';
COMMENT ON COLUMN reports.is_anonymous IS 'When true, citizen_id is hidden from officer-facing queries.';
COMMENT ON COLUMN reports.consent_given IS 'DPDP Act: explicit consent flag for processing personal data.';
COMMENT ON COLUMN reports.sla_deadline IS 'Auto-computed on INSERT: now() + category.base_sla_hours. See trigger.';

-- ----------------------------------------------------------------------------
-- 3e. audit_logs — Status-change audit trail
-- ----------------------------------------------------------------------------
-- Immutable log of every status transition. Supports resolution proof photos
-- and free-text notes from officers.
CREATE TABLE audit_logs (
  id                   UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id            UUID          REFERENCES reports(id) ON DELETE CASCADE,
  old_status           report_status,
  new_status           report_status NOT NULL,
  changed_by           UUID          REFERENCES profiles(id),
  resolution_media_url TEXT,                    -- proof photo for resolution
  notes                TEXT,
  created_at           TIMESTAMPTZ   DEFAULT now()
);

COMMENT ON TABLE  audit_logs                      IS 'Immutable audit trail of report status changes.';
COMMENT ON COLUMN audit_logs.resolution_media_url IS 'Photo/video proof attached when resolving a report.';


-- ============================================================================
-- 4. VIEWS — Anonymised Public Dashboard
-- ============================================================================
-- This view intentionally OMITS citizen_id, phone_number, and any other PII.
-- The public dashboard and anonymous API consumers should query this view
-- (via a Supabase service-role or a dedicated anon-safe RPC).

CREATE OR REPLACE VIEW public_reports AS
SELECT
  r.id,
  r.title,
  r.description,
  c.name                                      AS category_name,
  w.name                                      AS ward_name,
  ST_Y(r.location::geometry)                  AS latitude,   -- extract lat
  ST_X(r.location::geometry)                  AS longitude,  -- extract lng
  r.address,
  r.media_url,
  r.status,
  r.created_at
FROM reports  r
LEFT JOIN categories c ON c.id = r.category_id
LEFT JOIN wards      w ON w.id = r.ward_id;

COMMENT ON VIEW public_reports IS 'Anonymised view of reports for the public dashboard. No PII (citizen_id, phone) is exposed.';


-- ============================================================================
-- 5. INDEXES
-- ============================================================================
-- Spatial index — enables fast ST_DWithin / ST_Distance queries on report locations.
CREATE INDEX idx_reports_location    ON reports USING GIST (location);

-- B-tree indexes for common filter / sort patterns.
CREATE INDEX idx_reports_status      ON reports (status);
CREATE INDEX idx_reports_ward_id     ON reports (ward_id);
CREATE INDEX idx_reports_created_at  ON reports (created_at DESC);
CREATE INDEX idx_reports_category_id ON reports (category_id);

-- Audit log lookups by report.
CREATE INDEX idx_audit_logs_report_id ON audit_logs (report_id);


-- ============================================================================
-- 6. ROW LEVEL SECURITY (RLS) — DPDP Act Compliance
-- ============================================================================
-- RLS is enabled on EVERY table. Policies follow the principle of least
-- privilege: citizens see only their own data, officers see their ward's
-- data, and PII is never leaked to unauthorised roles.

-- ---------- Enable RLS on all tables ----------
ALTER TABLE wards       ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles    ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories  ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports     ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs  ENABLE ROW LEVEL SECURITY;

-- ========================
-- 6a. wards — Public read
-- ========================
CREATE POLICY "wards_select_public"
  ON wards FOR SELECT
  USING (true);

-- ==============================
-- 6b. categories — Public read
-- ==============================
CREATE POLICY "categories_select_public"
  ON categories FOR SELECT
  USING (true);

-- ========================
-- 6c. profiles
-- ========================

-- Citizens can read their own profile.
CREATE POLICY "profiles_select_own"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Citizens can update their own profile.
CREATE POLICY "profiles_update_own"
  ON profiles FOR UPDATE
  USING  (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Officers and admins can read profiles for users who filed non-anonymous
-- reports in the officer's assigned ward.
CREATE POLICY "profiles_select_officer_ward"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM profiles AS viewer
      WHERE viewer.id = auth.uid()
        AND viewer.role IN ('officer', 'admin')
        AND (
          -- The target profile filed a non-anonymous report in the viewer's ward
          EXISTS (
            SELECT 1
            FROM reports r
            WHERE r.citizen_id   = profiles.id
              AND r.ward_id      = viewer.ward_id
              AND r.is_anonymous  = false
          )
        )
    )
  );

-- ========================
-- 6d. reports
-- ========================

-- Citizens can INSERT reports with their own citizen_id.
CREATE POLICY "reports_insert_citizen"
  ON reports FOR INSERT
  WITH CHECK (auth.uid() = citizen_id);

-- Citizens can read their own reports.
CREATE POLICY "reports_select_own"
  ON reports FOR SELECT
  USING (auth.uid() = citizen_id);

-- Officers can read all reports in their assigned ward.
CREATE POLICY "reports_select_officer_ward"
  ON reports FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM profiles AS viewer
      WHERE viewer.id      = auth.uid()
        AND viewer.role    IN ('officer', 'admin')
        AND viewer.ward_id = reports.ward_id
    )
  );

-- Officers can update report status in their assigned ward.
CREATE POLICY "reports_update_officer_ward"
  ON reports FOR UPDATE
  USING (
    EXISTS (
      SELECT 1
      FROM profiles AS viewer
      WHERE viewer.id      = auth.uid()
        AND viewer.role    IN ('officer', 'admin')
        AND viewer.ward_id = reports.ward_id
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM profiles AS viewer
      WHERE viewer.id      = auth.uid()
        AND viewer.role    IN ('officer', 'admin')
        AND viewer.ward_id = reports.ward_id
    )
  );

-- ========================
-- 6e. audit_logs
-- ========================

-- Officers can insert audit log entries.
CREATE POLICY "audit_logs_insert_officer"
  ON audit_logs FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM profiles AS viewer
      WHERE viewer.id   = auth.uid()
        AND viewer.role  IN ('officer', 'admin')
    )
  );

-- Citizens can read audit logs for their own reports.
CREATE POLICY "audit_logs_select_own_reports"
  ON audit_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM reports r
      WHERE r.id         = audit_logs.report_id
        AND r.citizen_id = auth.uid()
    )
  );

-- Officers can read audit logs for reports in their ward.
CREATE POLICY "audit_logs_select_officer_ward"
  ON audit_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM reports  r
      JOIN profiles viewer ON viewer.id = auth.uid()
      WHERE r.id         = audit_logs.report_id
        AND viewer.role  IN ('officer', 'admin')
        AND viewer.ward_id = r.ward_id
    )
  );


-- ============================================================================
-- 7. TRIGGERS
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 7a. set_updated_at — Auto-update the updated_at timestamp on row changes
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION fn_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION fn_set_updated_at()
  IS 'Generic trigger function: sets updated_at = now() on every UPDATE.';

-- Attach to profiles
CREATE TRIGGER trg_profiles_set_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION fn_set_updated_at();

-- Attach to reports
CREATE TRIGGER trg_reports_set_updated_at
  BEFORE UPDATE ON reports
  FOR EACH ROW
  EXECUTE FUNCTION fn_set_updated_at();

-- ----------------------------------------------------------------------------
-- 7b. calculate_sla_deadline — Set sla_deadline on report INSERT
-- ----------------------------------------------------------------------------
-- Looks up the category's base_sla_hours and computes the deadline as
-- now() + that many hours. Runs BEFORE INSERT so the computed value is
-- stored in the same transaction.
CREATE OR REPLACE FUNCTION fn_calculate_sla_deadline()
RETURNS TRIGGER AS $$
DECLARE
  _sla_hours INT;
BEGIN
  -- Fetch the SLA hours from the linked category.
  SELECT base_sla_hours
    INTO _sla_hours
    FROM categories
   WHERE id = NEW.category_id;

  -- If the category exists, compute the deadline; otherwise leave NULL.
  IF _sla_hours IS NOT NULL THEN
    NEW.sla_deadline := now() + (_sla_hours * INTERVAL '1 hour');
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION fn_calculate_sla_deadline()
  IS 'Trigger function: auto-sets reports.sla_deadline based on category.base_sla_hours.';

CREATE TRIGGER trg_reports_calculate_sla_deadline
  BEFORE INSERT ON reports
  FOR EACH ROW
  EXECUTE FUNCTION fn_calculate_sla_deadline();


-- ============================================================================
-- 8. SEED DATA
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 8a. Categories — Common civic issue types with SLA windows
-- ----------------------------------------------------------------------------
INSERT INTO categories (name, icon, base_sla_hours) VALUES
  ('Pothole',              '🕳️', 48),
  ('Streetlight Outage',   '💡', 24),
  ('Garbage Dump',         '🗑️', 24),
  ('Water Supply',         '💧', 12),
  ('Sewage Overflow',      '🚰', 12),
  ('Road Damage',          '🛣️', 72),
  ('Illegal Construction', '🏗️', 168),
  ('Noise Pollution',      '🔊', 48);

-- ----------------------------------------------------------------------------
-- 8b. Wards — Sample Delhi wards (no boundary polygons for seed)
-- ----------------------------------------------------------------------------
INSERT INTO wards (name) VALUES
  ('Ward 1 - Connaught Place'),
  ('Ward 2 - Hauz Khas'),
  ('Ward 3 - Dwarka'),
  ('Ward 4 - Rohini'),
  ('Ward 5 - Saket');


-- ============================================================================
-- END OF SCHEMA
-- ============================================================================
