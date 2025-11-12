// Some helper functions

import type { ReportCategory, ReportStatus } from '../types';

/**
 * Get the display label for a report category
 */
export const getCategoryLabel = (category: ReportCategory): string => {
  const labels: Record<ReportCategory, string> = {
    water_supply: 'Water Supply - Drinking Water',
    architectural_barriers: 'Architectural Barriers',
    sewer_system: 'Sewer System',
    public_lighting: 'Public Lighting',
    waste: 'Waste',
    road_signs_traffic_lights: 'Road Signs and Traffic Lights',
    roads_urban_furnishings: 'Roads and Urban Furnishings',
    public_green_areas_playgrounds: 'Public Green Areas and Playgrounds',
    other: 'Other',
  };
  return labels[category];
};

/**
 * Get the display label for a report status
 */
export const getStatusLabel = (status: ReportStatus): string => {
  const labels: Record<ReportStatus, string> = {
    pending_approval: 'Pending Approval',
    assigned: 'Assigned',
    in_progress: 'In Progress',
    suspended: 'Suspended',
    rejected: 'Rejected',
    resolved: 'Resolved',
  };
  return labels[status];
};

/**
 * Format a date to a readable string
 */
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

/**
 * Calculate distance between two coordinates (Haversine formula)
 */
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const toRad = (degrees: number): number => {
  return (degrees * Math.PI) / 180;
};
