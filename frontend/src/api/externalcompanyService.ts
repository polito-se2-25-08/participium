const API_BASE =
  import.meta.env.VITE_API_ENDPOINT || "http://localhost:3000/api/v1";

export const externalCompanyService = {
  async getCompaniesByCategory(categoryId: string | number) {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_BASE}/external-company/category/${categoryId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    return res.json();
  },

  // 🔥 NEW: Fetch ALL external companies
  async getAllCompanies() {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_BASE}/external-company`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    return res.json();
  },

  /**
   * Assign or unassign an external office.
   */
  async assignExternalOffice(
    reportId: number,
    assignedExternalOfficeId: number | null
  ) {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_BASE}/technician/reports/${reportId}/external`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({ assignedExternalOfficeId }),
    });

    return res.json();
  },
};
