export interface ReportMessage {
  id: number;
  report_id: number;
  sender_id: number;
  message: string;
  created_at: string;
}

export interface ReportMessageInsert {
  report_id: number;
  sender_id: number;
  message: string;
}