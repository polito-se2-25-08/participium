import { generateSalt, hashPassword } from "../utils/encryption";
import AppError from "../utils/AppError";
import { TablesInsert } from "../utils/DatabaseSchema";
import { userRepository } from "../repositories/userRepository";
import { upsertTechnicianCategory } from "../repositories/TechnicianRepository";

export const adminService = {
  async createUser(data: {
    email: string;
    username: string;
    role: string;
    name: string;
    surname: string;
  }) {
    const existing = await userRepository.findByUsername(data.username);
    if (existing) throw new AppError("Username taken", 400);

    //generate pass, instead of having the admin set it for each account
    const generateRandomPassword = () => {
      const length = Math.floor(Math.random() * (12 - 8 + 1)) + 8;
      const charset =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      const specialChars = "!@#$%^&*()_+[]{}|;:,.<>?";
      let password = "";

      // Ensure at least one lowercase, one uppercase, one number, and one special character
      password += "abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 26)];
      password += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(Math.random() * 26)];
      password += "0123456789"[Math.floor(Math.random() * 10)];
      password += specialChars[Math.floor(Math.random() * specialChars.length)];

      // Fill the rest of the password length with random characters
      for (let i = password.length; i < length; i++) {
        const chars = charset + specialChars;
        password += chars[Math.floor(Math.random() * chars.length)];
      }

      // Shuffle the password to ensure randomness
      password = password
        .split("")
        .sort(() => Math.random() - 0.5)
        .join("");
      return password;
    };

    const password = generateRandomPassword();

    const salt = generateSalt();
    const hashedPassword = hashPassword(password, salt);

    const newUser: TablesInsert<"User"> = {
      email: data.email,
      username: data.username,
      password: hashedPassword,
      salt,
      name: data.name,
      surname: data.surname,
      role: data.role,
      profile_picture: null,
      email_notification: false,
    };
    const createdUser = await userRepository.createUser(newUser);

    //give the password to the frontend so that the admin can receive the credentials
    createdUser.password = password;

    return createdUser;
  },

  async assignTechnicianCategory(userId: number, categoryId: number) {
    // Verify user exists and is TECHNICIAN using repository
    let user;
    try {
      user = await userRepository.findById(userId);
    } catch (err: any) {
      throw new AppError(`Failed to load user: ${err?.message ?? err}`, 500);
    }
    if (!user) throw new AppError("User not found", 404);
    if (user.role !== "TECHNICIAN")
      throw new AppError("User must have TECHNICIAN role", 400);

    // Verify category exists
    if (categoryId === null || categoryId === undefined) {
      throw new AppError("Category ID must be provided", 400);
    }
    if (
      typeof categoryId !== "number" ||
      isNaN(categoryId) ||
      categoryId <= 0 ||
      categoryId > 9
    ) {
      throw new AppError("Invalid Category ID", 400);
    }

    /*     
    const { data: category, error: catErr } = await supabase
      .from("Category")
      .select("id")
      .eq("id", categoryId)
      .maybeSingle();
    if (catErr) throw new AppError(`Failed to load category: ${catErr.message}`, 500);
    if (!category) throw new AppError("Category not found", 404);
 */
    // Upsert mapping
    await upsertTechnicianCategory(userId, categoryId);

    return { user_id: userId, category_id: categoryId };
  },
};
