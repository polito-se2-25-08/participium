import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { User } from "../../interfaces/dto/user/User";

interface AuthContextType {
	user: User | null;
	token: string | null;
	loading: boolean;
	isAuthenticated: boolean;
	updateUser: (user: User) => void;
	logout: () => void;
	login: (user: User, token: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [token, setToken] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	useEffect(() => {
		setLoading(true);
		try {
			const token = localStorage.getItem("token");
			const user = localStorage.getItem("user");
			if (token && user) {
				setUser(JSON.parse(user));
				setToken(token);
				setIsAuthenticated(true);
			} else {
				setUser(null);
				setToken(null);
				setIsAuthenticated(false);
			}
		} catch {
			setUser(null);
			setToken(null);
			setIsAuthenticated(false);
		}
		setLoading(false);
	}, []);

	async function login(user: User, token: string) {
		try {
			localStorage.setItem("token", token);
			localStorage.setItem("user", JSON.stringify(user));
			setUser(user);
			setToken(token);
			setIsAuthenticated(true);
		} catch {
			setUser(null);
			setToken(null);
			setIsAuthenticated(false);
		}
	}

	function logout() {
		try {
			localStorage.removeItem("token");
			localStorage.removeItem("user");
			setUser(null);
			setToken(null);
			setIsAuthenticated(false);
		} catch {
			setUser(null);
			setToken(null);
			setIsAuthenticated(false);
		}
	}

	const updateUser = (user: User) => {
		setUser(user);
		localStorage.removeItem("user");
		localStorage.setItem("user", JSON.stringify(user));
	};

	const value = {
		user,
		token,
		updateUser,
		loading,
		isAuthenticated,
		login,
		logout,
	};

	return (
		<AuthContext.Provider value={value}>{children}</AuthContext.Provider>
	);
}

export function useAuth() {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error("useAuth must be used within AuthProvider");
	return ctx;
}

export function useUser() {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error("useUser must be used within AuthProvider");
	if (!ctx.user) throw new Error("User not found");
	return { user: ctx.user, updateUser: ctx.updateUser };
}
