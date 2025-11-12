import { supabase } from "../utils/Supabase";
import type { Tables, TablesInsert } from "../utils/DatabaseSchema";

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
    if (error) throw error;
    return data!;
  },
};
