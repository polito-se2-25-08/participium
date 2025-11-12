import { generateSalt, hashPassword, verifyPassword } from "../utils/encryption";
import { userRepository } from "../repositories/userRepository";
import AppError from "../utils/AppError";
import { TablesInsert } from "../utils/DatabaseSchema";
import { signToken } from "../utils/jwt";

export const userService = {
  async registerUser(data: {
    email: string;
    username: string;
    password: string;
    name: string;
    surname: string;
  }) {
    const existing = await userRepository.findByUsername(data.username);
    if (existing) throw new AppError("Username taken", 400);

    const salt = generateSalt();
    const hashedPassword = hashPassword(data.password, salt);

    const newUser: TablesInsert<"User"> = {
      email: data.email,
      username: data.username,
      password: hashedPassword,
      salt,
      name: data.name,
      surname: data.surname,
      role: "CITIZEN",
      profile_picture: null,
      email_notification: null,
    };

    const createdUser = await userRepository.createUser(newUser);
    return createdUser;
  },

  async loginUser(username: string, password: string) {
    
    const user = await userRepository.findByUsername(username);
    if (!user) throw new AppError("User doesn't exist", 401);

    const valid = verifyPassword(password, user.salt, user.password);
    if (!valid) throw new AppError("Invalid password", 401);

    // Generate JWT
    const token = signToken({ id: user.id, role: user.role });

    return { user, token };
  },

  async getAllUsers() {
  return await userRepository.getAllUsers();
}

};
