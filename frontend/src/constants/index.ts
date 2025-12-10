// Constants for the application

export const REPORT_CATEGORIES = [
  { value: "water_supply", label: "Water Supply - Drinking Water" },
  { value: "architectural_barriers", label: "Architectural Barriers" },
  { value: "sewer_system", label: "Sewer System" },
  { value: "public_lighting", label: "Public Lighting" },
  { value: "waste", label: "Waste" },
  {
    value: "road_signs_traffic_lights",
    label: "Road Signs and Traffic Lights",
  },
  { value: "roads_urban_furnishings", label: "Roads and Urban Furnishings" },
  {
    value: "public_green_areas_playgrounds",
    label: "Public Green Areas and Playgrounds",
  },
  { value: "other", label: "Other" },
];

export const CATEGORY_NAME_TO_ID: Record<string, number> = {
  "Water Supply – Drinking Water": 1,
  "Architectural Barriers": 2,
  "Sewer System": 3,
  "Public Lighting": 4,
  "Waste": 5,
  "Road Signs and Traffic Lights": 6,
  "Roads and Urban Furnishings": 7,
  "Public Green Areas and Playgrounds": 8,
  "Other": 9,
};



export const REPORT_STATUSES = [
  { value: "pending_approval", label: "Pending Approval" },
  { value: "assigned", label: "Assigned" },
  { value: "in_progress", label: "In Progress" },
  { value: "suspended", label: "Suspended" },
  { value: "rejected", label: "Rejected" },
  { value: "resolved", label: "Resolved" },
] as const;

export const MAX_PHOTOS_PER_REPORT = 3;
export const MIN_PHOTOS_PER_REPORT = 1;

export const DEFAULT_MAP_ZOOM = 13;
