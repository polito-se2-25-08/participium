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
  photos: string[];
  assignedExternalOfficeId: number | null;
}

export interface CommentDTO {
  id: number;
  reportId: number;
  userId: number;
  user: {
    name: string;
    surname: string;
    role: string;
    profile_picture?: string;
  };
  content: string;
  createdAt: string;
}
