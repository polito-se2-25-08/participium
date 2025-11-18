import { Request, Response } from "express";
import { supabase } from "../utils/Supabase";

// Fetch categories from database
export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from("Category")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      return res.status(500).json({
        status: false,
        message: "Error fetching categories",
        error: error,
      });
    }

    return res.status(200).json({
      status: true,
      data: data,
    });
  } catch (error: any) {
    return res.status(500).json({
      status: false,
      message: "Unexpected error occurred",
      error: error.message,
    });
  }
};
