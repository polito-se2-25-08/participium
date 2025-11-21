export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface CreateReportDTO {
  title: string;
  description: string;
  category: string;
  latitude: number;
  longitude: number;
  address: string;
  anonymous: boolean;
  user_id: number;
}
