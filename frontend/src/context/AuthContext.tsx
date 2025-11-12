import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { loginUser } from "../api/userService";

interface User {
	id: string;
	username: string;
	email: string;
	role: string;
}

interface AuthContextType {
	user: User | null;
	token: string | null;
	loading: boolean;
	isAuthenticated: boolean;
	login: (username: string, password: string) => Promise<void>;
	logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [token, setToken] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	useEffect(() => {
		const storedUser = localStorage.getItem("user");
		const storedToken = localStorage.getItem("token");
		if (storedUser && storedToken) {
			console.log("Stored user:", storedUser);
			setUser(JSON.parse(storedUser));
			setToken(storedToken);
			setIsAuthenticated(true);
		}
		setLoading(false);
	}, []);

	async function login(username: string, password: string) {
		const result = await loginUser({ username, password });
		localStorage.setItem("token", result.token);
		localStorage.setItem("user", JSON.stringify(result.data));
		setUser(result.data);
		setToken(result.token);
		setIsAuthenticated(true);
	}

	function logout() {
		localStorage.removeItem("token");
		localStorage.removeItem("user");
		setUser(null);
		setToken(null);
		setIsAuthenticated(false);
	}

	return (
		<AuthContext.Provider
			value={{ user, token, loading, login, logout, isAuthenticated }}
		>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error("useAuth must be used within AuthProvider");
	return ctx;
}
