export interface User {
	id: number;
	name: string;
	surname: string;
	username: string;
	email: string;
	emailNotification: boolean;
	telegramUsername: string;
	profilePicture: string;
	role: "CITIZEN" | "ADMIN" | "OFFICER" | "TECHNICIAN" | "EXTERNAL MAINTAINER";
	isVerified: boolean;
}
