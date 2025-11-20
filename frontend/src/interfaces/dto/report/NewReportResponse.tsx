export interface NewReportResponse {
  id: number;
  title: string;
  description: string;
  category: string;
  address: string;
  anonymous: boolean;
  latitude: number;
  longitude: number;
  photos: string[];
}
