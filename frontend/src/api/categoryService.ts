import type { ApiResponse } from "../interfaces/dto/Response";

const API_BASE =
  import.meta.env.VITE_API_ENDPOINT || "http://localhost:3000/api/v1";

export const categoryService = {
  async getAllCategories(): Promise<
    ApiResponse<{ id: number; category: string }[]>
  > {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/categories`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      const result: ApiResponse<{ id: number; category: string }[]> =
        await response.json();
      return result;
    } catch (error) {
      console.error("Error fetching categories:", error);
      const message =
        error instanceof Error ? error.message : "Cannot reach server";
      return { success: false, data: { message } } as any;
    }
  },
};
