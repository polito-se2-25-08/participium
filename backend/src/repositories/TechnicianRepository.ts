import { supabase } from "../utils/Supabase";
import AppError from "../utils/AppError";

export const getTechnicianCategory = async (
  user_id: number
): Promise<number> => {
  const { data, error } = await supabase
    .from("Technician_Category")
    .select("category_id")
    .eq("technician_id", user_id)
    .single();

  if (error) {
    throw new AppError(
      `Failed to fetch technician category: ${error.message}`,
      500,
      "DB_FETCH_ERROR"
    );
  }

  if (!data) {
    throw new AppError(
      `Technician with id ${user_id} not found`,
      404,
      "TECHNICIAN_NOT_FOUND"
    );
  }

  return data.category_id;
};
