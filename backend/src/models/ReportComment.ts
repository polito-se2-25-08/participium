export interface ReportComment {
  id: number;
  report_id: number;
  sender_id: number;
  message: string;
  created_at: string;
  sender?: {
    id: number;
    name: string;
    surname: string;
    role: string;
    profile_picture?: string | null;
  };
}

export interface ReportCommentInsert {
  report_id: number;
  sender_id: number;
  message: string;
}
