// src/api/userService.ts
const API_BASE = import.meta.env.VITE_API_ENDPOINT || "http://localhost:3000/api";

export interface RegisterData {
  email: string;
  username: string;
  password: string;
  name: string;
  surname: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export async function registerUser(data: RegisterData) {
  const res = await fetch(`${API_BASE}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Registration failed");
  }

  return res.json();
}

export async function loginUser(data: LoginData) {
  const res = await fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Login failed");
  }

  const result = await res.json();
  localStorage.setItem("token", result.token);
  return result;
}

export async function getProfile() {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found. Please log in.");

  const res = await fetch(`http://localhost:3000/api/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Unauthorized");
  return res.json();
}
