const URI = import.meta.env.VITE_API_ENDPOINT || "http://localhost:3000/api/v1";
export async function CheckServer() {
  const response = await fetch(URI + "/health");
  if (response.ok) {
    console.log("Server is healthy");
    const data = await response.json();
    return data.status === "ok";
  } else {
    throw new Error("Server is not reachable");
  }
}

export async function setupUser(
  setupUser: any,
  token: string
): Promise<string> {
  const response = await fetch(URI + "/admin/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(setupUser),
  });

  if (response.ok) {
    const result = await response.json();
    return result.data.password;
  } else {
    const error = await response.json();
    throw new Error(error.message || "Server is not reachable");
  }
}

export async function setupTechnician(
  userData: any,
  token: string
): Promise<string> {
  const response = await fetch(URI + "/admin/register-technician", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  });

  if (response.ok) {
    const result = await response.json();
    return result.data.password;
  } else {
    const error = await response.json();
    throw new Error(
      error.message || "Server is not reachable or Technician setup failed"
    );
  }
}

export async function getAllUsers(token: string) {
  const response = await fetch(URI + "/admin/users", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.ok) {
    const result = await response.json();
    return result.data;
  } else {
    try {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch users");
    } catch (e) {
      throw new Error(
        `Server error: ${response.status} ${response.statusText}`
      );
    }
  }
}

export async function assignRole(userId: number, role: string, token: string) {
  const response = await fetch(URI + `/admin/users/${userId}/role`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ role }),
  });

  if (response.ok) {
    const result = await response.json();
    return result.data;
  } else {
    try {
      const error = await response.json();
      throw new Error(error.message || "Failed to assign role");
    } catch (e) {
      throw new Error(
        `Server error: ${response.status} ${response.statusText}`
      );
    }
  }
}

export async function deleteUser(userId: number, token: string) {
  const response = await fetch(URI + `/admin/users/${userId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.ok) {
    return true;
  } else {
    try {
      const error = await response.json();
      throw new Error(error.message || "Failed to delete user");
    } catch (e) {
      throw new Error(
        `Server error: ${response.status} ${response.statusText}`
      );
    }
  }
}

export async function getTechnicianCategories(userId: number, token: string) {
  const response = await fetch(
    URI + `/admin/technicians/${userId}/categories`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (response.ok) {
    const result = await response.json();
    return result.data; // Expecting number[]
  } else {
    throw new Error("Failed to fetch technician categories");
  }
}

export async function updateTechnicianCategories(
  userId: number,
  categoryIds: number[],
  token: string
) {
  const response = await fetch(
    URI + `/admin/technicians/${userId}/categories`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ category_ids: categoryIds }),
    }
  );

  if (response.ok) {
    const result = await response.json();
    return result.data;
  } else {
    const error = await response.json();
    throw new Error(error.message || "Failed to update categories");
  }
}
