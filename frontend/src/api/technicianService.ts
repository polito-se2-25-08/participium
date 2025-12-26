import type { ApiResponse } from "../interfaces/dto/Response";

const API_BASE =
  import.meta.env.VITE_API_ENDPOINT || "http://localhost:3000/api/v1";

export const technicianService = {
  async getTechnicianCategories(): Promise<ApiResponse<number[]>> {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/technician/categories`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      const result: ApiResponse<number[]> = await response.json();
      return result;
    } catch (error) {
      console.error("Error fetching technician categories:", error);
      const message =
        error instanceof Error ? error.message : "Cannot reach server";
      return { success: false, data: { message } } as any;
    }
  },
};
