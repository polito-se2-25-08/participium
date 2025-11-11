import { Database } from "../utils/DatabaseSchema";

export type Report = Database["public"]["Tables"]["Report"]["Row"];
export type ReportInsert = Database["public"]["Tables"]["Report"]["Insert"];
export type ReportUpdate = Database["public"]["Tables"]["Report"]["Update"];
