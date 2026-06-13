import { MockUser } from "./types";

// ============================================================
// Mock Auth System — Prototype role switching
// For production, replace with Supabase Auth (phone OTP)
// ============================================================

export const MOCK_USERS: Record<string, MockUser> = {
  citizen: {
    id: "00000000-0000-0000-0000-000000000001",
    full_name: "Priya Sharma",
    role: "citizen",
    ward_id: null,
  },
  officer: {
    id: "00000000-0000-0000-0000-000000000002",
    full_name: "Rajesh Kumar",
    role: "officer",
    ward_id: null, // Will be set to first ward on load
  },
  admin: {
    id: "00000000-0000-0000-0000-000000000003",
    full_name: "Admin User",
    role: "admin",
    ward_id: null,
  },
};

const STORAGE_KEY = "civic-tracker-mock-role";

export function getCurrentRole(): string {
  if (typeof window === "undefined") return "citizen";
  return localStorage.getItem(STORAGE_KEY) || "citizen";
}

export function setCurrentRole(role: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, role);
  window.dispatchEvent(new Event("role-changed"));
}

export function getCurrentUser(): MockUser {
  const role = getCurrentRole();
  return MOCK_USERS[role] || MOCK_USERS.citizen;
}
