import { supabase } from "../utils/Supabase";
import type { Tables, TablesInsert } from "../utils/DatabaseSchema";
import type { DbRole } from "../utils/roleMapper";

type UserRow = Tables<"User">;

export const userRepository = {
	async findByUsername(username: string): Promise<UserRow | null> {
		console.log("Searching for username:", username);

		const { data, error } = await supabase
			.from("User")
			.select("*")
			.eq("username", username)
			.maybeSingle();

		console.log({ data, error });

		if (error) throw error;
		return data;
	},

	async findById(userId: number): Promise<UserRow | null> {
		const { data, error } = await supabase
			.from("User")
			.select("*")
			.eq("id", userId)
			.maybeSingle();

		if (error) throw error;
		return data;
	},

	async createUser(userData: TablesInsert<"User">): Promise<UserRow> {
		const { data, error } = await supabase
			.from("User")
			.insert(userData)
			.select()
			.single();

		if (error) throw error;
		return data;
	},

	async getAllUsers(): Promise<UserRow[]> {
		const { data, error } = await supabase.from("User").select("*");
		console.log(data);
		if (error) throw error;
		return data!;
	},

	async updateUserRole(userId: number, role: DbRole): Promise<UserRow> {
		const { data, error } = await supabase
			.from("User")
			.update({ role })
			.eq("id", userId)
			.select()
			.single();

		if (error) throw error;
		return data;
	},
};
