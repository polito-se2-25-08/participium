
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
  | 'PENDING_APPROVAL'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'SUSPENDED'
  | 'REJECTED'
  | 'RESOLVED';

export interface User {
  id: number;
  username: string;
  email: string;
  name: string;
  surname: string;
  profile_picture?: string;
  //telegram_username?: string;
  email_notification: boolean;
  role: UserRole;
}

export interface Location {
  latitude: number;
  longitude: number;
}

export interface Report {
  id: number;
  title: string;
  description: string;
  category: ReportCategory;
  location: Location;
  photos: Report_Photo[];
  anonymous: boolean;
  user_id: number;
  status: ReportStatus;
  createdAt: Date;
  updatedAt: Date;
  rejection?: Rejection_Report;
  assignedOffice?: string;
}

export interface Category {
  id: number;
  category: ReportCategory;
}

export interface Report_Photo {
  id: number;
  report_photo: string;
  report_id: number;
}

export interface Rejection_Report {
  id: number;
  motivation: string;
}
