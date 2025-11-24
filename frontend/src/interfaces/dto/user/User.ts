export interface User {
	id: string;
	name: string;
	surname: string;
	username: string;
	email: string;
	role: "CITIZEN" | "ADMIN" | "OFFICER" | "TECHNICIAN";
}
