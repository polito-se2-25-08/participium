import { supabase } from "../utils/Supabase";
import AppError from "../utils/AppError";

export const getTechnicianCategories = async (
  // Renamed from getTechnicianCategory
  user_id: number
): Promise<number[]> => {
  // Returns array of categories => array of offices served
  const { data, error } = await supabase
    .from("Technician_Category")
    .select("category_id")
    .eq("user_id", user_id);

  if (error) {
    throw new AppError(
      `Failed to fetch technician categories: ${error.message}`,
      500,
      "DB_FETCH_ERROR"
    );
  }

  // Return array of IDs
  return (data || []).map((row) => row.category_id);
};

export const upsertTechnicianCategories = async (
  user_id: number,
  category_ids: number[]
): Promise<void> => {
  if (!category_ids || category_ids.length === 0) return;

  const rows = category_ids.map((category_id) => ({
    user_id,
    category_id,
  }));

  const { error } = await supabase.from("Technician_Category").upsert(rows);

  if (error) {
    throw new AppError(
      `Failed to upsert technician categories: ${error.message}`,
      500,
      "DB_UPSERT_ERROR"
    );
  }
};

export const deleteTechnicianCategories = async (
  user_id: number
): Promise<void> => {
  const { error } = await supabase
    .from("Technician_Category")
    .delete()
    .eq("user_id", user_id);

  if (error) {
    throw new AppError(
      `Failed to delete technician categories: ${error.message}`,
      500,
      "DB_DELETE_ERROR"
    );
  }
};
