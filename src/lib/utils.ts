import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a date string to a human-readable relative or absolute format
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  if (diffHours < 1) {
    const diffMins = Math.floor(diffMs / (1000 * 60));
    return `${diffMins}m ago`;
  }
  if (diffHours < 24) {
    return `${Math.floor(diffHours)}h ago`;
  }
  if (diffHours < 48) {
    return "Yesterday";
  }
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

/**
 * Get status color classes for a report status
 */
export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    open: "bg-red-500/20 text-red-400 border-red-500/30",
    acknowledged: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    in_progress: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    resolved: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    rejected: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  };
  return colors[status] || colors.open;
}

/**
 * Get a human-readable label for a report status
 */
export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    open: "Open",
    acknowledged: "Acknowledged",
    in_progress: "In Progress",
    resolved: "Resolved",
    rejected: "Rejected",
  };
  return labels[status] || status;
}

/**
 * Calculate SLA urgency level
 */
export function getSlaUrgency(
  slaDeadline: string | null
): "safe" | "warning" | "critical" | "overdue" {
  if (!slaDeadline) return "safe";
  const deadline = new Date(slaDeadline);
  const now = new Date();
  const hoursLeft = (deadline.getTime() - now.getTime()) / (1000 * 60 * 60);

  if (hoursLeft <= 0) return "overdue";
  if (hoursLeft <= 6) return "critical";
  if (hoursLeft <= 24) return "warning";
  return "safe";
}
