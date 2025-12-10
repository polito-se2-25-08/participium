import { supabase } from "../utils/Supabase";
import AppError from "../utils/AppError";

export const getTechnicianCategory = async (
  user_id: number
): Promise<number> => {
  const { data, error } = await supabase
    .from("Technician_Category")
    .select("category_id")
    .eq("user_id", user_id)
    .limit(1)
    .single();
  // if multiple categories per technician are allowed, this needs to be adjusted

  if (error) {
    throw new AppError(
      `Failed to fetch technician category: ${error.message}`,
      500,
      "DB_FETCH_ERROR"
    );
  }

  if (!data) {
    throw new AppError(
      `Technician with user_id ${user_id} not found`,
      404,
      "TECHNICIAN_NOT_FOUND"
    );
  }

  return data.category_id;
};

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

export const getExternalMaintainerCategory = async (
  user_id: number
): Promise<number> => {
  // External maintainers are linked via User_Company -> External_Company -> Category
  const { data, error } = await supabase
    .from("User_Company")
    .select(
      `
      company_id,
      External_Company!inner (
        category_id
      )
    `
    )
    .eq("user_id", user_id)
    .limit(1)
    .single();

  if (error) {
    throw new AppError(
      `Failed to fetch external maintainer category: ${error.message}`,
      500,
      "DB_FETCH_ERROR"
    );
  }

  if (!data || !data.External_Company) {
    throw new AppError(
      `External maintainer with user_id ${user_id} not found`,
      404,
      "EXTERNAL_MAINTAINER_NOT_FOUND"
    );
  }

  // Handle the case where External_Company might be an array or object
  const externalCompany = Array.isArray(data.External_Company)
    ? data.External_Company[0]
    : data.External_Company;

  if (!externalCompany?.category_id) {
    throw new AppError(
      `External maintainer with user_id ${user_id} has no category assigned`,
      404,
      "NO_CATEGORY_ASSIGNED"
    );
  }

  return externalCompany.category_id;
};

export const getExternalMaintainerCategory = async (
  user_id: number
): Promise<number> => {
  // External maintainers are linked via User_Company -> External_Company -> Category
  const { data, error } = await supabase
    .from("User_Company")
    .select(
      `
      company_id,
      External_Company!inner (
        category_id
      )
    `
    )
    .eq("user_id", user_id)
    .limit(1)
    .single();

  if (error) {
    throw new AppError(
      `Failed to fetch external maintainer category: ${error.message}`,
      500,
      "DB_FETCH_ERROR"
    );
  }

  if (!data || !data.External_Company) {
    throw new AppError(
      `External maintainer with user_id ${user_id} not found`,
      404,
      "EXTERNAL_MAINTAINER_NOT_FOUND"
    );
  }

  // Handle the case where External_Company might be an array or object
  const externalCompany = Array.isArray(data.External_Company)
    ? data.External_Company[0]
    : data.External_Company;

  if (!externalCompany?.category_id) {
    throw new AppError(
      `External maintainer with user_id ${user_id} has no category assigned`,
      404,
      "NO_CATEGORY_ASSIGNED"
    );
  }

  return externalCompany.category_id;
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

export const updateReportExternalAssignment = async (
  report_id: number,
  externalOfficeId: number | null
) => {
  const { error } = await supabase
    .from("Report")
    .update({ assignedExternalOfficeId: externalOfficeId })
    .eq("id", report_id);

  if (error) {
    throw new AppError(
      `Failed to update external assignment: ${error.message}`,
      500,
      "DB_UPDATE_ERROR"
    );
  }
};
