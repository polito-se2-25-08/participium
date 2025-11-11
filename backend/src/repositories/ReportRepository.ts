import { Report } from "../models/Report";
import { supabase } from "../utils/Supabase";

export const getAllReports = async (): Promise<Report[]> => {
	const { data, error } = await supabase.from("report").select("*");
	if (error) throw error;
	return data;
};
