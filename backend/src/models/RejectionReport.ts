import { Database } from "../utils/DatabaseSchema";

export type RejectionReport =
	Database["public"]["Tables"]["Rejection_Report"]["Row"];
export type RejectionReportInsert =
	Database["public"]["Tables"]["Rejection_Report"]["Insert"];
export type RejectionReportUpdate =
	Database["public"]["Tables"]["Rejection_Report"]["Update"];
