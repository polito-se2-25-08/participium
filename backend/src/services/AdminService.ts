import { generateSalt, hashPassword } from "../utils/encryption";
import AppError from "../utils/AppError";
import { TablesInsert } from "../utils/DatabaseSchema";
import { userRepository } from "../repositories/userRepository";
import {
  upsertTechnicianCategories,
  deleteTechnicianCategories,
} from "../repositories/TechnicianRepository";
import crypto from "node:crypto";

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
      const length = crypto.randomInt(8, 13);
      const charset =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      const specialChars = "!@#$%^&*()_+[]{}|;:,.<>?";
      let password = "";

      // Ensure at least one lowercase, one uppercase, one number, and one special character
      password += "abcdefghijklmnopqrstuvwxyz"[crypto.randomInt(0, 26)];
      password += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[crypto.randomInt(0, 26)];
      password += "0123456789"[crypto.randomInt(0, 10)];
      password += specialChars[crypto.randomInt(0, specialChars.length)];

      // Fill the rest of the password length with random characters
      for (let i = password.length; i < length; i++) {
        const chars = charset + specialChars;
        password += chars[crypto.randomInt(0, chars.length)];
      }

      // Shuffle the password to ensure randomness (Fisher-Yates shuffle)
      const passwordArray = password.split("");
      for (let i = passwordArray.length - 1; i > 0; i--) {
        const j = crypto.randomInt(0, i + 1);
        [passwordArray[i], passwordArray[j]] = [
          passwordArray[j],
          passwordArray[i],
        ];
      }
      return passwordArray.join("");
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

  async assignTechnicianCategories(userId: number, categoryIds: number[]) {
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

    // Verify categories exist (basic validation)
    if (!categoryIds || !Array.isArray(categoryIds)) {
      throw new AppError("Category IDs must be provided as an array", 400);
    }

    const validIds = categoryIds.filter(
      (id) => typeof id === "number" && !Number.isNaN(id) && id > 0 && id <= 9
    );

    if (validIds.length === 0 && categoryIds.length > 0) {
      throw new AppError("No valid Category IDs provided", 400);
    }

    // Upsert mappings
    await upsertTechnicianCategories(userId, validIds);

    return { user_id: userId, category_ids: validIds };
  },

  async updateTechnicianCategories(userId: number, categoryIds: number[]) {
    // Verify user exists and is TECHNICIAN
    let user;
    try {
      user = await userRepository.findById(userId);
    } catch (err: any) {
      throw new AppError(`Failed to load user: ${err?.message ?? err}`, 500);
    }
    if (!user) throw new AppError("User not found", 404);
    if (user.role !== "TECHNICIAN")
      throw new AppError("User must have TECHNICIAN role", 400);

    // Verify categories array
    if (!categoryIds || !Array.isArray(categoryIds)) {
      throw new AppError("Category IDs must be provided as an array", 400);
    }

    const validIds = categoryIds.filter(
      (id) => typeof id === "number" && !isNaN(id) && id > 0 && id <= 9
    );

    // 1. Delete existing categories for this user (replace logic)
    await deleteTechnicianCategories(userId);

    // 2. Insert new categories if any
    if (validIds.length > 0) {
      await upsertTechnicianCategories(userId, validIds);
    }

    return { user_id: userId, category_ids: validIds };
  },

  async deleteUser(userId: number) {
    const user = await userRepository.findById(userId);
    if (!user) throw new AppError("User not found", 404);

    await userRepository.deleteUser(userId);
  },
};
