import { supabase } from "../utils/Supabase";
import type { Database, Tables, TablesInsert } from "../utils/DatabaseSchema";

export type UserRow = Tables<"User">;
export type UpdateUserRow = Partial<UserRow>;

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

  async updateUser(userId: number, updates: Partial<any>): Promise<any> {
    const { data, error } = await supabase
      .from("User")
      .update(updates)
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteUser(userId: number): Promise<void> {
    const { error } = await supabase.from("User").delete().eq("id", userId);
    if (error) throw error;
  },
};
