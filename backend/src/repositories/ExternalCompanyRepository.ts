import { supabase } from "../utils/Supabase";
import AppError from "../utils/AppError";

export const externalCompanyRepository = {
  async getAllCompanies() {
    const { data, error } = await supabase.from("External_Company").select("*");
    if (error)
      throw new AppError(
        `Failed to fetch companies: ${error.message}`,
        500,
        "DB_FETCH_ERROR"
      );
    return data;
  },

  async getCompanyById(id: number) {
    const { data, error } = await supabase
      .from("External_Company")
      .select("*")
      .eq("id", id)
      .single();
    if (error)
      throw new AppError(
        `Company not found: ${error.message}`,
        404,
        "COMPANY_NOT_FOUND"
      );
    return data;
  },

  async getCompaniesByCategory(categoryId: number) {
    const { data, error } = await supabase
      .from("External_Company")
      .select("*")
      .eq("category_id", categoryId);
    if (error)
      throw new AppError(
        `Failed to fetch companies by category: ${error.message}`,
        500,
        "DB_FETCH_ERROR"
      );
    return data;
  },

  async assignExternalMaintainerCompany(
    user_id: number,
    company_id: number
  ): Promise<void> {
    const { error } = await supabase.from("User_Company").upsert({
      user_id,
      company_id,
    });

    if (error) {
      throw new AppError(
        `Failed to assign external maintainer to company: ${error.message}`,
        500,
        "DB_UPSERT_ERROR"
      );
    }
  },
};
