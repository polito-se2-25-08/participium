
export type UserRole =
  | 'citizen'
  | 'admin'
  | 'officer'
  | 'technician';

export type ReportCategory =
  | 'water_supply'
  | 'architectural_barriers'
  | 'sewer_system'
  | 'public_lighting'
  | 'waste'
  | 'road_signs_traffic_lights'
  | 'roads_urban_furnishings'
  | 'public_green_areas_playgrounds'
  | 'other';

export type ReportStatus =
  | 'pending_approval'
  | 'assigned'
  | 'in_progress'
  | 'suspended'
  | 'rejected'
  | 'resolved';

export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  surname: string;
  profile_picture?: string;
  //telegramUsername?: string;
  email_notifications: boolean;
  role: UserRole;
}

export interface Location {
  latitude: number;
  longitude: number;
}

export interface Report {
  id: string;
  title: string;
  description: string;
  category: ReportCategory;
  location: Location;
  photos: string[]; // base 64 codes to photos (min 1, max 3)
  anonymous: boolean;
  user_id: string;
  user_name?: string; // Maybe can be deleted later
  status: ReportStatus;
  createdAt: Date;
  updatedAt: Date;
  rejectionReason?: string;
  assignedOffice?: string;
}
