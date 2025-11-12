export interface UpdateReportStatusDTO {
  id: number;
  status:
    | "PENDING_APPROVAL"
    | "ASSIGNED"
    | "IN_PROGRESS"
    | "SUSPENDED"
    | "REJECTED"
    | "RESOLVED"
    | null;
}
