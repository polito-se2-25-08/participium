import type { User } from "../user/User";

export interface LoginReponse {
	token: string;
	user: User;
}
